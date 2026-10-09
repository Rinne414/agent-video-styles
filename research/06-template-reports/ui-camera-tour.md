# Template report: ui-camera-tour (Ledgerly product tour)

## Result

- `templates/ui-camera-tour/out/ui-camera-tour.mp4`: 1920x1080, 30 fps, 1050 frames, 35.00 s, h264 yuv420p, 5.45 MB, silent.
- Render time: 13 min 18 s for the single full render (machine shared with other agents; ~20 motion-blur samples on ~180 moving frames). Number of full renders: 1 of 3. About 35 single-frame stills were used for iteration (about 8-10 s each).
- `inspect_video.py`: OK, no black frames. Longest still stretch 3.00 s at 32 s (the intentional outro hold).
- Preview: `previews/ui-camera-tour.mp4` (1.20 MB) and `.webp`.
- Remotion 4.0.534 (what `create-video` installs), exact-pinned. I scaffolded once in `out/scratch` only to read its pinned versions, then wrote the project by hand.

## Quality bar

Frames viewed: stills f0-f1040 and the contact sheet, plus an ffmpeg tile of f152/154/157/160/655/659/750/990 from the final MP4.

| Item | Result | Reason |
|---|---|---|
| Every zoom target comes from measured coordinates | PASS | All targets are rects in `src/layout.ts` that the components also draw at (single source of truth). Caveat: "measured" here means shared constants, since the UI is built in code. |
| Text in focused UI is sharp at full zoom (2x source) | PASS | UI is vector DOM, so no raster limit. f330 and f420 stills show crisp 40 px text at z 2.3. |
| Each focus held >= 1 s before the next move | PASS | Shortest hold is 30 f (send shot f645-f675), the rest are 45-240 f. Verified from the camera table. |
| Cursor always visible, constant size, never jumps | PASS with caveat | Counter-scaled by 1/z, 48 px in every shot; seen in every viewed frame. It fades out on purpose in the outro. At the two hard cuts the cursor stays in the same world position, so it does not "teleport", but I had to place it near each cut target beforehand. |
| UI responds to every click within 4 frames | PASS | New invoice click f154, page crossfade starts f157 (+3), visible at f160; client/field focus ring +2; Send click f655, button "Sent" and chip f659 (+4, tile verified). Weakest: the New invoice button has no visible press state at f154 because the spotlight overlay covers it. |
| Outro settled by the deadline and held | PASS | Lockup springs finish by f975, settled by f990 (style says 1140 of 1200, scaled to 997), then 60 frames held (2 s). f990 and f1040 viewed. |

Other checks: beats at 120 BPM (15 f); cuts at f300 and f645 and all camera arrivals are multiples of 15. Text never clipped in the viewed stills. Contrast: dark ink on #10B981 (see gap 3).

## Skill gaps

1. `references/styles/ui-camera-tour.md`, Motion grammar "Motion blur": `CameraMotionBlur samples={6} shutterAngle={180}` is unusable for the 0.76 to 2.2 push. At f120 it renders as 6 distinct ghost copies of every text line. I needed `samples=20, shutterAngle=90` (still some ghosting at mid-move on the long Send-to-chip pan, so I lengthened that move to 3 beats). Proposed edit: replace with "samples 16-24, shutterAngle 90-120; check one mid-move still; for pans longer than ~800 px on screen use 45 frames; budget: each moving frame costs `samples` renders (full 35 s render took 13 min)". Also `remotion.md` should name `@remotion/motion-blur` and its install line (`pnpm add -E @remotion/motion-blur@<remotion version>`); it is not mentioned.
2. Same file, Motion grammar "Camera model" and Pitfalls: targets near a window edge (a top-right button, a header chip, a bottom Send button) leave a third of the frame as black backdrop if the target is centred. Missing: an `anchor` parameter (where in the frame the target lands, e.g. `[0.62, 0.38]`) and pose formula `cx = target.cx - (ax-0.5)*W/z`. I added it myself. Proposed: add one line "target lands at `anchor` (default centre); put targets near the window edge at 0.35-0.62 so the app fills the frame".
3. Same file, Look table "Callout pill": "white text on accent" fails contrast for #10B981 (about 2.5:1). I used a dark ink `#04261D` on the accent for pills and buttons. Proposed: "text colour = white if accent luminance < 0.4, else near-black accent ink; derive it in the theme".
4. Same file, Structure: no guidance for cuts vs the cursor. The style says "cut between flows" and "cursor never jumps", but a cursor in world space is only on screen if it already sits near the next target. Proposed: "Before each hard cut, move the cursor to the next target during the last 24 frames of the previous flow, click, then cut; keep the cursor inside the new shot's view in every frame". Also add a worked frame budget table in beats for a 35 s / 120 BPM brief (mine: establish 0-105, flow 1 to 300, flow 2 to 645, flow 3 to 900, outro to 1050), because the 40 s table does not divide onto the beat grid.
5. `references/tools/remotion.md`, Setup: the scaffold path costs a step ("scaffold, then delete lock, then copy pins"). Proposed: add a ready `package.json` snippet with the exact pins `react 19.2.3, react-dom 19.2.3, @types/react 19.2.7, @types/web 0.0.166, typescript 5.9.3` and a tsconfig; I took these from a scaffold. Also `remotion still` needs `--image-format=png` only for stills if config is png; the doc's "jpeg" note is fine, but state that `Config.setVideoImageFormat("png")` is required for yuv420p, which I verified (output is yuv420p).
6. `SKILL.md` step 4/5: there is no recipe for "build a UI mock in code when no screenshots exist" even though the brief expects it. Proposed: add 5 lines to the style file: build the window as absolutely positioned DOM at 1440x900 design pixels, keep all rects in one layout module used by both components and camera, give every state a pure `f(frame)` function, type with a per-character schedule. This is what made the 35 s template build in one pass.
7. `SKILL.md` step 7: `inspect_video.py` reports "still: 16.43 s total" for a tour that is mostly holds with small cursor/typing motion. The warning needs a threshold hint for this style ("expected 40-50 % still for ui-camera-tour"), otherwise it reads as a failure.
8. Online lookups: none were needed.

## Tool issues and fixes

- Git Bash heredoc: a long here-doc containing a quoted Python block failed with an EOF error; switched to the Write tool for source files.
- `Monitor`/background: `cmd &` inside a `run_in_background` call returns "completed" immediately while the render keeps running; wait on the log file instead (tail `out/render1.log` for "real").
- Remotion `interpolate` throws on a descending inputRange (`[1, 0.3]`); use ascending ranges and flip the output.
- Remotion prints "Rendered x/y" per tab many times; the log file is large. Use `tr '\r' '\n' | tail`.
- `rm -rf` was denied by the harness, so the scaffold scratch folder `out/scratch` remains (git-ignored, contains `node_modules`; safe to delete).
- No MAX_PATH problem even in this deep path (browser was already cached by an earlier template).

## Honest self-assessment

Does it match the style description? Mostly yes: real in-world camera on one container, 2.5D tilt that flattens, eased arced cursor with counter-scale, ripple and press, spotlight with accent ring, callout pills with a pointer line, typing with 2 f/char and a space pause, hard cuts on the beat, continuous camera inside flows, outro with lockup at 30% UI. The UI is a fictional mock and is clean but generic (sidebar plus cards plus table), which is what the style asks for but not distinctive.

What a motion designer would criticise:
- Motion blur is strong at peak velocity and slightly stroby on the long pan (f690-f720); a ramped shutter or longer move would be better.
- Parallax is only on the backdrop glow (0.6x). Callouts do not use the 1.3x parallax from the style; they are locked to their target.
- The New invoice button has no visible press feedback during the spotlight; the spotlight outline looks like a white halo because the cut-out reveals the app background.
- Callout 1 and 2 are on screen only about 1.5-2 s each; fine to read but brisk. The "Sent" to "Paid" gap is 2.5 s, not literally "a beat".
- The outro lockup sits over a dimmed but still busy UI even with a scrim, and the tilt does not return in the outro.
- Silent, so the click/typing/whoosh SFX in the Audio section were not exercised; nothing on screen leaves room for them to be added except via the cursor and typing event times in `src/timeline.ts`.
