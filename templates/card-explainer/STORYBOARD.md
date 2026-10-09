# Storyboard: card-explainer

Brief: 番茄工作法为什么有效 explainer, ~60 s, 1920x1080 @ 30 fps, zh-CN-YunxiNeural, Bilibili science style, one key sentence per card. Narration is the master clock: card length = audio duration + 10 frames; the next card starts 6 frames before the previous one ends. Generated frame ranges below come from `assets/audio/plan.json` (written by `scripts/build.mjs`).

Beat mapping: Title (c1), Hook (c2), Points (c3-c7), Summary (c8), Outro (c9). Layouts used: title, key (x3, three variants), big number, compare, tally, list, outro.

| # | Frames | Layout | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|---|
| 1 | 0-255 | title | 番茄工作法为什么有效 | Orange tomato illustration right; headline fades up, attribution line | VO: 你是不是总觉得，自己专注不了？今天，我们来聊聊：番茄工作法为什么有效。 |
| 2 | 249-452 | key | 专注力不是意志力问题，而是环境设计问题。 | Sentence revealed phrase by phrase with narration; highlighter sweeps (12 f) on the key phrase | VO: 先记住这句话。专注力不是意志力问题，而是环境设计问题。 |
| 3 | 446-629 | bignumber | 25 分钟 / 每段只做一件事 | 25 counts up (30 f) when spoken; ring draws around a dial | VO: 番茄工作法把时间切成 25 分钟一段，每段只做一件事。 |
| 4 | 623-886 | compare | 没有终点 vs 固定 25 分钟 | Two columns slide in with 5 f stagger; right column highlighted | VO: 为什么这样有用？因为固定的结束时间降低了开始的心理门槛：你只需要坚持 25 分钟。 |
| 5 | 880-1101 | key | 短休息让大脑有机会整理刚刚的信息，而不是硬撑到疲劳。 | Sentence revealed phrase by phrase with narration; highlighter sweeps (12 f) on the key phrase | VO: 再看休息。短休息让大脑有机会整理刚刚的信息，而不是硬撑到疲劳。 |
| 6 | 1095-1294 | tally | 每完成一个番茄，就记一个记号 | Tomatoes appear one by one, white tick draws on each | VO: 还有一点。每完成一个番茄，就记一个记号，进度变得看得见。 |
| 7 | 1288-1452 | key | 先开始，再变好。 | Sentence revealed phrase by phrase with narration; highlighter sweeps (12 f) on the key phrase | VO: 所以，真正的秘诀是：先开始，再变好。 |
| 8 | 1446-1683 | list | 三件事就够了 | Three bullets appear on the clause that introduces each | VO: 回头看，三件事就够了：把时间切成小段，认真地短休息，再把进度记下来。 |
| 9 | 1677-1839 | outro | 开始你的第一个番茄 | Tomato with tick, handle line, 1.5 s hold | VO: 现在，就去开始你的第一个番茄吧。 |

All cards drift 1.00 -> 1.02, enter with translateY 60 -> 0 (power3.out 0.5 s), exit scale 0.96 + fade over 10 frames. Captions: one clause at a time, 6-16 characters, bottom centre. Progress bar along the top plus a NN / 09 counter.
