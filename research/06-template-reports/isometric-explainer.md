# Template report: isometric-explainer

## Result

- Delivered `templates/isometric-explainer/` (Remotion 4.0.534 pinned, tsc clean), `out/isometric-explainer.mp4` (1920x1080, 30 fps, 900 frames, 30.00 s, yuv420p, silent, 3.6 MB), `previews/isometric-explainer.mp4` + `.webp` (poster at 18.6 s).
- Full renders used: 1 of 3 (30 s wall time). About 20 single-frame stills before it (two iterations: layout, then retiming).
- `inspect_video.py`: no edge-band warning, no black; longest still stretch 1.83 s at 28.17 s (the end card hold).
- Brief fully delivered: laptop -> load balancer -> three app servers -> cache -> database, blocks assemble on an iso grid, packet travels out and back, short labels, silent. The recipe was enough to build from only because I filled many gaps myself (see Skill gaps).

## Quality bar

| Item | Verdict | Evidence |
|---|---|---|
| Every edge lies on an iso axis | PASS | All geometry is projected grid boxes; iso circles (ellipses) for database discs and packet rings; connectors are axis-aligned strips. Seen in sheet.png and stills at frames 150, 300, 570 |
| Constant 2 px edge, no shadows or gradients | PASS | One `edgePx` / zoom everywhere; connector outline is a 4 px grey stroke half-covered by white fill so it reads as 2 px; dark blocks flip edges to white |
| Exactly one dark accent per frame | PASS (by construction, spot-checked) | Windows: build focus, packet dwell, final hero. The packet is hidden while a node is dark. Frames 110, 330, 610, 775, 880 each show one dark thing; mid-ramp frames show one grey block (the 10-frame fade) |
| Nearer faces hide farther lines | PASS | Parts sorted by x+y of centre, slabs bottom to top; stills at 300 and 570 show APP-2 occluding the APP-1 pad and connectors correctly |
| Text >= 4.5:1; caption reading time | PASS | Captions `#5C5C64` on white (6.6:1), tags and end card `#232327`, white on dark. Longest caption (7 words) needs 2.5 s, shown 2.7 s; the others need 1.9-2.2 s and get 2.1-3.1 s |
| Subject within safe area, 75-80% of width | PASS (marginal) | Pads span x 180 to 1740 at zoom 1.0 (81%), about 1790 at zoom 1.05 (right margin 130 px, over the 80 px safe area) |
| No frame static > 1 s except the end card | PASS | inspect: longest still 1.83 s at 28.17 s (end card); slow push keeps the rest alive |
| Every value a function of the frame; fonts vendored | PASS | Only `useCurrentFrame`; Inter and JetBrains Mono from `@fontsource`, `delayRender` until loaded; both fonts confirmed in stills |
| End card settled and held >= 1.5 s | PASS | Fades in 822-828, holds to 900 (2.6 s), laptop dark as hero |

## Skill gaps

1. `references/styles/isometric-explainer.md`, Look ("No shadows, gradients, grain or glow") vs the brief's "glowing packet": no sanctioned substitute. Proposed edit: "Packet: dark cube plus two hairline ground rings pulsing outward every 24 frames (no blur); mono label pill above it".
2. Same file, Motion grammar "Assemble ... `z + 6u`": ambiguous whether `u` is the grid unit (6 x 56 = 336 px) or px. Say "6 grid units" and note the group is translated on screen Y, not re-projected.
3. Same file, Look: no part recipes. A fresh agent invents laptop, balancer, server rack, cache chip and database from scratch (mine: laptop = base slab + thin screen slab on the low-x edge; server = 3 slabs; cache = slab + inner plate + pins; database = 3 iso discs). Add a "kind -> boxes" table with sizes in grid units, the face-text matrices (top `matrix(.866 .5 -.866 .5)`, +x face `matrix(.866 -.5 0 1)`, +y face `matrix(.866 .5 0 1)`) and the iso ellipse (rx 1.2247 r u, ry 0.7071 r u).
4. Same file: nothing says which faces are visible or which way the axes run. I derived: viewer at +x +y +z; x goes down-right, y goes down-left; visible faces +x (right), +y (left), +z. Add that sentence plus a 6-line `project()` and `box()` snippet. Most build time went here.
5. Same file, Pitfalls: "lines visible through faces" has no cheap fix. What worked: draw each slab as a rounded hexagon silhouette (filled) plus three inner edges from the near-top vertex, shortened by 0.6 x radius so they do not poke through the rounded corner. Also missing: ground connectors that merge at T-junctions (two passes: wide grey stroke of all strip polygons, then white fill of all strips) and the mitre rule for offsetting axis-aligned polylines.
6. Same file, Structure: the 900-frame table budgets 3 parts at 150 frames. With 7 parts and an out-and-back packet I compressed assembly to 50-75 frames per beat. Add a "many parts" row (group parts, one caption per group, focus only the part the caption names) and a packet budget formula `frames = legPx / speed + dwell`: at 8 px/frame a 4-leg round trip costs about 350 frames, not the roughly 210 the Connect + Focus rows allow.
7. Same file, Motion grammar "Focus": no handover rule for a packet entering a node. Add: "the packet vanishes at a hide radius of 1.25 grid units, the part fades to dark over 10 frames, holds, fades back over 10, then the packet re-emerges, so packet and dark part never coexist".
8. `references/tools/remotion.md`: global `JSX` namespace is missing with `@types/react` 19 (`Cannot find namespace 'JSX'`); use `React.JSX.Element`. `@fontsource/jetbrains-mono` (5.2.8, `latin-500.css`) is not mentioned. The "scaffold in a scratch dir" advice is unnecessary: a hand-written `package.json` with exact pins plus `pnpm install --ignore-workspace` took 8 s.
9. `SKILL.md` Step 2 and catalog table: experimental styles are not in the catalog table, so a brief saying "isometric explainer" with no id finds nothing unless the agent greps. List experimental styles in a second table, or add aliases ("isometric", "iso diagram").
10. `SKILL.md` Step 6 / `scripts/make_preview.py`: `--poster-at` is a fraction 0-1, not seconds. I passed 17 and got an error. One line in SKILL.md would do.
11. Style Format line: the 75-80% width rule and the 16:9 frame are hard to meet with a 7-part layout and a caption band. Add a layout hint: alternate flow along -y and +x so the staircase stays short (what I did) and keep height under about 700 px.

## Tool issues

- Git Bash: two of my long multi-heredoc commands failed with `unexpected EOF while looking for matching '` and wrote nothing; the Write tool worked. Not a skill problem.
- `remotion browser ensure` downloads a 120 MB headless shell per project.
- `inspect_video.py` contact sheet stamps timestamps over the bottom-left of each frame, covering captions in the sheet only; suggest drawing them at the top or outside the frame.
- No Remotion or ffmpeg problems; the full render took 30 s on a shared machine.

## Honest self-assessment

- Does it look like the style? Mostly. White hairline slabs, true iso geometry, mono tags set into faces, dark focus handover, slow push and spring drops all follow the recipe. Weak points: with white faces and grey hairlines only, the 7-part staircase is quiet and the connector rhombus around APP-2 is busy; the packet cube (0.5 grid units, about 28 px, larger than the recipe's 14 px) is the only strong mark and is still small at phone size.
- Deviations: packet size 0.5 units instead of 14 px (visibility); 2-frame assemble stagger per slab; 7 parts (brief) instead of the recommended 3-5; camera push eased over the whole video; first assembly beats are 70-80 frames, not 150; hairline rings instead of glow.
- Can others reuse the recipe? Not from the recipe alone. I wrote about 700 lines of geometry from first principles, and the biggest risks (axis directions, visible faces, occlusion strategy, junction rendering, text on faces) are not in the file. With gaps 3-7 filled, a first-time agent should get a clean result in one pass. Keep the tier at "experimental, validated by a single template" until a part-recipe table and a `project()`/`box()` snippet are added.
