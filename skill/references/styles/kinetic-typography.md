# Kinetic Typography

An empty stage and one word at a time: type appears, settles and exits exactly on the beat. No imagery needed, so it is the fastest style to make well.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Format**: 1080x1920 30 fps for shorts (16:9 and 1:1 also common); 15-45 s
- **Inputs to ask for**: the text (or a message to condense), music file or BPM, 2-4 brand colors, one display font preference

## Look

| Token | Value |
|---|---|
| Stage | one solid color: `#000000`, `#FFFFFF`, or a saturated field; no images, gradients or textures |
| Display face | ONE per video: condensed (Anton, Bebas Neue, Oswald 700) or heavy grotesk (Inter 900, Archivo Black) |
| Size | 180-400 px at 1080 px width; a single word may fill 85-92% of the frame width |
| Tracking | -0.02em (condensed) to -0.04em (grotesk); line-height 0.9 |
| Case | ALL CAPS for condensed faces; sentence case allowed for grotesk |
| Palette | stage + type + 1 accent for the key word; poster variant rotates 3-4 fields, e.g. `#FF4D00`, `#0A0A0A`, `#F2F2F2`, `#2F5BFF` |
| Density | 1-3 words visible at once; never a full sentence on screen |
| Safe area | 9:16: keep 220 px top and 340 px bottom clear; 16:9: 96 px |

## Motion grammar

- **Beat grid**: `beatFrame(i) = round(offset + i * 60 / BPM * fps)`. Always compute from the beat index; never accumulate rounded durations (drift).
- **Unit cycle**: appear (4-8 frames) -> settle (hold) -> exit (4-6 frames). The settle is what the eye reads.
- **Appear options**: slam `scale 1.30 -> 1.00` + opacity, GSAP `expo.out` (Remotion spring `{damping: 14, stiffness: 220}`); mask rise (`overflow: hidden`, `yPercent 100 -> 0`, 8 frames, `power4.out`); per-letter stagger 1-2 frames.
- **Exit options**: scale to 0.9 + fade (5 frames), slide out the mask (6 frames), or hard cut to the next word.
- **Two-word phrase**: replace in place (first word exits as the second lands) or stack; the key word thumps (`scale 1.00 -> 1.05 -> 1.00`) on each following beat so holds never freeze. Holds are settled or pulsed; the end card is exempt from the 1 s stillness rule.
- **Anchoring**: replace words in the same position so the eye does not travel; move the anchor only on phrase changes.
- **Downbeats**: every 4 bars, invert stage and type colors or swap the poster color field.
- **Emphasis**: the key word of each phrase is 1.3x larger or in the accent color, never both.
- **Never**: two word groups moving at once, drop shadows, gradient-filled body words, text visible before its entrance frame.

## Structure (30 s = 900 frames @ 30 fps, 120 BPM, 9:16)

| Beat | Frames | Content |
|---|---|---|
| Intro | 0-120 | One word appears in silence or on the first hit, holds, exits |
| Build | 120-480 | One word per beat (24 beats) building 3-4 short phrases |
| Hook | 480-720 | The key phrase, word per beat, color field flips on each downbeat |
| Payoff | 720-810 | Final line slams, holds 45 frames |
| End card | 810-900 | Handle / logo / CTA in small type (64-80 px), settled and held |

For 6-scene pieces, use 150 frames per scene with one phrase per scene.

Scaling: `beats = seconds * BPM / 60`. Short-cut, 20 s = 40 beats at 120 BPM, 5 phrases of 8 beats: first word beat 0, key word beat 2, thumps beats 3-6, exit beat 7.67; finale 8 beats, end card held >= 1.5 s. Vary anchor, scale and appear style between phrases so they do not feel templated.

## Audio

Music is essential; pick 110-130 BPM. Measure BPM and the first downbeat offset (ffmpeg onset detection, or ask the user), then build the beat grid before any animation. Words land on beats with 0-frame tolerance. If there is voiceover, words follow the narration timeline instead (see `karaoke-caption-short`).

## Agent brief (template)

```
Style: kinetic-typography (see references/styles/kinetic-typography.md)
Text: "<full message>"  (agent splits into 1-3 word units)
Key words: <words to emphasize>
Music: <path>, BPM <n>, first downbeat at <ms> (or "measure it")
Palette: stage <hex>, type <hex>, accent <hex> [poster colors ...]
Font: <condensed | heavy grotesk | name>
Format: 1080x1920 30fps, <n> s
```

## Quality bar

- [ ] Every word entrance lands on a beat frame from the grid
- [ ] No text visible before its entrance frame (check the frame before each beat)
- [ ] No word overflows the frame at its largest size
- [ ] At most one moving word group per frame
- [ ] Each word readable >= 0.4 s; key phrases >= 1 s
- [ ] End card held >= 1.5 s
- [ ] Silent brief: beat sync is checked by frame numbers only (note it)

## Pitfalls

- **Pre-reveal**: initial CSS state is visible at frame 0 before the timeline sets opacity 0. Set the hidden state in CSS, not only in the timeline (this bug was caught by frame review in a public example).
- **Beat drift**: summing rounded beat lengths slips a frame every few bars. Compute each beat from its index.
- **Overflow**: long words at 400 px leave the frame. Measure text width and fit to 90% of the frame width.
- **Fonts**: auto-resolve is not guaranteed for Anton or Bebas Neue; vendor `@fontsource/<name>` woff2 into `fonts/` and check the log.
- **Bad line breaks**: CJK and long words break mid-unit. Control lines explicitly; one unit per line.
- **Font flash**: the first frames render in a fallback font if the webfont loads late. Preload and wait before rendering.

## Variants

- **poster-color-block**: words cropped off-frame edges (scale up to 140% of frame width), full-frame color fields wipe in on every beat (6 frames, `expo.inOut`), type color always the complement of the field. One `clip-path` field per beat with its text inside the layer; crop width = text width / frame width (e.g. 520 px Anton "REPEAT." = 1419 px, 131%); the last field must resolve to a fully legible word (end at scale ~0.66).
- **lyric-mv**: lines from a timed SRT; each line gets its own layout (stacked, split, diagonal); words land on vocal onsets; chorus repeats the same layout so it is recognizable.
- **webgl-type**: condensed display type composited over a seeded three.js terrain or liquid shader, plus HUD micro-type in 14 px mono; keep the type in DOM for sharpness.
- **16:9 manifesto**: centered single words at 220-300 px, slower 2-beat holds, ends on a full sentence revealed line by line.
