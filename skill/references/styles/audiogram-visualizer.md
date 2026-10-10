# Audiogram & Music Visualizer

A podcast-clip format: cover art, a visualizer computed from the audio frame by frame, and word-synced captions.

- **Tier**: experimental (few public examples; validated by one template)
- **Primary tool**: Remotion with `@remotion/media-utils` (alt: HyperFrames with a precomputed spectrum JSON)
- **Format**: 1080x1080 30 fps (also 1080x1920, 1920x1080); 15-60 s
- **Inputs to ask for**: audio file (own or licensed) or a script to voice with `scripts/tts.py`, show title, cover art (or text-only card), accent hex, caption language

## Look

| Token | Value (1080x1080) |
|---|---|
| Background | deep ink `#0E1117` with a 900 px radial glow of the accent at 12% behind the visualizer |
| Accent | one color (fallback `#38BDF8`), used for bars and the progress line; second tone `#1F2937` for the progress track; idle bars use a lighter `#3B4659` so they stay visible on the ink |
| Cover | 360x360 rounded rect, radius 28 px, centered at y 290 (top 110, inside the 96 px safe area); if none, a code-drawn card with the show initial at 160 px |
| Title | Inter / Space Grotesk 700, 44 px, `#F5F7FA`, max 2 lines, y 490-580 under the cover |
| Bars | 48 vertical bars, width 10 px, gap 8 px (856 px wide, inside the 96 px margins; 64 bars fit only at width 8 / gap 6), round caps, mirrored about baseline y 700, max total height 220 px (zone 590-810), min height 6 px |
| Waveform variant | 4 px stroke, 1 point per 6 px, mirrored about the centerline |
| Captions | zone y 842-982 (pill centred at y 912; two lines of 52 px need about 140 px), 52 px / 700, `#F5F7FA` on 70% black pill (radius 20, padding 12x24), active word in accent only if contrast >= 4.5:1 (else bold + underline), upcoming words `#9AA4B2`, chunk with `chunk()` from `../audio-tts-captions.md` at max 28 chars, 2 lines |
| Progress line | 4 px, y 826 (between bars and captions), from x 96 to 984, accent over `#1F2937` |
| Safe area | 96 px; on 9:16 keep 220 px top and 300 px bottom clear and move captions to y 1380 |

## Motion grammar

- **Bars**: `visualizeAudio({fps, frame, audioData, numberOfSamples: 128, optimizeFor: "speed"})`; take the lowest 24 bins (speech sits in the lowest ~10), mirror them about the centre so low bins are in the middle (48 bars), apply `Math.pow(v, 0.5)`, a mild high-frequency tilt (x1 to x2.5 outward), and a soft clip `maxH * tanh(px / 130)` instead of a hard clamp (a left-to-right mapping gives a lopsided wedge); smooth with a 3-frame moving average over neighbouring frames. Everything is computed from `frame`, never from a live analyser.
- **Idle floor**: when the signal is below 0.01 the bars sit at 6 px and breathe +-2 px on a 1.5 s sine.
- **Cover**: scale pulse `1.00 -> 1.02` driven by the low-bin average, max 8 px of travel.
- **Captions**: word-by-word highlight from `timeline.json`, active word moves 2 frames before `start_ms`.
- **Intro**: cover springs in (`damping 20, stiffness 160`) over 18 frames, bars rise from 0 with 1-frame stagger.
- **Never**: linear easing on position, a visualizer that reacts to nothing (verify bars move on a loud passage), raw unsmoothed bins (they flicker).

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Intro | 0-45 | Cover and title spring in, bars rise |
| Body | 45-840 | Audio plays, captions run, progress line fills |
| Outro | 840-900 | Audio fades over the last 20 frames only if it still plays (narration often ends earlier: then hold the silent card), card settles with show name and URL, held 30 frames |

Proportions scale with the requested length: intro stays 1.5 s, outro 2 s, body takes the rest. Long audio (over 3 min): use `useWindowedAudioData` (WAV only) or precompute the bins to JSON once.

## Audio

The audio is the content. Use the user's file, or generate narration with `scripts/tts.py` (timing from `timeline.json`, see `../audio-tts-captions.md`), or synthesize a track in code (offline-rendered WAV: 4-chord pad, 90-110 BPM, -16 LUFS). Several narration segments must be mixed into ONE continuous file for `visualizeAudio` (ffmpeg `adelay` + `amix` + `apad`, keep a JSON of segment offsets for captions). Never use a copyrighted track you cannot license. If the user wants a silent video, this style does not apply: switch to kinetic-typography.

## Agent brief (template)

```
Style: audiogram-visualizer (see references/styles/audiogram-visualizer.md)
Audio: <path | script + voice id>; clip range <start-end s>
Show: <title>; Speaker: <name>; Cover: <path | "draw card">
Accent: <hex>; Captions: <en | zh-CN | none>
Format: 1080x1080 30fps, <seconds> s
```

## Quality bar

- [ ] Bars visibly move with loud passages and rest on quiet ones (compare two stills)
- [ ] Captions match the audio within 2 frames
- [ ] Caption and title contrast >= 4.5:1
- [ ] No flicker: bar height changes <= 40% between adjacent frames
- [ ] Audio is original, generated or licensed (record the source)
- [ ] Nothing crosses the safe area; final card held >= 1 s

## Pitfalls

- **Wall-clock analysers**: frames render out of order; only frame-indexed data works.
- **Unsmoothed bins**: raw FFT jitters; smooth over 3 frames.
- **Low-bin dominance**: speech energy sits low (bins 0-47 of 128 cover about 0-9 kHz); use only the lowest bins, mirrored, with the sqrt curve or one side stays flat.
- **Version pin**: `@remotion/media-utils` must match the exact `remotion` version. With a fixed brief length use `floor` for duration and trim audio with `-t`.
- **Fonts**: vendor `@fontsource/inter` latin-700 and `@fontsource/noto-sans-sc` for Chinese; wait with `delayRender`.
- **Heavy rendering**: 128 samples x 30 fps x long clips is slow; clip the audio first.
- **Static cover for 60 s**: add the pulse and the progress line so the frame never idles.

## Variants

- **waveform-line**: one mirrored 4 px line from `visualizeAudioWaveform`, 1 point per 6 px, amplitude 220 px, glow `drop-shadow(0 0 12px accent)`.
- **music-release**: 1080x1080, cover 520 px centered, 96 radial bars (width 8 px, length 40-180 px) around it, title and artist beneath at y 900.
