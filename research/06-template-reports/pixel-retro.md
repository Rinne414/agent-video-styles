# Template report: pixel-retro (Morning Quest)

## Result
- `templates/pixel-retro/out/pixel-retro.mp4`: 18.00 s, 1080x1920, 30 fps, h264, silent, 540 frames, 6.3 MB.
- Render time 40.1 s (51.7 s wall incl. npx start; setup 7.9 s, capture 23 s, encode 5.6 s). Full renders: 1 (budget 3). Stills: 3 snapshot rounds.
- Preview: `previews/pixel-retro.mp4` (3.5 MB) + `previews/pixel-retro.webp`.
- inspect_video: no black, no still stretch, no warnings.

## Quality bar
- Every pixel on the 4x grid: PASS. Logical 270x480 canvas, integer coords, `image-rendering: pixelated`; zoomed crops show no half-pixels. Hero/clouds/cursor are drawn at 2x logical (8 output px), still on the grid.
- Only palette colors: PASS in engine output (snapshot PNGs: 0 off-palette pixels over 6 frames). The h264 MP4 itself contains thousands of in-between colors from chroma subsampling/compression, so this can only be verified on stills.
- Characters move in steps: PASS. Pose swaps, 2-frame-held hop table, integer jump table; no tweens on sprites.
- Events within 1 frame of a beat: PASS by construction (title drops 15/30, quest completes at 150/285/390 = beats, LV UP at 450, cuts at 90/210/330/450). Not measured against audio (silent).
- Text >= 32 px output, 7:1 in dialog: PASS. Smallest text is 8 logical = 32 px; white/yellow/silver on #1D2B53 are all above 9:1 (pending checklist items use silver, not lavender, after the first still showed ~4:1).
- CRT does not hurt legibility: N/A, CRT left off (`content.json` `crt`) to keep the palette pure; overlay implemented but not rendered.

## Skill gaps
1. `references/tools/hyperframes.md` "Windows pitfalls" says heredocs with several long files fail; I hit it anyway (three files silently written empty/truncated, `src/main.js` was 0 bytes). Propose moving that warning into "Minimal project" as a rule: "write every source file with the editor/Write tool, never with a heredoc in Bash".
2. `styles/pixel-retro.md` Font row: nothing on how to get palette-pure text. Canvas `fillText` at 8 px, even with `imageSmoothingEnabled=false`, gave mangled glyphs (W/R/K corrupted) after alpha thresholding because of sub-pixel baseline offsets. Fix that worked: rasterise at 8x, sample the centre of each font pixel. Propose adding this snippet (about 15 lines) under Look/Font, plus "use `@fontsource/press-start-2p` woff2 vendored to `fonts/`".
3. `pixel-retro.md` has no sprite-size guidance for a 270-wide canvas: 32x32 at 1x is only 12% of the width on a vertical frame. Propose: "draw the hero at 32x32 scaled 2x logical (64 logical = 256 px) and say that clouds/props may use 2x too", and give a procedural sprite-from-rects + auto 1 px outline recipe (my `heroSprite`), since hand-writing 32x32 string grids per pose is slow.
4. `pixel-retro.md` Structure only covers a 30 s MV. Needs a short "PSA / quest" structure (title, N task beats of 8 beats each, level-up outro) and a default for 15-frame beat grids at other lengths; I invented 90 + 3x120 + 90.
5. Vertical safe areas: the style says nothing; I used y 56-380 of 480 logical. Propose adding "keep text between logical y 56 and 380 (platform UI)" to the Look table; it leaves the bottom quarter as filler ground.
6. `hyperframes.md` Check: `canvas_content_at_edge` warning on a full-bleed canvas is expected for this style; mention it next to the existing note. Also the doc does not say that `snapshot --at` overwrites and adds an extra last frame (it does mention the latter); `rm -rf snapshots` is blocked in some sandboxes, so "snapshots are overwritten per run" is useful.
7. `hyperframes.md` has no pattern for a canvas-driven whole-video template with content.json; the build.mjs pattern shown targets DOM scenes. Propose a 10-line canvas variant (GSAP proxy tween `onUpdate` -> `draw(Math.round(t*fps))`, scripts concatenated inline by build.mjs). I used it; it worked first try.
8. `inspect_video.py` cannot check the palette rule; propose an optional `--palette hexlist` check on extracted frames (would need to be run on lossless stills, so maybe document the snapshot-PNG approach instead).

## Tool issues and fixes
- Bash heredoc truncation (above); fixed by using the Write tool.
- `pnpm install` inside the repo works with `--ignore-workspace` (no workspace file exists, root has its own package.json; plain install also fine).
- `init` in a scratch folder (`out/scratch`) was only needed to obtain `hyperframes.json`; `meta.json` written by hand.
- Fonts: `@font-face` with a local woff2 passed `check` with no `font_family_without_font_face` error; Press Start 2P loaded with no network.
- `rm -rf` is denied by the harness, so stale snapshots were overwritten instead of deleted.

## Honest self-assessment
It reads as the pixel-retro style: PICO-8 palette, dithered sky bands, parallax hills, chunky outlined hero, RPG dialog boxes, typewriter text, stepped hops, dither dissolves, shake + flash on the level-up, beat pips. It is clearly a PSA rather than a music video. What a motion designer would criticize: the hero is a single static-scale sprite with only ~12 poses and stiff Bresenham arms (no walk cycle, no real drink animation: the cup just rises); the bottom quarter is empty dirt (forced by safe areas, but still dead space); sun and clouds are minimal; transitions are the same black dither every time; there is no screen-space "beat" feel beyond pips and hops because it is silent; the 2x hero next to 1x text/background mixes pixel densities; the 120 BPM grid is implied only. Layout was checked at stills and a 12-frame sheet, not frame by frame, and the shake offsets were checked in code, not visually.
