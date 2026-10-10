---
name: agent-video-styles
description: Turn a video request into a styled, rendered MP4 by writing code. Picks one documented visual style (SaaS launch promo, Apple-style keynote, kinetic typography, data story, dark explainer, 3Blue1Brown math, karaoke captions, character dialogue, pixel art and more), chooses the right tool (Remotion, HyperFrames, Manim, HTML capture), then storyboards, builds, renders and verifies the video. Use whenever the user asks to make, design, restyle or fix a video, promo, launch film, explainer, motion graphic, animated captions, lyric video or short with code, even if they name no style or tool (e.g. "make a launch video for my app", "turn this article into a video", "做个产品宣传片"). Not for generative video models (Sora, Veo, Kling, Seedance) or digital avatars.
---

# Agent Video Styles

You make videos by writing code that renders frames. Quality comes from committing to ONE named style and following its recipe exactly, not from improvising effects. Every style file in `references/styles/` encodes a look that real creators have shipped, with concrete tokens (hex, px, springs, frame counts).

## Workflow

Follow these steps in order. Do not skip the storyboard or the verification.

### 1. Brief

Extract, or ask for only what is missing and cannot be defaulted (max 3 questions in one message):

- **Goal and audience**: what should the viewer do or understand?
- **Platform and aspect**: X/YouTube 16:9, Shorts/Reels/TikTok/Douyin 9:16, feed 1:1 or 4:5
- **Length**: default 30 s for promos, 45-90 s for explainers
- **Inputs**: product name, copy, logo, screenshots, footage, data files, script
- **Audio**: music only, voiceover (TTS), or silent; caption language
- **Brand**: accent color, font; otherwise use the style defaults

### 2. Pick a style

Use the table below (full details in `references/catalog.md`). Match on goal, platform and the inputs the user actually has. If the user names a look, map it with the aliases. If two styles fit equally, give the user the top two with a one-line reason each and a recommendation, then proceed with the recommendation unless they object. Never blend two styles unless asked; use a style's listed variants instead. Prefer core styles; choose an experimental one only when the brief clearly asks for its specific look, and tell the user it is less proven.

<!-- catalog:start -->
| Style | Pick it for | Tool | Aspect |
|---|---|---|---|
| `apple-keynote-minimal` | Premium product or hardware reveals, major version launches | hyperframes | 16:9, 9:16 |
| `card-explainer` | Turning blog posts, WeChat or Feishu articles, READMEs, PDFs or slide decks into 1-3 minute videos | hyperframes | 16:9, 9:16 |
| `character-dialogue` | Long-form explainers and news digests that need a friendly voice (the Japanese Zundamon / VOICEVOX format) | remotion | 16:9, 9:16 |
| `cinematic-hud-reel` | Personal-brand or creator intros, channel trailers | hyperframes | 16:9, 9:16 |
| `code-terminal-walkthrough` | Developer-tool launches, library and API tutorials, changelog or PR videos | hyperframes | 16:9, 1:1 |
| `dark-diagram-explainer` | Explaining a technical concept, tool, architecture or piece of news | remotion | 16:9, 9:16 |
| `data-story-charts` | Metrics announcements, reports and survey results | remotion | 16:9, 9:16, 1:1 |
| `flat-cartoon-explainer` | Pop-science, kids' education and "how does X work" explainers on YouTube and Bilibili | hyperframes | 16:9, 9:16 |
| `karaoke-caption-short` | Faceless TikTok, Douyin, Reels and Shorts channels at volume | remotion | 9:16 |
| `kinetic-typography` | Manifestos, announcements, quotes and teasers with no visuals available | hyperframes | 9:16, 16:9, 1:1 |
| `math-manim` | Math, physics, algorithms and machine-learning concepts | manim | 16:9, 9:16 |
| `painterly-canvas` | Lyric videos, poems, story moments and emotional brand pieces | html-capture | 1:1, 9:16, 16:9 |
| `paper-cut-collage` | Cultural, heritage and history stories with a handmade tone | hyperframes | 16:9, 9:16, 1:1, 4:5 |
| `pixel-retro` | Vertical music videos, PSAs and playful brand shorts for Douyin, TikTok and Reels | hyperframes | 9:16, 16:9 |
| `procedural-3d-sting` | Logo stings, channel or app openers, game and festival intros | remotion | 16:9, 1:1 |
| `saas-launch-promo` | App, SaaS or browser-extension launch on X, Product Hunt or LinkedIn | remotion | 16:9, 9:16 |
| `talking-head-overlay` | Knowledge creators and founders who already record talking-head videos | remotion | 16:9, 9:16 |
| `ui-camera-tour` | Product demos, feature walkthroughs, changelog videos | remotion | 16:9, 9:16 |

**Experimental** (fewer public examples; pick one only when the brief asks for that specific look):

| Style | Pick it for | Tool | Aspect |
|---|---|---|---|
| `abstract-generative-loop` | Website hero backgrounds and ambient loops | html-capture | 1:1, 16:9, 9:16 |
| `audiogram-visualizer` | Podcast clips and audio teasers for X, LinkedIn and Shorts | remotion | 1:1, 9:16, 16:9 |
| `broadcast-news` | Daily AI-news or changelog digests with TTS narration, produced in bulk | hyperframes | 16:9 |
| `chat-social-ui` | Story-driven or meme shorts told as a text conversation on TikTok, Reels and Shorts | hyperframes | 9:16, 16:9 |
| `editorial-swiss` | Reports, annual summaries, research findings and statistics | hyperframes | 16:9, 4:5 |
| `glitch-vfx` | Gaming, crypto and hacker-themed intros and stings (5-20 s) | hyperframes | 16:9, 9:16 |
| `icon-burst-title` | Channel intros and course openers (10-15 s) | remotion | 16:9, 9:16 |
| `isometric-explainer` | Infrastructure, cloud, device and product-system explainers | remotion | 1:1, 9:16, 16:9 |
| `line-reveal-story` | Picture-book style and emotional brand stories for vertical platforms | hyperframes | 9:16, 4:5 |
| `map-geo-story` | Travel, logistics or expansion routes; location datasets | remotion | 16:9, 9:16 |
| `product-turntable-3d` | Hardware and e-commerce launch teasers | remotion | 16:9, 1:1 |
| `social-carousel-cards` | Tips, listicles, tutorials and recaps for Instagram and Xiaohongshu feeds | remotion | 4:5 |
| `storybook-picture-book` | Children's bedtime stories and holiday greetings (30-60 s) | hyperframes | 16:9, 9:16, 1:1 |
| `vintage-sketch` | History, craft, heritage and biography explainers | hyperframes | 16:9, 4:5 |
| `visual-journalism` | Commentary and history explainers (60-120 s) | hyperframes | 16:9, 9:16 |
| `whiteboard-handwriting` | Classroom explainers and onboarding walkthroughs | hyperframes | 16:9, 1:1 |
<!-- catalog:end -->

**Aliases**: "Apple style" -> apple-keynote-minimal; "3Blue1Brown", "3b1b" -> math-manim; "Fireship", "Kurzgesagt" -> dark-diagram-explainer; "TikTok/Hormozi captions" -> karaoke-caption-short; "Zundamon", "ゆっくり", "VOICEVOX" -> character-dialogue; "公众号/文章转视频", "B站科普" -> card-explainer; "bar chart race", "Top 10" -> data-story-charts (ranking variant); "Product Hunt video" -> saas-launch-promo; "sizzle reel", "showreel" -> cinematic-hud-reel; "logo intro" -> procedural-3d-sting; "lyric video" -> kinetic-typography (lyric variant), pixel-retro or painterly-canvas; "paper cut", "collage", "剪纸" -> paper-cut-collage.

**Experimental aliases**: "news bulletin", "breaking news" -> broadcast-news; "fake text story", "iMessage story", "tweet animation" -> chat-social-ui; "whiteboard animation" -> whiteboard-handwriting; "isometric" -> isometric-explainer; "glitch intro" -> glitch-vfx; "podcast clip", "audiogram", "waveform" -> audiogram-visualizer; "looping background", "hero loop" -> abstract-generative-loop; "picture book", "bedtime story", "绘本" -> storybook-picture-book; "Vox style" -> visual-journalism; "line art reveal" -> line-reveal-story; "channel intro title" -> icon-burst-title; "engraving", "sepia sketch" -> vintage-sketch; "carousel", "card news", "小红书卡片" -> social-carousel-cards; "product turntable", "360 product" -> product-turntable-3d; "Swiss design", "grid poster" -> editorial-swiss; "map animation", "route map" -> map-geo-story.

### 3. Load the recipe

Read the whole style file `references/styles/<id>.md` and the tool file `references/tools/<tool>.md` for its primary tool (`remotion`, `hyperframes`, `manim`, `html-capture`). Use an alternative tool only if the user requires it or the primary is unavailable. For voiceover or captions, also read `references/audio-tts-captions.md`.

For API details beyond the tool file, use the official skills if installed (`remotion-dev/skills`, `heygen-com/hyperframes`) or the docs linked in the tool file.

### 4. Storyboard before code

Write a scene table and show it to the user before building anything longer than 15 s:

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|

Derive frame ranges from the style's Structure table: keep its proportions, scale them to the requested length, and snap cuts to the beat grid when the style uses one. With voiceover: write the narration first, run `scripts/tts.py` to get audio plus `timeline.json`, and let segment durations set scene lengths (narration is the master clock). Check the total narration length against the target before building; `references/audio-tts-captions.md` explains how to lengthen or shorten it.

If no user is available to approve (an unattended run), save the table as `STORYBOARD.md` next to the project and continue.

### 5. Build

- Scaffold the project as the tool file describes. Put everything a user would change (copy, colors, timings, data, voice) in ONE `content.json`, and every style token (fonts, sizes, spring configs, durations) in ONE theme module that reads it; scenes import only from the theme. The tool file shows how to load `content.json` for that tool.
- One component or file per scene. Build and check scenes one at a time.
- Use real user assets and real copy. Never lorem ipsum, never invented logos of real companies.
- Determinism: every visual value is a function of the frame number. No `Date.now()`, no unseeded randomness, no CSS transitions, no network fetches during render.
- Load fonts before the first frame; for Chinese, Japanese or Korean text use Noto Sans SC / TC / JP / KR (or the style's CJK choice) and pace by characters, not words.

### 6. Render stills, then the video

Render one still per scene at its most important frame and LOOK at each image. Fix layout, overflow, contrast and font problems now; it is 10x cheaper than after a full render. Each tool file has a "stills" recipe (Remotion `remotion still --image-format=png`, HyperFrames `snapshot`, Manim draft render plus `ffmpeg -ss`, HTML capture with a short `--frames` range). Then render the full video at the target size and fps.

### 7. Verify

Run `python scripts/inspect_video.py <video> --frames 12 --out <video>.sheet.png`, view the contact sheet, and check:

- The script's warnings (wrong duration, narration cut off, black or static video) and its "longest still stretch". A still stretch is fine when the style calls for a hold or a slow drift; otherwise it usually means an animation never started. Pass `--tail-hold` if the style holds its end card longer than 3 s after the narration.
- Every item in the style's **Quality bar**, one by one; fix and re-render on any failure
- Text never clipped, never closer to the edge than the style's safe area
- Captions match the narration timing within 1-2 frames

Report honestly what you checked. Do not claim the video is finished without having viewed rendered frames.

### 8. Deliver

Give the output path, duration, resolution, the style id used, and how to change the main parameters (copy, colors, timing) without touching scene code. Mention licensing when relevant: Remotion requires a paid Company License for for-profit companies with 4+ people; Edge TTS is an unofficial client, so check terms before commercial use.

## Scripts

| Script | Use |
|---|---|
| `scripts/tts.py` | Text segments -> per-segment MP3 + `timeline.json` with word timings (Edge TTS) |
| `scripts/inspect_video.py` | Probe summary, contact sheet, warnings for black/frozen/mismatched output |
| `scripts/make_preview.py` | Compress a render into a small web preview MP4 + poster image (`--poster-at` takes a 0-1 fraction or seconds) |
| `scripts/capture_html.mjs` | Render any deterministic HTML/canvas page (`window.renderFrame(i, fps)`) to MP4 |

## Rules that apply to every style

- One focal point per frame; motion leads the eye to it.
- No linear easing on movement. Springs or ease-out curves only.
- Nothing static for more than ~1 s unless the style says otherwise (a slow camera drift counts).
- Text stays on screen long enough to read: about `0.5 s + words / 3.5` (English) or `0.5 s + chars / 5` (CJK).
- Respect safe areas, especially platform UI zones on vertical video.
- The last frame is intentional (logo, CTA or a settled final state), held at least 1 s.
- Confirm in a still that the intended font actually rendered. Missing fonts fall back to Arial or a system font silently, and the tools' checks still pass.
- Text contrast at least 4.5:1 (3:1 for display type over 60 px). White on a light accent such as green or yellow usually fails; use dark ink instead.
- Technical content is checked, not assumed: run code snippets and commands you show, and keep facts and numbers traceable. Fictional numbers are allowed only when labelled as sample data on screen.
- If the user wants a silent video, sound-related Quality bar items are N/A. Never add music or sound you cannot license; synthesize it in code or leave it out.
