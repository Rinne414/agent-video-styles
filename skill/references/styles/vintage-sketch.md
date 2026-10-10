# Vintage Sketch

Sepia paper, engraving-style line art that draws itself on, classic serifs and rust-red margin notes: a printed field guide in motion. Calm and tactile; mood over speed.

- **Primary tool**: HyperFrames + GSAP (alt: html-capture with a canvas page)
- **Tier**: experimental (few public examples; validated by one template)
- **Format**: 1920x1080 30 fps (4:5 variant 1080x1350); 20-45 s
- **Inputs to ask for**: title, 3 subjects (each: name, one-line fact, optional line-art SVG or a licensed photo to redraw), era or date line, source line, music or voiceover

## Look

| Token | Value |
|---|---|
| Paper | `#EFE3C8`; baked grain (seeded numpy + PIL, saved as JPEG quality 92: fine for a full-frame background) at 10% multiply, faint horizontal fold at 50% height (2 px, 8% brown), vignette 25% at corners |
| Ink | sepia brown `#3B2A1A` for lines and headlines (contrast on paper about 11:1); secondary `#6B5640` |
| Rust accent | `#A4452C` (about 4.7:1 on the paper): figure numbers, notes, stamps, leader lines; used on <= 10% of the frame |
| Headline type | EB Garamond 600, 100-140 px, tracking 0, line-height 1.05, sentence case, max 6 words |
| Note type | EB Garamond italic 400, 34-40 px in rust (hand variant: an OFL script font such as `@fontsource/caveat` 400-700 or `@fontsource/homemade-apple` 400 at 40-44 px, rust, -1 deg per note; confirm in a snapshot); figure labels `Fig. 1` small caps 30 px, tracking 0.08em |
| Line art | contour 3 px round caps; hatching 1.5 px lines at 9 px spacing, 45 deg, shading by clipping hatch sets to shadow shapes; the 40-line cap protects draw time, so spend it well: hatch only the shadow side of 2 shapes per plate, optionally a second set at -45 deg on the darkest shape; large shapes get a 3 px contour plus a 2 px inner contour |
| Plate | art fills 55-60% of frame height inside a 2 px double-rule frame: outer rule 40 px from the frame edge, inner rule 8 px inside it, decoration only; text safe area stays 96 px |
| Safe area | 96 px on 16:9; 72 px on 4:5 |

Subjects must be simple enough to draw as paths (building, tool, plant, gear, map outline). Geometry helpers (about 100 lines of JS) make mechanisms drawable: `gearPath(n, rRoot, rTip, type)`, `ratchetPath` for asymmetric teeth, `spiralPath`, `sectorPath` (annulus sector for clip-based shading), and a hatch generator returning one `<path>` per line. Do not invent engraving of complex scenes: ask for line-art SVGs, or trace a licensed or public-domain image into a few contours. Heritage photos need a licence check; redrawing them as outlines does not remove it. Fonts are vendored: pin `@fontsource/eb-garamond` to an exact version and declare `@font-face` with root-relative woff2 (no network at render; Garamond is not on HyperFrames' auto-resolve list, so confirm in a snapshot).

## Motion grammar

- **Draw on**: each path gets `pathLength="1"`, `stroke-dasharray="1 2"` (a gap longer than the path hides the round cap at offset 1), `stroke-dashoffset 1 -> 0` over 60-90 frames, tweened as `attr: {"stroke-dashoffset": ...}` (tweening it as CSS rounds to whole pixels, so with `pathLength="1"` the lines stay invisible until 50%), GSAP `power2.inOut`; contours first, 3-4 paths staggered 8 frames.
- **Hatching**: hatch lines draw one after another, 1 frame apart, 24-40 frames, starting once the contour is 80% drawn.
- **Notes**: up to 3 per plate, appearing 26 frames apart from about 30% into the plate. Each stays on screen at least `0.5 s + words / 3.5 s` before the plate fades. Rust note fades in and rises 8 px over 10 frames; its leader line (1.5 px) draws 12 frames ending on a 6 px dot; note appears 6 frames after the leader starts.
- **Stamp**: scale `1.15 -> 1` and rotate to -4 deg over 6 frames, `power3.out`, opacity 0.9 with `mix-blend-mode: multiply`; one stamp per plate max.
- **Paper drift**: whole stage `scale 1.00 -> 1.03` across each plate, so nothing is static.
- **Transitions**: fade the old plate over 8 frames with an ease-out and start the next headline rise at least 8 frames after the fade starts; never show two headlines in the same place (ghosting). Or use a 12-frame page-turn wipe (clip-path from the right edge).
- **Never**: bounce, springs, colors beyond ink, rust and paper, live SVG `feTurbulence` per frame (bake the grain once), centered scatter layouts.

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Title plate | 0-13% (120) | Double-rule frame draws, title rises line by line, era or date in rust |
| Plate 1-3 | next 75% | 225 frames each at 30 s: contour draws (0-40%), hatching (27-53%), figure label and notes (49-76%), hold with drift to the end |
| Colophon | last 12% (105) | Closing line, source credit, stamp; settled by 40% of its length and held at least 1.5 s |

Proportions scale to the requested length: 20 s keeps 2 plates, 45 s gives 4. Minimum plate length = last note start + its read time + 8 frames; colophon at least 90 frames (stamp held 1.5 s). Worked 25 s: title 75, 3 plates x 190, colophon 105.

## Audio

Soft solo piano, music box or a low string pad at 70-90 BPM; or a calm voiceover where each plate length comes from the narration timeline (`../audio-tts-captions.md`). SFX: quiet pencil-scratch noise under draw-ons (synthesize filtered noise, 1-2 kHz band), paper tick on the stamp. Silent brief: sound items N/A.

## Agent brief (template)

```
Style: vintage-sketch (see references/styles/vintage-sketch.md)
Title: "<title>"; era/date: <...>
Plates: 1) <subject> + line art <svg path or "draw simple"> + note "<one line>"
        2) ... 3) ...
Source line: "<...>"
Audio: <music path / voiceover script / none>
Format: 1920x1080 30fps, 30 s (or 1088x1350 then crop to 1080x1350)
```

## Quality bar

- [ ] Only paper, ink and rust colors; rust <= 10% of any frame
- [ ] Text contrast >= 4.5:1 (rust notes >= 34 px on paper)
- [ ] Nothing under 30 px; nothing inside the safe area margin
- [ ] Every plate shows its line art fully drawn for >= 1 s
- [ ] Intended serif confirmed in a snapshot (not Times fallback)
- [ ] Sample or invented facts are labelled as such on screen; photos have a licence
- [ ] Colophon settled and held >= 1.5 s

## Pitfalls

- **Unconvincing engraving**: agents draw thick cartoon outlines. Use 3 px contours plus fine parallel hatching, never solid fills; contours of uniform weight with one hatched crescent read as a technical diagram, not engraving.
- **Grain cost**: live `feTurbulence` or CSS blur on a full-frame layer crawls in headless Chrome; render the grain once to PNG.
- **Width bug**: HyperFrames widths not divisible by 16 black out the right 8 px, obvious on light paper. For 1080-wide compose 1088 with art in the left 1080 px, render, then `ffmpeg -vf crop=1080:1350:0:0`.
- **Fallback fonts**: a silent Times fallback kills the look; vendor the woff2 and check `Fetched`/`font_family_without_font_face` in `check`.
- **GSAP chains on one SVG element**: `tl.set(el, {rotation:0, svgOrigin})` at time 0 and repeat `svgOrigin` in every tween. `check` warns `GSAP target not found` for shared selectors absent in a scene (harmless); `data-layout-allow-overlap` must sit on the text elements, not scene sections.
- **Unlicensed heritage photos**: redraw from public-domain sources only.

## Variants

- **field-guide**: plates numbered `Fig. 1-3`, Latin-style caption under each (italic 30 px), a scale bar (200 px, ticks every 40 px) drawn in 20 frames.
- **postcard**: plate inside a `1560x1000` postcard with a stamped postmark (rust circle 160 px) and a short message in italic; for 4:5 stack postcard above the title.
