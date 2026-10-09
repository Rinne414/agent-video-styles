# Template report: character-dialogue

## Result
- Output: `templates/character-dialogue/out/character-dialogue.mp4`, 1920x1080, 30 fps, 49.60 s (1488 frames), h264 yuv420p + AAC, 6.3 MB. Preview: `previews/character-dialogue.mp4` (1.4 MB) + `.webp`.
- Render time: 65 s with `--gl=angle`. Without it the same frames were about 3.3x slower (30-frame benchmark 24.7 s vs 7.4 s), and a full render with the default renderer ran over 19 minutes before I killed it.
- Full renders: 2 completed (first version, final after the owl beak fix) plus 1 aborted (default GL, killed after about 19 min). Total 3. Plus about 10 stills and two 30-frame benchmarks.
- `inspect_video.py`: no warnings, black 0 s, longest still 1.13 s.
- Remotion 4.0.534 pinned exactly (I did not run `create-video`; I wrote the 4 scaffold files by hand from the tool doc).

## Quality bar
Checked on stills (frames 40, 44, 70, 126, 250, 420, 520, 650, 780, 800, 1200, 1480) and the final contact sheet.
- PASS: A mouth moves only while that character's audio plays and is closed in every silence. Frames 126 (line gap) and 44 (inter-sentence gap over 120 ms) closed; frames 24/28/70 flap open/closed in the 4-frame cadence. Caveat: I verified individual frames, not every frame; the logic is word-window based.
- PASS: Exactly one character active per line (hop + full brightness, listener at 85%). Visible in the sheet: the listener is darker in every cell. Both are bright only in the post-audio tail.
- PASS with a fix: caption shows the full line in at most 2 lines, tag color matches the speaker. Needed rewording: my first draft lines were 95-113 characters and would have wrapped to 3 lines at 48 px. All final lines are 85 characters or fewer and render in 2 lines (frames 420, 650, 1200).
- PASS: Board content appears with or after the line that mentions it. The menu is drawn 4 frames after the "The menu" line starts; the "no direct access" cross appears 40 frames into Pip's kitchen line. Fully by design via `delay` in content.json.
- PASS: 200 ms gaps between lines, voices never overlap (sequential `<Sequence>`, line = duration + 200 ms).
- PASS: All art original (Pip, Juno), fonts from npm `@fontsource/inter`, audio synthesized or Edge TTS.

## Skill gaps
1. `references/styles/character-dialogue.md`, Look table, "Characters" row. The positions contradict themselves. "anchored to the bottom edge", "B at bottom-left x 1260-1560, A at bottom-right x 1520-1880" and a caption box at y 860-1040, x 320-1600 overlap (B x 1260-1560 sits inside the caption box x range at any bottom-anchored height), and "B bottom-left / A bottom-right" are both right of the 1180 px board that ends at x 1300. Which character is A and which is B is also confusing (A explains, B asks, but the brief's asker/explainer can differ). Proposed edit: "Mascots stand on a chalk tray at y 850, above the caption box: asker x 1295-1595, explainer x 1585-1885, 460 px tall (feet y 852). The caption box sits below the tray." Also state "speaker 1 = explainer, speaker 2 = asker" with names.
2. `references/tools/remotion.md`, Render commands (and style file). Nothing says SVG filters (`feTurbulence`, `feDisplacementMap`, chalk or grain effects) are extremely slow with the default renderer: one chrome GPU process saturated a single core and the full render did not finish in 19 minutes. `--gl=angle` made it 65 s. Proposed edit: "Using SVG filters, CSS blur or backdrop-filter? Set `Config.setChromiumOpenGlRenderer('angle')` in remotion.config.ts; it was 3.3x faster on a 30-frame test here." (The doc only mentions `--gl` for 3D.)
3. `references/audio-tts-captions.md`, Hitting a target length / Recommended voices. `en-US-AnaNeural` (the brief's voice) is a slow child-like voice: at +0% 13 words took 7.1 s (about 110 wpm) versus Andrew about 150 wpm, and ends with about 0.8 s trailing silence. Proposed edit: add AnaNeural to the voices table with "slow; use rate +10..+15% and count about 1.8 words/s". Also add a "dialogue length budget" sentence: sum `duration_ms` + 200 ms per line + lead + tail.
4. `references/styles/character-dialogue.md`, Audio. It says "write two scripts and merge the two timeline.json files by id" but ships no merge helper, and `tts.py` writes both outputs to the same dir only if you separate them. I wrote `scripts/build_audio.py` (reads content.json, runs tts.py per character into temp dirs, merges). Proposed edit: add a `--dialogue content.json` mode to `tts.py` or link this script as the reference implementation.
5. `references/styles/character-dialogue.md`, Quality bar / Look. "Caption shows the full line, max 2 lines" is not tied to a character budget. At 48 px / 700 Inter in a 1280 px box the limit is about 46 characters per line, so about 88 characters per line of dialogue. Proposed edit: add "max about 88 Latin characters per caption line; longer lines must be split into two segments".
6. `references/styles/character-dialogue.md`, Look "Mascot build". The mouth spec (36x28 ellipse) fits a face-like mascot but not an owl: a literal ellipse on the belly reads as a hole. Proposed edit: "For beak or snout characters, the mouth sprite is the parted beak (upper and lower halves with #7A1F2B between); open gap at least 14 px or it will not read at 1080p."
7. Same file, Motion grammar "Speaker cue: hops translateY -12 px". It is not defined whether the hop returns. I implemented up then settle back (spring up, spring down 10 frames later). Proposed edit: "hop up 12 px and settle back within about 20 frames".
8. `references/tools/remotion.md`, Setup. `@fontsource/inter` imports `latin-700.css`: good. But `Config.setPublicDir("assets")` is marked [not run here]. I used it and it works (staticFile("audio/x.mp3") resolves). Proposed edit: drop the not-run marker. Also `pnpm add -E typescript` now installs TypeScript 7.0.2; `tsc --noEmit` ran clean with it.
9. SKILL.md step 4. "Derive frame ranges from the style's Structure table" assumes proportional scaling, but a dialogue is driven by line audio; the table for this style (40 s) did not map onto my 10 lines. I ignored the table and used the actual line timings. Proposed edit in the style file: "Structure is a pacing guide; the number of lines sets the beats (brief: 8-10 lines)".
10. Online lookups: none (no skill gap logged for external docs).

## Tool issues and fixes
- Default Chromium GL renderer made the SVG chalk filter unusably slow; fixed with `Config.setChromiumOpenGlRenderer("angle")`.
- My first stagger helper for the chalk strokes had a math bug (progress divided incorrectly), seen in stills as half-drawn icons; fixed after viewing stills.
- Wings raised for "happy" extended beyond the mascot SVG and were clipped; fixed with `overflow: visible` and smaller angles.
- A shell command with `rm -rf` was blocked by the harness; I used `mv` into `out/`.
- `remotion render ... | tail` buffers all output, so progress was invisible during the long aborted render.

## Honest self-assessment
Looks like the described style: blackboard with wooden frame, chalk write-on diagram, two distinct mascots with different silhouettes and voices, caption box with colored speaker tag, lip flap, expression swaps, and a hop cue. It reads as a Zundamon-style explainer, with cleaner vector art than the real format.

What a motion designer would criticize:
- Character animation is shallow: no head tilt, no arm gestures tied to the speech, no anticipation or squash on the hop, and the expression change is a pop of the whole body rather than a face morph.
- The flap uses a fixed 4-frame cadence with 4 sizes by word index, so it is rhythmic rather than viseme-accurate.
- The owl at 85% brightness plus half-lidded eyes can look sleepy or annoyed when listening; Pip's brightness drop turns his face grey.
- Mascots stand to the right of the board, away from the board they refer to; they never point at it. The board has no camera move, so the scene is static outside the chalk writing; line 8 has no new board content (about 3.6 s).
- The chalk look is a noise-mask filter, not hand-drawn jitter; strokes are clean vector paths.
- BGM is a bare synthesized chord pad (barely audible, volume 0.1) and the "pon" is a plain sine; audio loudness was not measured or normalized.
- Captions do not highlight spoken words, and "API" is respelled "A P I" for TTS only, which may sound slightly spaced.
