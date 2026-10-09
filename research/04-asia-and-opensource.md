# 04 - Asia (TW / JP / KR) creators and open-source GitHub repos for agent-made video

Research date: 2026-10-10. Scope: code-driven video only (Remotion, HyperFrames, Manim, HTML/GSAP, Playwright+ffmpeg, p5/three.js). Generative video models and avatars are out of scope; where a source mixes them in, it is flagged.

Evidence convention: "opened" = I fetched the page and read it; "search" = seen only as a search result snippet (treat details as [unverified]). GitHub stars, license and pushed_at were read from the GitHub API on 2026-10-10. Some star counts are very high (e.g. HyperFrames 59,744); they are reported as returned by the API.

---

## Styles observed

"Independent examples" counts distinct creators/repos with a concrete instance, not mentions.

### S1. Glass-gradient SaaS / app promo
- Visual signature: dark or soft-gradient background, one brand-accent color, frosted-glass cards (backdrop blur), emoji/icon glyphs, springy fade+scale-in, cascaded stagger.
- Typical use: promo of an app/article/update, 20-60 s, 16:9.
- Tools: Remotion + official `remotion-dev/skills`; HyperFrames + GSAP.

| creator | platform / region | URL | date | tool | note |
|---|---|---|---|---|---|
| Yuto Shintani (AUN Tech Blog, Phonogram) | Zenn / JP | https://zenn.dev/aun_phonogram/articles/remotion-skill-video-creation (opened) | 2026-02-03 | Remotion + remotion-dev/skills | ~50 s, 6 scenes; gradient bg, Claude orange #D97757 accent, glassmorphism (backdropFilter blur), emoji icons, spring damping 100; prompt was "turn this article into a video"; result video https://youtu.be/NGItbY0dPNE (link from article, not opened) |
| Vincentwei1021 / video-shotcraft | GitHub / CN-language README | https://github.com/Vincentwei1021/video-shotcraft (README opened) | pushed 2026-10-05 | Remotion | 9 film themes: Ink Press, Modern Light, Midnight, Sage, Coral, Iris, Deep Ocean, Obsidian Violet, Vintage Kraft |
| latent-spaces / brag | GitHub | https://github.com/latent-spaces/brag (README opened) | pushed 2026-10-09 | HyperFrames; "brag-slim" variant without HyperFrames | 20 s launch video with music + share copy |
| op7418 (Guizang) | GitHub / CN | https://github.com/op7418/guizang-product-video-skill (README opened) | pushed 2026-10-09 | Claude Code / Codex, HyperFrames-tagged | reuses the product's real components and design language; fallback "CodePilot warm-white / charcoal" style |

Independent examples: 4.

### S2. Product-UI tour with camera push-in
- Visual signature: real product components/captures, camera zooms to what is clicked, 2.5D parallax, beat-synced cuts, film-grade SFX, motion blur.
- Tools: Remotion; HTML/CSS; Playwright + ffmpeg.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| video-shotcraft | GitHub | https://github.com/Vincentwei1021/video-shotcraft | 2026-10-05 | Remotion | "real page captures, 2.5D camera moves, beat-synced cuts"; 157 shot recipe cards; gallery https://vincentwei1021.github.io/video-shotcraft/ (linked in README, not opened) |
| bang-motion "Product tour with claims" | GitHub | https://github.com/bangtutorial/bang-motion | 2026-09-15 | single index.html | UI lifted from dashboard, camera follows clicks |
| claude-motion-design (howseen-ai) | GitHub | https://github.com/howseen-ai/claude-motion-design | 2026-10-04 | HTML + Playwright + ffmpeg | motion-blur blending, beat map, SFX placed by measured peak; example Howseen launch video, Opus 5.5, 5 iterations |

Independent examples: 3.

### S3. Black-canvas technical explainer with HUD and chapter progress bar
- Visual signature: black background (star-field + fog, or dot field), glowing line diagrams, top HUD, bottom chapter progress bar, word-aligned subtitles, TTS narration, 1280x720.
- Tools: Remotion, Kokoro / Volcengine TTS.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| anything2explainer | GitHub | https://github.com/Vincentwei1021/anything2explainer (opened) | pushed 2026-09-18 | Remotion | 5 min RAG explainer, 44 shots built by 8 parallel agents in 40 min; PolyForm Noncommercial per README badge |
| video-talkcraft | GitHub | https://github.com/Vincentwei1021/video-talkcraft (opened) | pushed 2026-10-01 | Remotion | narration-locked, 7-layer "anti-slideshow" camera system (continuous camera curves, parallax planes) |
| Aaryan-Kapoor/video-production-skill | GitHub | repo search (not opened) | 2026-07-09 | [unverified] | educational video producer skill |

Independent examples: 2 verified + 1 [unverified].

### S4. Broadcast-news block layout (color block number + ticker + scanlines)
- Visual signature: 340 px left color panel (red / cyan / amber, one per news item) holding a 200 px Impact numeral; right panel with kicker, headline, three spec lines sliding in; scrolling "BREAKING" ticker along the bottom; scanline overlay; 1920x1080, ~48 s.
- Tools: HyperFrames + GSAP + AivisSpeech (free local Japanese TTS) + Claude Code; ~30 min per video.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| 秋吉雅史 (akiyoshisanbass; X @akiyoshisan) | note / JP | https://note.com/akiyoshisanbass/n/nae46cd554ae8 (opened) | 2026-06-08 | Claude Code + AivisSpeech + HyperFrames | AI-news mass production; web search -> narration WAVs -> HTML composition; proper nouns written in katakana for TTS |

Independent examples: 1.

### S5. Zundamon / VOICEVOX character talk (blackboard explainer)
- Visual signature: blackboard-style default background, two VOICEVOX characters (Zundamon green #228B22, Shikoku Metan pink #FF1493) with mouth-open/closed sprites and expression variants, white Noto Sans JP 48 px captions, 1920x1080 30 fps.
- Tools: Remotion + VOICEVOX + Claude Code.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| nyanko3141592 | GitHub / JP | https://github.com/nyanko3141592/remotion-voicevox-template (opened) | pushed 2026-01-29; 282 stars; MIT | Remotion | the template most Japanese posts build on |
| 律 (ritsu_void, "AI重大ニュース") | note / JP | https://note.com/ritsu_void/n/nfedcee9c6006 (opened) | 2026-03-15 | Claude Code + VOICEVOX + Remotion | mostly text on screen, lip-sync to audio; a 500-yen paid section (install commands, prompts, AWS Lambda rendering) exists - only the public page recorded |
| shogaku | note / JP | https://note.com/syogaku/n/nd873c974ac5e (search only) | [unverified] | same stack | |
| ussu_ussu_ussu | Qiita / JP | https://qiita.com/ussu_ussu_ussu/items/343c0601a45cfb3922b3 (search only) | [unverified] | same stack | swaps ts-node for tsx |
| dai365 | Hatena Blog / JP | https://powerdaaps.hatenablog.com/entry/2026/03/28/202812 (search only) | 2026-03-28 (from URL) | Claude Code | corporate training videos with Zundamon |
| youtoy | Qiita / JP | https://qiita.com/youtoy/items/701ec7a4c8092813c532 (search only) | [unverified] | Codex desktop + GPT-5.3-Codex + same template | shows the template also runs under Codex |
| Naoki (electrical_cat) | note / JP | https://note.com/electrical_cat/n/n9be53194cb5c (search only) | [unverified] | | "in 5 minutes" |

Independent examples: 7 (2 opened, 5 search-only). Distinctively Japanese.

### S6. Retro terminal / pixel CRT
- Visual signature: terminal/hacker self-intro with typing animation, glitch, CRT scanlines, ASCII progress bars, flash transitions; retro pixel font (Neodunggeunmo); 14 scene types (timelines, comparison tables, bar/donut charts, flow diagrams); `--shorts` flag for vertical.
- Tools: Remotion + Whisper + Zod-validated scene JSON.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| 바이브코더 루피 (vibecoder-loopy) | own blog / KR | https://vibecoderloopy.com/blog/remotion-video-automation-oneday-class (opened) | "03.30" (year not shown; presumably 2026) | Remotion, Whisper, Claude Code | repos https://github.com/vibecoder-loopy/portfolio-intro and https://github.com/vibecoder-loopy/loopy-youtube-template (links from the post; repo pages not opened) |

Independent examples: 1.

### S7. Single-word kinetic typography on an empty stage
- Visual signature: empty frame -> a word appears -> settles -> fades; big high-contrast type; 9:16, 30 s, 6 scenes; optional BPM-matched transitions. Variants: poster color-block, condensed-display + WebGL.
- Tools: HyperFrames + GSAP; Suno BGM; AI frame review every 6 frames (~150 stills).

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| Todd | GPTers / KR | https://www.gpters.org/nocode/post/made-30second-motion-graphics-hDm8TvYhGuFCjqZ (opened) | file name 2026-06-06 | Claude Code + HyperFrames (skill from "hyperframes-giacomo-mini-session") | AI QA found a text-pre-reveal bug and re-rendered; 125 BPM re-timing for the music version |
| Kimeur/motion-launch-videos | GitHub | https://github.com/Kimeur/motion-launch-videos (search only) | 2026-10-09 | single HTML file | looping kinetic-typography launch video |
| tuzhechen2005 "kinetic-reel" | GitHub | https://github.com/tuzhechen2005/opus-video-skills (opened) | 2026-09-27 | 2D type canvas + three.js + WebGL post | condensed display type, HUD micro-type, particle terrain, liquid marble, chrome knot; 84 s "Work Reel '26" |
| bang-motion "Poster color-block" | GitHub | https://github.com/bangtutorial/bang-motion | 2026-09-15 | HTML | huge cropped words, solid color fields slam in on the beat |

Independent examples: 4.

### S8. Karaoke / TikTok word-highlight captions
- Visual signature: word-level highlighted subtitles; max ~14 CJK characters per line, 2 lines; brand-color highlight on key terms; caption kept off the speaker's face and phone UI.
- Tools: Remotion `@remotion/captions` + Whisper; HyperFrames.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| Philo (AI郵報 aiposthub) | Traditional-Chinese site, likely TW [unverified] | https://www.aiposthub.com/claude-code-hyperframes-video-editing-guide/ (opened) | 2026-07-18 | Claude Code + HyperFrames + FFmpeg + Whisper | 9:16 under 60 s; 2-3 s graphic cards with fade / upward motion / number emphasis; advises against rotation, flashing, heavy bouncing |
| SuguruKun_ai | X / JP | https://x.com/SuguruKun_ai/article/2033841774121390490 (search only; fetch returned 402) | [unverified] | Claude Code + Remotion | "AI video editing textbook", subtitles and animation all in code |
| hatushiba_ken | X / JP | https://x.com/hatushiba_ken/article/2043364777830015009 (search only) | [unverified] | Claude Code + Remotion | auto telop (captions) |
| GakuNoguchi/jimaku-ai-skill | GitHub / JP | https://github.com/GakuNoguchi/jimaku-ai-skill (search only) | 2026-01-26 | Remotion + Whisper | Japanese short-form subtitles |
| datz-d/jpsub | GitHub | https://github.com/datz-d/jpsub (search only) | 2026-09-09 | whisper + ffmpeg (not a render framework) | cinema-style Japanese subtitles burned in |
| loopy portfolio-intro | KR | see S6 | - | Remotion | karaoke highlight, auto color theme per scene, motion graphics left / subtitles right |

Independent examples: 6 (2 opened, 4 search-only).

### S9. Transparent overlay / B-roll panels for talking-head footage
- Visual signature: transparent ProRes 4444 / WebM-alpha clips; pill -> card -> terminal -> chart morphing in one continuous shape; panels in empty space beside a PiP speaker; lower thirds, pull-quotes.
- Tools: Remotion, HyperFrames, Playwright.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| Wells (WellWells) | blog / TW-style | https://wellstsai.com/post/remotion-video-animation-tutorial/ (opened) | 2026-08-27 | Remotion + Claude Code/Codex | 3 title cards pop in from left at 0.8 s intervals with SFX, fade out, 6 s; transparent ProRes 4444 (yuva444p10le) to overlay on screen recordings; bouncing bar chart in warm colors; cites https://github.com/manalkaff/remotion-prompts (API returned 404) |
| Barty-Bart/motion-graphics | GitHub | https://github.com/Barty-Bart/motion-graphics (README opened) | 2026-10-08 | HTML + Playwright | `motion-broll`; compare.html sync viewer; skeleton lines instead of invented numbers |
| heygen-com/hyperframes `talking-head-recut` skill | GitHub | https://github.com/heygen-com/hyperframes (README opened) | 2026-10-09 | HyperFrames | lower-thirds, data callouts, kinetic titles, pull-quotes, side panels, PiP |
| video-talkcraft | GitHub | see S3 | - | Remotion | right-click export of any clip as transparent MOV/WebM |

Independent examples: 4.

### S10. Slide-narration video (Marp slides -> Remotion, forced-aligned subtitles)
- Visual signature: predefined slide layouts (title, two-column, list) chosen by flowchart, 200+ SVG icons, base-image-consistent illustrations, `data-appear` fade-in sequence, duration locked to narration.
- Tools: Cursor agent (Opus 4.5) / Claude Code, Marp, Remotion, Gemini TTS + image models, Montreal Forced Aligner.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| かがん (Kikagaku) | Zenn / JP | https://zenn.dev/kikagaku/articles/ai-slide-video-generation-system (opened) | 2025-12-10 | Cursor + Opus 4.5, Marp, Remotion, Gemini | custom commands /00-start ... /05-video, self-review loop; admits slow (2-3 h for ~5 videos) and weak complex diagrams |
| myanyanloki; kotaro_ai_lab | Qiita / JP | https://qiita.com/myanyanloki/items/f7bf4147cf7ab8559f6f ; https://qiita.com/kotaro_ai_lab/items/d19d85f2e8760dc4a646 (search only) | [unverified] | Remotion + VOICEVOX | markdown script -> slides -> audio -> render |
| GPTers e-book study | KR | https://www.gpters.org/ai-writing/post/claude-code-remotion-saved-QOnvxhEqNMLq41e (search only) | [unverified] | Remotion | captured screens auto-scroll in time with the voice |

Independent examples: 1 verified + 3 [unverified].

### S11. Hand-drawn / painted illustration reveal
- Visual signature: line art revealed left to right, then low-saturation color fills in the same direction, 720x960 vertical, 35-45 s; or p5.brush watercolor/ink cartoons with character acting and karaoke lyric subtitles.
- Tools: HyperFrames + GSAP + Python line-art extraction; p5.js + p5.brush + ffmpeg.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| xiejunjie524 / handdraw-story-video | GitHub / CN | https://github.com/xiejunjie524/handdraw-story-video (README opened) | pushed 2026-07-23; MIT; 776 stars | HyperFrames | needs externally generated color master images (image model not bound to a service) |
| tuzhechen2005 "painted-animation" | GitHub | https://github.com/tuzhechen2005/opus-video-skills | 2026-09-27 | p5.js | 31 s lyric video for 陶喆《小镇姑娘》 |

Independent examples: 2.

### S12. 3Blue1Brown-style math (Manim)
- Visual signature: dark background, geometry and equation morphs, narration or captions.
- Tools: Manim CE / ManimGL, manim-voiceover.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| adithya-s-k/manim_skill | GitHub | https://github.com/adithya-s-k/manim_skill (opened) | pushed 2026-01-23; MIT; 1,152 stars | Manim CE + ManimGL | best-practice rules and examples |
| shuyicc/MathLens | GitHub / CN | https://github.com/shuyicc/MathLens (search + API) | pushed 2026-03-10; 357 stars; no license | Manim, Cursor | math problem -> analysis, script, Manim video; "0.2-1 CNY per video" is a README claim |
| liangdabiao/math-concept-film | GitHub / CN | https://github.com/liangdabiao/math-concept-film (search only) | 2026-08-28 | Manim | concept -> narrated math short |
| Manim x Claude kit (Japanese) | BOOTH / JP | https://booth.pm/ja/items/8643279 (search only) | [unverified] | Manim CE 0.20.1 | PAID, 2,980 yen, 26 Japanese templates - public page only |
| AmitSubhash/3brown1blue | GitHub | https://github.com/AmitSubhash/3brown1blue (search only) | 2026-06-27 | Manim | 21 rule files |

Independent examples: 5 (1 paid). No Korean or Taiwanese Manim agent example found.

### S13. Editorial / design-system template families
- Visual signature: named palettes and layout systems chosen per brief. Named in sources: warm-grain, swiss-grid, vignelli, kinetic-type (kazu_t note); HyperFrames design templates (first ten in README: Biennale Yellow, BlockFrame, Blue Professional, Bold Poster, Broadside, Capsule, Cartesian, Cobalt Grid, Coral, Creative Mode); bang-motion directions (Grainy gradient; Flat vector illustration; Flat pop with photos; Continuous action; Visual journalism - black ground, source-tagged photos, highlighter, dashed annotations; White catalog; Vintage sketch - sepia, engraving, rust notes; Cartoon collage; Cartoon stage; Poster color-block).
- Tools: HyperFrames, HTML/CSS.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| kazu (谷 一徳, AI Academy) | note / JP | https://note.com/kazu_t/n/n4a29f538c7a7 (opened) | 2026-04-17 | HyperFrames + Whisper + Kokoro | 30 s service intro; hex-code hashtags (#06b6d4 cyan, #050505 / #0b0f14 dark, #1a1033 violet) suggest the palette but the article does not say so; 6 s draft rendered in ~16 s on M3 Pro |
| HeyGen | GitHub | https://github.com/heygen-com/hyperframes | 2026-10-09 | HyperFrames | official design templates + ~20 skills |
| bang-motion | GitHub | https://github.com/bangtutorial/bang-motion | 2026-09-15 | HTML | 10 styles x 19 concepts x 9 render families |
| nexu-io/html-video | GitHub | https://github.com/nexu-io/html-video | pushed 2026-06-21 | HTML | 21 templates, 14 agent backends |
| nateherkai/hyperframes-student-kit | GitHub | https://github.com/nateherkai/hyperframes-student-kit | 2026-09-28 | HyperFrames | 406 motion cards in two styles (dark graph paper, left glass popout); 15 s 60 fps 129 BPM showreel |

Independent examples: 5.

### S14. Brand-orange / dark-gray icon-burst title (prompt-recipe style, Traditional Chinese)
- Visual signature: #1E1E1E background, #E55A2B orange, #FFB38F accent; glowing dot expands into 12 rays; letter-by-letter bounce; three icons flying beside three text lines; icons rotate into a circular badge; 15 s, 1920x1080, Noto Sans TC.
- Rules in the prompt: no image assets, no linear motion (spring / ease-out), no Math.random, 80 px safe margin.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| 阿正老師 (軟體玩家) | pcrookie.com / TW-leaning [unverified] | https://pcrookie.com/claude-remotion-motion-graphics-video-guide-2026/ (opened) | 2026-10-04 | Remotion 4.0.532 + remotion-dev/skills | copy-paste Traditional Chinese prompt; tips: spec second-by-second, exact hex codes, one change per message, keep under 30 s |

Independent examples: 1.

### S15. Faceless shorts and "fake demo" videos
- Visual signature: reusable React scene templates, topic swapped per video, edge-tts voice + auto subtitles; or an 18 s demo of an unreleased service for landing pages.
- Tools: Remotion + Claude Code + edge-tts.

| creator | platform | URL | date | tool | note |
|---|---|---|---|---|---|
| builder.ericc | Threads / KR | https://www.threads.com/@seize.more/post/DWBXH9uEiU_ (opened; URL path handle differs from displayed handle) | 2026-03-18 | Remotion, Claude Code, edge-tts | build scene templates once, swap topic; steps in comments (not seen) |
| ai.winey_ny | Threads / KR | https://www.threads.com/@ai.winey_ny/post/DU8RrzICIHa (opened) | 2026-02-19 | Claude Code + Remotion | 18 s demo with no real feature, ~20 min |
| prompt_case | Threads / Traditional Chinese [region unverified] | https://www.threads.com/@prompt_case/post/DT1iYsGjbr5 (opened) | 2026-01-22 | Claude Code + remotion-dev/skills | tutorial-style animated explainer with theme color, synced subtitles, free TTS; says the skills also work in Antigravity |

Independent examples: 3.

### S16. Hybrid code + generative assets (flagged, partly out of scope)
- iret / KDDI (danishi): Remotion composition with Ken Burns stills, fade transitions, subtitles plus Veo 3.1 clips, Lyria BGM, Gemini TTS. https://zenn.dev/iret/articles/claude-code-video-composer (opened), 2026-06-11. Useful only as an orchestration pattern (scene table with explicit approval, props.json-driven re-render, cheapest-fix-first QA). Repo https://github.com/danishi/claude-code-config.
- OpenMontage (calesthio): https://github.com/calesthio/OpenMontage, 65,826 stars, AGPL-3.0, pushed 2026-10-03; 12 pipelines, 100+ tools, mixes Remotion with image/TTS/video generation; only the code-driven portion is in scope.

---

## Creators (TW / JP / KR)

### Japan
| creator | platform | URL | date | style | tools |
|---|---|---|---|---|---|
| Yuto Shintani / AUN Tech Blog | Zenn | https://zenn.dev/aun_phonogram/articles/remotion-skill-video-creation | 2026-02-03 | S1 | Remotion + official skill |
| 秋吉雅史 | note, X @akiyoshisan | https://note.com/akiyoshisanbass/n/nae46cd554ae8 | 2026-06-08 | S4 | HyperFrames, AivisSpeech |
| kazu (谷 一徳) | note | https://note.com/kazu_t/n/n4a29f538c7a7 | 2026-04-17 | S13 | HyperFrames, Whisper, Kokoro (paid membership exists; free article used) |
| かがん / Kikagaku | Zenn | https://zenn.dev/kikagaku/articles/ai-slide-video-generation-system | 2025-12-10 | S10 | Cursor, Marp, Remotion, Gemini |
| danishi / KDDI Iret | Zenn | https://zenn.dev/iret/articles/claude-code-video-composer | 2026-06-11 | S16 | Remotion + Veo/Lyria |
| 律 (ritsu_void) | note | https://note.com/ritsu_void/n/nfedcee9c6006 | 2026-03-15 | S5 | VOICEVOX |
| nyanko3141592 | GitHub | https://github.com/nyanko3141592/remotion-voicevox-template | 2026-01-29 | S5 | Remotion, VOICEVOX |
| SuguruKun_ai, hatushiba_ken | X | see S8 | [unverified] | S8 | Remotion |
| 斉藤 智彦 (saitohtm) | note | https://note.com/saitohtm/n/n437d62e4e263 (search only) | [unverified] | SNS ad video | Remotion |
| kawasaki031677 | Qiita | https://qiita.com/kawasaki031677/items/09d32ae087022bd76125 (search only) | [unverified] | World Cup cheer video, ~5 revisions | Remotion |
| sarap422 | Qiita | https://qiita.com/sarap422/items/e827f1eb8f9c2582ecb8 (search only) | [unverified] | manual video generated from a screen recording | Remotion |
| くわずるゆき子 | note | https://note.com/calm_hornet968/n/n67bff246a476 (search only) | [unverified] | non-engineer automatic editing experiment | - |
| noriyang0911; あまぐり; TrueNorthAI | note | https://note.com/noriyang0911/n/n6ef8740016f0 ; https://note.com/glossy_fennel884/n/n455e13445e33 ; https://note.com/truenorthai/n/n9c6ef9b817f7 (search only) | [unverified] | HyperFrames explainers; Blender MCP + Remotion 3D | - |
| weel; aqua LLC; timewell | corporate blogs | https://weel.co.jp/media/innovator/claude-code-video-editing/ ; https://www.aquallc.jp/remotion-ai-video-guide/ ; https://timewell.jp/en/columns/remotion-claude-code-programmatic-video (search only) | [unverified] | guides | Remotion |
| Kyosuke-Shige/youtube-production-skills; tanuu5/claude-game-jikkyo; raimu1240-ship-it/shortvideo-skill; Fialuxe VOICEPEAK kit | GitHub | repo search results | 2026-04 to 2026-10 | Japanese narration / game-commentary with VOICEVOX / "empathy-first" vertical shorts with irasutoya stock art | 0-star, search-only |

### Korea
| creator | platform | URL | date | style | tools |
|---|---|---|---|---|---|
| 바이브코더 루피 | own blog + GitHub | https://vibecoderloopy.com/blog/remotion-video-automation-oneday-class | "03.30" | S6, S8 | Remotion, Whisper |
| Todd | GPTers | https://www.gpters.org/nocode/post/made-30second-motion-graphics-hDm8TvYhGuFCjqZ | ~2026-06 | S7 | HyperFrames, Suno |
| builder.ericc | Threads | https://www.threads.com/@seize.more/post/DWBXH9uEiU_ | 2026-03-18 | S15 | Remotion, edge-tts |
| ai.winey_ny | Threads | https://www.threads.com/@ai.winey_ny/post/DU8RrzICIHa | 2026-02-19 | S15 | Remotion |
| philosophyAIEDU / 260731eduhyper | GitHub | https://github.com/philosophyAIEDU/260731eduhyper (README opened) | pushed 2026-09-29; 3 stars; API license NOASSERTION, README says kit is MIT | narration-locked motion graphics: `frame.md` sets color/font/motion; Pretendard; starfield; fade-to-black; coin-spin example | HyperFrames, OBS narration; warns non-ASCII folder path breaks HyperFrames silently |
| jaeheungahn / hyperframes-giacomo-mini-session | GitHub | https://github.com/jaeheungahn/hyperframes-giacomo-mini-session (named in GPTers post, API returned 404; [unverified]) | - | one-question-at-a-time planning wizard | HyperFrames |
| techtaek | blog | https://techtaek.com/claude-code-remotion-스킬-사용법-하루-써본-솔직-후기/ (search only) | [unverified] | one-day review | Remotion skill |
| daleseo; wikidocs (jaehong) | blogs | https://daleseo.com/remotion/ ; https://wikidocs.net/blog/@jaehong/12727/ (search only) | [unverified] | Remotion intro | - |
| jinjin1 / scenewright | GitHub | https://github.com/jinjin1/scenewright (search only) | 2026-08-24; MIT; 5 stars | source text -> narrated Remotion YouTube explainer, local Korean TTS | Remotion |
| anharu-dev / haru-cardnews | GitHub | https://github.com/anharu-dev/haru-cardnews (search only) | 2026-08-27 | Instagram 4:5 carousel cards with copy over real screen clips; Claude Code plugin | - |
| sodam-ai / Remotion-CLI_One-Click_Kit | GitHub | https://github.com/sodam-ai/Remotion-CLI_One-Click_Kit (search only) | 2026-06-18; Apache-2.0 | Windows one-click Remotion installer for beginners | - |
| YouTube Korean HyperFrames guides | YouTube | https://www.youtube.com/watch?v=WofSIoEj_CQ (beginners' guide) ; https://www.youtube.com/watch?v=Hqsus_C8-IY (Claude Design + motion graphics) | [unverified] | search-only, channels not identified | HyperFrames |
| Recorded (hackathon-winner demo-video tool) | GeekNews | https://news.hada.io/topic?id=27134 (search only) | [unverified] | screen-recording demo videos | - |

### Taiwan (Traditional Chinese)
| creator | platform | URL | date | style | tools |
|---|---|---|---|---|---|
| Wells (wellstsai.com) | blog | https://wellstsai.com/post/remotion-video-animation-tutorial/ | 2026-08-27 | S9 | Remotion, Claude Code/Codex, Premiere |
| 阿正老師 / 軟體玩家 | pcrookie.com | https://pcrookie.com/claude-remotion-motion-graphics-video-guide-2026/ | 2026-10-04 | S14 | Remotion |
| Philo / AI郵報 | aiposthub.com | https://www.aiposthub.com/claude-code-hyperframes-video-editing-guide/ | 2026-07-18 | S8 | HyperFrames |
| prompt_case | Threads | https://www.threads.com/@prompt_case/post/DT1iYsGjbr5 | 2026-01-22 | S15 | Remotion |
| 用AI發電 (pathunfold) | blog | https://pathunfold.com/blog/remotion-claude-code-ai-video (search only) | [unverified] | typing-only Remotion | - |
| yahaclass | blog | https://yahaclass.com/remotion-claude-code (search only) | [unverified] | zero-code batch generation | Remotion |

Region caveat: none of the TW sources states "Taiwan" explicitly; classification is by Traditional Chinese wording [unverified]. No iThome, Medium or Facebook TW article on this topic surfaced. Simplified-Chinese creators (op7418, feicaiclub, xiejunjie524, Vincentwei1021) are mainland-style and appear in the repo table.

---

## Open-source repos

Stars/license/pushed_at from the GitHub API on 2026-10-10. NOASSERTION means no SPDX-recognized license (often custom or non-commercial; check the README).

| repo | stars | license | last update | what | styles encoded | quality notes |
|---|---|---|---|---|---|---|
| https://github.com/heygen-com/hyperframes | 59,744 | Apache-2.0 | 2026-10-09 | HeyGen's HTML+GSAP to MP4 renderer; CLI lint/preview/render; ~20 skills (core, animation, creative, keyframes, audio, cli, studio, registry, motion-graphics, talking-head-recut, music-to-video, pr-to-video, product-launch-video, faceless-explainer, slideshow, embedded-captions, remotion-to-hyperframes) | design templates (Biennale Yellow, BlockFrame, Bold Poster, Cobalt Grid, ...); kinetic type; stat/chart hit; logo sting; lower third; animated tweet; beat-synced lyric/slideshow | official; template previews at hyperframes.dev/design/*; ships CLAUDE.md and AGENTS.md; ADOPTERS.md |
| https://github.com/remotion-dev/skills | 4,960 | none shown | 2026-10-07 | official Remotion agent skills: best-practices, captions, create, docs, interactivity, maps, markup, multimedia, render, saas | generic Remotion patterns | official; technical rather than aesthetic guidance |
| https://github.com/remotion-dev/remotion | 62,789 | NOASSERTION (company license: free for individuals / small teams, paid beyond) | 2026-10-09 | framework | - | license caveat appears in several KR/JP posts |
| https://github.com/Vincentwei1021/video-shotcraft | 11,032 | Apache-2.0 | 2026-10-05 | cinematic product-video skill | S1/S2: 157 shot recipe cards, 214 styles/previews, 9 film themes, 2.5D camera, beat-synced cuts, SFX | rendered gallery + showcase; EN/CN/JA READMEs; strongest example set found |
| https://github.com/Vincentwei1021/video-talkcraft | 1,460 | NOASSERTION (PolyForm Noncommercial) | 2026-10-01 | narration-video skill | S3/S9: 108 motion recipe cards, word-level voice sync, 7-layer anti-slideshow camera, plain-cut subtitles, triple QA gate, transparent export | live gallery, workbench; noncommercial |
| https://github.com/Vincentwei1021/anything2explainer | 2,372 | NOASSERTION (PolyForm Noncommercial) | 2026-09-18 | topic -> black-canvas narrated explainer | S3 | complete reference film, QC reports, frames in `examples/rag/` |
| https://github.com/latent-spaces/brag | 14,748 | MIT | 2026-10-09 | one-command launch video | S1 | live launch site made by the skill itself |
| https://github.com/nexu-io/html-anything | 9,054 | Apache-2.0 | 2026-09-15 | agentic HTML editor, 75 skills over 9 surfaces (magazine, deck, poster, tweet, Hyperframes ...) | multi-format; video is one surface | breadth over depth for video |
| https://github.com/nexu-io/html-video | 4,655 | Apache-2.0 | 2026-06-21 | HTML to MP4, 21 templates, pluggable engines, AI soundtrack | template gallery | live renders |
| https://github.com/calesthio/OpenMontage | 65,826 | AGPL-3.0 | 2026-10-03 | agentic production system | mixes Remotion with generative models | mixed scope |
| https://github.com/iart-ai/motion-skills | 755 | MIT | 2026-09-30 | 54 skills in 17 packs (TikTok, text-message story, YouTube, e-commerce, ads, data animation, explainers, Vox-style maps, kinetic type, WebGL, Manim, lower thirds ...) | many | deliver-and-verify loop; showcase.gif; vendor-linked (iart.ai) |
| https://github.com/bangtutorial/bang-motion | 587 | MIT | 2026-09-15 | single-HTML motion-design skill | 10 styles x 19 opener concepts x 6 explainer styles (S13) | gallery images (fictional brands); required brand brief to avoid sameness; anti-slideshow rules |
| https://github.com/Barty-Bart/motion-graphics | 552 | NOASSERTION | 2026-10-08 | motion-broll + object-separation | S9 | compare.html, viewer.html, TIMING.md; closed-form springs; community promo |
| https://github.com/charlie947/motion-graphics-skills | 138 | MIT | 2026-09-30 | 13 skills (start with brand-intake) | S1/S2 | rules "from rejected drafts"; newsletter promo |
| https://github.com/tuzhechen2005/opus-video-skills | 142 | NOASSERTION | 2026-09-27 | per-style skills for Opus 5.5 | painted-animation (p5.brush watercolor), kinetic-reel (three.js + WebGL) | all imagery and music procedural; example sheets |
| https://github.com/howseen-ai/claude-motion-design | 357 | MIT | 2026-10-04 | HTML + Playwright + ffmpeg skill | S2 | full example source, motion blur, beat/SFX placement |
| https://github.com/haidrrrry/claude-remotion-skill | 332 | MIT | 2026-08-12 | Remotion skill: B-roll, captions, sound design | faceless video | [content not read] |
| https://github.com/wshuyi/remotion-video-skill | 394 | none | 2026-01-25 | early Remotion skill with Edge TTS / MiniMax TTS | - | stale; no license |
| https://github.com/Hainrixz/editor-pro-max | 264 | NOASSERTION | 2026-03-26 | Remotion editor, 25 components, 9 templates, 7 skills | - | [content not read] |
| https://github.com/AgriciDaniel/claude-shorts | 219 | MIT | 2026-07-11 | long-form to short-form with Remotion animated captions | S8 | |
| https://github.com/nateherkai/hyperframes-student-kit | 1,262 | NOASSERTION | 2026-09-28 | 15 skills; 406 motion cards in two styles; two scene templates | dark graph paper; left glass popout | four finished examples in README; optional paid APIs (ElevenLabs, Kie.ai) |
| https://github.com/feicaiclub/video-spec-builder | 1,016 | MIT | 2026-05-18 | turns "I want a video" into a second-accurate `video-spec.md` for HyperFrames | storyboard spec | process, not style |
| https://github.com/blixvip/NullMotion | 948 | none | 2026-10-08 | plays a finished motion-graphic ad beside its rough drafts | meta | [content not read] |
| https://github.com/xiejunjie524/handdraw-story-video | 776 | MIT | 2026-07-23 | line-reveal then color-fill stories | S11 | preview.jpg; auto checks for length / subtitle lines |
| https://github.com/op7418/guizang-product-video-skill | 749 | AGPL-3.0 | 2026-10-09 | product-update film that reuses real components | S1/S2 | original music and SFX |
| https://github.com/pireel/pireel | 1,273 | AGPL-3.0 | 2026-09-18 | open-source CapCut-style editor drivable over MCP | HyperFrames-tagged | editor, not styles |
| https://github.com/0xsline/OpenChatCut | 2,225 | AGPL-3.0 | 2026-10-07 | conversational editor with MCP | - | [content not read] |
| https://github.com/adithya-s-k/manim_skill | 1,152 | MIT | 2026-01-23 | Manim CE + ManimGL skills | S12 | stale since January |
| https://github.com/shuyicc/MathLens | 357 | none | 2026-03-10 | math problem -> Manim video | S12 | Chinese; Cursor-oriented |
| https://github.com/AmitSubhash/3brown1blue | 37 | MIT | 2026-06-27 | first-principles Manim skill | S12 | |
| https://github.com/FavioVazquez/showtime | 218 | MIT | 2026-10-08 | local video studio for coding agents | - | [content not read] |
| https://github.com/nyanko3141592/remotion-voicevox-template | 282 | MIT | 2026-01-29 | VOICEVOX Zundamon template | S5 | |
| https://github.com/zhuyansen/awesome-claude-video-skills | 505 | NOASSERTION | 2026-10-09 | awesome-list; README says 268 repos graded, repo description says 180 | - | index: https://agentskillshub.top/best/claude-video-skills/ |
| https://github.com/wilwaldon/Claude-Code-Video-Toolkit | 88 | none | 2026-02-26 | skills/MCP for Remotion, Manim, screen recording | - | |
| https://github.com/ali-abassi/remotion-templates | 33 | none | 2026-08-23 | caption, visualizer, effect, transition templates | - | |
| https://github.com/danishi/claude-code-config | 3 | NOASSERTION | 2026-09-29 | video-composer skill (Remotion + Veo/Lyria/Gemini) | S16 | |
| https://github.com/mainkunalhu/motion-canvas-skill | 0 | none | 2026-09-22 | Motion Canvas skill | - | Motion Canvas / Revideo coverage is thin: also https://github.com/fantoche-dev/fantoche (0 stars, MIT, Revideo / Motion Canvas fork) and https://github.com/gafapa/lumen-studio (0 stars, AGPL) |

Remotion MCP: a GitHub search for "remotion mcp" returned no relevant standalone server; MCP shows up only as a topic of HyperFrames and in editors (pireel, OpenChatCut).

Quality pattern: the highest-starred repos (video-shotcraft, brag, hyperframes, student-kit, bang-motion) ship rendered galleries or example MP4s plus a QC loop (render stills, inspect, fix). Explicit pacing/typography/color guidance appears in bang-motion (style brief, anti-slideshow rules), video-talkcraft (camera system), student-kit (style library, tokens) and charlie947 (brand-intake). Older single-skill repos that just wrap the Remotion API offer little on style.

---

## Notable workflows and techniques

1. Pipeline of record in JP/KR: script (LLM) -> TTS (VOICEVOX, AivisSpeech, edge-tts, Kokoro, Gemini TTS) -> measure WAV length -> composition durations -> render. WAV-length measurement is the sync mechanism (akiyoshi, ritsu_void).
2. Recorded-voice path (KR): record narration in OBS -> Whisper -> SRT -> Claude writes scene JSON validated by Zod -> Remotion (loopy); 260731eduhyper has the user approve timing before scenes are built. talkcraft pre-trims fillers against the script.
3. Approval gates: scene-table plan approved before asset generation (iret); four checkpoints (anything2explainer); one-question-at-a-time wizard with recommended answers (Todd).
4. AI self-QA: stills every 6 frames (~150) checked for contrast, line breaks and premature text reveal (Todd); render-frame -> screenshot -> check (iart-ai); triple-gate QA (talkcraft).
5. Parallel authoring: one Remotion component per shot, 8 build agents for 40 min (anything2explainer).
6. Beat sync: BPM analysis, scenes on a beat map, SFX on measured peaks (claude-motion-design, Todd 125 BPM, student-kit 129 BPM).
7. Determinism: every frame a pure function of time (Barty-Bart closed-form springs; claude-motion-design seek(t)).
8. Prompt-recipe discipline (TW): second-by-second timeline, exact hex codes, one change per message, safe margin, no random, no linear motion (pcrookie).
9. CJK specifics: Noto Sans TC/JP, Pretendard; line-break checks so Hangul/kana do not split; ~14 CJK chars per caption line; katakana respelling of proper nouns for TTS; non-ASCII folder paths can silently break HyperFrames; mispronounced Japanese words in Gemini TTS (kikagaku).
10. Transparent deliverables: ProRes 4444 (`yuva444p10le`) or WebM alpha for overlay in Premiere/CapCut (wellstsai, talkcraft, Barty-Bart).
11. Migration: HeyGen ships `remotion-to-hyperframes` to port Remotion compositions to HTML+GSAP.

---

## Gaps / could not verify

- Web search is US-only; native-platform coverage is partial. Zenn, Qiita and note were reachable. velog, brunch and Naver Blog returned no hits for the queries tried (Korean results came from GPTers, Threads and personal blogs). Facebook and iThome surfaced nothing.
- YouTube: two Korean video URLs seen in search; no YouTube page opened, so no channel names, view counts or visual descriptions are verified. No Japanese or Taiwanese YouTube creator confirmed.
- X posts (SuguruKun_ai, hatushiba_ken) are search-only; fetch returned 402.
- Many search-only entries lack dates; marked [unverified].
- Visual descriptions for kazu's 30 s video and Todd's shorts are partly inferred; neither article gives a full palette or typography.
- Repo "last update" is API `pushed_at`. Hainrixz/editor-pro-max, haidrrrry, NullMotion, showtime and OpenChatCut were not read beyond their descriptions.
- jaeheungahn/hyperframes-giacomo-mini-session and manalkaff/remotion-prompts returned 404 from the GitHub API (renamed, private, or mis-transcribed by the page summarizer); stars and license unverified.
- Star counts for HyperFrames (59,744) and OpenMontage (65,826) are unusually high; reported as returned.
- Paid items recorded by public page only: ritsu_void 500-yen note section; kazu's paid membership; BOOTH Manim kit (2,980 yen); Barty-Bart community; letsbrag.app hosted service.
- Taiwan attribution of aiposthub, pcrookie, prompt_case and wellstsai is by language/terminology, not stated.
