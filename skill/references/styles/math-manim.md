# Math Explainer (Manim)

3Blue1Brown-style teaching animation: geometry and equations morph step by step on a dark canvas, paced for understanding rather than hype.

- **Primary tool**: Manim Community Edition (alt: Motion Canvas). See `../tools/manim.md`.
- **Format**: 1920x1080 30 fps (`-qh` is 1080p60; set `--fps 30` for smaller files) or 1080x1920; 60-300 s
- **Inputs to ask for**: the concept, audience level, the key result, any specific example values, length, voice, aspect ratio
- **Dependency**: `MathTex`/`Tex` need a LaTeX distribution (MiKTeX, TeX Live or MacTeX). Without LaTeX, use `Text`/`MarkupText` with Unicode math (x², √, π, ∑) for simple expressions and say so.

## Look

| Token | Value |
|---|---|
| Background | `#1C1C1C` (set `config.background_color`) |
| Primary | `#3B82F6` blue (classic Manim `BLUE` `#58C4DD` is fine; pick one) |
| Highlight | `#FBBF24` gold - the quantity currently being discussed |
| Result | `#22C55E` green - final answers |
| Text | `#F5F5F5` |
| Opacity layers | focus 1.0, context 0.4, axes and grids 0.15 |
| Math | `MathTex` (Computer Modern), `font_size` 44-56 at 1080p; max 2 equations on screen |
| Prose | `Text(..., font="Inter")` 28-36; CJK `Text(..., font="Noto Sans SC")` |
| Strokes | main shapes `stroke_width` 4, auxiliary lines 2 |
| Layout | one idea per screen; equation in the top third (`to_edge(UP, buff=0.6)`), geometry in the center; keep `buff >= 0.3` between mobjects |

Color is meaning: once `r` is gold, every `r` stays gold in every equation and shape (`set_color_by_tex` or `{{ }}` substrings). Result rule: the box or outline around a final answer is green; the symbols inside keep their own colors. `set_color_by_tex("r")` matches substrings such as `\frac`; color parts by exact match over `tex_strings`.

## Motion grammar

- **Reveal**: `Write(eq, run_time=1.5)`, `Create(shape, run_time=1.2)`, `FadeIn(mob, shift=UP*0.3)`.
- **Transform, don't replace**: `TransformMatchingTex(old, new, run_time=1.8)` (split terms with `{{ }}` so they match) or `TransformMatchingShapes`; default `rate_func=smooth`. Shapes that rotate and translate (sectors, wedges) distort under `Transform`; use `UpdateFromAlphaFunc` with `m.become(make(a0 + (a1 - a0) * alpha, ...))` inside `LaggedStart` (details in `../tools/manim.md`).
- **Emphasis**: `Indicate(term, color=GOLD)` or `Circumscribe(mob)`, run_time 1.
- **Pause**: `self.wait(1)` after every reveal, `self.wait(2)` after key results; when narrated, wait until the end of the narration sentence. Silence is part of the style.
- **Groups**: `LaggedStart(*anims, lag_ratio=0.15)`; never animate a whole group at once.
- **Parameters**: `ValueTracker` + `always_redraw` for sliders and moving points; sweeps take 3-4 s.
- **Camera**: `MovingCameraScene`, `self.camera.frame.animate.scale(0.6).move_to(target)` over 1.5 s for zooms.
- **Dimming**: `mob.animate.set_opacity(0.4)` to push context back when focus moves.

## Structure (120 s = 3600 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Question | 0-300 | The puzzle stated with one visual |
| Intuition | 300-1500 | Geometry or a concrete example builds the idea |
| Formalize | 1500-2700 | The equation emerges from the picture, colors linked to shapes |
| Payoff | 2700-3300 | The result, `Circumscribe` + green |
| Recap | 3300-3600 | One-line summary, held |

Manim works in seconds (`run_time`, `wait`); with narration, scene timing comes from the narration segments.

## Audio

Voiceover via `scripts/tts.py` into `timeline.json` (`{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`). Per segment: `self.add_sound(seg_file)`, play animations whose `run_time`s sum to less than `duration_ms / 1000`, then `self.wait(remaining)`; key reveals can be timed to a word's `start_ms`. Music optional and very quiet (-30 LUFS). See `../audio-tts-captions.md`.

## Agent brief (template)

```
Style: math-manim (see references/styles/math-manim.md)
Concept: <what to explain>, audience <level>
Key result: <equation or statement>
Example values: <concrete numbers or "choose simple ones">
Narration: <script> | "write it first and wait for approval"; voice <id>
Colors: quantity -> color mapping, e.g. r = gold, area = blue
Variant: none | algorithm-viz | vertical-short
Format: 1920x1080 30fps, <length> s; LaTeX available: yes/no
```

## Quality bar

- [ ] Each quantity keeps one color across all shapes and equations
- [ ] Every reveal is followed by a wait (>= 1 s, or to the end of its narration sentence; key results >= 2 s)
- [ ] Max 2 equations on screen; nothing overlaps
- [ ] Equations transform term by term rather than being swapped
- [ ] Math checks out (verify every step independently before animating)
- [ ] Text readable at 720p (`font_size >= 28` for prose)

## Pitfalls

- **No LaTeX**: `MathTex` raises at render. Install a TeX distribution (on Windows MiKTeX with on-the-fly package install enabled) or fall back to `Text` with Unicode.
- **TeX errors**: use raw strings `r"\frac{a}{b}"`; LaTeX errors surface as cryptic log paths - read the `.log` in `media/Tex`.
- **Transforms that scramble**: `TransformMatchingTex` only matches identical substrings; split with `{{ }}` consistently in both equations.
- **CE vs GL**: Manim Community (`from manim import *`) and 3b1b ManimGL (`from manimlib import *`) have different APIs; never mix examples from both.
- **Slow iteration**: preview with `-ql`, render final with `-qh` (or `-r 1920,1080 --fps 30`).
- **Overlapping mobjects**: position with `next_to`, `arrange(buff=0.4)` and `to_edge`, never absolute coordinates guessed by eye.
- **Wrong math**: the animation makes errors look authoritative; check derivations before building scenes.

## Variants

- **algorithm-viz**: array elements as 0.8-unit squares with values inside, pointers as arrows above, comparisons flash gold (`Indicate`), swaps use `Swap` or path arcs (`path_arc=PI/2`, run_time 0.6); a step counter top-right; for graphs, nodes as circles, visited in green, frontier in gold.
- **vertical-short**: `config.pixel_width = 1080`, `config.pixel_height = 1920`, `config.frame_width = 8`; one concept, 30-60 s, equation in the top third, geometry below, captions in the lower third.
