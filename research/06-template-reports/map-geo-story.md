# Template report: map-geo-story

## Result

- Built from the skill only (SKILL.md, `styles/map-geo-story.md`, `tools/remotion.md`, `templates/README.md`).
- Output: `templates/map-geo-story/out/map-geo-story.mp4`, h264 1920x1080 30 fps, 900 frames, 30.00 s, yuv420p, silent, 6.5 MB. `inspect_video.py` reported `OK`, no edge-band warning, black 0.00 s, longest still stretch 1.93 s at 20.0 s (a slow-drift hold, expected).
- Full renders used: 1 of 3 (47.6 s wall time, default concurrency, no SVG filters). Stills rendered before it: 11 (frames 0, 60, 100, 150, 190, 260, 380, 505, 720, 880 plus re-renders after fixes).
- Previews: `previews/map-geo-story.mp4` (1.11 MB) and `previews/map-geo-story.webp` (poster at 28.5 s, shows all four regions, route and takeaway).
- Stack: Remotion 4.0.534, d3-geo 3.1.1, topojson-client 3.1.0, world-atlas 2.0.2 (50m), @fontsource/inter 5.2.8, all exact-pinned. Everything editable is in `content.json`.
- Verdict on the recipe: buildable from the doc with one afternoon of judgment calls; the look is correct, but the doc leaves several layout decisions (title scrim, label collisions over the amber fill, camera numbers) to the agent. See gaps.

## Quality bar

| Item | Status | Evidence |
|---|---|---|
| Coordinates spot-checked (`[lon, lat]`) | PASS | Frames 505/720/880: Baghdad lands inside Iraq, Constantinople on the Bosphorus at the Turkey/Europe edge, Samarkand inside Uzbekistan, Kashgar at the Xinjiang edge, Chang'an inland China. |
| Source line visible; sample data labelled | PASS | Bottom-left in every frame: "Map: Natural Earth via world-atlas, Route is schematic, Modern borders shown for orientation". No invented numbers; the one figure (6,000+ km) is below the computed 6,831 km great-circle distance. |
| Labels >= 32 px, halos, contrast >= 4.5:1, no collisions, max 6 on screen | PASS with note | Labels are 32 px Inter 600 with a 3 px halo; at most 5 city labels plus 1 annotation on screen. White text on the 85% amber fill relies on the halo (white on `#D78F10` alone is about 2.4:1); this is legible in frames 505 and 880 but is not a clean 4.5:1 on the fill itself. Annotations sit on a 88% dark panel (white 15:1, amber head 8:1). No collisions in the sheet; Chang'an's label had to be moved off the route and leader line after a first still. |
| Zooms and pans use one easing, smooth at 30 fps | PASS (frame-level), not viewed as motion | One `Easing.inOut(Easing.cubic)` drives scale and centre together (`geo.ts`). I checked stills at the ends of each move and the contact sheet, not the motion itself. |
| Routes follow great circles, no antimeridian wrap | PASS | Legs are `geoInterpolate` polylines (32 samples per segment); the route never nears the antimeridian. |
| Geometry loaded once; render time recorded | PASS | TopoJSON parsed at module load in `geo.ts`; 50m land drawn as one path, borders as one mesh path; `clipExtent` on the projection. 47.6 s for 900 frames. |
| Fonts confirmed in a still; neutral border data | PASS | Frames 260/880: Inter (single-storey "a" absent, Inter's distinctive "g", tabular figures) rendered in the title, labels and annotations. Borders from Natural Earth via world-atlas. |
| Outro settled by ~frame 860 (scaled) and held >= 1.5 s | PASS | Takeaway panel enters 815, settled 845, held to 900 = 55 frames (1.83 s). Frame 880 shows it. |
| Facts accurate | PASS (checked against what I know; no web check) | Han/Tang capital Chang'an; Sogdian Samarkand; paper-making after 751 (Talas, stated as "follows after", traditional); Baghdad capital from 762, paper mill by 794; silkworm eggs c. 552 CE. Not independently source-checked online because the rules forbid it without logging a gap. |
| Silent: sound items | N/A | No audio track. |

## Skill gaps

1. `references/styles/map-geo-story.md`, "Structure". The 45 s table scaled to 30 s leaves 0-100 frames (3.3 s) of an almost empty establishing shot and a 90-frame zoom to a region with nothing in it (frames 100-190 in this build are visually the weakest). Missing: advice to put something on screen during Establish (planned dashed route, first highlight) or to shorten it for videos under 40 s. Proposed edit: add "For 30 s or less, make Establish 60 frames, start the planned dashed route and the first region fill inside it, and merge Zoom in with Beat 1."
2. `styles/map-geo-story.md`, "Look" (Highlight region 85% fill + Labels). Nothing tells the agent that title text, kicker, white labels and amber text collide with the fill at zoomed views (kicker amber text over amber China was unreadable in my first still). I added a radial dark scrim behind the title and source line and a dark panel behind annotations. Proposed edit: "Place titles on a corner scrim (`radial-gradient(ellipse at 0 0, #0E1621E6 50%, transparent)`) and annotations on a 88% background panel with a 6 px highlight bar; fills at 85% mean labels must rely on halos or panels."
3. `styles/map-geo-story.md`, "Motion grammar" and "Structure": no camera keyframe numbers. For a Mercator Eurasia route I needed scale about 700 (wide), 1800 (3 cities), 2400 (Anatolia) and 950 (full route inside the 96 px safe area, labels included). First choice 1150 pushed Constantinople and Chang'an labels out of the safe area. Proposed edit: add a worked camera table and the rule "full view scale = (1920 - 2x96 - label half widths) / (lon span in radians)".
4. `styles/map-geo-story.md` has no recipe for annotation anchoring while the camera moves, label placement offsets, or a leader line that avoids crossing its own label. I built per-place `{anchor, dx, dy}` offsets and per-annotation `{dx, dy, width}` panel offsets in `content.json`; a ready content schema would save the next agent a pass. Proposed edit: include the `places/legs/regions/annotations/camera` JSON shape from this template.
5. `styles/map-geo-story.md`, "Look": a "Highlight region" of modern countries for ancient/medieval stories is anachronistic and politically loaded (Xinjiang and Tibet are inside the amber China shape; Natural Earth China is one polygon). Missing: guidance on historical stories (use modern borders only for orientation and say so on the source line, or fill points/corridors instead). I put "Modern borders shown for orientation" in the source line. Proposed edit: add this to Pitfalls, "Borders".
6. `tools/remotion.md`, "Setup": `create-video` refused to scaffold into an existing directory without telling me the exact flags; the doc says "scaffold in a scratch dir" but not that `pnpm install` for a hand-written `package.json` is simpler than scaffolding. It also lacks the `@types/*` pins needed for d3-geo/topojson (`@types/d3-geo`, `@types/topojson-client`, `@types/topojson-specification`, `@types/geojson`) and the TypeScript cast needed for importing `world-atlas/*.json` and `content.json` (`as unknown as Topology`, `as unknown as Record<...>` for tuples). Proposed edit: list these in the Remotion setup or in the map style file.
7. `tools/remotion.md`, "Fonts": `import "@fontsource/inter/latin-600.css"` needs a `declare module "*.css"` d.ts to avoid a TS error under `tsc`; only the `.woff2` declaration is shown. (Minor.)
8. `SKILL.md`, step 4: "Derive frame ranges from the style's Structure table" does not say how to size annotation durations; I used the 0.5 s + words/3.5 rule from "Rules" but annotations of 9-10 words needed about 100 frames, which pushes the scaled Structure out of proportion. Proposed edit: say that reading time wins over proportions and that the video should be lengthened or the copy cut.
9. `SKILL.md`/`styles/map-geo-story.md`: no mention that a brief for a historical route will need facts verified; the Quality bar item is only "coordinates". Proposed edit: add "Facts and dates verified (cite in the storyboard)" to the Quality bar.

## Tool issues

- `npx create-video@latest --yes --blank --no-tailwind scaf` exited with "Something already exists" in my scratch dir (leftover from an earlier run); the scaffold's `package.json` still gave me the exact pin set (4.0.534, react 19.2.3, typescript 5.9.3). Not a doc error.
- Stills with `--image-format=png` print a leading `○` for "Rendered 0/1" before "1/1"; harmless.
- The Bash tool rejected a long heredoc batch containing many quotes (`unexpected EOF`); I wrote the source files with the Write tool instead. Environment quirk, not the skill's.
- Remotion with default `Config.setVideoImageFormat("png")` produced `yuv420p` as the doc promised; render was 47.6 s even while other agents were rendering.

## Honest self-assessment

- Does it look like the style? Mostly. It matches the token table (dark ocean/land, amber highlight, sky-blue 4 px route with round caps, dashed planned route, pulse rings, Inter 32 px labels with halos, camera-as-projection, source line, takeaway). It does not reach the "Vox-annotated" polish and the map is Mercator with flat country fills: functional editorial geography, not a showpiece. The first 3 seconds are dull (very dark, nearly empty map) and the amber fill at 85% on zoomed views is loud; both come straight from the recipe's tokens and structure.
- Weak points I know about: Establish is thin; camera pan and route draw were only checked as stills and a 12-frame sheet, not played; label legibility on amber depends on halos; hold of 1.9 s near 20 s is a drift-only stretch.
- Is the recipe strong enough? Strong on tokens and technique (d3-geo + topojson + exact pins worked first time, geometry caching advice was right). Thin on the parts that cost me iterations: camera numbers, scrim/panel for text over fills, structure at 30 s, and content schema. An agent without my judgment would likely produce unreadable titles over the amber fill and out-of-safe-area labels in the full view. With gaps 1-4 fixed it would be reusable. Status of the style tier: promoting it needs a second independent template; this one is one data point.
