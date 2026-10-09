# Storyboard: Halo 5 reveal (apple-keynote-minimal, dark stage)

25 s = 750 frames @ 30 fps, 1920x1080, silent. Every scene fades out over its last 6 frames (dip to the black stage) and runs a 1.00 -> 1.03 micro-scale.

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 | 0-90 | "Halo 5." (200 px) | Scale settle 1.08 -> 1.00, fade in at frame 6 | none |
| 2 | 90-240 | none | CSS-drawn note-app window (55% of frame height) rises from y80/scale .92/blur 8 over 40 frames; light sweep at frame 146; float starts at frame 136 | none |
| 3 | 240-330 | "Quieter." + "Nothing between you and your words." | Headline settles, subhead fades up 12 frames later | none |
| 4 | 330-390 | "Faster." | Scale settle | none |
| 5 | 390-480 | "0.2 s" + "Opens before you blink." | Numeral (320 px) fades up and counts 2.0 -> 0.2 in 30 frames (power3.out); subhead fades up | none |
| 6 | 480-540 | "Yours." (the one gradient word) | Scale settle | none |
| 7 | 540-630 | "Every note stays on your device." | CSS-drawn phone with a lock glyph rises (40 frames), floats; subhead fades up at frame 580 | none |
| 8 | 630-750 | "Halo 5." + "Available now." | Settle, subhead 12 frames later; settled by frame 672, held to the end (about 2.6 s) | none |

Stage `#000000`, text `#F5F5F7`, secondary `#86868B` (44 px), Inter 700/500, tracking -0.04em.
