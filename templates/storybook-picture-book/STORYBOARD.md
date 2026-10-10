# Storyboard: Moko, the little cloud who wanted to rain

Style: `storybook-picture-book` (experimental). Tool: HyperFrames `0.8.143`. 1920x1080, 30 fps, about 40 s.
Narration (en-US-JennyNeural, rate -10%) is the master clock. Page length = 12 frames lead + last spoken word + 12 frames tail; the 14-frame page turn starts after the last word.
Unattended run: this table was written before building and the frame ranges below are the ones the build produced (1189 frames = 39.63 s).

| # | Frames | On-screen text (one caption per page) | Visual + motion | Audio cue |
|---|---|---|---|---|
| 0 Cover | 0-109 | Moko, the little cloud who wanted to rain. | Sky, sun, dry peach hills, three wilted flowers; Moko floats in from the right (peeks in), smile | Title line |
| 1 | 109-243 | Moko was a little cloud, floating over a very dry garden. | Moko left of centre over six wilted flowers, big sun; flowers float up 6 frames apart, hero pops | Line 1 |
| 2 | 243-363 | Down below, the flowers hung their heads and waited. | Close-up of four large wilted flowers, tiny Moko watching top right | Line 2 |
| 3 | 363-483 | Moko puffed and puffed, but not one drop came. | Moko centre, eyes squeezed shut, cheeks puff; three small air puffs per side drift out | Line 3 |
| 4 | 483-610 | Moko felt a little sad, and let out a tiny sigh. | Lavender dusk wash, sad face with a single tear, Moko tilts 4 degrees, a sigh wisp drifts away | Line 4 |
| 5 | 610-743 | Then, softly, soft little drops began to fall. | Calm closed-eye smile, 8 drops fall, ground turns from dry peach to half green | Line 5 |
| 6 | 743-917 | Pitter, patter, pitter, patter. The garden drank it up. | Open smile, 22 drops, puddles grow, flowers lift and take their colour | Line 6 |
| 7 | 917-1051 | And the flowers opened, one by one, to say thank you. | Six flowers open in turn (back.out), rainbow draws on, Moko small and joyful at right | Line 7 |
| 8 End | 1051-1189 | Good night, little Moko. | Lavender night, moon, stars, sleeping Moko over open flowers; "The End" tag pops in and holds 2.4 s | Closing line |

Motion: page turn 14 frames (`power2.inOut`, scaleX 1 to 0.02 about the left edge, skewY -4 deg, shadow to 30%); idle bob 4 px on a 2 s sine, seeded blink every 3 s for 4 frames, outline wobble seed changes every 6 frames, background clouds drift 40 px per page.
