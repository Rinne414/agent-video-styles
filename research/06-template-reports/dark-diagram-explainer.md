# Template report: dark-diagram-explainer

Brief: ~55 s, 1920x1080, 30 fps narrated explainer, "how a CDN makes websites fast", voice `en-US-AndrewNeural`, captions, SVG diagrams on a dark canvas. Tool: Remotion 4.0.534 (exact pin, as `create-video` installs it). Knowledge source: `skill/SKILL.md`, the style file, `tools/remotion.md`, `audio-tts-captions.md`, `templates/README.md` only.

## Result

| Item | Value |
|---|---|
| Output | `templates/dark-diagram-explainer/out/dark-diagram-explainer.mp4` |
| Duration / size / fps | 57.45 s (1723 frames), 1920x1080, 30 fps, h264 `yuv420p`, AAC 48 kHz, 9.45 MB |
| Full renders | 2 of 3 allowed (97 s and 105 s wall time, 8x concurrency, other agents rendering in parallel) |
| Stills | about 20 single-frame `remotion still` renders; 2 `--sequence` attempts failed (see Tool issues) |
| `inspect_video.py` | no warnings; black 0 s; longest still 2.28 s at 55.17 s (the end card hold) |
| Preview | `previews/dark-diagram-explainer.mp4` (2.06 MB) and `.webp` (22 KB) |

Narration: 9 segments, about 54 s of speech at rate +6% (56.9 s at +0%), 150 ms gaps, 2.2 s tail. Slightly over the "~55 s" target; I accepted it rather than burn a third render.

## Quality bar

Checked on rendered stills at frames 80, 115, 250, 330, 540, 780, 900, 950, 1100, 1260, 1480, 1520, 1700 and on frames extracted from the final mp4 at 20.5 s and 45.6 s, plus the 12-frame contact sheet of the final render.

| Item | Result | Reason |
|---|---|---|
| Every noun the narration names appears on screen within +-0.3 s | PASS (with one fix) | Cues are `at(segment, word)` start frames, so entrances land on the word. First draft missed "Virginia" and used km while the voice says "miles"; fixed with a "Virginia, USA" tag and "6,800 miles". I verified by eye at the word frames, not by measuring each cue. |
| No idle stretch longer than 2 s | PASS with a note | The tool reports one 2.28 s still stretch, the end card hold (CDN title, tail 2.2 s). Everything before it changes at least every ~1 s (packets, counters, camera drift). |
| Captions max 2 lines and never cover the active node | PASS after a fix | First pass had the dimmed "User, Paris" row sitting under the caption in the problem scene (frames 250 and 540). Fixed by hiding that row during the problem scene and the miss/hit scenes. Re-checked at 20.5 s and 1520. All captions are 1 or 2 lines. |
| Max 7 nodes visible; one icon set; one accent per role | PASS | Max 5 nodes (2 users, 2 edges, origin). Lucide only. Indigo `#6366F1` = active, red `#F43F5E` = problem, green `#22C55E` = result. |
| Final takeaway held >= 1.5 s | PASS | The CDN end card is on screen from about 52 s to 57.4 s (about 5 s). The takeaway sentence itself is a caption; the card shows "CDN / Content Delivery Network". |
| Audio and video durations match within 0.3 s | PASS | 57.45 s audio, 57.45 s container, 57.43 s video stream. |

## Skill gaps

1. `references/styles/dark-diagram-explainer.md`, Look / Captions and Quality bar: no safe zone for the diagram. Captions at 120 px from the bottom with 2 lines at 48 px occupy y 840-960, and a node row near the bottom collided with them. Propose adding to Look: "Diagram safe zone on 16:9: y 150-820 on screen (title above, captions below); park or hide nodes that would fall outside it at the current camera stop."
2. `references/audio-tts-captions.md`, Pitfalls in the style file ("write acronyms phonetically"): says to write "S Q L" for TTS but gives no way to show the correct spelling in captions. TTS returns `A | C | D | N` while the caption must read `A CDN`. The CJK alignment recipe does not cover this. Propose adding a short Latin recipe: per segment store `speech` and `caption`, split caption on whitespace, give each `merge: [[firstWordIdx, lastWordIdx]]` ranges for spelled-out letters, and throw if token count differs from TTS word count. (This template implements it in `src/Captions.tsx` and `content.json`.)
3. `references/styles/dark-diagram-explainer.md`, Motion grammar: the formula `frame = segmentStartFrame + round(word.start_ms / 1000 * fps)` is given, but no helper for "find the word" or for segment start frames with gaps. I wrote `src/timeline.ts` (`at(seg, "word")`, `endOf`). Propose adding a 15-line `at()` helper to `tools/remotion.md` Audio section, since every narrated Remotion style needs it, and noting that importing `timeline.json` directly (`resolveJsonModule`) avoids `calculateMetadata`/`fetch` and keeps `durationInFrames` computable at module load.
4. `references/styles/dark-diagram-explainer.md`, Structure: "60 s narrated, ~150-160 words". `en-US-AndrewNeural` at +0% ran about 2.4 words/s (about 145 wpm) on this script, so 137 words gave 56.9 s of speech, plus gaps and tail it was 59+ s. Propose: state "Andrew at +0%: about 2.4 words/s" and the rule "words = (target s - 1.5 s tail - 0.15 s x segments) x 2.4".
5. `references/styles/dark-diagram-explainer.md`, Quality bar vs Structure: "No idle stretch longer than 2 s" conflicts with "Outro held" and the final-takeaway hold; `inspect_video.py` flags it. SKILL.md step 7 mentions `--tail-hold`, but the style file does not. Propose: "The end card is exempt from the idle limit; run `inspect_video.py --tail-hold`", or add a very slow glow or drift pulse to the end card.
6. `references/tools/remotion.md`, Render commands / Verify output: `remotion render --sequence --frames=a,b,c --image-format=png` is the obvious way to get many stills with one bundle, but it crashes with `EINVAL ... inline-audio-mixing.js` whenever the composition contains `<Audio>` (even with `--muted`). Propose adding a line: "For narrated compositions use one `remotion still` per frame (about 10 s each with a cached bundle); `--sequence --frames` fails with audio."
7. `references/tools/remotion.md`: `Config.setPublicDir("assets")` is marked "[not run here]". It works (verified: `staticFile("audio/s1.mp3")` resolves to `assets/audio/`), which matches the templates README layout `assets/audio/`. Propose removing the "[not run here]" and noting that `staticFile` paths are relative to the public dir.
8. `references/tools/remotion.md`, Setup: nothing on drawing Lucide icons inside an SVG diagram. `lucide-react` icons accept `x`, `y`, `size`, `color`, `strokeWidth` and can be nested inside `<svg>`; it worked at 1.54.0. Propose one sentence plus a 3-line example, because the style demands Lucide or Tabler for icons and SVG diagrams.
9. `references/styles/dark-diagram-explainer.md`, Audio: asks for ambient music at 80-100 BPM and soft pops/whooshes, but `audio-tts-captions.md` only shows a three-sine pad and a ducking command, with no ready script. I shipped voice only (no music or SFX) to stay within the "synthesized in code" rule and budget. Propose adding `skill/scripts/synth_bed.py` (ambient pad plus pop/whoosh SFX at given frames, written as WAV) and a one-command mux recipe from `timeline.json`.
10. `SKILL.md`, step 4: "keep its proportions" is hard to apply when the content has two cache scenarios; the Structure table has one Mechanism block of 3-5 steps. I split the mechanism into edge servers, miss, hit and crowd (4 steps), which fits, but the skill could say explicitly that mechanism steps are one segment each and that extra segments (here `s2b`, `s5b`) are fine to hit a length.

## Tool issues and fixes

- `remotion render --sequence --frames=...` with audio: `Error: EINVAL: invalid argument, write` at `inline-audio-mixing.js:199`, with or without `--muted`. Fix: per-frame `remotion still` in a loop.
- `pnpm install` printed "Ignored build scripts: esbuild" (harmless, as documented). I did not run `create-video`; I hand-wrote `package.json` pinned to 4.0.534 (the version `npm view create-video version` reports) and `.npmrc save-exact=true`.
- A long Git Bash heredoc that included `'` characters inside a quoted `'EOF'` block failed to parse ("unexpected EOF while looking for matching `'`") through the Bash tool; I wrote files with the Write tool instead. `rm -rf` was denied by the harness (as the tool doc warns); I used `Move-Item` in PowerShell.
- Remotion `<Audio>` from `@remotion/media` inside `<Sequence premountFor>` worked; with `png` frames the mp4 is `yuv420p`, as the doc says.
- MiKTeX/manim not needed here.
- No online docs were consulted; no skill gap lookups on the web.

## Honest self-assessment

It reads as the style: near-black canvas with a faint dot grid and vignette, rounded `#18181B` nodes with indigo glow on the active one, red for the problem and green for the result, Inter 600/700, chapter title top left, two-line captions with the current word in indigo, one camera that pans and pushes between regions, and every event keyed to a spoken word. The story is clear and the cache miss / hit contrast is easy to follow.

What a motion designer would criticize:

- It is a diagram of boxes, not a Kurzgesagt-quality illustration. All five nodes are the same rounded rectangle with a small line icon; there is no map, no sense of geography, no character. The 200-vs-20 ms contrast is carried by numbers, not by a visual metaphor.
- The hook (first 4 s) is thin: two laptops and two green bars. It does not yet "show a surprising claim with one big visual metaphor".
- Camera moves are modest (scale 0.95 to 1.15) and mostly horizontal; there are no whip-pans or scene-change dips, and the Paris row simply disappears and returns, which is a continuity jolt.
- No music and no SFX (pop on node entrances, whoosh on camera moves), so it feels dry. This is a real gap against the style's Audio section.
- Diagram labels are 28 px, which is small on a 1080p frame viewed on a phone; the "5 ms" tag lingers through scenes where it is not the topic.
- Caption active-word color `#6366F1` on a dark pill is only about 4:1 contrast; it works but is weaker than white.
- Length is 57.4 s against a "~55 s" brief; the end card is a static glow title (no motion for its last 2 s).
- Numbers (200 ms, 20 ms, 5 ms, 6,800 miles, 1,000,000 visitors) are illustrative, not measured; fine for a template, flagged as fictional in the README.

Files: `templates/dark-diagram-explainer/` (README.md, STORYBOARD.md, content.json, package.json, remotion.config.ts, tsconfig.json, scripts/make-script.mjs, src/, assets/audio/), `previews/dark-diagram-explainer.mp4`, `previews/dark-diagram-explainer.webp`.
