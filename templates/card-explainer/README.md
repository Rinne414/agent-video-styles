# card-explainer

An article turned into a 61 s narrated sequence of nine animated cards, one key sentence per card (the Bilibili knowledge-video look). Sample content: a Chinese short essay on why the Pomodoro technique works. Fictional author and channel.

- Tool: HyperFrames `0.8.143` (HTML + GSAP, vendored in `vendor/`)
- Output: 1920x1080, 30 fps, h264 + aac, `out/card-explainer.mp4`
- Voice: `zh-CN-YunxiNeural` (Edge TTS; the generated audio is committed in `assets/audio/`)
- Font: Noto Sans SC (OFL), subset to GB2312 level-1 characters, 1.2 MB, in `assets/fonts/`

## Render

```
pnpm run render      # builds index.html from content.json, then renders (about 45 s)
pnpm run still       # PNG stills in snapshots/
pnpm run check       # lint + layout audit
```

Needs Node 22+, ffmpeg, Chrome. No network at render time.

## Edit the content

Everything lives in `content.json`: titles, key sentences, highlight phrases, layouts (`title`, `key`, `bignumber`, `compare`, `tally`, `list`, `outro`), colors (`theme`), voice, and the narration of each card.

Change narration text or voice, then regenerate the audio (needs `pip install edge-tts`):

```
pnpm run tts         # content.json -> assets/audio/script.json -> mp3 + timeline.json
pnpm run render
```

Card lengths, caption timing, highlight sweeps and count-ups are all derived from `assets/audio/timeline.json`, so changing the text changes the timing automatically. Do not edit `index.html` (it is generated).

Characters outside the GB2312 level-1 set need a bigger font subset: `python scripts/subset-font.py <NotoSansSC[wght].ttf> assets/fonts/NotoSansSC-subset.woff2` (needs `fonttools` and `brotli`).

## Files

```
content.json            all editable content
scripts/                make-script, align (TTS timings -> text), cards (markup), build (index.html)
src/style.css, main.js  look and motion (inlined into index.html by build)
assets/audio/           narration mp3, timeline.json, plan.json (card frame ranges)
STORYBOARD.md           the scene table planned before building
```
