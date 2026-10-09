# Template report: card-explainer

Brief: Chinese article "番茄工作法为什么有效", about 60 s, 1920x1080 30 fps, zh-CN-YunxiNeural narration plus captions, Bilibili style.

## Result

- Output: `templates/card-explainer/out/card-explainer.mp4`, 61.33 s, 1920x1080, 30 fps, h264 + aac (9.7 MB), 1840 frames.
- Render time: 43.3 s (`hyperframes render`, drawelement capture, hardware GPU, 3 workers).
- Full renders: 1 (stills via `snapshot` before it; no re-render needed).
- `inspect_video.py`: OK, black 0 s, frozen 11.43 s (expected: long hold stretches between slow-drift card changes; not a defect).
- Preview: `previews/card-explainer.mp4` (1.4 MB) + `.webp`.

## Quality bar

Frames viewed: 10 snapshot stills, one 1080p still, the 12-frame sheet.

- One idea per card; key sentences verbatim: PASS. Cards 2, 3, 4, 5 and 7 quote the article word for word (card 5 is the full sentence split over three lines). Connective narration ("先记住这句话", "再看休息", "回头看") is mine; card 4 left column ("没有终点 / 不知道做到哪里才算完") and the summary bullets are paraphrase/invented connective text.
- Captions max 2 lines, within budget: PASS. All 27 caption chunks are 1 line, 6-16 characters (longest "现在，就去开始你的第一个番茄吧", 15). Seen in sheet frames.
- Narration and card changes in sync within +-0.3 s: PASS by construction (card start = audio start - 0.25 s; phrases, highlights, count-up and bullets keyed to TTS word times). Not frame-measured against the audio waveform; checked in the sheet at 12.8 s (phrase 2 and caption agree) and 33.2 s (highlight mid-sweep on the spoken phrase).
- No card shorter than 3 s; at least 3 layouts: PASS. Shortest card 5.4 s; 7 layouts (title, key x3, bignumber, compare, tally, list, outro).
- Source attribution on title and outro cards: PASS (20 px, 50% opacity, bottom-left of the card; visible in full-size still and sheet frames 1 and 12, but very small).
- 9:16 version (no text under 48 px): N/A, not built. Kickers are 24 px by the style's own spec, so this item would fail for 9:16 unless the recipe says kickers are exempt.

Other style checks: card 1440x760 radius 28, shadow, accent `#F97316`, highlighter at 35% sweeping 12 frames, count-up 30 frames, drift 1.00 -> 1.02, exit 0.96 + fade 10 frames with 6-frame overlap, progress bar + "NN / 09" counter: all implemented. Icons: hand-drawn Lucide-like set, not Lucide itself.

## Skill gaps

1. `references/tools/hyperframes.md` > Fonts / Setup: it says a local `@font-face` file works, but not that `check` raises an ERROR (`missing_timeline_registry`, `invalid_parent_traversal_in_asset_path`) when the GSAP timeline lives in an external `<script src>` or when an external CSS file uses `../assets/...` paths. Fix needed: I inlined CSS and JS into `index.html` at build time and used root-relative paths. Proposed edit: add under "Rules that matter": "Keep the timeline script inline in index.html (an external script is not seen by the linter as registering `window.__timelines`); asset URLs must be root-relative (`assets/...`), including inside CSS."
2. `references/tools/hyperframes.md` > Audio and word-timed captions: the doc shows the `--variables-file` route and says to "generate `<audio>` tags from the same JSON with a small Node script [not run]". For a multi-card narrated video the working pattern is a build script that writes the whole `index.html` (audio tags, card markup, timings in `data-*` attributes) from content.json + timeline.json; no render variables needed. Proposed edit: replace the variables example with this "generate index.html from JSON" pattern and show a 20-line sample; note that generated markup must be static so lint sees every timed element.
3. `references/audio-tts-captions.md` > tts.py, Chinese: says to "rebuild display text from the original script and map by character count", but gives no recipe. Facts I found: word units keep internal spaces ("25 分钟"), punctuation is dropped, numerals are one unit. Proposed edit: add a ~25-line `charTimes()` snippet (walk the narration, match unit characters in order, interpolate within a unit, fill punctuation with the next time) and a rule for caption chunking (merge clauses under 6 characters, split over 16 at word-unit boundaries, never mid-word).
4. `references/styles/card-explainer.md` > Look/Type: "CJK: Noto Sans SC" with no size guidance. The 17.8 MB variable TTF is over the 2 MB repo limit in `templates/README.md`. I subset it with fonttools (GB2312 level-1, wght 400-800 instanced) to 1.2 MB woff2. Proposed edit: add the subset script (`pyftsubset`/fontTools: subset first, then `instancer`; the reverse order crashes with `KeyError: 'uni2517'`) to `hyperframes.md` Fonts, and say the `@fontsource` route is not practical for CJK (many unicode-range slices).
5. `references/styles/card-explainer.md` > Structure/Pacing: the 90 s table does not scale to 60 s, and an article of about 170 characters yields about 35 s of narration. The recipe should say how to reach the target length: add framing sentences (hook line, "先记住这句话", summary, outro) and use rate `+0%`; measure total = sum(segment duration + 10 frames) - 6 frames x overlaps before building. Also state the overlap model (next card starts 6 frames before the previous ends) as a timing formula; I chose audio lead 0.25 s myself.
6. `references/styles/card-explainer.md` > Look: "Card 1440x760 centered" leaves only 160 px below for 2-line captions at 48 px; ok for 1-line captions. Say explicitly where captions sit (y 944-1054 worked) and that card text must not extend below y 920.
7. `references/styles/card-explainer.md` > Look/Layouts: the five layouts lack concrete geometry for "compare" and "list" and no "tally" (the brief's "每完成一个番茄记一个记号" needed one). Proposed edit: add 1-line specs (compare: two columns with 28 px gap, left muted `#F3F4F6`, right accent-soft with 3 px accent border, "VS" disc; tally: 4 icons 170 px, tick drawn with stroke-dashoffset) and an icon note: Lucide is not vendored, so give 6 inline SVG icon paths or say "draw simple stroke icons".
8. `SKILL.md` > Workflow step 4/Deliver: "show the storyboard to the user" has no automated-run variant, and `templates/README.md` says the storyboard is in STORYBOARD.md; fine, but the skill does not say where the checkpoint belongs for unattended runs. Minor.
9. `hyperframes.md` > Check: `check` emits one `nested_structure_needs_subcomposition` warning per card section and `content_overlap` warnings for the intentional cross-fade of card counters; the doc mentions only the first. Add: "content_overlap during a deliberate cross-fade is expected; mark with data-layout-allow-overlap or ignore". `snapshot` also tries to call Gemini ("Describing frames with Gemini") when no key is set; harmless.
10. `hyperframes.md` > Timings: render of a 61 s 1080p30 video took 43 s here (about 0.7 s per second of video), far below the "~7 s per second" in "When to choose it" (Weak). Proposed edit: correct that figure; the 4 s reference timings are dominated by about 20 s fixed startup.

No online lookups were needed; no skill-external docs were consulted.

## Tool issues and fixes

- `check` ERROR `missing_timeline_registry` with an external `main.js`; fixed by inlining (gap 1).
- `check` ERROR `invalid_parent_traversal_in_asset_path` for `url("../assets/...")` in `src/style.css`; fixed with root-relative path + inlining.
- fontTools: `instancer` before `subset` raised `KeyError: 'uni2517'`; swapping the order worked.
- Git Bash heredoc with several long files failed once ("unexpected EOF"); wrote files with the editor tool instead.
- `snapshot` creates a numbered frame set whose last frame is the end of the composition (59.493 s) in addition to the requested times; harmless.

## Honest self-assessment

It matches the style description in structure: warm paper background, white 28 px cards with soft shadow, one orange accent, phrase-by-phrase key sentences with highlighter, count-up, tally, progress bar and counter, single-line captions synced to Edge TTS word times, clear card transitions. The Chinese text renders with the intended font in every frame I viewed (no tofu).

What a motion designer would criticize:
- Cards are sparse: text occupies the left half of a 1440x760 card on most layouts with large empty areas (cards 2, 5, 7). Illustration is only one tomato and a ring; there is no per-card imagery, so the "Bilibili knowledge video" richness is lower than the real thing.
- Card 7 shows only an icon and a small kicker for the first 2.3 s (narration "所以，真正的秘诀是" before the phrase is spoken); it reads as empty.
- Kicker (24 px) and attribution (20 px) are tiny at 1080p, as the recipe specifies, but nearly unreadable on mobile.
- Motion is uniform (same fade-up on everything); no audio design: no BGM and no page-turn SFX (the recipe suggests both; skipped because nothing redistributable is provided and the brief did not ask).
- The tomato is orange, so it reads as an orange or pumpkin at first glance; a red accent would suit the topic better but departs from the example accent.
- Narration is rate +0% Yunxi, slightly fast; captions have no active-word highlight.
- Frozen-frame stretch of 11 s is only the slow 2% drift; some viewers would call it static.
