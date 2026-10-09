# 03 - Chinese-language creators and KOLs: code-driven AI video (research as of 2026-10-10)

Scope: videos produced by AI coding agents writing code (Remotion, HyperFrames, Manim, HTML/GSAP, Canvas/SVG, Three.js) in the Chinese-language ecosystem. Generative video models and avatars excluded.

Evidence legend: [opened] = page opened and read via fetch; [snippet] = only a search-result snippet or aggregator summary; [unverified] = not confirmed. Dates are as shown on the page. Douyin, Xiaohongshu, Jike and V2EX returned no usable pages; Bilibili returned a captcha for the two `opus` article links but the BV video page opened. Zhihu, Juejin and some CSDN pages returned 403 / "Please wait" to the fetcher, so those are [snippet] only.

Important caveat: almost all Chinese-language sources are tutorials and skill repos. Very few link to the actual finished videos, so "visual style" is mostly taken from READMEs and written descriptions, not from watching the videos. No creator's view counts on Douyin/Xiaohongshu could be confirmed.

---

## Styles observed

### 1. Black-canvas Neon Explainer (Douyin-science look)
- 简体中文名: 黑底霓虹科普动画 (抖音科普风)
- Visual signature: pure black canvas, white line art with one purple accent, ultra-bold heavy sans headline type, star-field/fog or dot-field wave backdrop, capsule HUD at top and chapter progress bar at bottom, white-on-black-stroke subtitles aligned to word boundaries.
- Typical use: 3-5 minute topic explainers (e.g. "RAG and knowledge bases"). Horizontal 1280x720, 30 fps (vertical not supported by that repo).
- Tools: Claude Code / Codex + Remotion; edge-tts (zh-CN-YunxiNeural male) or Volcengine TTS 2.0 with forced alignment; kokoro-82m for English.
- Chinese-market notes: the look is explicitly credited to the Douyin creator @图灵宇宙; Chinese subtitle blocks budgeted at 16 characters; length tiers measured in characters (650-880 chars for 2-3 min).

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| Vincentwei1021 - anything2explainer | GitHub (mirrored on GitCode/AtomGit) | https://github.com/Vincentwei1021/anything2explainer [opened]; mirror https://gitcode.com/gh_mirrors/an/anything2explainer [opened] | undated (page footer 2026); ~2.4k stars | Claude Code/Codex + Remotion | 9 stages, 4 user confirmation points, 8 parallel agents, ~40 min for 4'35" cut, 1-3 h per video. License PolyForm Noncommercial 1.0.0 (commercial needs author permission); fonts SIL OFL 1.1 |
| Vincentwei1021 - video-shotcraft | GitHub / skill-cn.com | https://www.skill-cn.com/practice/279 [opened]; repo https://github.com/Vincentwei1021/video-shotcraft | page updated 2026-07-19 | Codex/Claude Code + Remotion | 106 shot-recipe cards, 161 motion previews, "Ink Press" template (36.2 s, 1920x1080, 30 fps): 2.5D page camera, subtitles, flash cuts, digit rolls, SFX. License not stated on page [unverified] |
| @图灵宇宙 (source inspiration, not a coding-agent creator as far as shown) | Douyin | no URL found; search for the handle returned nothing relevant [unverified] | - | - | Named only as inspiration in the README above |

Independent examples: 2 (anything2explainer, video-shotcraft; same author) plus 1 inspiration account [unverified]. Effectively 1 independent author.

### 2. Hand-drawn Flat Cartoon Pop-Science (code-drawn, beat-synced)
- 简体中文名: 代码手绘扁平科普动画
- Visual signature: bright flat cartoon, small robot host plus generic figures drawn frame-by-frame on Canvas, every on-screen action pinned to a narration word, no static stretch longer than 2 s.
- Typical use: 5-6 minute 16:9 explainers on YouTube/Bilibili style channels.
- Tools: Claude Code + HyperFrames (HTML/Canvas); Azure Speech voices 晓伊 (Xiaoyi) and 晓秋 (Xiaoqiu) with per-word timing; Noto Sans SC captions.
- Workflow: fact ledger with sources + narration + "beat table" confirmed by the user, then 4 code files, then engine runs 11 acceptance checks and frame sampling every 0.7 s.

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| mofyer - pop-science-video | GitHub (MIT, 0 stars) | https://github.com/mofyer/pop-science-video [opened] | undated; demo titled 《不会画画也能做动画：Opus 5.5 出片工作流全拆解》 (6'05", 1080p on YouTube https://youtu.be/ogl79nqNduM) | Claude Code skill + HyperFrames | no image/video generation models; author notes one scene opening is near-static ~3 s |
| a252937166 - claude-video-studio | GitHub (MIT, 7 stars) | https://github.com/a252937166/claude-video-studio [opened] | undated | Claude Code skill + HyperFrames, HTML/GSAP | pixel-art and flat cutout styles "publish-ready"; see styles 3 and 4 |

Independent examples: 2.

### 3. Pixel-Art MV / PSA (vertical, lyric and beat synced)
- 简体中文名: 像素风 MV / 公益短片 (竖屏)
- Visual signature: 8-bit sprites built from palette grids, vertical 9:16, timed lyric captions, speed ramps and echo trails on beat.
- Typical use: Douyin/TikTok/Reels short MVs and PSAs.
- Tools: Claude Code + HyperFrames, HTML/GSAP; scripts for lyric-to-SRT, local Chinese ASR with timestamps, beat-offset measurement.
- Also seen in a Taiwan-based agency's test: a 15 s vertical brand short with 8-bit character art (1080x1920, 30 fps) - https://des13.com/news/ai/1734-claude-opus.html [opened] (published 2026-09-29, Traditional Chinese, Taiwan; counted as Chinese-language but not mainland).
- Also a "full-network Claude video guide" on X says the author made pixel MV, flat animation and pop-science shorts in one week and that geometric/pixel/flat shapes and typography suit the method, character turns and natural limb motion do not: https://x.com/Mrooo03/article/2105195950142566783 [snippet; 402 on fetch, author handle Mrooo03, ~9 days before crawl].

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| a252937166 | GitHub | https://github.com/a252937166/claude-video-studio [opened] | undated | HyperFrames | repo says five pixel-art MVs/PSAs, flat-cutout World Cup edits, six 3D experiment rounds in one week; 3D "not recommended" |
| Mrooo03 | X article | https://x.com/Mrooo03/article/2105195950142566783 | ~Sept-Oct 2026 [snippet] | Claude + HyperFrames | one-two hours per publishable pixel/explainer piece (author's estimate) |
| 益盛科技/des13 (Taiwan) | company blog | https://des13.com/news/ai/1734-claude-opus.html [opened] | 2026-09-29 | Opus 5.5 + HyperFrames | 8-bit vertical brand short, 23 min + 4 min revision, ~10.7M total tokens (83k output) |

Independent examples: 3.

### 4. Article-to-Video Explainer (公众号/飞书 article to narrated video)
- 简体中文名: 文章转视频 / 公众号文章解读视频
- Visual signature: PPT-like clean slides in "B站科普区" style - 5-8 key sentences ("金句") each given one animated card; narration plus subtitles; both 16:9 and 9:16 versions seen.
- Typical use: turning WeChat official-account or Feishu articles into 1-minute explainers.
- Tools: Codex or Claude Code + HyperFrames; MiniMax TTS in hyperframes-fix.
- Distinctive: the source material is a 公众号 article URL - uniquely Chinese publishing pipeline.

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| 不大姐姐AI智能体 | jishuzhan.net (repost) | https://jishuzhan.net/article/2065385565364776961 [opened] | 2026-06-12 | Codex + HyperFrames plugin | 公众号 article -> ~1 min "科普动画风格" 16:9; suggests 5-scene storyboard, image-model backgrounds; standard CSS3 only to avoid render failures |
| 大强同学 | cnblogs / Zhihu / Toutiao | https://www.cnblogs.com/dqtx33/p/19959801 (login redirect); https://zhuanlan.zhihu.com/p/2033210545118163573 (403) | ~2026-06 [snippet] | Claude Code + HyperFrames | DESIGN.md (palette, fonts, visual style) -> split article into scenes -> HTML with data-start/data-duration [snippet] |
| (CSDN) 2402_82616859 | CSDN | https://blog.csdn.net/2402_82616859/article/details/160661542 | ~2026-06 [snippet; fetch failed] | Claude Code + HyperFrames | "把这个文章使用HyperFrames做个视频" one-liner [snippet] |
| 掘金 article on vertical explainer | Juejin | https://juejin.cn/post/7684261460002504730 | 2026-09 [snippet] | HyperFrames | Feishu article "Codex 实战系列｜零剪辑自动生..." -> 9:16, 1080x1920, ~52 s with typesetting, subtitles, animation [snippet; page did not render] |
| hyperframes-fix (announced on linux.do) | linux.do, repost on 80aj.com | https://www.80aj.com/2026/05/07/hyperframes-ai-video-tool/ | 2026-05-07 | HyperFrames fork | paste 公众号 URL -> download assets, script, render; MiniMax TTS for Chinese voice-over [snippet; repo URL not found; not verified] |
| 鲸选AI | Tencent News | https://news.qq.com/rain/a/20260512A08LEG00 [opened] | 2026-05-12 | Codex + HyperFrames | cases: README-to-explainer, PDF to ~45 s speech video, CSV to bar-chart race, simulated Codex UI |

Independent examples: 6.

### 5. Product Promo / Brand Showreel via Prompt
- 简体中文名: 产品宣传片 / 品牌 Showreel
- Visual signature: dark or deep-blue grid background, browser-frame screenshots arranged as work walls, data-driven map plots, spring-physics UI moves, 15-45 s, mix of 1920x1080 at 30/60 fps and 1080x1920 shorts.
- Tools: Claude Code (Opus 5.5, also Sonnet 5.5) + HyperFrames, GSAP, Python-synthesized music, Mixkit/Wikimedia assets with license records.

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| 益盛科技 (des13) | company blog | https://des13.com/news/ai/1734-claude-opus.html [opened] | 2026-09-29 (updated 2026-10-04) | Opus 5.5 + HyperFrames | four pieces: 40 s Taiwan church map from 4,957 coordinates (25 min), 15 s vertical (23 min), 40 s tech showreel (39 min), 40 s work-wall (41 min); also 45 s paper-cut/watercolor church animation (Sonnet 5.5, per page); full token table disclosed |
| AI小集 / ai-bot.cn | tool-directory site, WeChat repost | https://ai-bot.cn/claude-opus-5-5-video-tutorial/ [opened] | "4 days before crawl" (Oct 2026) | Opus 5.5 | 7 cases: 30 s product promo with original music + Chinese narration, children's picture-book (rabbit National Day), project promo from a repo, 15 s motion-graphics reel, UI shape-morph loop (7-bar beat structure, final frame equals first), 3 min educational short; uses free Microsoft TTS, Playwright + FFmpeg |
| Bruce / heyuan110 | personal blog | https://www.heyuan110.com/posts/ai/2026-01-26-claude-code-remotion-video/ [opened] | 2026-01-25 | Claude Code + Remotion | Douyin 2025 Top-10 songs video: Douyin red #FE2C55 + cyan #25F4EE, Noto Sans SC + Poppins, spring rank badges, typewriter titles, particle burst, waveforms; 30 s iTunes previews; Pexels loops; 82 MB 1080p; remotion-best-practices (31 rules) + media-download skill. Aspect ratio not stated |
| Runoob (菜鸟教程) | tutorial site | https://www.runoob.com/claude-code/claude-code-remotion-best-practices.html [opened] | undated (images 2026/05) | Claude Code + Remotion | sample prompts: 6 s "Hello Runoob" black bg + impact text + gold particles + green glow; 8 s counter 0 to 1,000,000 with bounce; 15 s countdown; mentions 1080x1920 for Douyin |

Independent examples: 4.

### 6. Talking-Head Rough Cut + Animated Overlay (口播剪辑 + 动效)
- 简体中文名: 口播精剪 + 动态字幕/动效叠加
- Visual signature: presenter footage with filler words/pauses removed, burned-in captions (video-use default: two-word uppercase chunks), HyperFrames/Remotion overlays: split-screen, centered presenter with side cards, fast-cut montage, animated captions and floating cards.
- Tools: video-use (browser-use), Cap-based workflow, HyperFrames or Remotion.
- Chinese-market note: this is the 知识口播 + 动态字幕 format; no ready-made "剪映-style" subtitle pack was found.

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| browser-use - video-use | GitHub (~12k stars per article), covered by 开源星探 | https://developer.cloud.tencent.com/article/2701503 [opened]; repo https://github.com/browser-use/video-use | 2026-06-30/07-01 | Claude Code + HyperFrames/Remotion/Manim/PIL | cuts fillers, 30 ms fades, burns subtitles, saves project.md; license not stated in article [unverified]. Not itself Chinese-authored |
| 老胡 (LaohuAD, "老胡用AI画梦") - laohu-CapMotion | GitHub; Bilibili, Douyin, Xiaohongshu, WeChat OA | https://github.com/LaohuAD/laohu-CapMotion [opened] | undated | ASR -> EDL rough cut -> SRT -> burn-in; Remotion/HyperFrames animation | code MIT, rules/skills/prompts CC BY-SA 4.0, Cap source AGPLv3; 1 star. Author runs a paid community 老胡画梦枋 and a paid model-access service (prices on author site, not seen) |
| 陈与小金 (cyxjya) | CSDN / AtomGit | https://gitcode.csdn.net/6a22b3ea10ee7a33f2781ae8.html [opened]; https://blog.csdn.net/cyxjya/article/details/161726578 | 2026-06-05 | Remotion vs HyperFrames on same footage | Remotion: usable 30 s in 7 min, 43 USD for 1'24" full; HyperFrames: 28 USD, stalled at semi-finished cut, outputs transparent overlay layers. Single-person test, personal numbers |

Independent examples: 3.

### 7. Math / CS Teaching Animation (Manim, 3Blue1Brown-style)
- 简体中文名: Manim 数学/算法讲解动画
- Visual signature: dark background, LaTeX-style formulas, step-wise transformations, narrated; Chinese presets "educational / presentation / proof / concept".
- Evidence is thin for Chinese creators: only one Chinese-language agent project and older DeepSeek-R1 tutorials (2025).

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| gqy20 - manim-agent | GitHub (MIT, 6 stars) | https://github.com/gqy20/manim-agent [opened] | undated | Claude SDK writes Manim, renders, reviews, iterates | MiniMax TTS speech-2.8-hd, default voice female-tianmei, "甜美温柔"/"演讲主持" voice styles, subtitle timestamp sync; README in Chinese; demo manim.gqy20.top |
| CSDN DeepSeek-R1 + Manim | CSDN | https://blog.csdn.net/sinat_37574187/article/details/145527072 | 2025 (article ID suggests early 2025) [snippet] | DeepSeek-R1 + DeepSeek-Manim-Animation-Generator | natural language -> Manim script -> manual render [snippet] |
| 宝玉AI (Baoyu) | AITNT repost | https://m.aitntnews.com/newDetail.html?newId=29909 [opened] | 2026-10-01 | Opus 5.5 | lists Manim, p5.js, three.js among code-video routes; hand-drawn cartoon teaching video as author's own example |

Independent examples: 3 (weak).

### 8. HTML-native Design/Motion Skill Packs (design-led KOL, Apple/keynote-adjacent)
- 简体中文名: HTML 原生设计/动效技能包
- Visual signature: 60 HTML-native styles (20 web, 20 slides, 20 infographic), graded bold/neutral/quiet; Stage/Sprite timeline (useTime, useSprite, interpolate, Easing); exports 25 fps / 60 fps MP4, GIF, BGM.
- No page confirmed a specific "Apple launch-event" style; that remains an open gap.

| creator | platform | URL | date | tool | workflow note |
|---|---|---|---|---|---|
| 花叔 (Huasheng / alchaincyf) - huashu-design | GitHub 24.7k stars, 2.8k forks; Bilibili space.bilibili.com/14097567; huasheng.ai | https://github.com/alchaincyf/huashu-design [opened] | MIT effective 2026-05-14 | skill for Claude Code/Cursor/Codex | free under MIT (earlier license required commercial authorization); hero demo 25 s MP4; limits: no complex 3D/physics/particles; "blank-brand designs slip to ~60-65 quality" |

Independent examples: 1.

### 9. Beginner tutorial / procedural live demo (not a visual style, but the dominant content type)
Bilibili: 五里墩茶社 (about 66k followers), HyperFrames tutorial 2'49", 2026-06-14, 6,541 views, 124 likes, 334 favorites - https://www.bilibili.com/video/BV17WJx6HESW/ [opened]. Uses a design system for consistency, ListenHub for voice-over, timed subtitles, `doctor` self-check; description includes sponsored API promo and community link.

---

## Creators

| name / handle | platform | what they do | URL | status |
|---|---|---|---|---|
| 花叔 (alchaincyf, Huasheng) | GitHub, Bilibili, X, huasheng.ai | design/animation skill pack, 24.7k stars; "AI Native Coder, 500k+ readers" per a mirror | https://github.com/alchaincyf/huashu-design | opened; mirror claim of 500k readers is [snippet] https://llmbase.ai/skills/alchaincyf/huashu-research/ |
| 宝玉AI (Baoyu) | X / AITNT | widely-read Chinese explainer of Opus 5.5 code-video pipeline, 2026-10-01 | https://m.aitntnews.com/newDetail.html?newId=29909 | opened |
| AI小集 (ai-bot.cn) | WeChat OA + directory | 7-case prompt roundup | https://ai-bot.cn/claude-opus-5-5-video-tutorial/ | opened |
| APIYI blog | company blog | 4-stage Opus 5.5 code-to-video guide, 2026-09-27; promotes API access | https://help.apiyi.com/claude-opus-5-5-code-to-video-guide.html | opened |
| Vincentwei1021 | GitHub | anything2explainer (~2.4k stars), video-shotcraft | https://github.com/Vincentwei1021/anything2explainer | opened |
| 老胡 / LaohuAD | Bilibili, Douyin, Xiaohongshu, WeChat OA | 口播 workflow, paid community | https://github.com/LaohuAD/laohu-CapMotion | opened |
| 五里墩茶社 | Bilibili (~66k) | HyperFrames tutorial | https://www.bilibili.com/video/BV17WJx6HESW/ | opened |
| 陈与小金 (cyxjya) | CSDN/AtomGit | Remotion vs HyperFrames cost test | https://gitcode.csdn.net/6a22b3ea10ee7a33f2781ae8.html | opened |
| 鲸选AI | Tencent News | Codex + HyperFrames cases | https://news.qq.com/rain/a/20260512A08LEG00 | opened |
| Ai学习的老章 | NetEase Hao | HyperFrames "实测,狂喜", 2026-04-27; 22 s 1080p test rendered in ~25 s to 2 MB | https://www.163.com/dy/article/KRI0J69S0519EA27.html | opened |
| 不大姐姐AI智能体 | jishuzhan repost | Codex + HyperFrames 公众号 to video | https://jishuzhan.net/article/2065385565364776961 | opened |
| 益盛科技 (des13) | company blog (Taiwan) | 4+1 Opus 5.5 brand animations with full token/time disclosure | https://des13.com/news/ai/1734-claude-opus.html | opened |
| Bruce (heyuan110) | blog | Remotion Douyin Top-10 | https://www.heyuan110.com/posts/ai/2026-01-26-claude-code-remotion-video/ | opened |
| silenceper | blog | HyperFrames intro (v0.4.41), 2026-05-02 | https://silenceper.com/article/2026-05-02-hyperframes-html-video-rendering/ | opened |
| wshuyi | GitHub | remotion-video-skill (MIT, 394 stars) with MiniMax / Edge TTS | https://github.com/wshuyi/remotion-video-skill | opened |
| mofyer, a252937166, gqy20 | GitHub | small skill repos (see styles 2, 3, 7) | see above | opened |
| 开源星探 | Tencent Cloud dev | video-use coverage | https://developer.cloud.tencent.com/article/2701503 | opened |
| 鸿枫 | SegmentFault | 5 short-video skills roundup, 2026-04-19, advises "装之前看源码" | https://segmentfault.com/a/1190000047718421 | opened |
| Mrooo03, 行者 (X), 大强同学, joshesye | X, cnblogs | tutorials / cases | links in tables | [snippet] only |

No Douyin or Xiaohongshu creator who publicly shows agent-coded video could be confirmed with a URL. [unverified] for any claim that KOLs on those platforms dominate this niche.

---

## Notable workflows and techniques

1. Confirmation gates: anything2explainer has 4 user check points over 9 stages; pop-science-video demands a user-approved fact ledger + beat table before coding. Both treat "storyboard first" as the quality lever. (sources above)
2. Narration as the master clock: Baoyu's pipeline and pop-science-video both align animation events to narration word timestamps; APIYI describes TTS word timestamps driving word-by-word highlighted captions (the dominant short-video caption style). https://help.apiyi.com/claude-opus-5-5-code-to-video-guide.html [opened]
3. Determinism rule: no reading current time, no unseeded randomness, no network at render time (Baoyu article, and a snippet on the Apple-style search); Playwright/Puppeteer frame capture + FFmpeg.
4. DESIGN.md first (palette, fonts, visual style) before writing scenes (大强同学 article) [snippet]; HyperFrames "design system" applied in the Bilibili demo.
5. Prototype the first 20-30 s, then reuse the setup; ask for several B-roll layout options before choosing; send screenshots or sketches (陈与小金).
6. Prompt anatomy that Chinese tutorials repeat: background/goal, concrete content, visual style, timing; e.g. "6 秒、1920×1080、30fps、黑底白字" works better than "做个酷炫片头"; ask for storyboard (口播/画面/屏幕文字/每段时长) before voice-over and render. [snippet] from search result summary of https://www.jxxy.net/ai/articles/claude-remotion-content-video-production/ (not opened).
7. Honest expectation setting: a tutorial says "一句话生成大片" is overstated; reality is "一句话生成科普动画" with iterations [snippet; Zhihu https://zhuanlan.zhihu.com/p/2001357893115584706, 403].
8. Hybrid: Opus directs, image model makes keyframes, Seedance makes shots (ai-bot.cn) - out of scope but shows how Chinese posts mix code-video and generative video.
9. Cost transparency: des13 table (e.g. 40 s showreel ~9.4-13M total tokens, mostly cached reads); 陈与小金 USD figures. These are single-run, personal numbers.
10. Tool choice folklore: Remotion produces more motion-graphics-like defaults (animated captions, floating cards) and has richer training data; HyperFrames is lighter (HTML + GSAP, no build) and Apache-2.0; many Chinese posts stress Remotion's company license (free for individuals and teams up to 3; paid beyond) - single-source claim repeated across articles.

---

## Public resources (and paid ones: public info only)

| resource | author | URL | license | note |
|---|---|---|---|---|
| remotion-dev/skills | Remotion team | https://github.com/remotion-dev/skills (~4.7k stars per snippet) | repo license not checked; Remotion itself source-available with company license | install `npx skills add remotion-dev/skills`; 28-31 rules |
| heygen-com/hyperframes | HeyGen | https://github.com/heygen-com/hyperframes ; docs https://hyperframes.heygen.com/introduction | Apache-2.0 | Node 22+, FFmpeg; templates incl. Warm Grain, Swiss Grid, Kinetic Type, NYT Graph, Vignelli; 50+ blocks; per silenceper article |
| huashu-design | 花叔 | https://github.com/alchaincyf/huashu-design | MIT (since 2026-05-14) | free |
| anything2explainer | Vincentwei1021 | https://github.com/Vincentwei1021/anything2explainer | PolyForm Noncommercial 1.0.0 | commercial use needs authorization |
| video-shotcraft | Vincentwei1021 | https://github.com/Vincentwei1021/video-shotcraft | not stated | 106 shot cards, Ink Press template |
| pop-science-video | mofyer | https://github.com/mofyer/pop-science-video | MIT | Azure voices 晓伊/晓秋 |
| claude-video-studio | a252937166 | https://github.com/a252937166/claude-video-studio | MIT | pixel/flat 9:16 |
| remotion-video-skill | wshuyi | https://github.com/wshuyi/remotion-video-skill | MIT | MiniMax/Edge TTS |
| manim-agent | gqy20 | https://github.com/gqy20/manim-agent | MIT | Chinese README |
| laohu-CapMotion | LaohuAD | https://github.com/LaohuAD/laohu-CapMotion | MIT code; CC BY-SA 4.0 rules; AGPLv3 Cap | |
| video-use | browser-use | https://github.com/browser-use/video-use | not confirmed | ~12k stars |
| docvideoer | coding-ax | search snippet only: Chinese doc-to-Remotion explainer with free TTS, MIT [snippet] | MIT [snippet] | repo URL not seen |
| hyperframes-fix | unknown, linux.do | https://www.80aj.com/2026/05/07/hyperframes-ai-video-tool/ | unknown | repo not found [unverified] |

Paid/commercial items (public info only):
- 老胡画梦枋 (paid AI creative community) and 老胡的模型小屋 (model-access service) per laohu-CapMotion README; prices are on the author's site, not retrieved.
- 五里墩茶社 Bilibili video description includes a sponsored API promotion and community link (price not shown).
- APIYI is an API reseller; its guide promotes its own API access (https://help.apiyi.com/...).
- No Chinese KOL was found selling a closed "video skill" with a visible price. The search for paid skills/知识星球 returned only free tutorials. This is a gap, not evidence of absence.

---

## What looks specific to the Chinese market

- 公众号/飞书 article as the source input, then 1-minute explainer (style 4).
- Douyin-brand aesthetics (red #FE2C55 + cyan #25F4EE) and vertical 1080x1920 as the stated Douyin target (Runoob; heyuan110; des13).
- "B站科普区" PPT-like explainer look as an explicit target (jishuzhan; Juejin snippet).
- Chinese TTS stack: edge-tts Yunxi, Azure 晓伊/晓秋, MiniMax speech-2.8-hd, Volcengine TTS 2.0, ListenHub; free Microsoft TTS in the ai-bot roundup.
- Character-based pacing and subtitle budgets (16 chars/block; ~5.5 chars/s).
- Heavy distribution through aggregator reposts (Tencent Cloud, AtomGit/GitCode, CSDN, 163.com) which copy the same few tutorials; independent originals are fewer than article count suggests.
- Domestic models: only older (2025) DeepSeek-R1 + Manim tutorials found; no 2026 Kimi/GLM/Qwen/Trae video-skill evidence located. Opus 5.5 dominates the 2026-09/10 posts.

---

## Gaps / could not verify

- Douyin, Xiaohongshu, Jike, V2EX: zero direct URLs. Search engine is US-only and these sites block fetchers. The only Douyin URL returned (https://www.douyin.com/video/7637463023485046054) had unrelated content in the snippet.
- Bilibili `opus` articles (1162459815227686921 and 1162170798302035975 - the latter titled "【AI营销】10分钟生成专业营销视频！Claude Code + Remotion让视频制作成本几乎...") returned only a captcha; contents unread. Only titles from search.
- Zhihu (403), Juejin ("Please wait"), cnblogs (login), CSDN (socket closed) pages not readable; claims from them are [snippet].
- Juejin 5-step pipeline article (https://juejin.cn/post/7693358476032622602) could not be read; related content taken from other sources.
- @图灵宇宙: could not confirm account, follower count or videos.
- No actual finished-video links for most cases; visual descriptions come from text. View counts: only one Bilibili video confirmed (6,541 views).
- The Opus 5.5-era articles (Sep-Oct 2026) are mutually inconsistent on some details (e.g. des13 says "five" animations and lists six; a model named in one article body differs from its token table). Numbers quoted are as published.
- "Apple-launch-event" style: no Chinese example found beyond the generic claim that DESIGN.md palette/fonts control the look.
- Data-visualization animation (bar-chart race) appears only as a case mention (Tencent News) and a CSDN TopoJSON map-animation snippet (https://developer.cloud.tencent.com/article/2649052, snippet); no creator-level evidence.
- Remotion licensing claims are repeated secondhand; check remotion.dev before commercial use.
- Version numbers (e.g. HyperFrames 0.4.41 as of 2026-05) are from articles and are likely outdated.
