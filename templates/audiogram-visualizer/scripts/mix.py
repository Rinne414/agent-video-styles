"""Place the TTS segments on one timeline and write assets/audio/narration.wav.

Reads content.json (audio.introMs, gapMs, outroMs) and assets/audio/timeline.json.
Also writes assets/audio/layout.json with each segment's start offset in ms.
Usage: python scripts/mix.py
"""
import json
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parent.parent
content = json.loads((root / "content.json").read_text(encoding="utf-8"))
audio_dir = root / "assets" / "audio"
timeline = json.loads((audio_dir / "timeline.json").read_text(encoding="utf-8"))
cfg = content["audio"]

cursor = cfg["introMs"]
starts = []
for seg in timeline["segments"]:
    starts.append({"id": seg["id"], "start_ms": cursor})
    cursor += seg["duration_ms"] + cfg["gapMs"]
speech_end = cursor - cfg["gapMs"]
total_ms = speech_end + cfg["outroMs"]

inputs, filters = [], []
for i, (seg, st) in enumerate(zip(timeline["segments"], starts)):
    inputs += ["-i", str(audio_dir / seg["file"])]
    filters.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=mono,adelay={st['start_ms']}[a{i}]")
mix = "".join(f"[a{i}]" for i in range(len(starts)))
filters.append(f"{mix}amix=inputs={len(starts)}:normalize=0,apad=whole_dur={total_ms / 1000}[out]")
cmd = ["ffmpeg", "-y", "-v", "error", *inputs, "-filter_complex", ";".join(filters),
       "-map", "[out]", "-t", str(total_ms / 1000), "-ar", "48000", "-ac", "1", str(audio_dir / "narration.wav")]
subprocess.run(cmd, check=True)
(audio_dir / "layout.json").write_text(
    json.dumps({"segments": starts, "speech_end_ms": speech_end, "total_ms": total_ms}, indent=2), encoding="utf-8")
print(f"narration.wav {total_ms} ms, speech ends {speech_end} ms")
