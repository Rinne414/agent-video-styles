# 05 Toolchain: Remotion on Windows 11 (2026-10-10)

Versions: Node 25.2.1, pnpm 10.30.3, npm 11, ffmpeg 8.1.2, Remotion 4.0.534 (react 19.2.3, three 0.186, @react-three/fiber 9.8), Chrome Headless Shell 157.0.8080.0 (auto-downloaded). Experiments in `<temp>` (short path, see error 1); original scratch dir `...\scratchpad\remotion-smoke\` holds refs and the first (too-deep) copy.

## 1. Reference material
- `git clone --depth 1 https://github.com/remotion-dev/skills` -> 1.4 s. Skills at `skills/skills/remotion-best-practices/` (version 4.0.534): SKILL.md router + remotion-create, -markup (30 rule files: 3d, audio, calculate-metadata, google-fonts, voiceover, transitions...), -render (+transparent-videos.md), -captions, -saas, -maps (mapbox/maplibre/maptiler/cesium/static-map techniques), -studio, -upgrade, -multimedia, -interactivity, -docs.
- Key guidance: scaffold with `npx create-video@latest --yes --blank --no-tailwind <dir>`; start Studio before building and do not render unless asked; CSS transitions/animations banned; use `Interactive` / inline `interpolate`; `premountFor={fps}`; `@remotion/media` `<Audio>`; transparent video flags; `Caption` type + Basic Captions element; install skills via `npx skills add remotion-dev/skills`.

## 2. Commands and outcomes
| # | Command | Outcome |
|---|---------|---------|
| 1 | `npx create-video@latest --help` | lists `--yes`, `--blank`, `--tmp`, `--tailwind/--no-tailwind`, templates (blank, hello-world, three, still, audiogram, ...) |
| 2 | `npx create-video@latest --yes --blank --no-tailwind smoke` | OK, 104 s; it runs `npm install` itself (319 MB node_modules, 10 npm audit warnings). Blank template: `src/{index.ts,Root.tsx,Composition.tsx}`, config has `setRspack(true)`, `setVideoImageFormat("jpeg")` |
| 3 | `rm -rf node_modules package-lock.json` in same compound command | blocked by environment permission; instead copied sources (no node_modules) to new dir |
| 4 | `pnpm install` (copied project) | 12.5 s, 277 MB node_modules; warning "Ignored build scripts: esbuild" (harmless). pnpm store total 347 MB |
| 5 | `pnpm exec remotion add @remotion/google-fonts @remotion/three @remotion/media` | OK 18 s, pinned 4.0.534; prints `'HEXT' is not recognized` (cosmetic) |
| 6 | `pnpm add three @react-three/fiber @types/three` | OK 3.7 s |
| 7 | heredoc with several files in one Bash call | bash parse error (quote in body); switched to Write tool |
| 8 | `pnpm exec remotion render Hello out/hello.mp4` in deep scratch path | FAIL `Failed to launch the browser process! spawn ...chrome-headless-shell.exe ENOENT` (3 times, also after `remotion browser ensure`, which reported "Has browser"). Cause: exe path 261 chars > MAX_PATH 260 (verified: exe runs when invoked by bash with the same path, `--version` OK, but Node spawn fails). Fix: move project to `<temp>` |
| 9 | `pnpm install --frozen-lockfile` at short path | 9.9 s |
| 10 | `remotion render Hello out/hello.mp4` | OK 10.5 s (includes browser download ~11.7 s the step before via `browser ensure`). h264, 1920x1080, 30/1, 90 frames, 3.000 s, pix_fmt yuvj420p, 154 kB |
| 11 | `remotion still Hello out/hello-f45.png --frame=45` | OK 8.3 s |
| 12 | `remotion still Fonts out/fonts.png` | OK 10.2 s. Viewed: Inter, Noto Sans SC simplified, traditional, mixed all render, no tofu |
| 13 | render Alpha `.mov` `--image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444` | OK, 6.7 MB, ffprobe prores `yuva444p12le`; extracted frame corner RGBA = 0 0 0 0 |
| 14 | render Alpha `.webm` `--pixel-format=yuva420p --codec=vp9` | OK, 294 kB; ffprobe native decoder `yuv420p` + tag `ALPHA_MODE=1`; `-c:v libvpx-vp9` shows `yuva420p` |
| 15 | render Spin3D with `--gl` default / angle / swangle / egl / angle-egl | all OK, 14.5 / 13.2 / 15.3 / 14.1 / 14.9 s (90 frames 1080p). Outputs near identical size (654-655 kB). Frame 45 viewed: lit blue torus knot, correct |
| 16 | render Captions (calculateMetadata reads `public/timeline.json`) | OK 15.7 s; 150 frames/5.000 s as computed from JSON ((2400+300)+(1800+300)-300+500 ms), AAC audio track present. Stills at 0.8 s and 2.9 s show active word yellow, spoken white, pending grey, CJK words OK. Minor: flex `gap` looked tight with 1.12 scale; use margin |
| 17 | Space-path test: copied to `<repo>\templates\_smoke-remotion`, `pnpm install --frozen-lockfile` (14 s), render Hello (21 s incl. browser download), Spin3D `--gl=angle` (10 s), Captions | all OK; node_modules 674 MB. Folder then deleted with PowerShell `Remove-Item -Recurse -Force`; verified gone; `templates/_smoke-hyperframes` (other agent) untouched |
| 18 | pnpm workspace in `rs\ws` (`pnpm-workspace.yaml` packages `templates/*`, two templates a and b, root package.json) `pnpm install` | OK 11.5 s; root node_modules 396 MB (shared .pnpm), each template 100-136 KB symlinks |
| 19 | `pnpm exec remotion render Hello` in each template | OK 23 s and 19 s; each downloaded its own 283 MB `node_modules/.remotion` browser |
| 20 | `remotion studio --no-open --port 3123` for template a (20 s timeout) | "Server ready - Local: http://localhost:3123", built in 336 ms; then killed. (`pnpm --filter ... exec remotion` variant errored `Command "remotion" not found` after the timeout kill; run it from the template folder instead) |
| 21 | delete b's `.remotion`, render with `--browser-executable=<a's exe>` | OK 12.4 s, no new browser downloaded. Total workspace 631 MB |

## 3. Findings
- Working: scaffold, mp4, still, alpha (ProRes + WebM), Google fonts incl. CJK, three.js, calculateMetadata captions, space in path, pnpm workspace, shared browser.
- Working `--gl`: every option; recommend `angle`.
- Noto Sans SC logs "Made 202 network requests to load fonts" per render tab (2 weights x ~101 slices); harmless but noisy; mitigated by fewer weights, `ignoreTooManyRequestsWarning` [not run here]. `loadFont()` at module top level runs for all compositions.
- Disk estimate for 9 templates in a workspace: ~0.4 GB shared packages + 9 x 283 MB browsers (2.9 GB) or ~0.7 GB with one shared browser.
- Not run: `npx skills add remotion-dev/skills`, `--concurrency`, `--scale`, `--crf`, h265/gif, `--props` file, `@remotion/fonts` local fonts, `Config.setBrowserExecutable`, `inspect_video.py`.
- Test audio was ffmpeg sine tones (`-f lavfi -i sine=frequency=440:duration=2.4 -c:a libmp3lame`), not speech.
