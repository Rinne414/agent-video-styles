# Character Dialogue Explainer

Two mascots talk over a blackboard, mouths flapping to TTS, with a caption box under every line. The Japanese Zundamon / VOICEVOX explainer format, generalized with original code-drawn characters.

- **Primary tool**: Remotion (alt: HyperFrames)
- **Format**: 1920x1080 30 fps; 30 s - 10 min (template: 40 s)
- **Inputs to ask for**: topic or a script written as dialogue lines (A / B), language + two clearly different voices, character names and colors, optional slide images per section

## Look

| Token | Value (1920x1080) |
|---|---|
| Background | blackboard `#1F3A2E` with 2% chalk noise inside a 24 px wooden frame `#6B4423`; alt: soft room `#F4EFE6` |
| Board area | 1180x620 at (120, 100); chalk white `#F2F2EA`, chalk yellow `#F5D547`, chalk pink `#F28BB0`; section title 64 px / 800, bullets 44 px |
| Characters | original SVG mascots ~460 px tall standing on a chalk tray at y 850 (feet y ~852), above the caption box: asker (B) x 1295-1595, explainer (A) x 1585-1885, both right of the 1300 px board edge. Speaker 1 = explainer, speaker 2 = asker |
| Mascot build | round head, 2 dot eyes 18 px, mouth sprite (closed = 4 px line, open = ellipse 36x28 `#7A1F2B`; beak or snout characters use the parted beak, upper and lower halves with `#7A1F2B` between, gap >= 14 px), body capsule; A body `#34A853`, B body `#E84C8B`, 6 px outline `#1E1E1E` |
| Caption box | 1280x180 centered at y 860-1040; fill `rgba(0,0,0,0.75)`, radius 16, 4 px border in the speaker's color; text 48 px / 700 white (Noto Sans JP / SC), max ~88 Latin characters per two lines (~46 per line; split longer lines into two segments); speaker tag 30 px in the speaker color at the box's top-left |
| Type | Noto Sans JP / SC / Inter 700 |

Default to original mascots. VOICEVOX characters (Zundamon, Shikoku Metan and others) each have their own usage terms and credit rules; only use their art if the user explicitly asks and accepts those terms.

## Motion grammar

- **Lip flap**: while a word of the speaking character is active (from `words` timings), alternate mouth open/closed every 4 frames (about 7 Hz); force closed in gaps over 120 ms and after the line ends.
- **Idle breathing**: `scaleY 1.000 <-> 1.015` sine with a 2.5 s period, origin at the feet.
- **Blink**: every 3-5 s (seeded `random()` per character), eyes closed for 4 frames.
- **Speaker cue**: the speaking character hops `translateY -12 px` with `spring({damping: 12, stiffness: 180})` at line start and settles back within ~20 frames; the listener drops to 85% brightness.
- **Expressions**: per-line tag `normal | happy | surprised | troubled` swaps eye and mouth sprites instantly, with a 6-frame bounce.
- **Board writes**: bullets and diagrams appear with a chalk write-on (`clip-path` wipe or SVG stroke dash) over 12-18 frames, starting on the line that mentions them.
- **Line changes**: hard cut of caption text; 150-250 ms silence between lines.

## Structure (pacing guide, 40 s = 1200 frames @ 30 fps; 8-10 lines set the beats and real lengths come from timeline.json)

| Beat | Frames | Content |
|---|---|---|
| Title | 0-90 | Board shows the topic title; A greets |
| Question | 90-300 | B asks; board writes the question |
| Explain 1 | 300-600 | A explains in 2 lines; bullet 1 + a simple diagram |
| Reaction | 600-720 | B surprised expression, short line |
| Explain 2 | 720-1020 | A, bullet 2 |
| Wrap | 1020-1200 | Both happy; summary on the board; closing line |

Line length = segment `duration_ms` + 200 ms gap; budget = sum of durations + 200 ms per line + lead + tail. `en-US-AnaNeural` is slow (~1.8 words/s, ~0.8 s trailing silence): use rate +10..+15%. Change the board visual at least every 2-3 lines.

## Audio

One TTS segment per dialogue line. `scripts/tts.py` uses one voice per script, so write two scripts (A lines and B lines, keeping their ids in dialogue order) and merge the two `timeline.json` files by id; see `../audio-tts-captions.md` for the contract `{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`. Voice pairs: `ja-JP-NanamiNeural` / `ja-JP-KeitaNeural`, `zh-CN-XiaoxiaoNeural` / `zh-CN-YunxiNeural`, `en-US-AvaNeural` / `en-US-AndrewNeural`. VOICEVOX (local engine) is the authentic Japanese option and requires per-character credit such as "VOICEVOX:ずんだもん". Light BGM at -30 LUFS; a soft "pon" SFX on board updates (both optional when the brief asks for silence). SVG filters (`feTurbulence`, `feDisplacementMap`) crawl in the default renderer: set `Config.setChromiumOpenGlRenderer('angle')` (3x faster here). Reference merge approach: run `tts.py` per voice into temp dirs, merge by id.

## Agent brief (template)

```
Style: character-dialogue (see references/styles/character-dialogue.md)
Topic: <topic>  (or Script: <path to A/B dialogue lines with expression tags>)
Characters: A "<name>" <color> explains, B "<name>" <color> asks
Voices: A <voice id>, B <voice id>
Board: <chalk bullets | slide images in path>
Length: <seconds>; Format: 1920x1080 30fps; BGM <path or none>
```

## Quality bar

- [ ] A mouth moves only while that character's audio plays and is closed in every silence
- [ ] Exactly one character is active per line (hop + full brightness)
- [ ] Caption shows the full line, max 2 lines, speaker tag color matches the character
- [ ] Board content appears with or after the line that mentions it, never before
- [ ] 150-250 ms gap between lines; voices never overlap
- [ ] All character art is original or properly licensed and credited

## Pitfalls

- **Third-party characters**: shipping Zundamon or other mascot art without following their terms. Default to original SVG mascots.
- **Jitter flap**: toggling the mouth every frame looks like a glitch; keep a 4-frame cadence.
- **One voice for both**: the dialogue collapses into a monologue. Pick voices of different gender or pitch.
- **Wall of text**: a line longer than 2 caption lines means the line is too long; split it into two segments.
- **Mispronounced names**: Japanese TTS often misreads proper nouns. Respell them in katakana in the TTS text only and keep the original spelling in captions.
- **Static board**: the same board for a minute feels dead. Add a diagram, highlight or new bullet every 2-3 lines.

## Variants

- **single-host**: one character at the bottom-right, the board widened to 1500x700; lecture pacing.
- **slide-board**: per-section slide images (HTML or Marp) fill the board area with a 10-frame crossfade; overlaps with card-explainer.
- **vertical**: 1080x1920; board 1000x900 at the top, characters 380 px tall side by side at the bottom, caption box at y 1200-1400.
