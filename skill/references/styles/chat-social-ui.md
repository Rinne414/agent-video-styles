# Chat & Social UI Story

A fake phone thread that plays out message by message, paced like a real conversation. The story lives in the copy; the UI only carries it.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Format**: 9:16 first. HyperFrames: compose 1088x1920 at 30 fps with the art in the left 1080 px, then crop to 1080x1920 (width must be divisible by 16). Remotion: 1080x1920 directly. 16:9 (1920x1080) for the composer-box variant. 15-45 s
- **Inputs to ask for**: the script as a list of `{from: me|them, text, reaction?}` lines, names for both parties (fictional unless the user supplies them), light or dark theme, optional music file, optional app name for notification beats
- **Tier**: experimental (few public examples; validated by one template)

## Look

| Token | Value |
|---|---|
| Screen | light `#FFFFFF` or dark `#000000`; one theme per video; no phone bezel (the frame is the screen) |
| Sent bubble | fill `#0066E0` with `#FFFFFF` text (5.3:1). `#0A7CFF` is the familiar blue but white on it is 3.9:1 and fails the 4.5:1 body-text bar |
| Received bubble | light `#E9E9EB` + `#0A0A0A` text; dark `#26262A` + `#F5F5F7` text |
| Bubble text | Inter 400, 44 px, line-height 1.25 (UI text must survive compression); bubble padding 24x32, radius 40, max width 760 px |
| Meta text | names, timestamps, receipts: Inter 500, 30 px, `#6B6B73` on white (5.0:1) or `#A0A0AA` on black |
| Header | 150 px bar below the 220 px top zone: avatar circle 96 px (flat grey gradient, never a real photo), name 36 px 600 |
| Input bar | y 1500-1600, 88 px tall pill, radius 44, send disc 64 px; stays above the 300 px bottom zone |
| Typing indicator | received-colored pill 120x76 px with three 16 px dots, 32 px apart |
| Receipt | "Delivered"/"Read" line under the last sent bubble: Meta style, 40 px slot (text 30 px + 10 px gap) |
| Post card | 920 px wide, radius 40, surface = received-bubble fill; avatar 88 px + name 36 px/600; headline Inter 700 at 96-104 px (1-2 words); stats row Inter 500 at 32 px; heart/like color `#FF5C7A` |
| Safe area | 220 px top and 300 px bottom clear of platform UI; bubbles live between y 370 and y 1500; side margin 48 px |

Never ship Apple's receive tone, real brand marks or a real person's name and likeness. Use fictional names and a generic bubble style.

## Motion grammar

- **Bubble entrance**: `translateY 60 -> 0`, `scale 0.9 -> 1`, opacity 0 -> 1 with a spring (Remotion `{damping: 18, stiffness: 190, mass: 1}`; GSAP `back.out(1.2)`, 12 frames). The tail-side corner is the transform origin.
- **Incoming message**: typing pill appears, dots pulse (opacity 1 -> 0.5 over 15 frames, 10-frame stagger per dot), then the pill becomes the bubble: the pill fades out over 4 frames while the bubble springs in from the pill's bbox (same left edge and bottom, scale from 0.6).
- **Sent message**: text types into the input bar at 2 frames per character, then the bubble rises out of the bar and the bar clears (8 frames).
- **Cadence** at 30 fps: reply delay = `clamp(1.5 frames x characters of the previous message, 18, 45)`; typing-indicator length = `clamp(1.5 x reply characters, 27, 78)`.
- **Thread push**: when a bubble lands, older bubbles move up by its slot height over 10 frames, `power3.out`. Slot = bubble height + 16 px (+ 40 px if a receipt sits under it). Bubble height from a manual `lines` count (`lines x 55 + 48`), never DOM measurement. Anchor the thread to the bottom of the message area (y 1500): the newest slot sits at the bottom and cumulative slot heights give every y; with few messages the upper area stays empty, so pin a small "Today" meta label at y 400 or let the first message be a larger 2-line premise.
- **Reactions**: tapback chip pops (`scale 0 -> 1.15 -> 1`, 10 frames) on the bubble corner 12 frames after it lands; skip the nudge; keep the chip fully inside the bubble's outer edge so it never overlaps the bubble above (leave a 24 px gap there).
- **Receipt**: "Delivered" under the last sent bubble turns to "Read" 20 frames after the reply starts typing.
- **Cutaways**: a notification banner drops from y -160 to 240 over 12 frames, holds 60, exits 8; a post card scales 0.94 -> 1 with a like counter counting up (`power2.out`, 36 frames).
- **Camera**: the whole screen drifts `scale 1.00 -> 1.03` per scene so holds are never frozen.
- **Never**: all messages visible at once, bubbles appearing without an indicator, two entrances in the same 6 frames.

## Structure (30 s = 900 frames @ 30 fps)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-90 | Header + the first line, or a notification banner that sets the premise |
| Thread | 90-720 | 8-12 messages (630 frames): each cycle is typing 27-78 + landed bubble + read time of `0.5 s + words / 3.5` |
| Turn | 720-810 | The twist or punchline bubble, reaction, "Read" receipt; thread holds still for 30 frames |
| End card | 810-900 | Last bubble stays, handle or app name in 48 px under the thread; settled by 840 and held to the end |

Short cuts (silent, 20 s = 600 frames): the formulas above overflow, so budget first. Keep 5 messages (3 sent, 2 received), sent text <= 28 characters, received <= 36, one typing indicator per received message at the 27-frame floor, reply delays at the 18-frame floor. Cutaway card: chat fades out over 10 frames, the card enters 4 frames before that fade ends, likes start +8 frames, the comment line +32, and everything is settled by 90% of the length. The like-counter end card needs about 3.5 s. Write a small schedule script that sums every delay, typing, read time and sent-typing run before placing anything, and trim messages until the card settles by 90%.

Proportions scale with the requested length: 15 s keeps 4-5 messages, 45 s allows 14-16. Cut bubbles, not read time. With voiceover, narration sets bubble timing; with a silent brief the "tick" sound items in the Quality bar are N/A.

## Audio

Optional music bed at 90-110 BPM, ducked to 25% volume. SFX on each landed bubble: a short soft tick (synthesize it in code or use a licensed pack), a lighter one for incoming. No imitation of any platform's signature tone. Captions are normally unnecessary because the bubbles are the text; add them only for voiceover.

## Agent brief (template)

```
Style: chat-social-ui (see references/styles/chat-social-ui.md)
Premise: <one sentence>
Parties: me = "<name>", them = "<name>"  (fictional)
Script: 1) them: "..." 2) me: "..." 3) them: "..." [reaction: heart]
Turn: "<punchline line>"
Theme: light | dark, sent bubble <hex>
End card: "<handle or app name>"
Format: 9:16 30fps, <n> s; music <path or none>
```

## Quality bar

- [ ] Every incoming bubble is preceded by a typing indicator of the computed length
- [ ] Sent bubble text >= 4.5:1 against its fill (check the actual hex)
- [ ] Nothing in the top 220 px or bottom 300 px except the header and input bar
- [ ] Bubble text >= 40 px and readable for `0.5 s + words / 3.5` after it lands
- [ ] Bubble heights deterministic (manual `lines`), no clipped or overflowing text
- [ ] No frame holds still for more than 1 s (camera drift counts) except the end card
- [ ] Final card settled by frame 840 and held >= 1.5 s
- [ ] Fonts verified in a still, not a fallback

## Pitfalls

- **Mechanical rhythm**: equal gaps between all messages read as a script. Derive gaps from message length as above, and vary them by a seeded +-4 frames.
- **Wall of text**: bubbles over 3 lines at 44 px break the pacing. Split them into two messages.
- **DOM measurement**: measuring bubble height at render time makes layout non-deterministic. Count lines in the build script.
- **Color shift**: HyperFrames renders have shown a small color shift (about -3/-3/-4 per channel); pre-compensate if a brand blue must match, and verify in a still.
- **Width bug**: 1080 wide HyperFrames output has black right-edge columns; compose 1088 and crop.
- **Fonts**: vendor the woff2 and declare `@font-face`; no network at render.
- **Likeness**: no real person, brand logo or system sound.

## Variants

- **composer-box**: 16:9, `#FFFFFF` ground, a prompt box 1200 px wide with a 2 px `#CCC9D2` border and 60 px radius, Inter 600 at 56 px typed at 2 frames per character (new glyphs `#7C3AED` for 8 frames, then `#0A0A0A`), camera pan following the caret, send disc crossfading to an arrow with a 3% pulse, headline below in 96 px 800.
- **social-feed**: post cards 920 px wide (avatar 88 px, name 36 px, body 44 px, like counter 32 px) stacking with 24 px gaps; each reveals with the bubble spring, likes count up over 36 frames, feed scrolls up by one card height per beat.
