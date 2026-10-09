# Templates

One folder per core style. Each template was produced by an agent working only from `skill/` (the style recipe plus the tool reference), then rendered and checked frame by frame. That is how a style earns its place in the catalog: if an agent cannot build it from the recipe alone, the recipe gets fixed.

All brands, people and numbers in the templates are fictional sample content.

## Run a template

Every template is standalone, so you can copy a single folder out of this repo.

| Tool | First run | Render |
|---|---|---|
| Remotion | `pnpm install` | `pnpm run render` |
| HyperFrames | `pnpm install` (if `package.json` lists dependencies) | `pnpm run render` |
| Manim | `uv sync` (needs LaTeX for formulas, see `skill/references/tools/manim.md`) | see the template README |
| HTML capture | `pnpm install` | `pnpm run render` |

Output goes to `out/<style-id>.mp4` (not committed). Requirements: Node 22+, pnpm, FFmpeg, Chrome; Python 3.10+ and uv for Manim and TTS.

## Change the content

Everything a user would normally edit (copy, colors, timings, data, voice) lives in `content.json` at the template root. Scene code reads from it, so you rarely need to touch components.

Narrated templates ship their generated audio in `assets/audio/` together with `timeline.json`, so they render offline. To change the narration, edit the script in `content.json` and regenerate:

```
python skill/scripts/tts.py <template>/assets/audio/script.json --out-dir <template>/assets/audio
```

## Conventions for new templates

- Folder `templates/<style-id>/` containing `README.md` (what it is, how to render, what to edit), `STORYBOARD.md` (the scene table the agent planned before building), `content.json`, and the project files.
- `package.json` name `@avs/<style-id>`, with a `render` script that writes `out/<style-id>.mp4` and, where the tool supports it, a `still` script.
- Pin tool versions (for example `hyperframes@0.8.143`, an exact `remotion` version).
- No network access during render: vendor scripts such as GSAP, and load fonts from npm packages (`@fontsource/*`, `@remotion/google-fonts`) or small local files. Do not commit font files larger than 2 MB; subset or use an npm font package instead.
- Only assets you are allowed to redistribute: code-drawn graphics, generated TTS audio, open-licensed fonts. No music unless it is synthesized in code. No real company names, logos or people.
- Publish a preview: `python skill/scripts/make_preview.py templates/<id>/out/<id>.mp4 --out previews/<id>.mp4 --poster previews/<id>.webp`.
