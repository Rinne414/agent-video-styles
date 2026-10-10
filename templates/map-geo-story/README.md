# map-geo-story: The Silk Road in 30 seconds

Experimental style. A route draws from Chang'an through Samarkand and Baghdad to Constantinople on an offline vector map (Natural Earth via `world-atlas`), with region highlights, city pings and short annotations. 1920x1080, 30 fps, 30 s, silent.

All map data comes from npm (`world-atlas` 2.0.2, `d3-geo` 3.1.1, `topojson-client` 3.1.0); no tiles, no API keys, no network during render. The route is schematic, borders are modern and shown for orientation only. Historical statements are summarised in `STORYBOARD.md`.

## Render

```
pnpm install
pnpm run render      # out/map-geo-story.mp4 (about 50 s on an RTX 3090 machine)
pnpm run still       # out/still.png at frame 450
pnpm exec remotion studio
```

Remotion needs a paid Company License for for-profit companies with 4 or more people: https://www.remotion.pro/license

## Edit

Everything is in `content.json`:

| Key | What it controls |
|---|---|
| `meta` | size, fps, duration |
| `theme` | colors, font, safe margin, region opacities |
| `text` | kicker, title, source line, takeaway |
| `places` | name, `[lon, lat]`, label offset (a place without `label` is an unlabeled waypoint dot) |
| `legs` | ordered places for each route leg and the frames in which it draws |
| `regions` | countries (by Natural Earth `name`) to fill, fill frame, frame to dim |
| `annotations` | anchor place, frames, panel offset and width, head and text lines |
| `camera` | keyframes (frame, `[lon, lat]` centre, Mercator scale) |
| `outro` | frame the takeaway enters and the frame it is settled |

To retell another route, change `places`, `legs`, `regions`, `annotations` and `camera`; scene code stays untouched. Dots appear automatically when the route tip reaches them.

## Files

- `src/theme.ts` content plumbing, font loading, style tokens
- `src/geo.ts` TopoJSON parsed once, camera projection, great-circle legs, dot timing
- `src/BaseMap.tsx`, `Routes.tsx`, `Places.tsx`, `Annotations.tsx`, `Overlays.tsx` layers
