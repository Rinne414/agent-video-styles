# Regression kt1: kinetic-typography, 15 s, 1080x1080, 100 BPM, silent

## Result
- Output: `regression/kt1/out/kt1.mp4`, 15.00 s, 1080x1080, 30 fps, 450 frames, h264 yuv420p, no audio, 0.79 MB. Sheet: `regression/kt1/out/sheet.png` (viewed).
- Copy: LESS / NOISE., MORE / SIGNAL., FEWER / MEETINGS., BETTER / WORK. Anton (vendored `@fontsource/anton@5.2.5`), one phrase at a time, 6 beats (108 frames) per phrase; the last phrase lands at beat 18 and holds to the end.
- Wall time: about 9 min from first command to final verification (including isolating the render bug below).
- Full renders: 3 (render 1 exposed a pre-reveal sliver, render 2 exposed an 8 px black stripe, render 3 = final at 1088 wide + crop). Plus 4 probe renders of 0.5 s to isolate the stripe (not counted as full).
- Still iterations: 3 `snapshot` runs (11 frames, then 3 frames, then 3 more) and 4 `check` runs; exact frames also pulled with ffmpeg for beat checks.

## Quality bar
- Every word entrance lands on a beat frame from the grid: PASS. Word 1 at frames 0/108/216/324, key word at 36/144/252/360. Frame 108/216/324 show the new stage with 0 text pixels, first text pixels at 109/217/325.
- No text visible before its entrance frame: PASS after fix. Render 1 showed a sliver of "MORE" at frame 108 (mask rise `yPercent 100` is not enough: Anton glyphs overflow a line-height 0.9 box). Fixed with `yPercent 135`. Final: frames 143==144 and 359==360 are pixel-identical (nothing before key entrance), frames 108/216/324 have 0 non-background pixels.
- No word overflows the frame at its largest size: PASS. Settled extents x 88..1005 (BETTER at 380 px, 86% of width); slam peak (scale 1.3, frame 361) x 58..1024, still inside 1080.
- At most one moving word group per frame: PASS. Exit runs in the 5 frames before the downbeat and ends on it; the next entrance starts on the downbeat; thumps only touch the key word while nothing else moves.
- Each word readable >= 0.4 s; key phrases >= 1 s: PASS. Word 1 alone for 1.2 s, full phrase on screen 2.4 s or more; last phrase held 4.2 s.
- End card held >= 1.5 s: PASS. Measured: last pixel change at frame 401, so 48 frames (1.6 s) fully motionless to the end (thumps at beats 21 and 22 only).
- Silent brief, beat sync by frame numbers only: PASS (noted; no audio stream).
- Extras: contrast PASS (`check` 6/6 after changing the last field from `#FF4D00` to `#2F5BFF`; white on orange measured 2.97:1). Font verified as Anton in stills (not an Arial fallback). `inspect_video.py`: 0 black seconds, longest still 1.60 s at 13.4 s (the end hold).

## Skill gaps
1. `references/tools/hyperframes.md` (Check, then render / Windows pitfalls): **a composition whose width is not a multiple of 16 renders with the right-most 8 px columns black** in the MP4. Reproduced with a minimal 1080x1080 composition, with `--resolution square`, and with `--no-browser-gpu`; `snapshot` PNGs are clean, only the MP4 is affected. It is invisible on dark stages (so the "verified 1080x1920" claim may have missed it) and obvious on light ones. Work-around that worked: compose 1088 wide with the art in the left 1080 px, render, then `ffmpeg -i in.mp4 -vf crop=1080:1080:0:0 -c:v libx264 -crf 14 -preset slow -pix_fmt yuv420p out.mp4`. Proposed edit: document this in the doc, plus add a right-edge black-column warning to `scripts/inspect_video.py` (it passed this defective render with "OK").
2. `references/styles/kinetic-typography.md` (Motion grammar, mask rise): "`yPercent 100 -> 0`" leaves glyph tops peeking at the entrance frame for Anton at line-height 0.9. Proposed: "start at yPercent 130-140".
3. Same file, Look/Palette: `#FF4D00` stage with white type is 2.97:1 and fails `check` (needs 3:1). Proposed: "on `#FF4D00` use `#0A0A0A` type; white type works on `#2F5BFF`".
4. Same file, Structure: no worked table for short, square, 100 BPM pieces (only 30 s / 20 s at 120 BPM). 100 BPM at 30 fps is 18 frames per beat. A 15 s / 4 phrase x 6 beat example (word 1 beat 0, key beat 2, thumps 3-5, exit 5.83, last phrase thumps only until beat 22 so the tail is still) would remove guesswork. Also the "End card held >= 1.5 s" item is ambiguous when there is no handle/logo: say that the final phrase counts and must be motionless (no thump) for its last 1.5 s.
5. `references/tools/hyperframes.md` (Setup): `init` writes `AGENTS.md` and `CLAUDE.md`; they are auto-loaded into the session and tell the agent to invoke other skills ("USE THESE FIRST"), which conflicts with the skill-only rule. The doc says to delete them but only in passing; make it step 1 of Setup, in bold, with the exact command (`rm -f AGENTS.md CLAUDE.md`).
6. `references/tools/hyperframes.md` (Windows pitfalls): `snapshot` with 6 or fewer frames writes `contact-sheet.jpg` (not `contact-sheet-1..2.jpg`); cosmetic. Also `snapshot` PNGs are not proof of the final MP4 (see gap 1): add "always check at least one frame of the MP4 itself" to Verify the output.
7. Fonts: the fontsource route works, and `npm pack @fontsource/anton@5.2.5` + `tar xzf` (no project install) is quicker; worth one line.

## Things the skill got right that saved time
- Beat-grid formula and the "compute from index" pitfall: no drift; 18-frame beats land exactly.
- The "pre-reveal" pitfall and "check the frame before each beat" quality item: exactly the bug class I hit with the mask sliver.
- Font route (vendored woff2 + `@font-face`) and the warning that a miss is silent.
- `check` contrast audit caught the white-on-orange failure; the `container_overflow` info on scaled blocks is a known false positive.
- Timing numbers (about 20-25 s per 15 s render) and the vertical/aspect recipe (data-width/height, viewport, html/body) were accurate.
- `inspect_video.py` contact sheet and "longest still" figure matched the intended end hold.

## Honest self-assessment
- Brief met: 15 s, 1080x1080, 30 fps, silent, four phrases in order, bold condensed Anton, last phrase holds, 100 BPM on an 18-frame grid. I looked at stills and the final sheet, and checked exact frames numerically.
- Weak points: the "TT" in BETTER fuses with the -0.02em token (visible seam), left as the style specifies. The 1088+crop path adds one extra lossy encode (CRF 14, so negligible). Color flips are hard cuts on the downbeat, not wipes. Only one accent color, and the final field is blue rather than the orange to keep contrast.
- Outside the skill: `hyperframes render --help` (to look for a width fix; logged as gap 1) and the `CLAUDE.md` that `init` generated, which I deleted and did not follow.
