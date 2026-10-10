import { continueRender, delayRender, cancelRender } from "remotion";
import content from "../content.json";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";

export { content };
export const { meta, brand, colors, features, timing, turn, camera } = content;

export const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';
export const SAFE = 96;

export const type = {
  label: { size: 36, weight: 600 },
  claim: { size: 30, weight: 400, opacity: 0.8 },
  wordmark: { size: 28, weight: 700, tracking: "0.28em" },
  name: { size: 124, weight: 700, tracking: "-0.01em" },
  tagline: { size: 40, weight: 400, tracking: "0.02em" },
  footnote: { size: 20, weight: 400 },
};

export const callout = { lineWidth: 2, dotRadius: 6, lineFrames: 12, labelFrames: 8, risepx: 8, hideFrames: 6 };

// Wait for every used font weight before the first frame.
const fontHandle = delayRender("inter fonts");
Promise.all([
  document.fonts.load("400 30px Inter", "abcXYZ 0123456789"),
  document.fonts.load("600 36px Inter", "abcXYZ 0123456789"),
  document.fonts.load("700 124px Inter", "Aura One"),
])
  .then(() => continueRender(fontHandle))
  .catch((e) => cancelRender(e));
