# storybook-picture-book

A 40-second bedtime picture book, "Moko, the little cloud who wanted to rain", drawn entirely in code: watercolor-paper grain, wobbly soft shapes, a page turn between scenes, one caption line per page and a gentle en-US-JennyNeural narration. Tool: HyperFrames `0.8.143` (SVG + GSAP). Style: experimental. All names and the story are fictional sample content.

## Render

```
pnpm install
pnpm run render      # builds index.html, writes out/storybook-picture-book.mp4 (1920x1080, 30 fps)
pnpm run check       # lint + layout + contrast
pnpm run still       # snapshots/ stills, one per page
```

Needs Node 22+, pnpm, FFmpeg and Chrome. Rendering takes about 75 s on an RTX 3090. No network is needed: GSAP and the Baloo 2 font come from pinned npm packages and are copied into `vendor/` and `fonts/` by the build.

## Edit

Everything editable lives in `content.json`: title, page captions (max 14 words each), the scene type of each page, voice and rate, palette hex values, and page-turn / lead / tail frame counts. Scene art lives in `scripts/pages.mjs` (one function per scene type), primitives in `scripts/art.mjs`, tokens in `scripts/theme.mjs`, the timeline in `scripts/anim.js`. `scripts/build.mjs` writes `index.html` from them plus `assets/audio/timeline.json`.

To change the story:

```
pnpm run tts         # regenerates assets/audio/*.mp3 + timeline.json from content.json (needs edge-tts and internet)
pnpm run render
```

Page lengths follow the narration automatically. Scene types: `cover`, `dry`, `droop`, `puff`, `sad`, `first`, `rain`, `bloom`, `night`. Edge TTS is an unofficial client; check Microsoft's terms before commercial use.

## Notes

- Grain and wobble are seeded, so two renders match visually (PSNR 56 dB); they are not byte-identical.
- The audio is narration only; no music is shipped.
