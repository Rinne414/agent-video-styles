# Editorial Swiss Grid

A strict modular grid, flush-left grotesk, giant numerals, hairline rules and one signal color: print design in motion. Calm, exact and credible; every element sits on the grid.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Format**: 1920x1080 30 fps (4:5 1080x1350 and 9:16 variants); 20-60 s
- **Inputs to ask for**: title, 3-5 sections (each: number, headline, 1-2 lines of body or one statistic), source line, signal color preference, logo

## Look

| Token | Value |
|---|---|
| Grid | 12 columns at 1920x1080: margins 96 px, gutters 24 px, column width 124 px; 8 px baseline; compute `col(n) = 96 + n * 148` |
| Paper | `#F2EFE8` (warm) or `#F4F4F0` (cool); optional 4% grain |
| Ink | `#111111`; secondary `#5C5C5C` |
| Signal color | ONE of: Swiss red `#E30613`, cobalt `#1F3FBF`, signal yellow `#FFD400` |
| Headline type | Inter Tight / Archivo 700, 120-200 px, tracking -0.03em, line-height 0.95, flush left, ragged right |
| Numerals | 300-480 px, weight 700, tabular figures, often in the signal color |
| Labels / meta | 18-22 px, uppercase, tracking 0.08em, Inter 600 or IBM Plex Mono |
| Body | 32-40 px, weight 400, line-height 1.3, max 45 characters per line |
| Rules | 2 px ink, spanning whole columns; section markers like `01 / 05` |
| Shapes | hard edges only: radius 0, no shadows, no gradients |

## Motion grammar

- **Rules draw**: `scaleX 0 -> 1` from the left edge, 14 frames, GSAP `power3.inOut` (Remotion `Easing.bezier(0.65, 0, 0.35, 1)`).
- **Line reveal**: each text line rises from its own mask (`yPercent 100 -> 0`), 12 frames, `power3.out`, 3 frames between lines.
- **Grid moves**: blocks slide by exact multiples of `148 px` (one column + gutter), 16-20 frames, `power2.inOut`; they always stop on a column edge.
- **Numerals**: digit roll per place (each place a vertical strip of 0-9) over 20 frames, place values staggered 3 frames from the right.
- **Transitions**: full-frame signal-color panel wipes in from the left (10 frames, `expo.inOut`), holds 2 frames, wipes out to the right revealing the next section; or a hard cut.
- **Rhythm**: measured; each beat of information holds 60-90 frames.
- **Never**: centered layouts, bounce or overshoot, blur, rotation, more than one accent color.

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Masthead | 0-120 | Top rule draws, title reveals line by line, issue/date meta in labels |
| Section 1 | 120-330 | `01` numeral in column 1-3, headline in 4-11, body lines below a rule |
| Section 2 | 330-540 | One statistic: 400 px numeral + label + source in meta type |
| Section 3 | 540-750 | Image or diagram block snapped to columns 6-12 with a caption in 1-5 |
| Colophon | 750-900 | Summary line, source credits, logo; settled by frame 810 and held |

## Audio

Minimal: ticking percussion, sparse piano or ambient pulse at 90-100 BPM, or a calm voiceover where each section length comes from the narration timeline (`../audio-tts-captions.md`). Optional SFX: a soft paper tick on each rule draw, a low thud under color wipes.

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
- [ ] Every statistic has a visible source line
- [ ] Body text <= 45 characters per line
- [ ] Colophon settled by frame 810 and held

## Pitfalls

- **Off-grid drift**: positions typed by hand drift by a few pixels and the style dies. Generate all x positions from the `col(n)` helper.
- **Centering reflex**: agents center titles by default. Everything is flush left.
- **Helvetica licensing**: Helvetica Neue and Neue Haas are not free to bundle; Inter Tight or Archivo carry the look.
- **Over-animation**: springs and bounces read as a different style. Use only the eases above.
- **Too much copy**: a 4-line paragraph on screen is a document, not a video. Cut to one sentence per section.

## Variants

- **bold-poster**: signal-color ground, ink type cropped off the frame edges (up to 130% of frame width), one numeral or word per shot, hard cuts on the beat.
- **visual-journalism**: `#0B0B0B` ground, photos with a source tag in 16 px mono, yellow highlighter strokes (`#FFE600`, 60% multiply) drawing under key phrases, dashed 2 px annotation lines pointing at details.
- **dark-editorial**: paper `#111111`, ink `#EDEBE6`, signal color unchanged; same grid and motion.
- **4:5 / 9:16**: 6-column grid (margins 72 px, gutters 24 px); numerals 260-360 px; stack sections vertically.
