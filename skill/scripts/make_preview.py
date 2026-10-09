#!/usr/bin/env python3
"""Compress a video for a web gallery and write a poster still.

Usage: make_preview.py <video> --out previews/<id>.mp4 --poster previews/<id>.webp
                       [--max-side 1280] [--crf 28] [--poster-at 0.5]

Output video: H.264 yuv420p, +faststart, AAC 96k when the input has audio, aspect
ratio kept, longest side capped at --max-side (never upscaled). The poster is a
WebP frame taken at --poster-at (fraction of the duration, 0-1).
Requires ffmpeg (with libx264 and libwebp) and ffprobe on PATH.
"""

import argparse
import json
import subprocess
import sys
from pathlib import Path


def run(cmd: list[str]) -> None:
    res = subprocess.run(
        cmd, capture_output=True, text=True, encoding="utf-8", errors="replace"
    )
    if res.returncode != 0:
        raise RuntimeError(f"{cmd[0]} failed:\n{res.stderr.strip()[-800:]}")


def probe(path: str) -> tuple[float, bool]:
    """Return (duration seconds, has_audio)."""
    res = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration:stream=codec_type",
            "-of",
            "json",
            path,
        ],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    if res.returncode != 0:
        raise RuntimeError(
            f"ffprobe could not read {path}: {res.stderr.strip()[-400:]}"
        )
    data = json.loads(res.stdout)
    has_audio = any(s.get("codec_type") == "audio" for s in data.get("streams", []))
    try:
        duration = float(data["format"]["duration"])
    except (KeyError, TypeError, ValueError):
        raise RuntimeError(
            f"{path} reports no duration; is it a finished video?"
        ) from None
    return duration, has_audio


def scale_filter(max_side: int) -> str:
    """Cap the longest side at max_side, keep aspect, force even dimensions."""
    return (
        f"scale='if(gte(iw,ih),min(iw,{max_side}),-2)':"
        f"'if(gte(iw,ih),-2,min(ih,{max_side}))',format=yuv420p"
    )


def main() -> int:
    ap = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    ap.add_argument("video")
    ap.add_argument("--out", required=True, help="output mp4 path")
    ap.add_argument("--poster", required=True, help="output webp poster path")
    ap.add_argument(
        "--max-side", type=int, default=1280, help="longest side in px (default 1280)"
    )
    ap.add_argument(
        "--crf", type=int, default=28, help="x264 CRF, higher = smaller (default 28)"
    )
    ap.add_argument(
        "--poster-at",
        type=float,
        default=0.5,
        help="poster position, fraction 0-1 (default 0.5)",
    )
    args = ap.parse_args()
    if not 0 <= args.poster_at <= 1:
        ap.error("--poster-at must be between 0 and 1")
    if Path(args.out).resolve() == Path(args.video).resolve():
        ap.error("--out must differ from the input video")
    try:
        duration, has_audio = probe(args.video)
        out, poster = Path(args.out), Path(args.poster)
        out.parent.mkdir(parents=True, exist_ok=True)
        poster.parent.mkdir(parents=True, exist_ok=True)
        audio = ["-c:a", "aac", "-b:a", "96k", "-ac", "2"] if has_audio else ["-an"]
        run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-i",
                args.video,
                "-vf",
                scale_filter(args.max_side),
                "-c:v",
                "libx264",
                "-preset",
                "slow",
                "-crf",
                str(args.crf),
                "-pix_fmt",
                "yuv420p",
                "-movflags",
                "+faststart",
                *audio,
                str(out),
            ]
        )
        # Seek on the source for the poster; clamp so the seek stays inside the file.
        at = min(duration * args.poster_at, max(duration - 0.05, 0))
        run(
            [
                "ffmpeg",
                "-y",
                "-hide_banner",
                "-loglevel",
                "error",
                "-ss",
                f"{at:.3f}",
                "-i",
                args.video,
                "-vf",
                scale_filter(args.max_side),
                "-frames:v",
                "1",
                "-c:v",
                "libwebp",
                "-quality",
                "80",
                str(poster),
            ]
        )
    except (RuntimeError, OSError, subprocess.CalledProcessError, KeyError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1
    src = Path(args.video).stat().st_size
    print(
        f"video:  {out}  {out.stat().st_size / 1e6:.2f} MB  (source {src / 1e6:.2f} MB)"
    )
    print(f"poster: {poster}  {poster.stat().st_size / 1e3:.1f} KB  at {at:.2f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
