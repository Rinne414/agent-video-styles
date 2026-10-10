# product-turntable-3d

A 15 s product turntable for fictional over-ear headphones, "Aura One". The headphones are modelled in code from primitives (lathe, torus, capsule, cylinder), turn on a light studio sweep with a baked contact shadow, and three callouts appear in turn before a name and tagline lockup. Silent, 1920x1080, 30 fps. Experimental style: few public references.

Tool: Remotion 4.0.534 with `@remotion/three` (three 0.171.0, react-three-fiber 9.1.2). Fonts: Inter from `@fontsource/inter` (offline). No downloaded models, textures or HDRIs; the reflection environment is `RoomEnvironment`, generated at render time.

## Render

```
pnpm install
pnpm run render      # out/product-turntable-3d.mp4
pnpm run still       # out/still.png (frame 127)
pnpm run studio      # Remotion Studio
```

Uses `--gl=angle` (needed for WebGL in headless Chrome on Windows). Remotion needs a Company License for for-profit companies of 4 or more people: https://www.remotion.pro/license

## Edit

Everything editable is in `content.json`:

- `brand`: name, tagline, footnote
- `colors`: sweep, text ink, accent, shell, cushion and metal colors
- `features`: callout label, claim and anchor (`cupLeft`, `cupRight`, `hingeRight`)
- `timing`: reveal/feature/lockup frames, fold timing; `meta.durationInFrames` sets length
- `turn.stopYawDeg`: product yaw (degrees) at each callout stop
- `camera`: field of view, distance, elevation, orbit, target heights

New anchors go in `src/motion.ts` (`ANCHORS`). Scene code: `src/Headphones.tsx` (model), `src/Studio.tsx` (sweep, lights, shadow), `src/Overlay.tsx` (callouts, wordmark, lockup). Tokens live in `src/theme.ts`.

All the sample content (name, claims, specs) is fictional.
