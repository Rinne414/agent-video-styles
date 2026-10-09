import { interpolate } from "remotion";
import { beat, content, FORMAT, MOTION } from "./theme";
import { centerOf, rectByName } from "./layout";

const TL = content.timeline;
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

// ---------- typing ----------

const schedule = (text: string): number[] => {
  const offsets = [0];
  for (let i = 0; i < text.length; i++) {
    const pause = text[i] === " " ? MOTION.spacePauseFrames : 0;
    offsets.push(offsets[i] + MOTION.charFrames + pause);
  }
  return offsets;
};

export const typedText = (text: string, start: number, frame: number): string => {
  if (frame < start) return "";
  const offsets = schedule(text);
  let n = 0;
  while (n < text.length && offsets[n] <= frame - start) n++;
  return text.slice(0, n);
};

export const typeEnd = (text: string, start: number) => start + schedule(text)[text.length];

// ---------- cursor ----------

export type CursorStop = { target: string; frame: number; click: boolean; dx: number; dy: number };

export const CURSOR_STOPS: CursorStop[] = TL.cursor.map((s) => ({
  target: s.target,
  frame: beat(s.at),
  click: "click" in s && s.click === true,
  dx: "dx" in s ? (s.dx as number) : 0,
  dy: "dy" in s ? (s.dy as number) : 0,
}));

export const clickFrameOf = (target: string): number => {
  const stop = CURSOR_STOPS.find((s) => s.target === target && s.click);
  if (!stop) throw new Error(`No click stop for ${target}`);
  return stop.frame + MOTION.clickDelay;
};

const stopPoint = (s: CursorStop) => {
  const c = centerOf(rectByName(s.target));
  return { x: c.x + s.dx, y: c.y + s.dy };
};

/** Cursor tip in window pixels: rest, then an eased arc to the next stop. */
export const cursorAt = (frame: number): { x: number; y: number } => {
  let pos = stopPoint(CURSOR_STOPS[0]);
  for (let i = 1; i < CURSOR_STOPS.length; i++) {
    const to = stopPoint(CURSOR_STOPS[i]);
    const start = CURSOR_STOPS[i].frame - MOTION.travelFrames;
    if (frame >= CURSOR_STOPS[i].frame) {
      pos = to;
      continue;
    }
    if (frame > start) {
      const t = MOTION.cameraEase(clamp01((frame - start) / MOTION.travelFrames));
      const dx = to.x - pos.x;
      const dy = to.y - pos.y;
      const arc = Math.sin(Math.PI * t) * 0.1;
      return { x: pos.x + dx * t - dy * arc, y: pos.y + dy * t + dx * arc };
    }
    break;
  }
  return pos;
};

/** press: 0..1 scale pulse; ripple: 0..1 progress, or -1 when idle. */
export const clickFx = (frame: number): { press: number; ripple: number } => {
  let press = 0;
  let ripple = -1;
  for (const s of CURSOR_STOPS) {
    if (!s.click) continue;
    const t = frame - (s.frame + MOTION.clickDelay);
    if (t >= 0 && t < 6) press = Math.sin((t / 6) * Math.PI);
    if (t >= 0 && t < 12) ripple = t / 12;
  }
  return { press, ripple };
};

// ---------- camera ----------

export type Pose = { cx: number; cy: number; z: number };
type Shot = (typeof TL.camera)[number];

const poseOf = (s: Shot): Pose => {
  const r = centerOf(rectByName(s.target));
  const [ax, ay] = ("anchor" in s ? s.anchor : [0.5, 0.5]) as number[];
  return {
    cx: r.x - (ax - 0.5) * (FORMAT.width / s.zoom),
    cy: r.y - (ay - 0.5) * (FORMAT.height / s.zoom),
    z: s.zoom,
  };
};

const mixPose = (a: Pose, b: Pose, t: number): Pose => ({
  cx: a.cx + (b.cx - a.cx) * t,
  cy: a.cy + (b.cy - a.cy) * t,
  z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t),
});

const isCut = (s: Shot) => "cut" in s && s.cut === true;
const moveFrames = (s: Shot) => beat("dur" in s ? (s.dur as number) : 0);

export const cameraAt = (frame: number): Pose => {
  let cur = poseOf(TL.camera[0]);
  for (let i = 1; i < TL.camera.length; i++) {
    const s = TL.camera[i];
    const next = poseOf(s);
    const at = beat(s.at);
    if (isCut(s)) {
      if (frame >= at) cur = next;
      else break;
      continue;
    }
    const start = at - moveFrames(s);
    if (frame >= at) cur = next;
    else if (frame > start) return mixPose(cur, next, MOTION.cameraEase((frame - start) / moveFrames(s)));
    else break;
  }
  return cur;
};

export const isCameraMoving = (frame: number): boolean =>
  TL.camera.some((s, i) => i > 0 && !isCut(s) && frame > beat(s.at) - moveFrames(s) && frame < beat(s.at));

/** 1 = fully tilted 2.5D overview, 0 = flat. */
export const tiltAt = (frame: number): number =>
  interpolate(frame, [0, beat(TL.tiltSettleBeat)], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: (x) => 1 - Math.pow(1 - x, 3),
  });

// ---------- invoice state ----------

export type ItemTimes = {
  click: number;
  start: number;
  descEnd: number;
  qtyStart: number;
  qtyEnd: number;
  rateStart: number;
  rateEnd: number;
  commit: number;
};

const inv = content.invoice;

export const CLIENT_TIMES = (() => {
  const start = beat(TL.typing.clientAtBeat);
  const end = typeEnd(inv.client, start);
  return { click: clickFrameOf("clientField"), start, end, cardAt: end + 4 };
})();

export const ITEM_TIMES: ItemTimes[] = inv.items.map((it, i) => {
  const click = clickFrameOf(`item${i + 1}Desc`);
  const start = click + TL.typing.itemStartAfterClickFrames;
  const descEnd = typeEnd(it.desc, start);
  const qtyStart = descEnd + 4;
  const qtyEnd = typeEnd(String(it.qty), qtyStart);
  const rateStart = qtyEnd + 4;
  const rateEnd = typeEnd(String(it.rate), rateStart);
  return { click, start, descEnd, qtyStart, qtyEnd, rateStart, rateEnd, commit: rateEnd + 3 };
});

export const SWAP_FRAME = clickFrameOf("newBtn") + 3;
export const SEND_CLICK = clickFrameOf("sendBtn");
export const SENT_FRAME = SEND_CLICK + MOTION.clickDelay;
export const PAID_FRAME = beat(TL.chipPaidAtBeat);
const COUNT_FRAMES = 14;

export type Totals = { subtotal: number; tax: number; total: number; pulse: number };

export const totalsAt = (frame: number): Totals => {
  let subtotal = 0;
  let pulse = 0;
  inv.items.forEach((it, i) => {
    const t = ITEM_TIMES[i];
    const p = MOTION.cameraEase(clamp01((frame - t.commit) / COUNT_FRAMES));
    subtotal += it.qty * it.rate * p;
    const since = frame - t.commit;
    if (since >= 0 && since < 18) pulse = Math.max(pulse, Math.sin((since / 18) * Math.PI));
  });
  const tax = subtotal * inv.taxRate;
  return { subtotal, tax, total: subtotal + tax, pulse };
};

export type Focus = { field: string; since: number } | null;

export const focusAt = (frame: number): Focus => {
  const c = CLIENT_TIMES;
  if (frame >= c.click + 2 && frame < ITEM_TIMES[0].click + 2) return { field: "client", since: c.click + 2 };
  for (let i = 0; i < ITEM_TIMES.length; i++) {
    const t = ITEM_TIMES[i];
    if (frame >= t.click + 2 && frame < t.qtyStart) return { field: `item${i}.desc`, since: t.click + 2 };
    if (frame >= t.qtyStart && frame < t.rateStart) return { field: `item${i}.qty`, since: t.qtyStart };
    if (frame >= t.rateStart && frame < t.commit) return { field: `item${i}.rate`, since: t.rateStart };
  }
  return null;
};

export type ChipState = "draft" | "sent" | "paid";
export const chipAt = (frame: number): ChipState =>
  frame >= PAID_FRAME ? "paid" : frame >= SENT_FRAME ? "sent" : "draft";

export const formatMoney = (n: number) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
