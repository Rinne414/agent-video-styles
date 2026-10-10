# visual-journalism

A Vox-style explainer: near-black ground, cream paper cards, source-tagged code-drawn illustrations, marker highlights that wipe on the spoken word, dashed annotations that draw on. Sample topic: why the shipping container changed world trade (36.5 s, 1920x1080, 30 fps, English narration, `en-US-GuyNeural`).

Style recipe: `skill/references/styles/visual-journalism.md` (experimental). Tool: HyperFrames `hyperframes@0.8.143`.

All graphics are code-drawn illustrations (tagged ILLUSTRATION on screen). Facts and their sources are listed in `STORYBOARD.md` and `sources.json`.

## Render

```
pnpm install        # optional, no dependencies
pnpm run render     # builds index.html, renders out/visual-journalism.mp4
pnpm run check      # build + HyperFrames lint/layout/contrast
pnpm run still      # build + snapshots of key moments in snapshots/
```

Needs Node 22+, ffmpeg, Chrome. No network at render time (GSAP and fonts are vendored in `vendor/` and `fonts/`).

## Edit

Everything editable is in `content.json`: narration (`narration[].speech`), all on-screen copy (`scenes`), sources, colors, fonts and motion tokens (`theme`), voice and timing.

After changing narration, regenerate the audio and rebuild:

```
pnpm run tts        # content.json -> assets/audio/script.json -> mp3 + timeline.json (needs python + edge-tts)
pnpm run render
```

Scene lengths follow the narration. Highlights and annotations bind to spoken words through `data-cue="word"` in `scripts/scenes/*.mjs` (the build fails loudly if a cue word is missing from the narration).

## Layout

- `scripts/theme.mjs`: the single theme module (reads `content.json`)
- `scripts/scenes/s1..s7.mjs`: one file per scene (markup and code-drawn art)
- `scripts/art.mjs`: seeded drawing helpers; `scripts/build.mjs`: generates `index.html`
- `src/runtime.js`: inline GSAP runtime (cards, highlights, dashed draw-on, pops)
