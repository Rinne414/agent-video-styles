import { C, sceneCopy } from "../theme.mjs";
import { card, hl, kicker } from "./card.mjs";
import { annotation, arc, angleTo, barrel, crate, sack, figure, waves, wob } from "../art.mjs";

export default function s2() {
  const s = sceneCopy("s2");
  const W = 980, H = 620;
  // Ship (left), dock + crane (right), a bundle swinging between them.
  let art = `<rect width="${W}" height="${H}" fill="${C.diagramSky}"/>` +
    `<rect y="470" width="${W}" height="150" fill="${C.diagramWater}"/>` + waves(0, 620, 490, 5, 4) +
    // hull + superstructure
    `<path d="M40 380 L580 380 L540 478 L96 478 Z" fill="${C.hull}"/>` +
    `<rect x="70" y="300" width="110" height="80" fill="#CFC4AA" stroke="${C.ink}" stroke-width="3"/>` +
    `<rect x="110" y="262" width="34" height="38" fill="${C.boxRust}" stroke="${C.ink}" stroke-width="3"/>` +
    `<rect x="210" y="352" width="320" height="28" fill="#B8AE96" stroke="${C.ink}" stroke-width="3"/>` +
    `<line x1="300" y1="352" x2="300" y2="250" stroke="${C.ink}" stroke-width="6"/>` +
    // dock
    `<rect x="650" y="430" width="330" height="190" fill="#8F8574"/>` +
    `<rect x="640" y="420" width="340" height="18" fill="#6E6556"/>` +
    // crane
    `<rect x="800" y="190" width="26" height="232" fill="${C.ink}"/>` +
    `<line x1="813" y1="200" x2="410" y2="150" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>` +
    `<line x1="813" y1="200" x2="880" y2="190" stroke="${C.ink}" stroke-width="9" stroke-linecap="round"/>` +
    // cable and sling with loose bundle
    `<line x1="410" y1="152" x2="410" y2="262" stroke="${C.ink}" stroke-width="3"/>` +
    `<line x1="410" y1="262" x2="372" y2="312" stroke="${C.ink}" stroke-width="3"/><line x1="410" y1="262" x2="448" y2="312" stroke="${C.ink}" stroke-width="3"/>` +
    `<path d="M360 312 L460 312" stroke="${C.ink}" stroke-width="4"/>` +
    crate(366, 318, 48, 40) + barrel(418, 316, 34, 44) + sack(380, 360, 38, 44) +
    // piles on the dock
    crate(670, 384, 52, 38) + crate(726, 384, 52, 38) + crate(698, 344, 52, 38) + barrel(850, 376, 34, 44) + barrel(892, 376, 34, 44) + sack(930, 380, 36, 42) +
    figure(780, 392, 0.9, -1) + figure(626, 400, 0.9, -1) + figure(540, 330, 0.8, 1);
  // annotations: days in port, one sling at a time
  const port = arc(160, 96, 150, 220, 232, 292, 3);
  const sling = arc(640, 90, 640, 240, 478, 300, 5);
  const ann = `<svg class="ann" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<text x="40" y="82" font-size="32" fill="${C.ink}" data-in data-cue="days">${s.diagramLabelPort}</text>` +
    annotation({ d: port, tipX: 232, tipY: 292, angle: angleTo(150, 220, 232, 292), cue: "days" }) +
    `<text x="540" y="76" font-size="32" fill="${C.ink}" data-in data-cue="piece">${s.diagramLabelSling}</text>` +
    annotation({ d: sling, tipX: 478, tipY: 300, angle: angleTo(640, 240, 478, 300), cue: "piece" }) + `</svg>`;
  const diagram = card({
    x: 96, y: 190, w: 1000, h: 640, r: -1, cls: "photo", at: 0.1,
    inner: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${art}</svg>${ann}`,
    tagText: s.tagDiagram,
  });

  const rows = s.tallyRows.map((n, i) => {
    const y = 140 + i * 60;
    return `<text x="36" y="${y}" font-size="30" fill="${C.ink}">${n}</text>` +
      `<path d="${wob(190, y + 6, 540, y + 6, 70 + i, 1.5)}" stroke="${C.ink}" stroke-opacity="0.5" stroke-width="2" fill="none"/>` +
      [0, 1, 2, 3].map((k) => `<path d="${wob(260 + k * 22, y - 24, 260 + k * 22 + 3, y + 2, 90 + i * 5 + k, 1)}" stroke="${C.ink}" stroke-width="3" fill="none"/>`).join("") +
      `<path d="${wob(250, y - 8, 350, y - 14, 120 + i, 1)}" stroke="${C.ink}" stroke-width="3" fill="none"/>`;
  }).join("");
  const tally = card({
    x: 1200, y: 190, w: 600, h: 680, r: 2, at: 0.4,
    inner: `<svg width="600" height="340" viewBox="0 0 600 340" style="position:absolute;left:0;top:0"><text x="36" y="70" font-size="30" letter-spacing="5" fill="${C.ink}">${s.tallyTitle}</text>${rows}</svg>` +
      `<div class="serif" style="position:absolute;left:36px;top:370px;width:530px;font-size:56px;color:${C.ink}">${s.tallyNote} ${hl(s.tallyHighlight, "piece")}</div>`,
    tagText: s.tagTally,
  });
  return kicker(s.kicker) + diagram + tally;
}
