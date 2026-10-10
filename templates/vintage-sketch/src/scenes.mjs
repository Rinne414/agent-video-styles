// Scene markup. Each builder returns the inner SVG for one scene.
// Conventions read by anim.js: .c contour (data-s = stage), .h hatch (data-i = order),
// .lead / .dot / .nt notes, ids p1-gear, p1-weight, p1-rope, p2-wheel, p2-anchor, p3-pend, ...
import {
  arrowArc, arrowHead, barPath, circlePath, gearPath, hatchLines, pol, sectorPath, spiralPath, spokesPath,
} from "./geom.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const num = (n) => Math.round(n * 100) / 100;

/** Per-scene helper that numbers hatch lines so they draw one after another. */
export function makeScene(theme) {
  let hatchCount = 0;
  const c = (d, stage, id = "") =>
    `<path class="dr c" data-s="${stage}"${id ? ` id="${id}"` : ""} pathLength="1" d="${d}"/>`;
  const hatch = (clipId, clipD, bbox) => {
    const lines = hatchLines(bbox, theme.hatchGap).map((d) => `<path class="dr h" data-i="${hatchCount++}" pathLength="1" d="${d}"/>`);
    return `<clipPath id="${clipId}"><path d="${clipD}"/></clipPath><g clip-path="url(#${clipId})">${lines.join("")}</g>`;
  };
  const text = (cls, x, y, s, extra = "") => `<text class="${cls}" x="${x}" y="${y}"${extra}>${esc(s)}</text>`;
  const note = (n) => {
    const lead = n.lead
      ? `<path class="dr lead" pathLength="1" d="M${n.lead[0]} ${n.lead[1]}L${n.lead[2]} ${n.lead[3]}"/><circle class="dot" cx="${n.lead[2]}" cy="${n.lead[3]}" r="3"/>`
      : "";
    return `<g class="note" data-at="${n.at}" data-lead="${n.lead ? 1 : 0}">${lead}${text("nt", n.x, n.y, n.text)}</g>`;
  };
  const header = (p) =>
    text("head", 160, 232, p.head) +
    text("fig", 1080, 940, `${p.fig.toUpperCase()}  ·  ${p.caption.toUpperCase()}`);
  return { c, hatch, text, note, header, hatchCount: () => hatchCount };
}

export function titleScene(theme, content) {
  const s = makeScene(theme);
  const G = { cx: 1450, cy: 560 };
  const gear = [
    s.c(gearPath({ ...G, n: 18, rRoot: 215, rTip: 250, type: "spur" }), 0),
    s.c(circlePath(G.cx, G.cy, 190), 1),
    s.c(circlePath(G.cx, G.cy, 44), 1),
    s.c(circlePath(G.cx, G.cy, 16), 2),
    s.c(spokesPath({ ...G, n: 6, r1: 44, r2: 190, half: 9 }), 2),
  ].join("");
  const shade = s.hatch("t-clip", sectorPath(G.cx, G.cy, 190, 215, 20, 110), [1376, 625, 276, 150]);
  const lines = content.title.lines.map((l, i) => s.text("tl", 170, 470 + i * 150, l)).join("");
  return (
    `<g class="drift"><g id="t-gear">${gear}${shade}</g>${lines}` +
    s.text("era", 174, 740, content.title.era) +
    `<path class="dr c rule" data-s="3" pathLength="1" d="M174 682L1000 682"/></g>`
  );
}

export function plate1(theme, p) {
  const s = makeScene(theme);
  const D = { cx: 655, cy: 420 };
  const gear = [
    s.c(gearPath({ ...D, n: 20, rRoot: 124, rTip: 146, type: "spur" }), 0),
    s.c(circlePath(D.cx, D.cy, 95), 0),
    s.c(circlePath(D.cx, D.cy, 78), 1),
    s.c(spokesPath({ ...D, n: 5, r1: 22, r2: 78, half: 6, rot0: 18 }), 1),
    s.c(circlePath(D.cx, D.cy, 22), 1),
    s.c(circlePath(D.cx, D.cy, 8), 1),
  ].join("");
  const rope = `<path id="p1-rope" class="dr c" data-s="2" pathLength="1" d="M750 420L750 618"/>`;
  const weight =
    s.c(circlePath(750, 628, 10), 2) +
    s.c("M700 655H800V800H700Z", 2) +
    s.c("M700 655L722 637H822L800 655", 2) +
    s.c("M800 655L822 637V782L800 800", 2) +
    s.hatch("w-clip", "M800 655L822 637V782L800 800Z", [800, 637, 22, 163]);
  const sp = { cx: 495, cy: 720 };
  const spring =
    s.c(circlePath(sp.cx, sp.cy, 100), 3) +
    s.c(circlePath(sp.cx, sp.cy, 86), 3) +
    s.c(spiralPath({ ...sp, r1: 12, r2: 78, turns: 4 }), 3) +
    s.c(circlePath(sp.cx, sp.cy, 11), 3) +
    s.hatch("s-clip", sectorPath(sp.cx, sp.cy, 86, 100, 20, 150), [408, 744, 181, 76]);
  const arrows =
    `<path class="dr lead" pathLength="1" d="${arrowArc(D.cx, D.cy, 168, 196, 246)}"/>` +
    `<path class="dr lead" pathLength="1" d="M650 650L650 730${arrowHead(650, 730, 90)}"/>`;
  return (
    `<g class="drift">${s.header(p)}<g id="p1-gear">${gear}</g>${rope}<g id="p1-weight">${weight}</g>` +
    `${spring}<g class="arrows">${arrows}</g>${p.notes.map(s.note).join("")}</g>`
  );
}

export function plate2(theme, p) {
  const s = makeScene(theme);
  const W = { cx: 640, cy: 700 };
  const P = [640, 400];
  const wheel = [
    s.c(gearPath({ ...W, n: 12, rRoot: 160, rTip: 192, type: "ratchet", rot0: 232 }), 0),
    s.c(circlePath(W.cx, W.cy, 140), 0),
    s.c(spokesPath({ ...W, n: 6, r1: 28, r2: 140, half: 8, rot0: 10 }), 1),
    s.c(circlePath(W.cx, W.cy, 28), 1),
    s.c(circlePath(W.cx, W.cy, 9), 1),
  ].join("");
  const shade = s.hatch("w2-clip", sectorPath(W.cx, W.cy, 140, 160, 40, 140), [517, 790, 246, 70]);
  const aL = pol(W.cx, W.cy, 196, 235);
  const aR = pol(W.cx, W.cy, 196, 305);
  const pallet = (a, deg) => {
    const t = [Math.cos(((deg + 90) * Math.PI) / 180), Math.sin(((deg + 90) * Math.PI) / 180)];
    const u = [Math.cos((deg * Math.PI) / 180), Math.sin((deg * Math.PI) / 180)];
    const q = (ts, us) => `${num(a[0] + t[0] * ts + u[0] * us)} ${num(a[1] + t[1] * ts + u[1] * us)}`;
    return `M${q(-30, -13)}L${q(30, -13)}L${q(24, 12)}L${q(-24, 12)}Z`;
  };
  const toward = (a, r) => {
    const [dx, dy] = [a[0] - P[0], a[1] - P[1]];
    const l = Math.hypot(dx, dy);
    return [P[0] + (dx / l) * r, P[1] + (dy / l) * r];
  };
  const anchor = [
    s.c(barPath(toward(aL, 22), toward(aL, 188), 11), 2),
    s.c(barPath(toward(aR, 22), toward(aR, 188), 11), 2),
    s.c(pallet(aL, 235), 3),
    s.c(pallet(aR, 305), 3),
    s.c(barPath([P[0], P[1] - 22], [P[0], 318], 6), 2),
    s.c(circlePath(P[0], P[1], 22), 2),
    s.c(circlePath(P[0], P[1], 7), 2),
  ].join("");
  const arrow = `<path class="dr lead" pathLength="1" d="${arrowArc(W.cx, W.cy, 228, 150, 205)}"/>`;
  return (
    `<g class="drift">${s.header(p)}<g id="p2-wheel">${wheel}</g>${shade}<g id="p2-anchor">${anchor}</g>` +
    `${arrow}${p.notes.map(s.note).join("")}</g>`
  );
}

export function plate3(theme, p) {
  const s = makeScene(theme);
  const Q = { cx: 640, cy: 330 };
  const bob = { cx: 640, cy: 750 };
  const bracket =
    s.c("M556 288H724V316H556Z", 0) +
    s.hatch("b-clip", "M556 288H724V316H556Z", [556, 288, 168, 28]) +
    s.c(circlePath(Q.cx, Q.cy, 13), 0);
  const pend =
    s.c(barPath([640, 343], [640, 678], 5), 1) +
    s.c(circlePath(bob.cx, bob.cy, 74), 2) +
    s.c(circlePath(bob.cx, bob.cy, 60), 2) +
    s.hatch("bb-clip", sectorPath(bob.cx, bob.cy, 30, 74, 10, 130), [592, 755, 122, 69]);
  const R = 520;
  const e1 = pol(Q.cx, Q.cy, R, 76);
  const e2 = pol(Q.cx, Q.cy, R, 104);
  const arc =
    `M${num(e1[0])} ${num(e1[1])}A${R} ${R} 0 0 1 ${num(e2[0])} ${num(e2[1])}` +
    arrowHead(e1[0], e1[1], 76 - 90) +
    arrowHead(e2[0], e2[1], 104 + 90);
  return (
    `<g class="drift">${s.header(p)}${bracket}<g id="p3-pend">${pend}</g>` +
    `<path class="dr lead" pathLength="1" d="${arc}"/>${p.notes.map(s.note).join("")}</g>`
  );
}

export function colophonScene(theme, content) {
  const s = makeScene(theme);
  const col = content.colophon;
  const ys = [380, 530, 680];
  const gearIcon = gearPath({ cx: 330, cy: ys[1] - 36, n: 10, rRoot: 30, rTip: 44, type: "spur" });
  const icons =
    s.c(`M330 ${ys[0] - 100}L330 ${ys[0] - 78}`, 0) +
    s.c(circlePath(330, ys[0] - 70, 8), 0) +
    s.c(`M300 ${ys[0] - 62}H360V${ys[0] - 8}H300Z`, 0) +
    s.c(gearIcon, 0) +
    s.c(circlePath(330, ys[1] - 36, 9), 0) +
    s.c(`M330 ${ys[2] - 100}L330 ${ys[2] - 28}`, 0) +
    s.c(circlePath(330, ys[2] - 10, 20), 0);
  const lines = col.lines.map((l, i) => s.text("cl", 470, ys[i], l)).join("");
  const stamp =
    `<g id="c-stamp"><rect class="sb" x="1400" y="780" width="380" height="150" rx="14"/>` +
    `<rect class="sb2" x="1412" y="792" width="356" height="126" rx="8"/>` +
    `<text class="st" x="1590" y="870" text-anchor="middle">${esc(col.stamp)}</text></g>`;
  return `<g class="drift">${icons}${lines}${s.text("src", 474, 820, col.source)}${stamp}</g>`;
}
