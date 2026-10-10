#!/usr/bin/env python3
"""Inspect a rendered video: print a summary, build a contact sheet, flag problems.

Usage: inspect_video.py <video> [--frames 12] [--out sheet.png] [--expected-duration SEC]

Checks (each prints a WARN line):
  - duration shorter than --expected-duration (if given)
  - audio longer than the video by more than 0.3 s (narration cut off), or the video
    running past the audio by more than --tail-hold seconds (default 3; end-card holds are normal)
  - black frames (blackdetect: >= 99.99% near-black pixels, segments >= 0.5 s, covering >= 50% of the video;
    dark-background videos such as Manim are not flagged)
  - frozen/static video (freezedetect covering >= 90% of the video)
Exit code: 0 = ok, 1 = warnings found, 2 = could not read the file.
Requires ffmpeg and ffprobe on PATH. Python 3.10+, standard library only.
"""

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

AV_MISMATCH_S = 0.3
FONT_CANDIDATES = [
    "C:/Windows/Fonts/arial.ttf",
    "/System/Library/Fonts/Helvetica.ttc",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
]


def run(cmd: list[str]) -> subprocess.CompletedProcess:
    return subprocess.run(
        cmd, capture_output=True, text=True, encoding="utf-8", errors="replace"
    )


def probe(path: str) -> dict:
    res = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-count_packets",
            "-show_format",
            "-show_streams",
            "-of",
            "json",
            path,
        ]
    )
    if res.returncode != 0:
        raise RuntimeError(res.stderr.strip() or "ffprobe failed")
    return json.loads(res.stdout)


def num(value, default=0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def fps_of(stream: dict) -> float:
    n, _, d = stream.get("avg_frame_rate", "0/1").partition("/")
    return num(n) / num(d, 1.0) if num(d, 1.0) else 0.0


def summarize(info: dict) -> tuple[dict, dict | None, float]:
    streams = info["streams"]
    video = next((s for s in streams if s["codec_type"] == "video"), None)
    audio = next((s for s in streams if s["codec_type"] == "audio"), None)
    if video is None:
        raise RuntimeError("no video stream")
    fmt = info["format"]
    duration = num(fmt.get("duration"))
    frames = video.get("nb_frames") or video.get("nb_read_packets") or "?"
    print(f"file:       {fmt['filename']}")
    print(f"container:  {fmt['format_name']}  size={num(fmt.get('size')) / 1e6:.2f} MB")
    print(
        f"video:      {video['codec_name']} {video['width']}x{video['height']} "
        f"{fps_of(video):.2f} fps  pix_fmt={video.get('pix_fmt')}  frames={frames}"
    )
    print(
        f"duration:   {duration:.2f} s (video stream {num(video.get('duration'), duration):.2f} s)"
    )
    if audio:
        print(
            f"audio:      {audio['codec_name']} {audio.get('sample_rate')} Hz "
            f"{audio.get('channels')}ch  duration={num(audio.get('duration'), duration):.2f} s"
        )
    else:
        print("audio:      none")
    return video, audio, duration


def detect_problems(path: str, duration: float) -> tuple[float, float, float, float]:
    """Run blackdetect + freezedetect in one pass.

    Returns (black_s, freeze_s, longest_still_s, longest_still_start_s).
    """
    res = run(
        [
            "ffmpeg",
            "-hide_banner",
            "-nostats",
            "-i",
            path,
            "-an",
            "-vf",
            "blackdetect=d=0.5:pic_th=0.9999:pix_th=0.08,freezedetect=n=-60dB:d=1",
            "-f",
            "null",
            "-",
        ]
    )
    log = res.stderr
    black = sum(float(m) for m in re.findall(r"black_duration:([\d.]+)", log))
    starts = [float(x) for x in re.findall(r"freeze_start: ([\d.]+)", log)]
    durs = [float(x) for x in re.findall(r"freeze_duration: ([\d.]+)", log)]
    if len(starts) > len(durs):  # freeze still active at end of file
        durs.append(max(duration - starts[-1], 0.0))
    stretches = list(zip(starts, durs))
    longest_start, longest = max(stretches, key=lambda s: s[1], default=(0.0, 0.0))
    return black, sum(durs), longest, longest_start


def font_option() -> str:
    for cand in FONT_CANDIDATES:
        if Path(cand).exists():
            return "fontfile='" + cand.replace(":", "\\:") + "':"
    return ""


EDGE_BAND_PX = 8
EDGE_DARK = 6  # mean luma at or below this counts as black
EDGE_CONTRAST = 24  # the inner band must be at least this much brighter
EDGES = {  # name: (outer crop, inner crop)
    "right": (
        f"{EDGE_BAND_PX}:ih:iw-{EDGE_BAND_PX}:0",
        f"{EDGE_BAND_PX}:ih:iw-{2 * EDGE_BAND_PX}:0",
    ),
    "left": (f"{EDGE_BAND_PX}:ih:0:0", f"{EDGE_BAND_PX}:ih:{EDGE_BAND_PX}:0"),
    "bottom": (
        f"iw:{EDGE_BAND_PX}:0:ih-{EDGE_BAND_PX}",
        f"iw:{EDGE_BAND_PX}:0:ih-{2 * EDGE_BAND_PX}",
    ),
    "top": (f"iw:{EDGE_BAND_PX}:0:0", f"iw:{EDGE_BAND_PX}:0:{EDGE_BAND_PX}"),
}


def edge_stripes(path: str, duration: float, samples: int = 8) -> list[str]:
    """Find black bands along an edge that the neighbouring pixels do not share.

    Catches encoder padding bugs (e.g. a renderer that pads odd widths with black)
    that are invisible in thumbnails. Letterboxing is not flagged, because there
    the inner band is dark too.
    """
    crops = [c for pair in EDGES.values() for c in pair]
    labels = "".join(f"[s{i}]" for i in range(len(crops)))
    chains = ";".join(
        f"[s{i}]crop={c},scale=1:1:flags=area[o{i}]" for i, c in enumerate(crops)
    )
    outs = "".join(f"[o{i}]" for i in range(len(crops)))
    graph = (
        f"fps={samples}/{duration:.3f},split={len(crops)}{labels};{chains};"
        f"{outs}hstack=inputs={len(crops)},format=gray"
    )
    res = subprocess.run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            path,
            "-an",
            "-filter_complex",
            graph,
            "-f",
            "rawvideo",
            "-",
        ],
        capture_output=True,
    )
    data = res.stdout
    if res.returncode != 0 or not data:
        return []
    found = []
    width = len(crops)
    rows = [data[i : i + width] for i in range(0, len(data) - width + 1, width)]
    for k, name in enumerate(EDGES):
        hits = sum(
            1
            for r in rows
            if r[2 * k] <= EDGE_DARK and r[2 * k + 1] - r[2 * k] >= EDGE_CONTRAST
        )
        if hits >= 2:
            found.append(
                f"{name} edge: {EDGE_BAND_PX} px black band in {hits}/{len(rows)} sampled frames "
                "(renderer padding? HyperFrames pads widths not divisible by 16)"
            )
    return found


def build_sheet(path: str, duration: float, frames: int, out: str) -> bool:
    """Tile `frames` evenly spaced thumbnails, with timestamps when drawtext works."""
    cols = min(4, frames)
    rows = -(-frames // cols)
    step = duration / frames
    # select keeps source pts, so drawtext shows the true timestamp of each frame
    pick = f"select='gte(t,{step / 2:.4f}+{step:.4f}*selected_n)'"
    stamp = (
        "drawtext=" + font_option() + "text='%{pts\\:hms}':x=6:y=h-th-6:fontsize=18:"
        "fontcolor=white:box=1:boxcolor=black@0.6"
    )
    base = f"{pick},scale=320:-2"
    for chain in (f"{base},{stamp},tile={cols}x{rows}", f"{base},tile={cols}x{rows}"):
        res = run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                path,
                "-vf",
                chain,
                "-frames:v",
                "1",
                out,
            ]
        )
        if res.returncode == 0 and Path(out).exists():
            print(
                f"contact sheet: {out} ({frames} frames"
                + (
                    ""
                    if "drawtext" in chain
                    else ", no timestamps: drawtext unavailable"
                )
                + ")"
            )
            return True
    print(f"could not build contact sheet: {res.stderr.strip()[:300]}", file=sys.stderr)
    return False


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("video")
    ap.add_argument(
        "--frames",
        type=int,
        default=12,
        help="frames in the contact sheet (default 12)",
    )
    ap.add_argument(
        "--out", default="sheet.png", help="contact sheet path (default sheet.png)"
    )
    ap.add_argument(
        "--expected-duration", type=float, help="warn if the video is shorter (seconds)"
    )
    ap.add_argument(
        "--tail-hold",
        type=float,
        default=3.0,
        help="seconds the video may run past the audio, e.g. a held end card (default 3)",
    )
    args = ap.parse_args()
    try:
        video, audio, duration = summarize(probe(args.video))
    except (RuntimeError, OSError, KeyError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2
    warnings = []
    if args.expected_duration and duration < args.expected_duration - 0.1:
        warnings.append(
            f"duration {duration:.2f}s is shorter than expected {args.expected_duration:.2f}s"
        )
    if audio:
        overrun = num(audio.get("duration"), duration) - num(
            video.get("duration"), duration
        )
        if overrun > AV_MISMATCH_S:
            warnings.append(
                f"audio runs {overrun:.2f}s past the video: narration is cut off"
            )
        elif -overrun > args.tail_hold:
            warnings.append(
                f"video runs {-overrun:.2f}s past the audio (> --tail-hold {args.tail_hold}s)"
            )
    if duration <= 0:
        warnings.append(
            "the container reports no duration; checks and contact sheet skipped"
        )
    else:
        try:
            black, freeze, longest, longest_at = detect_problems(args.video, duration)
        except FileNotFoundError:
            print("error: ffmpeg not found on PATH", file=sys.stderr)
            return 2
        print(
            f"black: {black:.2f} s   still (no visible change): {freeze:.2f} s total, "
            f"longest {longest:.2f} s at {longest_at:.2f} s"
        )
        print(
            "note: compare the longest still stretch with the style's rules; "
            "slow drifts and deliberate holds can register as still"
        )
        if black >= 0.5 * duration:
            warnings.append(f"black frames cover {black:.1f}s of {duration:.1f}s")
        if freeze >= 0.9 * duration:
            warnings.append(
                f"video looks static: frozen for {freeze:.1f}s of {duration:.1f}s"
            )
        warnings.extend(edge_stripes(args.video, duration))
        Path(args.out).parent.mkdir(parents=True, exist_ok=True)
        if not build_sheet(args.video, duration, max(args.frames, 1), args.out):
            warnings.append(f"contact sheet was not written to {args.out}")
    for w in warnings:
        print(f"WARN: {w}")
    print("OK" if not warnings else f"{len(warnings)} warning(s)")
    return 1 if warnings else 0


if __name__ == "__main__":
    sys.exit(main())
