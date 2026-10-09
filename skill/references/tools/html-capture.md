# Raw HTML capture (p5.js, canvas, any page)

Script: `skill/scripts/capture_html.mjs`. It opens a local HTML page in headless system Chrome, calls `window.renderFrame(i, fps)` once per frame, screenshots, and pipes PNGs to ffmpeg (h264, yuv420p, optional aac). Verified here: Node 25, Chrome 155, puppeteer-core 25.13.0 (Apache-2.0), ffmpeg 8.1, p5.js 2.3.4, Windows 11.

## When to use it

- Use for art that is not HyperFrames-native: p5.js sketches, hand-written canvas 2D, generative/creative-coding pieces, an existing web page that can be stepped by frame index.
- Prefer HyperFrames (`hyperframes.md`) when the piece is text/UI/GSAP motion, needs captions or audio mixing, or needs `check`/lint. HyperFrames also renders canvas and Three.js if you drive them from time.
- Not for pages that animate off wall-clock time (`requestAnimationFrame`, `Date.now()`, CSS animations); this script does not slow or freeze them. Rewrite them as a pure function of `i`.

## The contract

```js
window.renderFrame = async (i, fps) => { /* draw frame i completely, then return */ };
window.__ready = somePromise;   // optional: resolve when assets/fonts are loaded (default: document.fonts.ready)
```

- `renderFrame` may be sync or return a Promise; the script awaits it, then screenshots. Frames are requested in order 0..N-1, once each, but write it as if any frame could be requested alone: output depends only on `(i, fps)`.
- Time is `t = i / fps`. Never read the clock.
- The page is loaded once; state may persist between frames, but do not rely on it (see seeding).

## Seeding rules

- Reseed at the start of every frame, not once at load: `p.randomSeed(SEED); p.noiseSeed(SEED);` inside `draw`/`renderFrame`. Then the sketch is stateless and frame 60 is the same whether you render 0..150 or just 60.
- Use the sketch's seeded RNG (`random`, `noise`) or your own seeded PRNG (mulberry32); never bare `Math.random()`.
- Particle/physics simulations that accumulate state must be replayed from frame 0 to i inside `renderFrame` (fine up to a few thousand steps) or computed analytically from `t`.
- Verified: two runs of the p5 sketch below produced identical per-frame hashes (`ffmpeg -f framemd5`).

## Minimal p5.js example (instance mode, noLoop)

```html
<script src="p5.min.js"></script>   <!-- copy node_modules/p5/lib/p5.min.js next to the page; no CDN -->
<script>
const W = 1080, H = 1080, SEED = 7;
let frameIdx = 0, fpsNow = 30;
new p5((p) => {
  p.setup = () => { p.createCanvas(W, H); p.pixelDensity(1); p.noLoop(); };
  p.draw = () => {
    p.randomSeed(SEED); p.noiseSeed(SEED);
    const t = frameIdx / fpsNow;
    p.background(14, 16, 30); p.noStroke();
    for (let k = 0; k < 120; k++) {
      const a = p.random(p.TWO_PI), r = p.random(80, 480) + 40 * Math.sin(t * 2 + k);
      const n = p.noise(k * 0.1, t * 0.5);
      p.fill(p.lerp(80, 255, n), p.lerp(120, 90, n), 220, 200);
      p.circle(W / 2 + Math.cos(a + t * 0.4) * r, H / 2 + Math.sin(a + t * 0.4) * r, 8 + 30 * n);
    }
  };
  window.renderFrame = async (i, fps) => { frameIdx = i; fpsNow = fps; await p.redraw(); };
});
</script>
```

`pixelDensity(1)` matters: on a HiDPI display p5 otherwise draws a 2x canvas. The canvas size must equal `--width/--height`. `await p.redraw()` worked on p5 2.3.4 (p5 1.x [not run here]).

## Running it

```bash
npm i puppeteer-core p5            # in the template dir; puppeteer-core downloads no browser (6 s here)
node skill/scripts/capture_html.mjs sketch.html --out out.mp4 --width 1080 --height 1080 --fps 30 --frames 150
node skill/scripts/capture_html.mjs sketch.html --out out.mp4 --frames 150 --audio tone.mp3     # audio is trimmed to the video (-shortest)
node skill/scripts/capture_html.mjs sketch.html --out out.mp4 --frames 10 --selector canvas     # screenshot only the canvas element
```

Stills and partial renders: `--start N` begins at frame N (frames N..N+frames-1), and an `--out` ending in `.png` writes a single PNG of frame `--start` (no ffmpeg). Frame 480 needs no 480-frame render:

```bash
node skill/scripts/capture_html.mjs sketch.html --out still.png --start 480                   # one PNG of frame 480
node skill/scripts/capture_html.mjs sketch.html --out clip.mp4 --start 300 --frames 60        # frames 300..359
ffmpeg -y -ss 2.0 -i out.mp4 -frames:v 1 still.png                                              # any frame of a finished render
```
(`--start` and PNG mode verified: a PNG of frame 300, a 15-frame clip starting at 300, and rejection of `--start -2`.)

Verified output: 150 frames at 1080x1080 -> 5.00 s h264 yuv420p + aac, 0.78 MB, ~9 s wall time (about 16 frames/s). Run from any directory; the script path may contain spaces.

Options: `--width/--height` (must be even), `--fps`, `--frames`, `--start`, `--crf` (default 18; animated grain inflated a 20 s clip to 25 MB, so use `--crf 22` for templates with grain), `--audio`, `--selector`, `--chrome <path>`. Chrome is found via `--chrome`, `CHROME_PATH`, then the usual Windows/macOS/Linux install paths (the Windows and macOS/Linux candidate paths other than `C:/Program Files/Google/Chrome/...` were not exercised here).

## Loading content.json

Opened via `file://`, Chrome blocks `fetch()` and ES modules for local files. Use a build step that reads `content.json` and writes `out/content.js` (`window.CONTENT = {...};`), and load it and your scripts as classic `<script src>` tags before the sketch. Re-run the build after editing content.

## Standalone templates

Copy `capture_html.mjs` into the template (e.g. `scripts/capture_html.mjs`) and call it from there; a `../../skill/scripts/...` path breaks once the template is extracted. Keep `puppeteer-core` in the template's `package.json`.

Check determinism by rendering one still twice and comparing `md5sum`, or by `ffmpeg -i out.mp4 -f framemd5 -` on two renders.

Dependencies: Node (25 tested), ffmpeg on PATH, Chrome/Chromium installed, `puppeteer-core` resolved from the current directory first, then the script's folder. Put `puppeteer-core` (and `p5`) in the template's `package.json`; the script itself has no other imports.

## Verify

```bash
ffprobe -v error -show_entries stream=codec_name,pix_fmt,width,height,nb_frames -of csv out.mp4
ffmpeg -y -ss 2 -i out.mp4 -frames:v 1 f.png          # then look at it
python skill/scripts/inspect_video.py out.mp4         # writes sheet.png into the cwd: run from a scratch dir
```

## Pitfalls

- Page errors and `console.error` are echoed to stderr; a missing `renderFrame` aborts with `window.renderFrame(i, fps) is not defined`.
- Odd width/height are rejected up front (yuv420p needs even sizes).
- Web fonts: load them from local files via `@font-face` (an `@fontsource` woff2 can be referenced by relative URL straight from `node_modules/@fontsource/<name>/files/`) and make `__ready` wait for `document.fonts.load(...)`; frame 0 otherwise renders in a fallback font. System-font fallbacks differ per machine.
- `file://` pages load relative scripts via `<script src>` (verified for p5); `fetch()` of local files is blocked, see Loading content.json.
- Do not draw with `loop()`; an extra automatic `draw` between calls is harmless only if the sketch is stateless.
- Screenshot cost dominates; a 1080p frame is roughly 60 ms. For >3000 frames prefer HyperFrames or lower `--fps`.
- WebGL canvases screenshot fine via Chrome's compositor, but GPU vs software output may differ slightly across machines.
- On failure ffmpeg's stdin is closed; check for a partial MP4 and delete it before retrying.
