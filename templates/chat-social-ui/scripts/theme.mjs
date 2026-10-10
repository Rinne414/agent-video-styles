// Single theme module: reads content.json, owns every style token (px, frames, springs).
// Scenes (markup.mjs, anim.js) take values from here only.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const content = JSON.parse(readFileSync(join(ROOT, "content.json"), "utf8"));

export const T = {
  fps: content.meta.fps,
  totalFrames: content.meta.fps * content.meta.durationSeconds,
  artW: 1080, // visible art width
  rootW: 1088, // composed width (multiple of 16, cropped to artW after render)
  H: 1920,
  colors: content.theme,
  font: "Inter",
  // layout
  headerTop: 220,
  headerH: 150,
  threadTop: 370,
  threadH: 1120, // 370..1490
  threadBottomPad: 24,
  sideMargin: 48,
  inputTop: 1506,
  inputH: 88,
  // bubbles
  bubbleFont: 44,
  lineH: 55,
  padX: 32,
  padY: 24,
  radius: 40,
  tailRadius: 12,
  slotGap: 16,
  receiptH: 40,
  tsSlotH: 64,
  typingW: 120,
  typingH: 76,
  // cadence (frames)
  typeFramesPerChar: 2,
  enter: 12,
  pushFrames: 10,
  jitter: 4,
  receiptLag: 20,
  reactionLag: 12,
  holdAfterThread: 30,
  fadeOut: 10,
  cardIn: 18,
  likesCount: 36,
  commentDelay: 32,
  driftScale: 1.03,
  // post cards
  cardW: 920,
  cardTop: 540,
  postH: 531,
  cardGap: 24,
};

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
