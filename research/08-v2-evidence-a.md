# 08 - v2 evidence, batch A (9 candidates)

Research date: 2026-10-10. Method: GitHub API (MCP), page fetches, web search (EN/ZH/JA/KO). The search engine surfaced very little non-English creator material for these styles; ZH/JA/KO queries returned only generic Claude Code + Remotion/HyperFrames tutorials, so the non-English rows below come from known sources already in the repo plus prompt-motion/skillry. Anything not confirmed from a primary page is marked [unverified]. `verified`: opened = page/README read; aggregator = listed on a gallery page only; snippet = search snippet only.

Counting rule: "finished example" = a described, rendered (or fully reproducible) video made by an agent writing code. Component libraries, skill packs and prompt-only pages are listed as supporting and are NOT counted. "Vendor" = made by the tool vendor or the skill author, so not independent.

Summary

| id | finished examples (counted) | recommended tier |
|----|------|------|
| chat-social-ui | 1 (vendor, hybrid with Veo figure) | experimental |
| broadcast-news | 1 | experimental |
| whiteboard-handwriting | 0 | experimental |
| line-reveal-story | 1 (skill author, hybrid with image model) | experimental |
| isometric-explainer | 1 (skill-author demo, 6 s) | experimental |
| glitch-vfx | 1 (vendor VFX reel, not opened) | experimental (accent, not standalone) |
| paper-cut-collage | 3 (2 fully code-made, 1 hybrid) | core (conditional, see note) |
| audiogram-visualizer | 0 | experimental |
| abstract-generative-loop | 2 (one weak: aggregator) | experimental |

---

## chat-social-ui

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| HeyGen (heygen-com) | GitHub repo with mp4 | US | https://github.com/heygen-com/hyperframes-launches/tree/main/codex-five-hour-limit-replica | repo created 2026-04 (project date not shown) | HyperFrames + GSAP | 10.15 s, 3840x2160, 60 fps replica of an X clip: split-flap wordmark, zoom into logo, ChatGPT-style composer box with typed text, send button, headline on an arc. Figure is a Veo-generated alpha WebM (hybrid). Silent. Vendor-made, replica of a third-party clip | opened (STORYBOARD.md) |
| nikosmaheras-code | GitHub repo | [unverified] | https://github.com/nikosmaheras-code/remotion-imessage | created 2026-06-12 | Remotion | Library, not a video: iMessage threads at 1080x1920 with typing indicators, tapbacks, group chats. Supporting only | opened |
| HarshyChoc | GitHub repo | [unverified] | https://github.com/HarshyChoc/chatscene | created 2026-09-09 | Remotion + HTML | Library: one JSON conversation, two renderers, timed messages, voice notes. Supporting only, 0 stars | snippet (API description) |
| anthony80188 | GitHub repo | [unverified] | https://github.com/anthony80188/chat-video-renderer-nextjs | created 2026-06-06 | Remotion Player, Next.js | Browser editor for iMessage/Telegram-style chat videos. Supporting only | snippet (API description) |
| HyperFrames registry | GitHub | US | https://github.com/heygen-com/hyperframes/tree/main/registry/blocks | n/a | HyperFrames | blocks chatgpt-exchange, x-post, message-thread-reveal (already in candidates.yaml). Supporting only | opened (earlier pass) |

No finished chat-story video by a named independent creator was found. Searches in EN/ZH/JA/KO for Remotion/Claude Code chat or WeChat/KakaoTalk story videos returned only generic tutorials. Skillry's 40 listed Opus 5.5 entries and prompt-motion's visible list contain no chat-UI video (prompt-motion's "Phone" tag has 22 entries but per-entry tags were not exposed).

### Recipe facts

- Format: 1080x1920 vertical for message threads (remotion-imessage); 16:9 4K for the composer-box product-meme variant (HeyGen replica).
- iMessage palette: sent bubble blue #0A7CFF; avatar gradients are desaturated greys (#A9B0BB to #8E959F, #9BA8C2 to #7E8CA8, #B4AB9E to #9A917F); white tapback balloon.
- Cadence (remotion-imessage, citing HCI papers): reply delay about 50 ms x characters of the previous message, clamped 0.6-1.5 s; typing-indicator duration about 50 ms x reply characters, clamped 0.9-2.6 s; input-bar typing 2 frames per character; typing dots fade 1 to 0.5 over 0.5 s autoreverse with 0.33 s stagger; bubble spring damping 18, stiffness 190, mass 1.
- Sent messages type out in the input bar first, then the bubble whooshes up; incoming messages go typing-indicator then bubble; thread pushes apart when a tapback lands; "Delivered" to "Read" receipt under the last sent message.
- Composer-box variant (HeyGen replica): white ground #fff, Inter 400/600 UI, Heebo 900 headline at 0.85 horizontal scale; box border 15 px rgb(204,201,210) with 130 px radius at 4K; glyphs drop in with a 17-frame spring, purple (new) to black after 8 frames; camera pans following the caret; send disc crossfades to arrow with a 3 percent pulse.
- Pitfalls: use a manual `lines` count for bubble height (no DOM measurement, deterministic); clip tall image bubbles while their slot grows; HyperFrames colour pipeline shifted colours about -3/-3/-4, so pre-compensate; do not ship Apple's receive tone or real brand marks; real-person likeness should not be reproduced.
- Audio: usually a bring-your-own receive tick plus music bed; HeyGen replica is silent.
- Typical length: not documented for thread videos [unverified]; 10 s for the replica.

### Recommended tier + reason

experimental. Only one finished example, and it is vendor-made and hybrid. The libraries are strong supporting evidence that the style is code-reproducible, but they show demo PNGs, not finished videos by independent creators.

### Niche

Story-driven or meme shorts (vertical), AI product demos that show a prompt box typing out an ask.

---

## broadcast-news

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| Akiyoshi Masashi (akiyoshisanbass) | note.com article; video posted on X per embed [unverified] | JP | https://note.com/akiyoshisanbass/n/nae46cd554ae8 | 2026-06-08 | Claude Code + HyperFrames + AivisSpeech | AI-news video, about 48 s, 16:9 1920x1080 30 fps, 4.2 MB. Video file URL not in the article | opened |
| Remotion prompts gallery, @Remotion | remotion.dev/prompts | global | https://remotion.dev/prompts/news-article-headline-highlight | "8 months ago", no exact date | Claude Code, Opus 4.5 | Different sub-style: a news article screenshot with rough.js highlighter. Prompt only, no video shown. Supporting | opened |
| HyperFrames registry lower-thirds | GitHub | US | https://github.com/heygen-com/hyperframes/tree/main/registry/blocks | n/a | HyperFrames | Supporting only | opened (earlier pass) |
| mejba.me blog | blog | [unverified] | https://www.mejba.me/claude-code-video-production-system-hyperframes-auphonic | n/a | Claude Code + HyperFrames | Name-tag lower third slides in, holds, exits; about 90 s total workflow. Tutorial, not a news video | snippet |

### Recipe facts (from the one documented creator, Akiyoshi)

- 1920x1080, 30 fps, about 48 s: 5 voice clips (opening, 3 news items, closing) exported as WAV, durations measured and used to time the animation.
- Layout: left panel 340 px wide with a solid colour block per news item (red, cyan, amber; hex not given [unverified]); Impact numeral at 200 px; right panel with kicker, headline and 3 spec lines sliding in in sequence; BREAKING ticker scrolling along the bottom for the whole video; scanline overlay across the frame.
- Motion: one GSAP master timeline; slide-in, fade-out, stagger.
- Audio: AivisSpeech TTS, character "Mao, calm style".
- Built from scratch HTML each time (no template); `npx hyperframes lint` then `npx hyperframes render`; about 30 min per video (from the earlier pass).
- Pitfalls: TTS misreads romanised proper nouns, so write them in katakana in the script; web-search summaries contain errors, so verify numbers and names against primary sources.
- Remotion news-highlight recipe: white padded 1920x1080 canvas, 5 s slow zoom plus about 15 degree 3D rotation per axis, 1 s blur-to-sharp, rough.js highlighter sweeping left to right behind key phrases, OCR (Tesseract) to locate text.

### Recommended tier + reason

experimental. One independent finished example, and the video file itself is not linked, only the write-up.

### Niche

Daily AI-news or changelog digests with TTS, produced in bulk.

---

## whiteboard-handwriting

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| Sabrina Ramonov | newsletter | US | https://www.sabrina.dev/p/5-insane-claude-code-video-prompts | [unverified] | Claude Code + Remotion | Prompt template asking for self-drawing diagrams via SVG stroke-dashoffset; a prompt, not a finished whiteboard video | snippet |
| HyperFrames registry hw-* / whiteboard-ink | GitHub | US | https://github.com/heygen-com/hyperframes/tree/main/registry | n/a | HyperFrames | Components. Supporting only | opened (earlier pass) |
| iart-ai awesome-motion-skills | GitHub | [unverified] | https://github.com/iart-ai/awesome-motion-skills | n/a | skills | Pack. Supporting only | opened (earlier pass) |
| cth9191 animate, "sketchbook" style | GitHub | [unverified] | https://github.com/cth9191/animate | n/a | Claude Code skill, canvas | Adjacent look (graphite plus one accent on a sketchbook page, hand lettering), not a whiteboard | opened |
| xsct.ai eval pages | web | CN | https://www.xsct.ai/testcase/w_svganima_005/claude-opus-4-7 | n/a | LLM benchmarks | Model test cases for SVG handwriting; not videos | snippet |

No finished whiteboard or handwriting explainer made by an agent was found in EN/ZH/JA/KO searches.

### Recipe facts (from technique sources, not finished videos)

- Self-drawing strokes use SVG stroke-dasharray / stroke-dashoffset on `<path>` elements.
- Pitfall (from model evaluations): SVG `<text>` cannot be drawn progressively, and hand-written path data often does not look like letters. Fix: convert text to outline paths (a single-line handwriting font or outlined glyphs) and animate those.
- Diagrams are better built from a language the model writes well (Mermaid, then drawn as SVG) than from freehand coordinates.
- Pen cursor or hand overlay and marker colours are not documented anywhere I could open [unverified].

### Recommended tier + reason

experimental. Zero finished examples. Keep as a technique module (stroke-draw) rather than a standalone style until someone publishes a real video.

### Niche

Classroom explainers, onboarding walkthroughs (once a verified example exists).

---

## line-reveal-story

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| xiejunjie524 | GitHub (776 stars per earlier pass) | CN | https://github.com/xiejunjie524/handdraw-story-video | [unverified] | HyperFrames + GSAP + Python, Codex skill, external image model | Example "Soy milk at 4 a.m." with preview image. Skill author's own example; colour master images come from an external image model (hybrid) | opened (README) |

No second creator found. Searching for line-art-to-colour story videos in ZH returned nothing beyond this repo.

### Recipe facts

- 720x960 vertical (3:4), 30 fps, default 40 s (range 35-45 s), 7-9 scenes of about 5 s.
- Per scene: one colour master image (1K); line art extracted locally so it aligns exactly; line art reveals left to right, then low-saturation colour fills in the same direction.
- Composition: subject in the lower 45-55 percent of the frame, large paper-white negative space; each scene a different composition (no crop/zoom padding to stretch time); max 2-3 people and two background anchors per frame; avoid crowds, dense buildings, big black line masses.
- Captions: optional, max 3 lines, about 18 CJK characters per line.
- Audio: licensed BGM chosen per story; none baked in.
- Pitfalls: do not overwrite old renders (new file name each time); validate duration, duplicate assets, caption lines and font size with the built-in checker.
- Dependency: needs externally generated images, so it sits at the edge of the catalogue's code-only scope.

### Recommended tier + reason

experimental. One example, by the skill author, with images from a generative model.

### Niche

Picture-book and emotional brand shorts for vertical platforms.

---

## isometric-explainer

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| cth9191 | GitHub plugin "animate" (277 stars per skillsllm page; stars not re-checked on GitHub) | [unverified] | https://github.com/cth9191/animate | [unverified] | Claude Code skill, canvas, Playwright, ffmpeg | Isometric style folder with a 6 s 9:16 120 BPM 24 fps demo (laptop on plinth, keys rise in a wave, cursor morphs into a server blade); a dark variant demo too. Skill-author demo, not a published video | opened (STYLE.md, README) |
| iart-ai awesome-motion-skills | GitHub | [unverified] | https://github.com/iart-ai/awesome-motion-skills | n/a | skills | whiteboard/isometric pack. Supporting only | opened (earlier pass) |

Searches for Remotion or Claude Code isometric cloud or infrastructure explainers found only generic tutorials.

### Recipe facts (measured spec from the animate STYLE.md)

- Projection: 2:1 dimetric, edges slope 0.5 (26.57 degrees); x to (u, u/2), y to (-u, u/2), z to (0, -1.2247u). Every edge on an iso axis unless visibly rotating.
- Light palette: ground and faces #ffffff, edges #a4a4ac, inner/receding lines #e0e0e4, one dark accent #232327, text #5c5c64 / #9a9aa2. Dark variant: ground #101014, edge #8e8e9a, inner #34343c, accent #f4f4f6, text #b4b4be.
- Line: constant 2.0 px hairlines at 1080 wide (divide width by current zoom), round joins, same weight everywhere, colour is the only variable. No shadows, gradients, grain.
- Solids: rounded slabs with thickness (2-5 percent of object size), corner radius 5-10 percent of the long side; faces filled white and drawn back to front so nearer faces hide farther lines.
- Detail by repetition (keys, vents, ports, plates), not texture. One dark accent per frame, and it is the focus.
- Subject fills 75-80 percent of frame width; caption below in sans 46 px; mono for tags set into faces.
- Motion: every move settles on a closed-form spring (slide k 55, damp 0.72); keys rise in a diagonal wave about 0.028 s apart; stagger along the iso diagonal; camera still or slow push up to 1.05x; no shake.
- Pitfall: do not stroke inside a skewed transform (width skews); do not use non-convex outlines with the slab helper; do not add a second dark element for emphasis.

### Recommended tier + reason

experimental. One skill-author demo, no independent creator. The spec is unusually precise, so it would be a good recipe once a second example exists.

### Niche

Infrastructure, device and product-system explainers on a clean white ground, vertical or square.

---

## glitch-vfx

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| HeyGen | hyperframes.heygen.com/showcase (mp4) | US | https://static.heygen.ai/hyperframes-oss/docs/images/showcase/launch-vfx-heygen-combined-v1-s.mp4 | [unverified] | HyperFrames (shaders and effects) | "VFX reel"; source in vfx-heygen-combined. DESIGN.md I read describes an iPhone-on-studio test (#050508 ground, #d7ff3f lime CTA) with no glitch; the reel's content is not confirmed to include glitch | showcase page opened; video not viewed |
| tiw_ari_ayu | remotion.dev/prompts | global | https://remotion.dev/prompts/cinematic-tech-intro | "8 months ago" | Gemini (k2.5 per page), Remotion | Prompt only, no video. Occasional glitch via skew + hue-rotate, HUD overlays. Supporting | opened |
| Marco (ai_artworkgen) | X | [unverified] | https://x.com/ai_artworkgen/status/2049140645982261407 | [unverified] | Codex + HyperFrames plugin | Applies distortion, chromatic aberration, ripple, VHS to the author's own footage (post fetch returned HTTP 402). Effects on supplied video, not a code-made video | snippet |
| storybynumbers | GitHub | [unverified] | https://github.com/storybynumbers/remotion-glitch-effect | [unverified] | Remotion | RGB-split package: SVG filters, burst scheduler, deterministic per-frame variation. Supporting | snippet |
| OpenMontage remotion skill | claudeskills.info | [unverified] | https://claudeskills.info/skills/calesthio/openmontage/remotion/ | n/a | skill | glitch() transition with intensity, slices, rgbShift; rgbSplit() transition. Supporting | snippet |
| vc.ru guide | web | RU | https://vc.ru/ai/2872593-claude-code-i-remotion-sozdanie-video-shortsev | [unverified] | Claude Code + Remotion | Lists 11 transitions including glitch, RGB split, zoom blur, light leak, pixelate; says to give exact timings or the model improvises | snippet |

### Recipe facts

- Glitch works as bursts, not constant noise: a scheduler fires short bursts (a few frames), seeded so every render is identical.
- Techniques: RGB channel split (SVG feColorMatrix/feOffset or per-channel offset), horizontal slice displacement (scanline tearing), skew plus hue-rotate flicker, VHS noise, chromatic aberration.
- Cyberpunk-tech companion elements (cinematic-tech-intro prompt): 1920x1080 30 fps, white ground with radial noise (an inverted variant), brand green #76B900, rotating dashed rings, Matrix-style falling data, cut-corner glassmorphism HUD panel, scanner line, corner brackets, 3x to 1x pop-in title.
- Pitfalls: seeded randomness only (no Math.random mid-render); keep bursts short or legibility dies; use as an accent on cuts and reveals.

### Recommended tier + reason

experimental. No standalone finished glitch video found; everything is effects, transitions or prompts. Best kept as an accent module inside other styles.

### Niche

Gaming, crypto and hacker-themed intros, hard-cut transitions in tech promos.

---

## paper-cut-collage

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| des13 (Yisheng Technology / iChurch context) | des13.com article | TW | https://des13.com/news/ai/1734-claude-opus.html | article 2026-09-29, updated 2026-10-04 | Claude Code (page says Sonnet 5.5 in one place, Opus 5.5 in headline: conflict), HyperFrames per earlier pass | 45 s 1920x1080 30 fps, 8 scenes; real photos converted by code to paper-cut collage then watercolor then postcard/stamp; ending changed to "the city changed, the buildings changed" | opened |
| cth9191 | GitHub plugin "animate" | [unverified] | https://github.com/cth9191/animate | [unverified] | Claude Code skill, canvas, ffmpeg, synthesized score | Example "history-of-ai": 60 s cut-paper piece, 15 eras, 13 shape-morph transitions, one hard cut on the payoff. Rendered by building the example; no published mp4 link | opened |
| tmoody1973 "pasteup" | GitHub plugin | [unverified] | https://github.com/tmoody1973/pasteup | last commit 2026-07-07 | Claude Code + Gemini image API + local compositor | "A tiny history of jazz": 7 scenes, about 30 s, halftone paper-collage stop-motion; mp4 in repo at docs/jazz-history-demo.mp4. Hybrid (cut-outs from Gemini) | opened (via claudepluginhub listing) |
| hassancs91 | GitHub | [unverified] | https://github.com/hassancs91/claude-faceless-shorts-creator | created 2026-07-15 | Claude Code + Remotion + Gemini images | "vox-1-coffee" Vox-style paper-collage short; rendered videos are not committed, layers are AI images. Counted as supporting | opened |
| bangtutorial bang-motion | GitHub | [unverified] | https://github.com/bangtutorial/bang-motion | n/a | skill | cartoon collage direction. Supporting | opened (earlier pass) |
| HyperFrames registry | GitHub | US | https://github.com/heygen-com/hyperframes/tree/main/registry | n/a | HyperFrames | torn-paper-rip, paper-collage-reveal components. Supporting | opened (earlier pass) |
| rneayan | X via prompt-motion | [unverified] | https://prompt-motion.com/rneayan-474bcf | 2026-09-25 | Opus 5.5 one-shot | "Risograph studio intro", prompt "make about my studio with Risograph style", tags Diagrams / Kinetic type. Adjacent print look, not paper-cut | opened (page); X: https://x.com/rneayan/status/2103401006281441493 |

### Recipe facts

Cut-paper (animate STYLE.md):
- Palette on cream: ink #2a1d18, paper #fbf6ea, cream #f3ead6, navy #26315f, wood #c08048, mustard #d9a441, yellow #f6cf55, teal #3f9f9a, mint #a9d9c6, pink #f3a3bf, sky #cfe2ee, purple #8c7ad8, blue #4c6fb5, green #5aa05a; one reserved hero accent orange #ec7a4f; blank-paper morph ground #efe5cf.
- Every shape is torn paper: wobbly torn edge, soft drop shadow, paper grain, optional crayon scribble, patterns (stripes, dots, gingham, wood grain) clipped inside.
- Motion on 2s (everything keys on floor(frame/2)): boil, camera, moves; pops for arrivals; write-on hand lettering; chronologies joined by shape morphs on blank paper (never blend two wall colours: mud); character beats cut hard on the beat.
- Frame checklist: a character with a face acting; a full-bleed coloured world per scene; at least one pattern; 3+ background-life details; text on hand-lettered paper tags, never bare type.
- Pitfall: do not fade textured props with globalAlpha (texture resets it); skip them instead.
- Aspect ratios 9:16, 1:1, 4:5, 16:9, laid out per format. Typical length 8-60 s. Audio: synthesized score or user track, cuts on the beat grid, silence before payoff.

Vox-style collage (hassancs91 DESIGN.md):
- Cream/kraft paper backdrop with film grain and vignette, never pure black or white; die-cut subjects with white sticker edge and soft shadow; layers enter staggered (slide, pop with overshoot, rise, mask-wipe) then keep drifting; one oversized board with a camera that pushes and pans, layers have depth for parallax.
- Annotation grammar: slightly rotated white label chips, marker-highlight sweeps, hand-drawn arrows that draw on, dashed routes over maps; editorial serif headlines (Source Serif 4 weight 700); cream backing strips behind any text over busy layers.

Stop-motion jitter (pasteup): one flat bold colour field with black-and-white halftone cut-outs, clean edges, soft shadows; pieces slide in from edges on a stepped cadence, label text arrives last; hold_frames 2 (smooth) or 3 (chunky), jitter in px and degrees, seeded.

des13 church video: real photo, then paper-cut collage, then watercolor, then postcard/stamp; sources logged (Wikimedia Commons), unclear-licence images converted to illustration; first version 27 min plus revisions.

### Recommended tier + reason

core (conditional). There are now two independent finished pieces that are made by agents writing code (des13 and cth9191's history-of-ai), plus a third hybrid (pasteup). Caveats: I did not watch a rendered mp4 for des13 or cth9191, and cth9191's piece is the skill author's showcase. If the owner wants a stricter bar (viewed render, independent creator), treat as experimental until a viewed render is confirmed.

### Niche

Cultural, heritage and history stories; handmade-brand tone; chronologies with shape-morph transitions.

---

## audiogram-visualizer

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| Remotion | remotion.dev template | global | https://www.remotion.dev/templates/audiogram | n/a | Remotion | Official template; page gives only a one-line description; install via `npx create-video@latest --audiogram`. Supporting only | opened |
| iart-ai | skills.sh | [unverified] | https://www.skills.sh/iart-ai/youtube-video-skills/audiogram | n/a | skill | Audiogram skill pack. Supporting only | snippet |
| Rneayan_Official | X via prompt-motion | [unverified] | https://prompt-motion.com/rneayan-ea6129 | 2026-09-25 | Opus 5.5 (tool not stated) | "Oscilloscope-style studio motion graphic"; prompt "Make Motiongraphic about my studio with Oscilloscope style"; tags Charts, Kinetic type. Waveform-adjacent look; length, palette, audio not given. Source: https://x.com/rneayan/status/2103401461837406275 | opened (page) |
| tankazunori0914, ddryo_loos | X via prompt-motion | JP | https://prompt-motion.com/tankazunori0914-0fc886 | 2026-10-02 | HyperFrames, Opus 5.5 | 30 s kinetic-type motion graphic with BGM synthesized/selected; music-led but not a visualizer | opened (page) |
| HyperFrames official showcase "Music to video" | mp4 | US | https://static.heygen.ai/hyperframes-oss/docs/images/showcase/launch-music-to-video-launch-v1-s.mp4 | [unverified] | HyperFrames | Cuts synced to a track; page does not say it has a waveform. Supporting | showcase page opened; video not viewed |

No finished agent-made podcast audiogram or music visualiser was found (EN and JA; ZH and KO queries returned nothing relevant).

### Recipe facts (technique sources)

- Remotion APIs: `visualizeAudio()` returns spectrum bars for the current frame; `visualizeAudioWaveform()` for waveforms; `useAudioData()` loads whole file in memory; `useWindowedAudioData()` loads a window around the frame (WAV only).
- Pitfall: drive every bar from the current frame, never from a real-time analyser loop; the renderer paints frames out of order and faster or slower than real time.
- Long audio: downsample or use windowed data; one blogger switched to Remotion after a different waveform tool needed 2+ hours for a 20-minute podcast (mac) [unverified].
- Podcast clip anatomy (generic audiogram guidance): cover art or speaker photo, animated bars or waveform, word-synced captions, 1:1 or 9:16.
- Beat-driven alternatives: HyperFrames /music-to-video skill ("the music drives all pacing"); howseen-ai claude-motion-design finds the real drop by band energy and aligns the key visual to it.

### Recommended tier + reason

experimental. Zero finished agent-made examples; evidence is an official template and API docs.

### Niche

Podcast clips and music releases (vertical or square).

---

## abstract-generative-loop

### Evidence

| creator | platform | region | URL | date | tool | note | verified |
|---|---|---|---|---|---|---|---|
| AI Xiaoji (article author; case creator not named) | ai-bot.cn | CN | https://ai-bot.cn/claude-opus-5-5-video-tutorial/ | "4 days ago" at fetch; no date [unverified] | Claude Opus 5.5, numpy, Playwright, ffmpeg | UI shape-morph loop, 1:1 1440x1440, 120 BPM, 7 bars (about 14 s by my arithmetic, not stated in the source), last frame must equal first including cursor position and velocity | opened |
| argbeknwn | X via skillry | [unverified] | https://skillry.dev/ai-videos/opus-5-5/argbeknwn-466818 | not listed | Remotion | 15 s wordless abstract piece on the creator's personal style; loop status unknown | aggregator |
| hassancs91 | GitHub | [unverified] | https://github.com/hassancs91/claude-faceless-shorts-creator | created 2026-07-15 | Remotion | 12 TSX shorts with seamless frame-0 equals last-frame loops (not abstract: chess, math, etc.). Supporting on loop technique only | opened |
| howseen-ai | GitHub | [unverified] | https://github.com/howseen-ai/claude-motion-design | created 2026-09-27 | Claude Code skill, HTML + Playwright + ffmpeg | Skill has loop seam check (position and velocity) and a "LinkedIn loops" prompt; the shipped example is a 24 s launch video, not a loop. Supporting | opened |
| prompt-motion tags | gallery | global | https://prompt-motion.com | n/a | various | "Shapes" 44 and "Particles" 43 tag counts; individual entries not mapped to loops | opened |

### Recipe facts

- Format: square 1440x1440 for the UI-morph loop; 120 BPM; every beat carries an action; one bar equals four beats (assumed 4/4, source does not state it).
- Palette (UI-morph case): light warm grey canvas, black and white UI elements, an optional single accent left undecided; font Geist.
- State order: button, loader, checkmark, Dynamic Island, music player, scrubber, volume slider, toggle, liquid tab indicator, chart, command-K palette, filter, enter, toast, back to button.
- Loop discipline: last frame equals first, including cursor position and velocity (otherwise it stutters); check the seam in both position and velocity; shared-element hand-offs between states.
- Rendering: compute every frame from time, render frame by frame, optional sub-frame motion blur blended with ffmpeg tmix on a 180 degree shutter (never across a hard cut), BT.709 encode.
- Short-form loop grammar (hassancs91): frame 0 is the thumbnail, ending loops back into the intro, no engagement-CTA outro.
- Pitfalls: seeded randomness only; particle systems must be deterministic per frame; do not rely on a real-time clock.

### Recommended tier + reason

experimental. One opened case with unnamed creator and one aggregator listing that is not confirmed as a loop. Strong technique documentation, thin finished evidence.

### Niche

Website hero backgrounds, ambient loops, music visuals, UI-morph product teasers.

---

## Source notes for the editor

- GitHub star counts and creation dates above come from the GitHub search API run on 2026-10-10 unless marked otherwise; the 277-star figure for cth9191/animate comes from the skillsllm.com page, not the API.
- prompt-motion.com URLs are relative to https://prompt-motion.com; skillry URLs relative to https://skillry.dev.
- X pages could not be fetched (HTTP 402); tweet URLs are taken from prompt-motion pages.
- Region tags marked [unverified] where the creator's location is not stated on any opened page.
