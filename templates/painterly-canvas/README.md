# painterly-canvas

A 20 s, 1080x1080, 30 fps silent poem video in a watercolor-and-ink look. Four lyric lines, one subject (a rainy window) whose glass is repainted by a brush wipe for each line: rain, rivulets of light, a softening city, a warm lamp with a small figure. Everything is drawn procedurally on a 2D canvas (bristle strokes, cached wash sprites, seeded grain) and is a pure function of the frame number.

Sample content is fictional and the poem is a short original text.

## Render

```
pnpm install
pnpm run render          # writes out/painterly-canvas.mp4 (about 4 minutes on an RTX 3090 machine)
pnpm run still -- 40 200 480   # PNG stills of chosen frames into out/stills/
```

`render` uses `scripts/capture_html.mjs`, a copy of the skill's capture script (headless Chrome + ffmpeg), so this folder works on its own.

## Edit

All copy, colors, timings and the font are in `content.json`:

- `lines`: text and `start`/`end` frame for each lyric line
- `stages`: frame where each glass stage (and its brush wipe) begins
- `palette`: paper, ink and the six paint colors (keep saturation restrained)
- `video.frames`, `closeStart`, `credit`

`scripts/build-content.mjs` converts `content.json` to `out/content.js` (Chrome blocks `fetch` of local files); `render` and `still` run it first. Scene art (window, rain, rivulets, city, figure) is in `src/scenes.js`; brush and wash primitives in `src/brush.js`; tokens in `src/theme.js`.
