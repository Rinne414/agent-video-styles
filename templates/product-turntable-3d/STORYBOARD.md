# Storyboard: Aura One turntable (15 s, 1920x1080, 30 fps, silent)

Style: `product-turntable-3d` (experimental). Tool: Remotion + `@remotion/three`. Light studio sweep `#E9E6E1`, graphite shell, aluminium band, accent `#E4572E` for dots only.

The style's 20 s / 600-frame structure is scaled to 15 s / 450 frames (x0.75). Three features of 112 frames each, reveal 56, lockup settled at frame 405 (90%) and held 45 frames (1.5 s).

| # | Frames | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Reveal | 0-56 | "AURA ONE" wordmark fades in at 40 (top-left, 96 px safe) | Fade up from white over 24 frames; key light sweeps 20 deg over 70 frames; headphones start front-facing and begin to turn, camera at distance 7.0, 10 deg above horizon | none |
| 2 Feature 1 | 56-168 | "40 h battery" / "On a single charge" (right third) | Turn to the left cup (yaw 125 deg), slow at the stop; leader draws from the cup face in 12 frames, label rises 8 px in 8; callout visible frames 92-160 | none |
| 3 Feature 2 | 168-280 | "Adaptive noise cancelling" / "Tunes to your surroundings" (left third) | Turn to the right cup (yaw 245 deg), anchor on the outer plate | none |
| 4 Feature 3 | 280-392 | "Fold-flat design" / "Slips into any bag" (right third) | Turn to yaw 320 deg, anchor on the right hinge; cups swivel flat (frames 330-352), hold, swivel back (378-400) | none |
| 5 Lockup | 392-450 | "Aura One" (124 px) + "Quiet, carried." (40 px) | Turn settles front-facing by 405, camera lifts so the product sits high; name and tagline rise in under the product; held to 450 | none |

Footnote "Fictional product. Sample specs." stays bottom-right from frame 40 (all specs and the brand are invented).

Callouts are DOM overlays placed with the same `yawAt(frame)` and `cameraAt(frame)` helpers as the 3D scene (`projectAnchor`); each hides when its anchor normal faces away from the camera (dot < 0.15).
