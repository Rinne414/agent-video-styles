// Geometry helpers. A "stroke" is an array of [x, y] points; everything is baked at build time.

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

export const length = (pts) => {
  let s = 0;
  for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return s;
};

export const translate = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);

// Insert points so no segment is longer than `step` px (lets wobble bend long lines).
export function resample(pts, step = 12) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 1; k <= n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  return out;
}

export const line = (x0, y0, x1, y1) => [[x0, y0], [x1, y1]];

export function arc(cx, cy, rx, ry, a0, a1, n = 36) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]);
  }
  return pts;
}

// Closed circle that overshoots its start a little, like a hand-drawn loop.
export const circle = (cx, cy, r, overshoot = 0.12, startAngle = -Math.PI * 0.6) =>
  arc(cx, cy, r, r, startAngle, startAngle + Math.PI * 2 + overshoot, 40);

export const ellipse = (cx, cy, rx, ry, overshoot = 0.2, startAngle = -Math.PI * 0.7) =>
  arc(cx, cy, rx, ry, startAngle, startAngle + Math.PI * 2 + overshoot, 44);

export function roundRect(x, y, w, h, r) {
  const pts = [];
  const c = (cx, cy, a0) => pts.push(...arc(cx, cy, r, r, a0, a0 + Math.PI / 2, 6));
  c(x + w - r, y + r, -Math.PI / 2);
  c(x + w - r, y + h - r, 0);
  c(x + r, y + h - r, Math.PI / 2);
  c(x + r, y + r, Math.PI);
  pts.push([x + r, y]);
  return pts;
}

// Deterministic low-frequency wobble: displacement magnitude never exceeds `amp` px.
export function wobble(pts, rand, amp) {
  const p1 = rand() * 6.283, p2 = rand() * 6.283, p3 = rand() * 6.283, p4 = rand() * 6.283;
  const f1 = 0.011 + rand() * 0.006, f2 = 0.019 + rand() * 0.008;
  let s = 0;
  return pts.map(([x, y], i) => {
    if (i > 0) s += Math.hypot(x - pts[i - 1][0], y - pts[i - 1][1]);
    const dx = amp * 0.5 * (Math.sin(s * f1 + p1) + Math.sin(s * f2 + p2)) * 0.7071;
    const dy = amp * 0.5 * (Math.sin(s * f1 + p3) + Math.sin(s * f2 + p4)) * 0.7071;
    return [x + dx, y + dy];
  });
}

export const toPathData = (pts) =>
  pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");

export function bbox(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { x0, y0, x1, y1 };
}
