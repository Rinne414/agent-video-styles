// Theme: every token comes from content.json (injected as window.CONTENT). Other modules read only from here.
const CONTENT = window.CONTENT;
const FPS = CONTENT.meta.fps;
const W = CONTENT.meta.width;
const H = CONTENT.meta.height;
const TOTAL_FRAMES = CONTENT.meta.durationFrames;
const SEED = CONTENT.seed;
const REDUCED = CONTENT.reducedFlashing;
const COL = CONTENT.colors;
const TYPE = CONTENT.type;
const LAYOUT = CONTENT.layout;
const BRAND = CONTENT.brand;
const BEATS = CONTENT.beats;
const SHATTER = CONTENT.shatter;
const TEAR = CONTENT.tear;

const INSET = 80; // HUD bracket inset from the frame edge
const ARM = 48; // HUD bracket arm length
const DRIFT = 0.03; // slow push-in over the whole piece
const CHANNEL_BASE = 4; // RGB split base offset in px
const CHANNEL_GAIN = 10; // RGB split extra offset at intensity 1
const CUT_SPLIT = 24; // full-frame split on the hard cut

function clamp01(x) {
  return Math.min(1, Math.max(0, x));
}
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}
function rgba(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function makeCanvas() {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  return c;
}
