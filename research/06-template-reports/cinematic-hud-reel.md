# Template report: cinematic-hud-reel

Brief: ~22 s, 1920x1080, 30 fps sizzle reel for the fictional studio Nova Labs. Lines "We build agents." / "They ship code." / "They never sleep." and a "NOVA LABS" logo lockup. Electric blue #3D7BFF on near-black, silent render, hits timed to 128 BPM. Tool: HyperFrames `hyperframes@0.8.143` + GSAP 3.14.2 (vendored).

## Result

| Item | Value |
|---|---|
| Output | `templates/cinematic-hud-reel/out/cinematic-hud-reel.mp4`, 22.00 s, 1920x1080, 30 fps, 660 frames, h264 yuv420p, 20.6 MB, no audio |
| Render time | 56.9 s (setup 13.0 s, capture 31.8 s, encode 8.4 s; 5 workers, hardware GPU, other agents rendering in parallel) |
| Full renders used | 2 of 3 (render 1 = deliverable, render 2 = determinism test) |
| Stills | 3 snapshot passes (24 + 4 + 5 frames) before the first render, all viewed |
| `inspect_video.py` | OK: black 0.00 s, longest still stretch 0.00 s |
| Preview | `previews/cinematic-hud-reel.mp4` (1.99 MB) + `.webp` (26.8 KB) |
| `check` | 0 errors; warnings left: `composition_file_too_large` (740 lines, generated file) and `rotation_pivot_drift` on the dashed rings (rings are centered circles, so this looks like a false positive) |

Structure at 128 BPM (1 beat = 14.0625 frames): cold open 0-56, hits I 56-169, metrics shot 169-225, build 225-394, riser 394-450, drop 450-562, logo finale 562-660 with the lock on beat 43 (frame 605).

## Quality bar (style's checklist)

| Item | Verdict | Evidence |
|---|---|---|
| Every hit has a visual event and a sound | PARTIAL | All 23 hits come from one list (`hitBeats`) and each has a camera punch, 3-frame RGB split, and (on drop, finale and lock beats) a flash. Frame 451 (drop hit) shows the 30% flash, 8 px cyan/violet split and the red ring burst. No sound exists because the brief says silent, so the sound half cannot pass. |
| Each keyword readable >= 0.6 s | PASS (tight) | Hits-I words stay 1.9-3.7 s. Build words show for 28 frames with a 9-frame decode, so 19 frames (0.63 s) fully resolved. "THEY NEVER" 56 frames, "SLEEP." 112 frames. Sheet frames at 8.27 s (SCOPE), 10.1 s (TEST), 11.9 s (MERGE) are readable. |
| Glow on one focal element per shot | PASS | Contact sheet: only the newest slammed word glows (older line word is dimmed, no glow); in the metrics shot only the center number; HUD rings, rulers, bars and micro-type have no bloom. |
| No frame still > 0.5 s | PASS | `inspect_video.py`: still stretch 0.00 s. Rings, scan bar, hex stream, timecode and wall rows move on every frame, including the logo hold (breathing glow, rotating rings). |
| Two renders produce identical frames | FAIL (visually identical) | All randomness is seeded (`hrand(seed, frame, ...)`), but `ffmpeg -f framemd5` differs on 507 frames (56-562). PSNR between the two renders: 49.6 dB minimum, so not visible. Frames 0-55 and 562-659 match exactly. Probable cause: GPU rasterization of text-shadow glow, blur and gradients with 5 workers. Not retested with `--no-browser-gpu` (render budget). |
| Logo fully assembled by frame 660 (scaled: ~605) and held >= 1.5 s | PASS | Last segment finishes at frame 605 (computed: 562 + 3 + 16 stagger + 24 duration). Frame 600 shows the wordmark almost complete with the decode line still resolving; frame 610 and sheet frame at 21.1 s show it complete. Hold 55 frames = 1.83 s. |

Other style checks: safe area 96 px respected (HUD brackets at 96 px, text inside); hit color #FF3B5C used on exactly two moments (drop ring burst on beat 32, alert strip on beats 36-37); never decode or shake the keyword after it lands (decode ends before the 2-beat hold; camera shake is the only motion, +/-6 px for 4 frames); parallax layers 0.3x / 0.6x / 1x implemented.

## Skill gaps

1. `skill/references/tools/hyperframes.md`, "Fonts, including CJK". Missing: the list of families HyperFrames auto-resolves. The cinematic-hud-reel style names Space Grotesk / Archivo 800 / Bebas Neue; none of Space Grotesk, Archivo, Bebas Neue or Oswald resolved (only JetBrains Mono did, per the compiler log "Fetched 10 font face(s) for JetBrains Mono"). `check` stayed green and the headline silently rendered in a fallback bold sans. I only noticed because the first contact sheet looked like Arial Black. Also Space Grotesk tops out at weight 700, so the style's "800" cannot be met with it. Proposed edit: add a line "Auto-resolve is not universal: confirm `Fetched N font face(s) for "<family>"` in the `check` output. If a family is missing, ship a local woff2: `npm pack @fontsource/<name>`, copy `files/<name>-latin-<weight>-normal.woff2` into `fonts/` and declare `@font-face` (verified with Archivo 800, 14 KB)". In the style file, change the headline row to "Archivo 800 (local woff2) or Bebas Neue" and drop Space Grotesk 800.
2. `skill/references/styles/cinematic-hud-reel.md`, "Motion grammar" vs "Structure". At 128 BPM a 2-beat shot is 28 frames, but the grammar says decode takes 12 frames and every keyword needs >= 0.6 s (18 frames). 12 + 18 = 30 > 28. I used a 9-frame decode. Proposed edit: "Decode resolves in 8-10 frames when the shot is 2 beats or shorter; keyword shot length >= decode + 18 frames."
3. Same file, "Structure": the style table is absolute (24 s, 120 BPM) and the quality bar says "by frame 660". For a 22 s / 128 BPM brief the agent must work out a proportional target (660/720 of the length, snapped to a beat). Proposed edit: state the rule as percentages (logo assembled by 92% of runtime, hold >= 1.5 s) and add a worked example: `beats = durationSec * BPM / 60`, section starts at beats 4 / 16 / 32 / 40 for 47 beats.
4. Same file, "Audio" and "Quality bar". The first quality-bar item requires a sound per hit, but silent briefs are common (no music file). Nothing says how to grade it or how to still deliver sound later. Proposed edit: "Silent brief: render silent, keep the hit list in `content.json`, grade item 1 as N/A for sound, and ship `scripts/sfx_kit.py` to generate `hits.wav` from that list on request". A small synth script in `skill/scripts/` (sub hit, riser, glitch tick) would remove the biggest gap in this style.
5. `hyperframes.md`, "Determinism". Says the same composition renders byte-identically. With a heavy scene (text-shadow glow, CSS blur, gradients, 5 workers, hardware GPU) it did not: 507 of 660 frames differed, PSNR >= 49.6 dB. The style's quality bar ("identical frames") then cannot pass as worded. Proposed edit: add "Byte identity held for flat scenes only; with glow/blur/gradients use `--workers 1 --no-browser-gpu` for exact repeats, otherwise treat PSNR > 45 dB as identical", and soften the style's bar to "visually identical (seeded randomness)".
6. `hyperframes.md`, "Determinism" bullet on canvas. The proxy-tween pattern (`tl.to(proxy, {f: N, ease: "none", onUpdate: () => render(proxy.f)})`) is documented for canvas only. I used it to drive a whole DOM scene (all transforms, text, SVG attributes set imperatively per frame) and it rendered correctly in `snapshot` and `render`. Proposed edit: say it works for DOM and SVG too, and is the right pattern for beat-grid styles where a GSAP tween per event would be hundreds of tweens.
7. `hyperframes.md`, "Check, then render". `check` hits that the doc does not mention: (a) `text_not_painted` is an error for `color: transparent` + `-webkit-text-stroke` outline text (use a low-opacity solid fill instead); (b) `content_overlap` is an error, not a warning, when dim panels sit under a slammed word at different times; (c) intentional off-canvas scrolling text needs `data-layout-allow-overflow`; (d) `composition_file_too_large` fires on a generated single-file `index.html` (harmless for build-script projects). Proposed edit: add these four lines to the `check` bullet list.
8. `hyperframes.md`, "Content-driven template". The pattern shows audio/segment generation only. A template with no audio and procedural scenes (this one) needs: concatenate `src/*.js` into one inline script, inject `window.CONTENT`, set root duration. Proposed edit: add a 10-line `build.mjs` variant ("scripts and CONTENT inlined, no audio") next to the existing one; I used exactly that.
9. `references/styles/cinematic-hud-reel.md`, "Look" / "HUD shapes". The style asks for a logo that assembles from HUD line segments but gives no geometry. I hand-wrote a 4x6-grid stroke alphabet for N O V A L B S (chamfered corners, `pathLength=1` dash-in plus seeded fly-in). Proposed edit: add a small stroke-glyph table for A-Z/0-9 (or a link to a ready `scripts/hud_glyphs.js`) and say that custom text outside the table needs a fallback (filled font crossfade).
10. `hyperframes.md`, "Check, then render" snapshot bullet: `snapshot --at` takes seconds, while beat-grid work thinks in frames. Proposed edit: "convert with `sec = frame / fps`; hit frames land on `round(beat * 60 / bpm * fps)`, so snapshot at `(hitFrame + 2) / fps` to see the settled hit".
11. `SKILL.md` step 1 / brief: nothing prompts for an end-card handle or logo when the brief gives only a name (the style lists it under "Inputs to ask for"). Unattended runs need a default. Proposed edit: "If no logo or handle is supplied, set the wordmark in the style's stroke/headline type and invent a clearly fictional placeholder URL (`name.example`)".

## Tool issues and fixes

- `hyperframes init` leaves `AGENTS.md`/`CLAUDE.md` and a CDN GSAP link; removed both files and vendored GSAP 3.14.2 (as the doc says). Output goes to `renders/` by default; used `--output out/cinematic-hud-reel.mp4`.
- Font resolution: see gap 1. Fix: local `fonts/archivo-latin-800-normal.woff2` (from `@fontsource/archivo@5.3.0`, OFL, 14 KB) declared in the template's `@font-face`.
- First `check` failed with 8 errors (outline-text `text_not_painted`, build-scene `content_overlap` between the terminal and the 176 px "THEY NEVER"). Fixes: solid low-opacity fill for the word wall, `data-layout-allow-overflow` on its rows, "THEY NEVER" reduced to 144 px, side panels narrowed to 280 px and dimmed to 30% during that shot. Later `check`: 0 errors.
- Drop-scene alert strip overlapped the small "THEY NEVER" label (seen in snapshot at 17.6 s); moved up 14 px.
- A `check` + `snapshot` loop costs about 25 s each; snapshots print a Gemini "describing frames" line that is harmless without a key.
- `rm -rf snapshots` was blocked by the environment's permission hook; used git-ignored folders instead (no impact on the output).
- Render 2 differs from render 1 at the pixel-noise level (see quality bar).

## Honest self-assessment

Does it look like the style description? Mostly yes. The near-black background, faint grid and stars, blue rings rotating in alternating directions, corner brackets, mono micro-type with 0.12em tracking, glowing headline slams, camera punch with seeded shake, decoded words, a drop with full-frame "SLEEP.", flash and RGB split, and a stroke-assembled logo are all present, and the contact sheet reads as one coherent system.

What a motion designer would criticize:
- No sound, so the sync to 128 BPM is only implied by punches and the BPM/bar readout; the reel feels half-finished without hits you can hear. Biggest weakness.
- The headline face is Archivo 800, a plain grotesque; it looks less custom than Space Grotesk or a condensed face would. The glow is a flat text-shadow, not a real bloom pass.
- Motion blur is only on whip pans; the punches have no directional blur or true camera rotation, and there is no depth (no 3D, no layered parallax between words). Camera moves are scale and shake only.
- The build section is busy but generic: the terminal and chart are small, low-contrast micro-type (14-15 px), so they register as texture, not content. Hits I has two near-identical slam layouts (stacked two-line cards).
- The cold open (first 1.9 s) is sparse; one boot block and rings is quiet for a "fast" reel.
- The logo is a thin single-weight stroke alphabet with a straight-line chamfer look; it is clean but not distinctive, and it only supports the letters N O V A L B S.
- The 30% white flash reads as a gray wash on dark footage at 100% frame size (frame 451); a motion designer would use a shorter, additive flash or a bloom spike instead.
- Not bit-identical between renders (see gap 5).

What I would do next with more budget: add a synthesized sound bed from the hit list, replace the CSS glow with a duplicated blurred layer for real bloom on the drop, add directional blur on punches, and trade the stacked-card layout in Hits I for a mix of full-frame and offset layouts.
