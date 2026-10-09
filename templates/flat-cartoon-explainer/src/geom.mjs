// Pure geometry + SVG snippet helpers (build time). Every outline is OUTLINE px of ink.
export const OUTLINE = 5;
export const RAY_W = 12;
export const RAY_INK = RAY_W + 2 * OUTLINE;
export const RAINBOW = ["coral", "orange", "yellow", "mint", "blue", "violet"];

const f = (n) => Math.round(n * 10) / 10;
const stroke = (c) => `stroke="${c.ink}" stroke-width="${OUTLINE}" stroke-linejoin="round" stroke-linecap="round"`;

/** Ink-outlined line/path "beam": returns ink-under + colored path, both drawable via class. */
export function beam(cls, d, color, c, extra = "") {
  const common = `class="${cls}" d="${d}" fill="none" pathLength="1" stroke-dasharray="1 2" stroke-linecap="round" stroke-linejoin="round" ${extra}`;
  return `<path ${common} stroke="${c.ink}" stroke-width="${RAY_INK}"/><path ${common} stroke="${color}" stroke-width="${RAY_W}"/>`;
}

export function dropPath(cx, cy, r) {
  const p = (x, y) => `${f(cx + x * r)},${f(cy + y * r)}`;
  return `M${p(0, -1.75)} C${p(0.3, -1.05)} ${p(1, -0.45)} ${p(1, 0.3)} A${r},${r} 0 0 1 ${p(-1, 0.3)} C${p(-1, -0.45)} ${p(-0.3, -1.05)} ${p(0, -1.75)} Z`;
}

export function dropSvg(id, cx, cy, r, fill, c) {
  return `<g id="${id}"><path d="${dropPath(cx, cy, r)}" fill="${fill}" ${stroke(c)}/><path d="M${f(cx - r * 0.5)},${f(cy + r * 0.1)} Q${f(cx - r * 0.5)},${f(cy + r * 0.55)} ${f(cx - r * 0.1)},${f(cy + r * 0.62)}" fill="none" stroke="${c.white}" stroke-width="${f(Math.max(3, r * 0.14))}" stroke-linecap="round" opacity="0.9"/></g>`;
}

export function sunSvg(id, cx, cy, r, c) {
  let rays = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const x1 = cx + Math.cos(a) * (r + 22), y1 = cy + Math.sin(a) * (r + 22);
    const x2 = cx + Math.cos(a) * (r + 54), y2 = cy + Math.sin(a) * (r + 54);
    rays += `<path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" stroke="${c.ink}" stroke-width="${RAY_INK}" stroke-linecap="round"/><path d="M${f(x1)},${f(y1)} L${f(x2)},${f(y2)}" stroke="${c.orange}" stroke-width="${RAY_W}" stroke-linecap="round"/>`;
  }
  const face = `<circle cx="${cx - r * 0.33}" cy="${cy - r * 0.1}" r="7" fill="${c.ink}"/><circle cx="${cx + r * 0.33}" cy="${cy - r * 0.1}" r="7" fill="${c.ink}"/><path d="M${f(cx - r * 0.3)},${f(cy + r * 0.28)} Q${cx},${f(cy + r * 0.6)} ${f(cx + r * 0.3)},${f(cy + r * 0.28)}" fill="none" ${stroke(c)}/>`;
  return `<g id="${id}"><g id="${id}-rays">${rays}</g><circle cx="${cx}" cy="${cy}" r="${r}" fill="${c.yellow}" ${stroke(c)}/>${face}</g>`;
}

export function cloudSvg(id, cx, cy, s, c) {
  const parts = [
    ["circle", cx - 110 * s, cy + 10 * s, 62 * s],
    ["circle", cx - 30 * s, cy - 36 * s, 82 * s],
    ["circle", cx + 70 * s, cy - 6 * s, 66 * s],
    ["circle", cx + 140 * s, cy + 26 * s, 44 * s],
    ["rect", cx - 160 * s, cy + 6 * s, 340 * s, 64 * s],
  ];
  const shape = (extra) =>
    parts.map((p) => (p[0] === "circle"
      ? `<circle cx="${f(p[1])}" cy="${f(p[2])}" r="${f(p[3])}" ${extra}/>`
      : `<rect x="${f(p[1])}" y="${f(p[2])}" width="${f(p[3])}" height="${f(p[4])}" rx="${f(32 * s)}" ${extra}/>`)).join("");
  return `<g id="${id}">${shape(`fill="${c.ink}" stroke="${c.ink}" stroke-width="${2 * OUTLINE}" stroke-linejoin="round"`)}${shape(`fill="${c.white}"`)}</g>`;
}

export function starSvg(id, cx, cy, r, color, c) {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.5 : r;
    d += `${i ? "L" : "M"}${f(cx + Math.cos(a) * rr)},${f(cy + Math.sin(a) * rr)} `;
  }
  return `<path id="${id}" d="${d}Z" fill="${color}" ${stroke(c)}/>`;
}

/** Host "Pip": front view, capsule body, antenna. All coordinates absolute so GSAP svgOrigin works. */
export function hostSvg(p, cx, fy, c) {
  const bt = fy - 230, hy = bt - 50, sy = bt + 55, UP = 62, LO = 58;
  const g = {
    sL: [cx - 58, sy], eL: [cx - 58, sy + UP], sR: [cx + 58, sy], eR: [cx + 58, sy + UP],
    eyes: [cx, hy - 6], mouth: [cx, hy + 30], ant: [cx, hy - 78], head: [cx, hy], body: [cx, fy - 140], feet: [cx, fy],
  };
  const limb = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c.ink}" stroke-width="16" stroke-linecap="round"/>`;
  const arm = (id, sx) => `<g id="${p}-${id}">${limb(sx, sy, sx, sy + UP)}<g id="${p}-${id}f">${limb(sx, sy + UP, sx, sy + UP + LO)}<circle cx="${sx}" cy="${sy + UP + LO}" r="14" fill="${c.yellow}" ${stroke(c)}/></g></g>`;
  const shoe = (x) => `<ellipse cx="${x}" cy="${fy - 6}" rx="26" ry="12" fill="${c.blue}" ${stroke(c)}/>`;
  const svg = `<g id="${p}-host"><g id="${p}-bob">
    ${limb(cx - 30, fy - 70, cx - 30, fy - 12)}${limb(cx + 30, fy - 70, cx + 30, fy - 12)}${shoe(cx - 34)}${shoe(cx + 34)}
    <rect x="${cx - 60}" y="${bt}" width="120" height="180" rx="60" fill="${c.coral}" ${stroke(c)}/>
    <circle cx="${cx}" cy="${bt + 112}" r="18" fill="${c.yellow}" ${stroke(c)}/>
    ${arm("aL", cx - 58)}${arm("aR", cx + 58)}
    <g id="${p}-ant">${limb(cx, hy - 78, cx, hy - 128)}<circle cx="${cx}" cy="${hy - 140}" r="16" fill="${c.mint}" ${stroke(c)}/></g>
    <circle cx="${cx}" cy="${hy}" r="80" fill="${c.yellow}" ${stroke(c)}/>
    <circle cx="${cx - 52}" cy="${hy + 20}" r="11" fill="${c.coral}"/><circle cx="${cx + 52}" cy="${hy + 20}" r="11" fill="${c.coral}"/>
    <g id="${p}-eyes"><circle cx="${cx - 28}" cy="${hy - 6}" r="8" fill="${c.ink}"/><circle cx="${cx + 28}" cy="${hy - 6}" r="8" fill="${c.ink}"/></g>
    <path id="${p}-mouth" d="M${cx - 20},${hy + 26} Q${cx},${hy + 52} ${cx + 20},${hy + 26}" fill="none" ${stroke(c)}/>
  </g></g>`;
  return { svg, g };
}

/** One raindrop refraction path for index of refraction n. Impact parameter b is a fraction of R. */
export function dropRay(C, R, bFrac, nIn, fanDeg = 0) {
  const b = R * bFrac, i = Math.asin(bFrac), r = Math.asin(bFrac / nIn);
  const P1 = [C[0] - R * Math.cos(i), C[1] - b];
  const d1 = [Math.cos(i - r), Math.sin(i - r)], chord = 2 * R * Math.cos(r);
  const P2 = [P1[0] + chord * d1[0], P1[1] + chord * d1[1]];
  const n2 = [(P2[0] - C[0]) / R, (P2[1] - C[1]) / R];
  const dn = d1[0] * n2[0] + d1[1] * n2[1];
  const d2 = [d1[0] - 2 * dn * n2[0], d1[1] - 2 * dn * n2[1]];
  const P3 = [P2[0] + chord * d2[0], P2[1] + chord * d2[1]];
  const thN = Math.atan2(P3[1] - C[1], P3[0] - C[0]);
  const sigma = Math.sign(Math.atan2(d2[1], d2[0]) - thN) || 1;
  const exit = thN + sigma * (i + (fanDeg * Math.PI) / 180);   // fanDeg exaggerates the colour spread so six rays stay separate
  return { P1, P2, P3, dirExit: [Math.cos(exit), Math.sin(exit)] };
}
