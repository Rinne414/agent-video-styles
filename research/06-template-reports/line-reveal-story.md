# Template report: line-reveal-story

## Result

- Delivered `templates/line-reveal-story/` (HyperFrames 0.8.143, GSAP 3.14.2 vendored, Noto Serif 500/600 vendored woff2, 30 KB), `out/line-reveal-story.mp4` (1080x1920, 30 fps, 900 frames, 30.00 s, no audio), `previews/line-reveal-story.mp4` + `.webp` (poster at 28.5 s).
- Full renders used: 1 of 3 (63 s wall clock incl. crop). Stills: 2 snapshot rounds, 8 and 6 frames, viewed before rendering.
- `inspect_video.py`: no edge-band warning, black 0.00 s, longest still 1.50 s (the end hold), OK. Sheet viewed: `templates/line-reveal-story/out/sheet.png`.
- `pnpm run check`: 0 errors, 7 warnings (`nested_structure_needs_subcomposition`, known harmless), contrast 4/4 pass.
- Built from the style file + hyperframes tool file only. The recipe was thin on art but workable.

## Quality bar

| Item | Verdict | Evidence |
|---|---|---|
| Every illustration vector, drawn in code, no raster | PASS | All art is `<path>` from `src/parts.mjs`; no image files in the project. |
| Line sweep and colour sweep left to right, colour after line, every scene | PASS | Sheet frames at 1.27 s / 6.27 s / 11.27 s / 16.27 s / 21.27 s show lines only; 26.27 s shows colour feathering in from the left while the right is still line-only. |
| Fills saturation <= 35%, at most 5 per scene | PASS | Palette is the recipe's five (rose, sage, mustard, slate, gray) plus paper as an occluding fill; max 5 distinct per scene (S3: rose, gray, slate, mustard; S4: mustard, slate, gray, sage, rose). Beam uses mustard at 50% opacity (flat, no gradient). |
| Subject in the lower half, caption area empty of art | PASS | Art spans y ~ 590-1620 (tower tops reach ~y 720); caption at y 250-470. Moon/stars sit at y 590-900 in S4/closing, below the caption. |
| Caption <= 3 lines, readable time, contrast >= 4.5:1 | PASS | All captions 2 lines at 58 px; 8-9 words need 0.5 + 9/3.5 = 3.1 s, visible 3.6-4 s (fade at frame 30 of 150). Ink on paper 11:1; `check` contrast 4/4. |
| Each scene a different composition | PASS | Centred islet; wide cliff, tower right; interior cutaway; lantern room close-up; night sea tower-left; closing tower-right with ship left. |
| Nothing inside safe margins; fonts vendored and confirmed in a still | PASS | Art within x 70-1010; sea slab edges at x 70 / 1010 are fill-only (inside 80 px side margin by 10 px, a minor deviation). Serif glyphs in stills are Noto Serif (distinct serif, not Arial). |
| Every value a function of the frame | PASS | One GSAP proxy tween drives `render(frame)`; no CSS animation, no random, no Date. |
| Final scene settled and held >= 1.5 s | PASS | Colour done at local frame 90 (f810), hold 90 frames = 3 s; sheet frame 28.77 s is fully coloured. The ship keeps bobbing/drifting (see deviations). |
| New file name each run | N/A | Render writes `out/line-reveal-story.mp4` per README convention (overwrites). The recipe item conflicts with the repo convention. |
| Audio items | N/A | Silent brief. |

Deviations I chose: (1) title and closing sweeps are 44/42 frames instead of 54 so the closing finishes colour by local frame 90 as the recipe's Structure says; (2) the closing ship drifts 100 px left over 180 frames (recipe allows only a 6 px loop); needed to show "passes"; (3) no stroke-dashoffset draw (recipe marks it optional); (4) scenes have 25-40 shapes, over the "under 12 shapes" pitfall guidance, because that number only fits props.

## Skill gaps

1. `skill/SKILL.md` step 2 table + `references/catalog.md`: `line-reveal-story` is not in the catalog table (only core styles listed); an agent reaching it needs the id from the user. Propose: list experimental styles in a second table or tell the agent the style files in `references/styles/` outside the table are experimental and addressable by id.
2. `references/styles/line-reveal-story.md`, Format: 9:16 is described only as "1088x1920 composed then cropped". Missing: how the 720x960 tokens (stroke 3 px, caption 36 px, y 110-290, safe margins) convert. I scaled by 1.5 (stroke 4.5, caption 58 px at y 250). Propose a 1080x1920 column in the Look table: stroke 4.5, caption 56-58 px, top 230-250, side 90, subject y 900-1620, safe top 220 / bottom 300.
3. Same file, Motion grammar: "mask rect width 0 -> W with 24 px soft edge" does not say how to implement the soft edge in HyperFrames, nor how to keep fills under lines when both are masked. Propose the recipe that worked: two stacked layers, CSS `-webkit-mask-image: linear-gradient(to right, #000 Xpx, transparent X+featherpx)` with X = -feather + p*(W+feather) set per frame; feather scaled x1.5 (36 / 90 px) for 1080 wide.
4. Same file, Pitfalls "Mismatched layers": says derive both from one shape list but gives no mechanism for occlusion. A line-only layer shows scenery lines through figures and props. Missing: the knock-out technique (stroke of shape i is masked by every LATER opaque fill, via SVG `<mask>` built at build time; paper-filled head/body/props make this automatic). Propose adding it plus the `{d, fill, stroke, g}` shape model and parts list (circ, rrect, poly, arch, land, sea, keeper, lighthouse, ship).
5. Same file, Structure: the 30 s scale-down says "5 scenes of 150" but 5 x 150 + title 120 + closing 180 = 1050 > 900. A 30 s film is title 120 + 4 x 150 + closing 180 = 900. Propose that line explicitly. Also say the title text can be revealed with the same line mask.
6. Same file, "Never: motion in empty paper area" vs closing needing a ship to pass: add "slow drift of the subject (<= 100 px over the scene) is allowed when the beat is movement".
7. `references/tools/hyperframes.md`, Minimal project: a one-liner on generating static SVG markup from a Node build script with `data-start` sections works (used here); but no mention that `window.__timelines` already exists before the inline script. Fine as is; low priority.
8. Same file, Setup: `rm -f AGENTS.md CLAUDE.md` after `init` is written for the project root, but `init my-video` creates a subfolder; a template built in place must move `hyperframes.json`/`meta.json` up and delete the folder. Propose "init in a scratch folder, copy hyperframes.json + meta.json, discard the rest".
9. `references/styles/line-reveal-story.md`, Quality bar "Rendered with a new file name each run" conflicts with `templates/README.md` (`out/<style-id>.mp4`). Propose N/A for templates.
10. Font gap: the style says "vendor Noto Serif" but not how. The tool file's `npm pack @fontsource/<font>` route worked (noto-serif 5.3.0, latin-500/600 woff2, 15 KB each); the style file should name the weights (500 caption, 600 title).

## Tool issues

- `npx hyperframes@0.8.143 init` into a subfolder, plus the standing `AGENTS.md`/`CLAUDE.md` it writes (deleted).
- `snapshot` is fine for stills but also tries Gemini description and writes `snapshots/` (gitignored).
- Raw 1088 render then ffmpeg crop to 1080 worked as documented; `inspect_video.py` confirmed no right-edge band on the cropped file.
- CSS `mask-image` gradients animated per frame rendered correctly in both snapshot and MP4 (checked at 26.27 s).
- SVG `<mask>` knock-outs render fine; the 25-mask scenes did not slow the render (900 frames in ~60 s including startup).

## Honest self-assessment

- Does it look like the style? Mostly. The quiet paper background, constant ink line, muted flat fills, left-to-right line then colour sweeps, serif caption in the empty top area all match the recipe. It reads as clean vector clip art rather than hand-drawn picture-book art: the figure is a stiff primitive man (as the recipe's figure rule dictates), and the lack of wobble, hatching or grain makes it feel "icon-like". That is the cost of the code-only constraint the recipe itself names.
- Weak points: the keeper's face (cap + beard + two dots) is slightly masklike at small size; stair scene is small in frame; the sea slab has hard vertical edges; the sweep is a plain mask wipe (no dash-draw) so it feels more like a reveal than "drawing".
- Recipe strength: good enough to rebuild this look from the style + tool files alone, but only after I invented the layering/knock-out technique, the 1080x1920 scaling, and the 30 s frame budget (gaps 2-5). With those added to the style file, another agent would reuse it in one pass. Evidence base for the style is thin (one template: this one now makes two), so keep it marked experimental.
