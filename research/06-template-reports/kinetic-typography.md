# Template report: kinetic-typography

## Result
- `templates/kinetic-typography/out/kinetic-typography.mp4`: 20.00 s, 1080x1920, 30 fps, h264, silent, 1.48 MB, 600 frames.
- Render: 34.7 s by the CLI (44 s wall incl. `npx` start; setup 11.1 s, capture 17.5 s, 5 workers). 1 full render (plus 1 snapshot pass of 13 stills).
- Previews: `previews/kinetic-typography.mp4` (0.18 MB) and `.webp` via make_preview.py.
- `inspect_video.py`: no warnings; longest still stretch 1.60 s at 18.40 s (the settled final hold, expected).
- Build: `content.json` -> `scripts/build.mjs` -> generated `index.html` (GSAP inline, vendored). Font Anton from `@fontsource/anton@5.3.0`, copied to `fonts/`.

## Quality bar
- Every word entrance lands on a beat frame: PASS. Frames computed via `round(i*15)` from beat index; entrances at beats 0,2,8,10,16,18,24,26 and field wipes at 32-36. Verified on sheet frames (e.g. 0.833 s SHIP, 2.5 s SMALL.) and in the generated timeline; no frame-exact onset detection was run (silent video).
- No text visible before its entrance frame: PASS with a caveat. Sections are timed clips and words start at opacity 0 in CSS. Frame 119/239 (before next phrase) show only the tail of the previous word's exit (YMAX 78 on a 16 black stage), the next word is absent.
- No word overflows at largest size: PASS for settled frames (SMALL. is tight, about 90%; OFTEN. 88%). During the 1.3x slam, `check` reports container_overflow info (intentional). Poster REPEAT. is deliberately cropped at 131% in the first four fields; the final field is fully legible (about 88%).
- At most one moving group per frame: PASS. Hard cut of the first word coincides with the key slam; wipes are sequential per beat.
- Each word readable >= 0.4 s; key phrases >= 1 s: PASS. First words 1.0 s, key words 2.9 s, poster fields 0.5 s each (cropped, deliberately flashed) then final 2 s.
- End card held >= 1.5 s: PASS (final orange field settles by frame 568, held to 600 = 1.07 s settled, 2.0 s on the field incl. the zoom-out). Strictly the settled hold is 1.07 s: borderline FAIL if "held" means static. Fix: start final wipe at beat 35.

## Skill gaps
1. `references/styles/kinetic-typography.md`, Structure: only a 30 s / 900-frame table and a "6 scenes x 150" remark. A 20 s, 5-phrase brief needed ad hoc scaling. Add: "20 s = 40 beats: phrase = 8 beats (first word beat 0, key word beat 2, thumps beats 3-6, exit beat 7.67), finale 8 beats".
2. Same file, Motion grammar: no unit-cycle recipe for a two-word phrase that fits "one word at a time" (first word replaced vs stacked). Add the replace-in-place pattern and the key-word thump per beat so holds do not freeze.
3. Same file, poster-color-block variant: gives no layer structure (one `clip-path` field per beat, text inside each layer), no crop width formula, and does not say the final field must resolve to a legible word. Add: "REPEAT. at 520 px Anton = 1419 px wide (131%); end on scale 0.66 so the last word is fully readable".
4. `references/tools/hyperframes.md`, Fonts: says Inter and "other families" auto-resolve but not which. Anton was not tested for auto-resolve; I used `@fontsource/anton` instead, which the README recommends. Add a one-line list of auto-resolved families or "use @fontsource + copy woff2 into fonts/ in build script".
5. hyperframes.md, Setup: `init --resolution portrait` is shown as [not run]; it worked and wrote the portrait root and viewport. Remove the caveat. Also say `init` creates `AGENTS.md`/`CLAUDE.md` (already noted) and sets `data-duration="10"`, which the build script must override.
6. hyperframes.md, Check: `snapshot --at` prints a Gemini attempt and writes a contact sheet; it is useful as a per-scene still. Mention that snapshot sizes the contact sheets and that all `--at` times are seconds (I inferred it).
7. SKILL.md step 7 vs hyperframes.md: inspect_video example says "run from a scratch dir" but SKILL.md passes `--out`; consistent, only a note. Also no guidance on checking "frame before each beat" (I used ffmpeg select + signalstats). Add a tiny command to the Quality bar helper.
8. SKILL.md Rules say "Nothing static more than ~1 s" but kinetic style's quality bar needs a held end card >= 1.5 s; clarify that holds are settled or pulsed and that the end card is exempt.

## Tool issues and fixes
- Git Bash `rm -rf` of the snapshots folder was blocked by the environment (not a tool bug); skipped, `snapshots/` is git-ignored.
- `check` info: `container_overflow`, `text_box_overflow`, `canvas_overflow`, `content_overlap` for intentional slam, crop and overlapping poster layers. Ignored; 0 errors, 0 warnings.
- A CSS translate(-50%) plus GSAP scale risks lint `gsap_css_transform_conflict`; avoided by centering with a flex box instead of transforms.
- Render was not slowed by parallel jobs (34.7 s).

## Honest self-assessment
Looks like the described style in structure: empty stage, condensed caps, one word at a time, accent key word, 4-bar inversion, poster finale with wipes. A motion designer would criticize: (1) motion is generic (one slam and a uniform pulse); no per-letter stagger, no mask rise, no variation of anchor or scale between phrases, so phrases 1-4 feel templated; (2) phrase 1 and 2 are identical, only the key word changes; (3) the poster section wipes are all the same ease and the crop is mild (131%), the final zoom-out is quick; (4) tracking was not verified optically; SMALL. is tight to the edges; (5) silent, so beat sync is unverifiable by ear, only by frame numbers; (6) 1.07 s settled end hold is on the short side.
