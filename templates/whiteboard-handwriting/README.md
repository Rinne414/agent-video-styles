# whiteboard-handwriting

A 32-second 1920x1080 30 fps whiteboard explainer: how compound interest works ($100 at 10% a year, the snowball, why starting early matters). Marker ink and doodles draw themselves stroke by stroke while an English voiceover (en-US-JennyNeural) speaks. HyperFrames + GSAP, no network needed to render. Style recipe: `skill/references/styles/whiteboard-handwriting.md` (experimental).

All numbers are sample data computed as 100 x 1.1^n.

## Render

```bash
pnpm run render        # builds index.html, renders out/whiteboard-handwriting.mp4
pnpm run check         # build + hyperframes check
pnpm run still         # snapshots/ PNGs at key times
```

Needs Node 22+, ffmpeg and Chrome. The CLI is pinned to `hyperframes@0.8.143` in `package.json`; GSAP is vendored in `vendor/`.

## Edit

Everything editable is in `content.json`: narration (`speech`) per scene, on-screen texts and amounts, accent colours, voice and rate, pen speeds, text sizes, tail hold.

After changing any `speech` or the voice, regenerate the audio (needs `edge-tts`, internet, and this repo's `skill/scripts/tts.py`):

```bash
pnpm run tts           # writes assets/audio/script.json, then *.mp3 + timeline.json
pnpm run render
```

`scripts/build.mjs` prints, per scene, when its ink finishes versus when its narration ends (it flags `INK LATE`). If a scene is flagged, shorten its texts or lengthen its narration. The doodles themselves are code in `scripts/lib/scenes.mjs`.

## How it works

- Lettering is single-stroke centerline paths from the Hershey Simplex font (`assets/hershey-futural.json`, extracted from `hersheytext@2.0.0`, MIT), laid out at build time. Doodles are lines, circles and rounded rectangles. A seeded wobble (<= 1.2 px) is baked into the path data.
- `build.mjs` writes `index.html`: one `<path pathLength="1">` per stroke, the audio tags, and the schedule. `src/driver.js` runs one GSAP proxy tween whose `onUpdate` sets every dash offset, the pen sprite, the eraser sweeps and the camera from the frame number.
- Frame budget (30 fps): hook 12-100, four zones 100-847 (one per narration sentence), end card 847-934, hold to 976.

## Notes

- Pen speeds are about 3x the recipe's numbers (see the report): at 900 px/s the ink cannot keep up with natural narration.
- The Hershey data is the EMSL conversion of the original Hershey vector fonts; kept for its legibility, see the `hersheytext` package licence (MIT).
