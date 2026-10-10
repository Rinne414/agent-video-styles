// Pure geometry helpers: every function returns SVG path data or markup strings.
const f = (n) => Math.round(n * 100) / 100;
const rad = (d) => (d * Math.PI) / 180;
export const pol = (cx, cy, r, deg) => [cx + r * Math.cos(rad(deg)), cy + r * Math.sin(rad(deg))];
const pt = ([x, y]) => `${f(x)} ${f(y)}`;

export function circlePath(cx, cy, r) {
  return `M${f(cx + r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx - r)} ${f(cy)}A${f(r)} ${f(r)} 0 1 1 ${f(cx + r)} ${f(cy)}`;
}

/** Toothed wheel outline. type "ratchet" (escape wheel) or "spur". Angles in degrees, clockwise on screen. */
export function gearPath({ cx, cy, n, rRoot, rTip, type = "spur", rot0 = 0 }) {
  const step = 360 / n;
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = rot0 + i * step;
    if (type === "ratchet") {
      pts.push(pol(cx, cy, rRoot, a), pol(cx, cy, rTip, a + 0.1 * step));
    } else {
      pts.push(
        pol(cx, cy, rRoot, a - 0.27 * step),
        pol(cx, cy, rTip, a - 0.15 * step),
        pol(cx, cy, rTip, a + 0.15 * step),
        pol(cx, cy, rRoot, a + 0.27 * step),
      );
    }
  }
  return `M${pts.map(pt).join("L")}Z`;
}

/** Straight spokes drawn as parallel line pairs between two radii. */
export function spokesPath({ cx, cy, n, r1, r2, half = 7, rot0 = 0 }) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const a = rot0 + (i * 360) / n;
    const [ux, uy] = [Math.cos(rad(a)), Math.sin(rad(a))];
    const [nx, ny] = [-uy * half, ux * half];
    for (const s of [-1, 1]) {
      out.push(`M${f(cx + ux * r1 + s * nx)} ${f(cy + uy * r1 + s * ny)}L${f(cx + ux * r2 + s * nx)} ${f(cy + uy * r2 + s * ny)}`);
    }
  }
  return out.join("");
}

/** Archimedean spiral, used for the mainspring. */
export function spiralPath({ cx, cy, r1, r2, turns }) {
  const pts = [];
  const steps = Math.round(turns * 48);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    pts.push(pol(cx, cy, r1 + (r2 - r1) * t, t * turns * 360));
  }
  return `M${pts.map(pt).join("L")}`;
}

export function sectorPath(cx, cy, r1, r2, a1, a2) {
  const [x1, y1] = pol(cx, cy, r2, a1);
  const [x2, y2] = pol(cx, cy, r2, a2);
  const [x3, y3] = pol(cx, cy, r1, a2);
  const [x4, y4] = pol(cx, cy, r1, a1);
  const big = a2 - a1 > 180 ? 1 : 0;
  return `M${f(x1)} ${f(y1)}A${r2} ${r2} 0 ${big} 1 ${f(x2)} ${f(y2)}L${f(x3)} ${f(y3)}A${r1} ${r1} 0 ${big} 0 ${f(x4)} ${f(y4)}Z`;
}

/** Polygon outline of a straight bar from a to b with a given half-width. */
export function barPath(a, b, half) {
  const [dx, dy] = [b[0] - a[0], b[1] - a[1]];
  const len = Math.hypot(dx, dy);
  const [nx, ny] = [(-dy / len) * half, (dx / len) * half];
  return `M${pt([a[0] + nx, a[1] + ny])}L${pt([b[0] + nx, b[1] + ny])}L${pt([b[0] - nx, b[1] - ny])}L${pt([a[0] - nx, a[1] - ny])}Z`;
}

/** Small arrowhead at (x, y) pointing along angle `deg`. */
export function arrowHead(x, y, deg, size = 16) {
  const [x1, y1] = pol(x, y, size, deg + 150);
  const [x2, y2] = pol(x, y, size, deg - 150);
  return `M${pt([x1, y1])}L${pt([x, y])}L${pt([x2, y2])}`;
}

/** Arc with an arrowhead at its end (angles clockwise on screen). Returns one path. */
export function arrowArc(cx, cy, r, a1, a2) {
  const [sx, sy] = pol(cx, cy, r, a1);
  const [ex, ey] = pol(cx, cy, r, a2);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  const sweep = a2 > a1 ? 1 : 0;
  const tangent = a2 + (a2 > a1 ? 90 : -90);
  return `M${pt([sx, sy])}A${r} ${r} 0 ${large} ${sweep} ${pt([ex, ey])}` + arrowHead(ex, ey, tangent);
}

/**
 * 45 degree hatch lines covering a bounding box [x, y, w, h].
 * Returns an array of path strings, one per line, ordered along the diagonal.
 */
export function hatchLines([x0, y0, w, h], gap = 9) {
  const x1 = x0 + w;
  const y1 = y0 + h;
  const stepC = gap * Math.SQRT2;
  const lines = [];
  for (let c = x0 + y0 + stepC / 2; c < x1 + y1; c += stepC) {
    const xa = Math.max(x0, c - y1);
    const xb = Math.min(x1, c - y0);
    lines.push(`M${f(xa)} ${f(c - xa)}L${f(xb)} ${f(c - xb)}`);
  }
  return lines;
}
