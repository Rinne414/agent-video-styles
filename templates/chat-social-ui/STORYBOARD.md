# Storyboard: chat-social-ui (20 s, 1080x1920, 30 fps, silent)

Premise: a founder texts a friend at 2 a.m. about a production bug, gets a one-line fix, then announces "Shipped." in a post. All names fictional (Dani Voss, Priya Nair). Dark theme, sent bubble `#0066E0`.

Frames come from `scripts/schedule.mjs` (recipe cadence rules plus a seeded +-4 frame jitter), so they move if `content.json` changes.

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Hook | 0-72 | "Today 2:07 AM", typed "are you up? prod is down" | Header (Priya Nair), timestamp fades in, text types into the input bar at 2 f/char, bubble rises out of the bar, "Delivered" | none |
| 2 Reply | 72-143 | "what does it say?" | "Delivered" turns "Read" 20 f after typing starts, typing pill (27 f) morphs into the bubble, thread pushes up 10 f | none |
| 3 Evidence | 143-212 | "total of undefined" | Founder types, sends, "Delivered" | none |
| 4 Fix | 212-315 | "guest cart is null. / use cart?.total ?? 0" | Pill with pulsing dots (54 f), 2-line bubble lands, receipt flips to "Read" | none |
| 5 Relief | 315-455 | "oh thank god. that fixed it" | Types, sends, heart tapback pops 12 f after landing, thread holds 30 f | none |
| 6 Post card | 465-523 | "Shipped." / "Checkout is live again." / likes 0 to 1,284 | Chat fades 10 f, card scales 0.94 to 1 (back.out), likes/replies/reposts count up over 36 f, reply card pops in at f509 | none |
| 7 End hold | 523-600 | same | Settled at f523 (87%), slow 1.00 to 1.03 drift continues, held 2.5 s | none |

Camera: each scene drifts scale 1.00 to 1.03. Safe area: header 220-370, bubbles 370-1490, input bar 1506-1594.
