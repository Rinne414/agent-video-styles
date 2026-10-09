# Pixel Retro

An 8-bit world built from palette grids: chunky sprites, pixel fonts, stepped motion and beat-synced cuts, optionally behind CRT scanlines. Popular for vertical MVs, PSAs and playful brand shorts.

- **Primary tool**: HyperFrames (alt: Remotion)
- **Format**: 1080x1920 30 fps (also 1920x1080); 15-60 s
- **Inputs to ask for**: concept, lyrics or message, music + BPM, palette preference, characters / objects needed, logo (it will be pixelated)

## Look

| Token | Value |
|---|---|
| Logical canvas | 270x480 (vertical) or 480x270, drawn at that size and scaled 4x to 1080x1920 / 1920x1080; CSS `image-rendering: pixelated`, canvas `imageSmoothingEnabled = false`; every position snaps to whole logical pixels |
| Palette | PICO-8 16: `#000000 #1D2B53 #7E2553 #008751 #AB5236 #5F574F #C2C3C7 #FFF1E8 #FF004D #FFA300 #FFEC27 #00E436 #29ADFF #83769C #FF77A8 #FFCCAA`; no gradients except 2x2 Bayer dithering |
| Sprites | 16x16 or 32x32 logical px (on 270 wide a 32x32 hero is only 12% of the width: draw it at 2x logical, 64 px = 256 px output; clouds and props may use 2x too; build sprites from rects plus an auto 1 px outline instead of hand-typed grids per pose), written as string grids in code (`"..11.."`, `".1221."`) mapped to palette indices; 1 px outline `#000000` or `#1D2B53` |
| Font | Press Start 2P (vendor `@fontsource/press-start-2p` woff2 into `fonts/`) or Silkscreen (OFL); palette-pure text: rasterise the glyphs at 8x and sample the centre of each font pixel (plain `fillText` at 8 px plus alpha thresholding mangles W/R/K); CJK: Zpix or Fusion Pixel Font (check the license); sizes on the 8 px logical grid = 32 / 64 px output |
| Vertical safe area | keep text between logical y 56 and 380 of 480 (platform UI); use the bottom quarter for ground/props |
| Backgrounds | tile layers (sky `#29ADFF`, ground `#008751`), 2-3 parallax layers |
| Dialog box | RPG style: 2 px logical `#FFF1E8` border on `#1D2B53`, 4 px logical padding, typewriter text |
| CRT (optional) | scanline every 4 output px at 15% black, vignette 25%, 1 px RGB offset on the overlay only; never blur the sprites |

## Motion grammar

- **Stepped sprites**: 2-4 frame sprite cycles held 4 video frames each ("on fours", about 7.5 fps of drawing).
- **Integer movement**: 1-2 logical px per step; use `steps(n)` eases or `Math.floor` on positions; no sub-pixel, no smooth easing on characters.
- **Squash and stretch**: by swapping sprite frames, never by CSS `scale`.
- **Beat sync**: at 120 BPM a beat is 15 frames; land jumps, cuts and pops on beat multiples. On drops: screen shake +/-2 logical px for 6 frames plus a 2-frame `#FFF1E8` flash.
- **Transitions**: dither dissolve (Bayer threshold sweep, 8-12 frames), iris wipe, or hard cut on the beat.
- **Text**: typewriter 1 character per 2 frames, or whole words snapping in on beats; "PRESS START" blinks 8 frames on and 8 off.

## Structure (30 s vertical MV = 900 frames @ 30 fps, 120 BPM; scale to length on the 15-frame beat grid)

| Beat | Frames | Content |
|---|---|---|
| Title | 0-120 | Pixel title drops on beat 1 with a shake; "PRESS START" blink |
| Verse | 120-480 | Character walks through 2-3 tiled scenes; lyric box at the bottom |
| Build | 480-600 | Cuts every 15 frames, palette shift (swap sky color), speed lines |
| Drop | 600-810 | Big sprite action, shake + flash on beats, large centered lyric |
| Outro | 810-900 | Logo sprite + message on a "THANK YOU" card, held 60 frames |

PSA / quest variant (e.g. 15 s or 14 s): Title 90 frames, N task beats of 8 beats (120 frames) each, level-up outro 90 frames (shake + flash). Other lengths: `beats = seconds * BPM / 60`, snap boundaries to multiples of 15 frames.

## Audio

Chiptune (square, triangle, noise channels), synthesized in code (Python or WebAudio rendered to WAV) or royalty-free. SFX: coin, jump and blip on events, around -16 dB. Measure the BPM and put every major event on the beat grid. Lyric timing comes from an SRT or from `timeline.json` produced by `scripts/tts.py` for narrated PSAs (see `../audio-tts-captions.md`).

## Agent brief (template)

```
Style: pixel-retro (see references/styles/pixel-retro.md)
Concept: <story or message>; Lyrics/text: <lines or path>
Music: <path>, BPM <n> (or "synthesize a 120 BPM chiptune")
Palette: <PICO-8 | custom 16 hex>
Sprites needed: <hero, items, logo>
Format: <1080x1920 | 1920x1080> 30fps, <seconds> s; CRT <on/off>
```

## Quality bar

- [ ] Every pixel sits on the 4x grid: zoom a still to 100% and see no half-pixels or blur
- [ ] Only colors from the declared palette (max 16) appear
- [ ] Characters move in steps; no smooth tweened slides
- [ ] Major events land within 1 frame of a beat
- [ ] Text at least 32 px output with contrast of 7:1 or better in the dialog box
- [ ] The CRT overlay does not reduce text legibility

## Pitfalls

- **Check noise**: `canvas_content_at_edge` is expected for a full-bleed canvas; for canvas-driven whole videos use a GSAP proxy tween whose `onUpdate` calls `draw(Math.round(t * fps))`, with scripts concatenated inline by the build script.
- **Smoothing**: a scaled canvas without `imageSmoothingEnabled = false` and `image-rendering: pixelated` turns sprites to mush. Draw at logical size, scale by an integer.
- **Mixed fidelity**: vector shapes or anti-aliased fonts next to pixel art break the illusion.
- **Flash-game motion**: eased slides on sprites. Use steps and frame swaps.
- **Over-detailed sprites**: 64x64 sprites with 30 colors stop reading as 8-bit; stay at 16 or 32.
- **Turns and limbs**: character turns and natural limb motion are hard in code. Keep side views and a few poses.
- **3D**: reported as not worth it for this style; fake depth with parallax layers.

## Variants

- **crt-terminal**: `#33FF66` (or amber `#FFB000`) on `#001100`, pixel font, typing at 2 frames per character, ASCII bars `[#####.....]`, 2-frame glitch slices on cuts.
- **pixel-brand-short**: 15 s, 1080x1920; the logo rebuilt as a 32x32 sprite, one hero scene, tagline in a dialog box.
- **side-scroller**: 1920x1080 (480x270 logical); camera scrolls 2 logical px per frame, each "level" is one point, checkpoint flags as section breaks.
