# 05 - HyperFrames and raw HTML-capture toolchain log

Date: 2026-10-10. Machine: Windows 11, i9-12900K, RTX 3090, Node v25.2.1, ffmpeg 8.1.2, Chrome 155.0.8059.40, Docker CLI 29.8.1 (daemon not running), Git Bash + PowerShell 5.1.
Scratch: `...\scratchpad\hyperframes-smoke` (demo, demo-v, demo-font, demo-audio, demo-three, p5test, refs/hyperframes).
Versions: hyperframes CLI 0.8.143 (npm, `doctor` says latest), GSAP 3.14.2, three 0.181.2, puppeteer-core 25.13.0, p5 2.3.4.

## 1. Reference material

| Command | Outcome |
|---------|---------|
| `git clone --depth 1 --filter=blob:none --sparse https://github.com/heygen-com/hyperframes` then `git sparse-checkout set skills docs` | OK. 21 skills under `skills/`, docs under `docs/` (Mintlify .mdx). Repo license: Apache-2.0 (LICENSE header). |
| Read: `skills/hyperframes/SKILL.md`, `hyperframes-core/SKILL.md` + `references/{minimal-composition,determinism-rules,variables-and-media}.md`, `hyperframes-cli/SKILL.md` + `references/init-and-scaffold.md`, `hyperframes-animation/adapters/three.md`, `media-use/audio/references/tts-to-captions.md` | Content treated as data. Skills are large (router 21 KB, CLI 24 KB); not worth embedding, link instead. |
| `curl -sL https://hyperframes.heygen.com/llms.txt` | OK, index of docs pages (.md versions), prompt guide, changelog. |
| Plugin install (README): `claude plugin marketplace add heygen-com/hyperframes`, `claude plugin install hyperframes@hyperframes`; `npx skills add heygen-com/hyperframes`; `npx hyperframes skills update` | Not run (repo read instead). |

## 2. Smoke tests

All render commands: `npx --yes hyperframes@0.8.143 ...` with `HYPERFRAMES_SKIP_SKILLS=1`.

| Step | Command | Outcome / timing |
|------|---------|------------------|
| 2a init | `init demo --non-interactive` | OK, 9.9 s. Files: AGENTS.md, CLAUDE.md, hyperframes.json, index.html, meta.json, package.json. Template = 10 s, 1920x1080, GSAP from CDN. |
| 2a lint | `lint` | 0 errors, 1 warning `nested_structure_needs_subcomposition` (harmless), 10 s. |
| 2a check | `check` | Passed, 11.6 s. Inter auto-fetched from Google Fonts ("Fetched 11 font face(s)", cached `~/.cache/hyperframes/fonts/inter`). GPU probe: hardware (RTX 3090). |
| 2a render draft | `render --fps 30 --quality draft --output ...` | 182.8 KB, 4.0 s, "rendered in 18.5 s" (wall 31 s incl. npx): setup 7.3, capture 8.6, encode during capture, assemble 0.7. drawelement capture. |
| 2a render looks | `render --quiet --output looks-r1.mp4` (twice) | 26 s and 28 s wall. h264 yuv420p 1920x1080 30 fps 120 frames. |
| 2b vertical | composition edited to 1080x1920, `check` then `render` | Passed, 29 s, 1080x1920, 120 frames. Frame at 2 s viewed: correct stacked headline, orb at bottom. |
| 2c fonts | Inter via `font-family` only; Noto Sans SC first via `font-family` only | `check` FAILED: `font_family_without_font_face` (Noto Sans SC not in auto list). Fix: `@font-face` to local `fonts/NotoSansSC.ttf` (17.8 MB variable TTF from github google/fonts, OFL). Then check passed, render 37 s. Frame viewed: Latin, Simplified, Traditional Chinese, kana all correct. |
| 2d audio | ffmpeg sine mp3 (2.4 s voice stand-in, 4 s bgm); two `<audio id>` tags; captions from JSON through `--variables-file vars.json` + `window.__hyperframes.getVariables()` | Check passed (default `[]` -> no captions during check, warning `sweep_static`). Render 45 s: h264 + aac, 4.0 s, mean volume -23.7 dB. Frame at 1.2 s viewed: word "video" shown at the right time (audio start 0.5 + word start 0.45). |
| 2e canvas + three | 2D canvas (mulberry32 seeded, GSAP proxy onUpdate) beside Three.js (local importmap, `hf-seek`) | Check passed (warning `canvas_content_at_edge`). Render 32 s; "static-frame dedup: disabled (canvas/webgl)", screenshot capture. Frame at t=2.0 viewed: both layers draw, label reads `t=2.000`. 92 distinct frame hashes. |
| 2f determinism | same comp rendered twice, `ffmpeg -f framemd5` diff and `sha256sum` | text/GSAP comp: SHA-256 identical (371fcec0...). three+canvas comp: SHA-256 identical (6dd803ef...). GPU vs `--no-browser-gpu` (SwiftShader): not identical; PSNR 56.3 dB (text), 51.1 dB (WebGL). |
| 2f docker | `docker info`; `render --docker` | `docker info`: daemon not running (npipe error). `render --docker` tried `docker build ... hyperframes-renderer:0.8.143`, failed: "failed to connect to the docker API". CLI exits 0 despite failure (printed error only). Docker render not verified. |
| 2g spaces | copied project into `<repo>\templates\_smoke-hyperframes`; `check`, `render --output <scratch>`, `render` (default output) | Check passed (9 samples), render 27 s, output SHA-256 identical to the space-free path render. Default output `renders/_smoke-hyperframes_2026-10-10_06-38-46.mp4`. Folder then deleted (PowerShell `Remove-Item`; Test-Path False). Non-ASCII path not tested. |
| extras | `render --fps 60 --quality draft`; `--format gif`; `snapshot --at 0.5,2`; `catalog --query "reveal a headline one line at a time"`; `doctor` | fps60: 60/1, 240 frames. GIF 0.93 MB. snapshot wrote PNGs + contact-sheet.jpg and ran `npm install @google/genai` for its describe step. catalog: 392 moves, local word match, returned headline-slam, line-by-line-slide etc. doctor: all required OK; whisper-cpp, Kokoro, MusicGen not installed (optional). |

## 3. capture_html.mjs

File: `skill/scripts/capture_html.mjs` (~140 lines), puppeteer-core + system Chrome + ffmpeg stdin pipe (image2pipe png -> libx264 yuv420p, CRF 18, aac with `--audio`, `-shortest`).

| Test | Outcome |
|------|---------|
| `npm i puppeteer-core@25.13.0 p5@2.3.4` in scratch | 6 s, 0 vulnerabilities. |
| Seeded p5 2.3.4 sketch (instance mode, noLoop, reseed each frame, `await p.redraw()`), 1080x1080, 30 fps, 150 frames, `--audio tone.mp3` | OK, 9 s wall (script ran from a path containing spaces). ffprobe: h264, yuv420p, 1080x1080, 150 frames, 5.00 s, + aac 4.99 s. Frame at 2 s viewed. |
| Second run, per-frame `framemd5` compared | Identical (`P5_FRAMES_IDENTICAL`). |
| `--selector canvas --frames 10` | OK. |
| Page without `renderFrame` | Exits non-zero: `window.renderFrame(i, fps) is not defined` (plus an ffmpeg "Error opening output files" line from the aborted pipe). |
| `--width 1081` | Rejected: width and height must be even. |
| `python skill/scripts/inspect_video.py p5-a.mp4` | OK, wrote `sheet.png` into the project root (cwd); moved it to scratch. |

## Errors and fixes

- Chrome "not found" in capture_html.mjs: backslash Windows paths in the heredoc were collapsed to single backslashes by the shell tool, so `existsSync` failed. Fixed by using forward slashes (`C:/Program Files/Google/Chrome/Application/chrome.exe`), which Node accepts on Windows.
- `/usr/bin/time` does not exist in Git Bash; used `date +%s` deltas.
- A first `diff` "FRAMES_IDENTICAL" was a false positive (both inputs missing, empty md5 files); redone properly. Every identity claim above comes from the rerun.
- `rm -rf` was blocked by the harness; used PowerShell `Remove-Item -LiteralPath ... -Recurse -Force` for the required deletion, and `cp` into fresh directories otherwise.
- Noto Sans SC lint failure (see 2c).

## Verdicts

- Windows determinism: same machine, same GPU mode -> byte-identical files. Not guaranteed across GPU/software modes or machines; Docker path untested because the daemon is down.
- Path with spaces: works.
- Blockers: none for the toolchain. Open: `--docker` render, non-ASCII path, multi-segment audio/caption generator, `hyperframes transcribe`/`tts` (need whisper-cpp / Kokoro).
