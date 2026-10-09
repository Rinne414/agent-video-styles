// Every style token lives here. Scenes (build.mjs) read only from this module and content.json.
export const FPS = 30;
export const f = (frames) => frames / FPS; // frames -> seconds

export const color = {
  canvas: "#0D1117",
  lift: "#161B22",
  titleBar: "#161B22",
  terminal: "#010409",
  text: "#C9D1D9",
  gutter: "#8B949E",
  border: "#30363D",
  dots: ["#FF5F57", "#FEBC2E", "#28C840"],
  focusBand: "rgba(56,139,253,0.10)",
  addedBg: "rgba(46,160,67,0.15)",
  danger: "#F85149",
  ok: "#3FB950",
};

export const font = {
  code: "'JetBrains Mono', monospace",
  ui: "Inter, sans-serif",
  codeSize: 30, // px, editor
  termSize: 28, // px, terminal
  lineHeight: 1.5,
  charWidth: 0.6, // JetBrains Mono advance in em
};

export const win = { w: 1400, h: 820, radius: 16, bar: 44, padTop: 20, gutter: 64, padLeft: 24 };

export const motion = {
  codeCharsPerFrame: 2,
  cmdCharsPerFrame: 1.5,
  cmdPauseFrames: 10,
  outLineGap: 2,
  floodLineGap: 1, // long loops: one line per frame
  caretCycle: 15, // 8 on, 7 off
  caretOn: 8,
  focusFrames: 8,
  scrollFrames: 4,
  zoom: 1.1,
  zoomFrames: 20,
  expandFrames: 8,
  fadeFrames: 8,
};

export const sceneFade = f(motion.fadeFrames);
