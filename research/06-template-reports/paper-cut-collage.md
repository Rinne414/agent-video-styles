# Template report: paper-cut-collage

## Result

- Built `templates/paper-cut-collage/` with HyperFrames 0.8.143: Node build script writes a static `index.html` (inline script, vendored GSAP, local woff2 fonts); one GSAP proxy tween calls `draw(frame)`, which rebuilds one SVG layer per 2-frame hold. All content in `content.json`.
- Output `out/paper-cut-collage.mp4`: h264 1920x1080, 30 fps, 900 frames, 30.00 s, silent, 47-49 MB. `inspect_video.py` reported OK, no black, no still stretch, no edge-band warning. Contact sheet viewed.
- Preview: `previews/paper-cut-collage.mp4` (2.8 MB) and `.webp` (poster at 26.4 s, cup scene).
- Full renders used: 3 (first full render, final render after a flag fix, an identical re-render for the determinism test). Each took 53-63 s under parallel load. Stills: about 4 snapshot rounds.
- Not run: `pnpm run render` itself (I ran the same `node scripts/build.mjs` and `hyperframes render` commands directly).

## Quality bar

| Item | Verdict | Evidence |
|---|---|---|
| Animated values change only on 2-frame boundaries | PASS | Decoded all 900 frames at 480x270: mean abs diff inside a hold 0.03 (max 0.05, encoder noise), across holds 11.3. |
| Every scene has one pattern, one hero accent piece and 3+ background details | PASS with caveat | Patterns in every scene (sheet). Hero orange: cup (title), basket (hill), sun star (dry), flag (ship), tea (cup). Ship flag is tiny and the picker basket is partly hidden, so the hero is weak in two scenes. Details: birds, clouds, grass, bunting, cat, plant, dust, gulls, fish, biscuits. |
| No bare text; labels on paper tags, contrast >= 4.5:1 | PASS | All text on paper tags (sheet). `check`: 5/5 text checks pass WCAG AA (ink on paper). |
| Contact sheet shows torn edges, shadows and grain on every scene | PASS, grain weak | Torn white rims and drop shadows visible in every full-res frame. Grain at 16% is only visible when zoomed; it does not read in the sheet. |
| Re-render gives identical frames | PASS | Two renders: `framemd5` of 900 frames identical (0 differ). |
| Nothing crosses the safe area; end card held >= 1 s | PASS with caveats | End tag held frames 840-900 (2 s). Tags start at x=96. Full-bleed backgrounds and the dried-tea rack/lantern/bunting deliberately touch edges; bunting at x=80 and the cat tail run off the left edge. |
| Cuts land on beats when music is used | N/A | Silent brief. |

Extra checks: tag reading time (4 words stay up about 4.5 s, spec needs 1.9 s) OK; no gradients, no opacity fades on textured pieces (wipe and arrivals use slides and scale pops).

## Skill gaps

1. `references/styles/paper-cut-collage.md`, Structure: the "144 frames per chapter = 96 scene + 18 morph/wipe + 30 label hold" table is for 5 chapters in 30 s; it does not fit a brief with 4 chapters plus a title card and an end card. Proposed edit: add a worked allocation for 4 chapters (title 90, chapters 180/180/180/270 incl. end card, wipe 10 frames centred on the boundary, tags arrive at +36).
2. Same file, Motion grammar, wipe: "torn strip crossing the screen in 10 frames" does not say how wide it must be to cover the screen on a 2-frame step grid. With 5 steps, a strip about 3600 px wide moving 1230 px per step covers the screen on exactly the swap step. Add that recipe, plus "swap the scene on the covering step".
3. Same file, Look: no skin tone, dried-leaf brown, dark green, or kraft in the palette, but characters and "dried tea" need them (I added skin `#E8B592`, leafDark `#2F6B3A`, olive `#9A9A3F`, brown `#8B5E3C`, cupShade `#E6DCC3`). Add a "supporting tones" row.
4. Same file, Fonts: "Patrick Hand 700" does not exist in `@fontsource/patrick-hand` (only 400). Only Fredoka 600 and Caveat Brush 400 were needed; say so. Also give the fontsource file names.
5. Same file, Look/Pitfalls: no recipe for the torn edge beyond "polygon of 40-70 points". Add the working one: resample the outline to 40-70 points, offset along the normal by seeded noise (amp = 5% of the smaller side, clamped 2.5-8 px), draw a second path 3.5 px larger in paper white under the fill as the torn fibre rim, shadow with one shared `feDropShadow` on the group (never per-path blur).
6. Same file, Motion grammar: "Boil" and "on twos" give no implementation pattern in HyperFrames. Add: quantize the frame first (`h = frame - frame % 2`), derive every value from `h`, seed boil with `rnd(id, h/2)`, rebuild SVG only when `h` changes. Mention that `tl.set` every 2 frames is the wrong approach for 100+ pieces; the proxy-tween pattern in `hyperframes.md` is right.
7. Same file, Quality bar: "identical frames" cannot be checked with `framemd5` on a single MP4 pair of adjacent frames (encoder noise makes held frames differ by about 0.03 mean). Add: check on-twos by mean absolute difference (inside hold below 0.1, across hold above 1) and determinism by comparing `framemd5` of two renders.
8. `references/tools/hyperframes.md`, Setup: `init . --non-interactive` inside an existing empty folder works and writes `package.json` with `npx --yes hyperframes@0.8.143` scripts; say it also scaffolds `.` correctly. Also add the `check` warnings that are harmless for a generated SVG scene: `studio_missing_editable_id`, `nested_structure_needs_subcomposition`, `composition_file_too_large`, and the `container_overflow` info for a camera-scaled layer.
9. `references/tools/hyperframes.md`, Fonts: say that a `@font-face` file without a lint-visible fallback is enough and that text inside inline SVG `<text>` picks up the local font (verified in the stills). Also give a recipe for text width in generated SVG tags (no `getBBox` in a build script): per-font width factors (Fredoka 600 about 0.56 em, Caveat Brush about 0.40 em per char) worked within about 8 percent.
10. `SKILL.md` step 6: "Render one still per scene" but `snapshot --at` takes seconds, not frames, and overwrites the previous run; the mapping from a frame number to a time is only in the tool file. Add one line to step 6.
11. `SKILL.md` Rules, "Nothing static for more than ~1 s": the tag cards in this style are deliberately held about 4 s while the scene still drifts. Clarify that a camera push or boil counts as motion (it does in step 7 text, but not here).

## Tool issues

- `npx hyperframes snapshot` prints "Describing frames with Gemini" and writes `descriptions.md`; harmless (already documented).
- The `snapshot` command also adds a last frame at the composition end (`frame-07-at-29.1s.png`), documented.
- `check` stays at warnings for the SVG-in-section structure; no render problem.
- Render of 900 frames took 53-63 s with 5 workers while other agents rendered (docs say about 0.7 s per video second, so about 21 s plus 20 s start-up). OK.
- `rm -rf` of scratch folders under `out/` was refused by the sandbox; `out/x_*` and the three `.tgz` files are left behind in `templates/paper-cut-collage/out/` (git-ignored).
- No width bug at 1920x1080; the edge-band check is clean.

## Honest self-assessment

- Does it look like the style? Mostly yes. Torn white-fibre edges, flat fills, patterns, shadows, and stepped motion read as paper cut-outs. Weaker points: the ship scene (huge sails against a tiny hull, masts mostly hidden, flag near the sun), the rolling hand is a pair of rectangles, grain is barely visible, and chapter 4 opens on a mostly empty wall for 0.5 s. The picker is charming but blocky. Moving-image feel (stepped boil, chunky wipe) was verified numerically, but I only looked at stills and a 12-frame sheet, not played the video.
- No morph-on-blank-paper between eras: I used the torn-strip wipe only; the style's morph step is not exercised.
- "At most 12 pieces per scene" was not respected: scenes use roughly 20-30 pieces with details. The recipe's own scene lists (pieces plus 3+ details) are hard to hit with 12.
- Is the recipe strong enough for others to reuse? The look tokens are good and led straight to a good result, but the engine (torn edges, on-twos driver, wipe geometry, tag sizing) had to be invented; gaps 5-7 above are the highest value. An agent given only the style file would probably produce flat polygons with CSS shadows and smooth GSAP tweens unless it also read the HyperFrames proxy-tween pattern. The 3 renders and 53 s render time make the template cheap to iterate.
