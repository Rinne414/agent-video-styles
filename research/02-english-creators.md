# 02 - English-language creators and KOLs: agent-written code-to-video

Scope: videos produced by AI coding agents writing code (Remotion, HyperFrames, Manim, Three.js, etc.). Research date 2026-10-10. Sources were opened with a page-summarizing fetch tool (not a raw browser), so visual descriptions are second-hand text, not frames I watched. X posts were NOT opened directly; X URLs below come from aggregator pages (skillry.dev, startuphub.ai) that cite them. Dates are given only where a page stated them; otherwise "not stated". No view counts were verified except where marked as secondhand.

Naming caveat: the skillry.dev collection and some pages refer to "Opus 5.5", "Fable 5.1", "Gemini 3.8 Flash", "GPT Image 2.5", "Seedance 2.5" as read on those pages; I report them as written.

---

## Styles observed

### S1. Dark SaaS Kinetic Promo
- Visual signature: near-black or navy background, one saturated brand accent, big kinetic sans-serif headlines punching in on beat, mock UI cards/browser windows sliding in, glow and particle accents, 15-60 s, mostly 16:9 1080p at 30 or 60 fps.
- Typical use: app/SaaS/extension launch teasers, "Product Hunt" videos, link-in-bio tool promos.
- Tools: Remotion (dominant), HyperFrames; GSAP, SVG, Canvas, CSS; ElevenLabs / Gemini TTS or code-synthesized music (Python).
- Evidence (all independent creators/projects):

| Creator | Platform | URL | Date | Tool | Workflow note |
|---|---|---|---|---|---|
| @EnvolDev (TopSlash launch, 0:57) | X | https://x.com/EnvolDev/status/2107547689819017555 (via skillry) | not stated | Opus 5.5 + Remotion | "no video editor, only code"; Canvas/SVG/GSAP/CSS |
| @apoorvjain25 (Synclify promo, 0:30) | X | https://skillry.dev/ai-videos/opus-5-5 (slug apoorvjain25-150112) | not stated | Remotion | needed multiple prompts |
| @SaadPastaDev (Nafa marketing, 0:25) | X | same listing (saadpastadev-347341) | not stated | Remotion | SVG/GSAP/CSS |
| @nehalmax ("lernok" teaser, 0:32) | X | same listing (nehalmax-802479) | not stated | Opus 5.5 + Remotion | |
| @allodev (@futurepost extension, 0:25) | X | same listing (allodev-069765) | not stated | Opus 5.5 + Remotion | |
| @xenit_v0 (scroll+, 0:28) | X | same listing (xenit-v0-532873) | not stated | Remotion | Turkish |
| @0xRapzz (0:45) | X | same listing (0xrapzz-433554) | not stated | "Remotion Opus 5.5" | |
| @ideavim (IdeaVim promo, 0:30) | X | same listing (ideavim-986785) | not stated | HyperFrames skill | SVG |
| Mike Codeur (YouThumb.ai, 30 s) | blog | https://blog.mikecodeur.com/en/post/remotion-claude-code-video-product-hunt | 2026-03-03 | Claude Code + Remotion skills | prompt "Style moderne, animations fluides, 30 secondes"; short conversational edits (transition, logo, brand colors); full process video https://mkc.sh/claude-code-video-ph |
| @__Talley__ (Polymarket promo) | X | https://twitter.com/__Talley__/status/2014033357630263518 (via startuphub) | 2026-01-21 | Claude Code + Remotion | ~30 min, 4-5 prompts |
| @musharrafff (product video) | X | https://twitter.com/musharrafff/status/2013935012983582830 (via startuphub) | 2026-01-21 | Remotion | under 1 h |
| Sabrina Ramonov prompt #2 (product URL to launch ad) | Substack | https://www.sabrina.dev/p/5-insane-claude-code-video-prompts | not stated | Claude Code + Remotion + Claude in Chrome MCP | dark bg with brand-color glow, cursor-driven mock UI, particle burst |
| Hamzah Haroon (Framer template promo, from site link only) | Framer community | https://www.framer.com/community/posts/6MXzrvjuePcrnhZnA1DfuV/ | not stated | Claude Code + Remotion | page body empty; claim comes from a search snippet [unverified] |

Independent example count: 12 (the Framer one weakly supported).

### S2. Cinematic HUD / Glow Tech Reel
- Visual signature: "fast, premium, smooth" - motion blur, glow, camera-hit cuts, HUD overlays, terminal UI, neural/particle visuals, kinetic type, logo finale; sound design synthesized in code and synced to hits; 60 fps.
- Typical use: creator/brand reels, personal-brand intros, "can Opus beat a motion designer" showpieces.
- Evidence:

| Creator | Platform | URL | Date | Tool | Workflow note |
|---|---|---|---|---|---|
| @humzaakhalid ("AI In Public" reel, 0:24) | X | https://x.com/humzaakhalid/status/2106640261623537875 (via https://skillry.dev/ai-videos/opus-5-5/humzaakhalid-537875) | not stated | Opus 5.5 Max effort + Remotion, 1920x1080 60fps | prompt specifies palette #3D40FE/white/navy/ice, "every frame and sound written in code"; full guide http://ai-in-public.guide [not opened] |
| @tankazunori0914 (0:30, "cool motion graphics with BGM") | X | skillry listing slug tankazunori0914-156748 | not stated | HyperFrames, Python BGM | ~11 min incl. 1:36 export; prompt in Japanese asked "what weekday is it" as a motion graphic |
| @SmitJainEditor ("Are Motion Designers Cooked?", 0:40) | X | skillry listing slug smitjaineditor-843957 | not stated | Opus 5.5 (Medium) + Remotion | |
| @Dheepanratnam (0:58) | X | https://x.com/Dheepanratnam/status/2107568904075706454 | not stated | Opus 5.5 + HyperFrames + GSAP, Python music | score and SFX synced by agent; hand-graded artwork in DaVinci Resolve |
| @justinbuilds (0:23) | X | skillry listing slug justinbuilds-412401 | not stated | HyperFrames Studio, one shot, ElevenLabs voice | |
| @kzmucx (0:24) | X | skillry listing slug kzmucx-402052 | not stated | HyperFrames Studio, one-shot | |

Independent example count: 6.

### S3. Procedural 3D Logo / Scene Sting (Three.js + GLSL)
- Visual signature: abstract or fictional-brand 3D reveal rendered via Three.js/GLSL shaders, short (15-40 s), often wordless, driven by a "show me your own style" prompt.
- Evidence:

| Creator | Platform | URL | Date | Tool | Workflow note |
|---|---|---|---|---|---|
| @arumii_movie (2 videos: fictional game-console power-on logo 0:25; fictional company logo 0:15) | X | https://x.com/arumii_movie/status/2107790132061622720 | not stated | Opus 5.5 + HyperFrames, Three.js, GLSL | counts as one creator |
| @argbeknwn (0:15, no words) | X | skillry slug argbeknwn-466818 | not stated | Opus 5.5 + Remotion | prompt: "Show me what's inside your mind. Your own artistic and unique style. 15 seconds. No words. Music." |
| @DengenT (Cardilife 1.3, 0:56, 3D opening) | X | https://x.com/DengenT/status/2107425308773412996 | not stated | Claude Code, Remotion 4 + React 19 + R3F/@remotion/three, Python stdlib music, 1920x1080 30 fps | JA and EN versions exported from one codebase via props |
| @aijipusi75693 (festival opening, 0:40) | X | skillry slug aijipusi75693-284735 | not stated | Opus 5.5, Remotion + Three.js, Suno song | |
| @colecornelll (4 videos for @Shillz_Official in 3 days, 0:15) | X | skillry slug colecornelll-047465 | not stated | Opus 5.5, Remotion, three.js, Python music | |
| @mattworkman (0:30) | X | skillry slug mattworkman-309357 | not stated | HyperFrames; also uses fal image/video models (hybrid, partly out of scope) | |
| @LeowenAI (model teaser, 0:25) | X | skillry slug leowenai-125931 | not stated | Remotion, GLSL, Python music | |
| HeyGen "VFX reel" / "Texture launch" (official) | web | https://hyperframes.heygen.com/showcase | not stated | HyperFrames | shaders/effects, motion design with texture |

Independent example count: 8.

### S4. Animated Data-Story / Chart Video
- Visual signature: charts, counters and rank lists animating over time (bars growing, line charts, donut segments, count-ups), clean chart-first layout, often dark background with glass panels or a single glowing line.
- Evidence:

| Creator | Platform | URL | Date | Tool | Workflow note |
|---|---|---|---|---|---|
| Will Larson (lethain) | blog | https://lethain.com/blog-recap-2026/ | not stated (2026) | Claude Code + Remotion | Claude wrote scripts to build a dataset from his blog; posts-over-time, tags-over-time timelines; under 10 min total; prompts not published |
| Bruce (heyuan110.com), 2025 Douyin Top-10 chart video | blog | https://www.heyuan110.com/posts/ai/2026-01-26-claude-code-remotion-video/ | 2026-01-26 (URL) | Claude Code, remotion-best-practices + media-download skills | one session ~7 min; red/cyan palette, animated gradient bg + floating light particles, spring rank badges, typewriter titles, particle burst for #1, simulated waveforms; Pexels bg clips, iTunes previews |
| Sabrina Ramonov prompt #5 (CSV to dashboard, 15 s) | Substack | https://www.sabrina.dev/p/5-insane-claude-code-video-prompts | not stated | Claude Code + Remotion | #0a0a0a, glass panels, indigo-violet bars, KPI card + bar + donut + line |
| Danny (dannywhy.com link) wealth-distribution chart | YouTube (via summary) | https://videohighlight.com/v/idVMGLzrrnU | not stated | Claude Code (VS Code) + Remotion | prompt: "use the remotion skill to generate a video where a chart rises from 0% to 78% with smooth animation and glow effect"; simple prompts gave cluttered output |
| HeyGen "SpaceX explainer" (official) | web | https://hyperframes.heygen.com/showcase ; source https://github.com/heygen-com/hyperframes-launches/tree/main/spacex-launch | not stated | HyperFrames | "data and motion at scale" |
| @liu8in (GitHub-trending celebration, 0:17) | X | skillry slug liu8in-891423 | not stated | HyperFrames, one prompt + skills | |

Independent example count: 6.

### S5. Dark Faceless Explainer ("Kurzgesagt meets Fireship")
- Visual signature: dark bg, white Inter type, indigo/green accents, SVG-built diagrams, narration + captions, 30-60 s, often vertical 1080x1920 or 16:9; agent researches, scripts, animates.
- Evidence:

| Creator | Platform | URL | Date | Tool | Workflow note |
|---|---|---|---|---|---|
| Sabrina Ramonov prompt #1 (30 s, 1080x1920) | Substack | https://www.sabrina.dev/p/5-insane-claude-code-video-prompts | not stated | Claude Code + Remotion | #0a0a0a, #6366f1, #22c55e, Inter; pacing described "Kurzgesagt meets Fireship" |
| andynocode (Mars explainer) | YouTube (via summary) | https://videohighlight.com/v/xAUifztpib8 | not stated | Claude Code + Remotion + ElevenLabs SDK | 9-phase pipeline (see Workflows); clean modern motion graphics |
| punit (@punitpalial) | X | https://twitter.com/punitpalial/status/2014271129020739657 (via startuphub) | 2026-01-22 | Claude Code + Remotion | under 1 h; Claude generated voiceover and pulled web assets |
| @tetsu_tetsu333 (SEO tool, 0:52) | X | skillry slug tetsu-tetsu333-576886 | not stated | Opus 5.5 + Gemini TTS, Remotion | Japanese |
| @AylmerTH (0:50) | X | skillry slug aylmerth-356252 | not stated | Opus 5.5 + Remotion | from a two-sentence prompt |
| @FalconG_J (0:30) | X | skillry slug falcong-j-277506 | not stated | Remotion | first attempt 10 min 33 s |
| @0xlangeai (CLIProxyAPI article promo, 0:57) | X | skillry slug 0xlangeai-597929 | not stated | Remotion | Chinese |
| @xamfonos_ (0:45) | X | skillry slug xamfonos-004331 | not stated | Remotion | |
| HeyGen /faceless-explainer skill (official) | GitHub | https://github.com/heygen-com/hyperframes | not stated | HyperFrames | topic to research, script, narration, captions |

Independent example count: 9.

### S6. Math-Explainer Manim ("3Blue1Brown tribute")
- Visual signature: #1c1c1c dark bg, blue #3b82f6 + gold #fbbf24 accents, geometry before algebra, opacity layering (primary 1.0, context ~0.4, grid ~0.15), `wait()` after every reveal (~2 s on key reveals).
- Evidence (mostly tools/skills rather than named video creators - weak on shown videos):

| Creator/project | Platform | URL | Date | Tool | Workflow note |
|---|---|---|---|---|---|
| NousResearch hermes-agent `manim-video` skill | GitHub / skills.sh | https://www.skills.sh/nousresearch/hermes-agent/manim-video | first seen 2026-04-06 | Manim CE | PLAN-CODE-RENDER-STITCH-AUDIO-REVIEW pipeline |
| subinium `3b1b-style-animation-skill` | GitHub (via jsDelivr README) | https://cdn.jsdelivr.net/gh/subinium/3b1b-style-animation-skill@main/README.md | not stated | Claude Code + Manim | MIT; 40+ rule files |
| TheoremExplainAgent (TIGER-AI-Lab) | GitHub / paper | https://github.com/isichan0501/TheoremExplainAgent (fork seen in search) | not stated | LLM agents + Manim + Kokoro TTS | research system, MIT per search snippet |
| manim-mcp (paulnegz) | GitHub | https://cdn.jsdelivr.net/gh/paulnegz/manim-mcp@main/README.md | not stated | manimgl + multi-agent + TTS | |
| Manimator (arXiv 2507.14306) | arXiv | https://arxiv.org/html/2507.14306v1 | 2025-07 (ID) | LLM planner + code model | |

Independent example count: 5 projects, 0 confirmed published finished videos by named English creators (gap).

### S7. Apple-Style Clean Product Motion
- Visual signature: restrained Apple-like typography, soft glow, adjustable stroke/glow, product-led, website-to-animation.
- Evidence: Maciej Dziuba (MM Editing) YouTube demo of Claude Code + HyperFrames incl. apple.com website-to-animation (https://videohighlight.com/v/Xwa5x0jJI0Y; he says early outputs were too static, HyperFrames looks better than Remotion); HeyGen `heygen-apple-motion` re-brandable launch templates x4 (https://github.com/heygen-com/hyperframes-launches); Skillry "Notion Style / Cue Style / Manus 2.0 Style Launch Video" skills (https://www.skillry.dev/skills?output=video, descriptions not shown).
- Independent example count: 2 clear (Dziuba, HeyGen), 3 skill listings.

### S8. Talking-Head Overlay Package
- Visual signature: original footage untouched; dark gradient over top ~40%, glass-morphism badges, step numbers, progress bars, captions, lower thirds synced to word timestamps.
- Evidence: Sabrina Ramonov prompt #4 (Whisper timestamps) https://www.sabrina.dev/p/5-insane-claude-code-video-prompts; Rescroll walkthrough of a counter overlay (white count-up number, no brand) https://www.rescroll.ai/blog/claude-code-remotion-motion-graphics-2026; Dziuba lower thirds and captions; HeyGen `/talking-head-recut` and `/embedded-captions` skills (https://github.com/heygen-com/hyperframes); @rishit30g Claude Code mascot (skillry slug rishit30g-568278).
- Independent example count: 4.

### S9. Brand-Token Storyboard Launch (HOOK-DEFINE-NAME-SCALE-PROOF-CTA)
- Visual signature: brand tokens drive a display + humanist-sans pairing, shared easing curve, spring text, scene-by-scene storyboard, responsive 16:9 and 9:16 from one scene file, 4K render.
- Evidence: Andrii Yeshchenko, Planting Habits / Tree-Nation launch video (LinkedIn, ~"4 months ago" relative) https://es.linkedin.com/in/yeshchenko; Mike Codeur YouThumb.ai (also in S1); Aident AI / Jennifer Aio Codex + Remotion 6 s, 1920x1080, 30 fps spec (midnight bg, white type, blue + coral accent) https://aident.ai/blog/create-product-launch-video-codex-remotion (template contract, not a published finished film); Creativly.ai brand video (17 scenes, 13 transitions, 12,000+ lines React; repo listing seen only in a search snippet, not opened) [unverified].
- Independent example count: 3 confirmed + 1 unverified.

### S10. Minimal Night Mode (glass cards, slow counts)
- Visual signature: #0F1115 bg, #F5F7FA text, #4C8DFF blue + #9AE6B4 green, glass-like cards, slow number counts, soft fades.
- Evidence: @MakeAI_CEO guide (https://youmind.com/it-IT/landing/x-viral-articles/claude-code-hyperframes-video-guide; setup thread https://x.com/MakeAI_CEO/status/2027682940847898770) - this is an example style paragraph, not a shown video. HeyGen design-template library (Biennale Yellow, BlockFrame, Cobalt Grid, Bold Poster, etc., names only) https://hyperframes.dev/design [not opened].
- Independent example count: 1-2, weak.

### S11. Parody / Meme Launch
- @MaxHirsch13 parody launch video about LinkedIn (0:20, Remotion; skillry slug maxhirsch13-600983); @Alex_Leiro (0:34, CSS); @asei_ikarashi fictional company and figures (0:15). Count: 2-3, weak and not described visually.

---

## Creators

| Creator | Platform | Makes | Tools | Workflow |
|---|---|---|---|---|
| Remotion team (Jonny Burger) | X, docs, GitHub | official Agent Skills (Jan 2026); demo animation reported 6M+ views (secondhand, startuphub) | Remotion | https://www.remotion.dev/docs/ai/coding-agents: `npx create-video --yes --blank my-video`, `npx remotion skills add`, `npm run dev`, then run claude/codex/kimi/opencode |
| HeyGen / James Russo (HyperFrames tech lead) | AI Engineer World's Fair 2026, GitHub, site | official launch films, showcase, AI Engineer World's Fair showcase video | HyperFrames | https://ai.engineer/talks/html-is-all-agents-need (talk https://www.youtube.com/watch?v=Cz4v1WHVyZc); claims 1.3M videos rendered in 90 days (talk's own claim) |
| Sabrina Ramonov | Substack | five reusable video prompts with exact hex palettes | Claude Code, Remotion, Playwright, Whisper | https://www.sabrina.dev/p/5-insane-claude-code-video-prompts |
| @MakeAI_CEO | X | HyperFrames how-to guide (Japanese original) | Claude Code, HyperFrames | DESIGN.md + FRAME.md brand rules |
| Maciej Dziuba (MM Editing, @mm_editing) | YouTube | Claude Code + HyperFrames editor demo | Claude Code, HyperFrames Studio | incremental prompts, git worktrees for parallel animations, screenshot feedback |
| andynocode | YouTube | Mars explainer | Claude Code, Remotion, ElevenLabs | 9-phase pipeline |
| Danny (dannywhy.com) | YouTube | beginner chart motion graphic | Claude Code in VS Code, Remotion | |
| Will Larson (lethain) | blog | blog-data timeline videos | Claude Code, Remotion | |
| Mike Codeur | blog + video | Product Hunt video | Claude Code, Remotion | |
| Andrii Yeshchenko | LinkedIn | Tree-Nation launch video | Claude Code, Remotion | |
| @humzaakhalid, @DengenT, @arumii_movie, @Dheepanratnam, @tankazunori0914, @EnvolDev, etc. | X | see S1-S3 | Opus 5.5 + Remotion/HyperFrames | one-shot or few-prompt |
| @__Talley__, @musharrafff, @punitpalial | X | Jan 2026 early viral demos | Claude Code + Remotion | via startuphub; X pages not opened |
| Skillry (@skillry_dev) | web, X | remakes of viral prompts, video skills index | HyperFrames/Remotion | https://skillry.dev/ai-videos/opus-5-5 (aggregator; some skills premium $9.99/month) |
| Nous Research (hermes-agent) | GitHub | manim-video skill | Manim CE | |

Most influential (by evidence of reach, with caveats): Remotion (official Agent Skills; 5.0k stars on remotion-dev/skills, near-30K weekly installs and 25K+ installs claims are secondhand), HeyGen/HyperFrames (59.7k GitHub stars on the repo page I opened; talk says 32,000 earlier), Sabrina Ramonov, @__Talley__ and the January 2026 wave, then the Skillry-indexed Opus 5.5 X wave.

---

## Notable workflows and techniques

1. Skill install then prompt: `npx skills add remotion-dev/skills` (older) / `npx remotion skills add` (current docs); HyperFrames: `claude plugin marketplace add heygen-com/hyperframes`, `npx skills add heygen-com/hyperframes`, `npx hyperframes init|preview|render`. Slash skills: /hyperframes router, /product-launch-video, /faceless-explainer, /pr-to-video, /embedded-captions, /talking-head-recut, /motion-graphics, /music-to-video, /slideshow, /remotion-to-hyperframes. (https://github.com/heygen-com/hyperframes)
2. Brand lock files: DESIGN.md (from live site CSS) + FRAME.md (motion rules) in HyperFrames (@MakeAI_CEO).
3. Art direction + asset inventory files before code (andynocode); generate scenes one at a time for easy debugging.
4. Launch contract and determinism rules (Aident): fixed scene timings, safe margins 80 px, no Date.now/Math.random/CSS transitions, all motion from the frame clock.
5. Storyboard to still-frame checks: iterate by rendering stills (Yeshchenko); Studio screenshots as feedback (Dziuba); responsive scene components for 16:9 and 9:16.
6. Audio in code: Python stdlib music (@DengenT), Python BGM (@tankazunori0914, @Dheepanratnam), Suno, ElevenLabs, Gemini TTS; one codebase two languages via props.
7. Parallelism: Claude Code git worktrees for several animations at once (Dziuba).
8. Reference replication: HyperFrames showcase "recreate any video 1:1" (THE OBLIST 38.58 s at 60 fps; Srinika x Mercury with avatar footage).
9. Website or PR to video: URL as prompt (Framer claim, Sabrina #2, /pr-to-video, /website-to-video).
10. Known failure modes: simple prompts give cluttered or static output (Danny, Dziuba); overlay placement ignores speaker face (Rescroll); sound design weak (@saxxyweb3); PowerShell execution policy blocks install on Windows (Danny); Remotion paid license above a team-size threshold (Rescroll, mentions $25/seat/month, secondhand) vs HyperFrames Apache 2.0.

---

## Public resources (prompts, skills, repos, templates)

| Resource | URL | License |
|---|---|---|
| remotion-dev/skills (12 skill files: create, markup, studio, render, captions, maps, saas, interactivity, docs, upgrade, multimedia) | https://github.com/remotion-dev/skills | not shown on page |
| Remotion framework | https://github.com/remotion-dev/remotion | custom Remotion license (company-use paid tier; terms at remotion.pro/license, not opened) |
| heygen-com/hyperframes (21 skills, CLI) | https://github.com/heygen-com/hyperframes | Apache-2.0 |
| heygen-com/hyperframes-launches (20 launch films as editable compositions: HeyGen x Stripe, Claude paper launch, Codex five-hour-limit replica, Kimi K3 promo, SpaceX, Texture, Liquid brand refraction, etc.) | https://github.com/heygen-com/hyperframes-launches | Apache-2.0 code; bundled media, fonts, brand assets excluded |
| HyperFrames showcase / design / catalog | https://hyperframes.heygen.com/showcase , https://hyperframes.dev/design | not stated |
| subinium/3b1b-style-animation-skill | https://cdn.jsdelivr.net/gh/subinium/3b1b-style-animation-skill@main/README.md | MIT |
| NousResearch hermes-agent manim-video | https://github.com/nousresearch/hermes-agent | not stated on page |
| TheoremExplainAgent | https://github.com/isichan0501/TheoremExplainAgent (fork) | MIT per search snippet |
| manim-mcp | https://cdn.jsdelivr.net/gh/paulnegz/manim-mcp@main/README.md | not checked |
| Sabrina Ramonov 5 prompts | https://www.sabrina.dev/p/5-insane-claude-code-video-prompts | prompts shown publicly; license not stated |
| Skillry video skills (CreatorMotion series, Manus 2.0 / Cue / Notion style, Pixel Promo) | https://www.skillry.dev/skills?output=video | mostly "not listed"; one marked Free; premium tier $9.99/month - public page only, not obtained |
| Aident Loadout (Remotion render action) | https://loadout.aident.ai/ | commercial |

Public prompt examples: "use the remotion skill to generate a video where a chart rises from 0% to 78% with smooth animation and glow effect" (Danny); "Show me what's inside your mind. Your own artistic and unique style. 15 seconds. No words. Music." (@argbeknwn); "Keep it fast, premium, and smooth with motion blur, glow, camera hits, HUD details" (@humzaakhalid).

---

## Gaps / could not verify

- No X post, YouTube page, Reddit thread or Hacker News thread was opened directly; X details are from aggregators (skillry.dev, startuphub.ai). Two Reddit-targeted searches returned no Reddit threads, and the HN search returned none.
- View counts: "13M views in a week" (rescroll) and "6M+ views" for Remotion's demo (startuphub) are secondhand and unverified. The "one prompt launch video" viral tweet (Medium write-up, page returned 403) could not be traced to a handle.
- Claim that Anthropic's own marketing team makes daily Remotion videos: not confirmed by any source (mejba.me states it found no case study). No official Anthropic Remotion video found.
- Dates are missing for most Skillry-indexed videos; I did not decode X snowflake IDs.
- Visual descriptions for most S1-S3 items are only tags (Canvas/SVG/GSAP) from skillry; I did not watch the videos or frames.
- Few Manim-with-agent finished videos by named English creators found; Motion Canvas / Revideo agent examples found only as tools (Revideo, Midrender, Patrick Rathje's Gradio agent), no creator videos. Lottie and FFmpeg-centric agent videos were not covered.
- Creativly.ai repo, LinkedIn "Shubham Saboo" and "Charlie Clark" claims (from startuphub) were not opened.
- Skillry status: some entries mix in generative models (fal, Seedance for @mattworkman; Midjourney character for @ayumi_t820) - hybrid, partly out of scope.
- Count inflation risk: Skillry lists 40 of 513 Opus 5.5 videos; I only used the 40 listed rows.
