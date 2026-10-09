# procedural-3d-sting

8 s, 1920x1080, 30 fps silent logo sting for the fictional "Prism Studio": a glass prism catches a white beam, splits it into a spectrum that sweeps across the frame, and the light resolves into the wordmark PRISM. Remotion + React Three Fiber (`@remotion/three`), everything procedural, no network access at render time.

## Render

```
pnpm install
pnpm run render      # writes out/procedural-3d-sting.mp4 (about 15 s on an RTX 3090)
pnpm run still       # one PNG at frame 66 (the hit)
pnpm run dev         # Remotion Studio
```

Uses `--gl=angle`. Requires Node 22+, pnpm, and a GPU or working ANGLE backend. Remotion needs a Company License for for-profit teams of 4+: https://www.remotion.pro/license

## Edit

Everything editable is in `content.json`:

- `brand.wordmark`: the text (keep it short; letter spacing is fixed to the box in `layout`)
- `colors`: void, rim light, wordmark colour, the 7 spectrum colours (red to violet)
- `timing`: every beat in frames (beam travel, hit, fan sweep, recombine, slide, reveal, sheens); change `durationInFrames` to match
- `motion`: sweep angles, fan spread, drift speed, flash length
- `layout`: prism size, final prism x, wordmark position, size and underline
- `camera`, `dust`: orbit and particle count/seed

Scene code lives in `src/` (`Light.tsx` beams, `Prism.tsx` glass shader, `Wordmark.tsx` DOM lockup, `rig.ts` camera and attach points). Every value is a pure function of the frame number; two renders are identical.

Fonts: Inter 600 from `@fontsource/inter` (bundled locally).
