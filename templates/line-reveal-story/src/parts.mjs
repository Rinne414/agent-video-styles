// Parts library: every function returns a list of shapes in painter's order.
// A shape is { d, fill?, stroke?, op?, g? }:
//   d      SVG path data (all art is paths, so line and colour layers share geometry)
//   fill   palette key, or undefined for a line-only shape
//   stroke false for fill-only shapes (default true)
//   op     fill opacity
//   g      animation group name (see scene.anims)

const r1 = (n) => Math.round(n * 10) / 10;

export const circ = (cx, cy, r) =>
  `M${r1(cx - r)} ${r1(cy)}a${r1(r)} ${r1(r)} 0 1 0 ${r1(2 * r)} 0a${r1(r)} ${r1(r)} 0 1 0 ${r1(-2 * r)} 0Z`;

export const rrect = (x, y, w, h, r = 0) =>
  `M${r1(x + r)} ${r1(y)}H${r1(x + w - r)}A${r} ${r} 0 0 1 ${r1(x + w)} ${r1(y + r)}V${r1(y + h - r)}A${r} ${r} 0 0 1 ${r1(x + w - r)} ${r1(y + h)}H${r1(x + r)}A${r} ${r} 0 0 1 ${r1(x)} ${r1(y + h - r)}V${r1(y + r)}A${r} ${r} 0 0 1 ${r1(x + r)} ${r1(y)}Z`;

export const poly = (pts, close = true) =>
  `M${pts.map((p) => `${r1(p[0])} ${r1(p[1])}`).join("L")}${close ? "Z" : ""}`;

export const arch = (x, y, w, h) =>
  `M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z`;

export const line = (x1, y1, x2, y2) => `M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`;

/** Ground with a curved top edge: one fill shape (no outline) plus the top edge as a line. */
export function land(topD, x0, x1, yBottom, fill, g) {
  return [
    { d: `${topD}L${x1} ${yBottom}L${x0} ${yBottom}Z`, fill, stroke: false, g },
    { d: topD, g },
  ];
}

/** Sea: flat fill, horizon line and short wave strokes. */
export function sea(x0, x1, yTop, yBottom, waves = []) {
  const out = [
    { d: poly([[x0, yTop], [x1, yTop], [x1, yBottom], [x0, yBottom]]), fill: "slate", stroke: false },
    { d: line(x0, yTop, x1, yTop) },
  ];
  for (const [x, y, w] of waves) {
    out.push({ d: `M${x} ${y}q${w / 4} -14 ${w / 2} 0t${w / 2} 0`, g: "waves" });
  }
  return out;
}

/** Tapered lighthouse. lit -> lantern glows mustard. All parts opaque so they hide what is behind. */
export function lighthouse({ cx, by, h, wb, wt, lit = false, door = true, g }) {
  const top = by - h;
  const xl = (t) => cx - (wb + (wt - wb) * t); // left edge at height fraction t (0 base, 1 top)
  const xr = (t) => cx + (wb + (wt - wb) * t);
  const band = (a, b) => poly([[xl(a), by - h * a], [xr(a), by - h * a], [xr(b), by - h * b], [xl(b), by - h * b]]);
  const gal = { x: cx - wt - 26, w: 2 * wt + 52 };
  const lantW = wt * 1.5;
  const lantH = Math.max(54, h * 0.11);
  const out = [
    { d: poly([[xl(0), by], [xl(1), top], [xr(1), top], [xr(0), by]]), fill: "paper" },
    { d: band(0.16, 0.38), fill: "rose" },
    { d: band(0.56, 0.78), fill: "rose" },
    { d: rrect(gal.x, top - 18, gal.w, 18, 6), fill: "gray" },
    { d: rrect(cx - lantW / 2, top - 18 - lantH, lantW, lantH, 8), fill: lit ? "mustard" : "paper", g: lit ? g : undefined },
    { d: poly([[cx - lantW / 2 - 12, top - 18 - lantH], [cx, top - 18 - lantH - lantH * 0.85], [cx + lantW / 2 + 12, top - 18 - lantH]]), fill: "slate" },
    { d: circ(cx, top - 18 - lantH * 1.85 - 6, 7), fill: "paper" },
  ];
  if (door) {
    const dw = wb * 0.42;
    out.push({ d: arch(cx - dw / 2, by - h * 0.17, dw, h * 0.17), fill: "mustard" });
  }
  out.push({ d: rrect(cx - wt * 0.3 - 2, top + h * 0.1, wt * 0.6, h * 0.07, 10), fill: "slate" });
  return out;
}

/**
 * Keeper figure: circle head, rounded-rectangle coat, four limb strokes, cap, beard, two dot eyes.
 * x = centre, foot = ground y, s = scale, face = +1 right / -1 left.
 * armL / armR = hand offset from the shoulder, legL / legR = foot x offset from the hip.
 */
export function keeper({ x, foot, s = 1, face = 1, armL = [-30, 50], armR = [30, 50], legL = -10, legR = 10, g }) {
  const legLen = 62 * s;
  const hip = foot - legLen;
  const bodyTop = hip - 86 * s;
  const hr = 27 * s;
  const hy = bodyTop - hr - 3 * s;
  const sh = bodyTop + 22 * s;
  const eye = (dx) => ({ d: circ(x + (dx + face * 8) * s, hy, 2.6), g });
  return [
    { d: line(x - 12 * s, hip, x - 12 * s + legL * s, foot), g },
    { d: line(x + 12 * s, hip, x + 12 * s + legR * s, foot), g },
    { d: line(x - 24 * s, sh, x - 24 * s + armL[0] * s, sh + armL[1] * s), g },
    { d: line(x + 24 * s, sh, x + 24 * s + armR[0] * s, sh + armR[1] * s), g },
    { d: rrect(x - 28 * s, bodyTop, 56 * s, 92 * s, 20 * s), fill: "rose", g },
    { d: circ(x, hy, hr), fill: "paper", g },
    { d: `M${r1(x - hr * 0.93)} ${r1(hy + 11 * s)}Q${r1(x + face * 4 * s)} ${r1(hy + hr * 2.1)} ${r1(x + hr * 0.93)} ${r1(hy + 11 * s)}Z`, fill: "gray", g },
    { d: `M${r1(x - hr - 3 * s)} ${r1(hy - 12 * s)}A${r1(hr + 3 * s)} ${r1(hr + 3 * s)} 0 0 1 ${r1(x + hr + 3 * s)} ${r1(hy - 12 * s)}Z`, fill: "slate", g },
    eye(-10),
    eye(8),
  ];
}

/** Small ship: hull, cabin with lit window, mast, sail, pennant. x = centre, y = waterline, s = scale. */
export function ship({ x, y, s = 1, g }) {
  const p = (dx, dy) => [x + dx * s, y + dy * s];
  return [
    { d: poly([p(-110, -50), p(110, -50), p(78, 0), p(-82, 0)]), fill: "rose", g },
    { d: rrect(x + 22 * s, y - 92 * s, 66 * s, 42 * s, 8 * s), fill: "gray", g },
    { d: rrect(x + 40 * s, y - 80 * s, 20 * s, 18 * s, 5 * s), fill: "mustard", g },
    { d: line(x - 10 * s, y - 50 * s, x - 10 * s, y - 190 * s), g },
    { d: poly([p(-14, -184), p(-14, -66), p(-92, -66)]), fill: "paper", g },
    { d: poly([p(-10, -190), p(26, -178), p(-10, -166)]), fill: "slate", g },
    { d: `M${r1(x - 130 * s)} ${r1(y + 14 * s)}q${r1(20 * s)} -14 ${r1(40 * s)} 0t${r1(40 * s)} 0t${r1(40 * s)} 0t${r1(40 * s)} 0t${r1(40 * s)} 0t${r1(40 * s)} 0`, g: "waves" },
  ];
}

/** Rocks: jagged polygon, filled warm gray. */
export function rocks(pts, g) {
  return [{ d: poly(pts), fill: "gray", g }];
}

/** Tiny plus-shaped star. */
export const star = (cx, cy, r, g) => ({ d: `M${cx - r} ${cy}H${cx + r}M${cx} ${cy - r}V${cy + r}`, g });

/** Gull: two joined arcs. */
export const gull = (x, y, w, g) => ({ d: `M${x} ${y}q${w / 4} ${-w / 3} ${w / 2} 0q${w / 4} ${-w / 3} ${w / 2} 0`, g });
