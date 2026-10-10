import { C, sceneCopy, sourceById, sourceList } from "../theme.mjs";
import { card, kicker } from "./card.mjs";
import { wob } from "../art.mjs";

export default function s7() {
  const s = sceneCopy("s7");
  const lines = s.headlineLines
    .map((l) => (l === s.headlineHighlight ? `<mark class="hl on-dark" data-h="88" data-layout-allow-overlap data-layout-allow-overflow data-cue="world">${l}</mark>` : l))
    .join("<br>");
  const headline = `<div class="serif" data-in data-rel="0.05" style="position:absolute;left:96px;top:250px;font-size:120px;color:${C.textOnGround}">${lines}</div>`;
  const items = sourceList
    .map((id, i) => {
      const src = sourceById(id);
      return `<div class="sans" data-in data-rel="${0.9 + i * 0.17}" style="position:relative;padding-left:56px;font-size:30px;line-height:1.3;color:${C.ink}"><span style="position:absolute;left:0;top:0">${i + 1}</span>${src.short}</div>`;
    })
    .join("");
  const list = card({
    x: 1070, y: 150, w: 760, h: 760, r: 2, at: 0.6,
    inner: `<div class="sans" style="position:absolute;left:40px;top:44px;font-size:30px;letter-spacing:0.16em;color:${C.ink}">${s.sourcesTitle}</div>` +
      `<svg width="760" height="40" viewBox="0 0 760 40" style="position:absolute;left:0;top:92px"><path d="${wob(40, 10, 720, 10, 3, 1.5)}" stroke="${C.ink}" stroke-width="3" fill="none"/></svg>` +
      `<div style="position:absolute;left:40px;top:150px;width:680px;display:flex;flex-direction:column;gap:44px">${items}</div>` +
      `<div class="sans" style="position:absolute;left:40px;bottom:36px;font-size:24px;color:${C.ink};opacity:0.75">${s.sourcesFootnote}</div>`,
  });
  return headline + list;
}
