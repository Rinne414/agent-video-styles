# Storyboard: Ledgerly product tour (ui-camera-tour)

1920x1080, 30 fps, 1050 frames = 35 s, silent. 120 BPM, so 1 beat = 15 frames; every camera cut and every camera arrival sits on a beat. No screenshots exist, so the UI is a code-drawn mock (1440x900 "window" in a single `world` container, vector, so it stays sharp at 2.4x zoom).

Structure scaled from the style's 40 s table (x 0.875) and snapped to beats.

| # | Frames (beats) | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Establish | 0-105 (0-7) | "Meet Ledgerly" + "Invoices that get paid." (left, 112 px) | Dashboard window tilted `rotateX 10 / rotateY -14`, settles flat by f105. Headline fades out by f96. | silent |
| 2 Flow 1: New invoice | 105-300 (7-20) | callout "One click to start" | Camera moves f105-f135 to the "New invoice" button (z 2.2). Spotlight + ring. Cursor arrives f150, clicks f154, page swaps f157 (+3). Camera pulls to the page (z 1.3) f165-f195. Cursor travels to the Client field, clicks f289. | silent |
| 3 Flow 2: Fill + total | 300-645 (20-43) | callout "Totals update live" | CUT f300 to the Client field (z 2.3). Types "Acme Studio" (2 f/char, 6 f pause after the space), client card appears. Camera move f375-f405 to items + summary (z 1.6). Two line items typed (description, qty, rate), amount cell commits, subtotal / tax / total count up in 14 f with a pulse. | silent |
| 4 Flow 3: Send | 645-900 (43-60) | callout "Paid in seconds" | CUT f645 to the Send button (z 2.2, spotlight). Click f655, button -> "Sent" and chip Draft -> Sent at f659 (+4), toast. Camera f675-f720 to the status chip. Chip turns "Paid" at f750 with a glow pop. Pull back to the page f810-f840. | silent |
| 5 Outro | 900-1050 (60-70) | "Ledgerly", "Invoices that get paid.", "ledgerly.example" | Camera pulls back to overview f870-f900, UI fades to 30 % and the cursor fades out f900-f960, dark scrim, logo + wordmark + CTA spring in f915-f975, settled by f990, held 2 s. | silent |

## Cursor itinerary (arrival beat, click +4 f)

rest (f0) -> New invoice (b10) -> Client field (b19) -> Description row 1 (b27) -> Description row 2 (b35.6) -> Send (b43.4) -> status chip (b47.6, hover only).

## Measured geometry

All target rects live in `src/layout.ts`; the UI components draw at those same rects, so camera targets cannot drift from the elements.
