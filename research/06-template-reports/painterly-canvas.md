# Template report: painterly-canvas

## Result
- `templates/painterly-canvas/out/painterly-canvas.mp4`: 20.00 s, 1080x1080, 30 fps, h264, silent, 25.6 MB (grain defeats compression; preview is 1.9 MB).
- Full render: 234 s (0.39 s/frame, other agents rendering in parallel). Full renders used: 1 of 3. Stills rendered: about 20 frames over 3 iterations (each still run ~4 s/frame including page start).
- Tool: raw HTML capture, canvas 2D, own seeded PRNG (no p5 / p5.brush; see gaps). Font: `@fontsource/cormorant-garamond` 5.2.11 italic 500. `puppeteer-core` 25.13.0.
- Preview: `previews/painterly-canvas.mp4` + `.webp` made with `make_preview.py`.

## Quality bar
- Frame N rendered twice gives identical hashes: PASS. PNG md5 of frame 480 from two separate runs identical (540cdbb5...); frame 333 rendered alone and after 480 in the same page also identical (d26934ae...). Verified on stills, not on the mp4.
- Boiling and grain visible but subtle (jitter <= 1.5 px): PASS. Strokes re-seeded every 3 frames with jitter 0.8-1.4 px; grain cycles 3 seeded variants every 3 frames. Visible in stills as dashed bristle edges; whether the motion is "subtle" in playback was judged from stills only.
- At least 40% empty paper in most frames: PASS (judged by eye on sheet): window plus halos cover roughly 35-45% of the canvas, rest is paper. Peak frames (lamp bloom, f480) are the tightest; I shrank the window from 700x600 to 560x480 after the first still pass failed this.
- At most 7 colors, restrained saturation: PASS. Only the seven palette hexes plus their mixes with paper; ochre and vermilion at f480 are the strongest, still warm and muted.
- Lyrics legible on paper: PASS. 68 px italic ink on paper with a light brush band behind; checked at f100, 200, 330, 480, 590.
- Average draw time under about 2 s per frame: PASS. 0.39 s/frame in the full render including screenshot.

## Skill gaps
1. `references/tools/html-capture.md`, "Stills": says to render a short `--frames` clip, but `capture_html.mjs` always starts at frame 0, so a still at frame 480 means rendering 480 frames. Proposed edit: add `--start <frame>` (or `--only 40,200,480` writing PNGs) to the script, or ship a 25-line `scripts/still_html.mjs` like the one in this template (`templates/painterly-canvas/scripts/still.mjs`).
2. `SKILL.md` step 5 says "the tool file shows how to load `content.json`", but `html-capture.md` does not. `file://` blocks `fetch` and ES modules, so the working answer is a tiny build step that writes `out/content.js` (`window.CONTENT = ...`) plus classic `<script>` tags. Proposed edit: add a "content.json" section to `html-capture.md` with exactly that pattern.
3. `styles/painterly-canvas.md`, Look/Brushes: names p5.brush as primary, but p5.brush needs WEBGL mode, has its own seeding and no documented frame-seek behavior; the file gives no verified recipe (the tool file only verifies plain p5). I skipped it and used canvas 2D. Proposed edit: state that raw canvas 2D with a seeded PRNG is an accepted route and add a short verified recipe: bristle stroke (N offset polylines with per-run dropout, taper, jitter noise keyed on `floor(i/3)`) and a cached wash sprite (stacked wobbly polygons at 7% alpha plus darker edge). That is about 80 lines and is what actually made the look.
4. `styles/painterly-canvas.md`, Structure: only a 30 s table (900 frames) with fixed beats; no guidance for scaling to 20 s or for a 4-line poem. I had to map "Scene 1/Scene 2/Climax/Close" onto four lines myself. Proposed edit: add a "short poem" row set (e.g. 4 lines: per-line window = (len - paper - close) / lines).
5. `styles/painterly-canvas.md`, Motion grammar "Camera: transforming the whole canvas": ambiguous whether text moves too; 1-2%/s over 20 s is 20-40% scale. I zoomed only the art layer at 0.7%/s and kept text fixed so it stays on the safe area. Proposed edit: say "art layer only; limit total zoom to about 15%".
6. Wash/paper: the doc gives grain "4-6% luminance" and vignette 15% but no recipe for drawing them deterministically and cheaply. Proposed edit: add "build 3 grain canvases once from the seeded PRNG, multiply-blend one per 3 frames, plus a 36x36 upscaled mottle".
7. `SKILL.md` step 7 and `inspect_video.py` do not check determinism, though the style's first Quality bar item requires hashes. Proposed edit: document the exact check (`still` twice, `md5sum`; or `ffmpeg -f framemd5` on two renders) in the style file or add `--hash` to the script.
8. `html-capture.md` "Web fonts": says load via `@font-face` and wait on `document.fonts.load`, but not that `@fontsource` woff2 files can be referenced straight from `node_modules/.../files/` by relative URL. Proposed edit: one-line example.
9. Size: 25 MB for 20 s at crf 18 because of animated grain. Proposed edit: mention in the style file that animated grain inflates MP4 size and suggest `--crf 22` for templates (the CLI supports it, but the `render` script template in the tool file does not show it).

## Tool issues and fixes
- Bash heredoc with many files failed once (quoting of a long multi-file command); switched to the Write tool. No skill issue.
- Chrome `ctx.filter = "blur()"` and `ctx.roundRect` work in Chrome 155 headless; both used. `ctx.letterSpacing` also works.
- First draft rendered strokes with dashed round-cap "sausage" artifacts where dropout runs were short (buildings looked knitted); fixed by lowering `dry` to 0.03 and raising bristle count to 14.
- Opaque tint strokes with dry gaps revealed the previous stage color as stripes; fixed with `dry` 0.04.
- Pinned versions are in `package.json`; `pnpm install` took 2 s.
- The render script path `../../skill/scripts/capture_html.mjs` makes the template non-standalone (convention says standalone); copy the script when extracting.

## Honest self-assessment
- It reads as an ink-and-wash storybook illustration: grainy warm paper, dry-brush bristle edges, pigment-edged washes, hand-wobbled lines, painted highlighter bands under the poem. The colour arc (cool sky, teal, indigo night, warm lamp) carries the poem.
- A motion designer would criticise: (1) the window is still a rather geometric rectangle with uniform stroke weight, and the glass wipes read as horizontal marker bands, not true watercolor bleeds; (2) no real pigment diffusion or wet-edge blooming, washes are stacked polygons with a blur; (3) rivulets are same-width noodles that all draw top to bottom in lockstep, and the figure is a simple blob (head + shoulders); (4) the S4 palette goes orange-brown from multiplying vermilion over ochre; (5) text reveal is a hard left-to-right clip rather than ink following the brush; (6) 3-frame boil is only applied to stroke jitter, not to washes, so washes feel static; (7) the camera zoom is barely perceptible.
- Not verified: playback feel of the boil and grain (only stills and a 12-frame sheet were viewed); determinism checked on stills rather than on two full renders.
