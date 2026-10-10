// Style tokens for broadcast-news. Colors and copy come from content.json; everything
// else (sizes, frame counts, easings) is defined here and nowhere else.
import { readFileSync } from "node:fs";

export const content = JSON.parse(readFileSync(new URL("../content.json", import.meta.url), "utf8"));

export const FPS = 30;
export const SIZE = { width: 1920, height: 1080 };

export const LAYOUT = {
  panelW: 340,
  panelH: 936, // panel stops where the ticker bar starts
  tickerY: 936,
  tickerH: 64,
  contentX: 420,
  contentRight: 1840,
  safe: 80,
};

export const TYPE = {
  numeral: 200,
  kicker: 30,
  headline: 72,
  headlineLine: 1.08,
  headlineMaxChars: 22,
  spec: 38,
  specStep: 64,
  tickerText: 30,
  tickerLabel: 28,
  tag: 24,
};

// Frame counts and easings from the style's motion grammar.
export const MOTION = {
  wipe: 14,
  wipeEase: "expo.out",
  numeralFrom: 6,
  numeralDur: 10,
  numeralScale: 1.25,
  kickerAt: 6,
  kickerDur: 10,
  kickerSlide: 40,
  headlineAt: 14,
  headlineLineStep: 8,
  headlineDur: 10,
  specAt: [60, 74, 88],
  specDur: 10,
  specEase: "power3.out",
  exit: 8,
  cameraScale: 1.02,
  tickerPxPerFrame: 6,
  scanlinePitch: 4,
  leadFrames: 6, // narration starts this many frames after a scene starts
  closingHoldFrames: 45,
};

export const FONTS = [
  { family: "Anton", file: "anton-latin-400-normal.woff2", weight: 400, pkg: "anton" },
  { family: "Inter", file: "inter-latin-500-normal.woff2", weight: 500, pkg: "inter" },
  { family: "Inter", file: "inter-latin-600-normal.woff2", weight: 600, pkg: "inter" },
  { family: "Inter", file: "inter-latin-700-normal.woff2", weight: 700, pkg: "inter" },
  { family: "Inter", file: "inter-latin-800-normal.woff2", weight: 800, pkg: "inter" },
];

export function cssVars() {
  const c = content.colors;
  const vars = {
    bg: c.bg, ticker: c.tickerBar, text: c.text, muted: c.muted, red: c.red, ink: content.ink,
    panelW: LAYOUT.panelW + "px", panelH: LAYOUT.panelH + "px", tickerY: LAYOUT.tickerY + "px",
    tickerH: LAYOUT.tickerH + "px", cx: LAYOUT.contentX + "px", safe: LAYOUT.safe + "px",
    numeral: TYPE.numeral + "px", kicker: TYPE.kicker + "px", headline: TYPE.headline + "px",
    headlineLine: TYPE.headlineLine, spec: TYPE.spec + "px", specStep: TYPE.specStep + "px",
    tickerText: TYPE.tickerText + "px", tickerLabel: TYPE.tickerLabel + "px", tag: TYPE.tag + "px",
  };
  return Object.entries(vars).map(([k, v]) => `--${k}: ${v};`).join(" ");
}
