#!/usr/bin/env python3
"""Generate per-segment narration (mp3) plus a word-level timeline.json with Edge TTS.

Input script JSON:
  {"voice": "en-US-AndrewNeural", "rate": "+0%",
   "segments": [{"id": "s1", "text": "Hello world."}]}
Optional per-segment overrides: "voice", "rate". Optional top-level "pitch", "volume".

Output (in --out-dir): <id>.mp3 for each segment and timeline.json:
  {"voice": ..., "segments": [{"id", "file", "duration_ms",
                               "words": [{"text", "start_ms", "end_ms"}]}]}

duration_ms is measured with ffprobe on the real mp3, not estimated.
Word units: English = whole words; Chinese = short phrases/words as segmented
by the service (usually 1-4 characters), not single characters.
Edge TTS is an unofficial client of Microsoft's online service: fine for
prototyping, check Microsoft's terms before commercial use.
Requires: pip install edge-tts, and ffprobe on PATH.
"""

import argparse
import asyncio
import json
import re
import subprocess
import sys
from pathlib import Path

TICKS_PER_MS = 10_000  # edge-tts offsets/durations are 100 ns ticks
SEGMENT_ID = re.compile(r"[A-Za-z0-9_-]+")  # ids become file names, so no paths


def system_dns_connector():
    """aiohttp connector using the OS resolver (threaded getaddrinfo).

    With aiodns installed, aiohttp uses c-ares, which fails with "Could not contact
    DNS servers" on some Windows setups (e.g. VPN adapters) although the OS resolves fine.
    """
    import aiohttp
    from aiohttp.resolver import ThreadedResolver

    return aiohttp.TCPConnector(resolver=ThreadedResolver())


def probe_duration_ms(path: Path) -> int:
    """Return the real duration of an audio file in ms via ffprobe."""
    out = subprocess.run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=nw=1:nk=1",
            str(path),
        ],
        capture_output=True,
        text=True,
        check=True,
    )
    return round(float(out.stdout.strip()) * 1000)


async def synth(seg: dict, defaults: dict, out_dir: Path) -> dict:
    """Synthesize one segment; collect WordBoundary events."""
    import edge_tts

    voice = seg.get("voice", defaults["voice"])
    rate = seg.get("rate", defaults["rate"])
    comm = edge_tts.Communicate(
        seg["text"],
        voice,
        rate=rate,
        pitch=defaults["pitch"],
        volume=defaults["volume"],
        boundary="WordBoundary",
        connector=system_dns_connector(),
    )
    mp3 = out_dir / f"{seg['id']}.mp3"
    words = []
    with open(mp3, "wb") as f:
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                start = round(chunk["offset"] / TICKS_PER_MS)
                words.append(
                    {
                        "text": chunk["text"],
                        "start_ms": start,
                        "end_ms": start + round(chunk["duration"] / TICKS_PER_MS),
                    }
                )
    return {
        "id": seg["id"],
        "file": mp3.name,
        "duration_ms": probe_duration_ms(mp3),
        "words": words,
    }


async def list_voices(locale: str | None) -> None:
    import edge_tts

    voices = await edge_tts.list_voices(connector=system_dns_connector())
    for v in sorted(voices, key=lambda x: x["ShortName"]):
        if locale and not v["Locale"].lower().startswith(locale.lower()):
            continue
        print(
            f"{v['ShortName']:<34} {v['Gender']:<7} {', '.join(v['VoiceTag'].get('VoicePersonalities', []))}"
        )


async def run(args: argparse.Namespace) -> int:
    script = json.loads(Path(args.script).read_text(encoding="utf-8"))
    defaults = {
        "voice": script.get("voice", "en-US-AndrewNeural"),
        "rate": script.get("rate", "+0%"),
        "pitch": script.get("pitch", "+0Hz"),
        "volume": script.get("volume", "+0%"),
    }
    ids = [str(seg.get("id", "")) for seg in script.get("segments", [])]
    bad = [i for i in ids if not SEGMENT_ID.fullmatch(i)]
    dupes = sorted({i for i in ids if ids.count(i) > 1})
    if not ids or bad or dupes:
        print(
            f"error: segment ids must be unique and match {SEGMENT_ID.pattern} "
            f"(invalid: {bad}, duplicated: {dupes})",
            file=sys.stderr,
        )
        return 2
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    results = []
    for seg in script["segments"]:
        res = None
        for attempt in range(3):  # the online service is occasionally flaky
            try:
                res = await synth(seg, defaults, out_dir)
                break
            except Exception as exc:  # network/service errors: retry, then fail loudly
                print(
                    f"[{seg['id']}] attempt {attempt + 1} failed: {exc}",
                    file=sys.stderr,
                )
                await asyncio.sleep(1.5)
        if res is None:
            return 1
        print(f"[{res['id']}] {res['duration_ms']} ms, {len(res['words'])} words")
        results.append(res)
    timeline = {"voice": defaults["voice"], "segments": results}
    (out_dir / "timeline.json").write_text(
        json.dumps(timeline, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"wrote {out_dir / 'timeline.json'}")
    return 0


def main() -> int:
    p = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    p.add_argument("script", nargs="?", help="input script JSON")
    p.add_argument(
        "--out-dir", default="audio", help="output directory (default: audio)"
    )
    p.add_argument(
        "--list-voices",
        nargs="?",
        const="",
        metavar="LOCALE",
        help="list voices, optionally filtered by locale prefix (e.g. zh-CN)",
    )
    args = p.parse_args()
    if args.list_voices is not None:
        asyncio.run(list_voices(args.list_voices or None))
        return 0
    if not args.script:
        p.error("script JSON is required unless --list-voices is used")
    return asyncio.run(run(args))


if __name__ == "__main__":
    sys.exit(main())
