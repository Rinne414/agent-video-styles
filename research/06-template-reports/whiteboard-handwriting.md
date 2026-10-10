# Template report: whiteboard-handwriting

## Result

- Delivered: `templates/whiteboard-handwriting/` (HyperFrames + GSAP, `content.json`, `STORYBOARD.md`, `README.md`, `scripts/build.mjs`), `out/whiteboard-handwriting.mp4` (1920x1080, 30 fps, 32.54 s, h264 + aac), `previews/whiteboard-handwriting.mp4` (1.06 MB) and `.webp` (poster at 26.7 s, full board).
- Full renders used: 1 of 3 (53.6 s, 5 workers, hardware GPU). Stills: 3 snapshot rounds (about 20 frames) before the render.
- `inspect_video.py`: OK, no edge-band warning, black 0.00 s, longest still stretch 2.53 s at 30.03 s (the intended end-card hold). Audio mean -22.0 dB, max -1.9 dB.
- `hyperframes check`: 0 errors, 1 warning (`nested_structure_needs_subcomposition`, harmless per the tool doc).
- The recipe was strong enough for the look (centerline lettering, write-on, pen sprite, eraser, camera drift all work) but NOT for the pacing numbers: pen speeds had to be raised about 3x and per-stroke overheads dropped. It also never says where to get centerline lettering. See gaps 1-3.

## Quality bar

| Item | Verdict | Evidence |
|---|---|---|
| No ink by fade; every mark is a drawn path | PASS | Every mark is a `<path pathLength=1>` driven by dashoffset 1 -> 0; paths are `display:none` before their start frame. Sheet frames at 4.1, 12.2, 17.7, 25.8 s show half-drawn strokes with the pen on the tip. |
| Every glyph recognizable | PASS | Frames at 14.2 and 26.5 s (full res): "Year 1", "$100", "+10%", "interest on interest!", "$4,526", "30 yrs" all legible. The font is Hershey Simplex, so it reads as clean block print more than handwriting. |
| Doodles recognizable, one subject each, <= 25 segments | PASS with caveat | Coins with amounts and arrows read instantly. The snowball (3 growing circles on a hill with speed lines) is only moderately recognizable; at 26.5 s it reads as "circles on a slope". Bars with hatching read as bars. Longest doodle has 6 strokes. |
| Ink contrast >= 4.5:1 | PASS | Computed against #FAFAF7: ink 15.7, blue 5.8, red 5.4, green 4.8. (The recipe states 6.2 / 5.6 / 5.3 for these hexes; slightly high, see gap 6.) |
| One zone drawing at a time; ink finishes before the sentence ends | PASS | `build.mjs` report (ink end vs last-word end): hook 2.51 vs 2.54 s, year1 7.49 vs 8.90, year2 14.88 vs 15.42, snowball 21.12 vs 21.55, early 27.18 vs 27.45, end 30.05 vs 30.35. Zones are sequential by construction. |
| Inside the 80 px safe area, zones do not overlap | PASS | Build-time bbox of all strokes under the camera peak (1.02x about each zone centre): x 81..1832, y 82..968 (limits 80..1840, 80..1000). Needed a 30 px inner pad per zone and a 1.02 peak instead of 1.03 (gap 4). Frames show no overlap. |
| Wobble seeded, two renders identical | PARTIAL | `index.html` is byte-identical across rebuilds (SHA-256 f486faf1...); wobble and baseline jitter come from mulberry32(7). I did NOT render twice (budget), so frame identity of two MP4s is unverified. |
| Fonts/paths vendored, nothing fetched at render | PASS | Lettering paths are baked from `assets/hershey-futural.json` (7.5 KB), GSAP is in `vendor/`, audio is local; no web fonts. |
| End card settled and held >= 1.5 s | PASS | Ink settles at 30.05 s, video ends at 32.54 s: 2.49 s hold; `inspect_video.py` reports the 2.53 s still stretch at 30.03 s. Sheet frame at 31.2 s shows "Start early!" with underline and sparks. |

Also seen on the sheet: narration present (aac, -22 dB mean), camera drift, eraser sweeps (hook gone by 12.2 s, board cleared before the end card at 28.5 s). No captions (the brief did not ask; the ink is the text).

## Skill gaps

1. `references/styles/whiteboard-handwriting.md`, Look ("single-stroke centerline paths (a Hershey-style single-line font...)"): no source is named. Missing: `npm pack hersheytext@2.0.0` (MIT) gives `hersheytext.json` with a `futural` font; `chars[i]` is ASCII 33+i, `d` is an SVG-like `M x,y L ...` string, `o` is the HALF advance, glyph y is top-down with cap top at y=1 and baseline at y=22, and space is not included. I had to discover all of that. Proposed edit: add a "Lettering source" paragraph with the package, version, those facts and the layout formula (scale = size / 28, cap height = 0.75 x size, advance = 2 x o, space = 16 units).
2. Same file, Motion grammar: the pen speeds do not fit the Structure table. 900 px/s lettering with 4-frame lifts and 4-frame ramps made the hook alone take 25 s. Hershey strokes average about 100 px, so per-stroke overhead (ramp + lift) dominates: 36 strokes x 8 frames = 9.6 s for a 23-character question. The Structure row "Hook 0-150, about 90 frames of writing" fits roughly 11 characters at 96 px. What worked in this render: lettering 3000 px/s with ramp 0, lift 0 and fractional-frame stroke durations (no per-stroke minimum); doodles 1800 px/s, ramp 2, lift 2; arrows 1200 px/s; word gap 4 frames; underline delay 4 frames. Proposed edit: replace the fixed speeds with "size the ink to the narration: lettering about 3000 px/s without per-stroke ramps (ease only doodle and arrow strokes); budget about 110 px of path per character at 96 px and 70 px at 56 px", and state that a 30 s piece fits about 25 characters of 96 px lettering plus 4 doodle blocks.
3. Same file, Structure: "30 s keeps 2 concept zones at 300 frames" does not match a 30 s explainer with 3-4 ideas, and nothing says where a hook or recap goes when the 2x2 grid fills the whole safe area (2 x 400 + 80 = 880 of 920 px high). Proposed edit: add a worked 30 s table (hook alone on an empty board, eraser sweep, 4 zones one per narration sentence, eraser sweep, end card), which is what I built, and say that the eraser sweep between phases is the intended mechanism.
4. Same file, Look/Layout vs Motion grammar/Camera: the 80 px safe area and the 1.00 -> 1.03 camera conflict. A 3% zoom about the active zone centre pushes far-zone ink 40+ px outside the safe area (computed x 37..1881 at 1.03). Fix used: 30 px inner pad per zone, peak 1.02, scale 1 -> 1.02 -> 1 (sine) inside each block so zone changes have no jump. Proposed edit: specify the zoom that way, or zoom only the active zone's group.
5. Same file, Lettering: label size is unspecified (only headings 96 and body 56). I used 72 px for zone labels (a 96 px label leaves no room for a 220 px doodle in a 400 px zone). Also no guidance on text inside a coin: at 56 px "$100" is 160 px wide because Hershey advances are wide, so coins needed r >= 90. Proposed edit: add `label 72 px` and "Hershey width is about 0.64 x size per character".
6. Same file, Look: accent contrast numbers (6.2 / 5.6 / 5.3) are 0.2-0.5 too high against #FAFAF7; measured 5.8 / 5.4 / 4.8. All pass 4.5, but green is close.
7. `references/tools/hyperframes.md`: (a) `init` is not needed at all: a folder with only `index.html` + `package.json` passes `check` and `render` (no `hyperframes.json` / `meta.json`), which removes the "delete AGENTS.md/CLAUDE.md" step; say so. (b) The proxy-tween driver paragraph should say to call the render function once at load (I call `renderBoard(0)`), so the paused first frame is correct for `check`. (c) clipPath rect attributes updated from `onUpdate` work in the render (used for the eraser reveal); a verified pattern worth documenting.
8. `SKILL.md` Scripts table / `scripts/make_preview.py`: `--poster-at` takes a FRACTION (0-1), not seconds; nothing documents this and the error only shows at run time. Proposed edit: document it (`--poster-at 0.82`).
9. `SKILL.md` Pick a style: whiteboard-handwriting is not in the catalog table or aliases ("whiteboard", "handwriting", "Khan-style" map to nothing), so a cold agent would not find it from a brief; the style file exists only under `references/styles/`. Proposed edit: add the row and aliases when the style is promoted.
10. `references/audio-tts-captions.md`, Hitting a target length: `duration_ms` includes 0.7-0.8 s of trailing silence per segment (6 segments = 4.8 s of the 30 s). For a whiteboard that silence is useful (the eraser sweep happens in it); say "do not add extra gaps for transitions, use the trailing silence".

## Tool issues

- HyperFrames 0.8.143: `snapshot` still prints "Describing frames with Gemini" and writes `descriptions.md`; `snapshots/` is created in the project root (I moved it to `out/snapshots-scratch`). `render` used screenshot capture with 5 workers (about 29 s capture for 977 frames); no frame-verification warnings.
- `nested_structure_needs_subcomposition` warning on the single scene section containing the SVG (harmless).
- `inspect_video.py` flagged only the 2.53 s still stretch at the end card (expected); no edge-band warning at 1920x1080.
- The harness blocked `rm -rf` in this run, so scratch dirs (`out/tmp`, `out/snapshots-scratch`, `out/lens.mjs`, two PNGs) remain under `out/` (git-ignored).

## Honest self-assessment

- Does it look like the style? Mostly: cream board, marker-tray strip, single-stroke ink that draws itself under a pen sprite, accent underlines, circled emphasis, eraser sweeps and gentle camera drift are all visible in the sheet. It looks more like clean block print than loose handwriting: Hershey Simplex has wide, uniform letters and the 1.2 px wobble is nearly invisible. A script-style Hershey font (`scripts` / `cursive`) or more wobble would help; I did not try them. The snowball is the weakest drawing. A real whiteboard video would also use a hand sprite and richer icons.
- Pacing is very fast: lettering at about 3000 px/s makes words appear in 0.1-0.3 s. It reads as quick writing rather than a slow reveal, forced by 30 s of narration against about 100 px of path per character.
- Is the recipe strong enough to reuse? The architecture (build script -> static SVG paths -> one proxy-tween driver, narration as clock, a build-time "ink late" report) is reusable and worked on the first render. Without the fixes in gaps 1-4 an agent would stumble: no font source, speeds that make ink 3x too slow, no room for a hook in the layout, and a camera that breaks the safe area. With them I expect it to be reproducible. Verdict: thin on practical numbers but viable; keep it experimental until gaps 1-3 are folded in.
- Unverified: frame-identical double render (one render only), non-English lettering (Hershey covers ASCII only; CJK needs another centerline source), the 1080x1080 cut.
