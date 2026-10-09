# code-terminal-walkthrough

A 35 s, 1920x1080, 30 fps silent code walkthrough: "Add rate limiting to an Express API in 3 steps". Syntax-highlighted code types itself, a diff adds `app.use(limiter)`, and a terminal runs a curl loop until the API answers `429 Too Many Requests`. Built with HyperFrames; Shiki (`github-dark`) tokenizes the code once at build time.

The code shown was run for real (express 5.3.0, express-rate-limit 8.7.1) and the terminal output in `content.json` is the captured output.

## Render

```
pnpm install
pnpm run render      # writes out/code-terminal-walkthrough.mp4 (about 1.5 min)
pnpm run check       # HyperFrames lint, layout and contrast check
pnpm run still       # PNG stills into snapshots/
```

`pnpm run build` regenerates `index.html` (generated file, do not edit it by hand). Requires Node 22+, FFmpeg and Chrome. The render needs no network: GSAP and fonts are copied from npm packages into `vendor/` and `assets/fonts/`.

## What to edit

Everything editable is in `content.json`:

- `timing`: scene lengths in seconds (the total is the video length)
- `hook`, `outro`, `steps`: titles and labels
- `install`: command and output
- `file.lines`: the code, one entry per line; `group` `A`/`B` marks lines that type in during step 2, `C` marks the diff lines of step 3; `callout` adds a label to a line
- `run`: the multi-line command, the captured output (`output`), `limit` (how many lines are 200s), the final command and badge
- `colors`: accent, prompt, added and removed colors

Style tokens (font sizes, typing speeds, zoom, focus timing) are in `scripts/theme.mjs`; scenes are in `scenes/`. If you change the code, run it for real and paste the real output into `content.json`.
