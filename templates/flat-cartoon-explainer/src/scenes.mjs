// Scene markup (build time). Each scene = one full-frame SVG layer + HTML label pills.
import { OUTLINE, RAY_W, RAY_INK, RAINBOW, beam, dropSvg, dropPath, sunSvg, cloudSvg, starSvg, hostSvg, dropRay } from "./geom.mjs";

const W = 1920, H = 1080, FLOOR_Y = 930;
const svgWrap = (id, inner) => `<svg id="${id}" class="layer" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${inner}</svg>`;
const label = (id, text, x, y, bg = "var(--white)") =>
  `<div class="lblw" style="left:${x}px;top:${y}px"><div id="${id}" class="lbl" style="background:${bg}">${text}</div></div>`;

// mulberry32: seeded PRNG so scatter layouts are deterministic
function rng(seed) {
  let a = seed;
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function sceneOpen(c, L) {
  const host = hostSvg("open", 300, FLOOR_Y, c);
  const drops = Array.from({ length: 7 }, (_, i) => dropSvg(`open-rd${i}`, 1010 + i * 62, 640, 15, c.blue, c)).join("");
  const words = L.title.split(" ").map((w, i) =>
    w === "rainbow"
      ? `<span class="tw rb">${[...w].map((ch, k) => `<i style="color:${c[RAINBOW[k % 6]]}">${ch}</i>`).join("")}</span>`
      : `<span class="tw">${w}</span>`).join(" ");
  const bc = [500, 490], br = 68, pt = (deg) => `${(bc[0] + br * Math.cos((deg * Math.PI) / 180)).toFixed(1)},${(bc[1] + br * Math.sin((deg * Math.PI) / 180)).toFixed(1)}`;
  const bubble = `<g id="open-bub"><path d="M${pt(112)} L400,610 L${pt(146)} A${br},${br} 0 1 1 ${pt(112)} Z" fill="${c.white}" stroke="${c.ink}" stroke-width="${OUTLINE}" stroke-linejoin="round"/><text x="${bc[0]}" y="${bc[1] + 30}" text-anchor="middle" font-family="Baloo 2" font-weight="700" font-size="92" fill="${c.ink}">?</text></g>`;
  const inner = `${sunSvg("open-sun", 1680, 470, 72, c)}${cloudSvg("open-cloud", 1230, 500, 1.15, c)}${drops}${host.svg}${bubble}`;
  return { html: `${svgWrap("open-svg", inner)}<div id="open-title" class="title" style="left:1110px;top:150px">${words}</div>`, g: { host: host.g } };
}

function sceneWhite(c, L) {
  const host = hostSvg("white", 300, FLOOR_Y, c);
  const S = [1010, 310];
  let fan = "";
  const ends = RAINBOW.map((_, i) => [1740, 310 + (i - 2.5) * 96]);
  RAINBOW.forEach((k, i) => { fan += beam(`white-f${i}`, `M${S[0]},${S[1]} L${ends[i][0]},${ends[i][1]}`, c[k], c); });
  const inner = `${beam("white-beam", `M600,270 L${S[0]},${S[1]}`, c.white, c)}${sunSvg("white-sun", 600, 270, 82, c)}${fan}${host.svg}`;
  return {
    html: `${svgWrap("white-svg", inner)}${label("white-l1", L.whiteLight, 950, 200)}${label("white-l2", L.allColors, 1500, 700)}`,
    g: { host: host.g, S },
  };
}

function sceneDrop(c, L) {
  const host = hostSvg("drop", 300, FLOOR_Y, c);
  const C = [1260, 375], R = 250, BF = 0.86, N = 1.333;
  const white = dropRay(C, R, BF, N, N);
  const { P1, P2, P3 } = white;
  const rayPath = (...pts) => pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");
  const SUN = [330, P1[1]];
  const SUN_R = 58;
  const incoming = beam("drop-r1", rayPath([SUN[0] + 80, P1[1]], P1), c.white, c);
  const inside1 = beam("drop-r2", rayPath(P1, P2), c.white, c);
  const inside2 = beam("drop-r3", rayPath(P2, P3), c.white, c);
  const LEN = 290;
  const exits = RAINBOW.map((k, i) => {
    const dir = dropRay(C, R, BF, N, (i - 2.5) * 7).dirExit;
    const end = [P3[0] + dir[0] * LEN, P3[1] + dir[1] * LEN];
    return { k, end, svg: beam(`drop-x${i}`, rayPath(P3, end), c[k], c) };
  });
  const rim = `<circle id="drop-body" cx="${C[0]}" cy="${C[1]}" r="${R}" fill="${c.white}" fill-opacity="0.75" stroke="${c.ink}" stroke-width="${OUTLINE}"/><path d="M${C[0] - 237},${C[1] + 63} A${R - 20},${R - 20} 0 0 0 ${C[0] - 188},${C[1] + 158}" fill="none" stroke="${c.blue}" stroke-width="12" stroke-linecap="round" opacity="0.55"/>`;
  const star = starSvg("drop-star", P2[0], P2[1], 48, c.yellow, c) + `<circle id="drop-p3" cx="${P3[0].toFixed(1)}" cy="${P3[1].toFixed(1)}" r="20" fill="${c.yellow}" stroke="${c.ink}" stroke-width="${OUTLINE}"/>`;
  const p1 = `<circle id="drop-p1" cx="${P1[0].toFixed(1)}" cy="${P1[1].toFixed(1)}" r="20" fill="${c.yellow}" stroke="${c.ink}" stroke-width="${OUTLINE}"/>`;
  const inner = `${sunSvg("drop-sun", SUN[0], SUN[1], SUN_R, c)}${rim}${incoming}${inside1}${inside2}${exits.map((e) => e.svg).join("")}${star}${p1}${host.svg}`;
  const eR = exits[0].end, eV = exits[5].end;
  return {
    html: `${svgWrap("drop-svg", inner)}${label("drop-lref", L.refraction, P1[0] - 30, P1[1] - 85)}${label("drop-lb", L.bounce, P2[0] + 150, P2[1] - 70)}${label("drop-lred", L.red, eR[0] + 110, eR[1] - 6, c.coral)}${label("drop-lvio", L.violet, eV[0] - 120, eV[1] + 5, c.violet)}`,
    g: { host: host.g, P1, P2, P3, C },
  };
}

function sceneEye(c, L) {
  const host = hostSvg("eye", 300, FLOOR_Y, c);
  const [hx, hy] = host.g.head;
  const xs = [1430, 1485, 1520, 1520, 1485, 1430], ys = [190, 314, 438, 562, 686, 810];
  const target = (i) => [hx + 84, hy - 30 + i * 12];
  const rays = RAINBOW.map((k, i) => beam(`eye-r${i}`, `M${xs[i] - 46},${ys[i]} L${target(i)[0]},${target(i)[1]}`, c[k], c)).join("");
  const drops = RAINBOW.map((k, i) => `<g id="eye-dg${i}">${dropSvg(`eye-d${i}`, xs[i], ys[i], 36, c.white, c)}<path id="eye-df${i}" d="${dropPath(xs[i], ys[i], 36)}" fill="${c[k]}" stroke="${c.ink}" stroke-width="${OUTLINE}" stroke-linejoin="round"/></g>`).join("");
  const ring = `<circle id="eye-ring" cx="${hx + 28}" cy="${hy - 6}" r="30" fill="none" stroke="${c.mint}" stroke-width="8"/>`;
  return {
    html: `${svgWrap("eye-svg", `${rays}${host.svg}${ring}${drops}`)}${label("eye-l1", L.eye, 640, 330)}${label("eye-lred", L.red, xs[0] + 150, ys[0], c.coral)}${label("eye-lvio", L.violet, xs[5] + 170, ys[5], c.violet)}`,
    g: { host: host.g, xs, ys },
  };
}

function sceneArc(c, L) {
  const host = hostSvg("arc", 240, FLOOR_Y, c);
  const CX = 1130, CY = 920, R0 = 600, BW = 38;
  const band = (i, k) => { const r = R0 - BW * i - BW / 2; return `M${CX - r},${CY} A${r},${r} 0 0 1 ${CX + r},${CY}`; };
  const arcs = RAINBOW.map((k, i) => beam(`arc-b${i}`, band(i, k), c[k], c).replace(new RegExp(`stroke-width="${RAY_INK}"`), `stroke-width="${BW + 2 * OUTLINE}"`).replace(new RegExp(`stroke-width="${RAY_W}"`), `stroke-width="${BW}"`)).join("");
  const rand = rng(7);
  let dots = "";
  for (let i = 0; i < 48; i++) {
    const a = Math.PI * (0.05 + 0.9 * rand()), rr = 380 + rand() * 260;
    dots += dropSvg(`arc-m${i}`, CX - Math.cos(a) * rr, CY - Math.sin(a) * rr * 0.98, 10 + rand() * 5, c.blue, c);
  }
  const inner = `<defs><clipPath id="arc-clip"><rect x="0" y="0" width="1920" height="921"/></clipPath></defs>${dots}<g clip-path="url(#arc-clip)">${arcs}</g>${cloudSvg("arc-cl", 560, 330, 0.8, c)}${cloudSvg("arc-cr", 1720, 330, 0.8, c)}${host.svg}`;
  return { html: svgWrap("arc-svg", inner), g: { host: host.g, CX, CY, R0, BW } };
}

function sceneWrap(c, L) {
  const host = hostSvg("wrap", 470, FLOOR_Y, c);
  const CX = 1400, CY = 920, R0 = 440, BW = 30;
  const arcs = RAINBOW.map((k, i) => {
    const r = R0 - BW * i - BW / 2;
    return beam(`wrap-b${i}`, `M${CX - r},${CY} A${r},${r} 0 0 1 ${CX + r},${CY}`, c[k], c)
      .replace(`stroke-width="${RAY_INK}"`, `stroke-width="${BW + 2 * OUTLINE}"`).replace(`stroke-width="${RAY_W}"`, `stroke-width="${BW}"`);
  }).join("");
  const sunRay = beam("wrap-sr", "M250,330 L420,560", c.yellow, c);
  const inner = `<defs><clipPath id="wrap-clip"><rect x="0" y="0" width="1920" height="921"/></clipPath></defs>${sunSvg("wrap-sun", 170, 250, 80, c)}${sunRay}<g clip-path="url(#wrap-clip)">${arcs}</g>${host.svg}`;
  return {
    html: `${svgWrap("wrap-svg", inner)}${label("wrap-l1", L.sunBehind, 540, 130)}${label("wrap-l2", L.recap, 1290, 330, c.yellow)}`,
    g: { host: host.g, CX, CY, R0, BW },
  };
}

export function buildScenes(c, L) {
  return { open: sceneOpen(c, L), white: sceneWhite(c, L), drop: sceneDrop(c, L), eye: sceneEye(c, L), arc: sceneArc(c, L), wrap: sceneWrap(c, L) };
}
