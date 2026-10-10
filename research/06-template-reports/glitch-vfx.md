# Template report: glitch-vfx

## Result

Built from the skill alone: `templates/glitch-vfx/` (HyperFrames 0.8.143, one canvas driven by a GSAP proxy tween, `content.json` + `src/theme.js`). Output `out/glitch-vfx.mp4` is 1920x1080, 30 fps, 300 frames, 10.00 s, silent, 4.15 MB. `inspect_video.py` reported OK with no edge-band, black or still warnings. Preview and poster are in `previews/glitch-vfx.*` (poster at 1.10 s, mid-burst).

Full renders used: 2 of 3 (the first, and a second for the determinism check). `check` passed with 2 harmless warnings (`composition_file_too_large`, `nested_structure_needs_subcomposition`).

Two points on the second render:

- Same seed, two renders: 210 of 300 frames differ byte-wise; PSNR average 54.7 dB, minimum 50.0 dB. So frames are visually identical, not byte-identical. This matches the tool doc's note for glow/gradient scenes (hardware GPU, 5 workers). The schedule and tiles are deterministic by construction.
- The brief was fulfilled as: RGB split and tearing on the HUD and logo, a flickering hologram that goes out and comes back, a 12x7 shatter, then a clean lock-in with the tagline "Where pixels break free".

## Quality bar

| Item | Verdict | Evidence |
|---|---|---|
| Same seed gives identical frames | PARTIAL | PSNR min 50.0 dB across two renders, 210/300 frames not byte-equal (GPU glow). Seeded schedule is identical by construction. |
| At most 3 flashes per second, no full-frame flash | PASS (judgement) | No full-frame flash. Heaviest second is flicker-out (136-150): 3 off phases in 14 frames, logo area only. Photosensitive-analysis tool not run. |
| >= 12 clean frames before next burst or cut | PARTIAL | Gaps between bursts: 13,3,3,8,66,29,15,51. The 3 and 8 are the recipe's own aftershocks (+9 and +21 frames) during the resolve; the 24-30 gap has no title on screen. Every other gap is >= 13. |
| Clean base text >= 4.5:1 | PASS | `#F2F5FA` on `#05060A` about 17:1; tagline `#B8C0CC` about 11:1; cyan/magenta only as split copies and the tagline cursor. |
| Bursts 3-6 frames, total <= 25% | PASS | 9 bursts, 34 frames = 11.3%. Lengths 2-6 (the 2-frame one is the recipe's hard cut). Hologram flicker (about 45 frames) and shatter (24) are counted separately; with them the "glitched" time is about 35%, which the recipe does not define clearly. |
| Text and logo inside safe area incl. tear offsets | PASS | Lockup spans about x 270-1650; max tear offset 60 px, split 24 px; HUD labels at 112 px. |
| No frame static > 1 s except end card | PASS | `inspect_video`: longest still 0.00 s (scanlines drift 1 px/frame, 3% push-in, timecode counts). |
| Fonts vendored and confirmed in a still | PASS | Space Grotesk 700/500 and JetBrains Mono 400 woff2 in `fonts/` (47 KB total); stills show the Space Grotesk letterforms, not Arial. |
| End card clean, settled, held >= 1.5 s | PASS | Tagline settled at frame 246, held clean to 300 (1.8 s); logo clean from 228. |
| Silent: sync by frame numbers only | PASS (noted) | Bursts and beats are frame numbers in `content.json`; audio items N/A. |

## Skill gaps

1. `references/styles/glitch-vfx.md`, Motion grammar + Structure: the burst scheduler (gaps 18-45 frames, seeded) and the Structure table (bursts at fixed frames 24, 120, 168) describe two different mechanisms, and the Quality bar's "12 clean frames" contradicts "Resolve" aftershocks at +9/+21. Propose: say that fixed bursts live in `content.json` as a `bursts` list (start, len, intensity) with seeded slice/offset generation per frame, that the random gap scheduler is optional for long pieces, and that the 12-frame rule starts after the Resolve.
2. Same file, Structure: the Hold beat assumes title and tagline arrive together, but a hologram-then-shatter brief needs the tagline on the end card. Also the Shatter beat (210-250) is 40 frames while the tile math in Motion grammar totals 24 (14 + 0-10 delay). Propose a second variant "hologram-shatter-lock" with a frame table (flicker in/out patterns, scan sweeps, shatter 200-224, lock at 226, tagline 232-246) and state the shatter length as 24 frames.
3. `references/tools/hyperframes.md`, Determinism and Fonts: no recipe for a canvas-compositor (offscreen canvas, `drawImage` slice strips, `source-atop` tinting for cyan/magenta copies, `screen` blend, tile shatter via `drawImage` sub-rects). This was the easiest route for tearing and shatter and should be written down, along with the fact that `ctx` vs `canvas` is easy to mix up in `drawImage` (it throws, and the proxy tween silently shows a stale or blank frame). Also add: canvas text needs `document.fonts.load()` plus a hidden DOM span using the font, since `@font-face` alone does not load for canvas.
4. `hyperframes.md`, Determinism: state that with 5 workers and hardware GPU a pure-canvas scene with `shadowBlur` was not byte-identical (PSNR >= 50 dB). The doc says this for CSS glow; extend to canvas shadow.
5. Style file, Look: "Space Grotesk 800" does not exist (fontsource stops at 700); say 700. Also the 9:16 line is irrelevant here but the hologram "outline at 40% under the solid" needs a stated stroke weight (I used 3 px cyan with a 22 px glow) and stripe spec (1.5 px every 4 px at 38%).
6. `SKILL.md` Step 6: `snapshot` writes `snapshots/` and `descriptions.md` and tries Gemini; mention deleting it (it is in the tool doc, but Step 6 does not link). Minor.

## Tool issues

- The `hyperframes init` scaffold wrote `AGENTS.md`/`CLAUDE.md`; deleted as the tool doc says.
- `npm`/`pnpm` scripts in the scaffold use `npx --yes hyperframes@0.8.143`; kept pinned.
- A thrown exception inside the proxy `onUpdate` produced no error in `snapshot` output; the frame was just missing content. Found only by looking at stills (good argument for the "look at every still" rule).
- Render time 22-29 s for 300 frames with 5 workers, as documented.

## Honest self-assessment

It looks like the style: dark ground, 2 px scanlines, short seeded bursts with cyan/magenta split and slice tears, an edge-lit hologram, a glass-tile shatter, and a clean readable end card. Weaker points: the shatter tiles are mostly empty dark squares with hairline edges, so it reads as a "glass shatter" more than a pixel breakup; the hologram stripes are barely visible after H.264. The idle opening (0-30) is sparse. Not tested: reduced-flashing mode render, the 9:16 variant, and a formal photosensitivity analyser.

Recipe strength: experimental tier is fair. The look tokens are strong and enough to build from; the timing section is where an agent has to improvise (gaps 1 and 2 above). I made about six design decisions the recipe did not cover (logo design, hologram stroke, scan band, flicker opacity patterns, tile edge treatment, tagline reveal). With the proposed variant table and the canvas-compositor recipe, another agent should reproduce this in one pass.
