# Line-Reveal Illustrated Story

A quiet picture-book short. Each scene is a code-drawn SVG: line art sweeps in left to right, soft color follows in the same direction, a short caption sits in the empty paper above.

- **Primary tool**: HyperFrames + GSAP (alt: html-capture)
- **Format**: 720x960 (3:4, the evidenced size; 720 is divisible by 16, so no crop) at 30 fps; 9:16 as 1088x1920 composed then cropped to 1080x1920; 4:5 as 1088x1350 cropped to 1080x1350; 35-45 s
- **Inputs to ask for**: story in 7-9 beats (one image idea and one caption line each), language, mood, optional music file, optional palette
- **Tier**: experimental (few public examples; validated by one template)

All illustrations are drawn in code from SVG primitives (circles, rounded rectangles, quadratic and cubic paths). No image model, no raster art. This keeps the recipe inside the code-only scope but makes the art simpler than the evidence example; design for that.

## Look

| Token | Value |
|---|---|
| Page | paper `#F6F1E7`, 2% grain optional; large negative space is the point |
| Line | ink `#2B2A33`, 3 px at 720 wide (scale with width), round caps and joins, constant weight |
| Fills | muted, saturation <= 35%: dusty rose `#D9A5A0`, sage `#A9BFA8`, mustard `#D9C27A`, slate blue `#9DB0C6`, warm gray `#CFC6B8`; max 5 fills per scene, flat, no gradients, no outlines in color |
| Composition | subject in the lower 45-55% of the frame; max 2-3 people and 2 background anchors; every scene a different layout; no dense crowds or big black masses |
| Shapes | a figure = circle head + rounded-rectangle body + 4 limb strokes; props built from <= 12 shapes; faces are two dots at most |
| 1080x1920 column | stroke 4.5 px, caption 56-58 px at y 230-250, side margin 90, subject y 900-1620, feather 36 px (line) / 90 px (color); safe top 220, bottom 300 |
| Caption | upper empty area, y 110-290 at 720x960, Noto Serif or Noto Serif SC 36 px (weight 500 for captions, 600 for titles; these exist in the @fontsource package), line-height 1.4, max 3 lines (about 28 Latin or 18 CJK characters per line), ink `#2B2A33` on paper (11:1) |
| Safe area | scaled from 9:16 rules: 110 px top and 150 px bottom clear at 960 high; 40 px sides |

## Motion grammar

- **Line sweep**: the line layer sits under a mask rect whose width goes `0 -> W` over 54 frames, `Easing.inOut` (`power2.inOut`), with a 24 px soft leading edge. Soft edge recipe: two stacked layers (lines, fills), each with CSS `-webkit-mask-image: linear-gradient(to right, #000 Xpx, transparent X+feather px)` where X = -feather + p x (W + feather), p = sweep progress per frame. Title text reveals with the same line mask. Optional: stroke-dashoffset draw of the 3-5 main contours over the same 54 frames, minor strokes follow the sweep.
- **Color sweep**: starts 6 frames after the line sweep ends; same direction, same duration (54 frames), mask edge feathered 60 px; fills sit under the lines (a separate masked layer below the line layer).
- **Scene length**: 150 frames: line 6-60, color 66-120, hold 120-150 with a slow `scale 1.00 -> 1.02`.
- **Caption**: fades in over 12 frames (`opacity 0 -> 1`) starting at frame 30, never moving; exits with the scene on the cut.
- **Blank paper**: at most 0.5 s (15 frames) of empty paper between scenes; start the line sweep within 6 frames of the cut and count any paper wipe toward the 15.
- **Scene change**: hard cut on the beat, or a 12-frame paper wipe left to right when the story moves in time. No crossfade over 8 frames.
- **Secondary life**: one small loop per scene (steam 90-frame cycle, blinking light, swaying leaf, 6 px amplitude) driven by `sin(2 * pi * frame / period)`.
- **Never**: random jitter, color popping in before its sweep, zoom padding to stretch a short scene, motion in the empty paper area (exception: a slow drift of the subject, <= 100 px over the scene, when the beat is movement).

## Structure (40 s = 1200 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Title | 0-120 | Title line-drawn then colored in 90 frames, one-line subtitle |
| Scenes 1-6 | 120-1020 | 150 frames each, one beat per scene, caption in the paper space |
| Closing | 1020-1200 | 180 frames: the final image completes its color pass by frame 1110 and holds; closing line in the caption area; held >= 1.5 s |

Proportions scale to the requested length: 30 s (900 frames) = title 120 + 4 scenes x 150 + closing 180; 45 s runs 7 scenes. Use more scenes, never longer scenes, to extend a story. Check caption reading time `0.5 s + words / 3.5` (CJK `0.5 s + chars / 5`) fits inside 150 frames (about 5 s); split a beat otherwise.

## Audio

Licensed or synthesized calm music at 70-90 BPM, no vocals, 35% volume, fade in 30 frames and out over the last 60. Optional soft paper or pencil SFX on the line sweep (under 20% volume, synthesized). Voiceover is optional; if used, narration sets scene lengths and captions mirror it. A silent brief makes all audio items N/A.

## Agent brief (template)

```
Style: line-reveal-story (see references/styles/line-reveal-story.md)
Story: <title>, tone <calm|nostalgic|warm>, language <>
Beats: 1) image "<>" caption "<>" 2) ... (7-9 beats)
Palette: paper #F6F1E7, ink #2B2A33, fills [<>,<>,<>,<>,<>]
Art: draw every scene as SVG in code (no image model)
Music: <path or none>
Format: 720x960 30fps, 40 s
```

## Quality bar

- [ ] Every illustration is vector and drawn in code; no raster image used
- [ ] Line sweep and color sweep run left to right in every scene, color after line
- [ ] Fills have saturation <= 35% and at most 5 per scene
- [ ] Subject sits in the lower half; caption area stays empty of art
- [ ] Caption <= 3 lines, readable for the computed time, contrast >= 4.5:1
- [ ] Each scene has a different composition
- [ ] Nothing inside the safe area margins; fonts vendored and confirmed in a still
- [ ] Every value a function of the frame (no CSS animation, no unseeded random)
- [ ] Final scene settled and held >= 1.5 s
- [ ] Rendered with a new file name each run (N/A for templates, which use `out/<style-id>.mp4`)

## Pitfalls

- **Crude art**: free-form paths from a model look wobbly. Build from primitives, reuse a small parts library (figure, cup, window, tree, bed), and keep each scene under 12 shapes.
- **Mismatched layers**: if the color layer is drawn separately from the lines, edges drift; derive both from the same shape list (`{d, fill, stroke, g}`; the fill pass uses the same geometry with `stroke: none`). Typical parts: circle, rounded rect, polygon, arch, land, sea, plus a few scene props.
- **Line show-through**: a line-only layer shows scenery lines through figures and props. Knock out the stroke of shape i with every LATER opaque fill via an SVG `<mask>` built at build time (paper-filled head, body and props make it automatic).
- **Hard mask edge**: a 1-pixel mask edge looks like a wipe; feather it.
- **Crowds**: more than 3 people per frame turns to noise at this simplicity.
- **Padding scenes**: zoom or pan to fill time reads as a slideshow; add a beat instead.
- **Width bug**: 1080-wide HyperFrames output has black right-edge columns; compose 1088 and crop. The 720-wide native format is safe.
- **Fonts**: vendor Noto Serif (SC for Chinese; subset it) with `@font-face`; no network at render.

## Variants

- **single-color-ink**: no color pass; per scene one accent shape (`#C2543D` on at most 10% of the frame) fills 20 frames after the line sweep; scene length drops to 120 frames.
- **night-page**: page `#14213D`, line `#F3E9D2`, fills `#C9A27A`, `#8DA0B8`, `#B88B8B`, `#7E9C8A`; caption `#F3E9D2` (above 11:1); hold camera drift 1.00 -> 1.02 unchanged.
