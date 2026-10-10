# isometric-explainer

A 30 s, 1920x1080, 30 fps silent isometric explainer of how a web request travels: laptop, load balancer, three app servers, a cache and a database. Blocks drop onto an isometric grid, connectors draw on, then a dark packet carries a request out and the response back. All names and content are fictional sample content. Style recipe: `skill/references/styles/isometric-explainer.md` (experimental tier).

Built with Remotion 4.0.534 (pinned). Remotion needs a paid Company License for for-profit companies with 4 or more people: https://www.remotion.pro/license

## Render

```
pnpm install
pnpm exec remotion browser ensure   # once, downloads Chrome Headless Shell
pnpm run render                     # out/isometric-explainer.mp4
pnpm run still                      # out/still.png (frame 300)
```

## Edit

Everything editable is in `content.json`:

- `theme`: colours, unit size (`unit`), edge width, spring, scene centre, caption sizes
- `parts`: id, kind (`laptop`, `balancer`, `server`, `cache`, `database`), tag text on the face, grid position `at`, `assembleAt` frame, `focus` window (accent) or `null`
- `connectors`: grid polylines (axis-aligned) and the frame each starts drawing
- `packet`: start frame, speed in px per frame, dwell frames at each node, route (part ids) and the labels for each leg
- `captions`: text and frame range; the entry with `"end": true` is the end card

Parts are positioned in grid units (x goes down-right, y goes down-left, z up). If you change the layout or the packet speed, re-time `captions` to the legs (the packet start, speed and dwell decide when it reaches each part).

Code: `src/theme.ts` (projection, tokens), `src/iso.tsx` (slab, face text, helpers), `src/parts.tsx` (one component per kind), `src/timeline.ts` (accent windows and packet legs), `src/Scene.tsx` (composition).

## Notes

- The recipe forbids glow and blur; the packet is a dark cube with pulsing hairline rings on the ground.
- Fonts (Inter, JetBrains Mono) come from `@fontsource` packages, no network during render.
