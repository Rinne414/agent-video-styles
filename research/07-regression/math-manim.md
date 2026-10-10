# Regression: math-manim (1 + 2 + ... + n = n(n+1)/2)

## Result
- Output: `regression/math-manim/out/math-manim.mp4`, 1920x1080, 30 fps, 42.20 s video (narration 40.73 s + 1.5 s end hold), AAC audio, 2.3 MB.
- Wall time: about 25 min of agent time, mostly writing the scene and fixing the LaTeX; the final render took 94 s.
- Full renders: 1 (budget 3). Still iterations: 4 draft renders (720p15, about 70 s each) with frames viewed via ffmpeg.
- `inspect_video.py`: no warnings, black 0 s, longest still 3.5 s (the end hold).
- Versions: Manim CE 0.22.0, Python 3.12, MiKTeX on PATH per the tool doc, edge-tts `en-US-AndrewNeural`.

## Quality bar
- Each quantity keeps one color: PASS. n is gold in every label and equation, the sum is blue, the answer box is green (sheet frames 5-12).
- Every reveal is followed by a wait to the end of its narration sentence: PASS by construction (word-timed cues, `until`). Not measured frame by frame.
- Max 2 equations, nothing overlaps: PASS. At most one equation plus the n / n+1 labels are on screen; overlap occurs only mid-`TransformMatchingTex`.
- Equations transform term by term: PASS (`1+..+n = ?` -> `2(1+..+n) = n(n+1)` -> `1+..+n = n(n+1)/2`).
- Math checks out: PASS. Rows 1..5 plus a 180-degree copy tile a 5x6 rectangle (visible in the sheet); half of n(n+1) gives the formula.
- Text readable at 720p: PASS (captions 30 pt Inter, equations larger).
- Real LaTeX: PASS (MathTex via MiKTeX).
- Captions inside the safe area: PASS. Bottom edge about 90 px up; an `assert` checks width against 90 px side margins.
- Last frame intentional, held at least 1 s: PASS (green-boxed result, copy dimmed, 1.5 s hold).
- Audio/animation sync: audio length equals the scheduled total; alignment was not measured against on-screen events.

## Skill gaps
1. `references/tools/manim.md` and `styles/math-manim.md` (Pitfalls, "split terms with `{{ }}`"): no working syntax given. In Manim 0.22 adjacent groups `{{n}}{{=}}{{?}}` silently merge into one part, `({{...}}` right after a parenthesis does not split, and groups inside `\frac{ }` fail the same way. What works: spaces around every group, e.g. `2 \times ( {{1+2+3+\cdots+}} {{n}} ) = {{n}} ( {{n}} +1)`. Proposed edit: add this tested example and tell the reader to print `[p.tex_string for p in eq]` before animating. Cost me three iterations (a gold-scaled `n` in the Indicate, unsplit parts).
2. `styles/math-manim.md` Structure: the table is for 120 s and the style says 60-300 s, but the brief was 40 s. No guidance for short lengths. Proposed edit: add a 40-45 s beat plan (about 6 segments: question, build, copy/rotate, rectangle, formula, recap).
3. `styles/math-manim.md` Layout / safe area: no caption safe area is defined, and the `manim.md` caption helper uses `to_edge(DOWN)` (about 54 px margin), which fails a 90 px safe area. Proposed edit: give caption position and margins in scene units (frame 8 x 14.22; 90 px = 0.67), and note that an equation in the top third needs `to_edge(UP, buff>=0.8)`, which collides with a top brace label unless the geometry is lowered.
4. `references/tools/manim.md` caption snippet: shows `add_caption(text, t0, t1)` but not captions cut at word indices inside a segment (my table of `(segment, first word index, text)`). Proposed edit: add it; segment boundaries are easy to get wrong.
5. `styles/math-manim.md` Motion grammar: `Indicate` on a split part indexes by position (`eq[-1]`) without noting that parts depend on the `{{ }}` split. Same fix as gap 1.
6. SKILL.md step 6: the Manim stills recipe worked; add that a 720p15 draft of 42 s takes about 70 s, so batch all stills per draft.

## What the skill got right
- `tts.py` plus `timeline.json` word times and the `until` / `cue` helpers in `manim.md`: sync worked first time. The 2.4 words/s figure predicted length well (about 39 s of speech for 111 words).
- MiKTeX PATH instructions for Git Bash (`cygpath`) worked verbatim; the uv pin to 3.12 avoided the 3.14 trap.
- `-r 1920,1080 --fps 30` instead of `-qh`.
- The color rule (n gold, result box green) and the rotate-and-translate note: a rigid `Rotate` of the whole group was enough.
- Inter was installed and the contact sheet confirmed it rendered.

## Honest self-assessment
Complete and visually clean, within the render budget. Weak points: audio/animation alignment is correct by construction from word timestamps but was not measured frame by frame; the "n+1" label sits close to the top equation (about 0.3 scene units clearance); the n=5 staircase labels read 1,2,3,4,n, a mix of concrete and generic. The brief said about 40 s and the result is 42.2 s.
