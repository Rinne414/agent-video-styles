# Template report: talking-head-overlay

Tool: Remotion 4.0.534 (what `create-video` installed, pinned exactly). Built from `skill/` only.

## Result

- `templates/talking-head-overlay/out/talking-head-overlay.mp4`: 1920x1080, 30 fps, 25.00 s, 750 frames, h264 `yuv420p`, 1.17 MB, silent.
- `templates/talking-head-overlay/out/talking-head-overlay.mov`: ProRes 4444, 750 frames, 63.3 MB, `ffprobe` shows `yuva444p12le`.
- Preview: `previews/talking-head-overlay.mp4` (0.21 MB) and `.webp`.
- Render time: composite mp4 51.6 s, overlay mov 33.5 s (other agents rendering in parallel). Stills about 8 s each.
- Full renders used: 2 of 3 (one mp4, one mov). 8 stills (frames 60, 120, 190, 330, 470, 520, 620, 740) viewed before rendering; no layout fix was needed after them.
- `inspect_video.py`: OK, no warnings; longest still stretch 2.80 s at 1.23 s (plate only, with a 4 px sway and a gradient drift). Contact sheet viewed.

## Quality bar

| Item | Result | Evidence |
|---|---|---|
| No overlay intersects the face-safe box on any frame | PASS | `scripts/check-face-safe.mjs` tests every overlay rect against `faceBox` (x 150-590, y 100-680): all ok. Sheet frames every ~2.1 s show every overlay clear of the dashed zone. The lower third sits on the chest, below the box. |
| Every overlay starts within 3 frames of its trigger word | N/A | Silent video, no words. Start frames come from the Structure table scaled to 25 s. |
| At most 2 overlays visible, never in a captions zone | PASS | Script asserts a maximum of 2; the actual maximum is 1 (sequential). No captions in this brief. |
| Lower third visible 3-5 s | PASS | Frames 24-159 = 4.5 s (sheet at 1.07 s, 3.13 s shows it, 5.23 s shows it exiting). |
| Only numbers actually spoken appear in callouts | N/A | No speech. 38% is from the brief. |
| Overlay-only export keeps alpha and was checked over a test background | PASS | `ffprobe` pix_fmt `yuva444p12le`; frame at 20.5 s has RGBA corner pixel `00 00 00 00`; composited over a flat amber background and viewed: only the callout card is drawn, no black fill. |

## Skill gaps

1. `references/styles/talking-head-overlay.md`, Look / Face-safe box: only a centered-speaker default (x 640-1280, y 120-760) is given. The brief had the speaker in the left third, and nothing says how to derive the box, how a lower third at the left margin relates to a torso (it overlaps the chest), or that the box covers head and shoulders only. Edit: add "For an off-center speaker, shift the box; the lower third may overlap the torso but never the head box; the box ends at the collar line, not the frame bottom." Also add a `check-face-safe` snippet: rects in `content.json` plus a 15-line node script (this template ships one).
2. Same file, Look: "Side panel (pip-split)" is a pip-split token, but the brief wants "numbered points in side panels". The Step numeral row gives type sizes but no container, position or exit. Edit: add a row "Step panel: `rgba(10,10,12,0.72)` card 740x260 on the empty side, numeral 160 px left, label 36 px right, 6 px accent edge, wipe from the empty-side edge in 12 frames". Also note the 36 px label looks small next to a 160 px numeral at 1080p; suggest 40-44 px.
3. Same file, Variants / overlay-only: `backdrop-filter` blur in the Lower third, Glass badge and panel tokens has nothing to sample in the transparent export, so the `.mov` has flat translucent fills while the composite has real blur. Edit: "In overlay-only output the glass blur is lost; raise fill alpha (0.72 to 0.82) or accept the difference, and tell the user."
4. Same file, Quality bar item 6: "checked over a test background" has no recipe. Edit: add the command `ffmpeg -f lavfi -i color=c=0xd8a838:s=1920x1080:r=30:d=25 -i overlay.mov -filter_complex "[0][1]overlay=format=auto,format=yuv420p" -ss 20 -frames:v 1 alphatest.png`. Also `inspect_video.py` probes only pix_fmt and would be useful with a `--bg` option for alpha files (not tried on the .mov).
5. Same file, Structure / Motion grammar: silent or no-transcript runs have no guidance (word pinning and "spoken numbers" are unusable). Edit: "No audio: place beats by the Structure table scaled to the length; mark the 'trigger word' rules N/A".
6. Same file, Structure: the table is for 60 s; for 25 s with 3 steps, a callout and a CTA there is no scaled example, so the agent had to compute the beat grid (this run: LT 24-159, steps 180-564, callout 576-681, CTA 696-750). Edit: add a 25 s example row set.
7. Brief vs Look: the user wrote "1. Measure first"; the style says numerals are "01". Edit: say "format step numerals as 01 unless the user's copy says otherwise".
8. `references/tools/remotion.md`, Render commands: the overlay variant needs `Config.setVideoImageFormat("png")` for both mp4 and mov in one project; the doc mentions png only as a flag or a slower option. Edit: in "Transparent", state "set png in remotion.config.ts for templates that export both; jpeg is the scaffold default and loses alpha".
9. `SKILL.md` step 5 / `templates/README.md`: nothing says that a template with two exports needs `render` to chain both commands, or that `out/` is git-ignored but the .mov is large (63 MB). Edit: one line in `templates/README.md` conventions.
10. No online lookups were needed.

## Tool issues and fixes

- Writing 10 files in one Bash heredoc batch failed with a quoting parse error and wrote nothing; switched to the Write tool per file. Not a skill issue.
- `remotion.md` lists the ProRes pixel format as `yuva444p10le`; ffprobe reports `yuva444p12le` for the output. The doc already says so, which is correct.
- `pnpm install` inside a repo that has a parent `package.json` worked (5 s). `remotion browser ensure` was not needed; the first still found a browser.
- CSS individual transform properties (`scale`, `translate`) and `clip-path` rendered correctly in Remotion's Chrome.

## Honest self-assessment

- It matches the style description in structure: lower third with accent stripe and wipe, glass pill, 160 px accent numerals, tabular count-up, leader line, placeholder plate, face kept clear, alpha export. The composite reads clearly.
- What a motion designer would criticize: the overlays are static boxes between their entrances, with little secondary motion (no icon animation, no shape morph between panels as the style suggests, no punch-in); the three step panels are separate pop-ins and not a continuous morphing shape; the label text at 36 px is small against the numeral; the data callout has no chart, only a number; all panels are plain dark rectangles with generic radius, so it looks like a competent template rather than a distinctive one; the plate is deliberately plain. No audio, so no pop or whoosh cues.
- Not verified: behavior over real footage (bright footage may need the readability scrim, which is not implemented), 29.97 fps sources, and the vertical-talk variant.
