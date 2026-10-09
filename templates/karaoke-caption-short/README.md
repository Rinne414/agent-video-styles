# karaoke-caption-short

1080x1920 / 30 fps vertical short with huge word-by-word highlighted Chinese captions over a flowing gradient, one code-drawn card per point. Sample topic: three ways to remember what you learn. All content is fictional sample copy. Built with Remotion 4.0.534 (pinned).

## Render

```
pnpm install
pnpm run render      # out/karaoke-caption-short.mp4 (about 27 s, ~1.5 min)
pnpm run still       # out/still.png, frame 60
pnpm run dev         # Remotion Studio
```

Fonts come from `@fontsource/noto-sans-sc` (npm), audio is shipped in `assets/audio/`, so rendering needs no network.

Remotion licence: free for individuals and companies of up to 3 people; companies of 4+ need a Company License (https://www.remotion.pro/license).

## Edit

Everything lives in `content.json`:

- `theme`: highlight color, text color, gradient, blob colors
- `video`: fps, size, gap between segments, tail
- `segments[]`: `text` (narration), `keyTerms` (always highlighted), `emphasis` (the one word that pops; must equal a TTS word), `card` (`type` hook / spaced / recall / teach / cta, `big`, `unit`, `label`, `marks`)

After changing `text` or `voice`, regenerate the narration, then re-render:

```
python - <<'PY'
import json
c = json.load(open("content.json", encoding="utf-8"))
json.dump({"voice": c["voice"]["name"], "rate": c["voice"]["rate"],
           "segments": [{"id": s["id"], "text": s["text"]} for s in c["segments"]]},
          open("assets/audio/script.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
PY
python ../../skill/scripts/tts.py assets/audio/script.json --out-dir assets/audio
```

Segment count must match the number of entries in `content.json`. Chunks split at punctuation (3 characters or fewer merge with the next clause, max 14 characters).

Edge TTS is an unofficial client of Microsoft's online service; check its terms before commercial use.
