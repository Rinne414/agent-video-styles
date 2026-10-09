# Template report: data-story-charts

Brief: ~35 s, 1920x1080, 30 fps data story "Northwind Coffee 2026 in numbers", fictional data labelled "Sample data", silent. Beats: KPI counter to 4.2M, monthly line chart (summer dip, December peak), top-5 ranking bars, closing insight "Oat milk now outsells dairy."

Knowledge source: `skill/SKILL.md`, `references/styles/data-story-charts.md`, `references/tools/remotion.md`, `templates/README.md`, plus `scripts/inspect_video.py` and `scripts/make_preview.py`. No online lookups were needed.

## Result

- Output: `templates/data-story-charts/out/data-story-charts.mp4`, 1920x1080, 30 fps, 1050 frames, 35.00 s, h264 `yuv420p`, 2.7 MB, no audio.
- Full renders: 1 (budget 3). Render time: 40.9 s wall (Remotion, rspack, PNG frames, default concurrency, other agents rendering in parallel).
- Stills rendered before the full render: 8 (frames 90, 300, 360, 560, 700 (unused), 1040, then 610 and 150 after fixes). Two layout problems were found and fixed from stills (clipped annotation, text too near the edge once the camera push applies).
- `inspect_video.py`: no warnings, black 0.00 s, longest still stretch 0.00 s.
- Previews: `previews/data-story-charts.mp4` (0.59 MB) and `previews/data-story-charts.webp` (17.7 KB).
- Project: Remotion 4.0.534 exact-pinned, `@fontsource/inter` pinned, `.npmrc save-exact=true`, package `@avs/data-story-charts`.

## Quality bar

Frames viewed: stills at 90, 300, 360, 610, 1040 and the 12-frame contact sheet.

| Item | Result | Reason |
|---|---|---|
| Every value on screen matches the dataset at its settled frame | PASS | Settled frames show 4.2M, line points drawn from `content.json` (peak 460K labelled on the Dec point, dip 280K on Aug), bars 28/22/17/12/9 %. The monthly series sums to 4,200K by construction. The "= 1.18M cups" annotation is derived (28% of 4.2M = 1.176M). |
| Units and source visible whenever a chart is visible | PASS | "Cups sold per month, thousands" and "Share of cups sold" subtitles; the source line "Sample data (fictional) ..." and a SAMPLE DATA tag are present on every frame of the contact sheet. |
| One highlight color; everything else neutral | PASS | Only `#22D3EE` is used as an accent. The Aug dip uses white text and a white dot, not a second color. |
| No overlapping labels; at most 12 bars or 4 lines per chart | PASS | One line, 12 points, 5 bars. The first ranking annotation was clipped at the right edge; fixed (shorter text, narrower bar scale) and re-checked in a still. |
| Numbers rounded, tabular, formatted | PASS | `font-variant-numeric: tabular-nums` on every number, % signs on bars, counter formatted with one decimal and the M suffix. Weak spot: values under 1,000 need no thousands separator, so the separator rule was not exercised. |
| Each insight holds >= 2 s after settling | PASS | Line chart settles by about frame 150 local of 300 (5 s hold); ranking settles by about 134 of 300 (5.5 s); hook settles at 69 of 150 (2.7 s); closing settles at about 100 of 300. |
| No overshoot on any data mark | PASS | Bars use `spring({damping: 200})` with `durationInFrames`; the counter and line use clamped ease curves. The contact sheet shows monotone growth (26, 19, 12, 6, 2 mid-growth). |

## Skill gaps

1. `references/styles/data-story-charts.md`, Structure and Audio sections. The table is written for 40 s and 3 insights, and the brief asked for 35 s, 2 charts and a text insight. There is no worked scaling rule and no beat for a text-only closing statement (the table has "Summary" with KPI cards and "Outro" with CTA). I merged summary and outro. Proposed edit: add "Scaling: keep Hook at 3-5 s, give each insight 8-11 s, merge Summary and Outro into one closing scene of 7-10 s for shorter cuts" and add a "closing insight" variant: headline 120-150 px, highlight on the key noun, 3 KPI cards under it.
2. `data-story-charts.md`, Look and Motion grammar (highlight rules). The "dim non-highlight series to 35%" rule assumes multiple series or bars. For a single line it does not say what to highlight. I kept the line, dimmed it, and kept the final segment plus an annotated end point at full strength. Proposed edit: add "Single-series line: dim the whole line to 35% and keep the highlighted segment or point at 100%; annotate at most one peak and one trough, the trough in neutral white."
3. `data-story-charts.md`, Look (Safe area) vs Motion grammar (Camera). A 1.00 -> 1.03 scale around the center pushes anything at the 80 px margin to about 51-65 px by the end of the scene, so the safe area is violated at the scene end. I only noticed this in a still. Proposed edit: "Because of the 1.03 push, lay scene content out with a 100 px margin (the 80 px safe area is measured at the end of the push), and keep the source line outside the scaled layer."
4. `data-story-charts.md`, Inputs and Pitfalls ("Never invent numbers"). The user brief explicitly asked to invent a series, and the skill gives no guidance. Proposed edit: "If the user asks for sample data: keep it internally consistent (parts sum to the headline), put the dataset in `content.json`, and show a 'Sample data' label on every scene, in the persistent source line plus a tag."
5. `data-story-charts.md`, Look token table. Sizes are for the chart-heavy case: labels 24-28 px and source 18-20 px at 50% opacity read as very small on a 1080p frame with only five bars, and 50% opacity gray on `#0B0D12` fails to feel legible once compressed. I used 32-40 px labels, 44 px values and 22 px source at 55%. Proposed edit: for ranking charts specify bar-name 36-40 px, value 44-56 px, bar height 64 px, row step 110 px, and allow axis/source text up to 22 px.
6. `data-story-charts.md`, no layout reference for the hook and closing KPI cards (card padding, value size, widths) and no tick-count guidance for the y-axis with domain 0-500 (the "4-5 lines max" rule produced 3 ticks here and a sparse lower half of the chart). Proposed edit: add a one-line layout example for each, e.g. "KPI card: padding 32 x 36, value 88 px 700, label 28 px 500 at 60%".
7. `skill/SKILL.md`, Workflow step 7 and Scripts table use `scripts/inspect_video.py`, which only works from `skill/`; from the repo root it is `skill/scripts/...`. Proposed edit: show the repo-root form, or say "paths are relative to the skill folder".
8. `references/tools/remotion.md`, Setup. It says "scaffold in a scratch dir and copy only index.ts, remotion.config.ts, tsconfig.json" but gives no ready package.json for a standalone template, and `remotion add` for `@remotion/media` is not needed for a silent video. I wrote the package.json by hand (exact pins from the scaffold output). Proposed edit: add a minimal copy-paste `package.json` for a template (name `@avs/<id>`, `render` and `still` scripts, exact versions) and note that `.npmrc save-exact=true` goes in the template folder.
9. `remotion.md`, Fonts recipe A. It does not mention that the CSS import path in TypeScript may need a `declare module "*.css"`; tsc passed for me with the declaration present, and I did not test without it. Proposed edit: say whether it is needed.

## Tool issues and fixes

- `npx create-video@latest --yes --blank --no-tailwind` took 42 s and installed with npm; I only used it to read the pinned versions (remotion 4.0.534, react 19.2.3, typescript 5.9.3) and never used its node_modules. `pnpm install` in the template folder then took 5 s and worked inside the repo that has a parent `package.json`.
- `tsc` flagged an unused constant (`noUnusedLocals`), fixed.
- One bash heredoc batch failed to parse (my own quoting, nothing to do with the tools) and I wrote the files with the Write tool instead.
- No Chrome path problems: the project path is short enough for the headless-shell path. No font fetching at render time.
- Static `scale: String(...)` CSS property on `AbsoluteFill` worked as the doc suggests.

## Honest self-assessment

It matches the written style description: dark `#0B0D12`, horizontal gridlines only, one cyan highlight, tabular hero number, direct labels instead of legends, axes-first drawing, critically damped bars, 1.03 camera push, persistent source line. It is a faithful but plain data story.

A motion designer would criticize:
- The hook and closing are static centered type with no supporting graphic; the first 5 s is a number and a caption. A faint monthly sparkline or rising-bar texture would add motion without adding clutter.
- The camera drift is barely visible and the scene changes are plain 8-frame fades, with no rhythm or sound design (silent by brief, so there is also nothing to cut on).
- The line chart leaves the lower half of the plot empty (axis from 0 with only 3 ticks); a truncated or area-filled treatment would use space better, at the cost of honesty.
- Dimmed rows at 35% opacity are very low in contrast on compressed video; they are readable on the contact sheet but close to the floor.
- Cards in the closing enter with generic fade-up, and the closing insight does not tie visually to the data (no oat-vs-dairy chart, because the brief gave no such numbers).
- I did not verify frame-by-frame the motion of the head dot and the annotation draw-in beyond the 12-frame contact sheet and the stills; the mid-growth frames in the sheet show monotone bars with no overshoot.
