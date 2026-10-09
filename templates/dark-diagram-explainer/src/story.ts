import { Easing, interpolate } from "remotion";
import { at, endOf, seg } from "./timeline";

/** Every visual cue, keyed to a spoken word (absolute frames). */
export const Q = {
  // hook
  tokyo: at("s1", "Tokyo"),
  paris: at("s1", "Paris"),
  hookEnd: seg("s1").end,
  // problem
  originIn: at("s2", "origin"),
  far: at("s2", "far"),
  request: at("s2", "request"),
  miles: at("s2", "miles"),
  back: endOf("s2", "back"),
  latency: at("s2", "latency"),
  rttStart: at("s2b", "one"),
  rttEnd: endOf("s2b", "milliseconds"),
  dozens: at("s2b", "dozens"),
  virginia: at("s2b", "Virginia"),
  problemEnd: seg("s2b").end,
  // fix
  fixes: at("s3", "fixes"),
  edge: at("s3", "edge"),
  close: at("s3", "close"),
  each: at("s3", "each"),
  copies: at("s3", "copies"),
  fixEnd: seg("s3").end,
  // miss
  first: at("s4", "First"),
  miss: at("s4", "miss"),
  asks: at("s4", "asks"),
  once: at("s4", "once"),
  keeps: at("s4", "keeps"),
  copy: at("s4", "copy"),
  missEnd: seg("s4").end,
  // hit
  next: at("s5", "Next"),
  hit: at("s5", "hit"),
  already: at("s5", "already"),
  answers: at("s5", "answers"),
  hitEnd: seg("s5").end,
  // crowd
  million: at("s5b", "million"),
  copy2: at("s5b", "copy"),
  barely: at("s5b", "barely"),
  crowdEnd: seg("s5b").end,
  // result
  milliseconds: at("s6", "milliseconds"),
  traffic: at("s6", "traffic"),
  far2: at("s6", "far"),
  everyone: at("s6", "Everyone"),
  resultEnd: seg("s6").end,
  // outro
  cdn: at("s7", "CDN"),
  content: at("s7", "Content"),
};

export type CameraStop = { f: number; cx: number; cy: number; s: number };

export const CAMERA: CameraStop[] = [
  { f: seg("s1").start, cx: 700, cy: 520, s: 1.12 },
  { f: seg("s2").start, cx: 930, cy: 400, s: 1.1 },
  { f: seg("s3").start, cx: 930, cy: 540, s: 1.0 },
  { f: seg("s4").start, cx: 930, cy: 430, s: 1.15 },
  { f: seg("s5b").start, cx: 900, cy: 400, s: 1.1 },
  { f: seg("s6").start, cx: 930, cy: 510, s: 0.95 },
  { f: seg("s7").start, cx: 930, cy: 540, s: 1.0 },
];

const MOVE_FRAMES = 26;
const LEAD_FRAMES = 4;
const DRIFT_PER_FRAME = 0.00012;
const DRIFT_MAX = 0.02;

export const cameraAt = (f: number): { cx: number; cy: number; s: number } => {
  let i = 0;
  for (let k = 0; k < CAMERA.length; k++) if (f >= CAMERA[k].f - LEAD_FRAMES) i = k;
  const cur = CAMERA[i];
  const prev = CAMERA[Math.max(0, i - 1)];
  const t = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (f - (cur.f - LEAD_FRAMES)) / MOVE_FRAMES)));
  const mixV = (a: number, b: number) => a + (b - a) * t;
  const drift = 1 + Math.min(DRIFT_MAX, Math.max(0, f - cur.f) * DRIFT_PER_FRAME);
  return { cx: mixV(prev.cx, cur.cx), cy: mixV(prev.cy, cur.cy), s: mixV(prev.s, cur.s) * drift };
};

export const track = (f: number, pts: [number, number][]) =>
  interpolate(f, pts.map((p) => p[0]), pts.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
