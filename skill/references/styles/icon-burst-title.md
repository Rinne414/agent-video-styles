# Icon-Burst Title Card

A short title card: a glowing dot bursts into rays, the title bounces in letter by letter, and three icons orbit together into a circular badge.

- **Tier**: experimental (few public examples; validated by one template)
- **Primary tool**: Remotion (alt: HyperFrames + GSAP)
- **Format**: 1920x1080 30 fps (vertical 1080x1920); 10-15 s (template: 15 s = 450 frames)
- **Inputs to ask for**: title (2-6 characters or short words; up to about 14 letters works with the long-title rules), tagline, three icon concepts with 1-2 word labels, accent hex (default orange), language

## Look

| Token | Value (1920x1080) |
|---|---|
| Background | `#1E1E1E`, plus a 700 px radial glow of the accent at 18% behind the focal point |
| Accent | brand orange `#E55A2B` (>= 4.5:1 against the ground, 4.6:1); light accent `#FFB38F` for taglines and glow |
| Text | `#FFFFFF`; title 160-200 px / 800, labels 44-52 px / 600 (100-120 px when each label is one word), tagline 56-80 px / 500 in `#FFB38F` |
| Fonts | Noto Sans TC (or Noto Sans SC / Inter for Latin) via `@fontsource`, named explicitly; otherwise CJK renders as boxes |
| Dot | 48 px circle, accent fill, glow `0 0 60px accent` |
| Rays | 12 rays at 30 deg steps, width 10 px, round caps, length 0 -> 460 px then retreat (see Burst), accent to light accent gradient |
| Icons | three line icons, 180 px, 8-11 px stroke (`absoluteStrokeWidth` for a fixed pixel stroke), round caps, in `#FFFFFF`: download arrow, gear, speech bubble (swap to fit the brief) |
| Badge | circle 520 px, accent fill, white ring 8 px, the three icons set on a 150 px radius (180 px icons at radius 150 keep corners inside the ring; at 1080p smaller reads weak) |
| Safe area | 80 px margin on 16:9; on 9:16 keep 220 px top and 300 px bottom clear |

## Motion grammar

- **Burst**: dot `translateY 320 -> 0` with `spring({damping: 12, stiffness: 140})` over 24 frames; at frame 36 the rays extend over 18 frames with `Easing.out(Easing.cubic)` while the dot scales 1 -> 1.4 -> 0. Then retract the tail ends outward and fade the rays over 18 frames so they never collide with the title.
- **Letters**: each letter `scale 0.4 -> 1` and `translateY 40 -> 0`, `spring({damping: 11, stiffness: 190})`, 6 frames apart up to 8 letters, 4 frames apart beyond that; all letters must land within the Title beat; light overshoot only. Title persists: at about 70% of the piece it moves to the top (y about 200, scale 0.6) and stays through the final lockup, or fades if the brief says so.
- **Icons in**: rows centered at y 650, 230 px apart, from x = -300 over 20 frames, 6 frames apart, `Easing.out(Easing.cubic)`; each label fades in 6 frames after its icon.
- **Orbit**: keep it continuous by converting each icon's row position to polar coordinates about the badge center (angle0, radius0), then interpolating angle (a full turn or more, clockwise) and radius together over 45 frames with `Easing.inOut(Easing.cubic)` to radius 150; the badge circle scales 0 -> 1 as they arrive.
- **Settle**: the badge moves left and scales to 0.8 over 24 frames (0.55 is too small to read), tagline slides in from the right over 18 frames.
- **Camera**: slow `scale 1.00 -> 1.03` over the whole piece so nothing is fully static.
- **Never**: linear easing, `Math.random()` (the ray and glow jitter, if any, use a seeded PRNG), more than 3 elements entering at once.

## Structure (15 s = 450 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Burst | 0-60 | Dot springs up, 12 rays burst out |
| Title | 60-150 | Letters bounce in, 6 frames apart (4 if over 8 letters), title held |
| Icons | 150-270 | Split screen: icons fly in left, labels on the right |
| Badge | 270-360 | Icons orbit and converge into the circular badge |
| Settle | 360-450 | Final lockup: title at top, badge (0.8) left of center, tagline right; settled by 405 and held at least 1.2 s; a fade to dark is optional, at most 9 frames after the hold |

Proportions scale with the requested length: 10 s = 300 frames (burst 13%, title 20%, icons 27%, badge 20%, settle 20%). The final tagline stays at least 1 s fully settled.

## Audio

Optional. A short low thump on each text entrance and a riser into the badge, synthesized in code (a Node script writing a WAV: sine 60-90 Hz decaying over 8 frames, noise riser 12 frames), around -18 dB. This is the most fragile step; skip it on a first attempt. A licensed or supplied sting also works. If the brief is silent, the sound items are N/A.

## Agent brief (template)

```
Style: icon-burst-title (see references/styles/icon-burst-title.md)
Title: "<text>"; Tagline: "<text>"
Icons: 1) <concept + label> 2) ... 3) ...
Accent: <#E55A2B | hex>; Ground: <dark | light>; Language: <en | zh-TW | zh-CN>
Format: 1920x1080 30fps, <15> s; sound <synth | path | none>
```

## Quality bar

- [ ] Ray burst, title, icon orbit and badge all visible in separate stills
- [ ] All text >= 4.5:1 against its ground (3:1 for display type over 60 px)
- [ ] The intended font rendered in a still (no box glyphs, no Arial fallback)
- [ ] Nothing crosses the 80 px safe area
- [ ] Final tagline settled and held >= 1 s
- [ ] Letters land on 6-frame spacing (4 beyond 8 letters), finish inside the Title beat, and rays are identical between renders (seeded)
- [ ] Thumps align within 1 frame of letter entrances (N/A if silent)

## Pitfalls

- **Tofu glyphs**: Chinese text without an explicit Noto font renders as boxes; vendor the font and wait with `delayRender`.
- **Network fonts**: `@remotion/google-fonts` fetches at render; use vendored `@fontsource` woff2 for offline.
- **Too many changes per edit**: change one thing per revision and judge the rendered MP4, not Studio, which stutters.
- **Dense label text**: two words per label, 44 px minimum.
- **Glow stacking**: glow on rays, dot and badge at once washes out the title; keep it behind one element per beat.
- **Orbit math**: express positions in polar form (see Orbit); set `transformOrigin` explicitly or the badge drifts.
- **Missing lockup**: the final frame needs title, badge and tagline together; plan their boxes before animating.

## Variants

- **vertical-intro**: 1080x1920, 10 s; title at y 520, icons stacked in a column at y 900-1500 with labels right, badge at y 1350, tagline y 1500.
- **light-ground**: `#FFF6E9` ground, ink `#2B2D42` text (white on orange only for display text over 60 px), the burst stays `#E55A2B`.
