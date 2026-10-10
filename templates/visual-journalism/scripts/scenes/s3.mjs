import { C, sceneCopy } from "../theme.mjs";
import { card, hl, kicker } from "./card.mjs";
import { annotation, arc, angleTo, box, BOX_COLORS } from "../art.mjs";

export default function s3() {
  const s = sceneCopy("s3");
  const W = 1080, H = 540;
  // Ship with 2 rows x 29 containers = 58 on deck.
  const cw = 24, ch = 19, x0 = 210, yDeck = 204;
  let boxes = "";
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < 29; i++) {
      boxes += box(x0 + i * cw, yDeck - (row + 1) * ch, cw - 1, ch - 1, BOX_COLORS[(i + row * 2) % 4], { lines: false });
    }
  }
  let art = `<rect width="${W}" height="${H}" fill="${C.diagramSky}"/>` +
    `<rect y="276" width="${W}" height="${H - 276}" fill="${C.diagramWater}"/>` +
    `<path d="M140 204 L950 204 L905 280 L184 280 Z" fill="${C.hull}"/>` +
    `<rect x="150" y="150" width="56" height="54" fill="#CFC4AA" stroke="${C.ink}" stroke-width="3"/>` +
    `<rect x="164" y="120" width="22" height="28" fill="${C.boxRust}" stroke="${C.ink}" stroke-width="3"/>` +
    boxes +
    `<text x="${x0}" y="256" font-size="22" fill="#F4F1EA" letter-spacing="4">${s.shipName}</text>`;
  // route strip
  const rx1 = 130, rx2 = 950, ry = 395;
  art += `<circle cx="${rx1}" cy="${ry}" r="11" fill="${C.ink}"/><circle cx="${rx2}" cy="${ry}" r="11" fill="${C.ink}"/>` +
    `<text x="${rx1 - 40}" y="${ry + 46}" font-size="28" fill="${C.ink}">${s.portFrom}</text>` +
    `<text x="${rx2 - 70}" y="${ry + 46}" font-size="28" fill="${C.ink}">${s.portTo}</text>` +
    `<text x="${W / 2 - 150}" y="${ry + 78}" font-size="22" fill="${C.ink}" fill-opacity="0.7" letter-spacing="3">${s.routeNote}</text>`;
  const route = arc(rx1 + 14, ry - 6, (rx1 + rx2) / 2, ry - 110, rx2 - 16, ry - 8, 8);
  const ann = `<svg class="ann" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    annotation({ d: route, tipX: rx2 - 16, tipY: ry - 8, angle: angleTo((rx1 + rx2) / 2, ry - 110, rx2 - 16, ry - 8), cue: "Newark" }) + `</svg>`;
  const diagram = card({
    x: 96, y: 190, w: 1100, h: 560, r: -1, cls: "photo", at: 0.1,
    inner: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${art}</svg>${ann}`,
    tagText: s.tagDiagram,
  });

  const date = card({
    x: 1290, y: 150, w: 530, h: 360, r: 2, at: 0.45,
    inner: `<div class="serif" style="position:absolute;left:40px;top:40px;font-size:84px;color:${C.ink}">${hl(s.dateLine1, "April")}<br>${s.dateLine2}</div>` +
      `<div class="sans" style="position:absolute;left:40px;top:232px;width:450px;font-size:32px;line-height:1.25;color:${C.ink}">${s.dateRoute}</div>`,
    tagText: s.tagDate,
  });
  const big = card({
    x: 1250, y: 570, w: 570, h: 380, r: -2, at: 0.8,
    inner: `<div class="serif" style="position:absolute;left:40px;top:10px;font-size:230px;color:${C.ink}">${hl(s.bigNumber, "58", " low")}</div>` +
      `<div class="sans" style="position:absolute;left:44px;top:250px;width:480px;font-size:36px;line-height:1.2;color:${C.ink}">${s.bigLabel}</div>`,
    tagText: "ILLUSTRATION",
  });
  return kicker(s.kicker) + diagram + date + big;
}
