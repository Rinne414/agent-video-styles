# editorial-swiss

"Annual report 2026 in five numbers": a 25 s, 1920x1080, 30 fps silent video in the Editorial Swiss Grid style (strict 12-column grid, flush-left Inter Tight, 440 px rolling numerals, hairline rules, mono labels, one red signal color). Tool: HyperFrames 0.8.143 + GSAP 3.14.2. All figures and the studio are fictional and labelled "Sample data" on screen.

## Render

```
pnpm install
pnpm run render     # builds index.html, writes out/editorial-swiss.mp4
pnpm run check      # build + hyperframes check
```

`pnpm run still -- 2,5,8.8` builds, then writes PNGs to `snapshots/` (delete the folder afterwards).

## Edit

- `content.json`: title, meta, the five stats (digits, suffix, kicker, headline lines, body), colophon, colors, scene lengths in frames. Total length is computed from `timing`.
- `src/theme.mjs`: grid (`col(n)`, `span(k)`), type sizes, vertical positions, motion durations. Every x position is generated from `col()`.
- `scripts/build.mjs` generates `index.html` (static markup, `data-at` start frames) and copies fonts (`@fontsource/inter-tight`, `@fontsource/ibm-plex-mono`) and GSAP into `fonts/` and `vendor/`. `src/anim.js` is the generic GSAP timeline.
- Digit strings of more than 3 characters need a smaller `TYPE.numeral` in `src/theme.mjs`.
