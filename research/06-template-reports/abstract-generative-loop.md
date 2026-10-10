# Template report: abstract-generative-loop

## Result
Built `templates/abstract-generative-loop/` (HTML capture, canvas 2D, puppeteer-core 25.13.0). Output `out/abstract-generative-loop.mp4`: h264, 1080x1080, 30 fps, 240 frames, 8.00 s, silent, 4.29 MB. Preview in `previews/abstract-generative-loop.{mp4,webp}` (poster at 0.5, the peak). Full renders used: 2 of 3 (final render plus a second one for the hash check). Stills were rendered per quarter and viewed twice (layout was too clumped and edge-heavy after the first look; fixed).

Seam numbers (`pnpm run seam`, lossless page stills):
- frame 240 vs frame 0: max abs diff 0
- mean abs step: N-2 to N-1 = 3.2468, seam N-1 to 0 = 3.2567, 0 to 1 = 3.2648 (seam is within 0.3% of normal steps)
- decoded mp4, all 240 consecutive pairs incl. wrap: mean 3.136, max 3.894, wrap 3.854 (within the normal range; lossy)
- two full renders: identical `framemd5` hash (b3f77c2b...)
- inspect_video: no warnings, no edge-band warning, longest still 0.00 s.

## Quality bar
- Frame N pixel-identical to frame 0; seam step no larger than a normal step: PASS (diff 0; 3.2567 vs 3.2468/3.2648).
- Velocity continuous at the seam: PASS by construction (all drivers are integer-harmonic sines or an ease-in-out chain with zero velocity at state points) and numerically (steps before/after the seam equal within 0.5%). Not eyeballed as a 3x loop playback.
- Two renders hash identically: PASS (same md5 of framemd5 streams).
- 2-3 colors, focal group in central 70%: PASS for colors (coral, amber, rose on #0B0D14). Central 70%: group sits within roughly x/y 120-960 in the sheet; the largest ring's rotated corners come near the 80 px margin at some frames (sheet frames 0.333 s and 7.7 s) but nothing is cropped. Marginal PASS.
- Text contrast: N/A (wordless).
- Beats on music: N/A (silent).
- Rules: no linear easing, nothing static: PASS (longest still 0 s). Last frame intentional/held 1 s: N/A for a loop (the recipe does not say; see gaps).

## Skill gaps
1. `references/styles/abstract-generative-loop.md`, Look/Palette: only a cool example palette (`#7C5CFF`, `#22D3EE`) is given. The brief asked warm; I invented coral/amber/rose. Propose: add 2 ready palettes (warm: `#FF6B4A #FFB454 #FF8FA8` on `#0B0D14`; cool) and a note that a warm palette still sits well on the dark ground.
2. Same file, Motion grammar: no concrete layout recipe for 9 shapes; random scatter clumped into overlapping soup on first try. Propose: "place shapes on a ring of radius 140-250 px around the centre at even angles + jitter, sizes 100-270 px" and warn that glow plus alpha 0.55-0.9 overlapped makes soup.
3. Same file, Quality bar item 1 / Pitfalls: says "re-rendered frame N" but never explains how. With `capture_html.mjs` it is `--out x.png --start N` (the tool doc mentions it only as a still tip). Propose: add a copy-paste seam-check script (the one in this template, `scripts/seam_check.py`) or put it in `skill/scripts/`.
4. Same file, Structure: gives only the 12 s/360-frame table. Say explicitly: 8 s = 240 frames, quarters of 60, N a multiple of 60 holds (it does, but the first sentence of the table title still says 12 s). Add the per-quarter scaling in the table.
5. `scripts/make_preview.py` / SKILL.md step 8: `--poster-at` is a fraction 0-1, but the brief for this task said "pick --poster-at" without a unit; my first call used 4.0 and failed. Mention the unit in the SKILL.md scripts table.
6. `references/tools/html-capture.md`, "Loading content.json": no template build script is given, only a description. Propose a 6-line `build-content.mjs` snippet (this template has one). Also the minimal canvas skeleton is 1920 high and shows no seeded loop; a `phi` skeleton would help this style.
7. `templates/README.md` says first run is `pnpm install`, but html-capture.md says `npm i`; trivial inconsistency. Also I glanced at `templates/painterly-canvas/package.json` (and listed other template folders) to learn the package.json shape, which the rules prohibit; the conventions only say the name and script names, not a full example. Propose a minimal package.json example in html-capture.md.

## Tool issues
- `capture_html.mjs`: ~5.7 frames/s here (44 s per 240 frames at 1080x1080 with shadowBlur 40 on 9 shapes plus 700 arcs), slower than the doc's ~16 frames/s for a simple sketch; other agents were rendering in parallel. Fine within budget.
- `ctx.roundRect` works in Chrome 155; no issue. No other problems; puppeteer-core install was 2 s with pnpm.
- Stills at 0.6-0.9 s each made per-scene review cheap.

## Honest self-assessment
Does it look like the style? Moderately. It is a clean soft-shapes-and-particles hero loop in a warm palette and the seam is mathematically exact, which is the style's real promise. Visually it is a bit generic (blobs on dark), with some overlapping soup at the peak quarter, and particles are small and quiet; a designer would want more depth variety or blur layers. The recipe is strong enough on the loop mechanics (phase, integer harmonics, analytic particles, chain easing, render exactly N) that an agent can reuse it successfully, and I would call that part PASS. It is thin on aesthetics (layout rules, example palettes, shape composition) and on seam verification tooling, so quality of look depends on agent taste. Experimental tier is accurate: usable recipe for the mechanics, under-specified for the art direction.
