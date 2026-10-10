# Map Geo Story

Routes draw across a projected map, places pulse and regions fill: editorial geography rendered from open vector data, offline, with no map API keys.

- **Primary tool**: Remotion with `d3-geo` + `topojson-client` + `world-atlas` from npm (alt: HyperFrames map blocks)
- **Tier**: experimental (few public examples; validated by one template)
- **Format**: 1920x1080 30 fps (or 1080x1920); 20-90 s
- **Inputs to ask for**: the geography, a data file (CSV with `lon,lat,name[,date,value]`), the story beats (places or regions in order), dark or paper theme, source line

## Look

| Token | Value |
|---|---|
| Ocean / background | dark `#0E1621` or paper `#EDEAE3` |
| Land | `#1F2A37` (dark) / `#D8D3C8` (paper); borders 1 px at 30% of text color |
| Highlight region | amber `#F59E0B` at 85% fill (or brand color); one highlight color per video |
| Routes | 4 px stroke `#38BDF8` (dark) or `#0B5CAD` (paper), round caps; planned routes dashed `8 6` |
| Points | 10-14 px circles; pulse ring grows to 48 px while fading to 0% |
| Labels | Inter 600 32 px, text `#F5F7FA` (dark) or `#1A1A1A` (paper), 3 px halo in the background color (`paint-order: stroke`); dot + leader line; never amber text on paper (fails 4.5:1) |
| Projection | world: `geoEqualEarth` or `geoNaturalEarth1`; country or region: `geoMercator` or `geoConicConformal` |
| Geometry | `world-atlas/countries-110m.json` for world views, `countries-50m.json` when zoomed in; countries selected by `properties.name` |
| Title | kicker 30 px letter-spaced + headline 64 px, top-left at 96 px, on a corner scrim `radial-gradient(ellipse at 0 0, #0E1621E6 50%, transparent)` (same under the source line) |
| Annotation | panel at 88% background colour with a 6 px highlight bar; offsets `{dx, dy, width}` per annotation. Text over 85% fills is unreadable (amber on amber), so labels need halos or panels |
| Source line | 30 px at 70% opacity, bottom-left; sample data labelled "sample data" |
| Safe area | 96 px on 16:9; on 9:16 keep 220 px top and 300 px bottom clear |

Camera scales (Mercator, 1920 wide): the full-view scale is about `(1920 - 2*96 - label half widths) / lon span in radians` (Eurasia route about 950; wide 700, three cities 1800, one region 2400); a bigger full-view scale pushes end labels out of the safe area. Dependencies are exact-pinned from npm (for example `d3-geo` 3.1.1, `topojson-client` 3.1.0, `world-atlas` 2.0.2; confirm with `pnpm view`) and the JSON is imported into the bundle, so nothing is fetched at render. Fonts are vendored (`@fontsource/inter`, `@fontsource/source-serif-4` for the annotated variant, `@fontsource/noto-sans-sc` for Chinese labels) via `loadFont` in one shared module. Typings: `@types/d3-geo`, `@types/topojson-client`, `@types/topojson-specification`, `@types/geojson`; cast imported JSON with `as unknown as Topology`; `declare module "*.css"` for fontsource CSS. Below country level (states, counties) the user must supply licensed TopoJSON or GeoJSON, for example `us-atlas`; note it in the source line.

## Motion grammar

- **Camera = projection**: keyframe projection `scale` and `center`/`rotate`, interpolate over 45-60 frames with `Easing.inOut(Easing.cubic)`, and recompute paths each frame (pure function of frame). Zoom and pan share one easing.
- **Routes**: great-circle coordinates from `geoInterpolate`, drawn with `stroke-dashoffset` over 45-90 frames (`Easing.inOut(Easing.quad)`) with a 12 px head marker riding the tip.
- **Regions**: fill opacity `0 -> 0.85` over 15 frames as the narration names them; stagger 2 frames for groups.
- **Points**: `spring({damping: 12, stiffness: 200})` scale `0 -> 1`, stagger 1-2 frames; for hundreds or thousands reveal by time bucket and draw on `<canvas>`.
- **Labels**: fade plus 8 px rise, 6 frames after their point; max 6 on screen.
- **Drift**: 1-2% slow zoom while holding a view so the map never freezes.
- **Never**: separate easings for zoom and pan, colliding labels, re-parsing TopoJSON per frame, map tiles that need keys.

## Structure (45 s = 1350 frames @ 30 fps; percentages scale)

| Beat | Frames | Content |
|---|---|---|
| Establish | 0-11% | World or region view, title and kicker; for 30 s or less use 60 frames, start the planned dashed route and first fill inside it, and merge Zoom in with Beat 1 |
| Zoom in | 11-22% | Camera to the first region |
| Beats 1-3 | 22-78% | 250 frames each: route, points or fills + one annotation |
| Zoom out | 78-91% | Full picture with all data visible |
| Outro | last 9% | Takeaway sentence + source, settled by 1/3 of the beat and held |

Proportions scale to the requested length: 20 s keeps 1 beat, 90 s gives 6-7. With narration each beat's length comes from its `timeline.json` segment. Reading time beats proportions: a 9-10 word annotation needs about 100 frames, so lengthen the video or cut copy.

`content.json` shape: `places[{id, name, lon, lat, anchor, dx, dy}]`, `legs[{from, to, planned}]`, `regions[{name, beat}]`, `annotations[{beat, text, dx, dy, width}]`, `camera[{beat, scale, center}]`; leader lines must not cross their own label.

## Audio

Ambient or documentary-style music; a soft whoosh on camera moves; a light ping when a route arrives. Voiceover optional: `scripts/tts.py` timeline, fills triggered on the word that names the region (`../audio-tts-captions.md`). Captions at 40-48 px inside the bottom safe area. Silent brief: sound items N/A, and labels must carry the story alone.

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

- [ ] Coordinates spot-checked (d3 expects `[lon, lat]`)
- [ ] Source line visible; sample or invented data labelled as sample
- [ ] Labels >= 32 px with halos, contrast >= 4.5:1, no collisions, max 6 on screen
- [ ] Zooms and pans use one easing and look smooth at 30 fps
- [ ] Routes follow great circles and do not wrap across the antimeridian
- [ ] Geometry loaded once; render time recorded (SVG filters make it crawl; use `--gl=angle` if blur or filters are used)
- [ ] Fonts confirmed in a still; borders use neutral Natural Earth data
- [ ] Facts and dates verified (cited in the storyboard)
- [ ] Outro settled and held >= 1.5 s

## Pitfalls

- **Swapped coordinates**: `[longitude, latitude]`; a swap puts Taipei in the ocean.
- **Antimeridian artifacts**: straight lines between far points cross the map; use `geoInterpolate`.
- **Slow renders**: parse TopoJSON once and memoize `feature()`; use `110m` unless zoomed in.
- **Too many SVG nodes**: thousands of points per frame crawl in SVG; use a canvas layer.
- **Map tiles and APIs**: Mapbox or Google tiles need keys and terms; vector atlas data avoids both. The tile-based Remotion maps skill may need a token.
- **Borders**: disputed borders are political; use neutral data and cite the source. For historical stories modern country fills are anachronistic: use borders for orientation only (say so on the source line) or fill points and corridors instead.
- **HyperFrames alternative**: for 1080-wide formats compose 1088 wide, then crop.

## Variants

- **point-cloud**: thousands of locations (e.g. 4,957 coordinates) on a canvas layer, revealed by date bucket with additive glow (`globalCompositeOperation = 'lighter'`) and a running total top-right.
- **vox-annotated**: paper theme, highlighter strokes behind key labels (amber at 40%), hand-drawn style circles (3 px), dashed leader lines, small photo cards with a source tag, editorial serif headline (Source Serif 4 700, 64 px).
