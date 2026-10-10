// Drawing primitives. Everything is absolute SVG coordinates, no transform attributes,
// so GSAP can rotate/scale with svgOrigin. Shapes are circles, blobs and bezier hills.
import { P, T, W, H, darken, mulberry32 } from "./theme.mjs";

const num = (v) => Math.round(v * 10) / 10;
const ink = `stroke="${T.ink}" stroke-opacity="${T.inkOpacity}" stroke-width="${T.outline}" stroke-linecap="round" stroke-linejoin="round"`;

// Watercolor wash: fill at 85% plus an inner stroke of the same hue darkened 12%.
export function wash(id, d, fill, extra = "") {
  const edge = darken(fill, T.edgeDarken);
  return `<clipPath id="${id}"><path d="${d}"/></clipPath>
<path d="${d}" fill="${fill}" fill-opacity="${T.wash}" ${extra}/>
<path d="${d}" fill="none" stroke="${edge}" stroke-width="${T.washEdge * 2}" clip-path="url(#${id})"/>`;
}

export function sky(pid, color = P.sky) {
  return `<rect width="${W}" height="${H}" fill="${color}"/>`;
}

export function sun(cx, cy, r) {
  return `<g class="sun"><circle cx="${cx}" cy="${cy}" r="${r * 1.7}" fill="${P.paper}" fill-opacity="0.5"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.sun}" fill-opacity="${T.wash}" ${ink}/></g>`;
}

export function moon(cx, cy, r, skyColor) {
  return `<g class="sun"><circle cx="${cx}" cy="${cy}" r="${r * 1.6}" fill="${P.paper}" fill-opacity="0.35"/>
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${P.sun}" fill-opacity="${T.wash}"/>
<circle cx="${cx + r * 0.45}" cy="${cy - r * 0.2}" r="${r * 0.85}" fill="${skyColor}"/></g>`;
}

// Soft background clouds that drift 40 px per page
export function bgClouds(spec) {
  return spec
    .map(([x, y, s]) => {
      const c = [[0, 0, 46], [52, -18, 58], [118, 0, 44], [58, 14, 52]];
      const body = c.map(([dx, dy, r]) => `<circle cx="${num(x + dx * s)}" cy="${num(y + dy * s)}" r="${num(r * s)}"/>`).join("");
      return `<g class="drift" fill="${P.cloud}" fill-opacity="0.8">${body}</g>`;
    })
    .join("");
}

export function hills(pid, wetOpacity, dryOpacity = 1) {
  const back = "M-60 830 C300 760 700 810 1000 790 S1600 740 1980 800 L1980 1140 L-60 1140 Z";
  const front = "M-60 905 C400 845 900 945 1300 885 S1800 855 1980 895 L1980 1140 L-60 1140 Z";
  const layer = (cls, c1, c2, op) =>
    `<g class="${cls}" opacity="${op}">${wash(`${pid}-${cls}-b`, back, c1)}${wash(`${pid}-${cls}-f`, front, c2)}</g>`;
  return (
    layer("dryground", darken(P.peach, 0.04), P.peach, dryOpacity) +
    layer("wetground", darken(P.meadow, 0.06), P.meadow, wetOpacity)
  );
}

const MOKO_BLOBS = [[-130, 25, 88], [-55, -35, 102], [55, -55, 100], [135, 5, 86], [0, 45, 108], [-60, 60, 80], [70, 55, 82]];

function face(pose, X, Y, S) {
  const p = (dx, dy) => `${num(X + dx * S)} ${num(Y + dy * S)}`;
  const dot = (dx, dy) => `<circle cx="${num(X + dx * S)}" cy="${num(Y + dy * S)}" r="${num(11 * S)}" fill="${P.ink}"/>`;
  const line = (d, w = 6) => `<path d="${d}" fill="none" stroke="${P.ink}" stroke-width="${num(w * S)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const cheek = (dx, r = 20) => `<circle class="cheek" cx="${num(X + dx * S)}" cy="${num(Y + 50 * S)}" r="${num(r * S)}" fill="${P.rose}" fill-opacity="0.75"/>`;
  const eyes = (inner) => `<g class="eyes">${inner}</g>`;
  switch (pose) {
    case "strain":
      return line(`M${p(-68, -2)} L${p(-34, 10)} L${p(-68, 22)}`) + line(`M${p(68, -2)} L${p(34, 10)} L${p(68, 22)}`) +
        cheek(-96, 27) + cheek(96, 27) + `<ellipse cx="${X}" cy="${num(Y + 46 * S)}" rx="${num(11 * S)}" ry="${num(9 * S)}" fill="${darken(P.rose, 0.3)}"/>`;
    case "sad":
      return eyes(dot(-48, 14) + dot(48, 14)) + line(`M${p(-70, 0)} L${p(-30, -10)}`, 5) + line(`M${p(70, 0)} L${p(30, -10)}`, 5) +
        line(`M${p(-18, 60)} Q${p(0, 42)} ${p(18, 60)}`) + cheek(-92) + cheek(92) +
        `<path d="M${p(62, 34)} q${num(-9 * S)} ${num(16 * S)} 0 ${num(26 * S)} q${num(9 * S)} ${num(-10 * S)} 0 ${num(-26 * S)}z" fill="${darken(P.sky, 0.15)}"/>`;
    case "calm":
      return line(`M${p(-64, 14)} Q${p(-48, -4)} ${p(-32, 14)}`) + line(`M${p(32, 14)} Q${p(48, -4)} ${p(64, 14)}`) +
        line(`M${p(-18, 42)} Q${p(0, 58)} ${p(18, 42)}`) + cheek(-92) + cheek(92);
    case "joy":
      return eyes(dot(-48, 10) + dot(48, 10)) +
        `<path d="M${p(-24, 36)} Q${p(0, 82)} ${p(24, 36)} Z" fill="${darken(P.rose, 0.28)}" stroke="${P.ink}" stroke-opacity="0.8" stroke-width="${num(5 * S)}" stroke-linejoin="round"/>` +
        cheek(-92, 22) + cheek(92, 22);
    case "sleep":
      return line(`M${p(-64, 6)} Q${p(-48, 22)} ${p(-32, 6)}`) + line(`M${p(32, 6)} Q${p(48, 22)} ${p(64, 6)}`) +
        line(`M${p(-12, 42)} Q${p(0, 52)} ${p(12, 42)}`) + cheek(-92) + cheek(92);
    default:
      return eyes(dot(-48, 10) + dot(48, 10)) + line(`M${p(-18, 42)} Q${p(0, 62)} ${p(18, 42)}`) + cheek(-92) + cheek(92);
  }
}

// Moko the cloud: 7 overlapping circles, outline drawn by stroking all then covering the inside.
export function moko(pid, X, Y, S, pose) {
  const c = MOKO_BLOBS.map(([dx, dy, r]) => [num(X + dx * S), num(Y + dy * S), num(r * S)]);
  const ring = c.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join("");
  const clip = `<clipPath id="${pid}-mk">${ring}</clipPath>`;
  const shade = [[-40, 120, 150], [90, 110, 120]]
    .map(([dx, dy, r]) => `<ellipse cx="${num(X + dx * S)}" cy="${num(Y + dy * S)}" rx="${num(r * S)}" ry="${num(55 * S)}" fill="${P.lavender}" fill-opacity="0.55"/>`)
    .join("");
  return `<g class="hero moko" data-pose="${pose}">
<g class="bob" data-bob="1"><g class="squash">
${clip}
<g fill="${P.cloud}" stroke="${T.ink}" stroke-opacity="${T.inkOpacity}" stroke-width="${T.outline * 2}">${ring}</g>
<g fill="${P.cloud}">${ring}</g>
<g clip-path="url(#${pid}-mk)">${shade}</g>
${face(pose, X, Y, S)}
</g></g></g>`;
}

// Flower: stem + leaves (static) and a head group that rotates about the stem tip.
// Head state is data-driven: data-droop (deg), data-open (0..1).
export function flower(pid, i, { x, y, h, lean = 0, color, k = 1.25, droop = 140, open = 0.45 }) {
  const tx = num(x + lean), ty = num(y - h), hr = 50 * k;
  const stem = `<path d="M${x} ${y} Q${num(x + lean * 0.2)} ${num(y - h * 0.5)} ${tx} ${ty}" fill="none" stroke="${T.stem}" stroke-width="${num(11 * k)}" stroke-linecap="round"/>`;
  const my = num(y - h * 0.38), l = 80 * k;
  const leaf = (s) => `<path d="M${x} ${my} c${num(s * l * 0.35)} ${num(-l * 0.4)} ${num(s * l * 0.9)} ${num(-l * 0.35)} ${num(s * l)} ${num(-l * 0.1)} c${num(-s * l * 0.2)} ${num(l * 0.4)} ${num(-s * l * 0.7)} ${num(l * 0.45)} ${num(-s * l)} ${num(l * 0.1)}z" fill="${P.meadow}" fill-opacity="0.9" stroke="${T.stem}" stroke-width="4"/>`;
  const cx = tx, cy = num(ty - hr);
  const petals = [0, 1, 2, 3, 4, 5]
    .map((n) => `<g class="pt" data-a="${n * 60 + 30}"><circle cx="${cx}" cy="${cy}" r="${num(34 * k)}" fill="${color}" fill-opacity="${T.wash}" ${ink}/></g>`)
    .join("");
  const head = `<g class="head" data-tipx="${tx}" data-tipy="${ty}" data-cx="${cx}" data-cy="${cy}" data-k="${k}" data-droop="${droop}" data-open="${open}" data-color="${color}">
${petals}<g class="ctr"><circle cx="${cx}" cy="${cy}" r="${num(20 * k)}" fill="${P.sun}" ${ink}/></g></g>`;
  return `<g class="fl" id="${pid}-fl${i}">${stem}${leaf(1)}${leaf(-1)}${head}</g>`;
}

export function garden(pid, spec, opts = {}) {
  const { hs = 1, ...rest } = opts;
  return spec.map((f, i) => flower(pid, i, { ...f, h: f.h * hs, ...rest })).join("");
}

export const GARDEN = [
  { x: 300, y: 985, h: 170, lean: -22, color: P.rose },
  { x: 575, y: 1000, h: 225, lean: 16, color: P.lavender },
  { x: 835, y: 960, h: 150, lean: -10, color: P.sun },
  { x: 1115, y: 995, h: 205, lean: 22, color: P.peach },
  { x: 1385, y: 965, h: 160, lean: -16, color: P.rose },
  { x: 1650, y: 1000, h: 215, lean: 10, color: P.lavender },
];

export const GARDEN_BIG = [
  { x: 380, y: 1040, h: 330, lean: -30, color: P.rose },
  { x: 800, y: 1050, h: 280, lean: 20, color: P.lavender },
  { x: 1220, y: 1045, h: 340, lean: -18, color: P.sun },
  { x: 1580, y: 1050, h: 290, lean: 24, color: P.peach },
];

// Teardrops; positions are driven per frame from a seeded layout
export function rain(pid, n, seed, fan) {
  const rnd = mulberry32(seed);
  let out = "";
  for (let i = 0; i < n; i++) {
    const x0 = fan.x0 + rnd() * (fan.x1 - fan.x0), x1 = fan.g0 + rnd() * (fan.g1 - fan.g0);
    const ph = rnd(), sp = 0.55 + rnd() * 0.25;
    out += `<path class="drop" data-x0="${num(x0)}" data-x1="${num(x1)}" data-ph="${num(ph * 100) / 100}" data-sp="${num(sp * 100) / 100}" d="M0 -16 C9 -2 12 4 6 12 C2 17 -2 17 -6 12 C-12 4 -9 -2 0 -16Z" fill="${T.drop}" fill-opacity="0.9"/>`;
  }
  return `<g class="rain" opacity="0">${out}</g>`;
}

export function stars(seed, n) {
  const rnd = mulberry32(seed);
  let o = "";
  for (let i = 0; i < n; i++) {
    const x = 160 + rnd() * 1600, y = 330 + rnd() * 160, r = 5 + rnd() * 5;
    o += `<circle class="star" cx="${num(x)}" cy="${num(y)}" r="${num(r)}" fill="${P.sun}"/>`;
  }
  return o;
}

export function rainbow(cx, cy, r0) {
  const cols = [P.rose, P.peach, P.sun, P.meadow, P.sky, P.lavender];
  return `<g class="rainbow" fill="none" stroke-linecap="round">` + cols.map((c, i) => {
    const r = r0 - i * 22;
    return `<path pathLength="1" d="M${cx - r} ${cy} A${r} ${r} 0 0 1 ${cx + r} ${cy}" stroke="${darken(c, 0.04)}" stroke-opacity="0.9" stroke-width="22" stroke-dasharray="1 2"/>`;
  }).join("") + `</g>`;
}

export function defs() {
  const t = T.grain, w = T.wobble;
  return `<svg width="0" height="0" style="position:absolute"><defs>
<filter id="wob" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence id="wobNoise" type="fractalNoise" baseFrequency="${w.freq}" numOctaves="2" seed="1" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${w.scale}" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="grain" filterUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><feTurbulence type="fractalNoise" baseFrequency="${t.freq}" numOctaves="${t.octaves}" seed="${t.seed}"/><feColorMatrix type="saturate" values="0"/></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="60%" stop-color="${P.ink}" stop-opacity="0"/><stop offset="100%" stop-color="${P.ink}" stop-opacity="0.07"/></radialGradient>
</defs></svg>`;
}

export function paperLayers() {
  return `<rect class="grain" width="${W}" height="${H}" filter="url(#grain)" opacity="${T.grain.opacity}" style="mix-blend-mode:multiply"/>
<rect width="${W}" height="${H}" fill="url(#vig)"/>`;
}
