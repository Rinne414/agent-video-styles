import { cancelRender, continueRender, delayRender } from "remotion";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import content from "../content.json";

export const FPS = content.meta.fps;
export const WIDTH = content.meta.width;
export const HEIGHT = content.meta.height;
export const C = content.colors;
export const L = content.labels;
export const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';

/** Style tokens from the recipe. */
export const T = {
  nodeW: 250,
  nodeH: 150,
  nodeRadius: 14,
  nodeStroke: "rgba(255,255,255,0.3)",
  arrowStroke: 3,
  arrowColor: "rgba(255,255,255,0.6)",
  iconStroke: 2,
  iconSize: 56,
  labelSize: 28,
  chapterSize: 72,
  captionSize: 48,
  captionBottom: 120,
  glowBlur: 16,
  glowAlpha: 0.4,
  dimLevel: 0.4,
  nodeSpring: { damping: 18, stiffness: 140 },
};

const fontHandle = delayRender("fonts");
Promise.all([
  document.fonts.load("600 40px Inter", "Cache hit miss 0123456789"),
  document.fonts.load("700 72px Inter", "Cache hit miss 0123456789"),
])
  .then(() => continueRender(fontHandle))
  .catch((e) => cancelRender(e));
