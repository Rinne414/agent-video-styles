# Karaoke Caption Short

Vertical faceless short where huge, word-by-word highlighted captions are the main visual, carried by a TTS voice over simple moving backgrounds or b-roll cards.

- **Primary tool**: Remotion with `@remotion/captions` (alt: HyperFrames caption components)
- **Format**: 1080x1920 30 fps; 20-60 s
- **Inputs to ask for**: script or topic, language + voice, highlight color, background choice (gradient, images, stock clips), optional music

## Look

| Token | Value (1080x1920) |
|---|---|
| Background | dark gradient `#0E0E12 -> #1A1A2E` with 2-3 blurred blobs (`blur(140px)`) drifting, or b-roll images with Ken Burns `scale 1.00 -> 1.08`, brightness 55% |
| Caption zone | center line at y ~1150 (60% height); keep clear: top 220 px, bottom 420 px, right 140 px (platform buttons). Center captions in the safe zone (x 80-900), accepting a ~50 px left shift from canvas center |
| Caption type | Montserrat / Inter 900 at 88-110 px, or Noto Sans SC 900 at 96-120 px; white `#FFFFFF`; 8 px black stroke (`paint-order: stroke`) or shadow `0 6px 0 rgba(0,0,0,0.6)` |
| Active word | highlight `#FFD400` (or brand), `scale 1.12`; pill-karaoke variant: pill behind the word, radius 16, padding 6x18 |
| Chunk size | Latin 2-4 words, max 22 characters per line; CJK 6-14 characters; 1-2 lines |
| Key terms | numbers and nouns in the highlight color even when not active; at most 1 emoji per chunk. Data in `content.json`: per sentence `"keyTerms": ["3.5", ...]` and `"emphasis": "<word>"`; `emphasis` must equal exactly one TTS word unit from `timeline.json` (CJK units are 1-3 characters and unpredictable, so read the timeline to pick them) |
| B-roll card | 880 px wide, radius 32, in the upper band y 380-1000: image, icon or a big number |
| Progress bar | 8 px at the very top, highlight color, width = elapsed fraction |

## Motion grammar

- **Chunk in**: `spring({damping: 14, stiffness: 220})` on `scale 0.8 -> 1` + opacity over about 6 frames. **Chunk out**: hard cut when the next chunk starts; no fades.
- **Active word**: switches at `floor(start_ms * fps / 1000)`; color or pill transition 2-3 frames.
- **Emphasis pop**: on 1 word per sentence, `scale 1.0 -> 1.18 -> 1.08` over 8 frames.
- **Background never stops**: blob drift 20-40 px/s or Ken Burns; change b-roll every 2-4 s.
- **Pattern interrupt** every 3-5 s: b-roll swap, 1.06 zoom punch, or a single emoji pop.
- **Never**: rotation, flashing, heavy bounce on captions, more than one emphasis pop per sentence.

## Structure (45 s = 1350 frames @ 30 fps; real lengths come from timeline.json)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-90 | Boldest claim or question; first chunk visible by frame 3 |
| Context | 90-300 | Why it matters, 1-2 sentences |
| Points 1-3 | 300-1140 | About 280 frames each, one b-roll card per point |
| Payoff | 1140-1290 | The takeaway, emphasis pop on the key word |
| CTA / loop | 1290-1350 | Follow or question; optionally phrase the last line to loop into the hook |

Composition length = sum of segment `duration_ms` + 0.3 s tail (use `calculateMetadata`). **Target length**: if the script is short, use rate -5% to +0%, 0.4-0.5 s gaps between sentences and a tail; a ~120-character Chinese script is ~24 s at +0%.

## Audio

Voice from `scripts/tts.py` (see `../audio-tts-captions.md`): `en-US-AndrewNeural`, `zh-CN-YunxiNeural` and similar, rate `+5%` to `+10%` for shorts. The script writes `timeline.json`: `{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`. Convert words to `@remotion/captions` `Caption` objects (`text`, `startMs`, `endMs`, `timestampMs`, `confidence`), with a leading space on Latin tokens, then group with `createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: 800-1200})`. Check the API against the official `remotion-captions` skill. `@remotion/captions` is optional for CJK: time-based grouping breaks on clause boundaries and TTS words lack punctuation, so use the character-count chunking recipe in `../audio-tts-captions.md` (split the original script at punctuation, map TTS words to clauses by cumulative character count, merge clauses of <= 3 characters into the next, cap at 14). Music bed -26 to -30 LUFS under the voice; final mix around -14 LUFS.

**Chunking rules**: break at punctuation and at pauses over 250 ms; never split a number from its unit; never split a CJK word across chunks.

## Agent brief (template)

```
Style: karaoke-caption-short (see references/styles/karaoke-caption-short.md)
Script: <text or path>  (or Topic: <topic>, write a 45 s script with a 3 s hook)
Voice: <voice id>, rate <+0% to +10%>
Captions: <2-4 words | single-word | pill-karaoke>, highlight <hex>, font <family>
Background: <gradient | images in path | stock clips in path>
Music: <path or none>
Format: 1080x1920 30fps
```

## Quality bar

- [ ] First caption visible by frame 3; the hook is under 3 s
- [ ] Active-word highlight within 1 frame of the audio
- [ ] No chunk over 2 lines; no line over 22 Latin or 14 CJK characters
- [ ] Captions never enter the platform UI zones
- [ ] The background moves or changes at least every 4 s
- [ ] Audio and video durations match within 0.3 s (`python scripts/inspect_video.py`)

## Pitfalls

- **Sentence-level timings**: TTS that returns sentence boundaries makes captions drift. Confirm `timeline.json` has one entry per word.
- **Broken CJK and numbers**: splitting a word or separating "3.5" from "倍" reads badly. Chunk on word boundaries.
- **Missing spaces**: joining Latin tokens without their leading spaces produces "Hellothere".
- **Busy b-roll**: captions over detailed imagery are unreadable. Darken to 55% and blur if needed.
- **CJK tofu**: load Noto Sans SC (or JP / KR) before rendering; a fallback font shows empty boxes.

## Variants

- **single-word**: one word at a time, 140-180 px, centered at y 960; best for 15-30 s high-energy clips.
- **pill-karaoke**: the whole sentence (max 2 lines) stays; a pill slides under the active word with a 4-frame ease.
- **template-swap-series**: freeze background, caption and card components; each episode only supplies a new script and image list.
