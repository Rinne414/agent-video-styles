# abstract-generative-loop

Seamless 8 s, 1080x1080, 30 fps silent loop for a website hero: soft glowing shapes and particles morphing in a warm palette. Frame 240 is pixel-identical to frame 0, so the video is rendered with exactly 240 frames. Tool: HTML capture (canvas 2D + `capture_html.mjs`). Fictional, code-drawn content only.

## Render

```
pnpm install
pnpm run render      # writes out/abstract-generative-loop.mp4
pnpm run still       # out/still.png (frame 0)
pnpm run seam        # numeric seam check (needs python + numpy + pillow)
```

Needs Node 22+, ffmpeg and Chrome on PATH. Embed with `<video autoplay loop muted playsinline>`.

## Edit

Everything is in `content.json`: `palette`, `ground`, `seed` (new layout), `shapes`, `particles`, `glow`, `frames` (multiple of 60; 240 = 8 s, 360 = 12 s). `src/loop.js` holds the motion, all periodic in the loop phase.
