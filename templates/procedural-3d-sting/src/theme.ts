import { Easing, interpolate } from "remotion";
import content from "../content.json";

export const C = content;
export const T = content.timing;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Clamped interpolation with an easing, the one helper every motion uses. */
export const ease = (
  frame: number,
  range: readonly number[],
  out: readonly number[] = [0, 1],
  easing: (t: number) => number = Easing.inOut(Easing.cubic),
) => interpolate(frame, range as number[], out as number[], { ...clamp, easing });

export const easeOut = (frame: number, range: readonly number[], out: readonly number[] = [0, 1]) =>
  ease(frame, range, out, Easing.out(Easing.exp));

export const deg = (d: number) => (d * Math.PI) / 180;
