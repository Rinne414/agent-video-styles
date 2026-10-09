# Dark Diagram Explainer

A narrated, faceless explainer: SVG diagrams build piece by piece on a dark canvas, synced to the voice. "Kurzgesagt meets Fireship."

- **Primary tool**: Remotion (alt: HyperFrames, which has an official `/faceless-explainer` skill)
- **Format**: 1920x1080 30 fps (or 1080x1920 for Shorts); 30-120 s
- **Inputs to ask for**: topic, audience level, target length, the script (or permission to write one and get it approved first), voice, aspect ratio

## Look

| Token | Value |
|---|---|
| Background | `#0A0A0A`; optional dot grid (2 px dots every 40 px at 6% white) and a soft vignette |
| Primary accent | `#6366F1` indigo - the active node or current step |
| Result accent | `#22C55E` green - outputs, success, the "after" state |
| Problem accent (optional) | `#F43F5E` - errors, the "before" state |
| Text | `#FAFAFA`, muted `#A1A1AA` |
| Type | Inter 600-700; scene title 64-80 px; diagram labels 28-34 px |
| Nodes | rounded rects radius 14, fill `#18181B`, stroke 2 px `rgba(255,255,255,0.3)`; active node stroke = accent + glow `0 0 32px` accent at 40% |
| Arrows | 3 px strokes, round caps, 10 px arrowheads, 60% white; active path in accent |
| Icons | one line-icon set (Lucide or Tabler), 2 px stroke, 48-64 px |
| Diagram safe zone (16:9) | y 150-820 on screen: title above, captions below (y 840-960). Park or hide nodes that would fall outside it at the current camera stop; labels >= 30 px |
| Captions | bottom center, max 2 lines, 44-52 px (16:9) / 56-64 px (9:16); 120 px from the bottom on 16:9, 380 px on 9:16; the current word in accent |

## Motion grammar

- **Narration is the master clock**: every visual event is keyed to a word in `timeline.json`: `frame = segmentStartFrame + round(word.start_ms / 1000 * fps)`. Never hardcode durations.
- **Node entrance**: `spring({damping: 18, stiffness: 140})` driving `scale 0.85 -> 1` and opacity; its label follows 4 frames later.
- **Arrows**: draw with `stroke-dashoffset` over 12-18 frames, `Easing.inOut(Easing.quad)`, starting only after the source node settles.
- **Focus**: when the narration moves to a new node, the previous nodes dim to 40% over 8 frames and the new one gets the accent stroke.
- **Camera**: the diagram lives on one large canvas; move between regions with `translate + scale` over 20-30 frames, `Easing.inOut(Easing.cubic)`; between moves keep a 2% scale drift.
- **Scene change**: 8-frame dip to black or a fast canvas whip-pan; never a static title card longer than 2 s.
- **Idle limit**: something visibly changes at least every 60 frames.
- **Never**: more than 7 nodes visible at once, decorative motion unrelated to the narration, captions overlapping the active node.

## Structure (60 s narrated, ~140-150 words)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-150 | A question or surprising claim with one big visual metaphor |
| Setup | 150-450 | The problem: 2-3 nodes, "before" state in red |
| Mechanism | 450-1350 | The diagram builds in 3-5 steps, 150-240 frames each |
| Payoff | 1350-1650 | The "after" state in green; the takeaway sentence on screen |
| Outro | 1650-1800 | One-line summary + handle, held |

Scale proportionally for other lengths (55 s: Hook 8%, Setup 17%, Mechanism 50%, Payoff 17%, Outro 8%). Mechanism steps are one segment each; extra segments are fine to hit the length. Words = (target s - 1.5 s tail - 0.15 s x segments) x 2.4 for `en-US-AndrewNeural` at +0% (~2.4 words/s). The table is a target. Real boundaries come from the narration: one `timeline.json` segment per beat, scene length = segment `duration_ms` + 8 frames of padding.

## Audio

Voiceover is required. Write the script first, generate audio and word timings with `scripts/tts.py` (contract: `{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`), or align a recorded voice the same way; see `../audio-tts-captions.md`. Music and SFX are optional unless supplied or asked for (ambient, 80-100 BPM, ducked to -24 to -28 LUFS; soft pop on node entrances, quiet whoosh on camera moves). Voice-only is acceptable; say so. Spelled-out acronyms: store `speech` and `caption` per segment, split caption on whitespace, give `merge` index ranges for spelled-out letters, and throw if the token count differs from the TTS word count.

## Agent brief (template)

```
Style: dark-diagram-explainer (see references/styles/dark-diagram-explainer.md)
Topic: <what to explain> for <audience>, <length> s
Script: <text> | "write it first and wait for my approval"
Key diagram: <nodes and how they connect>
Voice: <tts voice id or recorded file>, captions on
Accents: primary <hex>, result <hex>
Variant: none | black-canvas-neon | vertical-short
Format: 1920x1080 30fps; music <path or none>
```

## Quality bar

- [ ] Every noun the narration names appears on screen within +-0.3 s
- [ ] No idle stretch longer than 2 s, except the end card (give it a slow glow or drift, or run `inspect_video.py --tail-hold`)
- [ ] Captions max 2 lines; diagram stays inside the safe zone; active-word accent has >= 4.5:1 contrast (lighten indigo or use white)
- [ ] Max 7 nodes visible; one icon set; one accent per role
- [ ] Final takeaway held >= 1.5 s
- [ ] Audio and video durations match within 0.3 s (`scripts/inspect_video.py`)

## Pitfalls

- **Visuals before script**: building scenes first and fitting narration later causes drift. Script, then TTS timeline, then scenes.
- **Slideshow feel**: separate static slides with fades. Use one canvas and move the camera.
- **Dense diagrams**: more than 7 boxes become unreadable at 720p; split into two camera stops.
- **Captions repeating labels**: if a label says it, shorten the label, keep the caption.
- **Mispronounced acronyms**: write them phonetically in the TTS text ("S Q L", "Kubernetes") while the screen shows the correct spelling.
- **Hardcoded durations**: change a word and everything slides. Always derive frames from `timeline.json`.

## Variants

- **black-canvas-neon**: pure `#000000` with a slow star-field or dot-field wave backdrop; white line art plus one purple accent `#A855F7`; 900-weight headline type; a HUD capsule at the top ("02 / RETRIEVAL", 24 px, 1 px border) and a 4 px chapter progress bar at the bottom; 1280x720 or 1920x1080; long-form 3-5 min; Chinese subtitle blocks capped at 16 characters, ~5.5 characters/s.
- **vertical-short**: 1080x1920, 30-45 s; diagram in the middle third, captions 60 px above the 380 px bottom safe zone, hook spoken within the first 1.5 s.
