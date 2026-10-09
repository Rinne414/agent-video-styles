import { continueRender, delayRender, cancelRender, Easing, interpolate } from "remotion";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-700.css";
import content from "../content.json";

export { content };

export const FPS = content.meta.fps;
export const W = content.meta.width;
export const H = content.meta.height;
export const MARGIN = 100; // scene margin: 80 px safe area plus room for the 1.03 camera push
export const SAFE = 80;

export const C = content.theme;
export const FONT = `${C.fontFamily}, sans-serif`;
export const TABULAR = { fontVariantNumeric: "tabular-nums" } as const;

// Scene lengths (frames) and start offsets, all from content.json.
export const SCENES = content.scenes;
export const SCENE_STARTS = {
  hook: 0,
  line: SCENES.hook,
  ranking: SCENES.hook + SCENES.line,
  closing: SCENES.hook + SCENES.line + SCENES.ranking,
};
export const TOTAL_FRAMES = SCENES.hook + SCENES.line + SCENES.ranking + SCENES.closing;

// Type scale (px)
export const TYPE = {
  hero: 220,
  headline: 68,
  subtitle: 30,
  label: 32,
  value: 44,
  axis: 24,
  source: 22,
};

export const OUT = Easing.out(Easing.cubic);
export const INOUT = Easing.inOut(Easing.cubic);
export const CLAMP = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Progress 0..1 of a frame window with an easing. */
export const prog = (frame: number, start: number, dur: number, easing = OUT) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...CLAMP, easing });

// Fonts are loaded once; the render waits until they are ready.
const fontHandle = delayRender("fonts");
Promise.all([
  document.fonts.load("400 24px Inter", "0123456789 abc"),
  document.fonts.load("500 24px Inter", "0123456789 abc"),
  document.fonts.load("700 24px Inter", "0123456789 abc"),
])
  .then(() => continueRender(fontHandle))
  .catch((e) => cancelRender(e));
