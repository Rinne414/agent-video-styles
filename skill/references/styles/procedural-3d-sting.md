# Procedural 3D Sting

A short, mostly wordless 3D or shader reveal: particles, glass and light converge into a logo. Mood over information; everything procedural, nothing downloaded at render time.

- **Primary tool**: Remotion + `@remotion/three` (React Three Fiber) (alt: HyperFrames + Three.js)
- **Format**: 1920x1080 30 fps (1080x1080 for social); 6-15 s
- **Inputs to ask for**: logo as SVG (or wordmark text), 1-2 brand colors, mood words (e.g. "cold chrome", "warm glass"), duration, music or "synthesize"

## Look

| Token | Value |
|---|---|
| Void | background `#050505` or a deep brand tint (e.g. `#06081A`); optional vignette 40% at corners |
| Hero | one object, 35-50% of frame height: extruded logo (depth 0.2-0.35 of its width, bevel 0.02), crystal, torus knot or particle sphere |
| Metal | `MeshPhysicalMaterial` metalness 0.9, roughness 0.18, clearcoat 1 |
| Glass | on a void `transmission` has nothing to refract (transparent canvas, flat grey slab). Use a custom `ShaderMaterial`: vertical tint gradient, fresnel rim `pow(1 - abs(dot(n, v)), 2.2)`, travelling sheen band `exp(-pow((d - sweep) * 2.6, 2.0))`, alpha 0.5-0.85, plus `EdgesGeometry` lines. `renderOrder`: beams 1, glass 5. Iridescence/clearcoat variants may render black |
| Lights | 1 key (directional, intensity 2-3), 1 rim behind (brand color, intensity 4-6), ambient <= 0.1; or `RoomEnvironment` generated locally for reflections |
| Bloom | threshold 0.8, strength 0.6-1.0, radius 0.4, only if postprocessing is available. Fallback: additive `ShaderMaterial` strips with gaussian cross-section (softness >= 2.6 or the rectangle edge shows) plus a wide faint halo copy, and a DOM `radial-gradient` with `mix-blend-mode: screen` at the hit point projected via `Vector3.project(camera)` |
| Camera | perspective FOV 35-40 deg, distance 4-8 units |
| Wordmark | DOM overlay (not WebGL text): Inter 600, tracking 0.2em, uppercase. Stacked (under the object): 64-96 px, 70% white. Horizontal (right of the object): 140-180 px, 90% white, object centroid on the wordmark's vertical centre |

## Motion grammar

- **Frame is time**: derive everything from `useCurrentFrame()`; never use R3F `useFrame`, `clock.elapsedTime` or `Date.now()`.
- **Orbit**: camera angle `interpolate(frame, [0, N], [-25, 15])` degrees with `Easing.inOut(Easing.cubic)`; dolly `z 8 -> 4.5`.
- **Formation**: fragments or particles travel from seeded start positions to targets over 60-90 frames with `Easing.out(Easing.exp)`; per-particle delay 0-20 frames from a seeded hash.
- **Noise settle**: shader displacement amplitude `1.0 -> 0.0` across the formation; noise time = `frame / fps * 0.4`.
- **Light sweep**: rotate the key light or move a specular highlight across the hero over 30 frames, peaking on the hit frame.
- **Hit**: bloom strength spikes to 1.6 for 3 frames, then eases back to 0.8 over 20 frames (fallback glow: 3 frames full, 22 frames decay).
- **Settle**: last 30-45 frames the object only drifts (rotation 0.1 deg/frame) so the wordmark can be read.
- **Never**: random positions without a seed, network-loaded HDRIs or fonts, camera cuts (a sting is one continuous shot).

## Structure (10 s = 300 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Void | 0-45 | Darkness, a few seeded particles drift, rim light flickers on |
| Formation | 45-165 | Fragments/particles converge, displacement noise resolves |
| Reveal | 165-225 | Light sweep across the hero, bloom hit at frame 180, camera settles |
| Lockup | 225-300 | Wordmark fades up under the object (opacity 0 -> 1 over 20 frames), hold |

For 6 s: Void 0-20, Formation 20-100, Reveal 100-140, Lockup 140-180. For 8 s (240 frames): Void 0-24, Beam/Formation 24-66, Reveal 66-128, Resolve 128-190, Lockup 190-240. For 15 s, extend Formation, not Lockup.

## Audio

Wordless. Low drone (40-60 Hz) under the void, a riser (filtered noise, 2-3 s) into the reveal, an impact plus shimmer tail on the hit frame. Code synthesis works well (Python `wave` module or numpy sine/noise layers) and avoids licensing. The hit frame in the audio must equal the bloom hit frame.

## Agent brief (template)

```
Style: procedural-3d-sting (see references/styles/procedural-3d-sting.md)
Logo: <svg path or wordmark text>
Hero treatment: extruded metal | glass | particle logo | shader-only
Colors: <primary hex>, rim <hex>
Mood: "<2-3 words>"
Duration: <6-15> s, hit at <frame>
Audio: <path> or "synthesize drone + riser + hit"
Format: 1920x1080 30fps
```

## Quality bar

- [ ] Single continuous shot, single hero object
- [ ] Two renders produce identical frames (all randomness seeded, no clock)
- [ ] Logo silhouette is recognizable by the end of Reveal
- [ ] Bloom hit and audio hit on the same frame
- [ ] Wordmark crisp (DOM overlay) and held >= 1.5 s
- [ ] Render time recorded; under ~2 s per frame at 1080p on the target machine

## Pitfalls

- **Nondeterminism**: R3F loops tick on the wall clock; a render then shows random states per frame. Drive every value from the frame number.
- **Headless WebGL**: Chrome may fall back to software GL and crawl or render black. Use the `--gl` option recorded in `../tools/remotion.md` and test one still before the full render.
- **Bad SVG extrusion**: open paths and self-intersections tear the mesh. Use `SVGLoader` + `ExtrudeGeometry`, fix winding with `SVGLoader.createShapes`, and center the geometry.
- **Blurry 3D text**: text rendered in WebGL softens after compression. Put the wordmark in DOM.
- **Camera and overlays**: set the `useThree` camera (`camera.position.set`, `lookAt`) in a child component's render body, and keep the camera maths in a pure `cameraAt(frame)` helper reused to project 3D points for DOM flash and wordmark positions.
- **Overlong stings**: past 15 s the void and formation feel slow. Cut, do not stretch.

## Variants

- **light-sting**: beam, spectrum and recombine instead of particles: a white beam enters (Beam), splits into a spectrum through the glass (Reveal), recombines to one point (Resolve), then the wordmark (Lockup); use the 8 s row above.
- **shader-only**: one full-screen plane with a fragment shader (`uTime = frame / fps`); fbm noise or raymarched SDF; brand color via a cosine palette; logo appears as an SDF mask in the last 60 frames.
- **particle-logo**: sample 4,000-12,000 points from the logo SVG paths, start them in a seeded noise field, lock in over 80 frames, then let them breathe (+/- 0.01 units).
- **power-on**: 1-frame scanline flash, CRT bloom, chrome extruded logo snapping from scale 0.6 to 1.0 in 8 frames, synth chime (two sine notes a fifth apart).
