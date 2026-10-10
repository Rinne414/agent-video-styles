# Storyboard: abstract-generative-loop (hero loop, 1080x1080, 30 fps, N = 240 frames = 8 s, silent)

Brief: seamless website hero loop, soft shapes and particles morphing in a warm palette. Four equal quarters (recipe proportions, scaled from 360 to 240 frames). phi = (i % 240) / 240.

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 State A | 0-59 | none | Opening composition: 9 shapes (circles, rounded squares, 3 rings) on a ring around the centre, 700 particles on orbits. Frame 0 is the poster. | silent |
| 2 Morph 1 | 60-119 | none | Corner radii cross-morph circle <-> rounded square (ease-in-out cubic); particles begin to contract toward centre | silent |
| 3 Morph 2 | 120-179 | none | Peak at phi = 0.5: shapes 18% larger and pulled 25% toward centre, particle swirl radius -28%, brightest backdrop glow | silent |
| 4 Return | 180-239 | none | Everything eases back to the state A pose; frame 240 would equal frame 0, so exactly 240 frames are rendered | silent |

Palette: ground #0B0D14, coral #FF6B4A, amber #FFB454, rose #FF8FA8. Seed 20241. Harmonics k in {1,2,3} (integers only).
