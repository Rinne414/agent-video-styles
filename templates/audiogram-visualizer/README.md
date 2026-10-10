# audiogram-visualizer

A 20-second 1080x1080 podcast clip for a fictional show ("The Small Batch Podcast, Episode 12"): TTS narration, 48 audio-reactive
bars computed per frame with `@remotion/media-utils`, code-drawn cover art, and word-timed captions. All content is fictional sample content.
Experimental style: see `skill/references/styles/audiogram-visualizer.md`.

## Render

```
pnpm install
pnpm run render      # out/audiogram-visualizer.mp4
pnpm run still       # out/still.png (frame 300)
```

Requires Node 22+, pnpm, FFmpeg (only for `scripts/mix.py`). Remotion 4.0.534 is pinned. Remotion needs a paid Company License
for for-profit companies with 4+ people: https://www.remotion.pro/license . Edge TTS is an unofficial client of Microsoft's service; check
its terms before commercial use.

## Edit

Everything editable is in `content.json`: show title, episode, initial, URL, colors (`theme`), voice and timing (`audio`), and the narration
`segments`. After changing the narration or timing, regenerate the audio, then render:

```
python ../../skill/scripts/tts.py assets/audio/script.json --out-dir assets/audio    # script.json mirrors content.json audio + segments
pnpm run audio                                                                       # scripts/mix.py -> narration.wav + layout.json
```

`DURATION` in `src/theme.ts` follows `layout.json`. Layout tokens (bar count, sizes, caption box, springs) live in `src/theme.ts`.
`Debug` is a QA still that prints per-bar peaks and the largest frame-to-frame jump:
`pnpm exec remotion still Debug out/debug.png --image-format=png`.

## Files

`src/Audiogram.tsx` (composition), `Cover.tsx`, `Bars.tsx`, `CaptionView.tsx`, `captions.ts` (chunking), `audioBars.ts` (spectrum to heights),
`assets/audio/` (generated TTS, `timeline.json`, mixed `narration.wav`). Font: `@fontsource/inter` (offline). No music; the only sound is the TTS voice.
