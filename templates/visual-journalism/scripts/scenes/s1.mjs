import { C, sceneCopy } from "../theme.mjs";
import { card, hl, kicker } from "./card.mjs";
import { wob } from "../art.mjs";

export default function s1() {
  const s = sceneCopy("s1");
  const [l1, l2, l3] = s.headlineLines;
  const plate = `<div class="card plate" data-plate style="left:96px;top:230px;width:900px;height:520px"><div class="serif" style="position:absolute;left:60px;top:62px;font-size:104px;color:${C.ink}">${l1}<br>${l2}<br><mark class="hl" data-h="88" data-layout-allow-overlap data-layout-allow-overflow data-rel="1.0">${l3}</mark></div></div>`;

  const rows = s.docRows
    .map((name, i) => {
      const y = 150 + i * 62;
      return `<text x="40" y="${y}" font-size="30" fill="${C.ink}">${name}</text>` +
        `<path d="${wob(220, y + 6, 700, y + 6, 10 + i, 1.5)}" stroke="${C.ink}" stroke-opacity="0.5" stroke-width="2" fill="none"/>` +
        `<path d="${wob(560, y - 24, 566, y + 2, 30 + i, 1)} ${wob(580, y - 24, 586, y + 2, 40 + i, 1)} ${wob(600, y - 24, 606, y + 2, 50 + i, 1)}" stroke="${C.ink}" stroke-width="3" fill="none"/>`;
    })
    .join("");
  const [pre, mid, post] = s.docNote.split(s.docHighlight);
  const doc = card({
    x: 1040, y: 170, w: 760, h: 760, r: 2, at: 0.55,
    inner:
      `<svg width="760" height="500" viewBox="0 0 760 500" style="position:absolute;left:0;top:0">` +
      `<text x="40" y="76" font-size="34" letter-spacing="5" fill="${C.ink}">${s.docTitle}</text>` +
      `<path d="${wob(40, 96, 720, 96, 7, 1.5)}" stroke="${C.ink}" stroke-width="3" fill="none"/>${rows}</svg>` +
      `<div class="serif" style="position:absolute;left:40px;top:505px;width:690px;font-size:52px;color:${C.ink}">${pre}${hl(s.docHighlight, "slow")}${post ?? ""}</div>`,
    tagText: s.tag,
  });
  return kicker(s.kicker) + plate + doc;
}
