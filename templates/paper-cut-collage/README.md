# paper-cut-collage

"The journey of tea in four moments": a 30 s, 1920x1080, 30 fps silent film in the paper-cut collage style. Torn-edge paper pieces, patterns, grain, soft shadows, stop-motion on twos. Everything is drawn in code (SVG), no images. All content is fictional sample content.

Tool: HyperFrames `0.8.143` (GSAP proxy tween drives one SVG layer per held frame).

## Render

```
pnpm run render      # builds index.html from content.json + src/, writes out/paper-cut-collage.mp4 (about 1 minute)
pnpm run check       # lint + layout + contrast
pnpm run still       # snapshots/ PNGs at fixed times
```

Needs Node 22+, FFmpeg, Chrome. No network at render; GSAP is in `vendor/`, fonts (Fredoka 600, Caveat Brush 400, both OFL, from `@fontsource`) in `fonts/`. The first `npx` call downloads the CLI.

## Edit

- `content.json`: palette, title and sub tag, the four moment titles and start frames, end card text and frame, hold frames (2 = on twos, 3 = chunky), grain opacity, fonts and their width factors.
- `src/paper.js`: torn-edge engine, patterns, tags (the look). `src/scenes-a.js`, `src/scenes-b.js`: one function per scene. `src/main.js`: frame driver, camera, wipe.
- `index.html` is generated; do not edit it by hand.

Moment start frames must be even numbers when hold is 2. Scene and animation timings inside scenes are in scene-local frames.
