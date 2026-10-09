# math-manim: area of a circle (Manim CE 0.22.0)

3Blue1Brown-style narrated explainer: cut a circle into wedges, rearrange into a parallelogram, then a rectangle of height r and width pi r.

- Setup: `uv sync`; LaTeX required (MiKTeX on Windows, see `skill/references/tools/manim.md`; put its `bin\x64` on PATH).
- Render: `pnpm run render` (or the `uv run manim ...` command in `package.json`) -> `out/math-manim.mp4`. Stills: `pnpm run still`.
- Edit: `content.json` (narration text, voice, colors, wedge counts, gap and hold). After editing narration run `python skill/scripts/tts.py content.json --out-dir assets/audio`. Cue times in `scene.py` are word indexes/ms for the sample script; re-check them if the wording changes.
- Files: `scene.py` (one scene, theme tokens at top), `assets/audio/` (generated TTS + timeline.json).
