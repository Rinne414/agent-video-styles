# Template report: apple-keynote-minimal

## Result
- Output: `templates/apple-keynote-minimal/out/apple-keynote-minimal.mp4`, 25.00 s, 1920x1080, 30 fps, h264, 750 frames, silent, 2.49 MB.
- Render time: 31.5 s (capture 27.3 s, 3 workers, hardware GPU). Full renders: 1 (plus one stills pass with `snapshot`, plus one `check`).
- inspect_video: 0 s black, "frozen 5.80 s" warning (see Quality bar and gap 4). Preview: `previews/apple-keynote-minimal.mp4` (0.19 MB) + `.webp`.
- Brief mapping: Halo 5. / hero window / Quieter. / Faster. / 0.2 s counter / Yours. + phone ("notes stay on your device") / end card.

## Quality bar
Frames viewed: `out/sheet.png` and the 9 stills from `snapshot` (1.5, 5.4, 7, 10, 12.5, 15, 17.5, 20, 24 s).
- Exactly one element moves at any time: PASS with caveat. Each shot has one focal element, but the hero scene overlaps rise, sweep and float, and the 1.00 -> 1.03 micro-scale runs on every scene wrapper at all times (required by the style), plus a 6-frame dip. Strictly "one moving element" conflicts with the micro-motion rule.
- Negative space >= 60%: PASS. Largest element is the window (1056x594 = 30% of frame area); headlines are about 10%.
- Headline <= 4 words, subhead <= 8: PASS ("Halo 5." 2, "Nothing between you and your words." 6, "Every note stays on your device." 6).
- No easing overshoot: PASS. Only power2/power3/sine/power1/none eases; no back or elastic.
- Secondary text contrast >= 4.5:1: PASS (`#86868B` on `#000` is about 6.2:1; `check` reported 5/5 pass; all secondary text is 44 px).
- Lockup settled by frame 810 (scaled: ~675) and held >= 1.5 s: PASS. End card settles at frame 672 and holds 78 frames (2.6 s).

## Skill gaps
1. `references/styles/apple-keynote-minimal.md` > Structure: the table assumes a 30 s product film (Intro word, hero reveal, name, three features, lockup). The brief is a text-led beat sequence ("Quieter." / "Faster." ...) with a 25 s length and no clear rule for scaling. Proposed edit: add a short "Text-led variant (no hero between claims)" row set: claim card 60 frames, then proof visual or spec numeral 90 frames; and state that the Structure percentages (not frame numbers) scale to the requested length.
2. `tools/hyperframes.md` > Minimal project / Passing data: no guidance on how a template keeps all editable content in `content.json` when the composition is plain HTML (the page cannot `fetch` a local JSON reliably, and `--variables-file` only supplies strings at render time). I used a tiny `scripts/build.mjs` that writes `content.js` (`window.CONTENT = ...`) and syncs root `data-duration`. Proposed edit: add a "Content-driven template" snippet with this pattern and mention that `data-duration` must be patched by the build step.
3. `tools/hyperframes.md` > Setup: `init` also writes `AGENTS.md` and `CLAUDE.md` (8.6 KB each) into the project; the doc does not say to delete them for a template. Proposed edit: "delete AGENTS.md/CLAUDE.md after init in templates" and note that `init` hyperframes.json/meta.json can stay.
4. `SKILL.md` > 7 Verify / `scripts/inspect_video.py`: the style requires a slow 1.00 -> 1.03 micro-scale, yet the script flags "frozen 5.80 s". Nothing says that this warning is expected for this style. Proposed edit: in the style file Pitfalls (or SKILL.md step 7) say "inspect_video may report frozen stretches on pure type cards; that is acceptable when the micro-scale is running; confirm with two frames 1 s apart".
5. `styles/apple-keynote-minimal.md` > Look: "Spec numerals ... unit in 48 px secondary color beside it" renders a very small "s" beside a 320 px numeral; a one-letter unit looks lonely. Proposed edit: say unit size may rise to 72 px for single-letter units, or give an example ("0.2 s" vs "18 h").
6. `styles/apple-keynote-minimal.md` > Look: no tokens for the dark-stage device frame (the shadow token is light-stage only), so a dark window on black has low contrast. I invented `#1C1C1E` fill / `#2C2C2E` 1 px border / `#3A3A3C` bars. Proposed edit: add a dark-stage device row with these values.
7. `styles/apple-keynote-minimal.md` > Motion grammar: "Light sweep ... 20% white diagonal band" lacks band width and skew angle; and it conflicts with the lint (`container_overflow` info for an overflow-hidden child). Proposed edit: "band 260 px wide, skewX -18deg, travels edge to edge of the hero; add `data-layout-allow-overflow`" (I did not test whether the attribute silences the info).
8. `tools/hyperframes.md` > Windows pitfalls: `hyperframes snapshot` writes `snapshots/` plus Gemini `descriptions.md` and prints "Describing frames with Gemini vision" even without a key; delete the folder after use. Proposed edit: add a line that `snapshot` output should be removed or git-ignored in templates.
9. `templates/README.md`: it says `pnpm run render`; `package.json` scripts call `npx --yes hyperframes@0.8.143`. It does not say whether `out/` and `snapshots/` should be git-ignored, nor how to treat a generated `content.js`. Proposed edit: specify a root `.gitignore` for `out/` and `snapshots/`.

No external docs were consulted; no skill gap needed an online lookup.

## Tool issues and fixes
- `npx hyperframes init .` into an existing empty directory worked first time. GSAP vendored from jsdelivr with the documented curl command.
- `check` passed with 0 errors; one layout `info` for the sweep overflowing its clipping container (intended).
- Fonts: `font-family: Inter` auto-resolved (11 faces fetched once from Google Fonts, then cached). Inter Tight/Display are not what ran; the style names Inter Display/Tight, I used plain Inter 700 with -0.04em tracking.
- Git Bash heredocs with `<<'EOF'` followed by long multi-line content failed with "unexpected EOF" in this environment; files were written with the Write tool instead.
- `snapshot` output pollutes the project folder; removed.

## Honest self-assessment
Looks like the described style in structure: pure black stage, centered heavy Inter headlines with tight tracking, one gradient word, calm settle animations, CSS-drawn hero and device, long hold on the end card. A motion designer would criticize: (1) the app window and phone are low-contrast dark-on-black with placeholder bars, so the "hero" feels underpowered next to real Apple product shots (no depth, no bevel, no reflection); (2) the window is not shown in the "Quieter." beat, so the product and the claims never share a shot and the story is a slideshow of cards; (3) the 0.2 s counter ticks through tenths with a lonely small unit; (4) every scene fades to black on the same 6-frame dip, which gets repetitive; (5) the wrapper micro-scale of 3% over 2-3 s is barely perceptible, so the "frozen" warning is arguably accurate for the type cards; (6) no audio at all (per brief), so the pacing relies purely on cuts. Not verified: no frame-by-frame check of the sweep or the counter beyond the 12-frame sheet and 9 stills.
