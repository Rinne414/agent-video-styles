import { C, sceneCopy } from "../theme.mjs";
import { card, hl, kicker } from "./card.mjs";
import { annotation, arc, angleTo, wob } from "../art.mjs";

export default function s5() {
  const s = sceneCopy("s5");
  const body = (header, value, sub, cue) =>
    `<div class="sans" style="position:absolute;left:50px;top:50px;font-size:32px;letter-spacing:0.12em;color:${C.ink}">${header}</div>` +
    `<div class="serif" style="position:absolute;left:50px;top:150px;font-size:210px;color:${C.ink}">${hl(value, cue, " low")}</div>` +
    `<div class="sans" style="position:absolute;left:54px;top:400px;width:620px;font-size:36px;line-height:1.25;color:${C.ink}">${sub}</div>`;
  // red slash across the old price, drawn on at "dollars"
  const slash = `<svg class="ann" width="720" height="560" viewBox="0 0 720 560">` +
    `<path class="redmark" d="${wob(40, 410, 520, 150, 21, 3)}" data-wipe data-cue="dollars"/>` +
    `</svg>`;
  // scene-level arrow over the dark ground, from the old price toward the new one
  const flow = `<svg class="ann" width="1920" height="1080" viewBox="0 0 1920 1080">` +
    annotation({ d: arc(720, 190, 1040, 60, 1330, 205, 6), tipX: 1330, tipY: 205, angle: angleTo(1100, 100, 1330, 205), cue: "fell", cls: "dash light" }) +
    `</svg>`;
  const left = card({
    x: 130, y: 210, w: 760, h: 620, r: -2, at: 0.1,
    inner: body(s.leftHeader, s.leftValue, s.leftSub, "six") + slash,
    tagText: s.tagLeft,
  });
  const right = card({
    x: 1010, y: 250, w: 760, h: 620, r: 2, at: 0.3,
    inner: body(s.rightHeader, s.rightValue, s.rightSub, "sixteen"),
    tagText: s.tagRight,
  });
  return kicker(s.kicker) + flow + left + right;
}
