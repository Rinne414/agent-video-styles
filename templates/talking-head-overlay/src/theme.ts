import { Easing, interpolate } from "remotion";
import content from "../content.json";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";

export { content };
export type Rect = { x: number; y: number; w: number; h: number };

export const ACCENT = content.accent;
export const FONT = "Inter, sans-serif";

export const COLORS = {
  panel: "rgba(10,10,12,0.72)",
  white: "#FFFFFF",
  muted: "#C9CDD4",
  glassFill: "rgba(255,255,255,0.10)",
  glassBorder: "rgba(255,255,255,0.22)",
} as const;

export const TYPE = {
  name: { size: 44, weight: 700 },
  title: { size: 28, weight: 500 },
  numeral: { size: 160, weight: 800 },
  stepLabel: { size: 36, weight: 600 },
  callout: { size: 160, weight: 800 },
  calloutUnit: { size: 80, weight: 800 },
  calloutCaption: { size: 44, weight: 600 },
  badge: { size: 30, weight: 600 },
} as const;

// Motion tokens, in frames at 30 fps
export const MOTION = {
  stripeIn: 8,
  panelIn: 12,
  textStagger: 3,
  textRise: 16,
  out: 10,
  countUp: 30,
  badgeSpring: { damping: 16, stiffness: 200 },
} as const;

export const easeOut = Easing.out(Easing.cubic);

export const ramp = (frame: number, start: number, length: number) =>
  interpolate(frame, [start, start + length], [0, 1], {
    easing: easeOut,
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 1 while the overlay is on, falling to 0 over the last `length` frames
export const outRamp = (frame: number, duration: number, length: number) =>
  1 -
  interpolate(frame, [duration - length, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const place = (r: Rect) => ({
  position: "absolute" as const,
  left: r.x,
  top: r.y,
  width: r.w,
  height: r.h,
});
