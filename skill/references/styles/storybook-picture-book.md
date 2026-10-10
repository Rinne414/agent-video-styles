# Storybook Picture Book

Children's picture-book pages drawn entirely in code: watercolor-paper grain, wobbly soft shapes, a page turn about every 4 s and a gentle voice.

- **Tier**: experimental (few public examples; validated by one template)
- **Primary tool**: HyperFrames with SVG / Canvas 2D + GSAP (alt: Remotion with inline SVG)
- **Format**: 1920x1080 30 fps (also 1080x1920 as 1088x1920 + crop); 30-60 s (template: 32 s, 8 pages)
- **Inputs to ask for**: story (5-9 short pages, 1-2 sentences each), main character (animal or child, one signature trait), language + voice or "music only", palette preference

## Look

| Token | Value (1920x1080) |
|---|---|
| Page | cream paper `#FBF3E4`; grain from `feTurbulence` (baseFrequency 0.9, 4 octaves, fixed seed) at 10% multiply (faint at 1080p; it reads only when zoomed); vignette 7% at the corners, or none (1.5% is invisible) |
| Palette | sky `#BFE3F2`, meadow `#CDE8B0`, sun `#FFD98E`, rose `#F4A9A8`, lavender `#C9B8E8`, peach `#F9C9A0`; ink `#5B4636`. Derived colours allowed: a wash darkened up to 30%, paper-white `#FFFBF2` for clouds and highlights, night sky `#B9C9EA`; no other hues. Ground pair: dry = peach, wet = meadow |
| Washes | big shapes get a watercolor edge: fill at 85% opacity plus a 10 px inner stroke of the same hue darkened 12%, `feDisplacementMap` scale 6 for the wobble |
| Outlines | 4 px ink at 60% opacity, round caps, wobbly via seeded displacement; never pure black |
| Shapes | circles, blobs, hills as 3-point bezier curves; animals from 4-8 shapes, dot eyes 10 px, no hard corners |
| Page text | Baloo 2 / Nunito 700, 64-80 px, `#3E2F25` on a cream or white wash band (contrast >= 4.5:1), max 14 words per page |
| Composition | subject in the lower 55% of the page, text band top or bottom 220 px, 120 px margins |
| Safe area | 96 px on 16:9; on 9:16 keep 220 px top and 300 px bottom clear |

Characters stay in front or 3/4 view and never walk; they change pose between two or three drawings.

## Motion grammar

- **Page turn**: the old page's right edge curls left over 14 frames with `power2.inOut` (`skewY 0 -> -4deg`, `scaleX 1 -> 0.02` about the left edge, shadow rising to 30%), revealing the next page. Overlap rule: the next page's clip starts on the frame the turn starts and sits underneath; the old clip is extended 14 frames; earlier pages get a higher z-index; end the old `.page` with an explicit `opacity 0` tween, because `scaleX 0.02` still leaves a 38 px strip on the left edge until the clip ends.
- **Entrance**: elements float up with `translateY 24 -> 0`, `opacity 0 -> 1`, `power2.out`, 18 frames, 6 frames apart; the hero pops with `back.out(1.4)`.
- **Idle**: 4 px bob on a 2 s sine; blink every 3 s (seeded) for 4 frames; clouds drift 40 px per page.
- **Wobble**: outline displacement seed changes every 6 frames (a gentle boil).
- **Text**: the page line fades in over 10 frames starting on its first spoken word.
- **Never**: hard cuts, fast motion, saturated neon colors, more than 3 moving things at once.

## Structure (about 40 s = 1200 frames @ 30 fps for 9 lines; page lengths follow the narration)

| Beat | Frames | Content |
|---|---|---|
| Cover | 0-11% | Title on the cover page, hero peeks in |
| Pages 1-N | 11-86% | Each page: lead + narration + tail, including the 14-frame page turn |
| Last page | next 3-4 s | The resolved moment, warm sun, text with the closing line |
| End | last 14% of the video's tail beat, at least 30 frames | "The End" tag settled and held |

Length formula: `page = lead 12 f + last word end + tail 12 f` (audio tags on alternating track indexes). Narration at -10% runs 8-11 words in 3.8-4.6 s including about 0.9 s trailing silence, so 9 lines give about 39.6 s with cover and end. Without narration use about 4 s per page. If the caption equals the narration verbatim, skip the caption/speech merge. Scale proportions to the requested length: 5-9 pages.

## Audio

Optional gentle TTS (`en-US-JennyNeural` or `en-US-AvaNeural`, `zh-CN-XiaoxiaoNeural`; contract in `../audio-tts-captions.md`), rate -10%. Music is optional (no tested synthesis recipe ships; narration-only is acceptable, or pad with a one-liner). If synthesized: a music-box arpeggio in code (pentatonic C-D-E-G-A, 72-84 BPM, sine plus 2nd harmonic at 30%, -26 LUFS), with a soft paper-slide SFX on each page turn around -20 dB. Narration-only or music-only is fine; for a silent brief the sound items are N/A and page text carries the story.

## Agent brief (template)

```
Style: storybook-picture-book (see references/styles/storybook-picture-book.md)
Story: page 1) <text> 2) ... (5-9 pages); Hero: <animal/child + signature trait>
Voice: <voice id | music only>; Language: <en | zh-CN>
Palette: <default | hex list>
Format: 1920x1080 30fps, <seconds> s
```

## Quality bar

- [ ] Every page has paper grain, a hero, and text with contrast >= 4.5:1
- [ ] Page text <= 14 words and on screen >= `0.5 s + words / 3.5 s`
- [ ] Palette limited to the 6 washes + ink + the derived colours above; outlines never pure black
- [ ] Page turns are 14 frames and do not clip text
- [ ] Two renders are identical (grain and wobble seeded)
- [ ] Narration finishes before each page turn (N/A if silent)
- [ ] Nothing crosses the safe area; end tag held >= 1 s

## Pitfalls

- **Over-ambitious characters**: detailed drawings look broken. Build from 4-8 shapes and change pose instead. Sample budgets: cloud = 7 circles; flower = 6 petal circles + centre + 2 leaf paths + a stem curve. A wilted flower made of closed petals reads as a brown pinwheel: droop the stem, open the petals downward and desaturate. Keep flowers clear of the hero.
- **Rotation pivots**: rotate petals or a hanging head with `svgOrigin` about an offset point and bake geometry in absolute coordinates, no ancestor `transform` attributes.
- **Harmless warnings**: `GSAP target not found` for empty selectors on pages without that element.
- **Unseeded wobble or grain**: the texture crawls differently every render.
- **Dense text**: a picture book has 1-2 sentences per page.
- **Fonts**: vendor `@fontsource/baloo-2` and `@fontsource/nunito` (and Noto Sans SC for Chinese) into `fonts/`; no network at render.
- **Width bug**: 1080-wide HyperFrames renders show an 8 px black right edge; compose 1088 and crop.
- **Harsh audio**: use a low-pass at 6 kHz on the music box so it stays gentle.
- **Photos**: use none unless rights are clear; redraw instead.

## Variants

- **music-box-only**: page text 80-96 px, 5 s per page, no TTS.
- **heritage-postcard**: pages 1-3 paper-cut pieces, 4-6 watercolor, last page inside a postcard frame with a stamp (circle, dashed ring, 120 px) and handwritten caption.
