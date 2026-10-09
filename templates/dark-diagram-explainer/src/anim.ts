import { Easing, interpolate, spring } from "remotion";
import { FPS, T } from "./theme";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** 1 between `on` and `off`, with `d`-frame linear ramps on both sides. */
export const ramp = (f: number, on: number, off = Infinity, d = 8) =>
  clamp01((f - on) / d) - clamp01((f - off) / d);

/** Node-entrance spring (0 -> 1), recipe: damping 18, stiffness 140. */
export const pop = (f: number, at: number) =>
  f < at ? 0 : spring({ frame: f - at, fps: FPS, config: T.nodeSpring });

/** Arrow draw progress with in-out quad easing. */
export const draw = (f: number, at: number, dur = 15) =>
  Easing.inOut(Easing.quad)(clamp01((f - at) / dur));

export const slide = (f: number, at: number, dur: number) =>
  Easing.out(Easing.cubic)(clamp01((f - at) / dur));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const mix = (f: number, pts: [number, number][]) =>
  interpolate(f, pts.map((p) => p[0]), pts.map((p) => p[1]), {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export type Pt = [number, number];

export const cubicAt = (p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt => {
  const u = 1 - t;
  const k = [u * u * u, 3 * u * u * t, 3 * u * t * t, t * t * t];
  return [
    k[0] * p0[0] + k[1] * p1[0] + k[2] * p2[0] + k[3] * p3[0],
    k[0] * p0[1] + k[1] * p1[1] + k[2] * p2[1] + k[3] * p3[1],
  ];
};
