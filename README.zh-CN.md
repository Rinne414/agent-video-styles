# Agent 视频风格图鉴

[English](README.md)

对编程 Agent 说一句「做个发布视频」，它只能靠猜：一层渐变、几颗粒子、文字淡入淡出。而在 X、YouTube、抖音上真正被转发的视频，其实集中在几种辨识度很高的风格上，每一种都有自己的字号体系、动效语法、节奏和工具。

这个仓库把这些风格整理到一起，并且让它们可以直接用：

- **给 Agent 的 skill**（`skill/`）：一个入口，把需求变成分镜，选定风格和工具（Remotion、HyperFrames、Manim 或纯 HTML 捕获），完成制作、渲染并逐帧检查。
- **每种风格一份配方**（`skill/references/styles/`）：具体数值（色值、像素、弹簧参数、帧数）、场景结构、需求模板、质量检查清单和常见坑。
- **每种风格一个已渲染的模板**（`templates/`）：由 Agent 只看配方做出来。做不出来，就修配方。
- **图鉴网站**（`site/`）：浏览风格，按用途、画幅、工具筛选，或回答五个问题获得推荐。每种风格都列出让它流行起来的创作者及链接。

只收录用代码渲染的视频。视频生成模型（Sora、Veo、Kling、Seedance）与数字人不在范围内。

## 风格

<!-- styles:start -->
| 风格 | 适合 | 工具 | 预览 |
|---|---|---|---|
| [苹果发布会极简风](skill/references/styles/apple-keynote-minimal.md) | 高端产品或硬件发布、大版本更新 | hyperframes | [观看](previews/apple-keynote-minimal.mp4) |
| [金句卡片讲解](skill/references/styles/card-explainer.md) | 把博客、公众号或飞书文章、README、PDF、幻灯片转成 1-3 分钟视频 | hyperframes | [观看](previews/card-explainer.mp4) |
| [双角色对话讲解](skill/references/styles/character-dialogue.md) | 需要亲和感的长篇讲解与资讯汇总（日本 Zundamon / VOICEVOX 格式） | remotion | [观看](previews/character-dialogue.mp4) |
| [电影感 HUD 炫技短片](skill/references/styles/cinematic-hud-reel.md) | 个人品牌或创作者片头、频道预告 | hyperframes | [观看](previews/cinematic-hud-reel.mp4) |
| [代码与终端演示](skill/references/styles/code-terminal-walkthrough.md) | 开发者工具发布、库与 API 教程、更新日志或 PR 视频 | hyperframes | [观看](previews/code-terminal-walkthrough.mp4) |
| [暗色图解讲解](skill/references/styles/dark-diagram-explainer.md) | 讲解技术概念、工具、架构或新闻 | remotion | [观看](previews/dark-diagram-explainer.mp4) |
| [数据故事动画](skill/references/styles/data-story-charts.md) | 指标发布、报告与调研结果 | remotion | [观看](previews/data-story-charts.mp4) |
| [扁平卡通科普](skill/references/styles/flat-cartoon-explainer.md) | YouTube、B站上的科普、儿童教育和“X 是怎么运作的”讲解 | hyperframes | [观看](previews/flat-cartoon-explainer.mp4) |
| [逐字高亮字幕短视频](skill/references/styles/karaoke-caption-short.md) | 批量运营的无露脸抖音、TikTok、Reels、Shorts 账号 | remotion | [观看](previews/karaoke-caption-short.mp4) |
| [动态文字快闪](skill/references/styles/kinetic-typography.md) | 没有素材时的宣言、公告、金句与预告 | hyperframes | [观看](previews/kinetic-typography.mp4) |
| [数学动画讲解（Manim）](skill/references/styles/math-manim.md) | 数学、物理、算法与机器学习概念 | manim | [观看](previews/math-manim.mp4) |
| [水彩水墨笔触动画](skill/references/styles/painterly-canvas.md) | 歌词视频、诗歌、故事片段与情感向品牌短片 | html-capture | [观看](previews/painterly-canvas.mp4) |
| [剪纸拼贴](skill/references/styles/paper-cut-collage.md) | 带手作质感的文化、遗产与历史故事 | hyperframes | [观看](previews/paper-cut-collage.mp4) |
| [像素复古风](skill/references/styles/pixel-retro.md) | 抖音、TikTok、Reels 的竖屏 MV、公益短片和活泼的品牌短片 | hyperframes | [观看](previews/pixel-retro.mp4) |
| [程序化 3D 片头标志](skill/references/styles/procedural-3d-sting.md) | Logo 片头、频道或 App 开场、游戏与活动开场 | remotion | [观看](previews/procedural-3d-sting.mp4) |
| [SaaS 产品发布宣传片](skill/references/styles/saas-launch-promo.md) | 在 X、Product Hunt、LinkedIn 发布 App、SaaS 或浏览器插件 | remotion | [观看](previews/saas-launch-promo.mp4) |
| [口播动效叠加包](skill/references/styles/talking-head-overlay.md) | 已经在拍口播的知识博主与创始人 | remotion | [观看](previews/talking-head-overlay.mp4) |
| [产品界面运镜导览](skill/references/styles/ui-camera-tour.md) | 产品演示、功能导览、更新日志视频 | remotion | [观看](previews/ui-camera-tour.mp4) |

**实验性风格**：公开案例较少，但在特定场景下可能是最佳选择。

| 风格 | 适合 | 工具 | 预览 |
|---|---|---|---|
| [抽象生成式循环](skill/references/styles/abstract-generative-loop.md) | 网站首屏背景与氛围循环 | html-capture | [观看](previews/abstract-generative-loop.mp4) |
| [音频波形可视化](skill/references/styles/audiogram-visualizer.md) | 用于 X、LinkedIn 和 Shorts 的播客切片与音频预告 | remotion | [观看](previews/audiogram-visualizer.mp4) |
| [新闻播报台](skill/references/styles/broadcast-news.md) | 带 TTS 旁白、可批量生产的每日 AI 资讯或更新日志速递 | hyperframes | [观看](previews/broadcast-news.mp4) |
| [聊天与社交界面故事](skill/references/styles/chat-social-ui.md) | 抖音、TikTok、Reels、Shorts 上以聊天记录讲述的故事或梗短片 | hyperframes | [观看](previews/chat-social-ui.mp4) |
| [瑞士网格编辑风](skill/references/styles/editorial-swiss.md) | 报告、年度总结、研究发现与统计数据 | hyperframes | [观看](previews/editorial-swiss.mp4) |
| [故障风特效](skill/references/styles/glitch-vfx.md) | 游戏、加密与黑客主题的开场和片头（5-20 秒） | hyperframes | [观看](previews/glitch-vfx.mp4) |
| [图标爆发标题](skill/references/styles/icon-burst-title.md) | 频道片头与课程开场（10-15 秒） | remotion | [观看](previews/icon-burst-title.mp4) |
| [等距视角讲解](skill/references/styles/isometric-explainer.md) | 基础设施、云、设备与产品系统类讲解 | remotion | [观看](previews/isometric-explainer.mp4) |
| [线稿显影插画故事](skill/references/styles/line-reveal-story.md) | 竖屏平台的绘本风与情感品牌故事 | hyperframes | [观看](previews/line-reveal-story.mp4) |
| [地图叙事动画](skill/references/styles/map-geo-story.md) | 旅行、物流或扩张路线；地点类数据集 | remotion | [观看](previews/map-geo-story.mp4) |
| [3D 产品旋转展示](skill/references/styles/product-turntable-3d.md) | 硬件与电商新品发布预告 | remotion | [观看](previews/product-turntable-3d.mp4) |
| [社交轮播卡片](skill/references/styles/social-carousel-cards.md) | 面向 Instagram 与小红书信息流的干货、清单、教程与复盘 | remotion | [观看](previews/social-carousel-cards.mp4) |
| [绘本故事](skill/references/styles/storybook-picture-book.md) | 儿童睡前故事与节日祝福（30-60 秒） | hyperframes | [观看](previews/storybook-picture-book.mp4) |
| [复古素描](skill/references/styles/vintage-sketch.md) | 历史、工艺、文化遗产与人物传记类讲解 | hyperframes | [观看](previews/vintage-sketch.mp4) |
| [视觉新闻（Vox 风）](skill/references/styles/visual-journalism.md) | 评论与历史类讲解（60-120 秒） | hyperframes | [观看](previews/visual-journalism.mp4) |
| [白板手写](skill/references/styles/whiteboard-handwriting.md) | 课堂讲解与新人引导视频 | hyperframes | [观看](previews/whiteboard-handwriting.mp4) |
<!-- styles:end -->

## 快速开始

1. 为 Claude Code 安装 skill：

   ```bash
   git clone <本仓库> agent-video-styles
   cp -r agent-video-styles/skill ~/.claude/skills/agent-video-styles
   ```

   其他读取 `SKILL.md` 文件夹的 Agent（Codex、Cursor 等）同理：把 `skill/` 复制到它们的 skills 目录。

2. 可选：安装官方工具 skill，获得更深入的 API 帮助：`npx skills add remotion-dev/skills` 和 `npx skills add heygen-com/hyperframes`。

3. 用一句话提需求：

   ```
   帮我的 App Driftboard 做一个 30 秒的发布视频，主色 #6366F1，截图在 ./shots/
   ```

   Agent 会选定风格（或给出两个选项）、写分镜、先渲染静帧检查版面、再渲染视频，并在交付前检查缩略图拼版。

环境要求：Node 22+、pnpm、FFmpeg、Chrome。旁白需要 Python 3.10+ 与 `edge-tts`。Manim 公式需要 uv 和 LaTeX 发行版。

## 在本地浏览图鉴

```bash
pnpm install
pnpm build                      # 校验 data/、重新生成目录、构建 site/dist
python -m http.server 8000 --directory site/dist
```

## 收录标准

每一种风格都有配方，以及 Agent **只凭配方**做出来的模板。风格分为两级：

- **核心**：至少有**两个彼此独立的公开案例**，由 Agent 写代码完成（不同创作者或不同项目）。
- **实验性**：公开案例较少（有时只有 skill 包或组件库），但每一种都按配方实际做过并检查过。其中有些在特定场景下是最佳选择，例如播客片段、聊天记录故事、等距视角的系统图。只有当需求明确要这种视觉时，Agent 才会选用。

研究过但刻意不收录的两种类型及原因，见 [`data/candidates.yaml`](data/candidates.yaml)。

每种风格背后的研究与出处在 `research/`。

## 新增或改进风格

1. 收集至少两个独立的公开案例。
2. 新增 `data/styles/<id>.yaml`（英文与简体中文元数据、出处链接）和 `skill/references/styles/<id>.md`（英文配方），结构参照现有风格。
3. 让 Agent 只凭 skill 按 [`templates/README.md`](templates/README.md) 做出 `templates/<id>/`，再用 `skill/scripts/make_preview.py` 生成预览。
4. 运行 `pnpm check` 与 `pnpm build`。

## 授权与致谢

- 本仓库：[MIT](LICENSE)。模板使用的字体均为开源授权（SIL OFL）。
- **Remotion** 为源码可见授权：个人及 3 人以内公司免费，更大的营利公司需购买 [Company License](https://www.remotion.pro/license)。HyperFrames（Apache-2.0）与 Manim（MIT）没有此限制。
- **Edge TTS**（`skill/scripts/tts.py`）是微软在线服务的非官方客户端，适合原型制作；商用前请查看微软条款。
- 创作者链接指向公开内容，作品版权归原作者所有。本仓库只描述风格，不复制他们的文件，也从未获取或复刻任何付费 skill。
- 基于 [Remotion](https://github.com/remotion-dev/remotion)、[HyperFrames](https://github.com/heygen-com/hyperframes)、[Manim Community](https://github.com/ManimCommunity/manim) 以及各风格页面中致谢的创作者。值得一看的相关整理：[prompt-motion.com](https://prompt-motion.com)、[awesome-opus-5.5-video-prompts](https://github.com/Li-Evan/awesome-opus-5.5-video-prompts)、[lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar)（电影年代风格）、[video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)（镜头配方）、[awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills)。
