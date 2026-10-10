# Storyboard: The Small Batch Podcast, Episode 12 (audiogram-visualizer)

1080x1080, 30 fps, 600 frames (20.0 s). Narration is the master clock: three TTS segments (en-US-AndrewNeural)
placed by `scripts/mix.py` after a 1.5 s intro with 0.7 s gaps; speech ends at 16.72 s (frame 502).

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Intro | 0-45 | Show title, "Episode 12" | Cover springs in (damping 20, stiffness 160, 18 f); title rises at f6; 48 bars rise from 0 with a 1-frame stagger from the centre; bars idle at the 6 px floor | Silence until f45 |
| 2 Body, sentence 1 | 45-205 | "Every extra person on a team adds another meeting, / another handoff, and another wait." | Bars follow the voice; cover pulses 1.00-1.02 on low-frequency energy; progress line fills; active word in accent | s1 (5.3 s) |
| 3 Body, sentence 2 | 226-407 | "Small teams decide in a hallway, / ship by lunch, / and learn from real users the same day." | same | s2 (6.0 s) |
| 4 Body, sentence 3 | 428-502 | "Keep the batch small, / and keep moving." | same | s3 (2.5 s) |
| 5 Outro | 502-600 | "Listen at smallbatch.example" | Last caption leaves, bars settle to the idle floor and breathe, progress line full, end card fades in at f514 and holds 2.9 s | Silence (no music) |

Deviations from the style recipe (see report): 48 bars (64 do not fit 1080 px), centre-mirrored bin mapping with
a high-frequency tilt, cover centred at y 290 and progress line at y 826 to respect the 96 px safe area, caption pill
centred at y 912.
