// Single source of style tokens. Reads content.json; scenes import only from here.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const content = JSON.parse(readFileSync(path.join(ROOT, "content.json"), "utf8"));

export const { width: W, height: H, fps: FPS } = content.video;
export const P = content.palette;

export function darken(hex, amount) {
  const n = parseInt(hex.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => Math.round(v * (1 - amount)));
  return "#" + ch.map((v) => v.toString(16).padStart(2, "0")).join("");
}

export const T = {
  margin: 120,
  band: { x: 120, y: 100, w: 1680, h: 200, r: 44 },
  textSize: 68,
  coverTextSize: 84,
  ink: P.ink,
  inkOpacity: 0.6,
  outline: 4,
  wash: 0.85,
  washEdge: 10,
  edgeDarken: 0.12,
  stem: darken(P.meadow, 0.32),
  drop: darken(P.sky, 0.22),
  dry: darken(P.peach, 0.1),
  grain: { freq: 0.9, octaves: 4, seed: 7, opacity: 0.1 },
  wobble: { scale: 6, freq: 0.012, everyFrames: 6, seeds: 4 },
  turn: { skew: -4, minScale: 0.02, shadow: 0.3 },
  enter: { dy: 24, frames: 18, stagger: 6, heroBack: 1.4 },
  bob: { px: 4, seconds: 2 },
  blinkFrames: 4,
  drift: 40,
};

export const f2s = (frames) => frames / FPS;

// seeded PRNG so layout and idle motion are identical on every render
export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
