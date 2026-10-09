# Template report: karaoke-caption-short

## Result
- `templates/karaoke-caption-short/out/karaoke-caption-short.mp4`: 1080x1920, 30 fps, 27.35 s (820 frames), h264 + AAC 48 kHz, 10.7 MB. Brief said "about 30 s"; the narration at +0% is 24 s, plus gaps and a 1.5 s tail.
- Full render time: 1 min 38 s (concurrency default). Full renders used: 1 of 3. About 12 stills rendered before it.
- `inspect_video.py`: no warnings, black 0 s, frozen 0 s, audio 27.35 s vs video 27.33 s.
- Preview: `previews/karaoke-caption-short.mp4` (1.29 MB) and `.webp`.

## Quality bar
- First caption visible by frame 3; hook under 3 s: PASS. First chunk is shown from segment frame 0 (sheet frame 1.167 s shows "你背过的东西"), first word starts at about 3 frames; the first chunk "你背过的东西 / 为什么三天就忘" is under 3 s.
- Active-word highlight within 1 frame of audio: PASS by construction (`floor(start_ms*fps/1000)` from timeline.json, audio Sequence placed at the rounded frame of the same cursor). Not measured against the waveform; only viewed stills where the highlighted word was plausible.
- No chunk over 2 lines; no line over 14 CJK chars: PASS. Longest chunk is 11 characters in 2 balanced lines (sheet 23.9 s, 8.0 s, 10.3 s).
- Captions never enter platform UI zones: PASS. Caption box x 80-900, vertical center y 1150, max 2 lines (about 1020-1280), bottom 420 and right 140 clear.
- Background moves/changes at least every 4 s: PASS. Gradient angle and 3 blobs drift continuously; the card swaps every 4.5-6.3 s and its art animates for 1.5-5 s; in the sheet blobs visibly move between frames.
- Audio and video durations within 0.3 s: PASS (0.02 s).

## Skill gaps
1. `references/tools/remotion.md` Fonts: recommends `@remotion/google-fonts` which fetches at render time, contradicting `templates/README.md` ("no network at render"). Missing: a verified offline CJK recipe. What worked: `pnpm add @fontsource/noto-sans-sc`, `import "@fontsource/noto-sans-sc/900.css"`, then `delayRender` + `document.fonts.load('900 100px "Noto Sans SC"', allUsedGlyphs)`. Propose adding this snippet to the Fonts section.
2. `references/styles/karaoke-caption-short.md` Audio: says to convert words to `@remotion/captions` `Caption` objects and `createTikTokStyleCaptions`, but gives no CJK recipe. For Chinese that grouping (time based, combine 800-1200 ms) breaks on clause boundaries and punctuation is missing from TTS words. I wrote my own chunker: split the original script at punctuation, map TTS words to clauses by cumulative character count, merge clauses of 3 characters or fewer into the next one, assert max 14. Propose documenting this "map by character count" algorithm (the audio doc says "map by character count" but no code) and saying `@remotion/captions` is optional.
3. `references/audio-tts-captions.md` / style Audio: recommends rate "+5% to +10%" for shorts, but with a ~30 s brief and a 5-sentence script the result is only 22-24 s. Add guidance for hitting a target length (rate -5..+0%, 0.4-0.5 s gaps, tail) and note a Chinese script of ~120 characters is about 24 s at +0%.
4. `references/styles/karaoke-caption-short.md` Look: "Key terms in highlight color" and "emphasis pop on 1 word per sentence" need a data format. Propose a `content.json` schema example (`keyTerms[]`, `emphasis`) and say emphasis must equal one TTS word (CJK words are 1-3 chars and unpredictable); I had to read timeline.json to pick valid ones.
5. Style Look table: caption zone says keep right 140 px clear, so the centered box is x 80-900, which makes captions visibly off-center (left shifted by 50 px relative to the 1080 canvas) while the card is centered. Clarify whether to center in the safe zone (what I did) or on the canvas.
6. `references/tools/remotion.md` Render: lists `--pixel-format=yuv420p` as the way to avoid `yuvj420p`, "not run here". I ran it with the jpeg image format from the scaffold config and the output is still `yuvj420p` (inspect_video shows it). Fix: say that you need `--image-format=png` (or `Config.setVideoImageFormat("png")`) in addition, or accept yuvj420p.
7. `remotion.md` Setup: the scaffold's package.json uses `^`-free pins but also includes eslint packages; no guidance to strip them. Also pnpm inside a repo with a parent package.json (not a workspace) works fine, but say so. Minor: `create-video` into the scratchpad then copy only `src/index.ts`, `remotion.config.ts`, `tsconfig.json` is the fastest path; note `Config.setPublicDir("assets")` to keep audio in `assets/audio` as the templates README requires, since the doc assumes `public/`.
8. `remotion.md` Minimal shape: the `lib` of the scaffold tsconfig is `["es2015"]`, which fails on `document.fonts` and `Array.from(new Set())`; add `"dom"` and `"es2019"`, and `resolveJsonModule` for `content.json`.
9. `SKILL.md` step 4: "show it to the user" has no fallback for non-interactive runs; add "or write STORYBOARD.md".
10. `SKILL.md` step 5: the "one theme file" rule plus `templates/README.md`'s `content.json` rule are not linked; say theme.ts should read from content.json.

No online lookups of official docs were needed.

## Tool issues and fixes
- A heredoc containing three large files in one Git Bash call failed to parse ("unexpected EOF"); nothing was written. Fixed by using the Write tool.
- `tsc` error `fill specified more than once` from spreading a `stroke()` helper that includes `fill:"none"`; removed the duplicate prop.
- `pnpm install` warns "Ignored build scripts: esbuild"; harmless as the doc says.
- First render downloaded Chrome Headless Shell automatically; no MAX_PATH problem (project path is about 130 characters).
- Output is `yuvj420p` (see gap 6).

## Honest self-assessment
- Matches the style description: big 104 px Noto Sans SC 900 white captions with black stroke, `#FFD400` active word with scale 1.12, key terms yellow, chunk spring-in with hard cuts, one emphasis pop per sentence, 8 px progress bar, flowing gradient with blurred blobs, 880 px cards at y 380-960.
- A motion designer would criticize: (1) the cards are simple and a bit empty in the lower half (hook, teach); the icons are generic flat vector with no depth or secondary motion; (2) the background is soft but low contrast and the blobs move slowly, so the "pattern interrupt every 3-5 s" is mostly just the card swap; there is no zoom punch or emoji pop; (3) the caption block sits left of center because of the right 140 px rule; (4) the first card state (empty bar, hidden pills) pops in with a spring at 0.9 scale while the caption is already there, a little busy at frame 0; (5) the sync was derived, not measured against the waveform; (6) short clauses are merged ("第一 间隔重复"), so the number is not a separate beat; (7) no music bed, the preview feels dry; (8) 27 s rather than 30 s.
