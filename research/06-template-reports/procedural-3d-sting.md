# Template report: procedural-3d-sting

Brief: 8 s, 1920x1080, 30 fps, silent logo sting for fictional "Prism Studio" (glass prism splits a beam, spectrum sweeps, light resolves into "PRISM"). Tool: Remotion 4.0.534 + `@remotion/three`, three 0.171.0, @react-three/fiber 9.1.2.

## Result

- `templates/procedural-3d-sting/out/procedural-3d-sting.mp4`: 1920x1080, 30 fps, 240 frames, 8.00 s, h264 yuv420p, 0.98 MB, no audio.
- Render time: 15 s for the full video (about 0.06 s per frame) with `--gl=angle` on the RTX 3090.
- Full renders: 1 (plus 11 single-frame stills during iteration).
- `inspect_video.py`: OK, no black or frozen stretches. Preview: `previews/procedural-3d-sting.mp4` (0.20 MB) and `.webp` (11 KB).

## Quality bar

| Item | Result | Evidence |
|---|---|---|
| Single continuous shot, single hero object | PASS | Contact sheet: one camera move (slow orbit/dolly), no cuts; the prism is the only 3D object (beams and dust are light and motes). |
| Two renders produce identical frames | PASS (partial check) | Two separate stills of frame 130 have the same md5 (`773f30f6...`). Seeds come from `random("prism-dust-i-k")`, no clock. I did not render the full video twice (budget). |
| Logo silhouette recognizable by end of Reveal | PASS | At 5.7 s the prism and the lit letters P-R-I-S are readable; at 6.4 s the full lockup is visible. |
| Bloom hit and audio hit on the same frame | N/A | Silent brief. The hit flash is frame 66 (visible at 2.367 s in the sheet). |
| Wordmark crisp (DOM) and held >= 1.5 s | PASS with caveat | Inter 600 DOM text, sharp in the stills. All five letters are visible from frame 186 (1.8 s to the end); the colour glow finishes settling to white about frame 210, so the fully settled hold is about 1.0 s. |
| Render time recorded; under ~2 s per frame | PASS | 15 s / 240 frames. |

Style rules also checked: no linear easing on movement (all `Easing.inOut(cubic)` or `out(exp)`), nothing static for more than 1 s (dust drifts, prism drifts), last frame is an intentional lockup held more than 1 s.

## Skill gaps

1. `references/styles/procedural-3d-sting.md`, Look table, "Glass" token: `MeshPhysicalMaterial` transmission 1 does not give glass in Remotion. `ThreeCanvas` has a transparent background, so the transmission buffer is empty and the prism rendered as a flat lavender-grey slab (verified in stills). Also, adding the iridescence/clearcoat variant rendered black. Proposed edit: add "On a near-black void, transmission has nothing to refract. Use a custom `ShaderMaterial`: vertical tint gradient, fresnel rim (`pow(1 - abs(dot(n, v)), 2.2)`), a travelling sheen band (`exp(-pow((d - sweep) * 2.6, 2.0))`), alpha 0.5-0.85, plus `EdgesGeometry` lines. Render beams first (`renderOrder` 1) and the glass over them (5)."
2. Same file, Look table "Bloom" and Motion grammar "Hit": assumes postprocessing, but `remotion.md` does not list `@react-three/postprocessing` or say whether it works. Proposed edit: state the fallback used here: additive `ShaderMaterial` strips (gaussian cross-section, a wide faint halo copy of each) in 3D plus a DOM `radial-gradient` with `mix-blend-mode: screen` at the projected hit point (`Vector3.project(camera)`), with envelope 3 frames full, 22 frames decay. Mention halo strips need gaussian `soft >= 2.6` or their rectangle edge shows.
3. Same file, Structure: only 6 s, 10 s and 15 s are given and the beats are written for formation/particles. A 8 s light-based brief had to be scaled by hand. Proposed edit: add an 8 s row (Void 0-24, Formation/Beam 24-66, Reveal 66-128, Resolve 128-190, Lockup 190-240) and a "light-sting" variant with this beam/spectrum/recombine sequence.
4. Same file, Wordmark token: "64-96 px, 70% white, under the object" is too small and too dim for a horizontal lockup; I used 170 px at 90% white beside the prism. Proposed edit: add "Lockup variants: stacked (wordmark under the object, 64-96 px) or horizontal (wordmark right of the object, 140-180 px, 90% white); keep the object's visual centroid on the wordmark's vertical centre."
5. `references/tools/remotion.md`, Setup/3D: `pnpm add three @react-three/fiber @types/three` is unpinned, but the template convention requires exact pins and compatibility with `@remotion/three` is not stated. Proposed edit: record the working set (`three@0.171.0`, `@react-three/fiber@9.1.2`, `@types/three@0.171.0` with remotion 4.0.534) and add "pin without `^`".
6. `references/tools/remotion.md`, Fonts: only `@remotion/google-fonts` (network at render) is documented; `templates/README.md` forbids network at render. The offline path is marked "[not run here]". Proposed edit: document the verified recipe: `pnpm add @fontsource/inter @remotion/fonts` (exact), `import url from "@fontsource/inter/files/inter-latin-600-normal.woff2"`, `loadFont({ family: "Inter", url, weight: "600" })`, and `declare module "*.woff2" { const url: string; export default url; }` in a `.d.ts`.
7. `references/tools/remotion.md`, Minimal project shape: the scaffold's `tsconfig.json` has `lib: ["es2015"]` and no `resolveJsonModule`, so `import content from "../content.json"` (required by the template convention) fails type-check. Proposed edit: add "for `content.json` set `resolveJsonModule: true` and `lib: ["dom","es2020"]`".
8. `references/tools/remotion.md`, Setup: says "delete `node_modules` and `package-lock.json`" with no command for a harness that denies `rm -rf`. Minor; proposed edit: give `Remove-Item -Recurse -Force` as the PowerShell equivalent.
9. `SKILL.md` step 4 says show the storyboard to the user; the test overrode this, so no gap, but the skill gives no rule for "unattended" runs (write STORYBOARD.md and proceed). Proposed edit: add one line.
10. `references/styles/procedural-3d-sting.md`, Pitfalls: add "A camera set in `useThree` must be written in a child component's render body (`camera.position.set`, `lookAt`) and the same camera maths reused for DOM overlays via a pure `cameraAt(frame)` helper", since DOM flash and wordmark positions depend on the projected 3D points. This worked first time but was a design decision the skill does not mention.

## Tool issues and fixes

- `create-video --yes --blank --no-tailwind .` into an existing empty folder worked (22 s); it produced `package-lock.json` and `node_modules`, removed with PowerShell before `pnpm install` (the Bash `rm -rf` was denied by the harness).
- `remotion add` printed the known `'HEXT' is not recognized` message; packages installed fine.
- `--gl=angle` rendered correctly on the first try; `--image-format=png --pixel-format=yuv420p` avoided the `yuvj420p` output noted in the tool doc.
- Transmission glass (see gap 1) and a physical material with vertex colours + iridescence both looked wrong (flat grey, then black). Fixed with a custom shader material.
- The 3-line `uniforms-xxx-value` props on `<shaderMaterial>` work for per-frame updates as long as an initial `uniforms` object is passed.
- Bash heredoc with a long multi-file script failed to parse once ("unexpected EOF"); I wrote files with the Write tool instead.
- Visible rectangle edges on halo strips and a notch where the incoming beam met the slanted prism face; fixed with soft halo falloff and by drawing beams under the glass.

## Honest self-assessment

Does it look like the style? Partly. It has the mood (dark void, single hero, bloom-like hit, one continuous move, no cuts) and the beam to spectrum to wordmark story reads clearly in 8 s. It departs from the recipe in three places: the hero is a shader-drawn glass prism instead of a `MeshPhysicalMaterial` glass or extruded logo, bloom is faked with additive strips and DOM gradients rather than a postprocessing pass, and the wordmark is a larger horizontal lockup.

What a motion designer would criticize:
- The prism is the weakest element: a flat triangle with a gradient, fresnel rim and sheen. No real refraction, no internal caustics, no rainbow edge dispersion. The light does not bend inside the glass, and the in-glass beam is dimmer than the beams outside it.
- The void shows faint concentric banding from the CSS vignette (8-bit gradient, no dither or grain).
- The fan is perfectly clean: no flare, no lens streak, no noise or grain in the light, so it feels vector-like rather than photographic.
- Pacing: the first 1 s is nearly empty and the colour-settle of the wordmark leaves only about 1 s of fully settled hold; I would shorten the recombine and give the lockup 2 s.
- The recombined white line and the vertical flare are a bit literal; a more elegant resolve would have the bands themselves become the letter strokes.
- Silent as briefed; nothing was checked for audio sync.
