# vintage-sketch template

Engraving-style line art drawn on sepia paper with rust-red handwritten-style notes: a printed field guide in motion. This sample explains how a mechanical clock keeps time (weight or spring, escapement, pendulum). Silent, 25 s, 1920x1080 at 30 fps. HyperFrames 0.8.143 + GSAP 3.14.2 (vendored). All content is fictional sample content; the drawing is a schematic, not to scale.

## Render

```
pnpm run render      # builds index.html from content.json, renders out/vintage-sketch.mp4
pnpm run check       # lint, layout and contrast audit
pnpm run still       # snapshots/ (delete afterwards)
pnpm run bake        # only after changing theme.paper or theme.ink: re-bakes assets/paper.jpg
```

No `pnpm install` is needed (no dependencies); `npx` fetches the pinned CLI on first run. Fonts (EB Garamond, OFL) and GSAP are vendored in `fonts/` and `vendor/`, so rendering needs no network.

## Edit

Everything editable is in `content.json`: colors, font sizes, line widths, per-scene frame lengths, headline and note text, note positions (`x`, `y`), the frame each note appears (`at`, relative to the plate start) and its leader line (`lead`: x1, y1, x2, y2). `index.html` is generated, do not edit it by hand.

The drawings are code: `src/scenes.mjs` (one builder per scene), `src/geom.mjs` (gear, spiral, hatch generators), `src/theme.mjs` (the only place tokens become CSS), `src/anim.js` (GSAP timeline). Mechanical motion (weight sinking, five escapement beats, pendulum swing) is timed in `src/anim.js`.

## Notes

- The rust "handwritten" notes use EB Garamond italic, as the style recipe specifies; a true script font would need a vendored OFL font.
- Facts used: a seconds pendulum is about one metre long; the anchor escapement dates from the 1670s.
