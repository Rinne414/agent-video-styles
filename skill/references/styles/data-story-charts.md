# Data Story Charts

Charts, counters and rankings that build over time, one insight per scene. Use it whenever the story is a real dataset.

- **Primary tool**: Remotion (alt: HyperFrames + GSAP)
- **Format**: 1920x1080 30 fps (also 1080x1920 or 1080x1080); 20-60 s
- **Inputs to ask for**: the dataset (CSV/JSON) with units and source, the 1-3 insights to tell, time range, highlight color, aspect ratio. Never invent numbers; sample data only if the user asks, labelled "Sample data" on screen.

## Look

| Token | Value |
|---|---|
| Background | dark `#0B0D12` or paper `#F6F5F1`; pick one per video |
| Gridlines | horizontal only, 1 px at 8% of text color, 4-5 lines max; no vertical gridlines |
| Series colors | neutral series `#3A4150` (dark) / `#C9CDD4` (paper); one highlight `#22D3EE` (or brand); optional secondary `#F59E0B` |
| Hero number | Inter / IBM Plex Sans 700, 160-220 px, `font-variant-numeric: tabular-nums` |
| Takeaway headline | 56-72 px 700, top-left at the 80 px margin, max 10 words |
| Labels | 32-40 px 500 (ranking: bar name 36-40, value 44-56, bar height 64, row step 110); label directly at ends instead of a legend |
| Axis labels | 22-24 px 500 at 60% opacity |
| Source line | 22 px 400 at 55-60% opacity, bottom-left, always present |
| Panels (optional) | KPI card padding 32x36, value 88 px 700, label 28 px 500 at 60%; radius 16, fill `rgba(255,255,255,0.04)`, border 1 px `rgba(255,255,255,0.08)` |
| Safe area | 80 px on 16:9, measured at the end of the 1.03 push: lay content out 110 px in and keep the source line outside the scaled layer; 9:16 keeps 220 px top and 300 px bottom clear |

## Motion grammar

- **Axes first**: axis line and gridlines draw in over 12 frames before any data appears.
- **Bars**: height from 0 with `spring({damping: 200})` (critically damped, no overshoot) or `interpolate` over 24-36 frames with `Easing.out(Easing.cubic)`; stagger 3 frames per bar.
- **Lines**: SVG `stroke-dashoffset` from path length to 0 over 45-60 frames, `Easing.inOut(Easing.cubic)`, with a 10 px dot riding the head.
- **Counters**: `interpolate(frame, [s, s+40], [0, value], {easing: Easing.out(Easing.cubic)})`, rounded every frame and formatted with `Intl.NumberFormat`.
- **Highlight**: after the data settles, non-highlight series dim to 35% opacity over 10 frames (single-series line: dim the whole line, keep the highlighted segment at 100%, annotate at most one peak and one trough, trough in neutral white), then an annotation (leader line + value label) draws in over 12 frames.
- **Rank changes**: y positions interpolate between sorted indices over 12-18 frames; never swap rows instantly.
- **Camera**: slow `scale 1.00 -> 1.03` per scene; no rotation, no 3D.
- **Never**: overshoot on values (a bar bouncing past its value misstates the data), 3D pies, animating the axis scale without a visible label change, chart-library built-in animations (they run on timers, not frames).

## Structure (40 s = 1200 frames @ 30 fps; scale to length)

| Beat | Frames | Content |
|---|---|---|
| Hook | 0-90 | The headline number counting up, with a 5-8 word claim |
| Context | 90-240 | What the data is, time range, source line appears |
| Insight 1-3 | 240-960 | 240 frames each: chart builds (90), highlight + annotation (60), takeaway headline held (90) |
| Summary | 960-1110 | 3 KPI cards stagger in 5 frames apart |
| Outro | 1110-1200 | Source + handle or CTA, held |

For 20 s keep one insight; for 60 s up to five. Short-cut 30-35 s: Hook 3-5 s, each insight 8-11 s, Summary and Outro merged into one 7-10 s closing scene (text-only insight: headline 120-150 px, key noun highlighted, 3 KPI cards under it). Use 4-5 y ticks even for a 0-500 domain. A settled chart must stay on screen at least 2 s before the next change.

## Audio

Music: soft electronic or lo-fi, 90-110 BPM; cut scenes on beats. SFX: one short "tick-roll" per counter (not one tick per frame), a soft pop as each bar lands, a whoosh between insights. Voiceover is optional; if used, follow `../audio-tts-captions.md`, generate `timeline.json` with `scripts/tts.py`, and let each insight's segment length set its scene length.

## Agent brief (template)

```
Style: data-story-charts (see references/styles/data-story-charts.md)
Data: <path to CSV/JSON>, units <...>, source "<...>", period <...>
Insights: 1) <claim + which series proves it> 2) ... 3) ...
Hero number: <value + label>
Theme: dark | paper, highlight <hex>, font <family>
Variant: none | ranking-countdown | year-in-review
Format: 1920x1080 30fps, <duration> s; music <path or none>; voiceover yes/no
```

## Quality bar

- [ ] Every value on screen matches the dataset at its settled frame
- [ ] Units and source visible whenever a chart is visible
- [ ] One highlight color; everything else neutral
- [ ] No overlapping labels; at most 12 bars or 4 lines per chart
- [ ] Numbers are rounded, tabular, and formatted (thousands separators, % signs)
- [ ] Each insight holds >= 2 s after settling
- [ ] No overshoot on any data mark

## Pitfalls

- **Invented data**: agents fill gaps with plausible numbers. Only use the provided dataset; if a value is missing, say so on screen or drop the chart. If the user asks for sample data, keep it internally consistent (parts sum to the headline), store it in `content.json`, and show "Sample data" in the persistent source line plus a tag in every scene.
- **Clutter**: a simple prompt yields gradients, particles and five colors. Specify the one insight per scene and the highlight color.
- **Label collisions** with many categories: keep the top 8-12 and aggregate the rest into "Other".
- **Jittering counters**: format floats every frame and use tabular figures, otherwise digits shift width.
- **Library animations**: Recharts/Chart.js/ECharts animate on timers and render blank or half-drawn frames. Disable their animation and drive every value from `useCurrentFrame()`, or draw SVG directly.
- **Faint dimmed rows**: 35% opacity gray nearly vanishes after compression; keep dimmed marks >= 3:1 against the background.
- **Unreadable mobile version**: 9:16 needs 1.3x larger labels and fewer bars (max 8).

## Variants

- **ranking-countdown**: Top-N list counting down from N to 1; each rank card enters from the right (`spring({damping: 12, stiffness: 180})` for a playful pop), rank badge 96 px, #1 gets a glow plus particle burst. Bar-chart race: one keyframe per period, values interpolated per frame between periods, rows sorted every frame and y positions eased over 15 frames, the period label 160 px in a corner. Platform-branded palettes work here (e.g. Douyin `#FE2C55` + `#25F4EE`).
- **year-in-review**: personal or company recap - activity-over-time line, top-5 categories bars, "best month" callout, a closing "2026 in numbers" grid of 4 KPI cards; warm accent `#F97316` on paper background.
