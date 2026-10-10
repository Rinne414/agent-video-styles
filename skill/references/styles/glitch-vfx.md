# Glitch & VFX Hype

Glitch works as short bursts, not constant noise. A seeded scheduler fires 3-6 frame bursts of RGB split, slice tearing and flicker, and the picture settles to clean, readable type in between. It is most often an accent inside other styles (saas-launch-promo, cinematic-hud-reel); this recipe also covers a standalone 5-20 s sting.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Format**: 1920x1080 30 fps (16:9); 9:16 composed at 1088x1920 and cropped to 1080x1920 (HyperFrames widths must be divisible by 16); 5-20 s
- **Inputs to ask for**: title or logo (vector or text), tagline, 2 accent colors or the default cyan and magenta, music file or BPM, seed number, whether the target audience needs reduced flashing
- **Tier**: experimental (few public examples; validated by one template)

## Look

| Token | Value |
|---|---|
| Ground | `#05060A`; scanlines 2 px at `rgba(255,255,255,0.04)`, 4 px pitch, drifting whole pixels per frame |
| Type | clean base layer `#F2F5FA` (above 17:1), Space Grotesk 700 (800 does not exist in the package) or Inter 800, vendored, 140-220 px, tracking -0.03em, max 3 words per card |
| Channel colors | cyan `#00E5FF` and magenta `#FF2E93` for the split copies only, never for body text; blend mode `screen` on the dark ground |
| HUD marks | corner brackets 48 px arms, 3 px `#F2F5FA` at 50% opacity, 80 px inside the frame; tiny mono labels (JetBrains Mono 22 px, `#B8C0CC`) only when decorative |
| Hologram | cyan `#00E5FF` edge-lit outline version of the logo at 40% opacity under the solid one: 3 px stroke, plus scan stripes 1.5 px every 4 px at 38% |
| Safe area | 96 px on 16:9; 220 px top and 340 px bottom on 9:16 |

## Motion grammar

- **Burst list**: bursts are a list `{start, len, intensity}` built once at build time and stored in the content file. For short stings write the fixed bursts from the Structure table by hand (the seed then drives only per-frame slice and offset generation); for pieces over 20 s, generate the list with `mulberry32(seed)` using gaps of 18-45 frames, lengths of 3-6 frames, intensity 0.4-1.0. Frame `f` is inside a burst if `start <= f < start + len`. Every effect below reads only that frame's `(burstIndex, f - start)`.
- **RGB split**: three copies of the element (red, green, blue channels via SVG `feColorMatrix`, or tinted duplicates with `mix-blend-mode: screen`); offsets `+-(4 + 10 * intensity)` px in x and `+-(2 * intensity)` px in y, re-drawn each frame from the seeded sequence.
- **Scanline tearing**: 4-8 horizontal slices 20-120 px tall (`clip-path: inset(top 0 bottom 0)`), each shifted `+-(10 + 50 * intensity)` px in x, new random slices every 2 frames.
- **Hologram flicker**: opacity alternates `1 / 0.6 / 1 / 0.85` every 2 frames for 8-12 frames while a bright scan line sweeps top to bottom at 120 px per frame.
- **Resolve**: a title enters as a burst (6 frames, strong), then 2 weaker aftershocks 9 and 21 frames later, then holds clean. The aftershocks belong to the Resolve; the 12-clean-frame rule counts from the end of the last aftershock.
- **Shatter transition**: the outgoing frame is cut into a 12x7 grid of tiles (`clip-path` or canvas sub-rects), each tile drifts `20-80` px and rotates `+-8` degrees while fading over 14 frames, per-tile delay `0-10` frames from the seed, so the whole shatter lasts 24 frames; give tiles a visible fill (a slice of the picture, not empty dark squares) and a 1 px edge; the incoming scene sits underneath.
- **Hard cut**: a 2-frame full-frame channel split (offset 24 px) on the cut itself, then clean.
- **Camera**: slow `scale 1.00 -> 1.03` on holds so clean frames are never frozen.
- **Never**: continuous noise, unseeded randomness, text legible only between bursts of under 12 clean frames, full-frame flashes, more than 3 flashes in any one second (the WCAG 2.3.1 general flash threshold; stay under it).

## Structure (10 s = 300 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Idle | 0-30 | Dark ground, scanlines, HUD brackets draw on; one micro-burst at frame 24 |
| Reveal | 30-90 | Title resolves from a strong burst, two aftershocks, hologram outline settles |
| Hold | 90-210 | Clean title and tagline (tagline enters at 96); micro-bursts at 120 and 168, 3 frames each |
| Shatter | 210-234 | Tile shatter (24 frames: 14 fade + 0-10 delay) to the next card or to the end logo |
| End card | 234-300 | Logo or CTA fully clean, settled by frame 270 and held to the end |

Hologram-then-shatter sting (tagline on the end card): flicker in 0-60 using the `1 / 0.6 / 1 / 0.85` pattern with scan sweeps at 20 and 50, hologram settles by 90, hold clean 90-200, shatter 200-224, logo locks at 226 with a strong burst, tagline enters 232-246, settled by 250, held to 300.

Proportions scale to the requested length: 5 s keeps Idle 15, Reveal 45, Hold 30, End 60 (shatter folded into the cut); 20 s repeats Hold and Shatter once per card. When used as an accent in another style, insert 3-4 frame bursts only at cuts and reveals, at most 4 per 30 s, and keep the host style's tokens.

## Audio

Bass-heavy electronic or synthwave, 120-140 BPM; at 120 BPM place bursts on multiples of 15 frames so they hit the beat. SFX: a short digital zap on each burst, a low impact on the reveal, a crunchy sweep on the shatter (synthesize in code or use licensed packs). A silent brief makes sound items N/A; sync is then checked by frame numbers only.

## Agent brief (template)

```
Style: glitch-vfx (see references/styles/glitch-vfx.md)
Title: "<>"   Tagline: "<>"   Logo: <path or text>
Mode: standalone sting | accent inside <style id>
Seed: <int>   Colors: cyan #00E5FF, magenta #FF2E93 (override if branded)
Music: <path>, BPM <n> or "silent"
Reduced flashing: yes | no (yes lowers intensity to 0.5 and bursts to 3 frames)
Format: 1920x1080 30fps, <n> s
```

## Quality bar

- [ ] Same seed gives identical frames on two renders
- [ ] At most 3 flashes in any one second, and no full-frame flash
- [ ] Every title/tagline has >= 12 consecutive clean frames before the next burst or cut
- [ ] Clean base text >= 4.5:1; channel-colored copies are decoration only
- [ ] Bursts are 3-6 frames; total burst time <= 25% of the piece
- [ ] Text and logo inside the safe area, including tear offsets (max 60 px)
- [ ] No frame static longer than 1 s except the end card
- [ ] Fonts vendored and confirmed in a still (not a fallback)
- [ ] End card clean, settled and held >= 1.5 s
- [ ] Silent brief: beat sync checked by frame numbers only (note it)

## Pitfalls

- **Constant noise**: glitch everywhere kills legibility and looks cheap; bursts must be rare.
- **Unseeded randomness**: `Math.random()` makes frames differ per render; use the seeded schedule built at build time.
- **Flashing risk**: rapid full-frame flashes can trigger photosensitive reactions; respect the 3-per-second cap and offer the reduced mode.
- **Filter cost**: stacked SVG filters on full-frame layers slow rendering; apply them only to the title layer and only during bursts.
- **Compression mush**: fine scanlines and noise turn to blocks in H.264; keep scanlines 2 px and low contrast, bursts short.
- **Width bug**: 9:16 compositions at 1080 wide render black right-edge columns in HyperFrames; compose 1088 and crop.
- **Off-brand**: a glitch accent on a calm brand reads as a broken video; use the as-accent variant sparingly or skip it.

## Variants

- **as-accent**: no HUD, no scanlines; 3-4 frame RGB split plus 1 slice tear on a cut or headline slam, at intensity 0.6, max 4 per 30 s, all aligned to beat frames.
- **vhs-tape**: ground `#14110F`, warm highlights, a 60 px tracking bar rolling up at 14 px per frame, horizontal noise lines (seeded), date stamp in mono `#F2E8D0` 30 px at the bottom-left inside the safe area, channel offset 6 px horizontal only.
