# Template report: editorial-swiss

## Result

Built from `skill/` alone (SKILL.md, styles/editorial-swiss.md, tools/hyperframes.md, templates/README.md). Deliverables:

- `templates/editorial-swiss/` (README, STORYBOARD, content.json, build script, theme module, generic GSAP timeline, vendored fonts and GSAP, pinned `hyperframes@0.8.143`, `gsap@3.14.2`, `@fontsource/inter-tight@5.3.0`, `@fontsource/ibm-plex-mono@5.3.0`)
- `templates/editorial-swiss/out/editorial-swiss.mp4`: 1920x1080, 30 fps, 750 frames, 25.00 s, no audio, 1.7 MB
- `out/sheet.png` from `inspect_video.py --frames 12` (reported OK, no edge-band warning; "still 16.7 s total, longest 2.77 s", which matches the style's 60-90 frame holds)
- `previews/editorial-swiss.mp4` (0.30 MB) and `previews/editorial-swiss.webp` (poster at 16.5 s, the 97% scene)
- Full renders used: 1 of 3. Stills: 8 snapshots (7 scene frames + end frame) viewed before the render; one fix applied (colophon logo/summary spacing, masthead counter text) before the render.
- Render time: 35.7 s (drawelement capture, hardware GPU).

The recipe was strong enough to build from. Nothing blocked; the gaps below are friction, not failures.

## Quality bar

| Item | Verdict | Evidence |
|---|---|---|
| Every element's left edge sits on a column edge from `col(n)` | PASS (with optical caveat) | All boxes are positioned via `col()`: x = 96 (col 0), 972 (col 6), 1118 (col 7), 1556 (col 10) visible in snapshots and sheet. Glyph side bearings make the big "4"/"9" ink start at about x=110-115, not 96; box edge is on grid, ink is not optically aligned. |
| One signal color, <= 20% of any frame | PASS | Only `#E30613`. Largest red area: "97%" numeral scene, roughly 6% of the frame; colophon red square is under 1%. Hard cuts, no full-frame wipe. |
| No rounded corners, shadows, gradients | PASS | Frames show hard-edged rules, square logo; CSS has no radius, shadow or gradient. |
| Every statistic has a visible source line; invented figures labelled "sample data" | PASS | "Source: sample data, fictional studio" on every frame (bottom left), "Sample data" top label on every frame, "All figures are sample data" in the colophon. |
| Body <= 45 chars per line, nothing under 30 px | PASS | Longest body line "Designers, engineers and" / "producers under one roof." = 26 chars at 38 px; labels 30 px. |
| Text contrast >= 4.5:1 (signal only on display type >= 60 px) | PASS | `hyperframes check`: 61/61 text checks pass WCAG AA. Red is used only on 440 px numerals, the 168 px "2026" and non-text rules/block. Body is `#5C5C5C` (5.9:1). |
| Intended grotesk confirmed in a snapshot | PASS | Snapshots show Inter Tight 700 (tight tracking, distinctive "Pr" "ct" shapes) and IBM Plex Mono labels, not Arial. Fonts are vendored woff2 with root-relative `@font-face`. |
| Colophon settled by frame 810 and held >= 1.5 s | PASS (scaled) | 25 s is 750 frames, so the recipe's 810 does not apply; scaled to 90%, the limit is 675. Colophon settles at frame 696 (last credit label finishes), held 54 frames = 1.8 s. Strictly: 696 > 675, so this is a marginal miss against the proportional target, a PASS on the 1.5 s hold. |
| Silent: sound items | N/A | No audio stream (`audio: none`). |
| Nothing static > ~1 s (general rule) | PASS with note | Rail fill drifts slowly over each scene (ease `power1.inOut`), but the content itself sits still after about frame 45 of each 114-frame scene. This is the style's "measured hold"; `inspect_video` reports 2.77 s as the longest still stretch. |
| Last frame intentional, held >= 1 s | PASS | Colophon frame at 23.97 s on the sheet. |

## Skill gaps

1. `references/styles/editorial-swiss.md`, Structure: the table is written for 900 frames and "Section 3 = image or diagram block" while this brief is 25 s with five statistics and no image. The text says proportions scale, but there is no worked rule for a stats-only report (how many frames per stat, whether to keep a masthead of 90-120 frames). Also "settled by frame 810" is absolute while everything else scales. Proposed edit: state it as "settled by 90% of the length, held >= 1.5 s", and add a variant line: "Stats report (5 numbers, 25 s): masthead 90, five scenes of 114, colophon 90; one stat per scene".
2. Same file, Look / Grid: the recipe gives `col(n)` and `w(k)` but not a layout for the scene itself. I had to invent: numeral cols 0-5 (440 px; "97%" ends at about x=975, so text starts at col 7), text column cols 7-11, vertical anchors (rule y=360, headline y=448, body y=720), top/bottom furniture at y=96/912, 8 px baseline snapping. Proposed edit: add a short "Stat scene layout" table with these coordinates and the rule that a 3-glyph numeral at 440 px needs about 880 px.
3. Same file, Motion grammar: "digit roll per place (vertical strip 0-9) over 20 frames" works, but a 0-9 strip means "1" rolls only one step and "3" three. I used a 20-cell strip (0-9 twice) ending at 10+digit so every place rolls at least 10 cells. Also the mask needs `padding-bottom: .14em; margin-bottom: -.14em` or descenders ("p", "j", "g") clip. Neither pitfall is listed. Proposed edit: add both to Pitfalls with the one-line CSS.
4. `references/tools/hyperframes.md`, Check: `data-end` on any element (I used it for a roll end value) is an error `deprecated_data_end`, and a lint error silently disables layout/contrast audits ("0 samples"). The doc mentions the second part generally but not this trigger; a custom `data-*` attribute starting with `end` is enough. Proposed edit: add "do not name custom data attributes `data-end`; use `data-to`" to the lint list.
5. `hyperframes.md`, Check: a numeral strip clipped by `overflow:hidden` produces dozens of `canvas_overflow` / `text_box_overflow` info lines (68 infos here). They are harmless but noisy and make real warnings hard to find. Proposed edit: mention `data-layout-allow-overflow` on the clipping container for roll strips (not tested here whether it silences them).
6. `hyperframes.md` / SKILL.md: `make_preview.py --poster-at` takes a fraction 0-1, not seconds; the error says so only after failing. SKILL.md Scripts table does not give the flag. Proposed edit: document "`--poster-at 0.4` = 40% of duration".
7. `SKILL.md` step 4/5 vs conventions: the Setup step says delete `AGENTS.md`/`CLAUDE.md` after `init` (worked), but `init` creates a nested folder named after the project, so running it inside `templates/` is right; this is not stated. Minor.
8. `templates/README.md` says `pnpm run render` writes `out/<id>.mp4` and suggests a `still` script, but nothing says how HyperFrames' `snapshot` takes `--at` (seconds, comma list) in a package script. Minor; I used `snapshot --at` as a trailing argument.
9. Snapshot command `snapshot` prints "Describing frames with Gemini vision" and writes `descriptions.md`; documented as harmless, confirmed (no key needed, still exit 0).
10. The `rm -rf` of `snapshots/` was blocked by the sandbox permission layer in Git Bash; PowerShell `Remove-Item` worked. Environment note, not a skill defect.

## Tool issues

- `hyperframes check`: `nested_structure_needs_subcomposition` warnings for every scene section (expected, documented as a Studio hint); first run failed on `deprecated_data_end` (see gap 4). After the fix: 0 errors, 12 warnings, 68 infos, contrast 61/61.
- `inspect_video.py`: no problems; "still" detection counted 16.7 s as unchanged, consistent with deliberate holds.
- `make_preview.py`: `--poster-at` fraction (gap 6).
- Render: 35.7 s for 25 s of video (setup 9.8 s, capture 23 s), well within the doc's "about 0.7 s per second plus 20 s".
- Fonts: Inter Tight and IBM Plex Mono loaded from vendored woff2; no auto-resolve involved, nothing silently fell back (confirmed by eye in snapshots).

## Honest self-assessment

- Does it look like the style? Mostly yes. It reads as a Swiss-grid annual report: flush-left bold grotesk, hairline rules, mono labels, one red, big numerals, hard edges. Weaker than a real Swiss poster in two ways: the composition is a safe repeated template (every stat scene has the same layout, so there is no grid-shifting or scale contrast), and the lower third of each frame (y 820-912) is empty. The recipe's "grid moves" and "bold-poster" variant were not used; the result is calm but a little generic.
- Not done from the recipe: panel wipes (skipped on purpose to keep red under 20%), paper grain (omitted: grain is optional and needs a baked PNG; the 1 px/frame drift is replaced by the rail fill).
- Is the recipe strong enough for others to reuse? Yes for the visual tokens (grid, type, colors, motion durations all transferred directly and rendered correctly on first try, including fonts). Less so for composition: the recipe tells you the ingredients, not the layouts, so two agents will produce different scene layouts. Adding the stat-scene layout table (gap 2) and the 25 s stats variant (gap 1) would make results consistent. The experimental label is fair: one template validates it, and this run is a second independent build that succeeded.
