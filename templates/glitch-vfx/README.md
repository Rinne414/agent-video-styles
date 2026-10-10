# glitch-vfx: Pixel Rift intro

10 s, 1920x1080, 30 fps silent studio intro in the Glitch & VFX Hype style (experimental). The whole frame is drawn on one canvas from a pure function of the frame number, driven by a GSAP proxy tween under HyperFrames. Burst schedule, tear slices and shatter tiles come from seeded generators.

## Render

```
pnpm install      # only needed to refresh fonts (fonts/ and vendor/ are committed)
pnpm run render   # builds index.html, writes out/glitch-vfx.mp4
pnpm run still    # snapshots at key times into snapshots/
pnpm run check
```

## Edit

Everything is in `content.json`: studio name and tagline, HUD labels, colors, font sizes, layout, `seed`, beat frames, the `bursts` list (start, length, intensity), shatter and tear settings. Set `"reducedFlashing": true` to halve intensity and cap bursts at 3 frames. `index.html` is generated from `src/` by `scripts/build.mjs`; do not edit it by hand.

Code: `src/theme.js` (tokens), `logo.js` (pixel-rift mark and hologram), `scene.js` (per-frame state), `fx.js` (bursts, split, tear, shatter), `main.js` (compositor).
