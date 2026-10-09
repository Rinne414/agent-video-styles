# Apple Keynote Minimal

Pure black or white stage, huge clean type, one product hero and calm, measured springs. Restraint is the whole effect: every frame shows one thing.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Format**: 1920x1080 30 fps (vertical 1080x1920 variant); 20-40 s
- **Inputs to ask for**: product name, tagline, 2-3 features each as a 2-4 word claim, product image or screenshots (or a logo to act as hero), date/price/URL for the lockup

## Look

| Token | Value |
|---|---|
| Background | dark stage `#000000`; light stage `#F5F5F7`; no gradients except a soft product shadow |
| Text | dark stage: primary `#F5F5F7`, secondary `#86868B`; light stage: primary `#1D1D1F`, secondary `#6E6E73` |
| Accent | none by default; at most one gradient-filled word per video, e.g. `linear-gradient(90deg, #2997FF, #A855F7)` |
| Headline type | Inter Display / Inter Tight 600-700, 160-220 px at 1080p, tracking -0.04em, line-height 1.0, centered, 2-4 words |
| Subhead type | same family 500, 40-48 px, secondary color, max 8 words |
| Spec numerals | 260-360 px, weight 700, unit in 48 px secondary color beside it ("2x", "18 h"); single-letter units ("s", "x") may rise to 72 px so they do not look lonely |
| Product hero | centered, 40-55% of frame height; device frame built in CSS (radius 48 px phone, 24 px laptop) with the screenshot inside |
| Shadow | `0 60px 120px rgba(0,0,0,0.35)` on light stage only |
| Dark-stage device | fill `#1C1C1E`, 1 px border `#2C2C2E`, placeholder bars `#3A3A3C` (the shadow is invisible on black) |
| Safe area | 120 px on all sides |

Never ship SF Pro: it is licensed for Apple platforms only. Inter Display or Inter Tight is the closest free substitute.

## Motion grammar

- **Fade-up**: opacity 0 -> 1 plus `translateY 24 -> 0` over 20 frames, GSAP `power2.out` (Remotion: `Easing.bezier(0.25, 0.1, 0.25, 1)`).
- **Scale settle**: headlines scale `1.08 -> 1.00` while fading in over 24 frames; no overshoot. Remotion spring: `{damping: 26, stiffness: 100, mass: 1}`.
- **Mask reveal**: text rises out of a line mask (`clip-path: inset(100% 0 0 0) -> inset(0)`) in 16 frames, `power3.out`.
- **Word stagger**: 6 frames between words; letters never animate individually.
- **Product hero**: rises from `translateY 80px, scale 0.92, blur 8px` to rest over 40 frames `power3.out`, then floats (`translateY` sine, 6 px amplitude, 4 s period).
- **Light sweep**: a 20% white diagonal gradient band (~260 px wide, `skewX(-18deg)`) travels edge to edge of the hero once at reveal, 30 frames, `power1.inOut`; the overflow-hidden clip may raise a `container_overflow` info, mark it `data-layout-allow-overflow`.
- **Micro-motion**: every shot scales `1.00 -> 1.03` across its length so no frame is dead.
- **Transitions**: cut, or 12-frame dip to the stage color. No slides, wipes, whips or zoom blurs.
- **Never**: glow, particles, bounce, more than one moving element at a time, text over the product.

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Intro | 0-60 | Empty stage; one word ("Introducing") fades up and out |
| Hero reveal | 60-210 | Product rises out of darkness, light sweep at frame 150 |
| Name | 210-300 | Product name at 200 px, subhead fades in 12 frames later |
| Features 1-3 | 300-750 | 150 frames each: 2-4 word claim (60) then hero close-up or spec numeral (90) |
| Lockup | 750-900 | Name + tagline + date/price/URL, settled by frame 810 and held |

Structure proportions (not frame numbers) scale to the requested length; keep shots at 1.5-3 s (45-90 frames), never shorter in this variant.

**Text-led variant** (no hero between claims, e.g. a 25 s sequence of one-word claims): per claim, claim card 60 frames then proof visual or spec numeral 90 frames; then the lockup. Reading rule: `0.6 s + words / 3 s` per card.

## Audio

Minimal piano, soft synth pad or sparse percussion at 90-100 BPM. Music swells into the hero reveal; the only SFX is an optional low whoosh under the light sweep. Master around -14 LUFS. No voiceover; if one is required, it must be a single calm sentence per shot.

## Agent brief (template)

```
Style: apple-keynote-minimal (see references/styles/apple-keynote-minimal.md)
Stage: dark | light
Product: <name> - "<tagline>"
Hero: <product image / screenshot path / logo>
Claims: 1) "<2-4 words>" + <visual> 2) ... 3) ...
Spec numeral (optional): <number + unit>
Lockup: <date / price / url>
Format: 1920x1080 30fps, 30 s; music <path or none>
```

## Quality bar

- [ ] Exactly one element moves at any time
- [ ] Negative space >= 60% in every shot
- [ ] No headline longer than 4 words; no subhead longer than 8
- [ ] No easing overshoot anywhere
- [ ] Contrast: secondary text still >= 4.5:1 against the stage
- [ ] Lockup settled by frame 810 and held >= 1.5 s

## Pitfalls

- **Too static**: pure fades on a still stage read as a slideshow. Keep the 1.00 -> 1.03 micro-scale and the hero float running.
- **Decoration creep**: agents add gradients, glows and particles to "make it premium". Remove them; premium here means fewer things.
- **Weak hero**: a small logo floating in black is not a product shot. Build a device frame around a screenshot, or make the logo large (35-45% of frame height).
- **Gray-on-black text**: `#86868B` below 40 px on pure black becomes unreadable after compression; keep secondary text >= 40 px.
- **"Frozen" warning**: `inspect_video` may report frozen stretches on pure type cards even though the 1.00 -> 1.03 micro-scale runs; acceptable, confirm with two frames 1 s apart.
- **Wrong font**: bundling SF Pro violates its license; fallback to system fonts breaks the look. Load Inter Display/Tight before the first frame.

## Variants

- **light-stage**: swap tokens to the light column; use the product shadow for depth; hero reveal comes from below the frame instead of out of darkness.
- **fast-recap**: 0.5-1 s shots (15-30 frames) cut on every beat at 120 BPM, full-frame headlines alternating black and white stages, scale settle shortened to 10 frames with spring `{damping: 18, stiffness: 200}`; total 15-20 s.
- **vertical**: 1080x1920, headline 140-180 px, hero in the middle third, lockup in the lower third above 300 px of clear space.
