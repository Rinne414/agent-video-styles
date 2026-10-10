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
| Composition | one subject per scene and at least 40% empty paper (measure: fraction of pixels within a small delta of the paper color, one python/ffmpeg line on a still) |
| 9:16 (1080x1920) | Keep 200 px top and 340 px bottom free of text. Type stays 56-72 px (do not scale it with the canvas); put the text block in the upper third, left-aligned near x 120 and y about 340, and the art in the lower two thirds. Washes may bleed to the edges; text never crosses an edge. Scale the subject to roughly 40-60% of the width so the empty-paper share holds on the tall canvas (placement from one run, adjust by eye) |

## Reference brushes (stateless; [not run here as written; condensed from a regression run's brush design])

Jitter comes from a hash of `(stroke, bristle, step, floor(i/3))`, with step as the major index, so drawing on to a partial `t` never shifts earlier points and nothing flickers or wobbles between frames.

```js
const hash = (a, b, c, d) => { let h = (a * 374761393 + b * 668265263 + c * 2147483647 + d * 1274126177) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function brush(ctx, pts, { id, i, t = 1, w = 14, n = 7, color, alpha = 0.5, boil = 1.2 }) {   // pts: [{x,y}] along the path
  const steps = Math.max(2, Math.floor(pts.length * t)), fr = Math.floor(i / 3);
  ctx.strokeStyle = color; ctx.lineCap = "round";
  for (let k = 0; k < n; k++) {
    const off = (k / (n - 1) - 0.5) * w;
    for (let j = 1; j < steps; j++) {
      if (hash(id, k, j >> 3, 7) < 0.12) continue;                      // dropout in runs of 8 steps
      const u = j / (steps - 1), taper = Math.sin(Math.PI * Math.min(1, u * 0.9 + 0.05));   // thin at both ends
      const a = pts[j - 1], b = pts[j], dx = b.x - a.x, dy = b.y - a.y, L = Math.hypot(dx, dy) || 1;
      const jx = (hash(id, k, j, fr) - 0.5) * 2 * boil, jy = (hash(id, k, j, fr + 99) - 0.5) * 2 * boil;
      ctx.globalAlpha = alpha * (0.6 + 0.4 * hash(id, k, 0, 3)); ctx.lineWidth = Math.max(0.8, (w / n) * 1.6 * taper);
      ctx.beginPath(); ctx.moveTo(a.x - dy / L * off * taper + jx, a.y + dx / L * off * taper + jy);
      ctx.lineTo(b.x - dy / L * off * taper + jx, b.y + dx / L * off * taper + jy); ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;
}
function makeWash(seed, r, color) {                                        // build once, cache, then drawImage with an alpha ramp
  const c = document.createElement("canvas"); c.width = c.height = Math.ceil(r * 2.4); const g = c.getContext("2d");
  g.translate(c.width / 2, c.height / 2); g.fillStyle = color; g.globalAlpha = 0.07;
  for (let layer = 0; layer < 14; layer++) { g.beginPath();
    for (let a = 0; a < 24; a++) { const th = a / 24 * Math.PI * 2, rr = r * (0.8 + 0.2 * hash(seed, layer, a, 1)) * (1 - layer * 0.012);
      a ? g.lineTo(Math.cos(th) * rr, Math.sin(th) * rr) : g.moveTo(Math.cos(th) * rr, Math.sin(th) * rr); }
    g.closePath(); g.fill(); }
  g.globalAlpha = 0.18; g.strokeStyle = color; g.lineWidth = 2; g.stroke();   // darker edge on the last polygon
  return c;
}
```
Use `ctx.setTransform(1,0,0,1,0,0)` and `globalCompositeOperation = "source-over"` at the start of every frame.

## Motion grammar

- **Draw-on**: a stroke reveals over 12-30 frames by drawing its path only up to fraction `t` of its length.
- **Wash bloom**: 18-36 frames; radius and opacity grow with `easeOutCubic`.
- **Boiling line**: re-seed outlines every 3 frames (`seed = base + floor(i / 3)`), jitter amplitude at most 1.5 px; this is the hand-made wobble.
- **Characters on threes**: hold each drawing 3 frames (about 8-10 drawings per second).
- **Camera**: slow pan or zoom of the art layer only (text stays fixed on the safe area), about 0.7% per second, total zoom at most ~15%.
- **Transitions**: a big brush stroke wipes the frame in 15-20 frames, or washes fade back to blank paper.
- **Lyrics**: fade in + 6 px rise over 10 frames, hold for the line, fade out over 8 frames. For a poem or haiku, lines instead stay and stack, and the Close holds the full text (washes may fade, the text does not).

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
- [ ] Average draw time per frame stays under about 2 s. Budget: a layered scene with 10+ bristle strokes and full-frame grain ran about 0.65 s/frame at 1080x1920 (450 frames in 293 s, 1.5 fps), so plan about 5 min per 15 s and shard the render (`../tools/html-capture.md`)

## Pitfalls

- **File size**: animated grain inflates MP4s (25 MB for 20 s at crf 18); render with `--crf 22`.
- **Flicker**: unseeded randomness changes every stroke each frame. Re-seed at the start of every frame.
- **Accumulation**: the default p5 `draw()` loop paints on top of the last frame, so seeking or parallel capture breaks. Redraw from scratch in `renderFrame`.
- **Wrong size**: a high-DPI screen doubles the canvas; set `pixelDensity(1)`.
- **Minutes per frame**: dozens of watercolor fills per frame are very slow. Pre-render static layers once and composite them.
- **Creatures**: draw bodies thin; make the neck and legs the signature and wings long and tapered. A stiff rigid bar for a wing upstroke reads as a bug, so bend wings through 2-3 control points between poses.
- **Clip-art colors**: fully saturated digital colors kill the watercolor feel; desaturate.

## Variants

- **ink-sumi**: black ink `#1A1A1A` on rice paper `#EFE8D8`, a single vermilion `#C0392B` seal stamp, brush-calligraphy title; strokes taper with pressure.
- **painted-reveal**: line art reveals left to right over 60-90 frames, then washes fill in the same direction; keep it procedural (externally generated color masters make it hybrid).
- **abstract-flow**: no characters; a flow field of brush strokes whose length and opacity follow the music amplitude (precompute an amplitude array per frame from the audio).
