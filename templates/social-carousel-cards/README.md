# social-carousel-cards

Xiaohongshu / Instagram style carousel preview (4:5, 1080x1350, 30 fps, 20 s, silent) built with Remotion 4.0.534. Topic: 5 rules for good commit messages (Simplified Chinese). Experimental style. All commits, the issue number and the handle are fictional sample content, labelled "示例" on the cards.

## Render

```
pnpm install
pnpm run render   # out/social-carousel-cards.mp4
pnpm run stills   # out/cards/01.png ... 06.png (1080x1350, one per card)
```

Remotion needs a paid Company License for for-profit companies with 4+ people: https://www.remotion.pro/license

## Edit

Everything editable is in `content.json`: palette (`colors`), swipe timing and card start frames (`timing`), and each card (`kicker`, `title` lines, `body`, `dark`, `visual`). Visual types: `log`, `versus`, `meter`, `message`, `timeline`, `issue`. Style tokens (sizes, springs) are in `src/theme.ts`. If you add or remove cards, update `timing.starts` and `totalFrames`; the `Card1..N` stills are generated from the card list.
