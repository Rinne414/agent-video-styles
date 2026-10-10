# 3D Product Turntable

A procedurally modelled product turning on a soft studio sweep with feature callouts tied to the geometry. Everything is built from primitives in code; no downloaded models, textures or HDRIs.

- **Primary tool**: Remotion + `@remotion/three` (React Three Fiber) (alt: HyperFrames + vendored three.js)
- **Tier**: experimental (few public examples; validated by one template)
- **Format**: 1920x1080 30 fps (1080x1080 for social); 10-30 s
- **Inputs to ask for**: product type (headphones or speaker), product name text, 3 features (label + 3-5 word claim), 1-2 colors, studio light or dark, logo as text or SVG, music or silent

## Look

| Token | Value |
|---|---|
| Sweep | light `#E9E6E1` floor and wall joined by a 1.5-unit-radius curve, no visible horizon; dark variant `#0B0D10`. Build it unlit: one mesh with `MeshBasicMaterial` + `vertexColors`, brightness baked as a soft pool of light (0.8-1.0 of the base colour), plus a `ShadowMaterial` copy for any real shadow. A lit sweep blows out to pure white or shows a bright band where the curve faces the key |
| Hero | one object about 2.7 units tall, 55-65% of frame height, centered slightly low; camera `fov` 35-40 (40 worked), 8-12 deg above the horizon; `visibleHeight = 2 * d * tan(fov/2)`, so fov 40 at d 7.0 gives 5.1 units |
| Headphones | ear cups `CylinderGeometry` r 0.62 depth 0.34 (matte plastic, roughness 0.45); cushions `TorusGeometry` r 0.5 tube 0.14 (roughness 0.85); headband `TorusGeometry` arc `Math.PI` r 1.05 tube 0.07 (metal, metalness 1, roughness 0.3); yokes `CapsuleGeometry`; headband pad and a hinge knuckle at each yoke. Layout: cups centred at (+-1.1, 0.62, 0) with their axis on X (rotate lathe or cylinder about Z), cushions offset toward the head, band centre y 1.45 with y scaled 1.1 so it is taller than wide, cup rim at y = 0; round cup edges with a `LatheGeometry` corner arc |
| Speaker | `CylinderGeometry` r 0.8 h 1.6 with `LatheGeometry` rounded top, grille as 400-900 instanced dots (`InstancedMesh`), base ring |
| Environment | `RoomEnvironment` through `PMREMGenerator`, generated locally; metal renders near black without one |
| Lights | product only (the unlit sweep ignores them): key directional about 2.2 at (4, 6, 3), fill hemisphere 0.6, rim directional 3 behind-left in a cool tint, ambient <= 0.1; use `flat` (no tone mapping) or retune if tone-mapped. `scene.environmentIntensity` hits every material, `material.envMapIntensity` only materials with their own `envMap`. Shadow maps are optional: `PCFSoftShadowMap` ignores `shadow.radius` and gives a hard headband ring |
| Contact shadow | default: baked radial-gradient `CanvasTexture` drawn in code on a plane at the floor, opacity 0.45, scaled with the product footprint (cheap and deterministic) |
| Callouts (DOM) | label Inter 600 36 px, claim 30 px at 80% opacity, ink `#1A1A1A` on light or `#F5F7FA` on dark (>= 4.5:1); leader line 2 px, 6 px end dot; accent `#E4572E` for dots only |
| Safe area | 96 px on 16:9; callouts stay in the outer thirds so the hero stays unobstructed |

Product name and any specs are sample copy unless the user supplied them: label invented specs as "sample specs" on screen (a footnote such as "Fictional product. Sample specs."); with only labels supplied, add short non-numeric claims. Do not model a real branded product's exact design or logo without permission.

## Motion grammar

- **Frame is time**: rotation `rotation.y = interpolate(frame, keys, degrees)` from `useCurrentFrame()`; never R3F `useFrame` or `clock`.
- **Turn**: 360 deg total over the whole piece, eased `Easing.inOut(Easing.poly(4))` between hold centres so velocity is near zero at each stop. Pick yaw stops so label sides alternate: the lateral screen side of the +X cup flips at yaw 270, the -X cup at 90. A part animation (cups swivelling 90 deg) reads weakly at a 3/4 camera; skip it.
- **Camera**: push `distance 7.0 -> 6.2` (fov 40) and 3 deg orbit across the piece; over the last 40 frames lift the target (y 1.45 -> 0.9) so the lockup name has a clear band under the product; shared pure `cameraAt(frame)` helper reused for callout projection with `Vector3.project(camera)`.
- **Callouts**: leader draws 12 frames, label fades and rises 8 px over 8 frames; hidden (opacity -> 0 over 6 frames) when the anchor normal faces away (dot with view direction < 0.15).
- **Start**: sweep and product fade up from `#FFFFFF` exposure over 24 frames; light sweeps once (key light moves 20 deg) across the first reveal.
- **Never**: random jitter without a seed, wobble or bounce, camera cuts, network-loaded models or HDRIs.

## Structure (20 s = 600 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Reveal | 0-15% | Product fades up and starts turning; product name fades in at 40 |
| Feature 1-3 | 15-80% | 130 frames each at 20 s: turn to angle (0-50), callout holds (50-120), callout out (120-130) |
| Lockup | last 20% | Product settles front-facing, name, logo and tagline; settled by half the beat and held |

Proportions scale to the requested length: 10 s drops to 1 feature, 30 s adds up to 2 more features. A callout is readable for `0.5 s + words / 3.5 s`, minimum 70 frames. Worked 15 s (x0.75): reveal 56, 3 features of 112, lockup settled at frame 405.

## Audio

Minimal electronic or ambient pad at 90-110 BPM; soft whoosh at each turn, a light tick as each leader line lands, a low hit on the lockup, all synthesized (numpy) if no licensed audio. Silent brief: sound items N/A.

## Agent brief (template)

```
Style: product-turntable-3d (see references/styles/product-turntable-3d.md)
Product: <headphones | speaker>; name "<text>"; colors <hex, hex>
Features: 1) "<label>" - "<claim>" (anchor: <ear cup | headband | grille ...>) 2) ... 3) ...
Studio: light | dark; logo <svg path or text>
Audio: <music path / synthesize / none>
Format: 1920x1080 30fps, 20 s
```

## Quality bar

- [ ] Product silhouette reads as the named object in the first 30 frames
- [ ] Two renders produce identical frames (no clock, seeded values only)
- [ ] Metal parts are not black (environment present) and no flat grey slabs
- [ ] Contact shadow soft, floor-sweep seam invisible
- [ ] Every callout anchored to the right part, never over the hero, hidden when facing away
- [ ] Text contrast >= 4.5:1 and fonts vendored (checked in a still)
- [ ] Render time recorded; one still tested with `--gl=angle` before the full render
- [ ] Lockup settled and held >= 1.5 s; name clear of the product

## Pitfalls

- **Render entry**: hand-built projects need `remotion render src/index.ts <Id> ...`. `Config.setVideoImageFormat("png")` still yields yuv420p. A 450-frame 1080p three.js render took 28 s on a fast GPU.
- **Pins**: use exact `remotion` and `@remotion/*` 4.0.534, `three@0.171.0`, `@react-three/fiber@9.1.2`, `@types/three@0.171.0`, and pin `@types/react` to the react version (no `^`); mismatches break `ThreeCanvas`.
- **Headless GL**: render with `--gl=angle`; default can crawl or black out. Test one `remotion still` first.
- **Glass and transmission**: `transmission` over a flat background renders as a slab; avoid glass parts or use a fresnel `ShaderMaterial`.
- **Callout drift**: place DOM overlays from `cameraAt(frame)` and the same rotation function, never from separate maths.
- **Crude models**: low segment counts show facets; use 64 radial segments for cylinders and 32 for tori.
- **Shadow flicker**: shadow maps with a moving light can shimmer; fix the key light or use the baked contact shadow.
- **HyperFrames alternative**: vendor three.js locally (importmap, with `three.core.min.js` for r17x+), drive it from the `hf-seek` event, and compose 1088 wide for 1080 formats then crop.

## Variants

- **speaker**: cylinder body, grille dots in a hex pattern, a ring light that pulses to the beat (emissive, 0.4 -> 1.0 over 8 frames); callouts on grille, ring and base.
- **dark-studio**: sweep `#0B0D10`, cool rim `#7DD3FC` intensity 5, floor reflection faked by a mirrored product copy at 12% opacity with a gradient mask.
