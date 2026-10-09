# Storyboard: why the area of a circle is pi r^2 (about 52 s, 1920x1080, 30 fps)

Narration is the master clock (`assets/audio/timeline.json`); segments are separated by 0.35 s. Colors: r gold, area A and wedges blue, result green.

| # | Time (s) | Narration | On-screen | Motion |
|---|---|---|---|---|
| s1 | 0.0-6.4 | How much space does a circle cover? ... pi r squared. But why? | Blue circle, gold radius r; header `A = \pi r^2 ?` | FadeIn, Create, Write on "pi", Indicate "?" |
| s2 | 6.7-12.3 | Cut it into equal wedges | 16 radial cuts, then 16 wedges | LaggedStart Create of cuts, wedges drift apart |
| s3 | 12.7-19.1 | Unroll, wedges up then down | Wedges rotate and travel into an interlocked row | Lagged alpha-driven move + rotation |
| s4 | 19.4-26.9 | Almost a parallelogram; cut more wedges | Dashed parallelogram outline; row swaps to 64 wedges | Create, crossfade |
| s5 | 27.2-32.8 | Perfect rectangle, height r | 64-row morphs to rectangle; gold brace + r | ReplacementTransform, GrowFromCenter, Indicate |
| s6 | 33.1-39.9 | Width is half the circumference = pi r | White brace below; label C/2 -> C = 2 pi r -> C/2 = pi r | TransformMatchingTex |
| s7 | 40.3-45.6 | Area = width x height = pi r times r = pi r^2 | Header: A = width x height -> A = pi r x r -> A = pi r^2 | Transform chain |
| s8 | 46.0-50.1 + hold | That is why the area is pi r squared | Equation scales to center, green box | Scale, Create, Circumscribe, 1.8 s hold |
