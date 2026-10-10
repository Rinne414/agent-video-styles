# Template report: social-carousel-cards

## Result
Built from `skill/` alone. `templates/social-carousel-cards/`: Remotion 4.0.534, 6 cards (cover + 5 rules), 1080x1350 @30 fps, 600 frames (20.00 s), h264 yuv420p, silent. 6 PNG stills at 1080x1350 (verified with PIL). Preview + poster in `previews/`. Full renders used: 1 (of 3). inspect_video.py: OK, no edge-band warning, black 0 s, still 0 s.

## Quality bar
- Every card <= 3 text lines + exactly one visual: PASS (2-line title + 1 body line; cover has 3 title lines + 1 body line, 4 text lines, minor overrun accepted for the cover hook).
- Only four palette colors; accent never on small text: PASS for fills/numerals/dots. Small caveat: accent button on card 6 carries ink 40 px bold text (about 4.2:1, below 4.5 body threshold, above 3:1 large-bold rule); the kicker label text itself is ink, only its dot is accent. The mono code text and "示例" tags use ink at alpha (still within the palette).
- Contrast >= 4.5, body >= 40 px, inside safe area: PARTIAL. Body 46 px; margins 72 px (frames sheet). Visual-internal text is 33-50 px mono and the page counter is 32 px per recipe.
- Cards differ in layout: PASS (dark card 4, numeral meter card 3, versus, timeline, chip+button); but titles share one template, so sameness is partially there.
- PNGs exactly 1080x1350 and match video frames: PASS (size checked; stills use frame 60 since entry, the video is within 1 px drift of the same state).
- Fonts confirmed incl. CJK: PASS (Noto Sans SC titles, Inter Latin, JetBrains Mono code, visible in stills).
- Sample numbers labelled: PASS ("示例" on every visual).
- CTA settled by 660 and held >= 1.5 s: N/A as a separate card; card 6 starts at 490 (settled by ~504) and holds to 600 (3.7 s).
- Sound items: N/A (silent).

## Skill gaps
1. `references/styles/social-carousel-cards.md` Structure: the 24 s / 6-card table assumes a CTA card; the brief (cover + 5 rules, 20 s) has no room. Add a "no CTA card" variant and a timing formula for 6 cards at 20 s (cover 90, cards 100 each, last 110).
2. Same file, Motion grammar: does not say whether the incoming card's entrance starts at swipe start or after settling, nor how to build the strip. Proposed: "card i's local clock starts at swipe start; strip offset = sum of eased swipes; counter is a fixed overlay".
3. Same file, Look: palette has no way to mark a dark card; I invented an inverted ink card for rhythm. Document it as an allowed layout (ink bg, paper text, accent only on >= 40 px dots/fills).
4. Same file, Quality bar: "<= 3 text lines" is ambiguous for the cover and for visuals containing text (mock commits). Clarify that visual-internal text is exempt.
5. Style doc: edge divider between cards is needed when all cards share the paper color or the swipe is invisible; add "2 px ink-10% left border on each card".
6. Same file: `remotion still Card2 ... --frame=70` implies per-card compositions; add the pattern "one `<Still>` per card, component takes the local frame as a prop".
7. `references/tools/remotion.md`: no mention that `Config.setPixelFormat` is unnecessary when `setVideoImageFormat("png")` is set (I set both; output was yuv420p). Also mono fonts: no recommended offline mono package (`@fontsource/jetbrains-mono` worked).
8. `SKILL.md` / make_preview.py: docs do not state `--poster-at` is a 0-1 fraction (I passed seconds and got an error). `templates/README.md` example lacks `--poster-at`.

## Tool issues
- `pnpm add -E` with a stale `.npmrc` works; `pnpm exec remotion still` for 6 stills takes ~8 s each (cold bundle each time). A single bundle plus `renderStill` script would be faster.
- Node `execFileSync("pnpm", ..., {shell:true})` on Windows prints DEP0190 deprecation; needed because pnpm is a .cmd.
- Git Bash heredoc with a long multi-file command failed to parse once (an unmatched quote); writing files with the editor tool avoided it.

## Honest self-assessment
Looks like a clean Xiaohongshu tip card carousel: warm paper, ink type, terracotta accent, rounded white mock panels, left-swipe with page counter. It resembles the style, but the evidence base is thin so I cannot say it matches real viral cards; real ones usually carry illustrations, stickers and denser decoration that the four-color recipe deliberately excludes. The recipe was strong enough to build from (tokens, motion numbers, structure all usable) with the gaps above. Weak spots: visual panels leave empty space under 2-line titles, titles/body share one template, accent-button text contrast is borderline, and I did not independently verify contrast with a tool.
