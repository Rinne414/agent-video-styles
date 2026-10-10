# Isometric Explainer

Clean hairline blocks and devices assemble on an isometric grid to explain a system. Everything is geometry computed from the frame number; the single dark accent tells the viewer where to look.

- **Primary tool**: Remotion (alt: HyperFrames + GSAP)
- **Format**: 1080x1080 30 fps (also 1080x1920 and 1920x1080); 15-45 s. If you use HyperFrames, compose 1088 wide and crop to 1080 (width must be divisible by 16)
- **Inputs to ask for**: the system as 3-5 parts (name, kind: server, laptop, phone, database, cloud, gateway), the connections between them, one caption per beat, which part is the hero, music or "silent"
- **Tier**: experimental (few public examples; validated by one template)

## Look

| Token | Value |
|---|---|
| Ground and faces | `#FFFFFF` |
| Edges | `#A4A4AC`, constant 2 px at 1080 wide (divide by the current zoom); inner and receding lines `#E0E0E4` |
| Accent | one dark element per frame, `#232327`, white text inside it (16:1) |
| Text | captions `#232327` or `#5C5C64` (6.6:1); `#9A9AA2` is 2.7:1 on white and is decorative only, never for text |
| Projection | true isometric: x axis to `(0.866u, 0.5u)`, y axis to `(-0.866u, 0.5u)`, z axis to `(0, -u)`; unit `u` = 60-90 px. A 2:1 dimetric (slopes 0.5) is pixel-cleaner and acceptable; pick one per video |
| Solids | rounded slabs, thickness 2-5% of the object size, corner radius 5-10% of the long side, faces filled white and drawn back to front so nearer faces hide farther lines |
| Detail | repetition (keys, vents, ports, plates), never texture; line weight identical everywhere |
| Layout | subject fills 75-80% of the frame width; caption below in Inter 500, 46 px; mono tags (JetBrains Mono 28 px) set into faces |
| Safe area | 64 px on 1:1; 220 px top and 300 px bottom on 9:16; 80 px on 16:9 |

No shadows, gradients, grain or glow. A "glowing" packet is a dark cube (0.5 grid units, about 28 px; 14 px is too small at phone size) plus two hairline ground rings pulsing outward every 24 frames (no blur) and a mono label pill above it. Do not stroke inside a skewed transform (the width skews): project the points, then draw polygons with plain strokes.

**Orientation and snippet**: the viewer sits at +x +y +z; x runs down-right, y down-left, z up. Visible faces: +x (right), +y (left), +z (top). Grid unit `u` = 56 px.

```
const project = (x, y, z) => ({ sx: ox + (x - y) * 0.866 * u, sy: oy + (x + y) * 0.5 * u - z * u });
// box(x, y, z, w, d, h): top = (x,y,z+h),(x+w,y,z+h),(x+w,y+d,z+h),(x,y+d,z+h);
// right face (+x) = (x+w,y,z),(x+w,y+d,z),(x+w,y+d,z+h),(x+w,y,z+h); left face (+y) likewise at y+d
```

Face text matrices: top `matrix(.866 .5 -.866 .5 0 0)`, +x face `matrix(.866 -.5 0 1 0 0)`, +y face `matrix(.866 .5 0 1 0 0)`. Iso circle: ellipse rx 1.2247 r u, ry 0.7071 r u.

**Part recipes** (grid units w x d x h): laptop = base slab 3x2x0.2 + thin screen slab 0.2x2x1.6 on the low-x edge; server = 3 stacked slabs 2x2x0.5 with port dots; load balancer = slab 3x1.5x0.6 + 3 port plates; cache = slab 1.6x1.6x0.3 + inner plate + pins; database = 3 stacked iso discs r 1; cloud/gateway = slab with a mono tag. Occlusion: draw each slab as a filled rounded-hexagon silhouette plus three inner edges from the near-top vertex, shortened by 0.6 x corner radius. Ground connectors: one pass of a wide grey stroke over all strips, then one pass of white fill, so T-junctions merge; offset axis-aligned polylines with a mitre.

## Motion grammar

- **Projection function**: `project(x, y, z)` returns screen `(sx, sy)`; all parts store grid coordinates, so any move is a change in `x, y, z`.
- **Assemble**: a part starts 6 grid units higher (`z + 6`, translated on screen Y, not re-projected) and `opacity 0`, then settles with `spring({damping: 22, stiffness: 150, mass: 1})` (about 20 frames) onto its slot; stagger 4 frames per grid step along the iso diagonal; repeated details (keys) stagger 1 frame.
- **Slide**: parts that move along an axis use the same spring on one coordinate only, so edges stay on iso axes unless an object is visibly rotating.
- **Connections**: a connector draws along grid axes with `stroke-dashoffset` over 24 frames; the packet travels it at 8 px per frame, turning only at right angles. Packet budget: `frames = legPx / speed + dwell`; a 4-leg round trip costs about 350 frames.
- **Focus**: the hero part's faces fade to `#232327` over 10 frames while edges go white; all earlier accent returns to white at the same moment. Packet handover: the packet vanishes at a hide radius of 1.25 grid units from the node, the node fades to dark over 10 frames, holds, fades back over 10, then the packet re-emerges, so packet and dark part never coexist.
- **Camera**: still, or a slow push `scale 1.00 -> 1.05` over the scene; no shake, no rotation of the whole scene.
- **Depth sort**: draw order `x + y + z` ascending per part; verify in a still when two parts overlap.
- **Never**: perspective distortion, drop shadows, two dark accents, bounce overshoot over 4% on body parts.

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Establish | 0-90 | Ground plinth draws on (edges 0-30), first part drops in, caption names the system |
| Assemble 1-3 | 90-540 | 150 frames each: part assembles (0-60), accent focus on it (60-90), caption swaps (hold to 150) |
| Connect | 540-750 | Connectors draw between parts (24 frames each, 36 apart), packets travel; caption states the flow |
| Focus | 750-840 | The hero part takes the accent; others return to white |
| End card | 840-900 | Logo or title as 64 px text under the scene, settled and held |

Many parts (6-7): group them, one caption per group, focus only the part the caption names, and compress assembly to 50-75 frames per beat; run the flow alternately along -y and +x so the staircase stays short and the height under about 700 px, or the 75-80% width rule fails. Proportions scale to the requested length: 15 s builds 2 parts and 1 connection; 45 s allows 5 parts. Caption reading time `0.5 s + words / 3.5`. Snap assembly starts to the beat grid when music is used (120 BPM = 15 frames).

## Audio

Minimal electronic or soft ambient, 90-120 BPM, 30% volume. SFX: a short soft tick on each part landing and a lighter chirp when a packet arrives, both synthesized or licensed. A silent brief makes sound items N/A and spring timing carries the rhythm.

## Agent brief (template)

```
Style: isometric-explainer (see references/styles/isometric-explainer.md)
System: <name>
Parts: 1) <kind> "<label>" 2) ... 3) ... (hero: <part>)
Connections: A->B "<what flows>", B->C ...
Captions: per beat "<>" (<= 8 words)
Projection: isometric 30 degrees | 2:1 dimetric
Format: 1080x1080 30fps, <n> s; music <path or none>
```

## Quality bar

- [ ] Every edge lies on an iso axis except visibly rotating objects
- [ ] Constant edge weight (2 px at 1080) everywhere; no shadows or gradients
- [ ] Exactly one dark accent per frame and it is the hero or the current focus
- [ ] Nearer faces hide farther lines in every still (depth sort correct)
- [ ] Text >= 4.5:1; caption readable for `0.5 s + words / 3.5`
- [ ] Subject within the safe area, 75-80% of width
- [ ] No frame static longer than 1 s except the end card (spring tails and slow push count)
- [ ] Every value a function of the frame; fonts vendored (no network at render)
- [ ] End card settled and held >= 1.5 s

## Pitfalls

- **Skewed strokes**: applying a CSS skew to a flat drawing makes line widths uneven. Project points instead.
- **Two accents**: emphasis by a second dark element splits the focus; use the focus handover step.
- **Non-convex outlines**: the slab helper assumes convex faces; compose L-shapes from two slabs.
- **Lines visible through faces**: draw order errors show hidden edges; sort by depth and fill faces opaque.
- **Too dense**: more than 5 parts or 40 detail repeats per scene turns to noise at phone size.
- **Faint text**: the light grey from the edge palette fails contrast; text uses the dark greys only.
- **Fonts**: load Inter and JetBrains Mono before frame 0 (`@remotion/google-fonts` or `delayRender`) and confirm in a still.

## Variants

- **dark-ground**: ground `#101014`, edges `#8E8E9A`, inner lines `#34343C`, accent `#F4F4F6` with `#101014` text, caption `#B4B4BE` (9:1); everything else unchanged.
- **color-accent**: the dark accent becomes one brand color; choose a hue with white-text contrast >= 4.5:1 (e.g. `#4338CA`) and keep it off every non-focus element.
