import { C, sceneCopy } from "../theme.mjs";
import { card, hl, kicker } from "./card.mjs";
import { annotation, head, box, barrel } from "../art.mjs";

// Dimension line with an arrow head at both ends (dash line drawn, heads pop).
function dim(x1, y1, x2, y2, cue, label, lx, ly, anchor = "middle") {
  const a = Math.atan2(y2 - y1, x2 - x1);
  return annotation({ d: `M${x1} ${y1} L${x2} ${y2}`, tipX: x2, tipY: y2, angle: a, cue, headSize: 20 }) +
    `<path class="arrow" d="${head(x1, y1, a + Math.PI, 20)}" data-pop data-ox="${x1}" data-oy="${y1}" data-cue="${cue}" data-after="draw"/>` +
    `<text x="${lx}" y="${ly}" font-size="36" text-anchor="${anchor}" fill="${C.ink}" data-in data-cue="${cue}">${label}</text>`;
}

function corrugated(x, y, w, h, color) {
  let s = box(x, y, w, h, color, { lines: false });
  const n = Math.floor(w / 14);
  for (let i = 1; i < n; i++) {
    s += `<line x1="${x + (w * i) / n}" y1="${y + 8}" x2="${x + (w * i) / n}" y2="${y + h - 8}" stroke="${C.ink}" stroke-opacity="0.3" stroke-width="2"/>`;
  }
  s += `<rect x="${x}" y="${y}" width="16" height="16" fill="${C.ink}"/><rect x="${x + w - 16}" y="${y}" width="16" height="16" fill="${C.ink}"/>`;
  s += `<rect x="${x}" y="${y + h - 16}" width="16" height="16" fill="${C.ink}"/><rect x="${x + w - 16}" y="${y + h - 16}" width="16" height="16" fill="${C.ink}"/>`;
  return s;
}

export default function s4() {
  const s = sceneCopy("s4");
  const W = 1180, H = 600;
  const h = 150, w40 = 760, w20 = 380;
  let art = `<rect width="${W}" height="${H}" fill="${C.diagramSky}"/>` +
    corrugated(60, 140, w40, h, C.boxBlue) +
    corrugated(60, 380, w20, h, C.boxRust);
  art += `<text x="860" y="172" font-size="30" fill="${C.ink}">${s.teu40}</text>` +
    `<text x="500" y="440" font-size="30" fill="${C.ink}">${s.teu20}</text>` +
    `<text x="500" y="486" font-size="22" fill="${C.ink}" fill-opacity="0.75">${s.teuNote}</text>`;
  const ann = `<svg class="ann" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    dim(60, 110, 820, 110, "forty", s.label40, 440, 92) +
    dim(60, 350, 440, 350, "twenty", s.label20, 250, 332) +
    dim(850, 140, 850, 290, "forty", "", 0, 0).replace(/<text[\s\S]*?<\/text>/, "") +
    `<text x="870" y="236" font-size="28" fill="${C.ink}" data-in data-cue="forty">${s.labelWidth}</text>` +
    `</svg>`;
  const diagram = card({
    x: 96, y: 170, w: 1200, h: 650, r: -1, cls: "photo", at: 0.1,
    inner: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${art}</svg>${ann}`,
    tagText: s.tagDiagram,
  });

  // Side card: one box on a ship, a train wagon and a truck.
  const rowY = [150, 340, 530];
  let side = "";
  const unit = (x, y) => corrugated(x, y, 120, 54, C.boxBlue);
  // ship
  side += `<path d="M30 ${rowY[0] + 60} L350 ${rowY[0] + 60} L320 ${rowY[0] + 100} L60 ${rowY[0] + 100} Z" fill="${C.hull}"/>` + unit(130, rowY[0] + 6);
  // train
  side += `<rect x="30" y="${rowY[1] + 60}" width="330" height="14" fill="${C.hull}"/>` + unit(120, rowY[1] + 6) +
    `<circle cx="90" cy="${rowY[1] + 86}" r="14" fill="${C.ink}"/><circle cx="300" cy="${rowY[1] + 86}" r="14" fill="${C.ink}"/>`;
  // truck
  side += `<rect x="50" y="${rowY[2] + 60}" width="230" height="12" fill="${C.hull}"/>` + unit(100, rowY[2] + 6) +
    `<rect x="284" y="${rowY[2] + 28}" width="62" height="44" fill="${C.hull}"/>` +
    `<circle cx="100" cy="${rowY[2] + 86}" r="14" fill="${C.ink}"/><circle cx="240" cy="${rowY[2] + 86}" r="14" fill="${C.ink}"/><circle cx="318" cy="${rowY[2] + 86}" r="14" fill="${C.ink}"/>`;
  s.carriers.forEach((n, i) => { side += `<text x="30" y="${rowY[i] - 10}" font-size="26" letter-spacing="4" fill="${C.ink}">${n}</text>`; });
  const sideCard = card({
    x: 1380, y: 150, w: 440, h: 790, r: 2, at: 0.45,
    inner: `<div class="serif" style="position:absolute;left:30px;top:24px;font-size:56px;color:${C.ink}">${s.sideTitle1}<br>${hl(s.sideTitle2, "ship")}</div>` +
      `<svg width="400" height="640" viewBox="0 0 400 640" style="position:absolute;left:0;top:130px">${side}</svg>`,
    tagText: s.tagSide,
  });
  return kicker(s.kicker) + diagram + sideCard;
}
