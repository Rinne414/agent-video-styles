# SaaS Launch Promo

Dark canvas, one brand accent, kinetic headlines and floating UI cards cut to the beat. The default look of agent-made launch videos on X and Product Hunt.

- **Primary tool**: Remotion (alt: HyperFrames + GSAP)
- **Format**: 1920x1080 30 fps (vertical cut-down 1080x1920); 20-45 s
- **Inputs to ask for**: product name, one-line value prop, 3 features, brand accent hex, logo (or text logo), optional screenshots, CTA URL

## Look

| Token | Value |
|---|---|
| Background | `#0A0A0B` to `#0B0F14`; radial glow of the accent at 10-15% opacity, 900-1200 px wide, behind the focal element |
| Texture (optional) | 1 px grid at 4% white, 64-80 px cells, or 3% film grain; never both |
| Accent | one brand color (fallback `#6366F1`), used on <= 15% of the frame: key word, glow, active UI state |
| Text | primary `#F5F7FA`, secondary `#9CA3AF` |
| Headline type | Inter / Geist / Satoshi, 700-800 weight, 96-140 px at 1080p, tracking -0.03em, line-height 1.02, max 6 words per card |
| Label type | same family 500 weight, 28-36 px, tracking 0 |
| UI cards | code-built app windows: radius 20 px, fill `rgba(255,255,255,0.04)`, border 1 px `rgba(255,255,255,0.08)`, backdrop blur 20 px, shadow `0 30px 80px rgba(0,0,0,0.5)` |
| Warning color | semantic amber `#F59E0B` for flagged or blocked states (the accent stays for active states only) |
| Safe area | 80 px on 16:9; on 9:16 keep 220 px top and 300 px bottom clear of platform UI |

Real product screenshots or real components beat invented UI. If none are provided, build a plausible minimal UI (sidebar, 3-4 list rows, one primary button) in the brand color; never lorem ipsum. Minimal-UI geometry at 1080p: window ~1360x660 centered below a 34 px section label, sidebar 240 px, rows >= 150 px, UI text >= 28 px so it reads after compression.

## Motion grammar

- **Entrance**: `spring({damping: 20, stiffness: 160, mass: 1})` driving `translateY 40 -> 0` and `opacity 0 -> 1`; optionally `blur 12px -> 0`.
- **Stagger**: 3-5 frames between sibling elements at 30 fps; headline words 4 frames apart.
- **Emphasis**: one key word per headline swaps to the accent color 6 frames after it lands.
- **Camera**: every scene drifts, `scale 1.00 -> 1.04` across its duration, so nothing is ever fully static. UI cards get a slight 3D tilt (`rotateX 8deg -> 0`) as they enter.
- **Cursor**: when demonstrating UI, an SVG cursor moves on an eased path (`Easing.bezier(0.65, 0, 0.35, 1)`, 18-24 frames), the click is a 0.92 scale pulse plus a ripple ring.
- **Transitions**: hard cuts on the beat by default; at section changes use a 10-12 frame slide or scale-through (punch-in `scale 1.10 -> 1.00`, ease-out, 10 frames). No crossfade longer than 8 frames.
- **Never**: linear easing on position, more than 3 elements entering at once, bouncy overshoot on body text.

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-90 | Pain point or bold claim, 3-5 words, slams in word by word |
| Reveal | 90-180 | Logo + product name, glow bloom from 0 to 100% in 12 frames, one-line value prop |
| Feature 1-3 | 180-675 | 165 frames each (beat grid): headline (60) then UI card demonstrating it (105) with cursor or typing; headlines max 4 words, or give a 5-word headline 75 frames (5 beats) and shorten the card to 90 |
| Proof | 675-780 | One metric counting up (`interpolate` with `Easing.out(Easing.cubic)`), or 3-5 logos, or one quote |
| CTA | 780-900 | Logo lockup + URL + "Try it free", fully settled by frame 840 and held to the end |

Scale proportionally for 15 s (1 feature) or 45 s (4-5 features). Reading time rule: a text card stays readable for at least `0.5 s + words / 3.5 s`.

## Audio

Music-led, 110-128 BPM electronic or minimal house. At 120 BPM one beat = 15 frames at 30 fps, so place scene cuts on multiples of 15. SFX: whoosh on section transitions, soft click on cursor clicks, riser into the reveal, low hit on the logo. Voiceover is optional; if used, follow `../audio-tts-captions.md` and let the narration set scene lengths.

## Agent brief (template)

```
Style: saas-launch-promo (see references/styles/saas-launch-promo.md)
Product: <name> - <one-line value prop>
Hook: "<3-5 word pain point or claim>"
Features: 1) <feature + what the UI shows> 2) ... 3) ...
Proof: <metric / logos / quote>
CTA: <url> "<button text>"
Brand: accent <hex>, font <family>, logo <path or text>
Assets: <screenshot paths or "build minimal UI">
Format: 1920x1080 30fps, 30 s; music <path or none>
```

## Quality bar

- [ ] Every frame has exactly one focal point
- [ ] Each text card readable for >= `0.5 s + words / 3.5 s`
- [ ] Accent covers <= 15% of any frame
- [ ] Nothing crosses the safe area
- [ ] No frame is fully static for more than 1 s (camera drift counts as motion)
- [ ] Final CTA settled by frame 840 and held >= 1.5 s
- [ ] Cuts land on beats when music is used

## Pitfalls

- **Clutter from vague prompts**: "make it cool" produces particles, gradients and glows everywhere. Specify the scene table above instead.
- **Slideshow feel**: scenes that fade in, sit, and fade out. Fix with continuous camera drift, staggered entrances and cut-on-beat.
- **Fake-looking UI**: overly detailed invented dashboards read as stock. Fewer elements, real copy, brand color on the active state only.
- **Fallback fonts**: load fonts before render (Remotion `@remotion/google-fonts` or `delayRender`), otherwise the first frames render in a system font.
- **Accent overuse**: glow on everything flattens hierarchy; keep the glow behind one element per scene.

## Variants

- **glass-gradient**: replace the dark background with 2-3 large blurred color blobs (`filter: blur(120px)`) drifting slowly over `#F7F7FB` or a deep navy; cards become frosted glass with stronger blur (30-40 px) and white 30% borders; emoji or line icons; damping 14 for a softer, playful bounce.
- **vertical-teaser**: 1080x1920, 15 s: hook, reveal, 1 feature, CTA. Stack headline above a full-width UI card; headline 110-130 px; keep the platform-UI zones clear.
