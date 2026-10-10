import { Easing } from "remotion";
import content from "../content.json";

export const C = content.colors;
export const META = content.meta;
export const TIMING = content.timing;
export const CARDS = content.cards;
export type CardData = (typeof CARDS)[number];

export const FONT_SANS = 'Inter, "Noto Sans SC", sans-serif';
export const FONT_MONO = '"JetBrains Mono", Inter, "Noto Sans SC", monospace';

export const T = {
  margin: 72,
  titleTop: 160,
  titleSize: 108,
  titleLineHeight: 1.1,
  titleTracking: "-0.02em",
  titleWeight: 800,
  bodySize: 46,
  bodyWeight: 500,
  counterSize: 32,
  radius: 28,
  borderAlpha: "1A", // ink at 10%
  visualTop: 780,
  visualBottom: 1230,
  ctaW: 560,
  ctaH: 120,
};

export const MOTION = {
  titleSpring: { damping: 20, stiffness: 160 },
  titleRise: 40,
  lineStagger: 4,
  visualDelay: 8,
  swipeEase: Easing.bezier(0.22, 1, 0.36, 1),
  drift: 0.02,
  counterFade: 6,
  hintShift: 16,
  hintFrames: 30,
};

export const allText = (): string => JSON.stringify(content);
