# Manim Community Edition

Python library for programmatic math/explainer animation. License: MIT. Verified here: Manim CE 0.22.0, Windows 11, uv 0.11, Python 3.12, ffmpeg 8.1, MiKTeX 24.1 and 25.x (user install; both work).

## When to choose Manim

- Equations, graphs, geometry, algorithm and data-structure explainers, 3Blue1Brown-style transforms (`Transform`, `TransformMatchingTex`, `Create`, `Write`).
- Choose something else (Remotion, HyperFrames, HTML capture) for UI mockups, kinetic typography, product demos, or anything that needs CSS, web fonts, or video clips.
- Output is a plain MP4 (optionally transparent with `--transparent`, not tested here); no browser needed. Rendering is CPU-bound but fast: a 8.5 s 1080p30 scene rendered in about 11 s here.

## Setup with uv (one isolated project per template)

Use a uv project, not `uv tool install`: scenes import `manim`, and the lockfile pins the version.

```bash
uv init --bare --name my-scene --python 3.12     # then pin the interpreter
uv python pin 3.12                                # without it uv picked 3.14 here; 3.12 is the safe choice
uv add manim                                      # ~10 s, wheels for pycairo/manimpango on Windows
uv run manim --version                            # Manim Community v0.22.0
```

Set `PYTHONWARNINGS=ignore` to hide harmless `SyntaxWarning`s from `pydub` on every run.

### LaTeX (only needed for MathTex, Tex, axis numbers)

`MathTex`, `Tex`, `Axes(...).add_coordinates()` and `axis_config={"include_numbers": True}` all call `latex` + `dvisvgm`. `Text`, `MarkupText` and plain `Axes` do not.

- Windows: `winget install --id MiKTeX.MiKTeX --scope user --silent --accept-package-agreements --accept-source-agreements` (winget exits 20 if it is already installed). Then `initexmf --set-config-value "[MPM]AutoInstall=1"` so missing packages install without a GUI prompt. Binaries live in `%LOCALAPPDATA%\Programs\MiKTeX\miktex\bin\x64`, which may not be on PATH in a fresh shell: prepend it per session (PowerShell: `$env:Path = "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\x64;$env:Path"`). In Git Bash a backslash `$LOCALAPPDATA` does not work in PATH; convert it (verified): `export PATH="$(cygpath -u "$LOCALAPPDATA")/Programs/MiKTeX/miktex/bin/x64:$PATH"`. Missing PATH shows up as a cryptic `FileNotFoundError: [WinError 2]` from `subprocess`.
- macOS: `brew install --cask mactex-no-gui` (or `basictex`) [not run here].
- Linux: `sudo apt install texlive-latex-extra texlive-fonts-extra dvisvgm` [not run here].
- No LaTeX at all? Fall back to `Text("y = x²")` / `MarkupText` with Unicode math (`² ∫ π ∑ √ ≤ →`), and `Axes(axis_config={"include_numbers": False})` with `Text` labels placed by hand.

## Minimal scene and render commands

```python
# scene.py
from manim import *

class Demo(Scene):
    def construct(self):
        t = Text("Hello", font_size=56)
        self.play(Write(t))
        self.play(Transform(t, Square(color=ORANGE, fill_opacity=0.5)))
        axes = Axes(x_range=[-3, 3], y_range=[-1, 9], axis_config={"include_numbers": False})
        self.play(FadeOut(t), Create(axes), Create(axes.plot(lambda x: x**2, color=YELLOW)))
        self.wait()
```

| Goal | Command (run here) |
|------|--------------------|
| 1080p30 landscape | `uv run manim render scene.py Demo -r 1920,1080 --fps 30 --media_dir media` -> `media/videos/scene/1080p30/Demo.mp4` |
| 1080x1920 vertical | `uv run manim render scene.py Demo -r 1080,1920 --fps 30 -o Demo_v.mp4 --media_dir media` -> folder `1920p30` (named by the larger side!) |
| Fast draft | `-ql` (854x480 15 fps); `-qh` is 1080p **60** fps, so prefer `-r`/`--fps` explicitly |

`-r W,H` is width,height. For vertical, also build the layout for the frame: positions are in scene units (frame height 8, width 8*W/H), so use `config.frame_width`/`.to_edge()` rather than hard-coded x values.

## Narration audio and sync to timeline.json

`tts.py` (see `audio-tts-captions.md`) writes `audio/timeline.json` with a measured `duration_ms` per segment. Tested pattern: start each clip with `add_sound`, then make animations plus `wait()` fill exactly that segment.

```python
tl = json.loads(Path("audio/timeline.json").read_text(encoding="utf-8"))
for seg in tl["segments"]:
    self.add_sound(f"audio/{seg['file']}")          # starts at the current scene time
    self.play(FadeIn(caption), run_time=1.0)
    self.wait(seg["duration_ms"] / 1000 - 1.0)       # pad so the next clip starts after this one ends
```

Result here: 2 segments totalling 6.98 s of audio gave a 7.04 s MP4 with an AAC track (no mismatch). For word-level cues, use `words[i]["start_ms"]` and compute `wait` as the difference from `self.renderer.time * 1000`. Always make the sum of animation times at least the audio length, otherwise clips overlap. Manim re-encodes audio at 48 kHz stereo AAC.

Absolute cues and sentence captions (from a tested template; `self.renderer.time` is the scene clock). `tts.py` ignores extra keys, so a `content.json` with `segments[].id/text` can be its input directly:

```python
def until(self, t):                       # wait until absolute scene time t (seconds)
    d = t - self.renderer.time
    if d > 1 / 60: self.wait(d)

def build_schedule(self):                 # segment start = cumulative duration + GAP
    t = 0.0; self.seg = {}
    for s in TIMELINE["segments"]:
        self.seg[s["id"]] = dict(t0=t, file=s["file"], dur=s["duration_ms"] / 1000,
                                 words=[w["start_ms"] / 1000 for w in s["words"]])
        t += s["duration_ms"] / 1000 + GAP
def cue(self, sid, ms): return self.seg[sid]["t0"] + ms / 1000
# self.until(self.seg["s2"]["t0"]); self.add_sound(path); ...; self.until(self.cue("s2", 1000))

def add_caption(self, text, t0, t1):      # one updater per sentence; keep snippets short
    cap = Text(text, font_size=30).to_edge(DOWN); cap.set_opacity(0)
    cap.add_updater(lambda m: m.set_opacity(1 if t0 <= self.renderer.time < t1 else 0))
    self.add(cap)                          # t0/t1 = first word of this sentence / first word of the next (or segment end)
```
When narration is the master clock, "hold >= 1 s after each reveal" means "or until the end of the narration sentence".

Shapes that rotate and translate: `Transform` between them distorts (sectors, wedges). Rebuild the shape from the animation parameter instead:
```python
def f(m, alpha): m.become(make(a0 + (a1 - a0) * alpha, s0 + ds * alpha))   # make() returns the mobject for a pose
self.play(LaggedStart(*[UpdateFromAlphaFunc(w, f_k, rate_func=smooth) for ...], lag_ratio=0.1))
```
Bind loop variables as default args (`def f(m, alpha, a0=a0, ...)`).

`MathTex(...).set_color_by_tex("r")` matches substrings (it also colours `rac`). Match `tex_strings` exactly instead: `for part in eq: if part.tex_string == "r": part.set_color(GOLD)`. Colour a result by outlining or boxing it; keep each symbol's own colour.

Quick-look stills (`-s` renders only the last frame): draft render, then grab frames at segment starts:
```bash
uv run manim render scene.py Demo -r 1280,720 --fps 15 --media_dir media
ffmpeg -y -ss 12.4 -i media/videos/scene/<N>p15/Demo.mp4 -frames:v 1 f_s3.png     # <N> = folder named by the larger side; one call per segment start
```
`inspect_video.py` reports the longest still stretch; Manim holds after reveals register as still, which is expected. An end hold longer than 3 s after the narration needs `--tail-hold <seconds>`.

## Fonts and CJK

`Text(..., font="Microsoft YaHei")` rendered Simplified Chinese correctly on Windows (verified in a contact sheet). Cross-platform open-source option: `Noto Sans SC` (install it first; Manim silently falls back to a default font if the name is missing, so check a frame). `Text` uses Pango; the default font is a serif face, so set `font=` explicitly for a house style. `MathTex` is always LaTeX Computer Modern; CJK inside `MathTex` needs `xelatex` and a custom `TexTemplate` [not run here].

## Verify output

```bash
python skill/scripts/inspect_video.py media/videos/scene/1080p30/Demo.mp4 --out sheet.png
```

Look at `sheet.png`: text not clipped, nothing off-frame in vertical, equations rendered. Manim videos have dark backgrounds; `inspect_video.py` thresholds are tuned so they are not flagged as black.

## Pitfalls hit here

- Project paths with spaces work for rendering; media dir and `uv run` handled it fine.
- LaTeX not on PATH: `WinError 2` traceback (see above). First MathTex call can pause while MiKTeX auto-installs packages; later runs are cached (11 s total for a 4-animation MathTex scene).
- Output folder is named after the larger side (`1920p30` for 1080x1920), and `-o` renames only the file.
- Python 3.14 was auto-selected by uv when unpinned; pin 3.12.
- Run `uv run` from the project folder; a stray `typing.py`/`json.py` in the cwd breaks stdlib imports.

## Go deeper

- Docs: https://docs.manim.community/ (reference manager and example gallery)
- Agent skill with Manim best practices: https://github.com/adithya-s-k/manim_skill [not reviewed here]
- 3b1b's original (ManimGL) is a different library with a different API; do not mix examples.
