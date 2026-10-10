# Template report: icon-burst-title

## Result

- Built `templates/icon-burst-title/` (Remotion 4.0.534, exact pins) from the skill only. Output `out/icon-burst-title.mp4`: h264 yuv420p, 1920x1080, 30 fps, 300 frames, 10.00 s, no audio, 0.96 MB.
- `inspect_video.py` ran with `--frames 12`: no warnings, "black 0.00 s", longest still 0.00 s, no edge-band warning. Sheet viewed (`out/sheet.png`).
- Full renders used: 1 (15 s wall time). Stills: 5 per-scene stills plus 2 re-check strips after layout changes.
- Preview: `previews/icon-burst-title.mp4` (0.21 MB) and `.webp`, poster at fraction 0.13 (1.3 s, rays at full length).
- Recipe verdict: buildable, but thin in several places (see gaps). The brief deviates from the recipe in three places (10 s, 13-character title, "lines" beside icons), and the recipe did not cover them.

## Quality bar

| Item | Status | Evidence |
|---|---|---|
| Ray burst, title, icon orbit and badge in separate stills | PASS | Sheet frames 1.267 s (rays), 2.9 s (title), 4.6-5.4 s (icons + lines), 6.3-7.1 s (orbit, badge) |
| Text >= 4.5:1 (3:1 for display over 60 px) | PASS | White on #1E1E1E; accent "Kai" #E55A2B on ground 4.6:1 (value taken from recipe, not measured); tagline #FFB38F on ground high. White icon strokes on orange badge are about 3.6:1 (graphics, 3:1 rule) |
| Intended font rendered | PASS | Stills show Inter (single-storey-free geometric shapes, 800 title weight); no tofu, no Arial fallback visible. Latin only |
| Nothing crosses 80 px safe area | PASS (judged by eye, then arithmetic) | Tagline right edge about 1760 px of 1920 before the 1.03 camera zoom (about 1810 after, within 1840); title top at about 130 px. The rays (460 px from center) stay inside the frame |
| Tagline settled and held >= 1 s | PASS | Tagline done at f254, fade starts f291: 1.23 s fully settled. Sheet frames 8.77 s and 9.6 s identical layout |
| Letters on 6-frame spacing, rays seeded | PARTIAL | Letters are 4 frames apart (11 letters would otherwise need 66 frames, longer than the title beat). Rays use no randomness at all, so they are identical per render by construction |
| Thumps aligned (silent) | N/A | Brief is silent |

Other style rules: no linear easing on movement (only fade-out uses linear opacity); everything is a function of the frame; at most 3 elements entering at once (title move overlaps first icon only); last frame is a held lockup with a 9-frame fade to ground.

## Skill gaps

1. `references/styles/icon-burst-title.md`, Look and Structure: written for a short title (2-6 characters) with the title staying centered; the brief's title is 13 characters and the recipe never says what the title does after its beat. The final frame has a badge and tagline but no title in the recipe. Fix: add a "Title persists" rule (moves to top at 70 %, or fades) and a longer-title letter-spacing rule (4 frames apart when the title has more than 8 letters), and a layout table for the final lockup.
2. Same file, Motion grammar "Letters ... 6 frames apart" and Quality bar "6-frame spacing": contradicts any title over about 10 letters inside a 20 % beat. Fix: "6 frames up to 8 letters, then 4; the letters must finish within the Title beat".
3. Same file, Look, Icons and Badge: "icons 128 px on a 120 px radius in a 360 px badge" does not fit (icon corners reach radius 184 > ring 180) and the whole layout reads small at 1080p. I used 180 px icons, 520 px badge, 150 px radius, 120 px labels, 80 px tagline. Fix: give a consistent set (badge 520, icon 180, radius 150) and state that labels may be 100-120 px when each is one word.
4. Same file, Motion grammar "Icons in" / "Orbit": does not say where the rows sit before the orbit or how to make the move continuous. What worked: express each icon's row position as polar coordinates about the badge center, then interpolate angle (full turn or more, clockwise) and radius together. Fix: add this formula and a row layout (rows center y 650, gap 230).
5. Same file, Structure: "Settle: badge scales to 0.55" gives a badge too small to read as the end card; 0.8 worked. The "fade to dark in the last 15 frames" competes with "last frame is intentional, held >= 1 s"; I used 9 frames of fade after 1.23 s settle. Fix: state the fade length per duration and the minimum settled time, or drop the fade.
6. Same file, Burst: "rays extend 0 -> 460 px" does not say what happens to the rays afterward (they would collide with the title). I retract the tail outward and fade them over 18 frames. Fix: add that sentence.
7. `references/tools/remotion.md`, Setup: the scaffold command printed "Something already exists" in a reused scratch dir, and the doc's suggested route is to copy three files; a ready-made `package.json` block with exact pins would be faster (react/react-dom 19.2.3, @types/react 19.2.7, typescript 5.9.3, @fontsource/inter 5.2.8, lucide-react 1.54.0 are what I used). Also state that setting `Config.setVideoImageFormat("png")` is worth doing in the template (done here; mp4 came out yuv420p).
8. `references/tools/remotion.md`, Fonts: recipe A works but does not say `delayRender` in a module imported by the theme runs for the composition correctly (it did). One sentence would remove doubt.
9. `references/tools/remotion.md` has no "icons as code" guidance beyond lucide nested in SVG; the template used lucide as HTML with `absoluteStrokeWidth` for a pixel-exact 8-11 px stroke. Add: `<Icon size strokeWidth absoluteStrokeWidth />` gives a fixed pixel stroke.
10. `SKILL.md` step 5: the "theme module that reads content.json" instruction is clear, but templates/README.md says package name `@avs/<id>` and `still` script; SKILL.md does not mention these. Minor.

## Tool issues

- The first scene-by-scene stills command was rejected by Git Bash (a very long multi-heredoc command with mixed quotes failed to parse and wrote nothing); splitting into separate Write calls fixed it. Not a skill problem.
- `remotion still` prints the output path with ANSI color codes; harmless.
- `make_preview.py --poster-at` takes a fraction (0-1), not seconds; the style/template instructions say "pick `--poster-at`" without units. The script help is correct; the task text invited a seconds value.
- pnpm install printed an "ignored build scripts" notice (esbuild), harmless as documented.

## Honest self-assessment

- Looks like the style? Partly. The structure is right (dot, burst, bounce title, flying icons, orbit, badge), and the motion is clean and smooth. The look is plain: flat orange on charcoal, thin white line icons, no depth. It reads as a clean, generic channel sting rather than a distinctive one; the "icon" beats are sparse and the middle of the frame is empty in the icon scene. I could not compare against the public examples (not allowed), so "looks like the style" is unverified.
- Recipe strength: enough to produce a working intro in one pass, but I had to make about six design decisions the recipe left open (gaps 1-6), and I changed several of its numbers to make it look right at 1080p. A second agent would produce a different layout. The recipe needs the layout tables listed above to be reusable.
- Not verified: motion feel was judged only from 12 sheet frames and 5 stills, not by playing the video; spring overshoot on letters is inferred from the parameters. Contrast ratios were not computed, only the recipe's numbers reused.
