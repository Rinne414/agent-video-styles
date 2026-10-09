# Template report: flat-cartoon-explainer

Brief: ~50 s 1920x1080 30 fps pop-science explainer, "how does a rainbow form", host character, en-US-JennyNeural, captions. Built only from `skill/` (SKILL.md, the style file, hyperframes.md, audio-tts-captions.md) plus `templates/README.md`. No outside docs were consulted.

## Result
- `templates/flat-cartoon-explainer/out/flat-cartoon-explainer.mp4`: 52.9 s, 1920x1080, 30.00 fps, h264 + aac (1587 frames), 32.5 MB. Audio mean -21.9 dB, max -2.8 dB.
- Render time: 1 m 02 s (render 1) and 1 m 35 s (render 2, other agents were rendering in parallel). Full renders used: 2 of 3. Everything else was `snapshot` stills (3 rounds, about 30 PNGs viewed).
- `inspect_video.py`: OK, black 0 s, longest still 0.00 s, audio and video durations match.
- Preview: `previews/flat-cartoon-explainer.mp4` (1.8 MB) and `.webp` (27 KB).
- `hyperframes check`: 0 errors. Warnings are `nested_structure_needs_subcomposition` (x6) and `rotation_pivot_drift` on the host arm (expected, the arm pivots at the shoulder). Contrast 22/22 pass.

## Quality bar (style file)
| Item | Result | Evidence |
|---|---|---|
| Every narration sentence has at least one visual action pinned to a word | PASS | All 11 sentences have triggers (the "refraction" label, the "bounces" star, the "paint" band sweep, the "violet" label). Seen at 3.5, 12.5, 25, 29, 37, 43, 52 s. Caveat: pins use `start_ms - 2 frames` from timeline.json; I checked by stills that labels are on screen while the word is in the caption, not frame-exact sync by ear. |
| No 2 s window without motion | PASS | `inspect_video.py` longest still 0.00 s. Caveat: some windows (for example 41-43 s) move only through host bob, mouth flap, a 20 px pan and dots popping, which is secondary motion, not concept motion. |
| Only the 6 palette colors + ink; identical outline width | PARTIAL | Six palette hues + ink + sky/floor/white throughout; all outlines 5 px (rays are 12 px of color over 22 px of ink so the edge is 5 px). Deviations: the drop body is white at 75% opacity, its highlight arc is blue at 55% opacity (a tint), and the title has a 12 px paint-order stroke (6 px visible). |
| Characters only front or 3/4 view, no turns or walks | PASS | Pip is front view in every frame viewed; only arm poses and a bob. |
| Labels and captions at least 40 px | PASS | Labels 52 px, captions 52 px, title 96 px (checked in full-size frames). |
| Every fact in the narration traces back to the fact ledger | PASS with caveat | Ledger is in STORYBOARD.md. I wrote the sources (NASA, NOAA/NWS) from memory and did not re-verify them online. The ray fan is exaggerated to about 35 degrees for readability (real spread is about 2 degrees); this is noted in the ledger. |

## Skill gaps
1. `skill/references/tools/hyperframes.md`, missing section "SVG / GSAP character rigs". Nothing says how to rotate nested SVG groups. What worked: draw all geometry in absolute coordinates with no `transform` attributes, and put `svgOrigin: "x y"` on every rotate/scale tween, including the nested forearm group (the pivot is in the parent's coordinate space). Also missing: path drawing with `pathLength="1" stroke-dasharray="1 2"` plus `strokeDashoffset 1 -> 0`, and a note that `check` raises a harmless `rotation_pivot_drift` for shoulder-pivoted arms. Proposed edit: add a 12-line subsection with those three snippets.
2. `skill/references/styles/flat-cartoon-explainer.md`, "Look" and "Motion grammar". The host spec (circle 160, capsule 120x180, 16 px limbs) is clear, but there is no rig recipe (joint positions, arm pose angles: rest 0, point -90 / +90, cheer +-150, wave oscillation +-22). Proposed edit: add a "Pip rig" table (shoulder offset, upper arm 62, forearm 58, signed angles for left and right arm) so every agent builds the same character. Also add "draw a speech bubble as one path (circle + tail)"; my first two-shape bubble showed a visible seam at the tail base.
3. Same file, "Audio". The style asks for a ukulele/marimba bed at -28 LUFS and SFX every 2 s, but there is no recipe for either, and the template rules forbid third-party music. `audio-tts-captions.md` only has a sine pad. I shipped narration only. Proposed edit: make the bed and SFX optional for templates, or add an ffmpeg one-liner for a synthesized marimba-like bed and pop/whoosh SFX, plus how to mix them into HyperFrames `<audio>` tracks with `data-volume`.
4. `skill/references/audio-tts-captions.md`, "Pacing and caption limits". The chunking recipe is CJK only. English needs one: I wrote a balanced-split chunker in `scripts/build.mjs` (break at punctuation, split clauses over 38 characters at the most balanced word boundary, merge orphans under 8 characters). The first greedy version produced "It starts with sunlight and a lot of | tiny raindrops". Proposed edit: add the English chunker (about 20 lines) next to the CJK one.
5. `skill/references/tools/hyperframes.md`, "Fonts". It says Inter-like families auto-resolve but not whether Baloo 2 and Nunito (the style's fonts) do. I used `@fontsource/baloo-2` and `@fontsource/nunito`, copying the latin-700 woff2 into `fonts/` at build time (36 KB), which satisfies the offline rule. Proposed edit: add this recipe with the exact file names (`files/baloo-2-latin-700-normal.woff2`) and note that exact versions must be looked up (my guessed versions did not exist and `pnpm install` failed once).
6. `skill/SKILL.md` step 4 and the style "Structure" table. The table assumes a 60 s Setup / Mechanism 1 / Mechanism 2 / Twist / Wrap shape. A 50 s brief with one mechanism has no analogy or twist, so the agent must invent a mapping. Proposed edit: add "for a single-mechanism topic: Cold open 12%, Setup 8%, Mechanism 55% (3 sub-beats), Payoff 15%, Wrap 10%", and say scene lengths come from narration, not from the table.
7. `skill/references/tools/hyperframes.md`, "Content-driven template". The build-script pattern shows audio tags and `data-start`, but not how word times reach the inline GSAP script. I injected `const TL = {...}` (absolute word times) before the animation code and used `w(seg, word)` lookups. Proposed edit: add that pattern (10 lines), since word pinning is the core of this style.
8. `skill/scripts/inspect_video.py`: the contact sheet burns a large timestamp over the bottom-left of each tile, covering the caption pill, so caption checks on the sheet are impossible. Proposed edit: a `--no-timestamps` flag, or draw timestamps at the top.
9. `hyperframes.md`, scene switching idiom is not described. What worked: one root-level `<section class="scene clip" data-start data-duration>` per scene, an overlay `<svg class="clip">` for the iris wipe, captions as separate `.clip` elements; clips hide themselves outside their window, so no GSAP visibility tweens are needed. Proposed edit: state this explicitly.
10. Style "Motion grammar" says transitions are 14-frame iris wipes but not where the cut goes. I put the cut in the middle of the 0.2 s gap between segments, with the circle growing for 7 frames and shrinking for 7. Proposed edit: say "cut at the frame where the iris fully covers the screen".

## Tool issues and fixes
- `@fontsource` versions guessed wrongly: fixed with `pnpm view` and pinned exactly (5.3.0).
- My first exit-ray fan used real refraction indices, so the six rays differed by about 5 degrees and merged into one ink blob (only violet visible). Fixed by exaggerating the spread to 7 degrees per color (`fanDeg` in `src/geom.mjs`).
- `snapshot` prints "Describing frames with Gemini" and writes `snapshots/`: git-ignored as documented.
- Contact sheet timestamps hide captions (gap 8); I viewed full-size PNGs from `snapshot` and `ffmpeg -ss` instead.
- Layout audit gives `container_overflow` info (20 px camera pan) and `rotation_pivot_drift` (arms): both expected.
- A Git Bash heredoc containing an apostrophe broke once while writing this report (as the Windows pitfalls section warns); I used the file-write tool instead.

## Honest self-assessment
It matches the style description reasonably: flat palette, one outline width, front-view host with antenna, circle-iris wipes, captions on white pills, pop-ins with overshoot, narration-driven timing. The refraction scene (drop, white ray, bounce star, six-color fan, labels) reads clearly and is the best part. The eye scene and the final rainbow read well too.

What a motion designer would criticize:
- The first second is nearly empty (only the host pops in before the title), and scene 3 runs about 20 s with a mostly static drop, relying on rays drawing and labels for interest. There is no "twist" beat with a big squash number.
- The character is very simple: no elbow acting beyond a wave, mostly one pose, and the mouth just flaps in scale. No anticipation or follow-through on arm poses.
- No music bed and no SFX (gap 3), so the pop-ins are silent.
- Squash and stretch is applied only to the eye-scene drops; most pop-ins are a plain `back.out` scale.
- The arc scene's small drops are randomly scattered and a few sit under the bands; the drop highlight (blue at 55% opacity) slightly breaks the palette rule.
- The physics is schematic: the color fan is exaggerated about 17x. Fine for pop science, not a diagram to scale.
- Not checked: playback in a real player with audio sync by ear (only stills and `inspect_video.py`), and no 1080x1920 variant was built.
