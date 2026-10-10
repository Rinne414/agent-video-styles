# Visual Journalism (Vox-style)

A dark editorial explainer: cream paper cards on a near-black ground, every image source-tagged, marker highlights and dashed annotations that draw on, voiced calmly.

- **Tier**: experimental (few public examples; validated by one template)
- **Primary tool**: HyperFrames with HTML/SVG + GSAP (alt: Remotion with rough.js)
- **Format**: 1920x1080 30 fps (also 1080x1920 as 1088x1920 + crop); 45-120 s (template: 60 s)
- **Inputs to ask for**: topic plus a fact ledger with sources (or a finished script), image list with license and source URL (or "draw stand-ins"), language + voice

## Look

| Token | Value (1920x1080) |
|---|---|
| Ground | `#0E0E10`; paper grain via `feTurbulence` (baseFrequency 0.85, fixed seed) at 5% screen blend; vignette 20% |
| Paper cards | `#EFE6D2` fill, 2 deg max rotation, shadow `0 24px 60px rgba(0,0,0,0.55)`, 10 px white-ish border `#F7F1E3` for photos |
| Text | on ground `#F4F1EA`; on paper `#1A1612`; contrast >= 4.5:1 |
| Highlighter | `#FFE45C` at 85% opacity, `mix-blend-mode: multiply` on paper, behind the text; red mark `#E5383B` for strokes behind cut-outs |
| Annotations | dashed 4 px lines (dash 14, gap 10) and arrow heads in `#F4F1EA` or highlighter yellow; hand-wobble from seeded jitter of 2 px |
| Headline type | Source Serif 4 700, 88-120 px, line-height 1.05, max 8 words; labels Inter 600, 30-36 px |
| Source tag | pill at the image's bottom-left, Inter 600, 22 px minimum, `#111` on `#F4F1EA`; text: `SOURCE: <name>, <license>, <short id>`; for a code-drawn illustration of a cited fact use `ILLUSTRATION. Context: <author, work>`. Every source-naming tag matches a ledger entry; the ledger marks second-hand figures. Keep a 70 px footer in cards so the pill never covers diagram text |
| Image slots | 2-3 per scene, 520-760 px wide; stand-ins are code-drawn (halftone portrait, gradient skyline, simple map) tagged `ILLUSTRATION` |
| Safe area | 96 px; on 9:16 keep 220 px top and 300 px bottom clear |

Images must be code-drawn stand-ins, own screenshots, or clearly public-domain/CC0 with the source recorded in `sources.json`. Never use news photos with unclear rights or invented source tags.

## Motion grammar

- **Card entrance**: `translateY 60 -> 0`, `rotate (r+3) -> r`, `opacity 0 -> 1`, `power3.out`, 16 frames, 5 frames stagger; cards then drift 24 px over the scene.
- **Highlight**: a wobbly rect path behind the phrase wipes left to right over 14 frames (`power2.inOut`), one phrase at a time, started 2 frames before the spoken word. Build it as an inline `<mark>` whose `background-image` is a wobbly SVG, tweening `background-size` from `0% H` to `100% H`: it sits exactly behind the words, wraps itself, needs no coordinates (builds run outside the browser, so do not measure ranges). Set `background-color: transparent` on the class (the UA default is yellow and shows outside the wipe) and `white-space: nowrap` on multi-line phrases (a wrapped mark animates all fragments at once).
- **Annotation**: dashed line draws over 20 frames, the arrow head pops at the end. `stroke-dashoffset` cannot draw a dashed line (the dashes use `stroke-dasharray`), so mask it: a duplicate path in an SVG `<mask maskUnits="userSpaceOnUse">` (white stroke, `pathLength="1"`, `stroke-dasharray="1 2"`) with its dashoffset tweened via `attr`; the visible path keeps the 14/10 dashes. Never use objectBoundingBox units: a horizontal line has a zero-height box.
- **Headline plate** (variant): tilt `rotateY -15deg`, blur 14 px -> 0 over 30 frames.
- **Camera**: slow push `scale 1.00 -> 1.03` (at 1.05 an element at x=96 ends near 54 px; otherwise keep text at least 140 px from the edge), background layer 0.4x of foreground for parallax.
- **Transitions**: 10-frame paper slide or hard cut on a sentence boundary; ground and fonts stay constant.
- **Never**: more than 3 cards entering or leaving at once (ambient drift, camera push and highlight or dash tweens do not count), highlights over unreadable text, bare images without a source tag.

## Structure (60 s = 1800 frames @ 30 fps; scene lengths follow the narration; see short form below)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-180 | Headline plate or bold claim, first highlight |
| Context | 180-540 | 2 scenes: who, when, where; images with source tags |
| Evidence 1-2 | 540-1260 | 360 frames each: card stack, highlight, dashed annotation, one number |
| Turn | 1260-1560 | The counter-point or consequence, red mark accent |
| Close | 1560-1800 | One-line conclusion, source list card, held 45 frames |

Proportions scale with the requested length; 120 s adds evidence scenes, never shorter than 6 s each (the 6 s floor applies only there). Short form, about 35 s: hook 5 s, no separate context pair, 4 evidence scenes of 4-6 s, close 5 s (7 scenes, about 90 narrated words). Write the fact ledger, narration and beat table (word -> action) first and get them approved.

## Audio

Voiceover is the clock: `scripts/tts.py` (`en-US-GuyNeural`, `zh-CN-YunxiNeural`; Guy runs about 2.1 words/s with trailing silence, so check the measured duration and adjust rate, e.g. +8%), `timeline.json` contract in `../audio-tts-captions.md`. Optional bed: low synth drone at -30 LUFS synthesized in code, soft paper-slide SFX at -20 dB on entrances. Captions at the bottom (52 px, ink on paper pill) if requested. If the brief is silent, sound items are N/A and highlights time to reading speed.

## Agent brief (template)

```
Style: visual-journalism (see references/styles/visual-journalism.md)
Topic: <topic>; Facts: <list with sources or path>
Images: <path + license + source URL | "draw stand-ins">
Voice: <voice id>; Language: <en | zh-CN>
Fact ledger: exact wording and edition of each figure
Accent: highlighter <#FFE45C | hex>; Length: <seconds>
Format: 1920x1080 30fps
```

## Quality bar

- [ ] Every image has a visible source tag (or `ILLUSTRATION`) and a `sources.json` entry
- [ ] Every claim traces to the fact ledger
- [ ] Highlights sit exactly behind the intended words (check stills)
- [ ] Text contrast >= 4.5:1 on ground and on paper
- [ ] At most 3 cards enter or leave at once; no 2 s of stillness
- [ ] Highlight starts within 3 frames of the spoken word (N/A if silent)
- [ ] Source list shown at the end, held >= 1.5 s

## Pitfalls

- **Rights**: image-model outputs and news screenshots are not safe by default; draw, own, or CC0 with the source recorded.
- **Hand-placed highlights**: drift when copy changes. Use the inline `<mark>` recipe.
- **Figures from memory**: working papers and published versions differ; quote from the ledger only.
- **Per-word cues**: resolve `data-cue="word"` to times at build time and fail loudly if missing; TTS merges digits and dates into one token (cue the first word). With `fromTo` on `svgOrigin`, set it in both from and to vars.
- **Pure black ground**: crushes the paper texture; use `#0E0E10`.
- **Fonts**: vendor `@fontsource/source-serif-4` 700 and `@fontsource/inter` 600 (plus Noto Serif SC for Chinese) into `fonts/`; no network at render.
- **Overlap lint**: a highlight sliding under a slammed word triggers `content_overlap`; mark intentional overlaps `data-layout-allow-overlap` (or `data-layout-allow-overflow`).
- **Width bug**: 1080-wide HyperFrames renders show an 8 px black right edge; compose 1088 and crop.
- **Auto-summary trust**: do not copy claims from auto-generated video summaries.

## Variants

- **headline-highlight**: 150 frames, white headline plate `#FFFFFF` on the dark ground, two highlight sweeps (20 frames each), tilt and unblur; reusable as an opener.
- **halftone-cutouts**: background, black-and-white halftone cut-out (dot pitch 8 px), foreground structure; red `#E5383B` 14 px stroke behind each cut-out.
