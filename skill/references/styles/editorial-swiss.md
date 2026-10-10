# Editorial Swiss Grid

A strict modular grid, flush-left grotesk, giant numerals, hairline rules and one signal color: print design in motion. Calm, exact and credible; every element sits on the grid.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Tier**: experimental (few public examples; validated by one template)
- **Format**: 1920x1080 30 fps (4:5 1080x1350 and 9:16 variants); 20-60 s
- **Inputs to ask for**: title, 3-5 sections (each: number, headline, 1-2 lines of body or one statistic), source line, signal color preference, logo

## Look

| Token | Value |
|---|---|
| Grid | 12 columns at 1920 wide: margins 96 px, gutters 24 px, column 122 px, pitch 146 px; 8 px baseline; `col(n) = 96 + n * 146`, span width `w(k) = k * 146 - 24` (the earlier 124/148 draft did not sum to 1920) |
| Paper | `#F2EFE8` (warm) or `#F4F4F0` (cool); optional 4% grain baked to PNG |
| Ink | `#111111`; secondary `#5C5C5C` (5.9:1 on paper) |
| Signal color | ONE of: Swiss red `#E30613`, cobalt `#1F3FBF`, signal yellow `#FFD400` |
| Headline type | Inter Tight 700, 120-200 px, tracking -0.03em, line-height 0.95, flush left, ragged right |
| Numerals | 300-480 px, weight 700, tabular figures, ink or signal color |
| Labels / meta | 30 px, uppercase, tracking 0.08em, Inter 600 or IBM Plex Mono; always ink (never signal color) |
| Body | 36-44 px, weight 400, line-height 1.3, max 45 characters per line |
| Rules | 3 px ink, spanning whole columns; section markers like `01 / 05` |
| Shapes | hard edges only: radius 0, no shadows, no gradients |
| Safe area | 96 px margins on 16:9; 72 px on 4:5 and 9:16 |

Stat scene layout (1920 wide): furniture (section marker, meta) at y 96 and 912; rule at y 360; numeral in columns 0-5 (a 3-glyph numeral at 440 px needs about 880 px, so text starts at column 7); headline in columns 7-11 at y 448; body at y 720; snap every y to the 8 px baseline.

Contrast: red on paper is 4.2:1 and yellow on paper about 1.4:1, so signal color is for numerals >= 120 px (3:1 rule), rules and color blocks; text on a yellow block is ink, text on red or cobalt blocks is paper-white. Fonts are vendored: pin `@fontsource/inter-tight` (and `@fontsource/ibm-plex-mono` if used) and declare root-relative `@font-face`; Inter Tight and Archivo are not guaranteed on HyperFrames' auto-resolve list, so confirm in a snapshot. Helvetica Neue is not free to bundle.

## Motion grammar

- **Rules draw**: `scaleX 0 -> 1` from the left edge, 14 frames, GSAP `power3.inOut` (Remotion `Easing.bezier(0.65, 0, 0.35, 1)`).
- **Line reveal**: each text line rises from its own mask (`yPercent 100 -> 0`), 12 frames, `power3.out`, 3 frames between lines.
- **Grid moves**: blocks slide by exact multiples of 146 px, 16-20 frames, `power2.inOut`; they always stop on a column edge.
- **Numerals**: digit roll per place over 20 frames, places staggered 3 frames from the right. Use a 20-cell strip (0-9 twice) ending at cell 10+digit so every place rolls at least 10 cells, not one step for a "1".
- **Transitions**: full-frame signal-color panel wipes in from the left (10 frames, `expo.inOut`), holds 2 frames, wipes out to the right; or a hard cut.
- **Rhythm**: measured; each information beat holds 60-90 frames; a 1 px/frame drift on the paper grain keeps frames alive.
- **Never**: centered layouts, bounce or overshoot, blur, rotation, more than one accent color.

## Structure (30 s = 900 frames @ 30 fps; percentages scale)

| Beat | Frames | Content |
|---|---|---|
| Masthead | 0-13% | Top rule draws, title reveals line by line, issue or date meta in labels |
| Section 1 | 13-37% | `01` numeral in columns 1-3, headline in 4-11, body lines below a rule |
| Section 2 | 37-60% | One statistic: 400 px numeral + label + source in meta type |
| Section 3 | 60-83% | Image or diagram block snapped to columns 6-12 with a caption in 1-5 |
| Colophon | last 17% | Summary line, source credits, logo; settled by 90% of the video's length and held |

Proportions scale to the requested length: 20 s keeps 2 sections, 60 s gives 5-6. Text stays up for at least `0.5 s + words / 3.5 s`. Stats report (5 numbers, 25 s, no image): masthead 90 frames, five scenes of 114 (one stat each, same layout), colophon 90.

## Audio

Minimal: ticking percussion, sparse piano or ambient pulse at 90-100 BPM, or a calm voiceover where section lengths come from the narration timeline (`../audio-tts-captions.md`). Optional SFX: a soft paper tick per rule draw, a low thud under color wipes. Silent brief: sound items N/A.

## Agent brief (template)

```
Style: editorial-swiss (see references/styles/editorial-swiss.md)
Title: "<title>"; meta: <issue / date / org>
Sections: 01 "<headline>" - <1-2 lines>
          02 <statistic> "<label>" (source: <source>)
          03 "<headline>" + <image or diagram path>
Signal color: red | cobalt | yellow | <hex>
Paper: warm | cool | dark
Audio: <music path / voiceover script / none>
Format: 1920x1080 30fps, 30 s
```

## Quality bar

- [ ] Every element's left edge sits on a column edge from `col(n)`
- [ ] Only one signal color, used on <= 20% of any frame
- [ ] No rounded corners, shadows or gradients anywhere
- [ ] Every statistic has a visible source line; invented figures are labelled "sample data"
- [ ] Body <= 45 characters per line, nothing under 30 px
- [ ] Text contrast >= 4.5:1 (signal color only on display type >= 60 px)
- [ ] Intended grotesk confirmed in a snapshot
- [ ] Colophon settled by 90% of the length and held >= 1.5 s

## Pitfalls

- **Roll strip clipping**: the digit mask needs `padding-bottom: .14em; margin-bottom: -.14em` or descenders clip. Clipping by `overflow:hidden` makes `check` print dozens of overflow infos; add `data-layout-allow-overflow` on the container. Never name a custom attribute `data-end` (lint error `deprecated_data_end` disables the layout and contrast audits); use `data-to`.
- **Off-grid drift**: hand-typed positions drift a few pixels and the style dies. Generate every x from `col(n)`.
- **Centering reflex**: agents center titles by default. Everything is flush left.
- **Width bug**: HyperFrames widths not divisible by 16 black out the right 8 px, obvious on light paper. For 1080-wide formats compose 1088 wide with art in the left 1080 px, render, then crop with ffmpeg.
- **Over-animation**: springs and bounces read as a different style. Use only the eases above.
- **Too much copy**: a 4-line paragraph is a document, not a video. One sentence per section.
- **Template demos**: the swiss-grid preset is a template; replace its copy and colors rather than shipping it unchanged.

## Variants

- **bold-poster**: signal-color ground, ink type cropped off the frame edges (up to 130% of frame width), one numeral or word per shot, hard cuts on the beat.
- **dark-editorial**: paper `#111111`, ink `#EDEBE6`, signal color unchanged (red on dark is 4.4:1, so keep it to display type).
- **4:5 / 9:16**: compose 1088 wide, 6-column grid: margins 72 px, gutters 24 px, column 136 px, `col(n) = 72 + n * 160`; numerals 260-360 px; stack sections vertically, crop to 1080 after render.
