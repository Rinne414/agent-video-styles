# Painterly Canvas

Watercolor washes and ink brush strokes painted procedurally on canvas, with textured strokes, blooming washes and hand-made wobble, all seeded so every frame renders identically twice. Fits lyric videos, poems, story moments and emotional brand pieces.

- **Primary tool**: raw HTML capture with seeded canvas 2D (p5.js optional; p5.brush optional and unverified: needs WEBGL, own seeding, unknown frame-seek behavior), via `window.renderFrame(i, fps)` and `scripts/capture_html.mjs` (alt: seekable canvas inside HyperFrames)
- **Format**: 1080x1080 or 1080x1920 at 24-30 fps; 15-60 s
- **Inputs to ask for**: mood, poem or lyrics, palette or reference era, music, the few characters or objects needed (keep them simple)

## Look

| Token | Value (1080x1080) |
|---|---|
| Paper | off-white `#F3EDE0` with seeded grain at 4-6% luminance (build 3 grain canvases once from the PRNG, multiply-blend one per 3 frames, plus a 36x36 upscaled mottle) and a 15% vignette; night variant `#14120F` |
| Palette | indigo `#2E4057`, vermilion `#C8553D`, ochre `#F2A541`, teal `#588B8B`, sky `#93B5C6`, sepia ink `#4A3B31`; saturation at most 60%; max 7 colors |
| Brushes | verified route, canvas 2D with a seeded PRNG: bristle stroke = N offset polylines with per-run dropout, taper and jitter noise keyed on `floor(i/3)`; wash = a cached sprite of stacked wobbly polygons at ~7% alpha plus a darker edge. (p5.brush pencil/pen, weight 1-3, is an alternative; check names against the installed version) |
| Ink lines | sepia or indigo; outlines drawn as a few long strokes, not many short ones |
| Characters | simple silhouettes; faces = 2 dots and a line; 3-6 strokes per figure |
| Text | Cormorant Garamond or LXGW WenKai (CJK), 48-72 px, ink color, rotation +/-1 deg |
| Composition | one subject per scene and at least 40% empty paper |

## Motion grammar

- **Draw-on**: a stroke reveals over 12-30 frames by drawing its path only up to fraction `t` of its length.
- **Wash bloom**: 18-36 frames; radius and opacity grow with `easeOutCubic`.
- **Boiling line**: re-seed outlines every 3 frames (`seed = base + floor(i / 3)`), jitter amplitude at most 1.5 px; this is the hand-made wobble.
- **Characters on threes**: hold each drawing 3 frames (about 8-10 drawings per second).
- **Camera**: slow pan or zoom of the art layer only (text stays fixed on the safe area), about 0.7% per second, total zoom at most ~15%.
- **Transitions**: a big brush stroke wipes the frame in 15-20 frames, or washes fade back to blank paper.
- **Lyrics**: fade in + 6 px rise over 10 frames, hold for the line, fade out over 8 frames.

## Determinism contract

The page exposes `window.renderFrame(i, fps)`, which clears the canvas and redraws frame `i` completely. Call `randomSeed(SEED)` and `noiseSeed(SEED)` (and the p5.brush seed, if it has one) at the start of every frame; use `noLoop()` and `pixelDensity(1)`. Never rely on pixels left over from the previous frame: if a painting accumulates, replay every stroke up to frame `i`, or cache static layers to an offscreen graphics built once, deterministically. Capture with `node scripts/capture_html.mjs page.html --out out.mp4 --width 1080 --height 1080 --fps 30 --frames 900 --audio song.mp3` (see `../tools/html-capture.md`).

## Structure (30 s lyric video = 900 frames @ 30 fps; scale to length)

| Beat | Frames | Content |
|---|---|---|
| Paper | 0-45 | Blank grained paper; title strokes draw on |
| Scene 1 | 45-300 | Landscape washes bloom, subject draws on; lyric line 1 |
| Scene 2 | 300-570 | Brush-stroke wipe; character boils at idle; lyric lines 2-3 |
| Climax | 570-780 | Bold vermilion wash blooms on the downbeat; widest stroke work |
| Close | 780-900 | Washes fade to paper; title or credit in ink |

Short poem (e.g. 20 s, 4 lines): Paper ~5%, Close ~12%, per-line window = (length - paper - close) / lines; map line 1-2 to Scene 1, line 3 to Climax, line 4 to the resolution.

## Audio

Acoustic, piano or lo-fi music. Lyric timing from an SRT or from `timeline.json` (contract in `../audio-tts-captions.md`) if a poem is narrated with `scripts/tts.py`. No SFX beyond, at most, a faint paper or brush texture.

## Agent brief (template)

```
Style: painterly-canvas (see references/styles/painterly-canvas.md)
Content: <poem / lyrics path / story beats>
Music: <path>; timing: <srt | timeline.json | beats>
Palette: <default watercolor | ink-sumi | 5-7 hex>
Subjects: <1-3 simple subjects>
Format: <1080x1080 | 1080x1920> <24 | 30> fps, <seconds> s
```

## Quality bar

- [ ] Frame N rendered twice gives identical hashes (`still` twice + `md5sum`, or `ffmpeg -f framemd5` on two renders)
- [ ] Boiling and grain are visible but subtle (jitter at most 1.5 px)
- [ ] At least 40% empty paper in most frames
- [ ] At most 7 colors with restrained saturation
- [ ] Lyrics and text legible on the paper
- [ ] Average draw time per frame stays under about 2 s, so a 30 s render finishes in reasonable time

## Pitfalls

- **File size**: animated grain inflates MP4s (25 MB for 20 s at crf 18); render with `--crf 22`.
- **Flicker**: unseeded randomness changes every stroke each frame. Re-seed at the start of every frame.
- **Accumulation**: the default p5 `draw()` loop paints on top of the last frame, so seeking or parallel capture breaks. Redraw from scratch in `renderFrame`.
- **Wrong size**: a high-DPI screen doubles the canvas; set `pixelDensity(1)`.
- **Minutes per frame**: dozens of watercolor fills per frame are very slow. Pre-render static layers once and composite them.
- **Clip-art colors**: fully saturated digital colors kill the watercolor feel; desaturate.

## Variants

- **ink-sumi**: black ink `#1A1A1A` on rice paper `#EFE8D8`, a single vermilion `#C0392B` seal stamp, brush-calligraphy title; strokes taper with pressure.
- **painted-reveal**: line art reveals left to right over 60-90 frames, then washes fill in the same direction; keep it procedural (externally generated color masters make it hybrid).
- **abstract-flow**: no characters; a flow field of brush strokes whose length and opacity follow the music amplitude (precompute an amplitude array per frame from the audio).
