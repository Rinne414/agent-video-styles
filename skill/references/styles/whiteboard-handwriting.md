# Whiteboard & Handwriting

Marker ink writes itself across a white board and doodles draw on stroke by stroke. The pen speed is the pacing; the narration says what the ink shows.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Format**: 1920x1080 30 fps (1080x1080 for the square cut, composed at 1088x1088 and cropped to 1080x1080 because HyperFrames widths must be divisible by 16); 30-90 s
- **Inputs to ask for**: the script as 3-5 idea blocks (label <= 4 words, one sentence, one doodle subject each), narration or "silent", marker colors if branded, language of the lettering
- **Tier**: experimental (few public examples; validated by one template)

## Look

| Token | Value |
|---|---|
| Board | `#FAFAF7`, 3 px frame `#D9D9D2` inset 24 px, marker tray 16 px strip at the bottom edge `#E6E6DF` |
| Ink | main marker `#1B1F2A`; accent markers blue `#1F5FBF` (5.8:1), red `#C62828` (5.4:1), green `#1B7F3B` (4.8:1, closest to the 4.5:1 bar); one accent used for emphasis per block |
| Stroke | round caps and joins, 6 px for lettering, 5 px for doodles, 4 px for arrows; width constant along the path |
| Lettering | single-stroke centerline paths (a Hershey-style single-line font or centerlines extracted at build time), headings 96 px, zone labels 72 px, body 56 px, line-height 1.3; Hershey glyphs are wide, about 0.64 x size per character (so "$100" at 56 px is 160 px: coins need r >= 90) |
| Doodles | built from lines, circles and rounded rectangles only, 220-380 px, max 25 path segments each; no fills except 30% marker hatching |
| Wobble | seeded per-path displacement <= 1.2 px baked into the path data at build time (no runtime randomness) |
| Layout | 4 zones of 840x400 px in a 2x2 grid with 80 px gaps, inside the 80 px safe area; reading order left to right, top to bottom |
| Safe area | 80 px on 16:9; on square keep 64 px |

Outline-only fonts and `<text>` elements cannot be drawn progressively: a dashoffset on a glyph outline traces its contour, not the pen path. Convert all text to centerline paths before the build, and check that every glyph looks like a letter in a still.

**Lettering source**: `npm pack hersheytext@2.0.0` (MIT) ships `hersheytext.json`; use the `futural` font (the `script`/`cursive` fonts read more handwritten). `chars[i]` is ASCII 33+i; `d` is an `M x,y L ...` string; `o` is the HALF advance; glyph y runs top-down with cap top at y=1 and baseline at y=22; space is not included. Layout: scale = size / 28, cap height = 0.75 x size, advance = 2 x o x scale, space = 16 units. Hershey covers ASCII only; other scripts need another centerline source. Vendor the paths at build time.

## Motion grammar

- **Write-on**: each path carries `pathLength="1"` and `stroke-dasharray="1 2"`; `stroke-dashoffset` goes `1 -> 0` with `ease: "none"`, duration `= pathPixelLength / penSpeed` (fractional-frame durations, no per-stroke minimum). Size the ink to the narration: lettering about 3000 px/s with no ramp or lift (per-stroke overhead dominates because Hershey strokes average about 100 px); doodles 1800 px/s with 2-frame ramp and lift; arrows 1200 px/s. Budget about 110 px of path per character at 96 px and 70 px at 56 px; a 30 s piece fits about 25 characters of 96 px lettering plus 4 doodle blocks. Also call the render function once at load so the paused first frame is correct.
- **Driver**: one proxy tween with `onUpdate` sets every dashoffset from the current time; this scales to hundreds of paths without hundreds of tweens (Remotion: `evolvePath(progress, path)`).
- **Pen tip**: a 28 px marker cap sprite placed at `path.getPointAtLength(progress * length)`, rotated 35 degrees, visible only while a path is drawing; it lifts (`translateY -12`, 6 frames) between strokes.
- **Between strokes**: pen lift only for doodles and arrows (2 frames); between words 4 frames; between blocks 20 frames.
- **Emphasis**: underline draws 4 frames after its word finishes (20 frames long), or a loose ellipse circles it (24 frames, overshoot of 10 px).
- **Arrows**: shaft draws, then the two head strokes draw in 4 frames each.
- **Erase**: only when a board is full: a 70 px wide eraser rectangle sweeps left to right over 18 frames, `power2.inOut`, revealing clean board.
- **Camera**: board scale `1.00 -> 1.02 -> 1.00` (sine) inside each block, about the active zone's centre, with a 30 px inner pad per zone, so far ink stays inside the safe area and zone changes have no jump (1.03 pushes far-zone ink 40+ px out). Alternatively zoom only the active zone's group.
- **Never**: fade-in of finished ink, text appearing letter by letter without pen order, two zones drawing at once, fills that pop in.

## Structure (60 s = 1800 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-150 | The question alone on an empty board in 96 px (about 11 characters in 90 frames at this size, more at 3000 px/s), underline at 120; an eraser sweep clears the board before the zones |
| Concepts 1-4 | 150-1350 | 300 frames each, one zone: label written (0-60), doodle drawn (60-200), annotation arrows or underline (200-260), hold (260-300) |
| Recap | 1350-1650 | Key words circled in order, arrows linking the 4 zones, one summary line written at 56 px |
| End card | 1650-1800 | Handle or CTA written once, settled by frame 1710, held to the end |

A 2x2 zone grid fills the safe area (880 of 920 px high), so a hook or recap never shares the board with it: separate them with an eraser sweep. Worked 30 s (900 frames): hook alone 0-120, sweep 120-140, 4 zones one per narration sentence 140-760 (about 155 each), sweep 760-780, end card 780-900. Do not add extra transition gaps: narration clips carry 0.7-0.8 s of trailing silence, and the sweep happens in it. For other lengths scale in proportion; 90 s adds a second board after one erase sweep. Narration is the clock when present: stretch the hold of each block so ink finishes before the sentence does.

## Audio

Voiceover is the natural mode: write the script first, run `scripts/tts.py`, set block lengths from the clip durations. Optional light acoustic music at 15% volume. Optional soft marker-scratch SFX tied to stroke start and end (synthesize or use a licensed pack; keep it under 25% volume). Captions optional at 44 px. A silent brief makes sound items N/A and the pen speed alone paces the piece.

## Agent brief (template)

```
Style: whiteboard-handwriting (see references/styles/whiteboard-handwriting.md)
Question / title: "<>"
Blocks: 1) label "<>" doodle <subject> note "<>" 2) ... 3) ... 4) ...
Recap line: "<>"
Markers: ink #1B1F2A, accent <blue|red|green>
Narration: <path or TTS voice, or "silent">
Format: 1920x1080 30fps, <n> s
```

## Quality bar

- [ ] No ink appears by fade; every mark is a drawn path from its first frame
- [ ] Every glyph in a still is a recognizable letter in the intended language
- [ ] Doodles recognizable at a glance (one subject each, <= 25 segments)
- [ ] Ink contrast >= 4.5:1 on the board for all colors
- [ ] One zone drawing at a time; each block finishes its ink before its narration sentence ends
- [ ] Everything inside the 80 px safe area; zones do not overlap
- [ ] Wobble is seeded (two renders give identical frames)
- [ ] Fonts or centerline paths are vendored; nothing fetched at render
- [ ] End card settled and held >= 1.5 s

## Pitfalls

- **Outline text**: stroking a glyph outline shows a contour, not handwriting. Use centerline paths.
- **Invented path data**: freehand coordinates from the model rarely look like letters or icons; generate icons from simple primitives and diagrams from a structured source such as Mermaid positions.
- **Dasharray units**: without `pathLength="1"`, dash lengths vary per path and speeds drift; set it on every path.
- **Too much at once**: a full board by second 20 loses the viewer; keep at most 4 zones.
- **Width bug**: square cuts at 1080 wide have black right-edge columns in HyperFrames; compose 1088 and crop.
- **Flat pacing**: one pen speed everywhere feels robotic; vary by element type as above.

## Variants

- **sketchbook**: `#F4EFE6` paper, graphite `#3A3A3F` lines at 85% opacity, one accent `#C2410C` (about 4.8:1) on at most 15% of the strokes, 3% paper grain, hand lettering slightly larger (104 px headings).
- **blackboard**: `#1F3A2E` board, chalk `#F2F2EC` at 85% opacity, 8 px strokes, 6% grain, accents chalk yellow `#F2D16B` and chalk blue `#8EC5F5`; an eraser smear (opacity 0.1) is fine, dust particles are not.
