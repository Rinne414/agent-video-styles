# saas-launch-promo (Driftboard)

30 s, 1920x1080, 30 fps silent launch film for a fictional async-standup app. Style: `saas-launch-promo` (dark canvas, one indigo accent, kinetic headlines, code-built UI cards). Built with Remotion 4.0.534. All names and numbers are fictional.

## Render

```
pnpm install
pnpm run render      # writes out/saas-launch-promo.mp4 (about 80 s)
pnpm exec remotion still driftboard-launch out/still.png --frame=330
```

Inter is bundled from `@fontsource/inter`, so rendering needs no network. Chrome Headless Shell is downloaded by Remotion on first render.

## Edit

Everything editable lives in `content.json`: brand name, accent color, font family name, all copy (hook, taglines, feature headlines, teammate rows, proof number, CTA) and the scene timing in frames. Cuts sit on a 120 BPM grid (15-frame beats); keep timing values multiples of 15 when you change them. `src/theme.ts` reads the JSON; scenes are in `src/scenes/`.

To use another font, install its `@fontsource/*` package, change the imports in `src/fonts.ts` and `brand.font` in `content.json`.

## License note

Remotion is free for individuals and companies of up to 3 people. Companies of 4+ need a Company License: https://www.remotion.pro/license
