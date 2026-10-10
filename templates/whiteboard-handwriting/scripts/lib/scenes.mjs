import { arc, circle, ellipse, line, roundRect } from "./geom.mjs";
import { textWidth } from "./font.mjs";

// Zone grid: 4 zones of 840x400 with 80 px gaps inside the 80 px safe area.
export const ZONE_W = 840;
export const ZONE_H = 400;
const COLS = [80, 1000];
const ROWS = [100, 580];
// ZONE_PAD keeps ink clear of the safe area when the camera zooms about another zone.
export const ZONE_PAD = 30;
export const zoneOrigin = (i) => ({ ox: COLS[i % 2] + ZONE_PAD, oy: ROWS[Math.floor(i / 2)] });
export const zoneCenter = (i) => {
  const { ox, oy } = zoneOrigin(i);
  return { cx: ox - ZONE_PAD + ZONE_W / 2, cy: oy + ZONE_H / 2 };
};

// Slightly bowed hand-drawn underline (never a zigzag).
const swoosh = (x0, x1, y, sag = 5, n = 20) =>
  Array.from({ length: n + 1 }, (_, i) => [x0 + ((x1 - x0) * i) / n, y + sag * Math.sin((Math.PI * i) / n) - 2 * (i / n)]);

function arrow(seq, x0, y0, x1, y1, color) {
  seq.stroke(line(x0, y0, x1, y1), { color, width: 4, kind: "arrow", lift: 0 });
  const a = Math.atan2(y1 - y0, x1 - x0);
  const head = (da) => line(x1, y1, x1 - 20 * Math.cos(a + da), y1 - 20 * Math.sin(a + da));
  seq.stroke(head(0.5), { color, width: 4, kind: "arrow", lift: 0 });
  seq.stroke(head(-0.5), { color, width: 4, kind: "arrow" });
}

// One zigzag stroke across a bar = the 30% hatching.
function hatch(x, y, w, h) {
  const teeth = Math.max(2, Math.round(w / 22));
  const pts = [];
  for (let i = 0; i <= teeth; i++) {
    const px = x + (w * i) / teeth;
    pts.push([px, i % 2 ? y : y + h], [px + w / teeth / 2, i % 2 ? y + h : y]);
  }
  return pts.slice(0, -1).map(([px, py]) => [Math.min(px, x + w), py]);
}

function underline(seq, x0, x1, y, color) {
  seq.wait(seq.pen.underlineDelayFrames);
  seq.stroke(swoosh(x0, x1, y), { color, width: 6, kind: "arrow" });
}

export function hookScene(seq, c, W, H) {
  const { heading } = c.type;
  const lineH = Math.round(heading * 1.3);
  const total = lineH * (c.hook.lines.length - 1) + heading * 0.75;
  let y = (H - total) / 2 - 20;
  c.hook.lines.forEach((str) => {
    const w = textWidth(seq.font, str, heading);
    const x = (W - w) / 2;
    seq.text(str, { x, y, size: heading, color: "ink", width: 7 });
    const at = str.indexOf(c.hook.underlineWord);
    if (at >= 0) {
      const x0 = x + textWidth(seq.font, str.slice(0, at), heading);
      const x1 = x0 + textWidth(seq.font, c.hook.underlineWord, heading);
      underline(seq, x0, x1, y + heading * 0.75 + 26, c.hook.accent);
    }
    seq.wait(6);
    y += lineH;
  });
}

function label(seq, c, b, ox, oy) {
  const w = seq.text(b.label, { x: ox, y: oy, size: c.type.label, width: 6 });
  underline(seq, ox, w - 6, oy + c.type.label * 0.75 + 16, b.accent);
}

function coin(seq, cx, cy, r, str, c, color = "ink") {
  seq.stroke(circle(cx, cy, r), { color: "ink", width: 5, lift: 8 });
  const w = textWidth(seq.font, str, c.type.body);
  seq.text(str, { x: cx - w / 2, y: cy - c.type.body * 0.375, size: c.type.body, color });
}

function growStep(seq, c, b, geo) {
  const { ox, oy, y, rA, rB, arrowGap } = geo;
  const ax = ox + rA + 10;
  const bx = ax + rA + arrowGap + rB;
  coin(seq, ax, oy + y, rA, b.from, c);
  seq.wait(6);
  const a0 = ax + rA + 14, a1 = bx - rB - 14;
  arrow(seq, a0, oy + y, a1, oy + y, b.accent);
  const rw = textWidth(seq.font, b.rate, c.type.body);
  seq.text(b.rate, { x: (a0 + a1) / 2 - rw / 2, y: oy + y - 95, size: c.type.body, color: b.accent });
  seq.wait(6);
  coin(seq, bx, oy + y, rB, b.to, c);
  return { bx, rB };
}

export function year1Scene(seq, c, b, zone) {
  const { ox, oy } = zoneOrigin(zone);
  label(seq, c, b, ox, oy);
  const { bx, rB } = growStep(seq, c, b, { ox, oy, y: 240, rA: 90, rB: 100, arrowGap: 170 });
  seq.wait(8);
  const gx = bx + rB + 30;
  const w = seq.text(b.gain, { x: gx, y: oy + 215, size: c.type.body, color: b.accent });
  underline(seq, gx, w - 8, oy + 215 + c.type.body * 0.75 + 34, b.accent);
}

export function year2Scene(seq, c, b, zone) {
  const { ox, oy } = zoneOrigin(zone);
  label(seq, c, b, ox, oy);
  const { bx, rB } = growStep(seq, c, b, { ox, oy, y: 222, rA: 100, rB: 120, arrowGap: 170 });
  seq.wait(10);
  const w = textWidth(seq.font, b.to, c.type.body);
  seq.stroke(ellipse(bx, oy + 222, w / 2 + 22, 50, 0.25), { color: "red", width: 5 });
  seq.wait(6);
  const nw = textWidth(seq.font, b.note, c.type.body);
  const nx = ox + Math.max(0, (ZONE_W - nw) / 2 - 40);
  const end = seq.text(b.note, { x: nx, y: oy + 356, size: c.type.body, color: "red" });
  void end;
}

export function snowballScene(seq, c, b, zone) {
  const { ox, oy } = zoneOrigin(zone);
  label(seq, c, b, ox, oy);
  const hillY = (t) => 120 + 220 * Math.pow(t, 1.25);
  const hill = Array.from({ length: 21 }, (_, i) => [ox + 10 + (760 * i) / 20, oy + hillY(i / 20)]);
  seq.stroke(hill, { color: "ink", width: 5 });
  const ball = (t, r) => {
    const dt = 0.01;
    const tx = 760 * dt, ty = hillY(t + dt) - hillY(t - dt);
    const norm = Math.hypot(tx * 2, ty);
    const nx = ty / norm, ny = -(tx * 2) / norm; // unit normal pointing up
    const x = ox + 10 + 760 * t, y = oy + hillY(t);
    return { cx: x + nx * (r - 2), cy: y + ny * (r - 2), r };
  };
  const balls = [ball(0.12, 24), ball(0.45, 48), ball(0.79, 80)];
  seq.wait(6);
  balls.forEach((k, i) => {
    seq.stroke(circle(k.cx, k.cy, k.r), { color: "blue", width: 5, lift: 8 });
    if (i > 0) seq.stroke(arc(k.cx - k.r * 0.1, k.cy + k.r * 0.1, k.r * 0.5, k.r * 0.5, Math.PI * 1.1, Math.PI * 2, 10), { color: "blue", width: 4 });
  });
  const big = balls[2];
  [-22, 0, 22].forEach((dy) =>
    seq.stroke(line(big.cx - big.r - 62, big.cy + dy, big.cx - big.r - 22, big.cy + dy), { color: "ink", width: 4, kind: "arrow", lift: 2 }));
  seq.wait(8);
  seq.text(b.note, { x: ox, y: oy + 310, size: c.type.body, color: "blue" });
}

export function earlyScene(seq, c, b, zone) {
  const { ox, oy } = zoneOrigin(zone);
  label(seq, c, b, ox, oy);
  const body = c.type.body;
  const barX = ox + 230, barMax = 280, rowH = 56;
  const rowsY = [oy + 140, oy + 250];
  b.rows.forEach((row, i) => {
    seq.text(row.years, { x: ox, y: rowsY[i], size: body });
    seq.wait(4);
    const w = barMax * row.share;
    seq.stroke(roundRect(barX, rowsY[i] - 6, w, rowH + 4, 10), { color: "ink", width: 5, lift: 4 });
    seq.stroke(hatch(barX + 8, rowsY[i] - 6 + 8, w - 16, rowH - 12), { color: b.accent, width: 3, lift: 4 });
    seq.text(row.value, { x: barX + w + 24, y: rowsY[i], size: body, color: b.accent });
    seq.wait(2);
  });
  const vw = textWidth(seq.font, b.rows[0].value, body);
  seq.stroke(ellipse(barX + barMax + 24 + vw / 2, rowsY[0] + 21, vw / 2 + 24, 50, 0.25), { color: "red", width: 5 });
  seq.wait(4);
  seq.text(b.ratio, { x: barX, y: oy + 330, size: body, color: "red" });
}

export function endScene(seq, c, W, H) {
  const { heading } = c.type;
  const str = c.end.lines[0];
  const w = textWidth(seq.font, str, heading);
  const x = (W - w) / 2, y = H / 2 - heading * 0.5;
  seq.text(str, { x, y, size: heading, width: 7 });
  underline(seq, x, x + w, y + heading * 0.75 + 28, c.end.accent);
  [[x + w + 36, y - 6, x + w + 74, y - 34], [x + w + 50, y + 26, x + w + 96, y + 20], [x + w + 36, y + 58, x + w + 74, y + 84]].forEach(([a, b2, c2, d]) =>
    seq.stroke(line(a, b2, c2, d), { color: c.end.accent, width: 5, kind: "arrow", lift: 2 }));
}
