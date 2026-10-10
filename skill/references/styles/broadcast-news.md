# Broadcast News Desk

A TV-news digest: one colored panel and big numeral per story, headline and spec lines building in, a BREAKING ticker running underneath. Built for narrated 3-item rundowns.

- **Primary tool**: HyperFrames + GSAP (alt: Remotion)
- **Format**: 1920x1080 30 fps (16:9 only; width is divisible by 16, no crop needed); 30-60 s
- **Inputs to ask for**: 3-5 stories each with a kicker (1-2 words), headline (<= 12 words), 3 spec lines (<= 8 words), source; opener and closer lines; narration (TTS or recorded) or "silent"; ticker text
- **Tier**: experimental (few public examples; validated by one template)

## Look

| Token | Value |
|---|---|
| Background | `#0B0F1A` with scanline overlay: `repeating-linear-gradient` 2 px line / 4 px pitch at `rgba(0,0,0,0.18)`, drifting 1 px per frame; never above 0.2 opacity |
| Story panels | x 0-340, y 0-936 (stops at the ticker bar; the 80 px under the bar is plain background), solid fill per story: red `#C8102E` (white numeral, 5.9:1), cyan `#00B8D9` and amber `#F5A623` (ink `#0A0A0A` numeral, above 8:1) |
| Numeral | Anton (vendored, OFL; Impact is not redistributable), 200 px, tabular, centered in the panel, two digits `01`-`05` |
| Kicker | Inter 700 uppercase, 30 px, tracking 0.12em, `#F5F7FA` beside a 8x40 px bar in the panel color (panel-colored text on the navy fails 4.5:1) |
| Headline | Inter 800, 72 px, line-height 1.08, `#F5F7FA`, max 2 lines of about 22 characters, x 420 to 1840 |
| Spec lines | Inter 500, 38 px, `#C9D0DB` (above 9:1), 3 lines, 64 px row step, 6 px panel-colored rule at the left |
| BREAKING ticker | bar y 936-1000 (64 px tall), fill `#11182A`; red `#C8102E` label chip inset 8 px inside the bar (y 944-992, x 24) so it never touches a red panel, white 28 px 700 text; scrolling text Inter 600, 30 px, `#F5F7FA`, separators `//` |
| Opening card | no panel; title Anton 230 px (topic, uppercase), date Inter 600 38 px under it, opener line Inter 500 44 px, 3 numeral chips (130x110, one per panel color, Anton 80 px) in a row; fictional-sample tag top-right in the safe corner, Inter 700 24 px, 2 px outline |
| Closing card | recap rows with a 150 px step: 130x110 numeral block in the story color + headline Inter 800 56 px; source line Inter 500 30 px and signoff below the rows, all above y 900 |
| Z-order | back to front: background, scanlines, panel, right-side content, ticker bar, label chip |
| Safe area | 80 px; ticker bar bottom at y 1000; right-side content ends at y 900 and x 1840 |

## Motion grammar

- **Panel**: wipes in from the left over 14 frames (`expo.out`), then the numeral scales `1.25 -> 1` over 10 frames, starting 6 frames after the wipe begins.
- **Right side**: kicker slides `x 40 -> 0` and fades in over 10 frames; headline follows 8 frames later, per-line mask rise 10 frames; spec lines enter 14 frames apart, `power3.out`, 10 frames each.
- **Exit**: right-side content fades out 8 frames; the panel color changes by wipe on the next story, not by crossfade. Extend the previous story's clip 14 frames under the incoming panel wipe so no gap shows. The closing card has no panel: finish with a background-colored cover wipe over the last panel, otherwise it pops off.
- **Ticker**: continuous marquee at 6 px per frame (whole pixels), position `x = -(frame * 6) mod loopWidth`; runs from frame 0 to the end and never restarts at scene cuts. Ticker items repeat the story headlines.
- **Scanlines**: the drift is a function of the frame; no flicker. A 3-frame glitch accent on each story entrance is optional (`glitch-vfx` rules apply).
- **Camera**: a `scale 1.00 -> 1.02` drift per story so holds are never frozen.
- **Never**: more than one block entering per 6 frames, a ticker that stops, a panel color used twice in a row.

## Structure (48 s = 1440 frames @ 30 fps; narration is the master clock)

| Beat | Frames | Content |
|---|---|---|
| Opening | 0-150 | Ticker already running; title card "TODAY IN <topic>" and date, opener line |
| Story 1-3 | 150-1320 | 390 frames each: panel + numeral (0-24), kicker (6), headline (14-40), spec lines at 60, 74, 88, hold until the narration ends, exit last 8 |
| Closing | 1320-1440 | Recap list of the 3 numerals with short headlines, source line, signoff; settled by frame 1380, held to the end |

Story length = 6 frames lead + narration clip + 24 frames tail (a 13-word story at the default English voice runs about 6 s of speech, the lead-in phrase included). Proportions scale to the requested length: 30 s with 3 stories = opening 0-165, three stories of about 195 frames, closing about 195 (speak at +8% rate to fit); 30 s with 2 stories uses 330 each; 60 s allows 4 at 360. TTS clips carry 0.3-0.5 s of trailing silence already, so the gap between clips can be shorter than 0.3 s. Write romanised proper nouns in the script spelling the TTS engine reads correctly, and check every number and name against its primary source.

## Audio

Voiceover is the backbone: render clips per story with `scripts/tts.py`, measure durations, build the timeline from them. Optional news-bed music at 20% volume, 90-110 BPM, instrumental. SFX (optional, only if synthesized, e.g. ffmpeg `anoisesrc` + `afade` whoosh): a short whoosh at 40% on each panel wipe and a soft tick on spec lines; skipping them is acceptable. A silent brief makes the audio items below N/A and the pacing falls back to `0.5 s + words / 3.5` per story.

## Agent brief (template)

```
Style: broadcast-news (see references/styles/broadcast-news.md)
Topic: <digest title>, date <date>
Stories: 1) kicker "<>" headline "<>" specs ["<>","<>","<>"] source <url>
         2) ... 3) ...
Panels: red #C8102E, cyan #00B8D9, amber #F5A623
Ticker: "<text>"
Narration: <TTS voice or path>, opener "<>", closer "<>"
Format: 1920x1080 30fps, <n> s
```

## Quality bar

- [ ] Every story shows numeral, kicker, headline and 3 spec lines before its narration ends
- [ ] Panel text contrast >= 4.5:1 for the numeral and kicker on every panel color
- [ ] Ticker runs unbroken from frame 0 to the last frame
- [ ] Scanline opacity <= 0.2 and no text lower than 4.5:1 through it
- [ ] Headline <= 2 lines and spec lines <= 1 line each at the stated sizes
- [ ] Nothing inside the 80 px safe margin except the full-bleed panel and ticker bar
- [ ] Every figure and name traceable to a source; source line on the closing card
- [ ] Narration not cut off; closing settled and held >= 1.5 s
- [ ] Fonts (Anton, Inter) confirmed in a still

## Pitfalls

- **Impact fallback**: Impact is not shippable and silently falls back to Arial; vendor Anton and check a still.
- **Unverified facts**: web-search summaries contain errors; recheck numbers and names against primary pages.
- **TTS misreads**: romanised names are read wrongly; adjust the spelling in the spoken script and keep the on-screen text correct.
- **Colored text on navy**: red or cyan kicker text fails contrast; use white text with a colored bar.
- **Text-heavy slides**: headlines over 12 words or specs over 8 words stop being scannable.
- **Scanline shimmer**: a 2 px pattern drifting a non-integer distance per frame shimmers after compression; drift whole pixels.

## Variants

- **portrait-digest**: 1088x1920 composed then cropped to 1080x1920; panel becomes a 280 px top band under the 220 px safe zone with a 160 px numeral, headline 88 px over 3 lines, spec lines 44 px, ticker bar at y 1560-1624.
- **light-studio**: `#F6F5F1` ground, ink `#14171F`, panels `#B3122B`, `#0B5FA5`, `#B7791F` (white numerals), no scanlines, ticker bar `#14171F` with white text.
