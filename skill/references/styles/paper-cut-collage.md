# Paper-Cut Collage

Layered colored paper pieces with torn edges, soft shadows and grain, animated on twos so it reads as hand-moved stop motion. Everything is drawn in code (SVG paths, filters), no photos required.

- **Primary tool**: HyperFrames with SVG + GSAP (alt: Remotion with inline SVG)
- **Format**: 1920x1080 30 fps (also 1080x1920, 1080x1080, 1080x1350); 20-60 s. For 1080-wide HyperFrames output compose 1088 wide and crop (see `../tools/hyperframes.md`)
- **Inputs to ask for**: topic or timeline (5-15 beats, one fact each), tone, optional palette hex, optional music; images only if rights are clear

## Look

| Token | Value (1920x1080) |
|---|---|
| Table ground | cream `#F3EAD6`; blank-paper morph ground `#EFE5CF`; never pure white or black |
| Palette | ink `#2A1D18`, paper `#FBF6EA`, navy `#26315F`, mustard `#D9A441`, teal `#3F9F9A`, mint `#A9D9C6`, pink `#F3A3BF`, sky `#CFE2EE`, purple `#8C7AD8`, green `#5AA05A`; hero accent orange `#EC7A4F` on one piece per scene; supporting tones: skin `#E8B592`, dark green `#2F6B3A`, olive `#9A9A3F`, brown `#8B5E3C`, shade cream `#E6DCC3`, kraft `#C9A87C` |
| Piece | closed SVG path, no outlines, fill from palette. Torn edge: resample the outline to 40-70 points, offset each along its normal by seeded noise (amplitude 5% of the smaller side, clamped 2.5-8 px), and draw a second path 3.5 px larger in paper white under the fill as the torn fibre rim. Shadow `0 6px 10px rgba(42,29,24,0.28)` from one shared `feDropShadow` on the group, never per-path blur |
| Grain | one `feTurbulence` (baseFrequency 0.8, 3 octaves, fixed `seed`) multiplied at 12-18% over the whole frame |
| Patterns | stripes, dots (r 6 px, 28 px pitch), gingham clipped inside pieces; at least one pattern per scene |
| Character | head and body from 3-6 paper pieces, dot eyes, simple mouth; acts with pose changes, no walk cycles |
| Text | on a hand-lettered paper tag (rotated -3 to +3 deg); Caveat Brush 400 for tags, Fredoka 600 for titles (these weights exist in `@fontsource`; Patrick Hand has only 400; files `<font>-latin-<weight>-normal.woff2`); width estimate for generated tags: Fredoka 600 about 0.56 em, Caveat Brush about 0.40 em per character; tags 56-72 px, titles 110-140 px; ink on paper, contrast >= 4.5:1 |
| Safe area | 96 px on 16:9; on 9:16 keep 220 px top and 300 px bottom clear |

A scene realistically takes 20-30 pieces including details (a character alone is 3-6); keep pieces simple polygons or primitives. 3+ small background-life details (birds, grass tufts, clouds) keep the world alive.

## Motion grammar

- **On twos**: quantize the frame first (`h = frame - frame % 2`), derive every value from `h`, and rebuild the SVG only when `h` changes (drive it from one proxy tween, not a `tl.set` every 2 frames, which is wrong for 100+ pieces). Chunky variant: hold 3 frames.
- **Boil**: every piece gets a seeded rotation jitter of +-1.2 deg and position jitter of +-2 px that re-rolls each hold, seeded with `rnd(pieceId, h / 2)`.
- **Arrival**: pieces slide in from the nearest edge over 8 frames (4 steps) or pop `scale 0.6 -> 1.06 -> 1` over 6 frames; stagger 4 frames; text tag arrives last.
- **Camera**: stepped pan or push, `scale 1.00 -> 1.06` over the scene, in 2-frame steps.
- **Shape morph**: between eras one piece morphs to the next on blank paper in 16 frames (8 steps); never blend two wall colors (mud).
- **Transitions**: hard cut on the beat inside a chapter; paper wipe between chapters: a torn strip about 3600 px wide crossing the screen in 5 steps of 2 frames (10 frames, about 1230 px per step), centred on the chapter boundary; swap the scene on the step where the strip covers the screen.
- **Never**: smooth 60 fps tweens, gradients, fading textured pieces with opacity (skip them or scale to 0 instead), randomness without a seed.

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Title | 0-90 | Title tag drops onto a blank cream table, pieces assemble around it |
| Era / chapter 1-5 | 90-810 | 144 frames each: 96 frames of scene, 18 frames of morph or wipe, 30 frames of label hold; tags arrive at +36 |
| Payoff | 810-870 | One hard cut on the beat, the biggest piece and the one hero accent |
| End card | 870-900 | Settled tag with takeaway or credit, held 30 frames |

Worked 4 chapters plus cards (30 s): title 0-90, chapters 90-270, 270-450, 450-630, last chapter with its end card 630-900 (270 frames), wipe 10 frames centred on each boundary, tags at +36 into each chapter. Proportions scale with the requested length: 15 s = title, 2 chapters, payoff; 60 s = up to 10 chapters (never fewer than 4 s each). Tag reading time: `0.5 s + words / 3.5 s`.

## Audio

Music optional: a marimba or pizzicato loop at 100-112 BPM synthesized in code (WebAudio-style offline render to WAV) or a supplied licensed track; cuts on the beat grid (at 110 BPM a beat is about 16 frames; snap to multiples of 2). SFX: soft paper slide and a tap on each arrival, quiet at -20 dB; leave 1 s of silence before the payoff. Voiceover is optional; if used, follow `../audio-tts-captions.md`. For a silent brief the sound items below are N/A and the tags must carry the story.

## Agent brief (template)

```
Style: paper-cut-collage (see references/styles/paper-cut-collage.md)
Topic: <topic>; Beats: 1) <fact> 2) <fact> ... (5-15)
Hero accent: <orange default or hex>; Palette: <default | hex list>
Character: <none | name + signature trait>
Images: <none - draw all pieces | paths with license + source>
Format: 1920x1080 30fps, 30 s; hold <2 | 3> frames; music <path | synth | none>
```

## Quality bar

- [ ] Animated values change only on 2-frame boundaries (hold 3 in the chunky variant)
- [ ] Every scene has one pattern, one hero accent piece and 3+ background details
- [ ] No bare text; every label sits on a paper tag with contrast >= 4.5:1
- [ ] Contact sheet shows torn edges, shadows and grain on every scene
- [ ] Re-rendering gives identical frames (compare `framemd5` of two renders; check on-twos by mean absolute difference between adjacent frames: inside a hold below 0.1, across a hold boundary above 1, since encoder noise defeats exact matching)
- [ ] Nothing crosses the safe area; end card held >= 1 s
- [ ] Cuts land on beats when music is used (N/A if silent)

## Pitfalls

- **Smooth motion**: interpolating every frame destroys the look. Quantize first, then animate.
- **Muddy morphs**: blending two colored grounds. Morph on blank paper only.
- **Gradient creep**: soft gradients read as digital. Flat fills, grain and shadow only.
- **Unseeded wobble**: edges change between renders. Seed the noise per piece id.
- **Fonts**: vendor Caveat Brush / Fredoka (`@fontsource/*` woff2 into `fonts/`); no network at render. Use Noto Sans SC for Chinese tags.
- **Width bug**: 1080-wide HyperFrames renders get a black 8 px right edge; compose at 1088 and crop.
- **Rights**: do not paste unclear-license photos; redraw as paper pieces, or log the source.

## Variants

- **vox-collage**: kraft `#C9A87C` or cream backdrop, vignette 25%, die-cut subjects with a 6 px white sticker edge, rotated white label chips, marker highlight sweeps, serif headlines (Source Serif 4 700), slow parallax camera (background 0.4x, foreground 1.2x).
- **halftone-pasteup**: one flat bold field (e.g. `#E63946`), black-and-white halftone cut-outs with clean edges, pieces enter from edges at hold 3, label text arrives last.
