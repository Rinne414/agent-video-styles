# icon-burst-title

Experimental style. A 10 s, 1920x1080, 30 fps silent channel intro for the fictional channel "Code with Kai": a glowing dot bursts into rays, the title bounces in, three icons fly in beside three short lines, then orbit into a circular badge. Built with Remotion 4.0.534 (pinned).

## Render

```
pnpm install
pnpm run render      # writes out/icon-burst-title.mp4
pnpm run still       # one PNG at frame 95 (out/still.png)
```

Remotion needs a Company License for for-profit companies with 4+ people: https://www.remotion.pro/license

## Edit

Everything editable is in `content.json`: title (and which word is accent colored), tagline, the three icons and labels (`terminal`, `lightbulb`, `rocket`; add more in `src/scenes/IconsBadge.tsx` ICON_MAP), colors, sizes, layout and all timings in frames. Timings are for 300 frames; if you change `video.durationInFrames`, rescale the `timing` block.

Fonts: Inter 500/600/800 from `@fontsource/inter`, bundled offline. Icons: `lucide-react` (ISC license), drawn as code.

All content is fictional sample content.
