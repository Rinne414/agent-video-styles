import { Easing, interpolate, spring } from "remotion";
import content from "../content.json";
import "./fonts";

export const { title, titleAccentWord, tagline, icons, colors, video, sizes, layout, timing } = content;

export const fontFamily = 'Inter, "Helvetica Neue", Arial, sans-serif';

export const easeOut = Easing.out(Easing.cubic);
export const easeInOut = Easing.inOut(Easing.cubic);

export const SPRING_DOT = { damping: 12, stiffness: 140 };
export const SPRING_LETTER = { damping: 11, stiffness: 190 };

/** Clamped 0..1 progress of `frame` between `start` and `start + duration`, eased. */
export const progress = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = easeOut,
) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const springAt = (frame: number, delay: number, config: { damping: number; stiffness: number }) =>
  spring({ frame: frame - delay, fps: video.fps, config });

/** Group transform that moves the badge cluster left and shrinks it in the settle beat. */
export const badgeGroup = (frame: number) => {
  const p = progress(frame, timing.settleStart, timing.settleFrames);
  return {
    x: interpolate(p, [0, 1], [0, layout.badgeSettleX - layout.centerX]),
    scale: interpolate(p, [0, 1], [1, sizes.badgeSettleScale]),
  };
};

/** Center of the badge cluster before the group transform. */
export const rowsCenter = { x: layout.centerX, y: layout.rowsCenterY };
