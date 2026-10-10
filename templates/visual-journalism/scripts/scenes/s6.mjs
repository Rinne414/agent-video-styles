import { C, sceneCopy } from "../theme.mjs";
import { card, hl, kicker } from "./card.mjs";
import { annotation, angleTo } from "../art.mjs";

export default function s6() {
  const s = sceneCopy("s6");
  const W = 980, H = 680, base = 540;
  const b1 = { x: 200, w: 220, h: 140 }, b2 = { x: 580, w: 220, h: 380 };
  let art = `<rect width="${W}" height="${H}" fill="${C.diagramSky}"/>` +
    `<line x1="120" y1="${base}" x2="900" y2="${base}" stroke="${C.ink}" stroke-width="4"/>` +
    `<line x1="120" y1="${base}" x2="120" y2="110" stroke="${C.ink}" stroke-width="4"/>` +
    `<text x="140" y="96" font-size="26" letter-spacing="3" fill="${C.ink}">${s.axisLabel}</text>` +
    `<rect x="${b1.x}" y="${base - b1.h}" width="${b1.w}" height="${b1.h}" fill="${C.muted}" stroke="${C.ink}" stroke-width="3" data-grow data-ox="${b1.x}" data-oy="${base}" data-cue="agreements"/>` +
    `<rect x="${b2.x}" y="${base - b2.h}" width="${b2.w}" height="${b2.h}" fill="${C.boxRust}" stroke="${C.ink}" stroke-width="3" data-grow data-ox="${b2.x}" data-oy="${base}" data-cue="containers"/>` +
    `<text x="${b1.x + b1.w / 2}" y="${base + 40}" font-size="28" text-anchor="middle" fill="${C.ink}">${s.bar1Label1}</text>` +
    `<text x="${b1.x + b1.w / 2}" y="${base + 76}" font-size="28" text-anchor="middle" fill="${C.ink}">${s.bar1Label2}</text>` +
    `<text x="${b2.x + b2.w / 2}" y="${base + 40}" font-size="28" text-anchor="middle" fill="${C.ink}">${s.bar2Label1}</text>`;
  const gapY = base - b1.h;
  const ann = `<svg class="ann" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    annotation({ d: `M${b1.x + b1.w + 6} ${gapY} L${b2.x - 24} ${gapY}`, tipX: b2.x - 24, tipY: gapY, angle: 0, cue: "more", headSize: 0 }).replace(/<path class="arrow"[^>]*\/>/, "") +
    annotation({ d: `M${b2.x - 70} ${gapY} L${b2.x - 70} ${base - b2.h + 10}`, tipX: b2.x - 70, tipY: base - b2.h + 10, angle: -Math.PI / 2, cue: "more" }) +
    `<text x="${b2.x - 100}" y="${(gapY + base - b2.h) / 2 + 10}" font-size="40" text-anchor="end" fill="${C.ink}" data-in data-cue="more">${s.gapLabel}</text>` +
    `<text x="${W - 50}" y="96" font-size="22" text-anchor="end" fill="${C.ink}" fill-opacity="0.75" letter-spacing="3">${s.chartNote}</text></svg>`;
  const chart = card({
    x: 96, y: 170, w: 1000, h: 740, r: -1, cls: "photo", at: 0.1,
    inner: `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0">${art}</svg>${ann}`,
    tagText: s.tagChart,
  });
  const [t1, t2] = s.paperTitle.split(s.paperHighlight);
  const paper = card({
    x: 1210, y: 170, w: 620, h: 660, r: 2, at: 0.4,
    inner: `<div class="sans" style="position:absolute;left:40px;top:44px;font-size:28px;letter-spacing:0.14em;color:${C.ink}">${s.paperKicker}</div>` +
      `<div class="serif" style="position:absolute;left:40px;top:110px;width:540px;font-size:52px;color:${C.ink}">${t1}${hl(s.paperHighlight, "containers")}${t2 ?? ""}</div>` +
      `<div class="sans" style="position:absolute;left:40px;top:420px;width:540px;font-size:30px;line-height:1.3;color:${C.ink}">${s.paperAuthors}<br>${s.paperJournal}</div>`,
    tagText: s.tagPaper,
  });
  return kicker(s.kicker) + chart + paper;
}
