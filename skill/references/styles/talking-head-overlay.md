# Talking-Head Overlay Package

Lower thirds, glass badges, step numbers and data callouts pinned to the speaker's words, laid over the user's own footage and never covering the face. Ships composited or as a transparent overlay layer.

- **Primary tool**: Remotion (alt: HyperFrames `talking-head-recut`)
- **Format**: match the footage (1920x1080 or 1080x1920, same fps as the source); duration = footage length; overlay-only export as ProRes 4444 `.mov` or VP9 WebM with alpha
- **Inputs to ask for**: footage file (or "overlay only" + duration), word timestamps or permission to transcribe, speaker name and title, which points / numbers to call out, brand accent hex, where the face sits (or sample frames to find it)

## Look

| Token | Value (1920x1080) |
|---|---|
| Face-safe box | the speaker's head + shoulders box plus 10% margin; nothing may enter it. Default for a centered speaker: x 640-1280, y 120-760; shift it for an off-centre speaker (left third: x 150-590). The box covers head and shoulders, ending at the collar line; a lower third may overlap the torso, never the box. Keep overlay rects in `content.json` and test them against the box with a small node script |
| Lower third | anchored 64 px from left, 120 px from bottom; 6 px accent stripe + panel `rgba(10,10,12,0.72)`, blur 16 px, radius 12; name 44 px / 700 `#FFFFFF`, title 28 px / 500 `#C9CDD4` |
| Glass badge | pill radius 999, padding 14x24, fill `rgba(255,255,255,0.10)`, border 1 px `rgba(255,255,255,0.22)`, blur 18 px; text 30 px / 600; optional 28 px line icon |
| Step numeral | "01" (unless the user's copy differs) 160 px / 800 in the accent color, label 40-44 px / 600 beside it |
| Step panel | card 740x260, fill `rgba(10,10,12,0.72)`, on the empty side, numeral 160 px left, label right, 6 px accent edge; wipes in from the empty-side edge over 12 frames |
| Data callout | number 120-160 px / 800 with `font-variant-numeric: tabular-nums`, unit 40 px, caption 28 px, 3 px accent leader line toward the empty side |
| Side panel (pip-split) | speaker scaled to 42% width on the right, radius 24; panel on the left 50% with 64 px padding, fill `#111318` at 92% |
| Readability scrim | `linear-gradient(rgba(0,0,0,0.55), transparent)` over the top 40% only when text sits on bright footage |
| Burned-in captions | bottom band y 860-1000; 2-word uppercase chunks or full sentences, 54 px / 800 white, 6 px black stroke |
| Type | Inter (Latin), Noto Sans SC (CJK); accent fallback `#4F8CFF` |

At most two overlays on screen at once, and never two in the same quadrant.

## Motion grammar

- **Lower third in**: stripe `scaleY 0 -> 1` in 8 frames (`Easing.out(Easing.cubic)`), panel wipes from the left with `clip-path: inset(0 100% 0 0) -> inset(0 0 0 0)` in 12 frames, text rises 16 px with 3-frame stagger. Out = reverse in 10 frames.
- **Badges**: `spring({damping: 16, stiffness: 200})` on `scale 0.85 -> 1` + opacity; exit 6-frame fade.
- **Count-ups**: 24-36 frames, `Easing.out(Easing.cubic)`, tabular numerals so width never jitters.
- **Word pinning**: an overlay starts at `round(start_ms * fps / 1000) - 2` frames of its trigger word, so it lands just before the word is heard.
- **Shape morph**: pill -> card -> mini chart as one continuous shape (interpolate width, height and radius over 14-18 frames) instead of three separate pop-ins.
- **Punch-in** (composited only): cut footage scale 1.00 -> 1.08 on emphasis words; a cut, not an eased zoom.
- **Never**: animate over the face, keep the lower third up for the whole video, bounce body text.

## Structure (60 s talk = 1800 frames @ 30 fps; real frames come from word timestamps; scale to length)

| Beat | Frames | Content |
|---|---|---|
| Identity | 30-150 | Lower third: name + title |
| Point 1 | ~300-390 | Step badge "01" + 3-5 word label on the word "first" |
| Number | ~480-570 | Data callout counting up on the spoken number, held for the sentence + 0.5 s |
| Key claim | ~900-1080 | pip-split: speaker shrinks, pull-quote panel takes the empty side |
| Points 2-3 | ~1200-1560 | Step badges "02", "03" |
| Outro | 1710-1800 | Handle / CTA badge |

Short-cut 25 s, 3 steps + callout + CTA: lower third 3-18% of runtime, steps 24-75% (3 x ~4 s), callout 77-91%, CTA 93-100%. Silent or no transcript: place beats by this scaling and mark trigger-word and spoken-number items N/A.

Rule of thumb: one overlay every 8-10 s on average; each readable for at least `0.5 s + words / 3.5 s`.

## Audio

The footage audio is the master clock. Get word timings by transcribing the footage (Whisper, or `@remotion/openai-whisper`) into the timeline.json shape from `../audio-tts-captions.md`: `{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`. Optional music bed at -26 to -28 LUFS ducked under the voice; soft pop on badges around -18 dB, whoosh on panel moves.

## Agent brief (template)

```
Style: talking-head-overlay (see references/styles/talking-head-overlay.md)
Footage: <path> (<w>x<h>, <fps> fps) or "overlay only, <duration> s, <w>x<h>"
Words: <timeline.json path> or "transcribe it"
Face: <left / center / right> or "sample frames and find it"
Speaker: <name> - <title>
Call-outs: steps <list>, numbers <list>, key quote "<sentence>"
Brand: accent <hex>, font <family>
Deliver: <composited mp4 | transparent prores 4444 | webm alpha>
```

## Quality bar

- [ ] No overlay intersects the face-safe box on any frame (check stills every 2 s)
- [ ] Every overlay starts within 3 frames of its trigger word
- [ ] At most 2 overlays visible at once, never in the same zone as captions
- [ ] Lower third visible 3-5 s, not the whole video
- [ ] Only numbers actually spoken appear in callouts
- [ ] Overlay-only export keeps alpha (`ffprobe` shows `yuva444p10le` / `yuva420p`) and was checked over a test background, e.g. `ffmpeg -f lavfi -i color=c=0xd8a838:s=1920x1080:r=30:d=<s> -i overlay.mov -filter_complex "[0][1]overlay=format=auto,format=yuv420p" -ss <t> -frames:v 1 alphatest.png`

## Pitfalls

- **Overlays on the face**: agents place graphics by layout, not by looking. Define the face box first from sampled frames and test every overlay rect against it.
- **Invented data**: callouts with numbers the speaker never said. Use skeleton lines or the transcript's own figures.
- **fps drift**: 29.97 footage in a 30 fps composition drifts by about 1 frame every 33 s. Match the composition fps to the source and use `OffthreadVideo`.
- **Lost alpha**: rendering an overlay to H.264 MP4 silently drops transparency. Use ProRes 4444 or VP9 with an alpha pixel format, `--image-format=png`, and no background fill.
- **PowerPoint over a vlog**: too many overlays bury the speaker. Cut half of them.

## Variants

- **overlay-only**: render just the graphics on a transparent canvas the length of the footage; `backdrop-filter` blur has nothing to sample, so raise panel fill alpha 0.72 -> 0.82 or accept the difference and tell the user; set `Config.setVideoImageFormat("png")` when one project exports both mp4 and mov; `npx remotion render <Comp> overlay.mov --codec=prores --prores-profile=4444 --pixel-format=yuva444p10le --image-format=png` (confirm flags in `../tools/remotion.md`).
- **pip-split**: on key claims, scale the footage to 42% width with radius 24 and slide it right over 14 frames; the left panel carries a quote, chart or list.
- **vertical-talk**: 1080x1920; captions at y 1180-1450, badges at y 260-520; keep the right 140 px and bottom 420 px clear of platform buttons.
