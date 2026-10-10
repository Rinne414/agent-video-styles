# Storyboard: 5 rules for commit messages (4:5, 1080x1350, 30 fps, 20 s = 600 frames, silent)

Six cards (cover + 5 rules; the brief asks for no separate CTA card, so the handle button lives on card 6). Swipe = 14 frames, bezier(0.22,1,0.36,1); the next card starts entering at the swipe start.

| # | Frames (settled) | On-screen text | Visual + motion | Audio |
|---|---|---|---|---|
| 1 Cover | 0-90 | 写好 commit / message 的 / 5 条规则; 左滑看完，下次提交就用上 | git log mock (4 sample commits), swipe-hint arrow nudges twice | none |
| 2 Rule 1 | 90-190 | 用祈使句 / 开头 | bad vs good: Added login page (struck) vs Add login page, accent underline wipe | none |
| 3 Rule 2 | 190-290 | 首行不超过 / 50 字符 | big numeral counter 0 -> 32 / 50 + meter bar, tick at 50 | none |
| 4 Rule 3 (dark) | 290-390 | 说明为什么， / 而不是怎么做 | commit message mock: subject + accent-barred reason body | none |
| 5 Rule 4 | 390-490 | 一个 commit / 只做一件事 | 3-commit timeline (feat / fix / docs) | none |
| 6 Rule 5 + handle | 490-600 | 引用 issue / 编号 | footer "Closes #128" chip, then handle button (sample handle) | none |

PNG export: one still per card at its settled frame (`pnpm run stills` -> out/cards/01..06.png).
