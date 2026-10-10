# Regression: painterly-canvas (haiku, 1080x1920, 30 fps, 15 s, silent)

## Result
- Output: `regression/painterly-canvas/out/painterly-canvas.mp4`, 1080x1920, 30.00 fps, 15.00 s, h264 yuv420p, no audio, 10.9 MB (crf 22). Contact sheet: `out/sheet.png`.
- inspect_video: black 0.00 s, still 0.00 s, status OK.
- Full renders: 1 (293 s for 450 frames, about 0.65 s/frame). Still iterations: 2 rounds (6 stills, then 2 re-rendered after fixing the heron: body too fat, stubby wings, orange halo on body). Plus 2 determinism stills.
- Wall time: about 9 min of tool time from scaffold to verified output (authoring time excluded).
- Stack: hand-written canvas 2D (no p5), puppeteer-core, @fontsource/cormorant-garamond, content.json -> out/content.js, theme.js (tokens + brush/wash primitives), scene.js.

## Quality bar
- Determinism: PASS. Frame 230 rendered twice, md5 identical (d2dac2a9...).
- Boiling and grain visible but subtle (jitter <= 1.5 px): PASS. Boil amp 1.2 px, re-seeded every 3 frames; grain visible on the sheet. I did not do a frame-diff to measure the wobble.
- >= 40% empty paper in most frames: BORDERLINE PASS. Top ~30% is bare paper, mid and lower thirds are washes (fog paper-coloured, so reads pale). Fog veil blurs the line between paper and wash. I did not measure it.
- <= 7 colors, restrained saturation: PASS. Indigo, vermilion (seal only), ochre, teal, sky, sepia ink + paper.
- Text legible: PASS. Cormorant Garamond 500 at 76 px (rendered, not fallback), sepia on pale paper, ochre sweeps behind at 30% alpha. Slightly above the 48-72 px token; contrast looks fine.
- Draw time < 2 s/frame: PASS (0.65 s).
- Silent: audio items N/A.
- Rules: last frames hold a settled composition with seal for ~1.2 s while the heron keeps flapping (flap never settles; drift counts). Text safe area: text starts at y=340, above the 250 px UI zone. Honest weakness: the heron's upstroke wing is a stiff plank at some frames (see 9.4 s and 14.4 s), reads more "paper-cut" than watercolor. Not fixed (budget/time).

## Skill gaps
1. `references/tools/html-capture.md`, "Running it": quotes "about 16 frames/s" from a trivial sketch. A real painterly scene ran 1.5 fps (5 min for 450 frames at 1080x1920). Add: "Painterly scenes with 10+ bristle strokes and full-frame grain composite run 0.5-1 s/frame at 1080x1920; budget 5 min per 15 s" and suggest sharding with `--start/--frames` in parallel processes plus concat (no sharding recipe exists).
2. `references/tools/html-capture.md`: only a p5 example, but the style says canvas 2D is the "verified route". Missing: a minimal no-p5 `renderFrame` skeleton (setTransform reset, composite-mode reset, font `__ready`).
3. `styles/painterly-canvas.md`, Look table: tokens are only given for 1080x1080. No 9:16 layout guidance (safe zones in px, where to put text vs art, scaling of 48-72 px text). I chose text at top-left y=340 myself.
4. `styles/painterly-canvas.md`, Brushes: describes the bristle stroke in one sentence; no reference snippet. I had to design taper, dropout hash, and boil noise (stateless, step-major hash so partial draw-on `t` does not shift the jitter). A 40-line reference `brush()`/`makeWash()` in a `references/` file would save the most time and avoid wobble/flicker mistakes.
5. `styles/painterly-canvas.md`, Structure vs SKILL.md "last frame intentional, held 1 s": the Close beat says "washes fade to paper" but a poem should end on all lines visible. Clarify that for poems the Close holds the full text, and say how to handle lines (stay visible vs fade out per "Lyrics" motion rule, which says fade out after the line; a haiku wants them stacked).
6. `styles/painterly-canvas.md`, Characters: no guidance on drawing an animal procedurally (pose interpolation between standing and flying with spline control points). The "3-6 strokes per figure" tip is useful but the first heron looked like a bug; add "draw bodies thin, make neck/legs the signature, wings long and tapered."
7. Quality bar "40% empty paper": no way to measure. Suggest a one-line ffmpeg/python check (fraction of pixels within a delta of paper color).
8. SKILL.md step 7 / inspect_video usage: works with `--out` as documented; the html-capture doc says it "writes sheet.png into the cwd", which contradicts `--out`. Minor doc inconsistency.

## Things the skill got right
- `capture_html.mjs --start N --out x.png` still mode: stills in 1.4 s each, made the per-scene-still loop trivial.
- Determinism guidance (stateless renderFrame, hash-keyed seeds, md5 of a still twice) worked first try.
- Short-poem frame-budget rule (Paper 5%, Close 12%, per-line window) gave the timings directly.
- Font tip (`@fontsource` woff2 by relative URL + `document.fonts.load` in `__ready`) worked; the font rendered correctly in frame 0.
- content.js build-step note for file:// saved a CORS detour. `--crf 22` for grain advice kept the file at 10.9 MB.

## Honest self-assessment
The pipeline and process followed the skill without needing outside docs. Quality is decent for the washes, text and the lift narrative (standing heron, ripples, takeoff, rising mist), but the heron art is the weakest part: wing upstroke is a rigid bar and legs/body proportions are crude. The 40% empty paper check is by eye only. I did not use the 2 spare full renders, so the wing issue shipped. No external docs were consulted; no files outside `regression/painterly-canvas/` and this report were touched.
