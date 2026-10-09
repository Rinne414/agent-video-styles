# 01 - Tools and existing compilations (code-driven video, 2025-2026)

Research date: 2026-10-10. Stars, push dates and release tags were read from the GitHub API (`gh api`) on this date. "[unverified]" marks anything not confirmed from a primary page.

## Tools

### Remotion
- **What**: React framework where each frame is a pure function of the frame number; Studio, Player, Lambda, CLI. https://github.com/remotion-dev/remotion
- **Status**: very active. v4.0.534 released 2026-10-07; last push 2026-10-09; 62,789 stars (GitHub API).
- **License (exact, from https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)**: custom "Remotion License", not OSI open source. Free License if you are: an individual; a for-profit organization with up to 3 employees; a non-profit; or evaluating without commercial use. Free use is allowed commercially. Everyone else (for-profit with 4+ people) needs a Company License. Forbidden: copying/modifying Remotion to sell/relicense your own derivative. The LICENSE says the license "will slightly change" in Remotion 5.0 (PR #3750). Pricing page (https://www.remotion.pro/license): Creators $25/mo per seat; Automators (apps, prompt-to-video, embedded Player) $0.01 per render with $100/mo minimum; Enterprise from $500/mo. Practical reading for this project: a solo person making and publishing videos is free; a company of 4+ must pay.
- **Render**: headless Chrome (Chrome Headless Shell, auto-downloaded) + FFmpeg. CLI: `npx remotion render` (per https://www.remotion.dev/docs/cli/render); also Lambda, Cloud Run, client-side (`@remotion/web-renderer`).
- **Windows**: Windows x64 is listed as supported for Chrome Headless Shell (https://www.remotion.dev/docs/chrome-headless-shell, seen via search result). Windows ARM not listed.
- **Agent-friendliness**: high. `bun create video` offers skills at project creation. Templates include Prompt to Video, Prompt to Motion Graphics SaaS, TikTok captions, 3D (R3F), Audiogram, Music Visualization, Code Hike (https://www.remotion.dev/templates). A "Prompts" gallery of community prompts exists at https://www.remotion.dev/prompts.
- **Official skills**: YES. `npx skills add remotion-dev/skills` (https://github.com/remotion-dev/skills, 4,960 stars, pushed 2026-10-07). Folders: remotion-best-practices, -captions, -create, -docs, -interactivity, -maps, -markup, -multimedia, -render, -saas, -studio, -upgrade (GitHub API contents). skills.sh page shows 15 skills, 2.0M total installs, remotion-best-practices 593.9K (https://skills.sh/remotion-dev/skills). Also `npx remotion skills add` and a Claude Code plugin repo https://github.com/remotion-dev/claude-code-plugin (41 stars; README says "internal package, no documentation").
- **MCP**: Remotion's hosted MCP is deprecated; replaced by the `/remotion-docs` skill; hosted MCP "will shut down no earlier than August 31, 2026" (https://www.remotion.dev/docs/ai/mcp). Docs also list a "WebMCP" page in the AI nav [content not opened].
- **Best at**: typed, parameterized, data-driven compositions; product promos, kinetic type, charts, captions, maps, 3D via R3F, SaaS-style personalised video. Spring-based motion is idiomatic.
- **Worst at**: needs React mindset; animation is "compute from frame" so CSS/GSAP web animations must be rewritten; license friction for 4+ person companies. (Comparison source: https://hyperframes.heygen.com/guides/hyperframes-vs-remotion - note this is the competitor's page.)

### HyperFrames (HeyGen)
- **What**: "Write HTML. Render video. Built for agents." HTML + CSS + seekable animations (GSAP, Lottie, Three.js, Anime.js, CSS, WAAPI, TypeGPU) rendered deterministically to MP4. https://github.com/heygen-com/hyperframes
- **Status**: very active. v0.8.143 released 2026-10-08; 59,744 stars; created 2026-04 (a secondary blog says released April 17, 2026 [unverified]). Docs: https://hyperframes.heygen.com
- **License**: Apache-2.0 (GitHub API, README badge). Node.js >= 22 and FFmpeg required (README).
- **Render**: Puppeteer/headless Chrome with `HeadlessExperimental.beginFrame` atomic capture, timelines paused and seeked per frame, FFmpeg encode (https://hyperframes.heygen.com/concepts/determinism.md). CLI: `npx hyperframes init|preview|render`; `--docker` for bit-exact output; also HeyGen cloud render, Cloud Run, AWS Lambda. Rules: no `Date.now`, no unseeded `Math.random`, no mid-render fetch.
- **Windows**: not stated in official docs I could read (docs comparison page says "not mentioned"). Evidence it works: release notes contain many Windows fixes (hide console windows, PowerShell PID guard, `HYPERFRAMES_BROWSER_PATH` hint for Windows chrome-headless-shell crashes) in https://hyperframes.heygen.com/llms-full.txt. One secondary blog claims full determinism only on Linux, with approximate capture on Mac/Windows [unverified, from search snippet of a third-party review]. Docs advise `--docker` for exact reproducibility.
- **Agent-friendliness**: highest of the set; built for agents, ships `llms.txt` (https://hyperframes.heygen.com/llms.txt), a lint/check/snapshot CLI, Studio with WebMCP, hosted MCP connector (https://hyperframes.heygen.com/guides/mcp.md).
- **Official skills**: YES, many. Claude Code: `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes`; or `npx skills add heygen-com/hyperframes`. README lists 21 published skills: router `/hyperframes`; workflows `/product-launch-video`, `/faceless-explainer`, `/pr-to-video`, `/embedded-captions`, `/talking-head-recut`, `/motion-graphics`, `/music-to-video`, `/slideshow`, `/general-video`, `/remotion-to-hyperframes`; domain `/hyperframes-core`, `-animation`, `-keyframes`, `-creative`, `-audio`, `-cli`, `-registry`, `/media-use`, `/figma`. skills.sh shows 52 skills and 11.9M total installs (https://skills.sh/heygen-com/hyperframes). Skills dir: https://github.com/heygen-com/hyperframes/tree/main/skills
- **Built-in style assets** (important for a taxonomy): `skills/hyperframes-creative/palettes` (bold-energetic, clean-corporate, dark-premium, jewel-rich, monochrome, nature-earth, neon-electric, pastel-soft, warm-editorial); `frame-presets` (e.g. biennale-yellow, blockframe, blue-professional, bold-poster, broadside, capsule, cartesian, cobalt-grid, code-editorial, coral, editorial-forest, daisy-days; list truncated at 13 by me); `themes/` (bold.css, editorial.css, neutral.css); registry of ~190 blocks (liquid-glass, glitch, halftone-field, aurora, hologram, lower-thirds, code-diff, bar-chart-race, maps, transitions-*) and ~250 components (caption-* styles, cursor-*, hw-* handwriting, torn-paper-rip, whiteboard-ink, ascii-render-pass, ordered-dither-pass). Source: GitHub contents API under heygen-com/hyperframes/registry and skills.
- **Showcase/templates**: https://hyperframes.heygen.com/showcase ; launch compositions repo https://github.com/heygen-com/hyperframes-launches (581 stars, Apache-2.0, pushed 2026-10-04; ~20 real HeyGen launch videos incl. "heygen-apple-motion", "claude-paper-launch", "spacex-launch", "liquid-brand-refraction").
- **Best at**: web-native looks (glassmorphism, gradients, CSS/GSAP choreography, shader/WebGL effects), product-launch and UI-demo videos, captions, reusing existing web content. **Worst at**: smaller ecosystem than Remotion; silent failures if determinism rules broken (docs own admission, comparison page above); long-form narrative scenes need more scaffolding.

### Motion Canvas
- **What**: TypeScript generator-function animation library + browser editor, vector/explainer style. https://github.com/motion-canvas/motion-canvas
- **Status**: 19,263 stars, MIT, last push 2026-07-02 (docs domain refactor). Latest stable release v3.17.2 dated 2024-12-14; newest tag/prerelease v3.18.0-alpha.0 dated 2025-02-16 (GitHub API). Maintained slowly; effectively low-velocity.
- **Render**: browser editor "Render" button / the `@motion-canvas/ffmpeg` plugin; headless CLI export is not first-class [unverified]. Windows: Node-based, expected to work [unverified].
- **Agent-friendliness**: medium. No official skill found. Only tiny community skills (e.g. https://github.com/mainkunalhu/motion-canvas-skill, 0 stars; https://github.com/designbysuren/motion-composer-skill, 0 stars, MIT) - weak signal.
- **Best at**: 3Blue1Brown-like explainer diagrams, synced to voice-over. **Worst at**: headless/automated pipelines, photoreal or UI-heavy videos.

### Revideo
- **What**: Fork of Motion Canvas turned into a headless/parameterized video-rendering library (originally redotvideo, now at https://github.com/midrender/revideo; redirect confirmed by API). 4,093 stars, MIT, last push 2026-07-15. No GitHub "latest release" object exists (API 404) [version unverified].
- **Agent-friendliness**: medium; no official skill found. **Best at**: templated programmatic video apps with a headless renderer. **Worst at**: community/ecosystem now small compared to Remotion/HyperFrames.

### Manim Community Edition
- **What**: Python math/technical animation engine (3Blue1Brown-style). https://github.com/ManimCommunity/manim - 41,374 stars, MIT, v0.22.0 released 2026-10-08. The original author's version https://github.com/3b1b/manim has 94,812 stars, MIT, v1.7.2 (2024-12-13), last push 2026-09-09.
- **Render**: Python + Cairo/OpenGL + FFmpeg (and LaTeX for formulas), CLI `manim -pql scene.py Scene`. Windows supported by installers/pip (standard; I did not open the install page [unverified]).
- **Agent-friendliness**: high for math. No official vendor skill found. Community: https://github.com/adithya-s-k/manim_skill (1,152 stars, MIT, last push 2026-01-23); https://github.com/marcelo-earth/manim-awesome-skills (list); iart-ai/manim-skills. Locally, this Claude Code session also lists an `ecc:manim-video` skill (from the ecc plugin).
- **Best at**: equations, graphs, geometric proofs, dark-background 3b1b look. **Worst at**: product/UI promos, photographic content, kinetic-type marketing.

### HTML/CSS/GSAP pages captured to video (Puppeteer/Playwright frame capture)
- Not a single tool; the pattern HyperFrames productized. Example of the raw pattern: voidforall/awesome-video-as-code trailer rendered by a "zero-dependency script" with headless Chrome (https://github.com/voidforall/awesome-video-as-code, CC0-1.0). Li-Evan's list states Opus 5.5 "writes code that draws every frame (HTML Canvas, SVG, Three.js, Remotion, HyperFrames, Manim), renders the frames in a headless browser and stitches them into an MP4 with ffmpeg" (https://github.com/Li-Evan/awesome-opus-5.5-video-prompts).
- **Agent-friendliness**: high (agents know HTML/GSAP) but timing determinism is DIY (hence seek(t) rules in "Anatomy of a Pro Prompt"). **Best at**: web-native motion graphics, shaders, canvas art. **Worst at**: audio sync and long renders without a harness.

### Three.js / React Three Fiber
- Three.js: https://github.com/mrdoob/three.js, 116,178 stars, MIT, r186 (2026-09-24). R3F: https://github.com/pmndrs/react-three-fiber, 32,819 stars, MIT, v9.8.1 (2026-09-24).
- Used inside Remotion (`@remotion/three`, 3D starter template) and as a HyperFrames adapter (`three` skill on skills.sh). Render via the host tool's headless Chrome (WebGL needs GPU or software GL - performance caveat [unverified]).
- Official standalone agent skill: none found for Three.js itself; HyperFrames has `three` and Remotion has a 3D template. **Best at**: 3D product turntables, shader backdrops, world/map scenes. **Worst at**: text-heavy layouts unless composited with DOM.

### Lottie
- lottie-web https://github.com/airbnb/lottie-web: 32,168 stars, MIT, last push 2025-09-01 (no GitHub releases object). Active successor in the ecosystem: https://github.com/LottieFiles/dotlottie-web (892 stars, pushed 2026-10-07).
- Role: playback of designer-made vector animation as an asset layer inside Remotion (`@remotion/lottie`) or HyperFrames (`lottie` skill/adapter). Agents rarely author Lottie JSON from scratch. **Best at**: icons, loaders, character loops. **Worst at**: freeform composition authored by an agent.

### Theatre.js
- https://github.com/theatre-js/theatre: 12,735 stars, Apache-2.0, last push 2024-08-14 - effectively dormant. Visual sequencing for Three.js/DOM. No agent skill found. Low relevance for agent workflows.

### FFmpeg pipelines
- FFmpeg is the encoder under Remotion, HyperFrames, and Manim; also used standalone for concat, overlays, audio ducking, captions burn-in. HyperFrames requires FFmpeg (README). Packaged agent toolkit: https://github.com/digitalsamba/claude-code-video-toolkit (2,189 stars, MIT, pushed 2026-10-05; Remotion + FFmpeg + browser recording + transcription + voice + music; I only read the one-line description and the awesome-video-as-code entry). MoviePy (Python) is the scripted alternative per awesome-video-as-code.
- **Best at**: editing, transcoding, mixing. **Worst at**: authoring motion design.

### TTS + word-timestamp captions
- Remotion: dedicated skill `remotion-captions` and TikTok-style word-by-word caption template (https://www.remotion.dev/templates); `@remotion/openai-whisper`, `@remotion/whisper-web`, `@remotion/captions` packages appear in the CLI package list.
- HyperFrames: `/media-use` skill (TTS, transcription, captions, music), `/embedded-captions`, docs "Caption styles" (https://hyperframes.heygen.com/prompting/captions-catalog.md) and ~20 `caption-*` components (kinetic-slam, pill-karaoke, neon-glow, matrix-decode, glitch-rgb, editorial-emphasis, particle-burst, weight-shift...).
- Pattern is tool-agnostic: TTS -> audio + word timestamps (Whisper/forced alignment) -> per-word animation. Specific TTS vendors used were not verified here [unverified].

## Name resolution (V-Motion / Hyperfilm)

- **"Hyperfilm" -> almost certainly HyperFrames (HeyGen).** Phonetically close, and it is the 2026 agent-video framework. Search for a literal tool named "Hyperfilm" found only `ArkMaster123/hyperfilmdemo` (0 stars, "AI-powered digital product template generator demo using Claude Agent SDK", https://github.com/ArkMaster123/hyperfilmdemo) - unrelated to video rendering. Web search for "Hyperfilm" returned only HyperFrames pages.
- **"V-Motion" -> two candidates.**
  1. Most likely **Remotion** (motion graphics in code, Claude + Remotion is the dominant Claude Code video workflow; web searches for "Vmotion/V-Motion + Claude Code" returned only Remotion tutorials). Phonetic: "Re-motion" / "V-motion". Medium confidence.
  2. A literal tool named **Vmotion** exists: https://github.com/TanPowasd/video-motion-studio-release ("Open-source Vmotion. People edit directly in the UI; external AI uses files, CLI or MCP on the same local project"; 4 stars, Apache-2.0, pushed 2026-10-09). A Windows 10/11 x64 desktop studio, projects stored as JSON + TypeScript, MCP with 10 default entries / 147 capabilities, MP4/PNG/WAV export; README (Chinese) says it calls no AI model and is an early preview. Very small, so unlikely to be what the user remembers, but it is the only real match for the exact name and it is Windows-first.
  3. Also seen but unrelated by name: `GurYN/vibe-motion` (22 stars, MIT, "Vibe Coding application for motion design video creation"), `amirmushichge/VibeMotion` (48 stars, pre-alpha local AI video editor). VMware "vMotion" results are irrelevant.
- Recommendation: treat Hyperfilm = HyperFrames, V-Motion = Remotion (ask the user to confirm; mention Vmotion exists).

## Existing compilations and skills

| # | Name / URL | Owner | Stars (2026-10-10) | License | Last push | Covers | Styles encoded | Difference from a curated style taxonomy |
|---|---|---|---|---|---|---|---|---|
| 1 | Prompt Motion, https://prompt-motion.com | curated by @p4nthera_ (per page) | n/a (site) | n/a [unverified] | live | Claude Opus 5.5 motion videos each paired with its prompt or skill; filter Prompt/Skill, sort Popular | Tag counts: Kinetic type 97, Music 50, Product UI 100, Charts 33, Diagrams 31, Shapes 44, Particles 43, Characters 27, Photos 23, Phone 22, Code 21 | CLOSEST analogue to our idea (tagged gallery of agent-made videos). Tags are content/element types, not named visual styles; no style definitions. |
| 2 | awesome-opus-5.5-video-prompts, https://github.com/Li-Evan/awesome-opus-5.5-video-prompts (gallery https://li-evan.github.io/awesome-opus-5.5-video-prompts/) | Li-Evan | 11 | CC-BY-4.0 | 2026-09-27 | 334 verbatim prompts from 302 creators with preview, original post, notes on tools/inputs/cost; "Director's toolkit" with vocabulary and six-step workflow | Categories: Showreels/Motion Design, Product Launches/Ads, Explainers, History/Documentary, Music Videos, Stories/Hand-drawn/Stop-motion, Opus on Itself, 3D/Shaders, Remakes | Strong source of real prompts; organised by use case, not by visual style. A small sibling (LeaddeOpenLab/awesome-opus-5-5-video-prompts, 6 stars) duplicates the idea. |
| 3 | lemo-opuscar, https://github.com/lemomo-ai/lemo-opuscar (gallery https://lemomo-ai.github.io/lemo-opuscar/) | Lemomo | 1,538 | NOASSERTION | 2026-10-09 | Claude Code skill: 43 film styles, each with style prompt and a short film made fully in code by Opus 5.5; OPUSCAR 98 = 98 Best Picture winners, each in its own style with 2D/2.5D/3D tag, reusable style prompt, shot list, as JSON | Film-genre/era styles (silent, colour, war...; 77 2D, 4 2.5D, 17 3D) | Closest to a STYLE catalog with reusable style prompts and JSON, but for cinematic/illustrative film looks only (not motion-graphics/UI looks); single author. |
| 4 | ai-product-video, https://github.com/dlazy-ai/ai-product-video | dlazy-ai | 15 | Apache-2.0 | 2026-08-31 | Agent skill: 152 shot recipe cards, 209 style variants, Remotion components, 149 SFX | Shot-level recipes (10 functional categories) | Shot-recipe library (micro level), product-promo only. |
| 5 | hyperframes registry/catalog, https://hyperframes.heygen.com/catalog and https://github.com/heygen-com/hyperframes/tree/main/registry | HeyGen | (inside 59,744-star repo) | Apache-2.0 | 2026-10-09 | ~190 blocks, ~250 components, 9 palettes, frame presets, 3 themes | Named looks (liquid-glass, glitch, halftone, hologram, torn-paper, whiteboard, editorial, neon, dark-premium...) | Official, installable and renderable assets keyed by effect/component; the palettes/presets are the nearest thing to named visual styles but are HyperFrames-only. |
| 6 | HyperFrames Showcase / launches, https://hyperframes.heygen.com/showcase , https://github.com/heygen-com/hyperframes-launches | HeyGen | 581 | Apache-2.0 | 2026-10-04 | ~20 source-available launch videos | Apple-style, Stripe, SpaceX, texture, liquid-brand-refraction | Examples by project, no taxonomy. |
| 7 | awesome-claude-video-skills, https://github.com/zhuyansen/awesome-claude-video-skills (live page https://agentskillshub.top/best/claude-video-skills/) | zhuyansen / Agent Skills Hub | 505 | NOASSERTION | 2026-10-09 | README says 268 repos (search snippet said 180, README header now 268) of skills for video, graded by an automated model for security; includes avatars (out of scope) | Types: Frameworks, Promo, Explainers, Editing, Shorts, Avatars, Stories, Motion graphics, Scripts, Music | Directory of repos by purpose, auto-classified; no style definitions. Includes out-of-scope avatar repos. |
| 8 | awesome-video-as-code, https://github.com/voidforall/awesome-video-as-code | voidforall | 2 | CC0-1.0 | 2026-10-03 | Frameworks, skills, MCP, pipeline, showcases, research; explicit "code-rendered vs hybrid" labels, excludes generative-video tools | none | Matches our scope definition well; tool-centric, no styles. |
| 9 | awesome-motion-skills / motion-skills, https://github.com/iart-ai/awesome-motion-skills (3 stars) and https://github.com/iart-ai/motion-skills (755 stars, MIT, 2026-09-30) | iart-ai (vendor of iart.ai) | 3 / 755 | NOASSERTION / MIT | 2026-06-22 / 2026-09-30 | 17 packs / ~50 skills: TikTok, text-message story, explainers, whiteboard/isometric, vox-style maps, kinetic typography, lower thirds, ad creative | Genre-style packs (Vox maps, text-message story, whiteboard, isometric) | Skills by use case; promotes a commercial product; thin per-style evidence. |
| 10 | awesome-hyperframes-prompt, https://github.com/Markjinli/awesome-hyperframes-prompt | Markjinli | 15 | none stated | 2026-05-14 | Chinese-language prompt templates + finished HTML + effect notes, 16 folders (product-showcase, social, cinematic, motion-typography, vfx, 3d-product, audio-reactive, comparison...) | Category folders | Small; prompt+HTML pairs, no style definitions. Stale since May. |
| 11 | hyperframes-motion-library, https://github.com/nutllwhy/hyperframes-motion-library | nutllwhy | 284 | MIT | 2026-08-15 | 23+ parameterised motion templates (counters, charts, before/after, rankings) with a "director layer" | Info-graphic motion templates (Chinese talking-video overlays) | Template library, not styles. |
| 12 | apple-motion, https://github.com/IskakovDamir/apple-motion | IskakovDamir | 13 | MIT | 2026-09-29 | Remotion skill built from frame-accurate measurements of six Apple recap videos (shot length, type size, spring params, LUFS, beat sync) | One style (Apple recap) quantified | Best example of how to encode ONE style with numbers; a method to copy, not a catalog. |
| 13 | make-awesome-video, https://github.com/NewTurn2017/make-awesome-video | NewTurn2017 | 4 | MIT | 2026-10-08 | Director workflow: references from whatships.com and prompt-motion.com -> 3 storyboards -> stills -> render (HyperFrames default or Remotion); modes launch/motion/info/social | Reference-driven, no fixed styles | Confirms reference-first practice; names two reference sources. |
| 14 | What Ships, https://whatships.com | independent, owner not named | n/a | n/a | live (2,447 pages as of 2026-10-08) | Curated startup launch videos shared on X (not necessarily code-made) | Editorial categories: AI, Developer tools, Design, Productivity, Consumer, Hardware, Motion | Reference library of real launch films; not agent-specific. |
| 15 | Remotion Prompt Showcase, https://www.remotion.dev/prompts | Remotion AG | n/a | n/a | live | Community prompt+result gallery (e.g. Product Demo for Presscut, Launch Video on X, Cinematic Tech Intro, Bar + Line Chart, Three.js "Top 20 Games Sold" ranking), 3 pages | Use-case names | Official but unstructured. Also Remotion template gallery https://www.remotion.dev/templates. |
| 16 | hyperframes-student-kit, https://github.com/nateherkai/hyperframes-student-kit | nateherkai | 1,262 | NOASSERTION | 2026-09-28 | 14 skills, "406 motion-graphics cards", HyperFrames templates, transcript-driven cuts | Card-based motion graphics library | Large card set; I did not open it - content unverified. |
| 17 | ClaudeAnimationBase / PDoomVideo, https://github.com/JohnHeibel/ClaudeAnimationBase (980 stars, MIT) | JohnHeibel | 980 | MIT | 2026-09-24 | Hand-painted cartoon animation kit (p5.js + p5.brush, 31 emotions) | Painterly cartoon | One style kit; PDoomVideo (1.9k stars) is a showcase music video per zhuyansen list. |
| 18 | skills.sh, https://skills.sh | Vercel | n/a | n/a | live | Skill registry with install counts: heygen-com/hyperframes 52 skills 11.9M total installs; remotion-dev/skills 15 skills 2.0M | none | Marketplace/installer, not a style source. |
| 19 | Others seen | | | | | `tavily-api/awesome-hyperframes` (13 stars, official-link roundup with SEO/ad links); `LuxRealGrowth/awesome-astra-video-prompts` (14 stars, mixes Seedance - partly out of scope); `FuturizeRush/awesome-ai-story-video-skills` (2); `ManimCommunity/awesome-manim` (533, users/creators database); `nexu-io/html-anything` (9,054 stars, Apache-2.0, HTML artifact editor with 75 skills incl. a Hyperframes surface - tangential) | | |

Notes:
- No dedicated "awesome-remotion" repo was found: GitHub search for "awesome remotion" returned only unrelated "awesome-remote-*" lists. Remotion's own resource list is https://www.remotion.dev/docs/resources [page name from nav, not opened].
- Time-sensitive and Opus 5.5-centric: most compilations appeared after Sept 2026 and quote X (Twitter) posts. Stars are low for pure lists but install counts for official skills are in the millions.
- Our taxonomy gap: nobody (found) defines named visual styles across tools with required properties (palette, type, motion grammar, pacing, banned elements). lemo-opuscar (film styles, JSON), HyperFrames palettes/presets (look tokens), prompt-motion tags (element types) and apple-motion (measured numbers) each cover one slice.

## Emerging tools

- **HyperFrames** itself is the 2026 breakout (59.7k stars in ~6 months).
- **Vmotion** (TanPowasd) - Windows desktop programmable studio with MCP (4 stars, early preview). https://github.com/TanPowasd/video-motion-studio-release
- **Claude Code Video Toolkit** (digitalsamba) - 2,189 stars, MIT, Remotion + FFmpeg + voice/music toolkit. https://github.com/digitalsamba/claude-code-video-toolkit
- **HyperFrames-derived skills**: `blixvip/MotionClone` (359 stars, rebuild a reference video as an editable HyperFrames project and compare), `xiejunjie524/handdraw-story-video` (776 stars, hand-drawn line-reveal story videos), `geekjourneyx/hyperframes-motion-director` (452 stars, AGPL-3.0), `Endless1936/book-video` (358 stars), `feicaiclub/video-spec-builder` (1,016 stars, MIT).
- **Hand-painted / canvas art path**: p5.js + p5.brush (ClaudeAnimationBase), custom GPU brushstroke renderer (functional-emotions-video, 68 stars) - code-drawn painterly styles outside React/HTML-video frameworks (listed in awesome-claude-video-skills "Made with Claude Opus 5.5").
- **Remotion Recorder, Remotion "Prompt to Motion Graphics SaaS" template, `@remotion/web-renderer` (client-side rendering)** - Remotion's own 2026 direction (https://www.remotion.dev/templates, CLI package list).
- **vanta** (itsjwill/vanta, 136 stars, NOASSERTION) - "Open source AI video engine built on Remotion" with voice cloning/avatars/text-to-video: hybrid, partly out of scope.
- No credible new framework competing at HyperFrames/Remotion scale was found via GitHub search (created > 2026-01-01, stars > 300, topic video).

## Styles each tool is known for

| Style name | Tool | Evidence URL |
|---|---|---|
| Apple-style fast kinetic recap (springs, SF-Pro-like type, beat cuts) | Remotion | https://github.com/IskakovDamir/apple-motion |
| Product launch / SaaS promo with real UI captures, 2.5D camera moves | Remotion | https://github.com/dlazy-ai/ai-product-video |
| Word-by-word TikTok captions | Remotion | https://www.remotion.dev/templates |
| Animated charts / ranking races / maps | Remotion | https://www.remotion.dev/prompts (Bar + Line Chart, Top 20 ranking) ; skill remotion-maps https://github.com/remotion-dev/skills |
| Code animation (Code Hike) | Remotion | https://www.remotion.dev/templates |
| Audiogram / music visualization | Remotion | https://www.remotion.dev/templates |
| Liquid glass (iOS 26 / macOS Tahoe) | HyperFrames | registry blocks ios26-liquid-glass, macos-tahoe-liquid-glass, vfx-liquid-glass: https://github.com/heygen-com/hyperframes/tree/main/registry/blocks |
| Glitch / RGB split / holographic / VFX shaders | HyperFrames | same registry (glitch, hologram, holographic, vfx-shatter, vfx-portal) |
| Editorial / bold-poster / blockframe layouts | HyperFrames | https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes-creative/frame-presets ; themes editorial.css, bold.css |
| Hand-written / whiteboard / torn-paper / ink | HyperFrames | registry components hw-*, whiteboard-ink, torn-paper-rip, paper-collage-reveal |
| Fake chat/notification UI (ChatGPT, Slack, iMessage, Reddit, X) | HyperFrames | registry blocks chatgpt-exchange, slack-notification-ad, message-thread-reveal, x-post |
| Kinetic caption families (slam, karaoke pill, neon, matrix decode) | HyperFrames | registry components caption-* ; https://hyperframes.heygen.com/prompting/captions-catalog.md |
| Brand launch video (Stripe, SpaceX, Claude paper, texture) | HyperFrames | https://github.com/heygen-com/hyperframes-launches |
| 3Blue1Brown math explainer | Manim, Motion Canvas | https://github.com/ManimCommunity/manim ; https://github.com/motion-canvas/motion-canvas |
| Hand-painted cartoon (p5.brush) | p5.js / canvas | https://github.com/JohnHeibel/ClaudeAnimationBase |
| Film/era styles (silent, colour, war, 2D vs 3D) | Mixed code (Opus 5.5) | https://lemomo-ai.github.io/lemo-opuscar/opuscar98/#styles |
| Showreel, kinetic type, product UI, charts, diagrams, particles (gallery tags) | Mixed | https://prompt-motion.com |
| 3D product turntable, shader backdrops | Three.js / R3F | HyperFrames blocks product-turntable, code-3d-extrude; Remotion 3D template https://www.remotion.dev/templates |
| Vox-style editorial map animation, text-message story, whiteboard/isometric explainer | Mixed (Remotion-based packs) | https://github.com/iart-ai/awesome-motion-skills |
| Lottie icon/character loops | Lottie inside Remotion/HyperFrames | HyperFrames block lottie-character-walk |

## Gaps / could not verify

- Exact "last release" and version for Revideo, lottie-web, Theatre.js (no GitHub release objects; push dates only).
- Official Windows statement for HyperFrames (none found; only changelog fixes and one unverified third-party claim that determinism is Linux-only). Worth a quick real test on this machine before depending on it.
- Remotion Windows specifics beyond "Windows x64 supported for Chrome Headless Shell" (the `/docs/miscellaneous/windows` URL I guessed returned 404).
- Motion Canvas headless render path; Manim Windows install page not opened.
- Whether the Remotion 5.0 license change (PR #3750) alters who must pay; I did not open the PR.
- Remotion WebMCP page and the Remotion "Resources" list not opened.
- Prompt Motion's license, ownership beyond @p4nthera_, and whether it exposes prompts programmatically.
- Full contents of the 406 "cards" in nateherkai/hyperframes-student-kit and of the 268-repo list in awesome-claude-video-skills (only README head read; the search snippet said 180, README says 268).
- Search tool is US-only and results are largely secondary blogs; all numeric claims above came from the GitHub API or official pages opened directly, but star counts will drift daily.
- "Opus 5.5"/"GPT-6 Astra" names come from the repos' own text; I did not verify the models.
