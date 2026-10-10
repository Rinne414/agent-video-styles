# Agent Video Styles

[简体中文](README.zh-CN.md)

Tell a coding agent "make a launch video" and it guesses: a gradient, some particles, text fading in and out. The videos people actually share on X, YouTube and Douyin follow a handful of recognizable styles, each with its own type scale, motion grammar, pacing and tooling.

This repo collects those styles in one place and makes them usable:

- **A skill for your agent** (`skill/`): one entry point that turns a request into a storyboard, picks a style and a tool (Remotion, HyperFrames, Manim or plain HTML capture), builds the video, renders it and checks the frames.
- **A recipe per style** (`skill/references/styles/`): concrete tokens (hex, px, springs, frame counts), a scene structure, a brief template, a quality checklist and known pitfalls.
- **A rendered template per style** (`templates/`): produced by an agent working only from the recipe. If the agent could not build it, the recipe was fixed.
- **A gallery** (`site/`): browse the styles, filter by purpose, shape and tool, or answer five questions to get a recommendation. Each style lists the creators who made it popular, with links.

Only code-rendered video is covered. Generative video models (Sora, Veo, Kling, Seedance) and digital avatars are out of scope.

## Styles

<!-- styles:start -->
| Style | Best for | Tool | Preview |
|---|---|---|---|
| [Apple Keynote Minimal](skill/references/styles/apple-keynote-minimal.md) | Premium product or hardware reveals, major version launches | hyperframes | [watch](previews/apple-keynote-minimal.mp4) |
| [Card Explainer](skill/references/styles/card-explainer.md) | Turning blog posts, WeChat or Feishu articles, READMEs, PDFs or slide decks into 1-3 minute videos | hyperframes | [watch](previews/card-explainer.mp4) |
| [Character Dialogue Explainer](skill/references/styles/character-dialogue.md) | Long-form explainers and news digests that need a friendly voice (the Japanese Zundamon / VOICEVOX format) | remotion | [watch](previews/character-dialogue.mp4) |
| [Cinematic HUD Reel](skill/references/styles/cinematic-hud-reel.md) | Personal-brand or creator intros, channel trailers | hyperframes | [watch](previews/cinematic-hud-reel.mp4) |
| [Code & Terminal Walkthrough](skill/references/styles/code-terminal-walkthrough.md) | Developer-tool launches, library and API tutorials, changelog or PR videos | hyperframes | [watch](previews/code-terminal-walkthrough.mp4) |
| [Dark Diagram Explainer](skill/references/styles/dark-diagram-explainer.md) | Explaining a technical concept, tool, architecture or piece of news | remotion | [watch](previews/dark-diagram-explainer.mp4) |
| [Data Story Charts](skill/references/styles/data-story-charts.md) | Metrics announcements, reports and survey results | remotion | [watch](previews/data-story-charts.mp4) |
| [Flat Cartoon Explainer](skill/references/styles/flat-cartoon-explainer.md) | Pop-science, kids' education and "how does X work" explainers on YouTube and Bilibili | hyperframes | [watch](previews/flat-cartoon-explainer.mp4) |
| [Karaoke Caption Short](skill/references/styles/karaoke-caption-short.md) | Faceless TikTok, Douyin, Reels and Shorts channels at volume | remotion | [watch](previews/karaoke-caption-short.mp4) |
| [Kinetic Typography](skill/references/styles/kinetic-typography.md) | Manifestos, announcements, quotes and teasers with no visuals available | hyperframes | [watch](previews/kinetic-typography.mp4) |
| [Math Explainer (Manim)](skill/references/styles/math-manim.md) | Math, physics, algorithms and machine-learning concepts | manim | [watch](previews/math-manim.mp4) |
| [Painterly Canvas](skill/references/styles/painterly-canvas.md) | Lyric videos, poems, story moments and emotional brand pieces | html-capture | [watch](previews/painterly-canvas.mp4) |
| [Paper-Cut Collage](skill/references/styles/paper-cut-collage.md) | Cultural, heritage and history stories with a handmade tone | hyperframes | [watch](previews/paper-cut-collage.mp4) |
| [Pixel Retro](skill/references/styles/pixel-retro.md) | Vertical music videos, PSAs and playful brand shorts for Douyin, TikTok and Reels | hyperframes | [watch](previews/pixel-retro.mp4) |
| [Procedural 3D Sting](skill/references/styles/procedural-3d-sting.md) | Logo stings, channel or app openers, game and festival intros | remotion | [watch](previews/procedural-3d-sting.mp4) |
| [SaaS Launch Promo](skill/references/styles/saas-launch-promo.md) | App, SaaS or browser-extension launch on X, Product Hunt or LinkedIn | remotion | [watch](previews/saas-launch-promo.mp4) |
| [Talking-Head Overlay Package](skill/references/styles/talking-head-overlay.md) | Knowledge creators and founders who already record talking-head videos | remotion | [watch](previews/talking-head-overlay.mp4) |
| [UI Camera Tour](skill/references/styles/ui-camera-tour.md) | Product demos, feature walkthroughs, changelog videos | remotion | [watch](previews/ui-camera-tour.mp4) |

**Experimental styles**: fewer public examples so far, but each can be the best choice for a narrow job.

| Style | Best for | Tool | Preview |
|---|---|---|---|
| [Abstract Generative Loop](skill/references/styles/abstract-generative-loop.md) | Website hero backgrounds and ambient loops | html-capture | [watch](previews/abstract-generative-loop.mp4) |
| [Audiogram & Music Visualizer](skill/references/styles/audiogram-visualizer.md) | Podcast clips and audio teasers for X, LinkedIn and Shorts | remotion | [watch](previews/audiogram-visualizer.mp4) |
| [Broadcast News Desk](skill/references/styles/broadcast-news.md) | Daily AI-news or changelog digests with TTS narration, produced in bulk | hyperframes | [watch](previews/broadcast-news.mp4) |
| [Chat & Social UI Story](skill/references/styles/chat-social-ui.md) | Story-driven or meme shorts told as a text conversation on TikTok, Reels and Shorts | hyperframes | [watch](previews/chat-social-ui.mp4) |
| [Editorial Swiss Grid](skill/references/styles/editorial-swiss.md) | Reports, annual summaries, research findings and statistics | hyperframes | [watch](previews/editorial-swiss.mp4) |
| [Glitch & VFX Hype](skill/references/styles/glitch-vfx.md) | Gaming, crypto and hacker-themed intros and stings (5-20 s) | hyperframes | [watch](previews/glitch-vfx.mp4) |
| [Icon-Burst Title Card](skill/references/styles/icon-burst-title.md) | Channel intros and course openers (10-15 s) | remotion | [watch](previews/icon-burst-title.mp4) |
| [Isometric Explainer](skill/references/styles/isometric-explainer.md) | Infrastructure, cloud, device and product-system explainers | remotion | [watch](previews/isometric-explainer.mp4) |
| [Line-Reveal Illustrated Story](skill/references/styles/line-reveal-story.md) | Picture-book style and emotional brand stories for vertical platforms | hyperframes | [watch](previews/line-reveal-story.mp4) |
| [Map Geo Story](skill/references/styles/map-geo-story.md) | Travel, logistics or expansion routes; location datasets | remotion | [watch](previews/map-geo-story.mp4) |
| [3D Product Turntable](skill/references/styles/product-turntable-3d.md) | Hardware and e-commerce launch teasers | remotion | [watch](previews/product-turntable-3d.mp4) |
| [Social Carousel Cards](skill/references/styles/social-carousel-cards.md) | Tips, listicles, tutorials and recaps for Instagram and Xiaohongshu feeds | remotion | [watch](previews/social-carousel-cards.mp4) |
| [Storybook Picture Book](skill/references/styles/storybook-picture-book.md) | Children's bedtime stories and holiday greetings (30-60 s) | hyperframes | [watch](previews/storybook-picture-book.mp4) |
| [Vintage Sketch](skill/references/styles/vintage-sketch.md) | History, craft, heritage and biography explainers | hyperframes | [watch](previews/vintage-sketch.mp4) |
| [Visual Journalism (Vox-style)](skill/references/styles/visual-journalism.md) | Commentary and history explainers (60-120 s) | hyperframes | [watch](previews/visual-journalism.mp4) |
| [Whiteboard & Handwriting](skill/references/styles/whiteboard-handwriting.md) | Classroom explainers and onboarding walkthroughs | hyperframes | [watch](previews/whiteboard-handwriting.mp4) |
<!-- styles:end -->

## Quick start

1. Install the skill for Claude Code:

   ```bash
   git clone <this repo> agent-video-styles
   cp -r agent-video-styles/skill ~/.claude/skills/agent-video-styles
   ```

   Other agents that read `SKILL.md` folders (Codex, Cursor and others) work the same way: copy `skill/` into their skills directory.

2. Optionally install the official tool skills for deeper API help: `npx skills add remotion-dev/skills` and `npx skills add heygen-com/hyperframes`.

3. Ask for a video in plain words:

   ```
   Make a 30 second launch video for my app Driftboard. Accent #6366F1. Here are two screenshots: ./shots/
   ```

   The agent picks a style (or offers two), writes a storyboard, renders stills to check the layout, renders the video and inspects a contact sheet before handing it over.

Requirements: Node 22+, pnpm, FFmpeg and Chrome. Python 3.10+ with `edge-tts` for narration. uv and a LaTeX distribution for Manim formulas.

## Browse the gallery locally

```bash
pnpm install
pnpm build                      # validates data/, regenerates the catalog, builds site/dist
python -m http.server 8000 --directory site/dist
```

## How a style gets in

Every style has a recipe and a template that an agent produced **from the recipe alone**. Styles come in two tiers:

- **Core**: at least **two independent public examples** exist of agents writing code to produce it (different creators or projects).
- **Experimental**: fewer public examples so far (sometimes only skill packs or component libraries), but each one was still built and checked from its recipe. Several are the best choice for a narrow job, such as podcast clips, chat-thread stories or isometric system diagrams. The agent picks these only when the brief asks for that specific look.

The two looks that were researched but deliberately not catalogued, and why, are in [`data/candidates.yaml`](data/candidates.yaml).

The research behind every style, with sources, is in `research/`.

## Add or improve a style

1. Collect at least two independent public examples.
2. Add `data/styles/<id>.yaml` (metadata in English and Simplified Chinese, evidence links) and `skill/references/styles/<id>.md` (the recipe, in English). Copy the structure of an existing style.
3. Have an agent build `templates/<id>/` from the skill only, following [`templates/README.md`](templates/README.md), and publish a preview with `skill/scripts/make_preview.py`.
4. Run `pnpm check` and `pnpm build`.

## Licenses and credits

- This repository: [MIT](LICENSE). Fonts used by templates are open-licensed (SIL OFL).
- **Remotion** is source-available: free for individuals and companies of up to 3 people; larger for-profit companies need a [Company License](https://www.remotion.pro/license). HyperFrames (Apache-2.0) and Manim (MIT) have no such limit.
- **Edge TTS** (`skill/scripts/tts.py`) is an unofficial client of a Microsoft online service. It is fine for prototyping; check Microsoft's terms before commercial use.
- Creator links point to public posts. Their work belongs to them; this repo describes styles and does not copy their files. Paid skills were never obtained or reproduced.
- Built on the work of [Remotion](https://github.com/remotion-dev/remotion), [HyperFrames](https://github.com/heygen-com/hyperframes), [Manim Community](https://github.com/ManimCommunity/manim) and the creators credited on each style page. Related collections worth knowing: [prompt-motion.com](https://prompt-motion.com), [awesome-opus-5.5-video-prompts](https://github.com/Li-Evan/awesome-opus-5.5-video-prompts), [lemo-opuscar](https://github.com/lemomo-ai/lemo-opuscar) (film-era styles), [video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) (shot recipes) and [awesome-claude-video-skills](https://github.com/zhuyansen/awesome-claude-video-skills).
