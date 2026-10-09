# Storyboard: karaoke-caption-short

Brief: ~30 s, 1080x1920 @ 30 fps, Douyin-style big word-by-word highlighted captions, Simplified Chinese voice `zh-CN-XiaoxiaoNeural` (+0%), highlight `#FFD400`, flowing gradient background, one code-drawn card per method.

Narration is the master clock (`assets/audio/timeline.json`): 5 segments, gap 450 ms, tail 1.5 s, total 820 frames (27.3 s).

| # | Frames | On-screen text (chunks) | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Hook | 0-172 | 你背过的东西 / 为什么三天就忘 / 试试这三个方法 | Card "3天": memory bar drains 100% to 30%, day pills pop in. Emphasis pop on "忘" | s1 "你背过的东西，为什么三天就忘？试试这三个方法。" |
| 2 Method 1 | 172-374 | 第一 间隔重复 / 今天学 明天复习 / 三天后再复习一次 | Card "1 间隔重复": forgetting curve draws itself, resets at 今天 / 明天 / 3天后 with dots popping. Pop on "间隔" | s2 |
| 3 Method 2 | 374-533 | 第二 主动回忆 / 合上书 自己把重点说一遍 | Card "2 主动回忆": book closes, bubble fills with 3 lines + check marks. Pop on "合上" | s3 |
| 4 Method 3 | 533-682 | 第三 教给别人 / 能讲清楚 / 才是真的懂 | Card "3 教给别人": teacher sends dots to learner, bulb lights up. Pop on "懂" | s4 |
| 5 CTA | 682-820 | 关注我 明天讲怎么做笔记 | Card "明天": +关注 pill pulses, notebook lines write. Pop on "笔记". Tail held 1.5 s | s5 |

Global: gradient angle drifts, 3 blurred blobs drift ~30 px/s, 8 px progress bar on top, captions centered at y 1150 inside the safe zone (left 80, right 140, bottom 420 clear). Chunk-in spring (damping 14, stiffness 220) with hard cuts between chunks.
