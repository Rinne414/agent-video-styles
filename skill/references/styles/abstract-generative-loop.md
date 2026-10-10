# Abstract Generative Loop

Shapes and particles that morph through a handful of states and arrive exactly where they began. Wordless, seeded, and a pure function of the loop phase.

- **Tier**: experimental (few public examples; validated by one template)
- **Primary tool**: HTML capture with canvas 2D or p5.js (alt: HyperFrames + GSAP)
- **Format**: 1080x1080 30 fps (also 1920x1080 and 1080x1920); 8-20 s (template: 12 s = 360 frames). For HyperFrames at 1080 wide compose 1088 and crop
- **Inputs to ask for**: use (hero background, social loop, music visual), palette (2-3 hex) or mood, seed number, loop length, optional music

## Look

| Token | Value (1080x1080) |
|---|---|
| Ground | dark `#0B0D14` or warm grey `#E9E6E0`; exactly one ground per video |
| Palette | 2-3 colors total: ready sets on `#0B0D14`: cool `#7C5CFF #22D3EE #F5F7FA`; warm `#FF6B4A #FFB454 #FF8FA8` (warm sits well on the dark ground). Accent coverage <= 30% of the frame |
| Shapes | 6-14 objects: circles, rings (stroke 6 px), rounded squares (radius 24%), sizes 80-420 px; fills flat or one soft glow (`shadowBlur` 40) |
| Spacing | place shapes on a ring of radius 140-250 px around the centre at even angles plus seeded jitter, sizes 100-270 px; random scatter clumps into overlapping soup, and glow with alpha 0.55-0.9 overlapped makes it worse |
| Particles | 400-1200 dots, radius 2-5 px, opacity 0.25-0.9, drawn behind shapes |
| Grain | optional 3% static noise overlay baked once with a fixed seed |
| Text | none by default; if a word is required: Inter / Space Grotesk 700, 96-140 px, centered, contrast >= 4.5:1, never over particles |
| Safe area | 80 px margin; keep the focal group inside the central 70% so crops (hero banners, 9:16) survive |

## Motion grammar

- **Loop phase**: `phi = (i % N) / N` with N the total frame count; render frames 0..N-1 so the frame after N-1 is frame 0.
- **Periodic only**: every parameter is `base + amp * sin(2*pi*(k*phi + offset))` with integer `k` (1, 2 or 3), or a periodic ease built from it. Noise uses a circular sample: `noise(cos(2*pi*phi)*r + ox, sin(2*pi*phi)*r + oy)`.
- **Morph**: a shape cross-morphs between two radii/corner values over 60-90 frames with `ease-in-out cubic`; state chain returns to state 0 at phi = 1.
- **Particles**: positions are analytic, `angle = a0 + 2*pi*k*phi` on a seeded orbit radius; no accumulated physics (or replay from frame 0 each frame).
- **Beat grid** (with music): 120 BPM = 15 frames per beat at 30 fps; make N a multiple of 60 (one 4/4 bar) and put each state change on a beat.
- **Seeds**: one `mulberry32(SEED)` reseeded at the start of each frame; generation order fixed.
- **Never**: `Date.now()`, `requestAnimationFrame`, unseeded `Math.random()`, linear easing on position, motion that dies out near the end.

## Structure (template: 12 s = 360 frames @ 30 fps, looping; 8 s = 240 frames)

| Beat | Frames | Content |
|---|---|---|
| State A | 0-90 | Opening composition; frame 0 is the thumbnail, so it must look finished |
| Morph 1 | 90-180 | Shapes morph, particles swirl inward |
| Morph 2 | 180-270 | Peak: largest scale, brightest accent |
| Return | 270-360 | Everything eases back to the state A pose (velocity matches too) |

Proportions scale with the requested length: keep four equal quarters (12 s: 90 each; 8 s: 60 each), N a multiple of 60, and the same `k` harmonics. For the ui-morph-loop variant use one state per bar-half (7 bars = 14 states at 120 BPM).

## Audio

Usually silent (hero backgrounds). With music: use a supplied or code-synthesized loop whose duration equals the video exactly (12 s at 120 BPM = 6 bars); fade nothing, so the audio loops too. If silent, sound items are N/A.

## Agent brief (template)

```
Style: abstract-generative-loop (see references/styles/abstract-generative-loop.md)
Use: <hero background | social loop | music visual>
Palette: <2-3 hex> on <dark | light> ground; Seed: <int>
Objects: <n shapes, n particles>; Mood: <calm | energetic>
Format: 1080x1080 30fps, N = <360> frames; music <path | synth | none>
```

## Quality bar

- [ ] Numeric seam check: render frame N separately (`capture_html.mjs --out x.png --start N`); it must hash identical to frame 0. Then with mean absolute pixel difference `d(a,b)` over the rendered frames, `d(N-1, 0)` must be <= 1.5 x the median of `d(i, i+1)` over the clip (equivalently, no larger than `d(N-2, N-1)` within noise)
- [ ] Velocity is continuous at the seam (no visible hitch when looped 3 times)
- [ ] Two renders hash identically (`ffmpeg -f framemd5`)
- [ ] 2-3 colors only; focal group inside the central 70%
- [ ] Any text has contrast >= 4.5:1 (N/A if wordless)
- [ ] Beat changes land on beats when music is used (N/A if silent)

## Pitfalls

- **Rendering N+1 frames**: duplicates frame 0 at the end and creates a stutter. Render exactly N.
- **Non-integer harmonics**: `sin(2*pi*1.5*phi)` does not close. Use integers.
- **Accumulating particle state**: drifts from the seam. Use analytic positions.
- **Cursor or easing velocity**: matching positions is not enough; match derivatives (use periodic functions throughout).
- **HiDPI canvas**: `pixelDensity(1)` in p5; canvas size must equal `--width/--height`.
- **Muddy overload**: more than 14 shapes with glow turns to soup; cut objects, not opacity.

## Variants

- **ui-morph-loop**: 1440x1440, warm grey `#E9E6E0` ground, black and white UI, Geist; a single element passes through button, loader, check, toggle, tab, chart, toast and returns to button; one state per beat.
- **particle-field**: dark ground, 1000 particles on 5 concentric orbits (radius 120-480 px), per-orbit speed `k` in {1, 2, 3}, accent on the leading 10%.
