# data-story-charts

A 35 s, 1920x1080, 30 fps silent data story built with Remotion: headline KPI counter, a monthly line chart, a top-5 ranking and a closing insight with KPI cards. All numbers are fictional sample data and the video says so on screen.

Style recipe: `skill/references/styles/data-story-charts.md`.

## Render

```
pnpm install
pnpm run render      # writes out/data-story-charts.mp4 (about 40 s)
pnpm run still       # frame 0 as out/still.png; pass --frame=N to remotion still for others
pnpm run dev         # Remotion Studio
```

Requires Node 22+, pnpm and FFmpeg. The first render downloads Chrome Headless Shell. Fonts (Inter) come from `@fontsource/inter`; nothing is fetched at render time.

## Edit

Everything is in `content.json`:

- `meta`: kicker, source line, SAMPLE DATA tag
- `theme`: background, text, neutral and highlight colors, font family
- `scenes`: scene lengths in frames (total duration is their sum)
- `hook`, `line`, `ranking`, `closing`: copy and data (monthly `values`, ranking `items`, KPI `cards`)

Scene components in `src/` read from `src/theme.ts`, which loads `content.json`. Layout and timing constants sit at the top of each scene file.

Keep the data honest: the line chart's `yMax` and ticks, and the ranking `axisMax`, must cover your values; the hook value should match the sum you claim.

## License note

Remotion requires a paid Company License for for-profit companies with 4 or more people: https://www.remotion.pro/license
