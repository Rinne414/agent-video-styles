# Social Carousel Cards

4:5 cards with bold copy, swiped one by one like an Instagram or Xiaohongshu carousel. The video is a preview of the swipe; every card is also exported as a still so the post can be published as a real carousel.

- **Primary tool**: Remotion (alt: HyperFrames)
- **Tier**: experimental (few public examples; validated by one template)
- **Format**: 1080x1350 30 fps, 15-45 s (5-8 cards); plus one PNG per card at 1080x1350 (2x export optional)
- **Inputs to ask for**: topic, 5-8 card texts (2-3 lines each), one visual idea per card, optional screen clips, accent hex, handle or logo, CTA line

## Look

| Token | Value |
|---|---|
| Palette | four colors only: paper `#FAF6F1`, ink `#2D2D2D`, accent `#D4734A`, white `#FFFFFF` (card surfaces) |
| Accent use | fills, underlines, big numerals >= 80 px only (3.1:1 on paper, passes the 3:1 display rule but fails for body); never for small text |
| Title type | Inter 800 (Latin) with Noto Sans SC 700 (CJK), 96-120 px, line-height 1.1, tracking -0.02em; manual line breaks, about 8-10 CJK characters or 18 Latin characters per line |
| Body type | same family 500, 44-52 px, never below 40 px; max 3 lines |
| Card layout | margins 72 px; title block top-left at y=160; visual in the lower 45% (a chat bubble, file tree, code block, timeline or diagram); page counter `3/7` 32 px, top-right |
| Visual | one per card, built from code: radius 28 px, fill white, border 2 px ink at 10%, no gradients |
| CTA card | last card: one sentence, handle, accent button shape 560x120 px; optional (see no-CTA variant) |
| Dark card | allowed for rhythm: ink `#2D2D2D` ground, paper text, accent only on fills or dots >= 40 px |
| Card edge | 2 px ink-10% left border on each card, otherwise same-colour cards make the swipe invisible |
| Safe area | 72 px sides; keep key content inside the central 1080x1296 (Xiaohongshu crops to 3:4 in some grids) |

Constrain colors to the four above: unconstrained generation drifts into blue, green and purple. Keep copy to 2-3 lines plus one visual; if every card looks identical the deck reads as slides, so vary layout (big numeral card, quote card, list card, diagram card). Vendor fonts with exact-pinned `@fontsource/inter` and `@fontsource/noto-sans-sc`, loaded once in a shared module; nothing fetched at render.

## Motion grammar

- **Card entrance**: title lines rise `translateY 40 -> 0` with `spring({damping: 20, stiffness: 160})`, 4 frames apart; visual enters 8 frames after the last line.
- **Swipe**: card i's local clock starts at swipe start (its entrance runs during and after the swipe); strip offset = sum of the eased swipes; the page counter is a fixed overlay, not part of the strip. The strip moves `-1080 px` over 14 frames with `Easing.bezier(0.22, 1, 0.36, 1)` (slide-and-snap, a design choice not taken from a source), and the incoming card is already settled 6 frames after the move ends.
- **Page counter**: digit swaps with a 6-frame fade as the swipe passes the midpoint.
- **Swipe hint**: on card 1 only, a 48 px arrow nudges right 16 px and back over 30 frames, looping once.
- **Drift**: each held card scales `1.00 -> 1.02`.
- **Never**: bounce on body text, fades between cards, more than one element entering at once after the title.

## Structure (24 s = 720 frames @ 30 fps, 6 cards with CTA)

| Beat | Frames | Content |
|---|---|---|
| Cover card | 0-17% | Hook title (<= 8 words), swipe hint |
| Cards 2-5 | 17-83% | 120 frames each at 24 s: entrance (0-45), hold (45-106), swipe out (106-120) |
| CTA card | last 17% | Takeaway sentence and handle, settled by 50% of its length and held |

Proportions scale to the requested length: each card gets `0.5 s + words / 3.5 s` plus 30 frames of swipe and settle, so 8 cards run about 36 s. No-CTA variant, 6 cards at 20 s (600 frames): cover 90, four cards of 100, last card 110 (its takeaway doubles as the close). Export stills at each card's settled frame with one `<Still>` per card whose component takes the local frame as a prop: `remotion still Card2 out/02.png --frame=70 --image-format=png`. Mono visuals: `@fontsource/jetbrains-mono` works offline.

## Audio

Optional light lo-fi or pop bed at 100-110 BPM with a soft tick on each swipe (synthesized, 40 ms). Audio is not part of the card stills. Silent brief: sound items N/A; platforms autoplay muted, so no information depends on sound.

## Agent brief (template)

```
Style: social-carousel-cards (see references/styles/social-carousel-cards.md)
Topic: <...>; handle: <...>; accent <hex or default>
Cards: 1) cover "<hook>"  2) "<line 1 / line 2>" + visual <...>  ... N) CTA "<...>"
Clips: <paths or none>
Audio: <music path / none>
Format: 1080x1350 30fps; export PNG per card
```

## Quality bar

- [ ] Every card has <= 3 text lines (text inside a visual, such as a mock commit, is exempt) and exactly one visual
- [ ] Only the four palette colors (dark card included); accent never on small text
- [ ] Text contrast >= 4.5:1, body >= 40 px, inside the safe area
- [ ] Cards differ in layout (no five identical slides)
- [ ] PNG exports are exactly 1080x1350 (or 2160x2700 at 2x) and match the video frames
- [ ] Intended fonts confirmed in a still, CJK included
- [ ] Any sample numbers are labelled as sample data on the card
- [ ] Last card settled by half its length and held >= 1.5 s

## Pitfalls

- **Template sameness**: a JSON-to-slides pipeline made every card identical; automate the render step only, and choose each card's layout deliberately.
- **Size drift**: single-page HTML exports gave 1076 vs 1080 px screenshots; render through Remotion stills at a fixed size and check dimensions.
- **Color drift**: no palette limit gives blue, green and purple. Enforce four colors in the theme module.
- **Tiny text**: feed thumbnails shrink cards to about 400 px wide; 40 px body becomes about 15 px. Keep copy short.
- **HyperFrames alternative**: width 1080 is not divisible by 16; compose 1088x1350 and crop to 1080x1350 with ffmpeg.

## Variants

- **dark-neon**: ground `#0B0B0C`, text `#F5F7FA`, one neon accent (`#39FF88` with dark ink text on it, since white on green fails contrast); same layouts.
- **clip-cards**: replace the visual with a 3-4 s screen recording or photo (rounded 28 px, 960 px wide) plus 1-3 lines; export that card as MP4, the others as PNG, numbered `01.mp4`, `02.png`.
