# talking-head-overlay

Motion-graphics overlay package for talking-head videos: lower third, three numbered side panels, a data callout and a subscribe pill, all kept out of the speaker's face area. The sample content is fictional ("Maya Chen, CTO at Fernway").

Two compositions share the same overlay code:

- `Composite`: overlay on a code-drawn placeholder plate ("YOUR FOOTAGE HERE", speaker silhouette in the left third, dashed face-safe zone). Renders `out/talking-head-overlay.mp4`.
- `Overlay`: graphics only on a transparent canvas. Renders `out/talking-head-overlay.mov` (ProRes 4444, alpha) for your editor.

## Render

```
pnpm install
pnpm run render      # both files, about 85 s on an RTX 3090 machine
pnpm run still       # one composite frame to out/still.png
pnpm run check       # face-safe + overlay-count check, then tsc
```

Remotion needs a paid Company License for for-profit companies of 4+ people: https://www.remotion.pro/license

## Use it on your own footage

1. Set `fps`, `width`, `height`, `durationInFrames` in `content.json` to match the clip.
2. Render the `Overlay` composition and drop the `.mov` above your footage in the editor, or replace `<Plate />` in `src/Overlay.tsx` with `<OffthreadVideo src={staticFile("clip.mp4")} />` for a composite.
3. Set `faceBox` to the head + shoulders box of your speaker (plus 10%) and run `pnpm run check`; it fails if any overlay rect intersects it.

## What to edit (`content.json`)

| Key | Meaning |
|---|---|
| `accent` | Brand accent color |
| `faceBox` | Face-safe rectangle that no overlay may enter |
| `lowerThird` | `name`, `title`, `from`/`to` frames, `rect` |
| `steps[]` | `number`, `label`, `from`/`to`, `rect` (add or remove entries freely) |
| `callout` | `value` (counted up), `unit`, `caption`, frames, `rect` |
| `subscribe` | Pill `label`, frames, `rect` |
| `plate` | Placeholder label and silhouette position |

Frames are at 30 fps; line them up with the words in your footage (start an overlay about 2 frames before its trigger word). Style tokens (type sizes, motion durations, colors) are in `src/theme.ts`.
