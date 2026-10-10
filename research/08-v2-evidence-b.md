# 08 v2 evidence, batch B (2026-10-10)

Scope: 8 candidates. Search was English, Chinese, Japanese and Korean through a US-only web search tool plus page fetches. Search recall for these niche styles was poor: most queries returned only generic Remotion / HyperFrames tutorials. Nothing below was invented; fields a page did not state are marked "not stated". `verified`: opened = page fetched and read this session; aggregator = listing page only; snippet = search-result text only.

Counting rule for "finished": a rendered video (or finished media) by a creator or project, made by an agent writing code. Skill packs, templates, prompt pages without media, and rendering plugins are supporting evidence only.

## storybook-picture-book

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| not stated (unnamed in roundup) | WeChat article via ai-bot.cn roundup | CN | https://ai-bot.cn/claude-opus-5-5-video-tutorial/ | not stated | Claude Opus 5.5, Canvas 2D | 30 s, 7-page rabbit National Day story; watercolor paper texture from a noise algorithm, hand-drawn wobble, page-turn audio, music-box arpeggio. Finished video described, no media link | opened |
| Claude Sonnet 5.5 via Claude Code, published by 益盛科技 (des13) | des13.com article | TW | https://des13.com/news/ai/1734-claude-opus.html | published 2026-09-29, updated 2026-10-04 | Claude Code, HyperFrames | 台灣百年教會, about 45 s, 8 scenes, 1920x1080 30 fps; image sequence real photo to paper-cut collage to watercolor illustration to postcard/stamp. Storybook-adjacent (history), not a children's book | opened |
| awesome-opus-5.5-video-prompts | GitHub | CN | https://github.com/Li-Evan/awesome-opus-5.5-video-prompts | not stated | Opus 5.5 prompts | 'Stories / Hand-drawn / Stop-motion' category; prompt list only (supporting) | opened (earlier pass) |

Finished examples found: 1 clear (rabbit) plus 1 adjacent (des13 watercolor/postcard). The two sources are independent, but only the rabbit video is a children's picture book and neither links playable media.

Recipe facts
- Paper texture is generated, not imported: Canvas 2D noise algorithm gives a watercolor paper grain; strokes get a hand-drawn wobble (displacement noise).
- Pacing: about 4 s per page (30 s / 7 pages) with a page-turn transition and a page-turn sound effect.
- Audio is synthesized in code: music-box arpeggio plus page-turn SFX; narration is optional and is TTS when present.
- Illustration conversion rule (des13): unclear-license photos are converted to watercolor, paper-cut or simplified illustration instead of used directly; do not fabricate historical photos.
- Style sequencing idea from des13: real photo, paper-cut collage, watercolor, postcard/stamp, so the look can progress across scenes.
- Palette: only "watercolor tones" stated, no hex [unverified]. Aspect: 1920x1080 30 fps for des13; the rabbit video's ratio is not stated.
- Pitfalls: no rights-clear art means the agent must draw everything in SVG/canvas, which limits character detail; des13 needed manual date verification and an ending rewrite (logo, scripture line, headline).

Recommended tier: experimental. Reason: only one genuine children's picture-book video and it has no public media link; the second example is a history montage in a related look.
Niche: kids' holiday greetings, short bedtime-story pages, heritage postcards.

## visual-journalism

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| @Remotion (official account) | remotion.dev prompts gallery (posted on X) | global | https://www.remotion.dev/prompts/news-article-headline-highlight | "8 months ago", exact date not stated | Claude Code, Opus 4.5, Remotion, rough.js, Tesseract OCR | 5 s, Full HD; screenshot of a news headline on white, slow zoom and ~15 degree 3D tilt, blur-to-sharp over 1 s, rough.js highlighter sweeping left to right behind two phrases. A finished short clip, not a full explainer | opened |
| not stated (video title only) | YouTube, summary on videohighlight.com | global | https://videohighlight.com/v/7wuYBfE131U | not stated | Claude Code, Remotion, GPT image, Magnific MCP, ElevenLabs | "I Made Vox-Style Motion Graphics Using Only Claude Code & Remotion", about 11 min tutorial, 1080p final; summary is auto-generated | opened (summary only) |
| pristren.com article names a `vox-explainer-skill` repo | blog | global | https://pristren.com/blog/how-to-use-claude-to-make-videos-like-vox-and-others | not stated | Claude skills | Supporting only [unverified: not opened] | snippet |
| bang-motion, awesome-motion-skills | GitHub | global | https://github.com/bangtutorial/bang-motion | not stated | HyperFrames skill pack | 'Visual journalism' direction, gallery still `docs/gallery/09-visual-journalism.jpg` only (supporting) | opened |

Finished examples found: 2 (one 5 s clip, one tutorial video whose output is only known via an auto summary).

Recipe facts
- Highlighter: rough.js hand-drawn marker sweep animated left to right, placed behind the text, one phrase at a time. Source video recipe confirms the technique, no color given (Skill-pack spec: black ground, highlighter accents, dashed annotations [bang-motion, no hex]).
- Headline plate: article screenshot on white (Full HD) with a subtle zoom and ~15 degree per-axis 3D rotation over 5 s; start blurred, unblur over 1 s.
- Tesseract OCR is used to locate the words so highlights land on the correct bounding boxes; this is the key trick to avoid hand-placed coordinates.
- Vox-style layering from the YouTube summary: three layers per scene (static background, midground cutouts, foreground structures); cutouts with black-and-white halftone pattern; red stroke marks behind cutouts; shared fonts and backgrounds across scenes.
- Motion grammar: `spring` for pop-ups, `interpolate` for transitions, staggered appearances.
- Audio: ElevenLabs voiceover synced to a storyboard of voice-over lines, plus music tracks; one folder per scene in the project.
- Photos: source-tag labels on each photo (bang-motion); rights are the main constraint. Use public-domain / Openverse / own screenshots only.
- Pitfalls: image assets in the Vox workflow came from image models or MCP retrieval, so it is not purely code-rendered; rights of news screenshots; auto-summaries can be wrong.

Recommended tier: experimental. Reason: two examples, but one is a 5 s clip from the Remotion account itself and the other is a tutorial known only from a summary; neither shows the full black-ground source-tagged look.
Niche: commentary and history explainers; the headline-highlight clip as a reusable opener or news-quote insert.

## icon-burst-title

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| 阿正老師 (channel 軟體玩家) | pcrookie.com (軟體玩家) article | TW | https://pcrookie.com/claude-remotion-motion-graphics-video-guide-2026/ | 2026-10-04 | Claude Code, Remotion | Prompt recipe only; the page says the author has not tested it ("尚未實測"). No rendered video | opened |

Finished examples found: 0.

Recipe facts (from the untested recipe, treat as specification)
- 1920x1080, 30 fps, 450 frames (15 s), H.264 plus AAC.
- Palette: brand orange `#E55A2B`, background `#1E1E1E`, text `#FFFFFF`, accent light orange `#FFB38F`.
- Font: Noto Sans TC via @remotion/google-fonts; name it explicitly or Chinese renders as boxes. Keep text 80 px from the edges.
- Timeline: 0-2 s orange dot springs up and bursts into 12 rays; 2-5 s four characters pop in 6 frames apart with slight bounce; 5-9 s split screen, three icons (download arrow, gear, speech bubble) fly in from left while labels appear right; 9-12 s icons rotate and converge into an orange circular badge; 12-15 s badge shrinks left, tagline right, fade to dark.
- Motion rules: no linear animation, `spring()` or ease-out only; frame-driven, no `Math.random()`.
- Audio: a Node script synthesizes a 15 s WAV; a short thump on each text entrance aligned to the frame. Most fragile step, so skip on the first attempt.
- Pitfalls: change one thing per message; preview in Studio stutters, judge the rendered MP4; use a dedicated empty folder.
- Page also notes most of a viral 100-prompt list targets video models, not code.

Recommended tier: experimental. Reason: single untested prompt recipe, zero finished examples.
Niche: channel intros, course openers, logo stings for small creators.

## vintage-sketch

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| bang-motion (bangtutorial) | GitHub | global | https://github.com/bangtutorial/bang-motion | not stated | HyperFrames skill pack | 'Vintage sketch' direction: sepia paper, engraving-style art, classic serifs, rust-colored annotations; still frame `docs/gallery/10-vintage-sketch.jpg` only (supporting) | opened |
| des13 / 益盛科技 (adjacent) | des13.com | TW | https://des13.com/news/ai/1734-claude-opus.html | 2026-09-29 | Claude Code, HyperFrames | 台灣百年教會, paper-cut to watercolor to postcard/stamp, 45 s; heritage look but not sepia engraving | opened |

Finished examples found: 0 true matches (1 adjacent heritage video). Multiple searches (English, Chinese, Japanese) for sepia / engraving / hand-drawn agent-made video returned nothing.

Recipe facts
- Look: sepia paper, engraving-style line art, classic serifs, rust-red annotations (no hex published) [bang-motion].
- Paper and print motion (bang-motion): objects fly in and land, stamps, tape, collage.
- Shared rules from the same pack: sentence case, background motion never stops, no text under 30 px on a 1080-wide stage.
- Suggested implementation [inference, not from a source]: SVG `feTurbulence` grain, stroke-dashoffset line drawing for engraving hatching, rust accent for labels.
- Pitfall: engraving line art is hard for an agent to draw in SVG without source art; licensing of heritage photos (des13 converted them to illustration).

Recommended tier: experimental. Reason: one skill pack with a still image; no finished video.
Niche: history, craft and heritage topics, biography cards.

## social-carousel-cards

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| anharu-dev | GitHub | KR | https://github.com/anharu-dev/haru-cardnews | not stated (64 commits, 1 star) | Claude Code plugin, Remotion, headless Chrome | Renders 4:5 cards: MP4 for clip cards, PNG for text/CTA cards; 11 moods; no sample gallery on the page (supporting, tool) | opened |
| editor_소연 | GPTers community | KR | https://www.gpters.org/nocode/post/creating-card-news-claude-9TDMoF7L4Q73LcX | "6 months ago", case table spans Mar 25 to Apr 8 (year not shown) | Claude Code custom skill `/card-news`, HTML, Puppeteer | Static PNG card-news, 1080x1350 at 2x; not video. A finished carousel workflow, off-scope for video | opened |

Finished examples found: 0 videos (1 static carousel workflow, 1 rendering plugin without samples).

Recipe facts
- Format: 4:5, 1080x1350. Clip cards (screen recording or photo plus 1-3 lines of text) become MP4; text and CTA cards stay PNG; numbered `01.mp4`, `02.png` (haru-cardnews). Audio is not rendered.
- haru-cardnews moods: press (white and red, default), neon (black and green), beauty (black and gold), festival (navy and amber), warm (orange), soft (pastel pink); custom `accent`/`bg` hex override. Titles use manual line breaks, about 8 characters per line.
- Fonts: Pretendard (default), Gothic A1 (minimal title), Gowun Batang (magazine title), Gowun Dodum (magazine body); Korean-subset WOFF2, SIL OFL 1.1.
- GPTers palette (static cards): beige `#FAF6F1`, accent orange `#D4734A` (accents only), dark `#2D2D2D`, white `#FFFFFF`; body text at least 26 px; 2-3 lines plus one visual per card; about 10 visual types (chat bubbles, file trees, code blocks, structure diagrams, timelines).
- Pitfalls reported: single-HTML export gave inconsistent screenshot sizes (1076 vs 1080 px); a JSON plus build-script v1 made every card identical like a slide deck; unconstrained color use gave blue/green/purple, fixed by a 4-color limit; automate only the mechanical HTML-to-PNG step and leave visual choices to the model.
- Cards are swiped by the viewer; if rendered to a single video, use a slide-and-snap transition (inference, not sourced).

Recommended tier: experimental. Reason: no finished agent-made carousel video found; the evidence is a plugin and a static-image workflow.
Niche: Instagram and Xiaohongshu card-news posts, mostly as images with video cards for screen clips.

## product-turntable-3d

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| HyperFrames registry | GitHub | global | https://github.com/heygen-com/hyperframes/tree/main/registry/blocks | not stated | HyperFrames block `product-turntable` | Registry block (supporting) | opened (earlier pass) |
| Remotion | remotion.dev | global | https://www.remotion.dev/templates | not stated | @remotion/three template | 3D phone with swappable video (supporting) | opened (earlier pass) |
| Kevin Ngo | via ai-bot.cn roundup | CN | https://ai-bot.cn/claude-opus-5-5-video-tutorial/ | not stated | Claude Opus 5.5, Python, Blender | Gentle 3D animation with piano music, Blender-rendered; agent-written scene but not a code-rendered browser 3D product shot | opened |
| @arumii_movie, @colecornelll (3D glass refraction, 15 s), @DengenT | X, via skillry.dev listing | JP / global | https://skillry.dev/ai-videos/opus-5-5 | not stated | Three.js, GLSL | Three.js product-adjacent pieces (logo end-card, glass refraction for Shillz, app promo); no turntable found | aggregator |

Finished examples found: 0 true product turntables (3 Three.js adjacent pieces via an aggregator).

Recipe facts
- `@remotion/three`: `<ThreeCanvas>` needs explicit width and height, proper lighting, and 3D content inside it; frame hook drives rotation.
- Rotation as a pure function of frame (`rotation.y = frame / fps * speed`) avoids R3F's own animation loop.
- Aggregator tags: Three.js plus GLSL used for glass, refraction and logos; glass refraction is a workable agent-written effect without external models.
- Needs a real model (GLB) or a procedurally built hero shape; no source showed a licensed product model.
- Pitfalls: render time of WebGL frames; lighting and shadow on a studio sweep must be set explicitly; unavailable product assets.

Recommended tier: experimental. Reason: no finished turntable found.
Niche: hardware or e-commerce launch teasers with a simple procedural or supplied GLB model.

## editorial-swiss

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| CreativeClaw (adapting HeyGen HyperFrames template) | creativeclaw.co | global | https://creativeclaw.co/examples/hyperframes-swiss-grid/ | not stated | HyperFrames `swiss-grid`, CreativeClaw MCP | 10 s, 1920x1080 30 fps; animated statistics, progress graphics, captions. Rendered preview of an unchanged template, so a template demo, not an original agent-made video | opened |
| kazu | note.com | JP | https://note.com/kazu_t/n/n4a29f538c7a7 | 2026-04-17 | HyperFrames, Claude Code | 30 s service-intro video; names warm-grain / swiss-grid / vignelli as starters, but which template the video used is not visible [unverified] | opened |
| nexu-io open-design `video-template-frame-swiss-grid` | open-design.ai, tessl | global | https://open-design.ai/plugins/video-template-frame-swiss-grid/ | not stated | Claude skill | Skill only; Tessl scored its SKILL.md 56/100 (no render commands, no verification step) (supporting) | snippet |
| HyperFrames frame-presets, bang-motion | GitHub | global | https://github.com/heygen-com/hyperframes/tree/main/skills/hyperframes-creative/frame-presets | not stated | HyperFrames | swiss-grid, vignelli, editorial, bold-poster presets (supporting) | opened (earlier pass) |

Finished examples found: 1 (template demo) plus 1 unconfirmed style. No independent named creator video in a Swiss grid look found.

Recipe facts
- Template-sourced motion: animated statistics, progress graphics and captions on a strong grid, 1920x1080 30 fps, 10 s unit.
- Nearby real example for grammar: a 1440x1440, 60 fps, 120 BPM, 7-bar looping UI morph in Geist on warm light gray with black and white UI (ai-bot.cn roundup, Opus 5.5, Playwright + FFmpeg + numpy). This is editorial UI motion, not a Swiss grid, but shows the "one shape morphs through states" grammar.
- bang-motion 'Editorial light': white or cream base, hairlines, display serif plus small grotesk, calm slide-like pace, lines that draw. No minimum text below 30 px on a 1080-wide stage.
- Existing draft in `data/drafts/editorial-swiss.md` (12-column grid, Swiss red `#E30613`, flush-left Inter Tight) is not contradicted by any source found; none of its hex values were confirmed by an external finished video.
- Pitfall from the skill review: workflow lacks verification checkpoints; off-grid drift and centering reflex stay valid risks (inferred from the draft).

Recommended tier: experimental. Reason: no independent finished agent-made Swiss grid video; evidence is templates and one demo render.
Niche: reports, conference talks, design-led brand stat pieces.

## map-geo-story

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| Claude Opus 5.5 in Claude Code, article by 益盛科技 (des13) | des13.com | TW | https://des13.com/news/ai/1734-claude-opus.html | published 2026-09-29, updated 2026-10-04 | Claude Code, HyperFrames | iChurch showreel, 40 s, 1920x1080; Taiwan map from 4,957 church coordinates, county bar chart, themes, staff. Took 25 min, 75,000 output tokens, 12.96 M total tokens; palette not stated | opened |
| @JNYBGR | remotion.dev prompts (posted on X) | global | https://www.remotion.dev/prompts/travel-route-on-map-with-3d-landmarks | "8 months ago", exact date not stated | Claude Code, Opus 4.5, Remotion | Prompt only, no video on the page: map zoomed out from LA, line animated LA to NY with the camera following, added Paris stop with a 3D Eiffel Tower | opened |
| equilibriumpress `routevideo` | skills.cat | global | https://skills.cat/skills/equilibriumpress/routevideo | not stated | React, Vite, MapLibre GL, Turf.js, Remotion | Open-source tool that geocodes origin and destination, draws a road or flight route, exports MP4 (supporting) | snippet |
| Remotion docs and `/remotion-maps` skill | remotion.dev | global | https://convert.remotion.dev/docs/maps | not stated | Remotion, Mapbox / MapLibre, Turf.js | Route length via Turf.js sliced by progress, camera via `setFreeCameraOptions()` (supporting) | snippet |
| iart-ai awesome-motion-skills | GitHub | global | https://github.com/iart-ai/awesome-motion-skills | 2026-06-22 | Remotion packs | Vox-style map pack (supporting) | opened (earlier pass) |

Finished examples found: 1 (iChurch showreel); 1 prompt page with no media.

Recipe facts
- Data-driven maps: plot real coordinates (4,957 points) rather than decorative icons; pair with a county bar chart.
- Camera options from Remotion docs: slice a route by progress (Turf.js length), camera follows along the line via MapLibre/Mapbox `setFreeCameraOptions()`.
- Landmark inserts: a 3D landmark at a stop (Eiffel Tower in the LA to NY to Paris prompt).
- Length and ratio: 40 s at 1920x1080 for the finished example; 5-hour-class budgets are not needed: about 25 min of agent time.
- Pitfalls: no API keys wanted for open-data builds; church-style factual data needs verification (des13 verified dates against sources); map-token requirements for Mapbox.
- The existing draft `data/drafts/map-geo-story.md` (d3-geo, TopoJSON, dark `#0E1621` ocean) remains unconfirmed by any external finished video's palette.

Recommended tier: experimental. Reason: only one finished video (still single-source); the other items are prompts and tools.
Niche: travel routes, regional data showreels, logistics and history explainers.
