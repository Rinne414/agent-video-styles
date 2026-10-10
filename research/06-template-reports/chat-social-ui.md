# Template report: chat-social-ui

## Result

Built from the skill alone (SKILL.md, styles/chat-social-ui.md, tools/hyperframes.md, templates/README.md). HyperFrames 0.8.143 + GSAP 3.14.2, composed 1088x1920, cropped to 1080x1920, 30 fps, 20.00 s, silent.
- `templates/chat-social-ui/` (content.json, STORYBOARD.md, README.md, scripts/, generated index.html)
- `templates/chat-social-ui/out/chat-social-ui.mp4`: 600 frames, 1080x1920; `inspect_video.py` printed OK, no black, no still stretch, no edge-band warning
- `previews/chat-social-ui.mp4` (0.39 MB) and `.webp` (poster at 0.72 = 14.4 s, full thread with heart reaction)
- Full renders used: 1 (38 s render + crop). Stills: one snapshot pass of 8 frames.

## Quality bar

- Every incoming bubble preceded by typing indicator of computed length: PASS. Frames 4.2 s and 9.2 s show the dot pill; lengths 27 f and 54 f from `clamp(1.5 x chars, 27, 78)`.
- Sent bubble text >= 4.5:1: PASS. `#FFFFFF` on `#0066E0` = 5.3:1; `hyperframes check` reported 47/47 text checks pass.
- Nothing in top 220 / bottom 300 except header and input bar: PASS. Header sits 220-370, input bar 1506-1594; sheet frames show empty bands (post card also stays within 540-1300).
- Bubble text >= 40 px and readable long enough: PASS for size (44 px). Read time: the 2-line fix bubble stays 4.2 s before the next sent message lands; the shortest, "what does it say?", is read for about 2.3 s. PASS.
- Heights deterministic, no clipped text: PASS. `lines` arrays set height; no DOM measuring for layout (caret width is measured once at load, before the timeline). Frames show no overflow.
- No frame holds still > 1 s except end card: PASS (inspect: longest still 0.00 s; camera drift on both scenes).
- Final card settled by frame 840 (scaled: 90% = f540) and held >= 1.5 s: PASS. Settled f523 (87%), held 2.57 s.
- Fonts verified in a still: PASS. Inter 400-700 vendored from `@fontsource/inter@5.3.0`, `@font-face` declared; sheet glyphs are Inter (single-storey-free, tabular numerals in counters), no Arial fallback.
- Sound items: N/A (silent).

## Skill gaps

1. `references/styles/chat-social-ui.md` > Structure / Motion grammar: the cadence rules sum to far more than a 20 s budget. Reply delay (up to 45) + typing (27-78) + read time + 2 f/char typing for sent messages made a 6-message draft end at f490+ and push the post card past 90%. Missing: a budget formula or "messages per second of video" table for short cuts, plus guidance to keep sent messages under about 25 characters. Proposed: add "20 s = 5 messages (3 sent, 2 received), sent text <= 28 chars, received <= 36" and a note that the like-counter end card needs about 3.5 s.
2. `styles/chat-social-ui.md` > Structure: the table is for 30 s and gives no card/cutaway frame budget; proposed "cutaway: chat fade 10 f, card enters 4 f before the fade ends, likes start +8, comment +32, settled by 90%".
3. `styles/chat-social-ui.md` > Look/Motion: no guidance on bottom-anchored vs top-anchored threads or how to compute thread push positions. I used a bottom-anchored container and cumulative slot heights (bubble h + 16 + receipt 40). Proposed: add this layout rule and the receipt height. With only 5 messages the area between y 370 and ~800 stays empty; the recipe should say whether to pad it (a pinned "Today" label, a larger first message) or accept it.
4. `styles/chat-social-ui.md` > Motion grammar "Reactions ... thread nudges 8 px apart" and "pill morphs into the bubble" are underspecified; I implemented the pill as a 4 f fade while the bubble springs in and skipped the nudge. Proposed: give the morph spec (pill scales into bubble bbox) or drop it.
5. `tools/hyperframes.md` > Check: a `getBoundingClientRect` call inside a timeline `onUpdate` triggers lint `gsap_callback_dom_measurement`. Missing: say "measure prefix widths once at load, before registering the timeline". Also say `data-layout-allow-overflow` is needed on a tall scrolling container (`escaped_container`).
6. `tools/hyperframes.md` > Setup: the `init` scaffold's `package.json` uses `npx` scripts; for the template convention (exact pin, `@avs/<id>` name, `still` script) say to replace it with a `devDependencies` pin of `hyperframes` and give a `render` wrapper that does the 1088 crop. I wrote `scripts/render.mjs`; the doc only gives the bare ffmpeg line. Also note `pnpm exec hyperframes` works offline once installed.
7. Missing in the recipe: fonts. It says "vendor the woff2" but not that `@fontsource/inter` ships `inter-latin-<w>-normal.woff2` (works, copied by build) and that Inter's auto-resolve needs network the first time.
8. `styles/chat-social-ui.md` > Look: the post card is only described in the "social-feed" variant and Motion grammar; no tokens for the headline ("Shipped." size), stats row, or heart color. I chose 104 px/700, 32 px stats, accent `#FF5C7A`. Proposed: add a "post card" row to the Look table.

## Tool issues

- `snapshot` appends a duplicate last frame (19.4 s) as documented; it also tried the Gemini describer (harmless).
- `hyperframes check` gives `nested_structure_needs_subcomposition` warnings for any scene with children; the docs mention it, harmless.
- Node 25 prints `DEP0190` when `execFileSync` uses `shell: true` for `pnpm` on Windows (cosmetic).
- Render with 5 workers: 38 s for 600 frames while other renders ran; faster than the docs' estimate for 1080x1920.

## Honest self-assessment

- Does it look like the style? Mostly. The mechanics (indicator, push, receipts, tapback, input-bar typing, counter card) read as a chat story and the dark theme works for a 2 a.m. premise. It looks like a generic messaging UI, which the recipe wants. Weaknesses: with 5 bubbles the upper third of the screen is empty; the tapback chip slightly touches the bubble above; the post card is plain (no verified badge, no image) and sits a little high.
- Is the recipe strong enough for others? Mostly yes for the look tokens, which I could apply directly (colors, 44 px text, radii, header/input geometry, cadence formulas). It is weak on budgeting and layout (gaps 1-3, 8): an agent has to discover that the cadence formulas overflow short videos and design the schedule and thread-push math itself. With those additions it would be reusable; the schedule script here (`scripts/schedule.mjs`) could be a reference snippet.
- Unverified: motion quality between sheet frames (I viewed 12 sheet frames and 8 stills, not the playback); the nudge and morph were not built.
