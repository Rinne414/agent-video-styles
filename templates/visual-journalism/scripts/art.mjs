// Code-drawn drawing helpers (seeded, so every build is identical).
import { C } from "./theme.mjs";

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

const r1 = (n) => Math.round(n * 10) / 10;

/** Hand-wobbled cubic path from (x1,y1) to (x2,y2); jitter in px. */
export function wob(x1, y1, x2, y2, seed, jitter = 2) {
  const rnd = mulberry32(seed);
  const j = () => (rnd() - 0.5) * 2 * jitter;
  const dx = x2 - x1, dy = y2 - y1;
  return `M${r1(x1)} ${r1(y1)} C${r1(x1 + dx * 0.33 + j())} ${r1(y1 + dy * 0.33 + j())} ${r1(x1 + dx * 0.66 + j())} ${r1(y1 + dy * 0.66 + j())} ${r1(x2)} ${r1(y2)}`;
}

/** Wobbled curve through a control point (for arcs). */
export function arc(x1, y1, cx, cy, x2, y2, seed, jitter = 2) {
  const rnd = mulberry32(seed);
  const j = () => (rnd() - 0.5) * 2 * jitter;
  return `M${r1(x1)} ${r1(y1)} Q${r1(cx + j())} ${r1(cy + j())} ${r1(x2)} ${r1(y2)}`;
}

/** Open arrow head with its tip at (x,y), pointing along angle (radians). */
export function head(x, y, angle, size = 24) {
  const a1 = angle + Math.PI - 0.5, a2 = angle + Math.PI + 0.5;
  return `M${r1(x + Math.cos(a1) * size)} ${r1(y + Math.sin(a1) * size)} L${r1(x)} ${r1(y)} L${r1(x + Math.cos(a2) * size)} ${r1(y + Math.sin(a2) * size)}`;
}

/** Angle of the end tangent of a quadratic from control point to end. */
export const angleTo = (fx, fy, tx, ty) => Math.atan2(ty - fy, tx - fx);

/** Dashed annotation: a masked-draw path plus a popping arrow head. */
export function annotation({ d, tipX, tipY, angle, cue, rel, cls = "dash", headSize = 24 }) {
  const at = cue ? `data-cue="${cue}"` : `data-rel="${rel ?? 0.4}"`;
  return (
    `<path class="${cls}" d="${d}" data-draw ${at}/>` +
    `<path class="arrow${cls.includes("light") ? " light" : ""}" d="${head(tipX, tipY, angle, headSize)}" data-pop data-ox="${r1(tipX)}" data-oy="${r1(tipY)}" ${at} data-after="draw"/>`
  );
}

/** A shipping container, front-on/side style: corrugated body with corner castings. */
export function box(x, y, w, h, color, { lines = true, seed = 1 } = {}) {
  let s = `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="${C.ink}" stroke-width="2"/>`;
  if (lines && w > 14) {
    const n = Math.max(2, Math.floor(w / 12));
    for (let i = 1; i < n; i++) {
      const lx = r1(x + (w * i) / n);
      s += `<line x1="${lx}" y1="${y + 2}" x2="${lx}" y2="${y + h - 2}" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="1.5"/>`;
    }
  }
  return s;
}

export const BOX_COLORS = [C.boxRust, C.boxBlue, C.boxOchre, C.boxGreen];

/** Simple standing figure (hand labor). */
export function figure(x, y, scale = 1, flip = 1) {
  const s = scale;
  return (
    `<g stroke="${C.ink}" stroke-width="${3 * s}" stroke-linecap="round" fill="none">` +
    `<circle cx="${x}" cy="${y - 34 * s}" r="${7 * s}" fill="${C.ink}"/>` +
    `<line x1="${x}" y1="${y - 26 * s}" x2="${x}" y2="${y}"/>` +
    `<line x1="${x}" y1="${y}" x2="${x - 8 * s}" y2="${y + 22 * s}"/>` +
    `<line x1="${x}" y1="${y}" x2="${x + 8 * s}" y2="${y + 22 * s}"/>` +
    `<line x1="${x}" y1="${y - 20 * s}" x2="${x + 16 * s * flip}" y2="${y - 30 * s}"/>` +
    `<line x1="${x}" y1="${y - 20 * s}" x2="${x - 12 * s * flip}" y2="${y - 8 * s}"/></g>`
  );
}

export function barrel(x, y, w = 36, h = 44) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="#9B6B3F" stroke="${C.ink}" stroke-width="2"/>` +
    `<line x1="${x}" y1="${y + h * 0.3}" x2="${x + w}" y2="${y + h * 0.3}" stroke="${C.ink}" stroke-width="2"/>` +
    `<line x1="${x}" y1="${y + h * 0.7}" x2="${x + w}" y2="${y + h * 0.7}" stroke="${C.ink}" stroke-width="2"/>`
  );
}

export function crate(x, y, w = 48, h = 40) {
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#C9A66B" stroke="${C.ink}" stroke-width="2"/>` +
    `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y + h}" stroke="${C.ink}" stroke-width="2"/>` +
    `<line x1="${x + w}" y1="${y}" x2="${x}" y2="${y + h}" stroke="${C.ink}" stroke-width="2"/>`
  );
}

export function sack(x, y, w = 40, h = 46) {
  return (
    `<path d="M${x + 6} ${y} L${x + w - 6} ${y} Q${x + w + 4} ${y + h * 0.5} ${x + w} ${y + h} L${x} ${y + h} Q${x - 4} ${y + h * 0.5} ${x + 6} ${y} Z" fill="#D8CBA8" stroke="${C.ink}" stroke-width="2"/>` +
    `<line x1="${x + 8}" y1="${y + 8}" x2="${x + w - 8}" y2="${y + 8}" stroke="${C.ink}" stroke-width="2"/>`
  );
}

/** Wave lines for water. */
export function waves(x1, x2, y, count, seed) {
  const rnd = mulberry32(seed);
  let s = "";
  for (let i = 0; i < count; i++) {
    const wx = x1 + rnd() * (x2 - x1 - 80);
    const wy = y + rnd() * 100;
    s += `<path d="M${r1(wx)} ${r1(wy)} q10 -8 20 0 t20 0 t20 0" fill="none" stroke="#FFFFFF" stroke-opacity="0.7" stroke-width="3"/>`;
  }
  return s;
}
