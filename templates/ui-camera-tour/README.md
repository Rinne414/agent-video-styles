# ui-camera-tour: Ledgerly product tour

A 35 s, 1920x1080, 30 fps silent product tour of a fictional invoicing app. A virtual camera pushes into whatever gets clicked, an eased cursor clicks it, the UI reacts, and cuts land on a 120 BPM grid. The whole app UI is drawn in code (no screenshots), so it stays sharp at 2.2x zoom.

Flow: dashboard overview, click "New invoice", type the client "Acme Studio", fill two line items (the total counts up), click "Send", status chip goes Draft, Sent, Paid.

Built with [Remotion](https://www.remotion.dev) 4.0.534. Remotion needs a paid Company License for for-profit companies with 4+ people: https://www.remotion.pro/license

## Render

```
pnpm install
pnpm run render      # writes out/ui-camera-tour.mp4 (about 7-10 min, motion blur is expensive)
pnpm run still       # one PNG of frame 0, edit --frame in package.json for others
pnpm run dev         # Remotion Studio
```

Requires Node 22+, pnpm, FFmpeg. No network access is needed during render (Inter comes from `@fontsource/inter`).

## Edit it

Everything you would change is in `content.json`:

| Key | What it controls |
|---|---|
| `brand` | name, accent hex, headline lines, tagline, CTA text, user name |
| `invoice` | client, e-mail, tax rate, terms, line items (description, qty, rate); totals are computed |
| `dashboard` | stat cards, revenue bars, top clients, recent invoices |
| `callouts` | pill text, target element, start/end beat, pill offset in screen px |
| `spotlights` | which element is dimmed-around and when |
| `timeline.camera` | one entry per shot: arrival beat, move length in beats, target rect, zoom, optional `anchor` (where in the frame the target lands), `cut: true` for a hard cut |
| `timeline.cursor` | one stop per click or hover: target rect, arrival beat, pixel offset |
| `timeline.typing`, `chipPaidAtBeat`, `outro` | typing start, when the chip turns Paid, outro fade and lockup beats |
| `format` | fps, size, BPM, length in beats |

Target names (`newBtn`, `clientField`, `sendBtn`, `statusChip`, ...) are rects in `src/layout.ts`, the single source of truth for UI geometry: components draw at those rects and the camera aims at the same rects. To change timing, edit beats (1 beat = 0.5 s at 120 BPM). To restyle, edit the tokens in `src/theme.ts`.

## Files

```
content.json          all editable content and timeline
src/theme.ts          loads content.json, fonts, colors, motion tokens
src/layout.ts         UI rects (window pixels)
src/timeline.ts       camera, cursor, typing and UI state as pure functions of the frame
src/TourScene.tsx     world container, tilt, camera, motion blur
src/ui/               Window chrome, Dashboard, InvoicePage, primitives
src/overlays.tsx      Cursor, Callouts, Spotlights, Headline, Backdrop
src/Outro.tsx         closing lockup
```

All sample content (Ledgerly, Acme Studio, names, amounts) is fictional.
