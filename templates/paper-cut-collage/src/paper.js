// Paper engine: torn-edge pieces, patterns, easing, tags. Pure functions of the held frame.
const W = CONTENT.video.width;
const H = CONTENT.video.height;
const HOLD = CONTENT.video.holdFrames;
const PAL = CONTENT.palette;
const FONT = CONTENT.fonts;

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const prog = (h, s, d) => clamp((h - s) / d, 0, 1);
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const sw = (h, period) => (Math.floor(h / period) % 2 === 0 ? 1 : -1); // square wave on holds
const f1 = (n) => Math.round(n * 10) / 10;

// ---------- base outlines (closed polygons, local coordinates centred on 0,0) ----------
const rectG = (w, h) => [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
const ellG = (rx, ry, n = 48) =>
  Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2) * rx, Math.sin((i / n) * Math.PI * 2) * ry]);
const polyG = (pts) => pts;
const leafG = (len, wid) => {
  const up = [], dn = [];
  for (let i = 0; i <= 10; i++) {
    const t = i / 10, x = (t - 0.5) * len, y = wid * Math.pow(Math.sin(Math.PI * t), 0.8);
    up.push([x, -y]); dn.unshift([x, y]);
  }
  return up.concat(dn.slice(1, -1));
};
// Hill: wavy top, flat bottom. waves = sum of two sines.
const hillG = (w, h, amp, freq = 1.3, ph = 0) => {
  const pts = [], n = 32;
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = -w / 2 + u * w;
    pts.push([x, -h / 2 + amp * (Math.sin(u * Math.PI * 2 * freq + ph) * 0.65 + Math.sin(u * Math.PI * 2 * freq * 2.3 + ph * 1.7) * 0.35)]);
  }
  pts.push([w / 2, h / 2], [-w / 2, h / 2]);
  return pts;
};
// Scalloped strip (tea bush row / waves): bumps on top, flat bottom.
const scallopG = (w, h, bumps, bumpH) => {
  const pts = [], n = bumps * 8;
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = -w / 2 + u * w;
    pts.push([x, -h / 2 - bumpH * Math.abs(Math.sin(u * bumps * Math.PI))]);
  }
  pts.push([w / 2, h / 2], [-w / 2, h / 2]);
  return pts;
};
const cloudG = (w, h) => {
  const pts = [], n = 30;
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    pts.push([-w / 2 + u * w, -h * Math.pow(Math.abs(Math.sin(u * Math.PI * 2.5)), 0.7) * Math.pow(Math.sin(Math.PI * u), 0.5)]);
  }
  pts.push([w / 2, 0], [-w / 2, 0]);
  return pts;
};
const starG = (r1, r2, n) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2, r = i % 2 ? r2 : r1;
    return [Math.cos(a) * r, Math.sin(a) * r];
  });
// Thick arc (cup handle): angles in degrees, radius r, thickness t.
const arcG = (r, t, a0, a1, n = 14) => {
  const o = [], inn = [];
  for (let i = 0; i <= n; i++) {
    const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180;
    o.push([Math.cos(a) * (r + t / 2), Math.sin(a) * (r + t / 2)]);
    inn.unshift([Math.cos(a) * (r - t / 2), Math.sin(a) * (r - t / 2)]);
  }
  return o.concat(inn);
};
// Wavy vertical ribbon (steam, stream).
const ribbonG = (len, wid, wob, ph) => {
  const l = [], r = [], n = 12;
  for (let i = 0; i <= n; i++) {
    const u = i / n, x = Math.sin(u * Math.PI * 2 + ph) * wob * u, wv = wid * (1 - 0.6 * u);
    l.push([x - wv / 2, -u * len]); r.unshift([x + wv / 2, -u * len]);
  }
  return l.concat(r);
};

// ---------- torn edge ----------
function bounds(pts) {
  let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
  for (const [x, y] of pts) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  return { w: x1 - x0, h: y1 - y0 };
}
function resample(pts, n) {
  const seg = [];
  let tot = 0;
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push(l); tot += l;
  }
  const step = tot / n, out = [];
  let i = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = k * step;
    while (acc + seg[i] < target && i < pts.length - 1) { acc += seg[i]; i++; }
    const a = pts[i], b = pts[(i + 1) % pts.length], t = seg[i] ? (target - acc) / seg[i] : 0;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}
const PATHS = new Map();
// Closed path with 40-70 points offset along the normal by seeded noise.
function tornPath(key, pts, amp, grow) {
  if (PATHS.has(key)) return PATHS.get(key);
  let area = 0;
  for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; area += a[0] * b[1] - b[0] * a[1]; }
  const base = area < 0 ? pts.slice().reverse() : pts;
  let per = 0;
  for (let i = 0; i < base.length; i++) { const a = base[i], b = base[(i + 1) % base.length]; per += Math.hypot(b[0] - a[0], b[1] - a[1]); }
  const n = clamp(Math.round(per / 22), 40, 70), q = resample(base, n), r = mulberry32(hash32(key));
  const out = q.map((p, i) => {
    const a = q[(i + n - 1) % n], b = q[(i + 1) % n];
    const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
    const o = (r() * 2 - 1) * amp + grow;
    return [p[0] + (ty / l) * o, p[1] - (tx / l) * o];
  });
  const d = "M" + out.map((p) => f1(p[0]) + "," + f1(p[1])).join("L") + "Z";
  PATHS.set(key, d);
  return d;
}

// ---------- pieces ----------
const CUR = { k: 0, buf: "", ui: "" };

// o: id, g (outline), fill, pat, x, y, r, s, sx, sy, amp, rim, shadow, jit, extra, ui
function piece(o) {
  const k = CUR.k, j = o.jit == null ? 1 : o.jit;
  const jr = (rnd(o.id + ":r", k) - 0.5) * 2.4 * j;
  const jx = (rnd(o.id + ":x", k) - 0.5) * 4 * j;
  const jy = (rnd(o.id + ":y", k) - 0.5) * 4 * j;
  const b = bounds(o.g);
  const amp = o.amp != null ? o.amp : clamp(Math.min(b.w, b.h) * 0.05, 2.5, 8);
  const rimOn = o.rim !== false && amp > 0;
  const fillD = tornPath(o.id, o.g, amp, 0);
  const rimD = rimOn ? tornPath(o.id + ":rim", o.g, amp + 2, 3.5) : "";
  const sx = (o.sx != null ? o.sx : 1) * (o.s != null ? o.s : 1), sy = (o.sy != null ? o.sy : 1) * (o.s != null ? o.s : 1);
  const tf = `translate(${f1((o.x || 0) + jx)} ${f1((o.y || 0) + jy)}) rotate(${f1((o.r || 0) + jr)}) scale(${f1(sx * 1000) / 1000} ${f1(sy * 1000) / 1000})`;
  let inner = "";
  if (rimOn) inner += `<path d="${rimD}" fill="${PAL.paper}"/>`;
  inner += `<path d="${fillD}" fill="${o.fill}"/>`;
  if (o.pat) inner += `<path d="${fillD}" fill="url(#p-${o.pat})"/>`;
  const shadow = o.shadow === false ? "" : ' filter="url(#sh)"';
  const s = `<g transform="${tf}"><g${shadow}>${inner}</g>${o.extra || ""}</g>`;
  if (o.ui) CUR.ui += s; else CUR.buf += s;
}

// Arrival helpers: return null before start so the piece is not drawn at all.
function slide(L, start, dx, dy, dur = 8) {
  if (L < start) return null;
  const e = 1 - easeOut(prog(L, start, dur));
  return { x: dx * e, y: dy * e };
}
function pop(L, start, dur = 6) {
  if (L < start) return 0;
  const p = prog(L, start, dur);
  return p < 0.67 ? 0.6 + (p / 0.67) * 0.46 : 1.06 - ((p - 0.67) / 0.33) * 0.06;
}

// Paper tag with text. kind 'title' (Fredoka 600) or 'tag' (Caveat Brush). o.left pins the left edge.
function tagW(text, size, kind) {
  const em = kind === "tag" ? FONT.tagWidthEm : FONT.titleWidthEm;
  return text.length * size * em + size * 1.1;
}
function tag(o) {
  const fam = o.kind === "tag" ? FONT.tag : FONT.title;
  const wgt = o.kind === "tag" ? 400 : 600;
  const w = tagW(o.text, o.size, o.kind), h = o.size * 1.5;
  const x = (o.left != null ? o.left + w / 2 : o.x) + (o.dx || 0);
  const text = `<text x="0" y="${f1(o.size * 0.34)}" text-anchor="middle" font-family="${fam}" font-weight="${wgt}" font-size="${o.size}" fill="${PAL.ink}">${o.text}</text>`;
  piece({ id: o.id, g: rectG(w, h), fill: o.fill || PAL.paper, rim: false, amp: 4, x, y: o.y + (o.dy || 0), r: o.r || 0, s: o.s, extra: text, ui: true, pat: o.pat });
  return { w, h };
}

// ---------- persistent defs: patterns, shadow, grain ----------
function defsMarkup() {
  const paper = PAL.paper, ink = PAL.ink;
  return `
<filter id="sh" x="-10%" y="-10%" width="125%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="5" flood-color="${ink}" flood-opacity="0.28"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="7" result="n"/><feColorMatrix type="matrix" values="0.4 0 0 0 0.62  0.4 0 0 0 0.62  0.4 0 0 0 0.62  0 0 0 0 1"/></filter>
<pattern id="p-stripeL" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="28" height="9" fill="${paper}" fill-opacity="0.55"/></pattern>
<pattern id="p-stripeD" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><rect width="28" height="9" fill="${ink}" fill-opacity="0.2"/></pattern>
<pattern id="p-dotsL" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r="6" fill="${paper}" fill-opacity="0.6"/></pattern>
<pattern id="p-dotsD" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="14" cy="14" r="6" fill="${ink}" fill-opacity="0.2"/></pattern>
<pattern id="p-gingham" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="20" height="40" fill="${paper}" fill-opacity="0.45"/><rect width="40" height="20" fill="${paper}" fill-opacity="0.45"/></pattern>`;
}

// Run fn and wrap every piece it draws in a scale about (cx, cy): lets one scene cluster be built at design size.
function scaled(cx, cy, k, fn) {
  const save = CUR.buf;
  CUR.buf = "";
  fn();
  const inner = CUR.buf;
  CUR.buf = save + `<g transform="translate(${cx} ${cy}) scale(${k}) translate(${-cx} ${-cy})">${inner}</g>`;
}
