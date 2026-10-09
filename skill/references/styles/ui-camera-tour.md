# UI Camera Tour

The real product UI as the set: the camera pushes in on whatever gets clicked, with 2.5D tilt, an eased cursor and beat cuts. Shows the product working instead of describing it.

- **Primary tool**: Remotion (alt: HyperFrames, or raw HTML capture via `../tools/html-capture.md`)
- **Format**: 1920x1080 30 fps (9:16 mobile variant); 30-60 s
- **Inputs to ask for**: screenshots at 2x device pixel ratio (or a URL to capture), the 2-4 flows to show with the element clicked in each, product name, accent hex, CTA

## Look

| Token | Value |
|---|---|
| Backdrop | dark `#0E0E10` or light `#F4F4F6`, with a 12% accent radial glow behind the window |
| Screenshots | captured at 2x (e.g. 2880x1800 for a 1440x900 viewport) so 2.4x zoom stays sharp |
| App window | radius 16-24 px, optional traffic lights (12 px dots), shadow `0 40px 120px rgba(0,0,0,0.45)` |
| Spotlight | dim overlay `rgba(0,0,0,0.55)` with a rounded cut-out (radius 12 px, 8 px padding) around the target |
| Highlight ring | 3 px accent stroke, 8 px outer glow at 40% |
| Callout pill | Inter 600, 28-34 px, text white if accent luminance < 0.4 else near-black accent ink (white on `#10B981` is ~2.5:1),  radius 999 px, padding 12x22 px, 2 px pointer line to target |
| Headline | Inter 700, 64-88 px, shown only on overview shots, never over a zoomed UI |
| Cursor | macOS-style arrow, 48 px at 1080p; its size is counter-scaled by `1 / zoom` so it never grows |

## Motion grammar

- **Camera model**: put everything in one `world` container; the camera is `transform: translate(tx, ty) scale(z)` so the target rect's center lands at `anchor` (default frame center): `cx = target.cx - (ax - 0.5) * W / z`, same for y. Targets near a window edge get `anchor` 0.35-0.62 so the app fills the frame instead of black backdrop. Keep target rects in one data/layout module, measured from the screenshot or DOM, never guessed.
- **Zoom**: overview `z = 1.0`, focus `z = 1.6-2.4`; moves take 20-30 frames with `Easing.bezier(0.65, 0, 0.35, 1)` (or spring `{damping: 30, stiffness: 90}`). Hold each focus for >= 30 frames.
- **2.5D**: overview tilt `perspective(2000px) rotateX(10deg) rotateY(-14deg)`, flattening to 0 as zoom begins; parallax backdrop 0.6x, window 1x, callouts 1.3x.
- **Motion blur**: during camera moves only; Remotion `<CameraMotionBlur samples={20} shutterAngle={90}>` (samples 16-24, angle 90-120; 6 samples x 180 shows ghost copies of text). Check one mid-move still. Pans over ~800 px on screen take 45 frames. Each moving frame costs `samples` renders (35 s took 13 min). Raw capture: render at 120 fps, average 4 frames.
- **Cursor**: travels on an eased path in 18-24 frames, clicks 4 frames after arrival (scale 0.92 pulse + 12-frame ripple ring 0 -> 48 px), the UI reacts 2-4 frames after the click.
- **Typing**: 2 frames per character, caret blinking every 16 frames, small 6-frame pause after spaces.
- **Cuts**: between flows, cut on the beat; within a flow the camera is continuous. Cursor lives in world space, so in the last 24 frames of a flow move it to the next target, click, then cut; keep it inside the new shot's view in every frame.
- **Never**: zoom and pan in different directions at once, zoom past the screenshot's native resolution, cursor teleporting.

## Structure (40 s = 1200 frames @ 30 fps; scale to the requested length, snap boundaries to the beat grid)

| Beat | Frames | Content |
|---|---|---|
| Establish | 0-120 | Tilted window settles flat; headline "Meet <product>" beside it |
| Flow 1 | 120-420 | Zoom to element A, cursor click, result appears, callout pill |
| Flow 2 | 420-720 | Pan to element B, typing in a field, output appears |
| Flow 3 | 720-1020 | Pull out, push into C, before/after state swap |
| Outro | 1020-1200 | Pull back to overview, fade UI to 30%, logo + CTA settled by 1140 |

Each flow: 30 frames move, 60 frames action, 90 frames result + callout, 120 frames headroom for the next move.

| Short-cut | 35 s @ 120 BPM (1050 f) |
|---|---|
| Establish / Flow 1 / Flow 2 / Flow 3 / Outro | 0-105 / to 300 / to 645 / to 900 / to 1050 |

Outro boundaries below are percentages: lockup settled by 95% of runtime and held.

## Audio

Music at 100-120 BPM, cuts on beats. UI SFX at low level (around -20 dB under music): click per cursor click, soft keyboard ticks every 2-3 characters, airy whoosh under camera moves, pop under callouts. Optional voiceover: one sentence per flow, flow length set by the narration timeline (`../audio-tts-captions.md`).

## Agent brief (template)

```
Style: ui-camera-tour (see references/styles/ui-camera-tour.md)
Product: <name>; accent <hex>
Screens: <2x screenshot paths> or capture <url> at 1440x900 @2x
Flows: 1) <screen> click <element> -> <result> "<callout text>"
       2) ... 3) ...
Headline: "Meet <product>"; CTA: <url>
Audio: music <path or none>, UI SFX on, voiceover <script or none>
Format: 1920x1080 30fps, 40 s
```

## Quality bar

- [ ] Every zoom target comes from measured coordinates
- [ ] Text in focused UI is sharp at full zoom (2x source)
- [ ] Each focus held >= 1 s before the next move
- [ ] Cursor always visible, constant size, never jumps
- [ ] UI responds to every click within 4 frames
- [ ] Outro settled by 95% of runtime and held
- [ ] Pill and button text >= 4.5:1 against its fill
- [ ] Silent brief: SFX items N/A; keep click/typing event times in one timeline module

## Pitfalls

- **Blurry zoom**: 1x screenshots turn to mush at 2x. Capture at `deviceScaleFactor: 2`.
- **Guessed coordinates**: the camera lands beside the button. Measure rects (Playwright `boundingBox()` or image coordinates) and store them in a JSON file.
- **Seasick camera**: moving every second with overshoot. One move, one hold, one action.
- **Cursor scaling with zoom**: counter-scale it or render it outside the world container.
- **Invented UI**: if the user gives screenshots, never redraw their UI. If not, build the mock in code and say so: absolutely positioned DOM at 1440x900 design px (vector, so zoom stays sharp), all rects in one layout module shared by components and camera, every UI state a pure `f(frame)`, typing from a per-character schedule.
- **Still-time warning**: `inspect_video.py` reports 40-50% still for this style (holds with small cursor/typing motion); that is expected.
- **Render time**: motion blur samples multiply cost; restrict blur to frames where the camera moves.

## Variants

- **website-scroll**: full-page capture (2x) scrolled with `Easing.inOut(Easing.cubic)` stops at each section (hold 45 frames), callouts sliding in from the side; good for landing pages.
- **mobile-device**: 1080x1920, phone frame (radius 56 px), taps shown as a 64 px circle that shrinks and fades, screen transitions copied from the app (push, sheet, fade).
