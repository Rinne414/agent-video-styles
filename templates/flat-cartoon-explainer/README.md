# flat-cartoon-explainer

Bright flat-vector pop-science explainer ("How does a rainbow form?", 52.9 s, 1920x1080, 30 fps) with a code-drawn host, word-pinned actions, iris wipes and captions. Built with HyperFrames 0.8.143 (GSAP + inline SVG). All characters, graphics and audio are generated in code or by TTS.

## Render
```
pnpm install            # only needed for the font packages
pnpm run render         # writes out/flat-cartoon-explainer.mp4 (about 1.5 min)
pnpm run check          # lint + layout + contrast
pnpm run still          # PNG stills in snapshots/
```
`render` runs `scripts/build.mjs` first, which regenerates `index.html` from `content.json` and `assets/audio/timeline.json`. Do not edit `index.html` by hand.

## Edit
- `content.json`: narration segments, voice, scene list (which segments each scene covers, iris color), palette, on-screen labels, timing (lead, gap, end hold).
- New narration: edit `segments`, then `pnpm run tts` (needs `python`, `edge-tts`, ffprobe) and render. Scene animations are pinned to words by name in `src/anim.js` (for example `w("s3", "refraction")`); if you change the wording, keep or update those trigger words.
- `src/geom.mjs`: outline width, Pip the host, sun, cloud, drops and the refraction geometry. `src/scenes.mjs`: layout of each scene. `src/anim.js`: timing. `src/style.css`: type.

Fonts (Baloo 2, Nunito) come from `@fontsource` packages and are copied into `fonts/` at build time (36 KB). GSAP 3.14.2 is vendored in `vendor/`.
