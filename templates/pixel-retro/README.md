# pixel-retro: Morning Quest

18 s, 1080x1920, 30 fps, silent pixel-art PSA at an implied 120 BPM (1 beat = 15 frames). A pixel hero completes three quests (drink water, stretch, pick one task), each with a +20 XP pop, then levels up: "LV UP! Have a good day".

Tool: HyperFrames `0.8.143`. A 270x480 logical canvas is drawn with integer coordinates and scaled 4x with `image-rendering: pixelated`. Palette: PICO-8 16. Font: Press Start 2P (OFL, `@fontsource`), rasterised to palette-pure pixels.

## Render

```
pnpm install
pnpm run render        # builds index.html, writes out/pixel-retro.mp4
pnpm run still         # snapshots/ PNGs (edit the --at times in package.json)
```

The page is composed 1088 px wide (artwork in the left 1080 px) and cropped to 1080x1920 by ffmpeg, because HyperFrames 0.8.143 renders the right-most 8 px black when the width is not a multiple of 16; the uncropped render is `out/raw.mp4`.

## Edit

Everything is in `content.json`: palette, title and quest copy, XP values, task names, level-up text, sky colors per scene, sun position, scene lengths in frames (`timing`, keep them multiples of 15 to stay on the beat), `crt` overlay on/off. `scripts/build.mjs` regenerates `index.html` from `content.json` and `src/*.js`; do not edit `index.html` by hand. Quest action timing (`completeAt`) is in frames relative to the quest start; the hero poses in `src/scenes.js` are keyed to the same beat grid.
