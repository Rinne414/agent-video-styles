#!/usr/bin/env python3
"""Generate the dialogue audio from content.json.

Writes assets/audio/<line id>.mp3 and a merged assets/audio/timeline.json
(segments in dialogue order, with the speaker added to each segment).
tts.py handles one voice per script, so this runs it once per character.

Usage: python scripts/build_audio.py [--tts path/to/skill/scripts/tts.py]
"""

import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_TTS = ROOT.parent.parent / "skill" / "scripts" / "tts.py"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--tts", default=str(DEFAULT_TTS))
    args = ap.parse_args()

    content = json.loads((ROOT / "content.json").read_text(encoding="utf-8"))
    out_dir = ROOT / "assets" / "audio"
    out_dir.mkdir(parents=True, exist_ok=True)
    by_id = {}
    with tempfile.TemporaryDirectory() as tmp:
        for key, ch in content["characters"].items():
            segs = [
                {"id": l["id"], "text": l["tts"]}
                for l in content["lines"]
                if l["speaker"] == key
            ]
            script = Path(tmp) / f"script-{key}.json"
            script.write_text(
                json.dumps(
                    {"voice": ch["voice"], "rate": ch["rate"], "segments": segs}
                ),
                encoding="utf-8",
            )
            sub_dir = Path(tmp) / key
            subprocess.run(
                [sys.executable, args.tts, str(script), "--out-dir", str(sub_dir)],
                check=True,
            )
            timeline = json.loads(
                (sub_dir / "timeline.json").read_text(encoding="utf-8")
            )
            for seg in timeline["segments"]:
                (out_dir / seg["file"]).write_bytes(
                    (sub_dir / seg["file"]).read_bytes()
                )
                by_id[seg["id"]] = {**seg, "speaker": key}
    merged = {"segments": [by_id[l["id"]] for l in content["lines"]]}
    (out_dir / "timeline.json").write_text(
        json.dumps(merged, indent=1), encoding="utf-8"
    )
    total = sum(s["duration_ms"] for s in merged["segments"])
    print(f"dialogue audio: {total / 1000:.1f}s over {len(merged['segments'])} lines")


if __name__ == "__main__":
    main()
