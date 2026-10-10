// Turns the script in content.json into frame-accurate events using the style's cadence rules.
import { T, content, clamp, mulberry32 } from "./theme.mjs";

const readFrames = (text) => {
  const words = text.split(/\s+/).length;
  return Math.round((0.5 + words / 3.5) * T.fps);
};

export function buildSchedule() {
  const rnd = mulberry32(content.meta.seed);
  const jit = () => Math.round((rnd() * 2 - 1) * T.jitter);

  const msgs = content.script.map((m, i) => {
    const text = m.lines.join(" ");
    return {
      ...m,
      id: i,
      text,
      chars: text.length,
      h: T.padY * 2 + m.lines.length * T.lineH,
    };
  });

  // run-last sent bubbles carry a receipt line
  msgs.forEach((m, i) => {
    m.hasReceipt = m.from === "me" && !(msgs[i + 1] && msgs[i + 1].from === "me");
    m.slot = m.h + T.slotGap + (m.hasReceipt ? T.receiptH : 0);
  });

  const ts = { at: 4, slot: T.tsSlotH };
  let prev = null;
  let prevEnd = 12;
  for (const m of msgs) {
    if (m.from === "me") {
      const gap = !prev ? 0 : prev.from === "me" ? 10 : Math.round(readFrames(prev.text) * 0.5);
      m.typeStart = prevEnd + gap + (prev ? jit() : 0);
      m.pushAt = m.typeStart + m.chars * T.typeFramesPerChar;
      m.land = m.pushAt;
    } else {
      const delay = clamp(Math.round(1.5 * prev.chars), 18, 45) + jit();
      m.indStart = prevEnd + delay;
      m.indLen = clamp(Math.round(1.5 * m.chars), 27, 78);
      m.pushAt = m.indStart;
      m.land = m.indStart + m.indLen;
    }
    m.end = m.land + T.enter;
    prev = m;
    prevEnd = m.end;
  }

  // receipts and reactions
  msgs.forEach((m, i) => {
    if (m.reaction) m.reactAt = m.land + T.reactionLag;
    if (m.hasReceipt) {
      const next = msgs[i + 1];
      m.readAt = next ? next.indStart + T.receiptLag : (m.reactAt ?? m.land + 30);
    }
  });

  // thread push positions (container y after k pushes, bottom anchored)
  const bottom = T.threadH - T.threadBottomPad;
  const pushes = [{ at: ts.at, slot: ts.slot }, ...msgs.map((m) => ({ at: m.pushAt, slot: m.slot }))];
  pushes.sort((a, b) => a.at - b.at);
  let sum = 0;
  pushes.forEach((p) => {
    sum += p.slot;
    p.y = bottom - sum;
  });

  // slot tops in container coordinates (document order)
  let top = 0;
  ts.top = top;
  top += ts.slot;
  msgs.forEach((m) => {
    m.top = top;
    top += m.slot;
  });

  const last = msgs[msgs.length - 1];
  const lastEvent = Math.max(last.end, last.reactAt ? last.reactAt + 10 : 0);
  const fadeOutAt = lastEvent + T.holdAfterThread;
  const cardAt = fadeOutAt + 4;
  const likesAt = cardAt + 8;
  const commentAt = likesAt + T.commentDelay;

  return {
    y0: bottom,
    ts,
    msgs,
    pushes,
    fadeOutAt,
    cardAt,
    likesAt,
    commentAt,
    settledAt: commentAt + 14,
  };
}
