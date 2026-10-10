# Storyboard: broadcast-news (31.2 s, 937 frames @ 30 fps, 1920x1080)

Narration (en-US-GuyNeural, +8%) is the master clock; scene length = 6 lead frames + narration + 24 frames gap/tail
(closing: narration + 45 frame hold). Ticker and scanlines run from frame 0 to the end.

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Opening | 0-167 | TECH DESK / TODAY IN TECH / Sample bulletin - three fictional stories; chips 01 02 03 | Kicker slides in, title mask-rises, chips wipe in 10 frames apart | "Welcome to the tech desk. This is a sample bulletin." |
| 2 Story 01 | 167-365 | AI MODELS / Model ships with 2M-token context / 3 spec lines | Red panel wipes (14 f), numeral 1.25->1, kicker, 2-line headline rise, specs at +60/+74/+88, 1.00->1.02 drift, 8 f fade out | "Story one. A new model ships with a two million token context window." |
| 3 Story 02 | 365-557 | OPEN DATA / Open image dataset passes 1B images / 3 spec lines | Cyan panel wipes over previous, same grammar | "Story two. An open image dataset passes one billion images." |
| 4 Story 03 | 557-744 | ROBOTICS / Robotics startup raises $40M / 3 spec lines | Amber panel wipes over previous | "Story three. A robotics startup raises forty million dollars." |
| 5 Closing | 744-937 | RECAP / three numeral rows / fictional-content source line / sign-off | Navy cover wipes in, rows rise 14 f apart, settled by frame +84, held to the end | "That was the sample bulletin. All stories are fictional." |

Persistent layers: SAMPLE BULLETIN tag (top right, inside the 80 px margin), BREAKING ticker bar (y 936-1000, 6 px/frame), scanlines (0.18 opacity, 1 px/frame drift).
