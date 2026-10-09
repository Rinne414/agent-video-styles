# dark-diagram-explainer

A narrated, faceless explainer: SVG diagrams build piece by piece on one dark canvas, with a camera that moves between regions, synced word by word to a TTS voice. Sample topic: how a CDN makes websites fast (fictional numbers). Built with Remotion 4.0.534.

- Output: `out/dark-diagram-explainer.mp4`, 1920x1080, 30 fps, about 57 s with AAC voiceover.
- Voice: `en-US-AndrewNeural` via `skill/scripts/tts.py` (Edge TTS is an unofficial client; check Microsoft's terms for commercial use).
- License note: Remotion needs a paid Company License for for-profit companies with 4 or more people (https://www.remotion.pro/license).

## Render

```
pnpm install
pnpm run render      # writes out/dark-diagram-explainer.mp4 (about 100 s)
pnpm run still       # one PNG at frame 300 (edit the frame in package.json)
pnpm run dev         # Remotion Studio
```

Rendering is offline: audio and timings are committed in `assets/audio/`, fonts come from `@fontsource/inter`, icons from `lucide-react`.

## Edit

Everything editable is in `content.json`: colors, labels and chapter titles, the narration (`speech` is what the voice says, `caption` is what is shown; `merge` joins spelled-out letters such as "C D N" into one caption word), gap and tail timing, voice and rate.

After changing narration, regenerate audio and timings (needs `pip install edge-tts` and ffprobe):

```
pnpm run tts
```

Cues are in `src/story.ts`: each one is "the frame where word X of segment Y starts", so scenes follow the new timings automatically. If you add or remove a word that a cue looks up, update that line. Layout (node positions, arc) is in `src/layout.ts`; style tokens (sizes, springs, glow) in `src/theme.ts`.

## Structure

- `src/World.tsx` persistent nodes, links, camera; `src/scenes/` per-beat overlays (Hook, Problem, Fix, Cache, Result, Outro)
- `src/Captions.tsx` two-line word-highlight captions; `src/Explainer.tsx` composition, chapter titles, audio
