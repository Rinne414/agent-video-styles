# Flat Cartoon Explainer

Bright flat-vector pop-science: a simple host character, generic figures and icons drawn entirely in code, with every on-screen action pinned to a word of the narration.

- **Primary tool**: HyperFrames with Canvas / SVG + GSAP (alt: Remotion with inline SVG)
- **Format**: 1920x1080 30 fps (also 1080x1920); 45 s - 6 min (template: 60 s)
- **Inputs to ask for**: topic plus a fact list with sources (or a finished script), language + voice, optional brand palette

## Look

| Token | Value (1920x1080) |
|---|---|
| Background | flat cream `#FFF6E9` or pale blue `#E8F4FF`; floor band `#FFE2B8` along the bottom 160 px; at most one subtle radial highlight |
| Palette | coral `#FF6B6B`, yellow `#FFD166`, mint `#06D6A0`, blue `#118AB2`, violet `#8E7DFF`, orange `#FF9F1C`; ink `#2B2D42` |
| Outline | 5 px ink, `round` joins and caps, the same width on every object |
| Host character | head circle 160 px, capsule body 120x180, limbs as 16 px rounded strokes, dot eyes 12 px, arc mouth; one signature trait (antenna, hat, scarf); front or 3/4 view only |
| Host rig | all geometry in absolute coordinates, no `transform` attributes; shoulders at the body edge (x +-60, 24 px below the body top); upper arm 62, forearm 58; signed angles per arm: rest 0, point -90 / +90, cheer +-150, wave oscillation +-22; every rotate/scale tween sets `svgOrigin: "x y"` (pivot is in the parent's space, also for the nested forearm) |
| Figures and props | built from circles, rects and simple paths; 2 fills + outline; max 3 characters per scene |
| Text | Nunito / Baloo 2 / Noto Sans SC 700; labels 40-56 px, titles 84-110 px; speech bubbles white with a 4 px ink outline and a tail, drawn as ONE path (circle + tail; two shapes show a seam) |
| Captions | bottom center, 52 px / 700 ink on a white pill (radius 999, padding 10x28) |
| Layout | characters in the left third, the concept visual center-right, 96 px margins |

## Motion grammar

- **Pose-to-pose**: characters switch between 3-5 predefined poses by rotating shoulder and elbow angles over 8-12 frames (`power2.inOut` / `Easing.inOut(Easing.cubic)`); no walk cycles beyond a 2-pose bob.
- **Pop-in**: `spring({damping: 10, stiffness: 180})` or `back.out(1.7)` on `scale 0 -> 1`; overshoot is welcome here.
- **Squash and stretch**: `scale (1.15, 0.85) -> (0.95, 1.05) -> (1, 1)` over 10 frames on landings and pop-ins.
- **Idle**: 5 px bob on a 1.5 s sine; blink every 2.5-4 s (seeded) for 4 frames.
- **Word pinning**: each action has a trigger word in timeline.json and starts 2 frames before that word's `start_ms`.
- **No dead air**: if 60 frames pass without a triggered action, run secondary motion (floating icons, a 20 px camera pan, a prop wobble).
- **Transitions**: circle iris wipe in a palette color (14 frames) or a whip pan with 2-3 ghost copies at 30% opacity (12 frames).

## Structure (60 s = 1800 frames @ 30 fps; scene lengths come from narration, not this table)

| Beat | Frames | Content |
|---|---|---|
| Cold open | 0-150 | Host pops in on frame 0 and asks the question; title card |
| Setup | 150-450 | Everyday scenario with 1-2 figures that shows the problem |
| Mechanism 1 | 450-900 | Concept diagram assembled piece by piece, each label on its word |
| Mechanism 2 | 900-1350 | Analogy scene (e.g. pipes, kitchen, traffic) |
| Twist | 1350-1620 | Surprising number or fact with a big pop and squash |
| Wrap | 1620-1800 | Host recaps in one line and waves goodbye |

Single-mechanism topic (e.g. 50 s): Cold open 12%, Setup 8%, Mechanism 55% (3 sub-beats), Payoff 15%, Wrap 10%; drop the analogy and twist.

Transitions: put the cut in the middle of the gap between segments, at the frame where the iris fully covers the screen (circle grows 7 frames, shrinks 7).

Write a fact ledger (claim + source), the narration and a beat table (word -> action) before any code, and get them approved.

## Audio

Narration from `scripts/tts.py` (friendly voices such as `en-US-AvaNeural`, `zh-CN-XiaoxiaoNeural`); the `timeline.json` contract `{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}` is in `../audio-tts-captions.md`. Bed (ukulele or marimba, -28 LUFS) and cartoon SFX (pop, boing, whoosh, around -18 dB, at most one every 2 s) are optional: use them only if a track is supplied or you can synthesize them; narration-only is acceptable, and the sound quality items are then N/A. English captions: break at punctuation, split clauses over ~38 characters at the most balanced word boundary, merge orphans under 8 characters.

## Agent brief (template)

```
Style: flat-cartoon-explainer (see references/styles/flat-cartoon-explainer.md)
Topic: <topic>; Facts: <list with sources or path>
Host: <name, signature trait>; Audience: <kids | general | customers>
Voice: <voice id>; Language: <en | zh-CN>
Palette: <default | 6 hex>
Length: <seconds>; Format: <1920x1080 | 1080x1920> 30fps
```

## Quality bar

- [ ] Every narration sentence has at least one visual action pinned to a word
- [ ] No 2 s window without motion (`inspect_video.py` freeze check plus a contact sheet)
- [ ] Only the 6 palette colors + ink; identical outline width everywhere
- [ ] Characters only in front or 3/4 view; no attempted turns or walks
- [ ] Labels and captions at least 40 px
- [ ] Every fact in the narration traces back to the fact ledger

## Pitfalls

- **Turns, walks, natural limbs**: code-drawn rigs look broken when they try. Cut between poses and move props instead of bodies.
- **Static opening**: a 3 s near-static first scene loses the viewer. Something moves on frame 0.
- **Token drift**: stroke width or colors changing between scenes look amateur. Define the tokens once and reuse them.
- **Fonts**: do not assume Baloo 2 or Nunito auto-resolve; vendor `@fontsource/baloo-2` and `@fontsource/nunito` latin-700 woff2 into `fonts/` (look up exact versions).
- **Over-detail**: gradients, textures and 20-part characters slow rendering and break the flat look.
- **Text walls**: more than 6 words on screen besides captions defeats the cartoon; let the drawing explain.

## Variants

- **flat-cutout**: each object gets a hard offset shadow `4px 6px 0 rgba(0,0,0,0.13)` and a +/-2 deg rotation jitter per pose change, like paper cutouts.
- **vertical-short**: 1080x1920; host at y 300-800, concept visual y 800-1300, captions at y 1380; 30-60 s.
- **icon-infographic**: no characters; flat icons (64-160 px) with labels assemble the concept; same palette and outline.
