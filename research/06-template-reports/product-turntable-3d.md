# Template report: product-turntable-3d

Tool: Remotion 4.0.534 + `@remotion/three` (three 0.171.0, R3F 9.1.2), Inter via `@fontsource/inter`. Brief: ~15 s, 1920x1080, 30 fps, silent, "Aura One" headphones, three callouts, name and tagline end.

## Result

- Delivered: `templates/product-turntable-3d/` (README, STORYBOARD, content.json, src/, package.json, pins), `out/product-turntable-3d.mp4`, `previews/product-turntable-3d.mp4` and `.webp` (poster at 8.0 s, the "Adaptive noise cancelling" callout).
- Video: h264 yuv420p, 1920x1080, 30 fps, 450 frames, 15.00 s, no audio. `inspect_video.py` reported OK: black 0.00 s, longest still stretch 1.67 s at 13.33 s (the lockup hold), no edge-band warning.
- Full renders used: 1 of 3. Full render time 28 s (450 frames, `--gl=angle`, default concurrency, other agents rendering in parallel). One still is about 20 s including bundle.
- Process: built the scene, rendered about 10 stills (frames 20, 60, 127, 239, 351, 438 and re-checks) and fixed lighting, camera, lockup layout and the sweep before the one full render.
- Recipe verdict: buildable, but only because I rewrote the lighting and camera parts of the recipe. Geometry and motion grammar are strong; lighting numbers are wrong for the stated pipeline and camera numbers are underspecified (see gaps).

## Quality bar

| Item | Result | Evidence |
|---|---|---|
| Silhouette reads as headphones in first 30 frames | PASS | Frame 20 still and sheet frame 1 (0.63 s): arch band, two cups, shadow beneath, front-facing. |
| Two renders produce identical frames | PASS | Two separate `remotion still` runs of frame 239 gave identical md5 (`16d23510...`). Not compared across full videos. All motion comes from `useCurrentFrame()`; no `useFrame`, no randomness. |
| Metal not black, no flat grey slabs | PARTIAL | Band shows environment reflections (bright highlight, dark core) in sheet frames 2-8. The outer cup plates are brushed-metal discs that read as flat mid-grey in 3/4 view (frame 239, 351): a minor slab look. Fix would be a lathe bevel or a roughness gradient on the plate. |
| Contact shadow soft, sweep seam invisible | PASS | Frames 20, 239, 438: soft elliptical shadows under both cups plus a faint wide one; no horizon, floor and wall are one vertex-coloured sheet (see gap 1). The lit-sweep first attempt showed a visible bright band at the curve; the final does not. The variance shadow-map layer is effectively invisible (see gaps). |
| Callouts anchored to the right part, never over hero, hidden when facing away | PASS with caveat | Battery dot on the left cup face (frame 150), noise-cancelling dot on the right cup plate (239), fold-flat dot on the hinge knuckle (351, 365). Labels sit in the outer thirds, but the leader line crosses the cup edge to reach the anchor. The hide-when-facing logic (dot < 0.15, fade to 0.3) is implemented, but the stops are placed at facing > 0.7 so it never triggers in this cut; not exercised visually. |
| Text contrast >= 4.5:1, fonts vendored | PASS | Ink `#1A1A1A` on sweep `#E9E6E1` is about 14:1; Inter is visibly rendered in stills (not Arial); weights 400/600/700 from `@fontsource/inter`, `document.fonts.load` awaited via `delayRender`. The 20 px footnote is at 60% opacity (about 5:1, estimated, not measured). |
| Render time recorded; one still tested with `--gl=angle` | PASS | All stills used `--gl=angle`; full render 28 s. |
| Lockup settled by frame 540 (scaled: 405) and held >= 1.5 s | PASS (borderline) | Settle at 405 of 450, held 45 frames = 1.5 s exactly. Sheet frames 11-12 (13.1 s, 14.4 s). |

Other checks: hero is about 53% of frame height at the start (distance 7.0) and about 60% at the end (spec: 55-65%); the product sits slightly low during features and lifts for the lockup; the first 24 frames fade up from white; silent, so audio items are N/A.

## Skill gaps

1. `references/styles/product-turntable-3d.md`, Look > Lights and Environment (and `tools/remotion.md` 3D notes). The numbers (key 2.2, hemisphere 0.6, `RoomEnvironment`) over-expose a `#E9E6E1` sweep: the first render came out pure white (255,255,255), losing the backdrop colour and any gradient, and a lit curved sweep also shows a bright band where the curve faces the key light. Needed: say the scene uses `flat` (no tone mapping) or give tone-mapped values, and recommend building the sweep unlit instead. What worked: floor+wall mesh with `MeshBasicMaterial` + `vertexColors` (brightness baked as a soft pool of light, 0.8-1.0 of the base colour), with a `ShadowMaterial` copy on top for any real shadow. Add a "Sweep" paragraph with that recipe and keep the lit variant only as an option. Also note that `scene.environmentIntensity` hits every material and `material.envMapIntensity` only works when the material has its own `envMap`.
2. Same file, Look > Hero and Motion grammar > Camera. Only distances (7.5 to 6.2) and "8-12 deg above horizon" are given; no FOV and no model height, so "55-65% of frame height" cannot be hit from the doc. With the doc's headphone dimensions (band R 1.05, cup r 0.62) I needed fov 40, start distance 7.0 (not 7.5) and a model about 2.7 units tall. Add: model height in units, a recommended `fov` (35-40), and a formula `visibleHeight = 2 * d * tan(fov/2)`. Also add a lockup layout rule: the name needs a clear band under the product, so lift the camera target (I moved target y 1.45 to 0.9 over the last 40 frames) or the name overlaps the cups (this happened in my first lockup still).
3. Same file, Look > Headphones. Parts list is good but missing what makes it assemble: yoke or hinge knuckle, the headband pad, cup axis orientation (cups' axis is X, so rotate the lathe or cylinder about Z), cushion offset toward the head, rounded cup edge (a `LatheGeometry` with corner arcs works much better than a plain cylinder), `y`-scaling the half-torus band to make it taller than wide, floor offset so the cup rim sits at y = 0. Add a short coordinate sketch (cup centre (+-1.1, 0.62, 0), band centre y 1.45, scale y 1.1).
4. Same file, Motion grammar > Callouts and Structure. No guidance for choosing yaw stops and label sides. The useful rule: for the +X cup, lateral screen side flips at yaw 270; for -X at 90; pick stops so the label side alternates. Also add how to ease between stops (I used `Easing.inOut(Easing.poly(4))` between hold centres so velocity is near zero at each stop) and a worked 15 s scaling (x0.75: reveal 56, features 3x112, lockup settled at 405). "Fold-flat" is not covered: say whether a feature can animate a part (I swivelled the cups 90 deg about the vertical axis; it reads weakly because the camera is 3/4 on).
5. `references/tools/remotion.md`, Render commands. Examples use `remotion render Hello out/hello.mp4` without the entry file; a hand-built project (no scaffold `package.json` script) needs `remotion render src/index.ts <Id> ...`. Add one line. Also record that `Config.setVideoImageFormat("png")` plus `--image-format=png` gives yuv420p (confirmed here: pix_fmt yuv420p) and that a 450-frame 1080p three.js render took 28 s, so 3D is cheap and the doc's "angle slow" warnings do not apply on an RTX 3090.
6. `tools/remotion.md`, Shadows. State which `shadows` values `ThreeCanvas` accepts (`"soft"`, `"variance"`...) and that a shadow-map ring of the headband looked hard and distracting with `PCFSoftShadowMap`; `PCFSoft` ignores `shadow.radius` (the style file says radius 6). The baked radial-gradient blob is the reliable option; recommend it as the default and say shadow maps are optional.
7. `SKILL.md` step 3/4 and the style file's Inputs: the brief gave only three label strings. Say how to treat missing claims: I added short non-numeric claims ("On a single charge") and a "Fictional product. Sample specs." footnote because the style says to label specs; make that explicit in the style file's Look (it is mentioned only in prose).

## Tool issues

- `pnpm add -E -D @types/react` resolved `19.3.0` (newer than react 19.2.3); `tsc --noEmit` passes, so harmless, but the doc's pin list should name `@types/react`.
- A large multi-file Bash heredoc batch failed with a shell parse error and wrote nothing; used the file Write tool instead. Not a skill issue.
- `remotion still` prints `○` or `+` per output with no explicit "unchanged" note; I could not tell from the log whether the bundle was rebuilt after edits. Output PNGs changed as expected, so it was.
- No MiKTeX or Manim involvement.

## Honest self-assessment

- Does it look like the style? Partly. It is a clean, readable studio turntable with a soft sweep, contact shadow, metal band, tied callouts and a settled lockup. It is not premium product CGI: materials are plasticky, the plates are flat, there is no real reflection on the floor, and the cast shadow is mostly just the baked blob. A viewer would read it as "stylised 3D mock-up", not a photographic render.
- The fold-flat feature is the weakest beat: the callout lands on the hinge, but the cup swivel is subtle at that camera angle.
- Is the recipe strong enough for others to reuse? The geometry list and the motion grammar (frame is time, shared `cameraAt` and pure projection for callouts, eased stops, 12-frame leaders) were genuinely useful and worked first try. The lighting and sweep numbers were wrong for the stated pipeline and the camera/FOV/model-size relationship was missing; an agent following the recipe literally would produce a washed-out white scene and a lockup that overlaps the product. With gaps 1-4 fixed, this style is reproducible; as written, it needed about 8 iterations of stills to repair. The code in `templates/product-turntable-3d/` can serve as the worked example.
- One full render used, no re-render, so the end result has not been checked for a second render of the whole video; only the two-still determinism test.
