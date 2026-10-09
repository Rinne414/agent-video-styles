# Code & Terminal Walkthrough

Syntax-highlighted code types itself, diffs morph line by line, and a terminal runs the result. The native format for developer tools, libraries and changelogs.

- **Primary tool**: HyperFrames (alt: Remotion with Code Hike for token morphs; Motion Canvas)
- **Format**: 1920x1080 30 fps (or 1080x1080 for feeds); 20-90 s
- **Inputs to ask for**: language, the real before/after code (compile- or run-checked; for library snippets install the pinned latest version in `out/`, run the snippet, print the version in the README, or use context7), the commands and their REAL output, repo or install URL, theme preference

## Look

| Token | Value |
|---|---|
| Canvas | `#0D1117` with a subtle radial lift to `#161B22` in the center |
| Editor window | 1400x820 on 16:9, radius 16, title bar 44 px `#161B22` with traffic dots `#FF5F57` `#FEBC2E` `#28C840`, a tab with the filename |
| Highlighting | Shiki `github-dark` (or `vitesse-dark`); one theme for the whole video; tokenize the final code once |
| Code font | JetBrains Mono or Fira Code, 30-36 px at 1080p, line-height 1.5; max ~22 visible lines and ~70 columns |
| Line numbers | 50% opacity, right-aligned in a 64 px gutter |
| Focus | focused lines 100% opacity, others 30%; focus band `rgba(56,139,253,0.10)` |
| Diff | added lines bg `rgba(46,160,67,0.15)` with `+` in `#3FB950`; removed bg `rgba(248,81,73,0.15)` with `-` in `#F85149` |
| Terminal | clip rows in a box of exactly N x line-height (e.g. 17 rows at 28 px / 1.5), centered in the body, so no partial line shows; panel `#010409`, prompt `$` in `#7EE787`, output `#C9D1D9`, 28-32 px |
| Callouts | pill labels in `#58A6FF`, Inter 600 24 px, with a 2 px leader line to the code |

## Motion grammar

- **Typing**: about 2 characters per frame (60 chars/s) for code; for anything over 10 lines reveal line by line, 4 frames per line. Never human typing speed for long code.
- **Terminal**: commands type at 1.5 characters/frame; after a 10-frame pause, output lines appear 2 frames apart; spinners cycle every 8 frames.
- **Caret**: blinks on a 15-frame cycle (8 on, 7 off); hidden while typing.
- **Focus moves**: opacity changes over 8 frames; scrolling via `translateY` over 18 frames with ease-in-out cubic.
- **Diff morph**: tokens that exist in both versions slide to their new positions over 20 frames (FLIP); removed tokens fade and collapse over 10 frames; added ones expand over 10 frames.
- **Camera**: zoom `1.0 -> 1.10` over 20 frames with transform-origin at the window's top center (so it never grows into the step label or off the canvas), hold, then zoom back. 1.15 only fits when the label is inside the zoomed layer.
- **Never**: re-highlighting code while it types (causes flicker - slice pre-tokenized output instead), scroll jitter, invented output.

## Structure (45 s = 1350 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-90 | The result first: terminal output or the final effect |
| Problem | 90-240 | The old code, the painful lines marked red |
| Change | 240-840 | 2-3 steps of 200 frames: focus, type or diff, callout |
| Run | 840-1170 | Terminal command, real output, success check |
| Outro | 1170-1350 | Install command or repo URL, held and copyable |

Each focused change stays on screen at least 2 s after the typing finishes.

Tutorial variant (20-40 s, no old code, no Problem beat): Hook 8% (result peek), one step per install/type/diff at 12-35% each, Run 35%, Outro 6%. Percentages scale to any length.

## Audio

Lo-fi or minimal electronic, 90-110 BPM. Key-click SFX is subtle: one burst sound per typing run, not one per character; a soft chime on success. Voiceover is optional; if used, follow `../audio-tts-captions.md` and time each step to its narration segment from `timeline.json` (`{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`).

## Agent brief (template)

```
Style: code-terminal-walkthrough (see references/styles/code-terminal-walkthrough.md)
Language: <language>, files <names>
Before: <real code or path>  After: <real code or path>
Steps: 1) <change + callout text> 2) ... 3) ...
Run: <command> -> <captured real output>
Outro: <install command or repo URL>
Theme: github-dark | vitesse-dark; variant none | retro-crt-terminal | pr-to-video
Format: 1920x1080 30fps, <length> s; music <path or none>
```

## Quality bar

- [ ] All code is real and runs; all terminal output was captured from a real run
- [ ] Highlighting is correct for the language and never flickers
- [ ] Font >= 28 px; max ~22 lines visible; no partial row under the title bar
- [ ] Silent brief: key-click and chime items N/A
- [ ] Each change held >= 2 s after it finishes
- [ ] Unchanged lines dimmed while a change is in focus
- [ ] The final command is visible long enough (>= 2 s) to copy

## Pitfalls

- **Invented APIs or output**: agents write plausible but wrong code. Run the snippets and paste real output (option names change between major versions).
- **Windows capture**: `curl -w "%{http_code}\n"` in Git Bash emits CRLF; strip `\r` (`tr -d '\r'`) before putting output in `content.json`, or strict colouring regexes fail. Use an unusual port (3000 is often taken).
- **Highlight flicker**: highlighting a partial string each frame changes token colors mid-word. Tokenize the full final code once, then reveal by character index across tokens.
- **Overflowing lines**: lines over ~70 columns run off the window; wrap, shorten, or scroll horizontally on purpose.
- **Too much code per screen**: zoom into the 3-8 lines that matter.
- **Fonts and ligatures**: load the monospace font explicitly; ligatures (`=>`, `!==`) may render differently from the editor, so decide whether you want them.

## Variants

- **retro-crt-terminal**: phosphor green `#33FF66` or amber `#FFB000` on `#050805`; 2 px scanlines at 12% opacity, slight bloom (`text-shadow 0 0 8px` of the text color), curved-screen vignette; pixel font (VT323; Neodunggeunmo for Korean); typing plus 2-frame glitch flashes and ASCII progress bars `[#####-----] 50%`; good for self-intros and hacker-themed launches.
- **pr-to-video**: a title card with repo and PR number (`#1234`), 2-3 focused diffs with callouts, then the before/after behavior (terminal output or UI); 20-40 s.
