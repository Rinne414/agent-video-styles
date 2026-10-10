# Storyboard: whiteboard-handwriting (compound interest)

Brief: ~30 s, 1920x1080, 30 fps, whiteboard explainer, en-US-JennyNeural voiceover (rate +10%).
Planned unattended; narration is the master clock (frames from `assets/audio/timeline.json`, 0.4 s lead).
Total: 976 frames (32.5 s), of which the last 1.4 s is a silent hold on the end card.

Board: `#FAFAF7`, 2x2 zone grid (840x400, 80 px gaps, 30 px inner pad), ink `#1B1F2A`, one accent per block.

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Hook | 12-100 | "Why does $100 snowball?" (96 px), red underline under "snowball" | Question written in one pass, pen follows; underline 4 frames after the word | "Why does a hundred dollars snowball over time?" |
| - | 82-100 | | Eraser sweep (18 frames) clears the hook | silence at the end of the clip |
| 2 Year 1 (zone 1) | 100-291 | "Year 1", "$100", "+10%", "$110", "+$10" | Label + underline, coin circle, amount, arrow with +10% above it, second (bigger) coin, gain underlined; camera 1.00 -> 1.02 -> 1.00 on zone 1 | "Put a hundred dollars in the bank at ten percent a year. After one year, you have one hundred ten." |
| 3 Year 2 (zone 2) | 291-486 | "Year 2", "$110", "+10%", "$121", "interest on interest!" | Same grammar, bigger coins; red ellipse circles "$121"; red note written under | "In year two, you earn ten percent on one hundred ten. That extra dollar is interest on interest." |
| 4 Snowball (zone 3) | 486-670 | "Snowball", "bigger = faster" | Hill line, three snowballs of growing radius rolling down it, speed lines behind the largest; note written last | "Like a snowball rolling downhill, it picks up more snow with every turn, so it grows faster and faster." |
| 5 Start early (zone 4) | 670-847 | "Start early", "40 yrs", "$4,526", "30 yrs", "$1,745", "2.6x" | Two bar outlines (hatched), lengths proportional to final value, green values; red ellipse on $4,526; ratio written | "So start early. Forty years of growth beats thirty by more than two and a half times." |
| - | 829-847 | | Eraser sweep clears the full board | |
| 6 End card | 847-934 | "Start early!" (96 px), green underline, three spark strokes | Written once, settled by frame ~900, held to the end (about 2.4 s hold) | "Start early, and let time do the work." |

Numbers: $100 at 10% a year -> $110 (year 1), $121 (year 2); after 30 years $1,744.94, after 40 years $4,525.93 (ratio 2.59). Sample figures, computed as 100 x 1.1^n.
