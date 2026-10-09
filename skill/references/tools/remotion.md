# Remotion (React video)

Verified on Windows 11, Node 25.2, pnpm 10.30, Remotion 4.0.534, ffmpeg 8.1. Commands below were run unless marked [not run here].

## When to choose Remotion

Pick it when the video is UI-like: typography, cards, charts, dashboards, SaaS/product demos, kinetic text, word-synced captions, data stories, anything React/CSS/SVG can draw, plus Three.js scenes (`@remotion/three`). Strong: component reuse, props-driven templates (one template, many videos via JSON), `calculateMetadata` for audio-driven length, transparent output, huge ecosystem (fonts, Lottie, charts, maps).

Weak: math/diagram animation (use Manim), heavy particle or GPU-shader work (slow, needs `--gl`), page recordings of existing sites (use HTML capture), hand-drawn or photoreal looks. Rendering is a real headless browser per frame: expect ~5-15 s for a 3 s 1080p clip, minutes for long ones.

License: free for individuals and companies of up to 3 people. Companies of 4+ need a paid Company License: https://www.remotion.pro/license . Put this in any README that ships Remotion templates.

## Setup

```bash
# scaffold (non-interactive; also runs npm install by itself, ~100 s)
npx create-video@latest --yes --blank --no-tailwind my-video
```
Prefer pnpm: delete the scaffold's `node_modules` and `package-lock.json` (PowerShell: `Remove-Item -Recurse -Force node_modules, package-lock.json`; Bash `rm -rf` may be denied by a harness), then `pnpm install` (12 s with a warm store). pnpm prints "Ignored build scripts: esbuild" - harmless. Fastest path: scaffold in a scratch dir and copy only `src/index.ts`, `remotion.config.ts`, `tsconfig.json`; strip the scaffold's eslint packages. pnpm inside a repo with a parent `package.json` (not a workspace) works.

```bash
cd my-video
pnpm exec remotion add @remotion/media @remotion/fonts     # pins same version as remotion
pnpm add -E @fontsource/inter                               # offline fonts, see Fonts
pnpm add -E three@0.171.0 @react-three/fiber@9.1.2 @types/three@0.171.0 && pnpm exec remotion add @remotion/three   # 3D only
pnpm exec remotion browser ensure     # downloads chrome-headless-shell (~283 MB) into node_modules/.remotion
```
`remotion add` on Windows prints `'HEXT' is not recognized` - cosmetic, the packages are installed. All `@remotion/*` packages must be the exact same version as `remotion` (no `^`). Pin everything exactly: `.npmrc` with `save-exact=true` (pnpm writes `^` by default; or `pnpm add pkg@x.y.z`). Verified 3D set with remotion 4.0.534: `three@0.171.0`, `@react-three/fiber@9.1.2`, `@types/three@0.171.0`.

The first `remotion render` downloads Chrome Headless Shell itself if missing. System Chrome is not needed.

## Minimal project shape

```
my-video/
  package.json  remotion.config.ts  tsconfig.json
  public/            # staticFile() assets: mp3, json, images (or `Config.setPublicDir("assets")`, verified; `staticFile("audio/x.mp3")` is relative to the public dir)
  src/index.ts       # registerRoot(RemotionRoot)
  src/Root.tsx       # <Composition>/<Still> list
  src/Hello.tsx
```
```tsx
// Root.tsx
<Composition id="Hello" component={Hello} durationInFrames={90} fps={30}
  width={1920} height={1080} defaultProps={{ text: "Hello Remotion" }} />

// Hello.tsx
import "@fontsource/inter/latin-700.css";   // see Fonts for the delayRender wait
const fontFamily = "Inter";
export const Hello = ({ text }: { text: string }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 12 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#0b1020", justifyContent: "center", alignItems: "center" }}>
    <div style={{ fontFamily, fontSize: 160, color: "#fff", opacity, scale: String(enter) }}>{text}</div>
  </AbsoluteFill>;
};
```
The scaffold's `remotion.config.ts` sets `Config.setVideoImageFormat("jpeg")` and `Config.setRspack(true)`.

tsconfig: the scaffold's `lib: ["es2015"]` fails on `document.fonts`, `Object.values`, `padStart`. Set `"lib": ["dom","es2020"]` and `"resolveJsonModule": true`. Content plumbing: `import content from "../content.json"` in one theme module that every component imports (works with the scaffold's rspack); do not use `--props` for it.

3D notes (verified in stills): `transmission` glass on a transparent `ThreeCanvas` over a dark void has nothing to refract and renders as a flat slab (iridescence/clearcoat variants rendered black); use a fresnel/gradient `ShaderMaterial` instead (see the style file for the shader approach). `@react-three/postprocessing` is untested here; the working bloom fallback is additive `ShaderMaterial` strips (soft gaussian falloff, else rectangle edges show) plus a DOM `radial-gradient` with `mix-blend-mode: screen` at the projected point. Write camera setup in a child component's render body and share a pure `cameraAt(frame)` helper with DOM overlays.

## Render commands

Run from the project folder (paths with spaces work).
```bash
pnpm exec remotion render Hello out/hello.mp4                       # h264 mp4, 3 s 1080p30: ~10 s
pnpm exec remotion still  Hello out/f45.png --frame=45              # one frame: ~8 s
pnpm exec remotion still  Fonts out/fonts.png                       # <Still> composition
pnpm exec remotion render Hello out/frames --sequence --frames=0,30,90 --image-format=png   # [not run here without audio] crashes with <Audio>, see below
# transparent: ProRes 4444 (editors) or VP9 WebM (browsers)
pnpm exec remotion render Alpha out/a.mov  --image-format=png --pixel-format=yuva444p10le --codec=prores --prores-profile=4444
pnpm exec remotion render Alpha out/a.webm --image-format=png --pixel-format=yuva420p --codec=vp9
# 3D
pnpm exec remotion render Spin3D out/spin.mp4 --gl=angle
```
`remotion.config.ts` from the scaffold already sets `setOverwriteOutput(true)`. Not run here: `--width/--height/--fps` overrides (compositions define size; override via props or `--props`), `--scale`, `--crf`, `--concurrency=N` (default is about half the CPU threads; lower it if Chrome crashes or RAM is tight; raise for light 2D scenes), `--codec=h265`, `--codec=gif`.

Alpha and png: a project exporting both mp4 and transparent video must set `Config.setVideoImageFormat("png")` in `remotion.config.ts` (the scaffold's jpeg default drops alpha and gives `yuvj420p`). Glass: `backdrop-filter` blur has nothing to sample in a transparent export, so the overlay gets flat translucent fills while an opaque composite gets real blur. Raise fill alpha (e.g. 0.72 to 0.82) or accept the difference, and tell the user.

Test alpha over a background (report-supplied command, frame at 20 s of a 25 s overlay):
```bash
ffmpeg -f lavfi -i color=c=0xd8a838:s=1920x1080:r=30:d=25 -i overlay.mov -filter_complex "[0][1]overlay=format=auto,format=yuv420p" -ss 20 -frames:v 1 alphatest.png
```
Look at the PNG: only the overlay graphics should show, no black fill.

Check alpha: ProRes reports `yuva444p12le`. VP9 WebM reports `yuv420p` with tag `ALPHA_MODE=1` under ffprobe's native decoder; use `ffprobe -c:v libvpx-vp9` to see `yuva420p`. Extracted frame corner pixel was `0 0 0 0` (transparent).

3D `--gl`: all of default, `angle`, `swangle`, `egl`, `angle-egl` rendered a 90-frame 1080p torus-knot in 13-15 s with identical output on Windows 11 (RTX GPU). Use `--gl=angle` (Remotion's recommended option for Windows/Linux); `swangle` is the software fallback for machines without GPU [fallback not stress-tested].

Slow renders: SVG filters (`feTurbulence`, `feDisplacementMap`), CSS blur and `backdrop-filter` crawl on the default GL renderer (one GPU process pinned a core; a chalk-filter render did not finish in 19 min). `Config.setChromiumOpenGlRenderer("angle")` in `remotion.config.ts` fixed it (65 s; 3.3x faster on a 30-frame test). Piping `render | tail` hides progress until the end; log to a file.

`remotion render --sequence --frames=a,b,c` crashes with `EINVAL ... inline-audio-mixing.js` whenever the composition contains `<Audio>` (even with `--muted`). For narrated compositions render one `remotion still` per frame (about 10 s each with a cached bundle).

Motion blur: `@remotion/motion-blur` (`pnpm add -E @remotion/motion-blur@<remotion version>`), `<CameraMotionBlur samples={6} shutterAngle={180}>` shows distinct ghost copies of text on fast pushes. Use `samples` 16-24 with `shutterAngle` 90-120, check one mid-move still, and lengthen long pans. Each moving frame costs `samples` renders (a 35 s UI tour took 13 min).

Output pixel format: with the scaffold's jpeg frames the mp4 is `yuvj420p` (full range), and `--pixel-format=yuv420p` does NOT override it (verified twice). To get `yuv420p`, set `Config.setVideoImageFormat("png")` in `remotion.config.ts` (or pass `--image-format=png`; slower, e.g. 78 s vs 48 s for a 30 s clip), or accept `yuvj420p`. Stills follow the same setting: pass `--image-format=png` to `remotion still` if the config says jpeg.

## Determinism rules

- Everything animated comes from `useCurrentFrame()` + `interpolate()`/`spring()`. Frames render in parallel tabs and out of order.
- No CSS `transition`, `animation`, `@keyframes`, Tailwind `animate-*`, `setTimeout`, `requestAnimationFrame`, or `Date.now()`.
- No `Math.random()`: use `random("seed")` from `remotion`.
- Three.js: no `useFrame()` from react-three-fiber; derive rotation from `frame`. `<Sequence>` inside `<ThreeCanvas>` needs `layout="none"`. `<ThreeCanvas>` needs `width`/`height` from `useVideoConfig()`.
- Async work (fetch, fonts, images): `delayRender()`/`continueRender()`, or use `calculateMetadata`, `<Img>`, `loadFont()` which block automatically.
- Prefer `scale`, `translate`, `rotate` CSS properties and compute time in frames from `fps` (`2 * fps`), never hardcode 30.
- Compositions must have unique ids (letters, digits, hyphens). Use `<Still>` for single images.

## Fonts incl. CJK

Default to OFFLINE fonts: templates must not fetch anything at render time. Two verified recipes; both need an exact-pinned package.

```tsx
// A. @fontsource CSS import + wait for the font (verified: Latin and CJK)
import "@fontsource/inter/latin-700.css";            // CJK: pnpm add @fontsource/noto-sans-sc -E, then "@fontsource/noto-sans-sc/900.css"
const handle = delayRender("fonts");
document.fonts.load('700 40px Inter', "text used")   // CJK: '900 100px "Noto Sans SC"', allUsedGlyphs
  .then(() => continueRender(handle)).catch((e) => cancelRender(e));

// B. @remotion/fonts loadFont with a bundled .woff2 (verified)
import { loadFont } from "@remotion/fonts";
import url from "@fontsource/inter/files/inter-latin-600-normal.woff2";
loadFont({ family: "Inter", url, weight: "600" });   // returns a promise Remotion waits on
```
```ts
// fonts.d.ts - needed so TypeScript accepts the import
declare module "*.woff2" { const url: string; export default url; }
```
Pass the CJK glyphs you actually use to `document.fonts.load` so the right unicode-range slices load. Chinese via `@fontsource/noto-sans-sc` was confirmed visually (digits and Latin mix render correctly). Stack fonts as `fontFamily: 'Inter, "Noto Sans SC"'`; Latin comes from Inter, CJK falls through. Do `loadFont`/`delayRender` once in a shared module: top-level calls run for every composition in the project.

`@remotion/google-fonts` (`import { loadFont } from "@remotion/google-fonts/Inter"`) is fine for quick local work but fetches from Google at render time, so it needs network and is not template-safe. Its Noto Sans SC is split into ~100 slices per weight and logs "Made 202 network requests"; load one or two weights or pass `ignoreTooManyRequestsWarning: true` [not run here].

## Audio and TTS-synced captions

Timeline JSON (`public/timeline.json`): `{"segments":[{"id":"s1","file":"s1.mp3","duration_ms":2400,"words":[{"text":"Hello","start_ms":0,"end_ms":420}]}]}`. Word times are relative to the segment start. Fully working, rendered, verified by stills (active word yellow, spoken white, upcoming grey) and a 5.0 s output = 150 frames with AAC audio:

```tsx
import { Audio } from "@remotion/media";
const FPS = 30, GAP_MS = 300, TAIL_MS = 500;

export const calculateMetadata: CalculateMetadataFunction<{ timeline: Timeline | null }> = async ({ props }) => {
  const timeline = props.timeline ?? (await (await fetch(staticFile("timeline.json"))).json());
  const ms = timeline.segments.reduce((s, x) => s + x.duration_ms + GAP_MS, 0) - GAP_MS + TAIL_MS;
  return { durationInFrames: Math.ceil((ms / 1000) * FPS), props: { timeline } };
};
// <Composition ... fps={30} defaultProps={{ timeline: null }} calculateMetadata={calculateMetadata} />

const Segment = ({ seg }) => {
  const frame = useCurrentFrame(); const { fps } = useVideoConfig();
  const ms = (frame / fps) * 1000;               // time inside this <Sequence>
  return <AbsoluteFill style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", alignItems: "center", padding: 160 }}>
    <Audio src={staticFile(seg.file)} />
    {seg.words.map((w, i) => <span key={i} style={{ marginRight: 28,
      color: ms >= w.start_ms && ms < w.end_ms ? "#ffd23f" : ms >= w.end_ms ? "#fff" : "#5b6275" }}>{w.text}</span>)}
  </AbsoluteFill>;
};
// lay out: cursor += duration_ms + GAP_MS; <Sequence from={round(cursor/1000*FPS)} durationInFrames={ceil(duration_ms/1000*FPS)} premountFor={FPS}>
```
Use real `duration_ms` from the audio (ffprobe), not the last word end. Official skill advice: `<Audio>` from `@remotion/media`; for `@remotion/captions` use the `Caption` type `{text,startMs,endMs,timestampMs,confidence}` and its Basic Captions element; keep a clip's captions in the same `<Sequence>` as its video. Official voiceover guidance uses ElevenLabs; any TTS that outputs mp3 works with the JSON above. Test audio here was ffmpeg sine tones, not speech.

Timeline helper: `import timeline from "../public/timeline.json"` (with `resolveJsonModule`) instead of `fetch` keeps `durationInFrames` computable at module load. Word frame = `segStartFrame + round(word.start_ms / 1000 * fps)`; write one `at(seg, wordIndex)` helper and reuse it for every cue.

Icons in SVG diagrams: `lucide-react` icons accept `x`, `y`, `size`, `color`, `strokeWidth` and nest directly in `<svg>` (verified, lucide-react 1.54.0): `<Cpu x={40} y={60} size={48} color="#7cf" strokeWidth={1.75} />`.

## Verify output

1. `remotion still <Id> out/f.png --frame=N` at the entrance, middle, and last frames; open with an image viewer/Read tool and look (text clipped? CJK tofu? contrast?).
2. `ffprobe -v error -show_entries stream=codec_name,pix_fmt,width,height,r_frame_rate,nb_frames:format=duration -of default=nw=1 out.mp4` and compare frames/duration with the plan.
3. `python skill/scripts/inspect_video.py <file>` [not run here; script written by another agent].

## Pitfalls

- **MAX_PATH (hit):** Chrome is spawned from `node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe`. If the project path pushes this over 260 characters, render dies with `Failed to launch the browser process! spawn ... ENOENT` although the file exists (it did at 261 chars in a deep temp folder). Keep projects in short paths, or pass `--browser-executable`.
- Chrome download is per project (~283 MB each). With pnpm workspaces the packages are shared but the browser is not; point all templates at one copy with `--browser-executable=<path>` or `Config.setBrowserExecutable()` (CLI flag verified; config call [not run here]).
- Scaffold runs `npm install` itself; switching to pnpm means deleting its `node_modules`/lock.
- `interpolate` throws on a descending `inputRange`; give ascending ranges and flip the output.
- Standalone template `package.json`: copy exact pins from a scaffold (`react`/`react-dom` 19.2.3, `typescript` 5.9.3, remotion 4.0.534), add `.npmrc` with `save-exact=true`, and `render`/`still` scripts. `@remotion/media` is only needed with audio.
- Scaffold's blank `Composition.tsx` registers `<Composition>` inside a component; fine, but simpler to put compositions directly in `Root.tsx`.
- Git Bash: `pnpm exec remotion ...` works; avoid `--props` JSON quoting issues by using `--props=./props.json` [not run here].
- pnpm workspace: see verdict below.
- From official skills: do not render unless asked, preview with `npx remotion studio` first; don't use CSS animations; keep text >= 84 px headline / 44 px supporting at 1080 px width and 80-100 px safe margins; use `random()`; `premountFor={fps}` on timed `<Sequence>`/media.

pnpm workspace verdict (verified in scratch): root `pnpm-workspace.yaml` with `packages: ["templates/*"]` and a root `package.json`; `pnpm install` once (11 s) gives a shared 396 MB `.pnpm` store dir, each template only a 100 KB `node_modules` of symlinks. Each template renders with `pnpm exec remotion render` from its own folder (19-23 s incl. first browser download); Studio starts (`remotion studio --no-open --port 3123` printed "Server ready"). Cost: 283 MB browser per template unless shared via `--browser-executable`. Estimated 9 templates: ~0.4 GB + 9 x 0.28 GB, or ~0.7 GB with one shared browser.

## Go deeper

- Official agent skills: `npx skills add remotion-dev/skills` [not run here; the repo cloned fine: skills in `skills/remotion-best-practices/` with sub-skills create, markup, render, captions, saas, maps, studio, upgrade]
- Docs (append `.md` for plain text): https://www.remotion.dev/docs , CLI render https://www.remotion.dev/docs/cli/render , transparent video https://www.remotion.dev/docs/transparent-videos , `--gl` https://www.remotion.dev/docs/gl-options , captions https://www.remotion.dev/docs/captions , Remotion Skills https://github.com/remotion-dev/skills
