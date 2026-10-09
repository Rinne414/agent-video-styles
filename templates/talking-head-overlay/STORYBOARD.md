# Storyboard: talking-head-overlay

1920x1080, 30 fps, 750 frames (25 s), silent. Style: `talking-head-overlay`, tool: Remotion 4.0.534.

Brief: placeholder plate (labelled "your footage here", silhouette in the left third), lower third for a fictional speaker, three numbered points in side panels, one data callout, subscribe pill. Overlay also exported alone as ProRes 4444.

Face-safe box (head + shoulders + 10% margin around the silhouette): x 150-590, y 100-680. All overlays live to the right of x 1056, except the lower third, which sits below y 810 (chest area).

There is no audio and no spoken words, so the "word pinning" rule does not apply: frame ranges follow the style's Structure table scaled from 60 s to 25 s, with each overlay on screen for at least `0.5 s + words / 3.5 s`.

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 0 | 0-24 | (plate only) "YOUR FOOTAGE HERE" | Gradient room, silhouette sways 4 px, dashed face-safe zone | none |
| 1 | 24-159 (4.5 s) | Maya Chen / CTO at Fernway | Lower third bottom-left: stripe scaleY 8 f, panel wipe 12 f, text rise 16 px with 3 f stagger, out 10 f | none |
| 2 | 180-300 (4 s) | 01 Measure first | Right panel y 300: wipe from the right, numeral spring, progress ticks | none |
| 3 | 312-432 (4 s) | 02 Rewrite the hot path | Same panel, y 400 | none |
| 4 | 444-564 (4 s) | 03 Keep the old API alive | Same panel, y 500 | none |
| 5 | 576-681 (3.5 s) | 38% less p99 latency | Callout card right: count-up 0 to 38 in 30 f, tabular numerals, accent leader line | none |
| 6 | 696-750 (1.8 s) | Subscribe | Glass pill bottom-right: spring in, press at +26 f, fills accent; held to the last frame | none |

Only one overlay is on screen at any time (limit is two). Deliverables: `out/talking-head-overlay.mp4` (composite) and `out/talking-head-overlay.mov` (overlay only, ProRes 4444 with alpha).
