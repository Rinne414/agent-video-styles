# Card Explainer

An article or deck turned into a narrated sequence of clean animated cards, one key sentence per card. The "Bilibili knowledge video" look, and the most common Chinese-market agent workflow (WeChat or Feishu article in, 1-3 min video out).

- **Primary tool**: HyperFrames (alt: Remotion)
- **Format**: 1920x1080 30 fps and/or 1080x1920; 45-180 s
- **Inputs to ask for**: the source (URL, file, deck), language, target length, voice, aspect ratio(s), theme color, attribution line

## Look

| Token | Value |
|---|---|
| Background | warm paper `#F7F5F0` or white `#FFFFFF`; dark theme alternative `#111318` |
| Card | 16:9: 1440x760 centered (card text never below y 920), radius 28, fill `#FFFFFF`, shadow `0 24px 60px rgba(17,24,39,0.10)`; 9:16: 920x1180 |
| Accent | one theme color (e.g. `#2563EB` or `#F97316`); highlighter behind the key phrase at 35% opacity |
| Text | `#1F2328` primary, `#6B7280` secondary |
| Type | Latin: Inter or Source Sans 3; CJK: Noto Sans SC / Source Han Sans SC. Key sentence 64-84 px 700 (16:9) / 72-88 px (9:16); body 36-40 px; kicker 24 px, letter-spaced 0.08em |
| Layouts | rotate five: title, key sentence (金句), list (max 3 bullets), big number, compare. Compare: two columns with 28 px gap, left muted `#F3F4F6`, right accent-soft with 3 px accent border, "VS" disc between. List: rows with an accent number disc. Tally: 4 icons at 170 px, tick drawn with `stroke-dashoffset` as each item completes |
| Icons | draw simple stroke icons inline as SVG (no icon library is vendored), one stroke width, 72-96 px, in the accent |
| Progress | 6 px bar along the top or a "03 / 08" counter top-right |
| Captions | bottom, y ~944-1054 at 1080p, max 2 lines; CJK max 14-16 characters per line, Latin max 42 characters |
| Attribution | source title + author 20 px at 50% opacity on the title and outro cards |

## Motion grammar

- **Card in**: `translateY 60 -> 0` + opacity with a soft spring (GSAP `power3.out` 0.5 s, or Remotion `spring({damping: 22, stiffness: 120})`); or a deck-style horizontal slide (`x 100% -> 0` over 14 frames, ease-out cubic). Pick one and keep it for the whole video.
- **Inner elements**: stagger 5 frames; bullets appear on the word that introduces them.
- **Key sentence**: revealed phrase by phrase in sync with the narration; when the key phrase is spoken, the highlighter sweeps left to right over 12 frames.
- **Big numbers**: count up over 30 frames, ease-out.
- **Card out**: the old card scales to 0.96 and fades over 10 frames while the next enters (6-frame overlap).
- **Drift**: every card scales `1.00 -> 1.02` across its duration.
- **Never**: rotation, flashing, heavy bounce, a card shorter than 3 s.

## Structure (90 s, ~8 cards)

| Beat | Frames | Content |
|---|---|---|
| Title | 0-150 | Article title, source and author |
| Hook | 150-450 | The key question or the most surprising number |
| Points 1-5 | 450-2250 | One card per point, 300-450 frames each, lengths from narration |
| Summary | 2250-2550 | Recap card with 3 bullets |
| Outro | 2550-2700 | Source link, follow handle, held |

**Reaching a target length**: the table is for 90 s and does not scale linearly. Narration alone is often short (~170 CJK characters is ~35 s), so add framing sentences (hook line, "remember this" line, summary, outro) and use rate `+0%`. Overlap model: the next card starts 6 frames before the previous ends, so total = sum(segment duration + 10 frames) - 6 frames x overlaps; compute it before building.

**Pacing**: Mandarin narration runs ~4-5.5 characters/s (1 min ~ 250-300 characters; 2-3 min ~ 650-880 characters); each card's narration 40-90 characters. English runs 150-160 words/min, 20-45 words per card.

## Audio

Narration drives everything. Generate it with `scripts/tts.py` (e.g. `zh-CN-YunxiNeural`, `zh-CN-XiaoxiaoNeural`, `en-US-AndrewNeural`) into `timeline.json` (`{"segments":[{"id","file","duration_ms","words":[{"text","start_ms","end_ms"}]}]}`), one segment per card; card length = segment `duration_ms` + 10 frames. Light piano or lo-fi BGM ducked to about -26 LUFS; a soft page-turn on card changes. See `../audio-tts-captions.md`.

## Agent brief (template)

```
Style: card-explainer (see references/styles/card-explainer.md)
Source: <url or path>; extract 5-8 key sentences verbatim
Language: zh-CN | en; voice <tts voice id>
Length: <60-180> s; cards: <n>
Theme: paper | dark, accent <hex>, fonts <Latin + CJK>
Aspect: 16:9 | 9:16 | both
Attribution: "<title> - <author>"
```

## Quality bar

- [ ] One idea per card; key sentences quoted verbatim from the source
- [ ] Captions max 2 lines and within the character budget
- [ ] Narration and card changes in sync within +-0.3 s
- [ ] No card shorter than 3 s; at least 3 different layouts used
- [ ] Source attribution visible on the title and outro cards
- [ ] 9:16 version: no text smaller than 48 px

## Pitfalls

- **Paraphrase drift**: summarizing changes the author's meaning. Quote key sentences; paraphrase only connective narration.
- **Walls of text**: max ~30 CJK characters (or 15 English words) on a card besides captions.
- **Missing CJK font**: undeclared or unloaded Noto Sans SC renders tofu boxes or a fallback font; load fonts locally and check a still.
- **Non-ASCII paths**: HyperFrames has been reported to break silently in folders with non-ASCII names; keep the project path ASCII.
- **Exotic CSS**: heavy filters, 3D transforms or uncommon properties can fail in render; standard CSS3 renders reliably.
- **Same layout eight times**: rotate the five layouts so it doesn't feel like a static deck.
- **Copyrighted images** lifted from the article: use them only with permission, otherwise use icons.

## Variants

- **marp-slides**: Markdown slides (Marp) are the source; each slide becomes one scene, elements reveal in narration order (a `data-appear` index per element), slide duration locked to its narration segment; subtitles from forced alignment or TTS word timings.
- **vertical-feed**: 1080x1920, card at 85% width, key sentence 72-88 px, captions kept above the 380 px bottom safe zone and below a 220 px top zone, 45-60 s, first card states the hook directly instead of a title card.
