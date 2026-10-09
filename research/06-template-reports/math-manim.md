# math-manim template report

## Result
- `templates/math-manim/out/math-manim.mp4`: 52.83 s, 1920x1080, 30 fps, h264 + AAC, 3.08 MB.
- Full 1080p30 render: 3 min 15 s. Full renders: 1 (plus one 720p15 draft, about 1m44s, used to view per-scene frames instead of stills).
- Preview: `previews/math-manim.mp4` (1.06 MB) and `.webp`.
- inspect_video warnings: audio 50.07 s vs video 52.83 s (intended 2.8 s final hold, circumscribe + hold); "frozen 36 s" is a false positive for slow math scenes (static frames between reveals).
- Leftover: `research/_tmp_mm/` (draft stills) could not be deleted (rm was denied); delete manually.

## Quality bar
- Each quantity keeps one color: PASS. r gold in header, brace label, every equation; A blue everywhere (sheet frames 24, 33, 41, 46 s). Caveat: final box is green around an equation that still has gold r.
- Every reveal followed by a wait (>= 1 s, key results >= 2 s): PASS for key results (final held about 2.8 s); PARTIAL elsewhere, because narration is the master clock and reveals sit back to back with speech (e.g. s6 label changes about 2 s apart, s7 header morphs about 1.6 s apart).
- Max 2 equations, no overlap: PASS (header + brace label; the "r" height label is a symbol). Brief transition ghosting of C/2 -> C = 2 pi r is mid-animation only. First draft had the brace label crowding captions; fixed by moving geometry up.
- Equations transform term by term: PASS (TransformMatchingTex in s6/s7); the hdr0 -> width x height step swaps terms by fade, not match.
- Math checks out: PASS (wedge interlock geometry derived: apex spacing c/2, alternate heights r cos(d/2); width n*c/2 -> pi r; 16-wedge row visibly a parallelogram).
- Text readable at 720p: PASS (captions 30 pt Inter; 720p draft frames legible; labels 48 pt).

## Skill gaps
1. `tools/manim.md` > LaTeX: PATH fix is given only for PowerShell. In Git Bash `$LOCALAPPDATA/...` with backslashes does not work; need `export PATH="/c/Users/<user>/AppData/Local/Programs/MiKTeX/miktex/bin/x64:$PATH"`. Add this line. Also version says MiKTeX 24.1; here 25.2 works.
2. `SKILL.md` step 6 / `manim.md`: no way to render "a still per scene" in Manim (`-s` gives only the last frame). Propose: document a quick-look recipe: render `-r 1280,720 --fps 15` draft, then `ffmpeg -ss T -frames:v 1` at segment starts; and say whether a draft counts toward render budget.
3. `manim.md` > Narration: shows only a linear `wait` pattern. Missing a ready helper for absolute cues (`until(t)` using `self.renderer.time`, schedule built from timeline.json plus gap) and for sentence captions from word timings (updater toggling opacity by `self.renderer.time`). I wrote both; propose adding them as a snippet. Also state that `tts.py` ignores extra keys so `content.json` can be the script directly (README says `script.json`).
4. `math-manim.md` > Quality bar vs Structure: no guidance on a morph for shapes that must rotate and translate (Transform of sectors distorts). Add the alpha-function pattern: `UpdateFromAlphaFunc` with `m.become(make(a0+(a1-a0)*alpha, ...))` inside `LaggedStart`.
5. `math-manim.md` > Quality bar "wait after every reveal >= 1 s" conflicts with narration as master clock; clarify "or the end of the narration sentence".
6. `math-manim.md` > Look: "Color is meaning" has no guidance for the green result color vs variable colors (A blue, r gold) in the final equation; add a rule (outline/box green, symbols keep their color). Also `MathTex` per-part coloring: `set_color_by_tex("r")` matches substrings like "\frac"; recommend iterating `tex_strings` with exact match.
7. `inspect_video.py` frozen-frame warning fires on legitimate Manim holds (36 s here); and audio/video mismatch fires on an intentional end hold. Propose a style-aware flag or a `--allow-tail` option.

## Tool issues and fixes
- Manim `WinError 2` from LaTeX not on PATH (Git Bash): fixed with POSIX-style PATH export.
- uv unpinned Python: pinned 3.12 as documented; manim pinned `==0.22.0`.
- Background permission-denied for a background shell job and `rm`; ran foreground instead (3m15s fit in the timeout).

## Honest self-assessment
It matches the style description structurally (dark #1C1C1C canvas, real LaTeX Computer Modern, colour-as-meaning, narration-synced reveals, geometry morph from circle to parallelogram to rectangle). A motion designer would criticise: wedge flight is a plain linear lerp with a lag (no arcs, a little chaotic mid-flight); the 16 -> 64 wedge step is a crossfade, not a continuous subdivision; the final rectangle loses the wedge texture, so the "limit" is abrupt; flat colors with no subtle glow or depth; no highlight linking the rectangle width to the original circumference (a stronger version would unroll the circle's arc); the header spoils the answer in the first seconds (a deliberate "?" device); the green box is a bit decorative. Timing sync is good (captions and reveals follow word timings, checked by contact sheet, not frame-exact measurement).
