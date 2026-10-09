# apple-keynote-minimal

A 25 s, 1920x1080, 30 fps silent product reveal for the fictional note app "Halo 5": black stage, huge Inter type, one thing at a time. The app window and phone are drawn in CSS, so no images are needed. Built with HyperFrames 0.8.143 + GSAP 3.14.2 (vendored).

## Render

```
pnpm run check     # lint, layout, contrast
pnpm run still     # PNG stills + contact sheet in snapshots/
pnpm run render    # writes out/apple-keynote-minimal.mp4
```

`pnpm run` first runs `scripts/build.mjs`, which turns `content.json` into `content.js` and sets the root duration. Fonts (Inter) are fetched from Google Fonts on the first run and cached by HyperFrames; later renders are offline.

## Edit

`content.json` holds the copy for every scene, the counter values (`from`, `value`, `unit`) and each scene's length in frames. Scene order is fixed in `index.html`. The `theme` block documents the palette, but colors are applied from the `<style>` block of `index.html`; edit them there.
