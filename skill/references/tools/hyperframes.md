# HyperFrames

HTML in, MP4 out. A composition is an `index.html` whose DOM declares timing with `data-*` attributes and whose animation (GSAP, CSS, Lottie, Three.js, canvas) is seekable; headless Chrome seeks it frame by frame and ffmpeg encodes. License: Apache-2.0 (heygen-com/hyperframes). Verified here: `hyperframes` CLI 0.8.143, Windows 11, Node 25, ffmpeg 8.1, Chrome 155. Commands marked [not run here] were not executed.

## When to choose it

- Strong: kinetic typography, title/lower-third/overlay motion, product-promo and UI-mockup scenes, captioned clips, data-in-motion built from HTML/SVG, CSS/GSAP "designed" looks, anything that is easiest to express as a web page. Any web font, CSS gradients/filters, SVG, Three.js, canvas.
- Fine: narrated explainers (word-timed captions below), beat-synced edits, slideshows, Remotion ports (the official skill `remotion-to-hyperframes` exists).
- Weak: heavy math typesetting (use Manim), long films with hundreds of scenes (render is about 0.7 s per second of 1080p30 video plus ~20 s fixed startup: a 61 s video rendered in 43 s; see Timings), real-time/interactive sketches that cannot be driven by time (use `html-capture.md`), anything needing non-GSAP `Date.now()`-style clocks.
- Versus Remotion: no React/bundler, plain HTML files an agent can edit directly, `npx` only, no company-size license limit. Remotion has the larger ecosystem for React components.

## Setup

```bash
npx --yes hyperframes@0.8.143 init my-video --non-interactive    # ~10 s; scaffolds a blank 1920x1080, 10 s project
npx --yes hyperframes@0.8.143 init my-video --non-interactive --resolution portrait   # 1080x1920, verified (writes portrait root + viewport)
cd my-video && npx --yes hyperframes@0.8.143 doctor
```

- Needs Node 22+, ffmpeg, and Chrome. No Chrome download was needed when a system Chrome was installed (`doctor` is all green except optional whisper-cpp/Kokoro/MusicGen).
- `init` writes `index.html`, `hyperframes.json`, `meta.json`, `package.json` (scripts pin the CLI version, e.g. `hyperframes@0.8.143`) plus `AGENTS.md` / `CLAUDE.md` (8.6 KB each; delete them after `init` when building a template; `hyperframes.json`/`meta.json` can stay) and sets root `data-duration="10"`, which your build script must override. Set `HYPERFRAMES_SKIP_SKILLS=1` to stop it checking for skill updates.
- Pin the version in commands (as above). Newer versions change defaults.

## Minimal project

```
my-video/
  index.html            # root composition (standalone: no <template> wrapper)
  vendor/gsap.min.js    # vendored, so renders need no network
  assets/               # mp3, images, local fonts
  hyperframes.json  meta.json  package.json
  renders/              # default output dir, files named <project>_<timestamp>.mp4
```

Write every source file with the editor tool, never a Bash heredoc: multi-file heredocs failed repeatedly (parse errors, files silently written empty or truncated). Small Python heredoc edits are fine.

Verified `index.html` (4 s, 1920x1080; this is the whole contract):

```html
<!doctype html>
<html lang="en"><head>
  <meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
  <script src="vendor/gsap.min.js"></script>
  <style>
    html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #0a0a0a; }
    #root { position: relative; width: 100%; height: 100%; font-family: Inter, sans-serif; }
    .scene { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
    .word { display: inline-block; color: #f4f4f5; font-size: 120px; font-weight: 700; margin: 0 18px; }
  </style></head>
<body>
  <div id="root" data-composition-id="main" data-start="0" data-duration="4" data-width="1920" data-height="1080">
    <section id="scene" class="scene clip" data-start="0" data-duration="4" data-track-index="0">
      <span class="word">Agents</span><span class="word">make</span><span class="word">video</span>
    </section>
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    tl.fromTo(".word", { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.15 }, 0.2);
    window.__timelines["main"] = tl;     // key = root data-composition-id; register after building
  </script>
</body></html>
```

Rules that matter: root `data-duration` fixes render length (not the timeline length); timed elements carry `data-start` + `data-duration`; one paused GSAP timeline per composition; set start states with `fromTo`, never a CSS `transform` plus a GSAP tween on the same property (lint `gsap_css_transform_conflict`); never tween `autoAlpha`/`visibility` on a `.clip`. Keep the GSAP timeline script inline in `index.html` (an external `<script src>` raises `missing_timeline_registry`). Asset URLs must be root-relative (`assets/...`), including inside CSS; `../assets/...` raises `invalid_parent_traversal_in_asset_path`. `init`'s template loads GSAP from a CDN; replace it with a vendored copy (`curl -sL https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js -o vendor/gsap.min.js`, run here).

## Check, then render

```bash
npx --yes hyperframes@0.8.143 check                          # lint + runtime + layout + motion + contrast, ~12 s. Run first.
npx --yes hyperframes@0.8.143 snapshot --at 0.5,2            # PNGs in snapshots/ (+ contact sheet); git-ignore or delete that folder
npx --yes hyperframes@0.8.143 render --output out.mp4        # default quality "looks" (CRF 16), 4 s 1080p30 = ~27 s
npx --yes hyperframes@0.8.143 render --quality draft --output draft.mp4      # ~18 s; delivery = highest
npx --yes hyperframes@0.8.143 render --fps 60 --quality draft --output 60.mp4 # 240 frames, verified
npx --yes hyperframes@0.8.143 render --format gif --output x.gif             # also webm, mov (alpha), png-sequence, hls
npx --yes hyperframes@0.8.143 render --variables-file vars.json --output out.mp4   # data into the page, see Audio
```

- Lint hits seen on specific styles: `text_not_painted` is an error for `color: transparent` + `-webkit-text-stroke` (use a low-opacity solid fill); `content_overlap` is an error, not a warning, when a panel sits under a slammed word at different times or a scaled window crosses a fixed label (zoom about the window's top edge, cap ~1.10); intentional off-canvas rows need `data-layout-allow-overflow`; `composition_file_too_large` fires on a generated single-file `index.html` (harmless); `canvas_content_at_edge` on a full-bleed canvas and `rotation_pivot_drift` on shoulder-pivoted arms are expected.
- `check` can pass with only warnings. `nested_structure_needs_subcomposition` (content nested inside a timed `<section>`) is a Studio-timeline hint and did not affect rendering. `content_overlap` warnings during a deliberate cross-fade are expected (ignore, or mark `data-layout-allow-overlap`); `container_overflow` info on an intentional overflow-hidden sweep is likewise fine. A lint error silently turns off the layout/contrast audits ("0 samples").
- Vertical: change the composition itself (`data-width="1080" data-height="1920"`, `html, body` size, viewport meta); the render takes size from there. `--resolution` only scales an existing aspect ratio (e.g. 1080p -> 4k). Verified 1080x1920 output.
- Output is h264 yuv420p (+aac when audio exists). `--crf` / `--video-bitrate` override quality. `--workers N` sets parallel Chrome processes (auto here = 1 for a 4 s clip).
- Preview/edit in a browser: `npx hyperframes preview` [not run here].

## Determinism

Verified on Windows 11: rendering the same 4 s flat composition twice gave byte-identical MP4s (same SHA-256) and identical `ffmpeg -f framemd5` output; same for a Three.js + canvas composition and for a path with spaces. Byte identity held for flat scenes only. A 22 s scene with text-shadow glow, CSS blur and gradients (5 workers, hardware GPU) differed on 507 of 660 frames yet matched visually (PSNR >= 49.6 dB). Say "visually identical (seeded randomness)" for such scenes; `--workers 1 --no-browser-gpu` for exact repeats was not retested [not run here].

Not identical across modes: hardware-GPU (default, RTX 3090 here) vs `--no-browser-gpu` (SwiftShader software) frames differ in bytes (PSNR 56 dB text scene, 51 dB WebGL scene: visually the same). For reproducible-across-machines output use `--docker` (needs a running Docker daemon; Docker CLI was installed here but the daemon was not running, so it failed with "failed to connect to the docker API"; [not run successfully here]) or pin one machine and `--no-browser-gpu`.

Authoring rules (full list in the official `hyperframes-core` skill, `references/determinism-rules.md`):
- No `Date.now()`, `performance.now()`, unseeded `Math.random()` (use a seeded PRNG such as mulberry32), no render-time network fetches, no hover/scroll/input state.
- Do not call `.play()` on GSAP, video, or audio; the framework owns playback and seeks everything.
- `repeat: -1` only under a finite root `data-duration`.
- Canvas/WebGL must be a pure function of time: drive 2D canvas from a GSAP proxy tween's `onUpdate` (`tl.to(proxy, {t: 3, duration: 3, ease: "none", onUpdate: () => draw(proxy.t)})`), and Three.js from `window.addEventListener("hf-seek", e => renderAt(e.detail.time))` plus `renderAt(window.__hfThreeTime || 0)` once at load. Both verified; frame `t=2.000` rendered exactly. The root still needs `data-duration`.
- The proxy tween also drives a whole DOM/SVG scene (set transforms, text and SVG attributes imperatively per frame); prefer it for beat-grid styles, where one GSAP tween per event means hundreds of tweens.
- Vendor Three.js locally and map it with an importmap (`{"imports":{"three":"./vendor/three.module.min.js"}}`; for three >= 0.17x also download `three.core.min.js` next to it). Verified with three@0.181.2. Lint may warn `canvas_content_at_edge` for full-bleed canvases; harmless.

## Fonts, including CJK

- Inter (and the other families on HyperFrames' auto-resolve list) work with only `font-family: Inter`: at compile time the CLI fetches the woff2 files from Google Fonts, caches them in `~/.cache/hyperframes/fonts/` and injects deterministic `@font-face` rules. First use needs network; later runs are offline.
- Auto-resolve is not universal, and a miss is silent: text falls back to Arial while `check` stays green (only CJK raised `font_family_without_font_face`). Resolved in reports: Inter, JetBrains Mono. Did NOT resolve: Space Grotesk, Archivo, Bebas Neue, Oswald, Noto Sans SC. Untested for auto-resolve (shipped via fontsource instead): Anton, Baloo 2, Nunito, Press Start 2P. Confirm with `Fetched N font face(s) for "<family>"` in the `check` output, and look at a snapshot: a bold sans that looks like Arial Black means a fallback. Also check the family has the weight you want (Space Grotesk stops at 700).
- Local route that works offline (verified for Archivo 800, Anton, Baloo 2, Nunito, Press Start 2P, Inter, JetBrains Mono): pin an exact `@fontsource/<name>` version (look it up with `pnpm view`; guessed versions failed), copy `node_modules/@fontsource/<name>/files/<name>-latin-<weight>-normal.woff2` (10-40 KB) into `fonts/` in the build script, and declare it:
  ```css
  @font-face { font-family: "Archivo"; src: url("fonts/archivo-latin-800-normal.woff2") format("woff2"); font-weight: 800; }
  ```
  Fonts must be root-relative and have a matching `@font-face` or the lint/fallback applies.
- Noto Sans SC is not on that list. `check` fails with `font_family_without_font_face` and text would silently fall back. Ship a local file and declare it:
  ```css
  @font-face { font-family: "Noto Sans SC"; src: url("fonts/NotoSansSC.ttf") format("truetype"); font-weight: 100 900; }
  ```
  Verified: Simplified/Traditional Chinese and Japanese kana all rendered from the variable TTF (17.8 MB) from `https://github.com/google/fonts/raw/main/ofl/notosanssc/NotoSansSC[wght].ttf` (OFL). That is over a 2 MB repo budget, so subset it with fontTools (verified: GB2312 level-1 chars, wght 400-800, 1.2 MB woff2). Order matters: subset FIRST, then instance the variable font; the reverse crashes with `KeyError: 'uni2517'`.
  ```bash
  pyftsubset NotoSansSC.ttf --text-file=chars.txt --layout-features='*' --output-file=sub.ttf     # 1. subset
  fonttools varLib.instancer sub.ttf wght=400:800 -o inst.ttf                                   # 2. then instance
  fonttools ttLib.woff2 compress inst.ttf -o fonts/NotoSansSC.woff2                             # needs brotli
  ```
  The step order was verified; the exact flags above follow the fontTools docs [not re-run here].
  Declare it with `src: url("fonts/NotoSansSC.woff2") format("woff2")`. `@fontsource` CJK is impractical here (dozens of unicode-range slices). For an OS font use `src: local("Microsoft YaHei")` [not rendered here; machine-dependent].
- Look at a frame to confirm glyphs: `ffmpeg -y -ss 1.5 -i out.mp4 -frames:v 1 f.png`, then open the PNG.

## Audio and word-timed captions

Put `<audio>` tags in the HTML. Each needs a unique `id` (an id-less audio is never mixed and the render is silent), `data-start`, `data-duration`, optional `data-volume`, never `crossorigin`:

```html
<audio id="vo-s1" src="assets/s1.mp3" data-start="0.5" data-duration="2.4" data-track-index="1" data-volume="1"></audio>
<audio id="bgm"   src="assets/bgm.mp3" data-start="0"   data-duration="4"   data-track-index="2" data-volume="0.4"></audio>
```

Verified: a 4 s render had an aac stream and `volumedetect` mean -23.7 dB (a sine fixture made with `ffmpeg -f lavfi -i "sine=frequency=440:duration=2.4" -c:a libmp3lame s1.mp3`).

### Content-driven template (generate the HTML)

For a template with editable `content.json` (+ `timeline.json` from TTS), do not fetch JSON in the page and do not rely on render variables. Run a small Node build script (`node scripts/build.mjs`) that writes the whole `index.html` from a source template: the `<audio>` tags, card/scene markup, and `data-start`/`data-duration` computed from `timeline.json` (cumulative `duration_ms` plus gaps), and patches the root `data-duration`. Generated markup must be static, so `check` sees every timed element; keep the GSAP script inline (see Rules). Pattern, verified on a 60 s multi-card video and a 25 s text-led piece:

```js
// scripts/build.mjs
// after the loop, `cursor` is the total length in seconds
let audio = "", scenes = "", cursor = 0;
for (const seg of timeline.segments) {
  audio += `<audio id="vo-${seg.id}" src="assets/audio/${seg.file}" data-start="${cursor}" data-duration="${seg.duration_ms / 1000}" data-track-index="1"></audio>`;
  scenes += `<section class="scene clip" data-start="${cursor}" data-duration="${seg.duration_ms / 1000 + GAP}" data-track-index="0">${card(content, seg)}</section>`;
  cursor += seg.duration_ms / 1000 + GAP;
}
html = tpl.replace("<!--AUDIO-->", audio).replace("<!--SCENES-->", scenes)
          .replace(/(id="root"[^>]*data-duration=")[^"]*/, `$1${cursor}`);
```
Variants (both verified): a no-audio procedural template concatenates `src/*.js` into one inline script, injects `window.CONTENT`, and sets the root `data-duration`; a canvas-driven whole video uses a proxy tween `onUpdate` -> `draw(Math.round(t * fps))`. To hand word times to the inline GSAP script, inject `const TL = {...}` (absolute times) before the animation code and look words up with a helper.
A lighter variant writes `content.js` (`window.CONTENT = ...`) plus the root `data-duration`. Git-ignore `out/` and `snapshots/`.

Passing data in via render variables: declare variables on `<html>` and pass values at render time. The TTS JSON `{"segments":[{"id":"s1","file":"s1.mp3","duration_ms":2400,"words":[{"text":"Hello","start_ms":0,"end_ms":420}]}]}` went in as one string variable (verified):

```html
<html data-composition-variables='[{"id":"segments","type":"string","label":"Segments JSON","default":"[]"}]'>
```
```js
const vars = window.__hyperframes.getVariables();
const segments = JSON.parse(vars.segments);
const OFFSETS = { s1: 0.5 };                       // segment start on the timeline = the <audio data-start>
for (const seg of segments) seg.words.forEach((w, i) => {
  const el = document.createElement("div"); el.className = "w"; el.textContent = w.text; caps.appendChild(el);
  const t0 = OFFSETS[seg.id] + w.start_ms / 1000, t1 = OFFSETS[seg.id] + w.end_ms / 1000;
  tl.set(el, { opacity: 1 }, t0); tl.fromTo(el, { y: 20 }, { y: 0, duration: 0.15 }, t0);
  tl.set(el, { opacity: 0 }, t1);                  // hard kill: words must never overlap
});
```
```bash
node -e "const j=require('./captions.json');require('fs').writeFileSync('vars.json',JSON.stringify({segments:JSON.stringify(j.segments)}))"
npx --yes hyperframes@0.8.143 render --variables-file vars.json --output out.mp4
```

- `check` and `preview` use the declared `default`, so with `"[]"` no captions exist during `check` ("sweep_static" warning). Put a real sample in `default`, or render and look at frames.
- `<audio>` elements must exist in the DOM at compile time (audio extraction reads the authored `src`). With several segments, use the build script above (it replaces the variables route for multi-segment videos).
- Official caption/transcription tooling: `npx hyperframes transcribe narration.wav` (needs whisper-cpp, not installed here), `npx hyperframes tts` (Kokoro, not installed here). The project's own TTS path (`skill/scripts/tts.py`, see `audio-tts-captions.md`) produces the JSON above directly.

## Typing / terminal pattern

Text-driven templates (typed code, terminals) need no per-character tweens. The build script emits one `<i data-t="1.234">c</i>` per character (reveal time from a typing schedule), then one proxy tween drives everything: `tl.fromTo(proxy, {t: 0}, {t: D, duration: D, ease: "none", onUpdate: () => apply(proxy.t)})`, where `apply` sets each character visible if `data-t <= t` and computes caret and scroll from `t`. Put `immediateRender: false` on every chained `fromTo` of the same property, otherwise the last tween's `from` wins at t=0. Verified. Clip terminal rows in a box of exactly N x line-height so no half row shows.

## SVG / GSAP character rigs

- Draw all geometry in absolute coordinates with no `transform` attributes, and put `svgOrigin: "x y"` on every rotate/scale tween. For a nested part (forearm inside upper arm) the pivot is in the parent's coordinate space. Verified; `rotation_pivot_drift` from `check` is harmless.
- Draw-on strokes: `pathLength="1" stroke-dasharray="1 2"`, then tween `strokeDashoffset` 1 -> 0.
- Scene switching: one root-level `<section class="scene clip" data-start data-duration>` per scene, captions as separate `.clip` elements. Clips hide themselves outside their window; no visibility tweens. Put a transition cut where an overlay fully covers the screen.

## Verify the output

```bash
ffprobe -v error -show_entries stream=codec_name,pix_fmt,width,height,r_frame_rate,nb_frames -of csv out.mp4
ffmpeg -v error -i out.mp4 -f framemd5 - > a.md5            # frame hashes, for A/B comparison
python skill/scripts/inspect_video.py out.mp4               # black/frozen/audio checks + contact sheet (written to the cwd: run from a scratch dir)
```
Then open 2-3 stills with an image viewer; do not trust exit code 0 alone. Render summary line 2 says `drawelement` vs `screenshot` capture and `hardware gpu`/`software gpu`.

## Reference timings (i9-12900K, RTX 3090, Windows 11)

`npx` start ~10 s per command. Long videos: 61 s 1080p30 rendered in 43 s (~0.7 s per video second); 25 s with 3 workers 31.5 s. Short clips are dominated by ~20 s fixed startup. 4 s 1080p30 text scene: draft 18 s, looks 26-29 s (capture 8.6 s, setup 7 s). 4 s 1080x1920: 29 s. Canvas + WebGL scene (screenshot capture, no frame dedup): 32 s. 150-frame p5 capture via `capture_html.mjs` for comparison: 9 s.

## Windows pitfalls hit

- A path containing spaces worked: `check` and `render` succeeded and the MP4 was byte-identical to a render from a space-free path. Non-ASCII paths were not tested here.
- Docker Desktop installed but daemon stopped makes `--docker` fail; start Docker Desktop first.
- The `init` template pulls GSAP from a CDN; a render then depends on network. Vendor it.
- Render notes: "A frame failed verification ... fell back to the screenshot path" is not an error (re-enable with `HF_DE_PARALLEL_ROUTER=true`); under parallel load a 35 s video took 2.4 s per video second. `snapshot --at` takes seconds (`sec = frame / fps`; use `(hitFrame + 2) / fps` to see a settled hit) and overwrites the previous run.
- `snapshot` writes `snapshots/` (plus `descriptions.md`) and prints "Describing frames with Gemini" / tries `npm install @google/genai` even without a key; harmless. Delete or git-ignore the folder; it also adds a last frame at the composition end.
- Git Bash heredocs holding several long files fail or write empty files: use the editor tool (see Minimal project).
- Frame-cache lives in `%TEMP%\hyperframes-extract-cache-*`; `--frames-cache-dir` relocates it off a small C: drive.
- Git Bash `/tmp` is not Windows `%TEMP%`; give the CLI real paths.

## Go deeper

- Official skills (read before authoring non-trivial work; they are large): `npx skills add heygen-com/hyperframes`, or `npx hyperframes skills update`; Claude Code plugin: `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes` [none run here; cloned the repo and read the skills instead]. Key skills: `hyperframes` (router), `hyperframes-core` (contract), `hyperframes-animation` (adapters: gsap, three, lottie, css, waapi), `hyperframes-cli`, `hyperframes-creative` (palettes/, frame-presets/, typography), `media-use`, `embedded-captions`, `hyperframes-registry`.
- Catalog of ready-made blocks/components: `npx hyperframes catalog --query "reveal a headline one line at a time"` (verified: 392 moves, local word match; query in English), install with `npx hyperframes add <name>`.
- Starter examples: `init --example warm-grain|swiss-grid|vignelli|kinetic-type|product-promo|nyt-graph|decision-tree|play-mode` [not run here].
- Docs: https://hyperframes.heygen.com/ ; machine-readable index https://hyperframes.heygen.com/llms.txt ; source https://github.com/heygen-com/hyperframes (`skills/`, `docs/`).
