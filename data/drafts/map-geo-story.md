# Map Geo Story

Routes draw across a projected map, places pulse and regions fill: Vox-style editorial geography, rendered from open vector data with no map API keys.

- **Primary tool**: Remotion with `d3-geo` + `topojson-client` + `world-atlas` (alt: HyperFrames map blocks)
- **Format**: 1920x1080 30 fps (or 1080x1920); 20-90 s
- **Inputs to ask for**: the geography, a data file (CSV with `lon,lat,name[,date,value]`), the story beats (which places/regions in what order), light or dark theme, source line

## Look

| Token | Value |
|---|---|
| Ocean / background | dark `#0E1621` or paper `#EDEAE3` |
| Land | `#1F2A37` (dark) / `#D8D3C8` (paper); borders 0.75 px at 30% of text color |
| Highlight region | `#F59E0B` amber at 85% fill (or brand color); one highlight color per video |
| Routes | 4 px stroke `#38BDF8`, round caps; planned routes dashed `8 6` |
| Points | 8-12 px circles; pulse ring grows to 40 px while fading to 0% |
| Labels | Inter 600 28-32 px with a 3 px halo in the background color (`paint-order: stroke`); dot + leader line |
| Projection | world: `geoEqualEarth` or `geoNaturalEarth1`; country/region: `geoMercator` or `geoConicConformal` |
| Geometry | `world-atlas/countries-110m.json` for world views, `countries-50m.json` when zoomed in |
| Title | kicker 24 px letter-spaced + headline 56 px, top-left at 80 px |
| Source line | 18 px at 50% opacity, bottom-left |

## Motion grammar

- **Camera = projection**: keyframe projection `scale` and `center`/`rotate`, interpolate over 45-60 frames with `Easing.inOut(Easing.cubic)`, and recompute paths every frame (pure function of frame). Zoom and pan share one easing.
- **Routes**: build great-circle coordinates with `geoInterpolate`, then draw via `stroke-dashoffset` over 45-90 frames (`Easing.inOut(Easing.quad)`) with a 10 px head marker riding the tip.
- **Regions**: fill opacity `0 -> 0.85` over 15 frames as the narration names them; stagger 2 frames for groups.
- **Points**: `spring({damping: 12, stiffness: 200})` scale `0 -> 1`, stagger 1-2 frames; for hundreds or thousands of points reveal by time bucket, not one by one.
- **Labels**: fade + 8 px rise, 6 frames after their point; max 6 labels on screen.
- **Drift**: 1-2% slow zoom while holding a view so the map never freezes.
- **Never**: separate easings for zoom and pan (feels seasick), labels colliding, re-parsing TopoJSON every frame.

## Structure (45 s = 1350 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Establish | 0-150 | World or region view, title and kicker |
| Zoom in | 150-300 | Camera to the first region |
| Beats 1-3 | 300-1050 | 250 frames each: route, points or fills + one annotation |
| Zoom out | 1050-1230 | Full picture with all data visible |
| Outro | 1230-1350 | Takeaway sentence + source, held |

With narration, each beat's length comes from its segment in `timeline.json`.

## Audio

Ambient or documentary-style music; a soft whoosh on camera moves; a light ping when a route arrives. Voiceover optional but common for explainers: generate with `scripts/tts.py` (`{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`) and trigger region fills on the word that names them. See `../audio-tts-captions.md`.

## Agent brief (template)

```
Style: map-geo-story (see references/styles/map-geo-story.md)
Geography: <world | country | region>, projection <...>
Data: <path to CSV with lon,lat,name[,date,value]>, source "<...>"
Beats: 1) <route A -> B / region fill / points by year> 2) ... 3) ...
Labels: <max 6 key places>
Theme: dark | paper, highlight <hex>
Variant: none | point-cloud | vox-annotated
Format: 1920x1080 30fps, <length> s; narration yes/no
```

## Quality bar

- [ ] Every place is correct (coordinates spot-checked; d3 expects `[lon, lat]`)
- [ ] Data source line visible
- [ ] Labels >= 28 px with halos; no collisions; max 6 on screen
- [ ] Zooms and pans use one easing and feel smooth at 30 fps
- [ ] Routes follow great circles and do not wrap across the antimeridian
- [ ] Render time reasonable (geometry loaded once, simplified)

## Pitfalls

- **Swapped coordinates**: d3-geo takes `[longitude, latitude]`; a lat/lon swap puts Taipei in the ocean.
- **Antimeridian artifacts**: straight lines between far points draw across the whole map; use `geoInterpolate` and let the projection's clipping handle it.
- **Slow renders**: parse TopoJSON once (load via `staticFile` + `delayRender`, memoize `feature()` results); use `countries-110m` unless zoomed in.
- **Too many SVG nodes**: thousands of points per frame make SVG slow; draw them on a `<canvas>` instead.
- **Map tiles and APIs**: Mapbox/Google tiles need keys and have terms of service; vector world-atlas data avoids both.
- **Borders**: disputed borders are political; use neutral Natural Earth data and note the source.

## Variants

- **point-cloud**: thousands of locations (e.g. 4,957 coordinates) drawn on a canvas layer, revealed by date bucket with an additive glow (`globalCompositeOperation = 'lighter'`) and a running total counter top-right.
- **vox-annotated**: paper theme, highlighter strokes behind key labels (amber at 40%), hand-drawn style circles around regions (rough, 3 px), dashed annotation leader lines, small photo or document cards with a source tag, an editorial serif headline (e.g. Source Serif 4, 64 px).
