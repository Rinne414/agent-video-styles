# chat-social-ui

A 20 s vertical story told as a dark phone chat thread: typing indicators, sent/received bubbles, receipts, a heart reaction, then a social post card ("Shipped.") with counters ticking up. Silent. Tool: HyperFrames 0.8.143 + GSAP 3.14.2. Experimental style. All names and numbers are fictional.

## Render

```
pnpm install
pnpm run render      # builds index.html, renders 1088x1920, crops to out/chat-social-ui.mp4 (1080x1920)
pnpm run check       # build + hyperframes lint/layout/contrast check
pnpm run still -- 0.8,5,14.7,19   # build + snapshots at those seconds
```

## Edit

Everything is in `content.json`: theme colors, both names, the timestamp, the message script (`from`, `lines`, optional `reaction`), the post card text and counter targets, duration and the jitter seed.

- Each message is an array of `lines` (one string per rendered line, max about 28 characters at 44 px). Bubble height is `lines.length`, never measured.
- Timing is derived from the text length (`scripts/schedule.mjs`), so a longer script pushes the post card later. `pnpm run build` prints the frame table and warns if the end card settles after 90% of the video.
- Style tokens (sizes, frames, radii) live in `scripts/theme.mjs`. `index.html` is generated; do not edit it.
- Fonts (Inter 400-700) and GSAP are copied from npm packages into `fonts/` and `vendor/` by the build, so rendering needs no network.
