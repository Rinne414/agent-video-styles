#!/usr/bin/env python3
"""Synthesize the board "pon" SFX and a quiet looping-free chord pad with ffmpeg (no third-party audio)."""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAD_SECONDS = 56


def ffmpeg(*args: str) -> None:
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *args], check=True)


def main() -> None:
    sfx = ROOT / "assets" / "sfx"
    music = ROOT / "assets" / "music"
    sfx.mkdir(parents=True, exist_ok=True)
    music.mkdir(parents=True, exist_ok=True)
    ffmpeg(
        "-f", "lavfi", "-i", "sine=f=620:d=0.28:sample_rate=44100",
        "-af", "afade=t=in:d=0.004,afade=t=out:st=0.01:d=0.27,volume=0.9",
        str(sfx / "pon.wav"),
    )
    chord = ["sine=f=174.6", "sine=f=220", "sine=f=261.6", "sine=f=329.6"]
    inputs: list[str] = []
    for src in chord:
        inputs += ["-f", "lavfi", "-t", str(PAD_SECONDS), "-i", f"{src}:sample_rate=44100"]
    ffmpeg(
        *inputs,
        "-filter_complex",
        "amix=inputs=4:normalize=0,volume=0.35,tremolo=f=0.18:d=0.5,lowpass=f=900",
        "-ac", "1", "-b:a", "96k", str(music / "pad.mp3"),
    )
    print("wrote pon.wav and pad.mp3")


if __name__ == "__main__":
    main()
