# Cinematic HUD Reel

Fast premium sizzle: motion blur, glow, camera hits, HUD overlays and a logo finale, all synced to sound written in code. The "can an agent beat a motion designer" showpiece.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion + `@remotion/motion-blur`)
- **Format**: 1920x1080, 60 fps preferred (numbers below are at 30 fps; double them at 60); 15-40 s
- **Inputs to ask for**: logo or wordmark, 6-10 keywords or short phrases, accent color, BPM or a music file, handle/URL for the end

## Look

| Token | Value |
|---|---|
| Background | `#05070D`; far plane of 150-300 seeded points at 2-4% white; faint 1 px grid at 3% |
| Accent | electric blue `#3D40FE` or cyan `#22D3EE`; ice `#CFE8FF` highlights; hit color `#FF3B5C` on at most 2 moments |
| Glow | `text-shadow: 0 0 24px <accent>99, 0 0 64px <accent>40`; bloom only on the focal element |
| Headline type | Archivo 800 or Bebas Neue (ship as local woff2; Space Grotesk stops at 700), 120-180 px, uppercase, tracking 0.02em |
| HUD micro-type | JetBrains Mono / IBM Plex Mono 14-18 px, uppercase, tracking 0.12em, 50-70% opacity |
| HUD shapes | 1-2 px strokes: corner brackets (40 px arms), concentric rings (240-640 px), tick rulers, crosshairs, scanning bar 2 px |
| Hit FX | RGB split 4-8 px for 2-3 frames; 2-frame white flash at 30% opacity |
| Layers | far (stars/grid) 0.3x parallax, mid (HUD) 0.6x, near (type) 1x |
| Safe area | 96 px; key words stay inside the center 60% |

## Motion grammar

- **Beat grid first**: compute `hits = [round(i * 60 / BPM * fps) + offset]`. Visual hits and SFX both read from this one list.
- **Camera punch** on each hit: scale `1.00 -> 1.06 -> 1.00` over 6 frames (`expo.out` up, `sine.inOut` down) plus seeded shake +/-6 px for 4 frames.
- **Slam-in**: words scale `1.40 -> 1.00` with opacity 0 -> 1 in 5 frames, `expo.out`, landing exactly on a hit.
- **Decode**: characters cycle through 3-5 seeded random glyphs, resolving left to right over 12 frames (8-10 when the shot is 2 beats or shorter). Keyword shot length >= decode + 18 frames; at 128 BPM and 30 fps a 2-beat shot is 28 frames.
- **Whip pan**: translateX 1920 px over 6 frames with a directional blur proportional to speed (CSS `filter: blur()` up to 24 px in HyperFrames; `<CameraMotionBlur samples={8}>` in Remotion).
- **HUD idle**: rings rotate 0.5-2 deg/frame in alternating directions; counters tick every 2 frames; scanning bar sweeps every 45 frames. HUD never stops.
- **Rhythm**: 2-3 hits per bar maximum; the drop is the only place with hits on every beat.
- **Never**: a still frame longer than 0.5 s, unseeded randomness, more than one slam on the same frame.

## Structure (24 s = 720 frames @ 30 fps, 120 BPM; scale by percentage)

| Beat | Frames | Content |
|---|---|---|
| Cold open | 0-60 | Black, HUD boot lines type in, rings draw on, riser starts |
| Hits I | 60-240 | 6 shots x 30 frames: keyword slam + HUD visual per shot |
| Build | 240-480 | 15-frame shots, terminal micro-type, data spikes, decode text |
| Drop | 480-600 | Biggest hit: full-frame word, bloom peak, flash, RGB split |
| Logo finale | 600-720 | Logo assembles from HUD line segments by 92% of runtime, glow settles, hold >= 1.5 s |

Short-cut: `beats = durationSec * BPM / 60`; a 22 s / 128 BPM reel has ~47 beats, sections starting at beats 4 / 16 / 32 / 40. Snap every boundary to a beat. Logo: stroke glyphs on a 4x6 grid with chamfered corners, `pathLength=1` dash-in plus seeded fly-in; letters outside your glyph set crossfade from a filled font. No logo or handle supplied: set the name as wordmark and use a placeholder like `name.example`.

## Audio

Generate sound in code (Python `wave` + numpy, or offline WebAudio) or use a licensed 120-128 BPM track. Code-made kit: sub hit (55 Hz sine, 300 ms decay) on every visual hit, filtered white-noise riser (2 s) into the drop, 10-30 ms glitch ticks under decode text, whoosh under whip pans. Render SFX from the same `hits` list the visuals use. Master around -14 LUFS with peaks below -1 dBTP. Silent brief: render silent, keep the hit list in `content.json` so a kit can be generated later, and grade the sound items N/A.

## Agent brief (template)

```
Style: cinematic-hud-reel (see references/styles/cinematic-hud-reel.md)
Subject: <person / brand / product> - "<one-line identity>"
Keywords (in order): <6-10 words or short phrases>
Drop line: "<the biggest phrase>"
Logo: <path or wordmark text>; end card: <handle / url>
Palette: accent <hex>, hit color <hex>
Audio: <music path + BPM> or "synthesize in code at 120 BPM"
Format: 1920x1080 60fps, 24 s
```

## Quality bar

- [ ] Every hit in the `hits` list has a visual event (and a sound unless the brief is silent)
- [ ] Each keyword is readable for >= 0.6 s even inside fast sections
- [ ] Glow on one focal element per shot, not on HUD texture
- [ ] No frame is still for more than 0.5 s
- [ ] Two renders look identical (all randomness seeded; with glow/blur/gradients expect PSNR > 45 dB, not bit identity, unless `--workers 1`)
- [ ] Logo fully assembled by 92% of runtime and held >= 1.5 s

## Pitfalls

- **Everything glows**: hierarchy collapses into blue haze. Glow the word, keep HUD at 50-70% opacity without bloom.
- **Flicker from Math.random**: decode text and shake must use a seeded generator (frame-indexed), or every render differs.
- **Missing font**: check output must show `Fetched N font face(s)` for each family; otherwise it silently falls back to a generic bold sans. Vendor a woff2.
- **Check errors**: `color: transparent` + `-webkit-text-stroke` fails `text_not_painted` (use a faint solid fill); intentional off-canvas text needs `data-layout-allow-overflow`.
- **Weak sound**: the visuals feel cheap without hits. Build the hit list first, then the sound, then the visuals.
- **Render cost**: motion blur with 8-16 samples multiplies render time; blur only during whips and punches.
- **Unreadable micro-type is fine, unreadable keywords are not**: never decode or shake the keyword itself after it lands.

## Variants

- **clean-tech**: drop shake and RGB split, keep rings and glass panels (`rgba(255,255,255,0.05)`, blur 20 px); shots of 30-45 frames; good for model or product teasers.
- **vertical-intro**: 1080x1920, 12 s - name slam, role decode, three keyword hits, handle on the final card; HUD rings centered behind the name.
