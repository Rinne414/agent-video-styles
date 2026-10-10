// Single theme module: every style token comes from content.json (theme block).
// Scenes import tokens from here and never hard-code colors, fonts or timings.
import { readFileSync } from "node:fs";

export const content = JSON.parse(readFileSync(new URL("../content.json", import.meta.url), "utf8"));
export const { meta, timing, narration, sources, sourceList } = content;
export const C = content.theme.colors;
export const M = content.theme.motion;
export const F = content.theme.fonts;
export const FPS = meta.fps;
export const sceneCopy = (id) => content.scenes[id];
export const sourceById = (id) => sources.find((s) => s.id === id);

const HL_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'>" +
  `<path d='M0.5 10 L30 4 L70 8 L99.5 2 L98 55 L99.5 94 L68 98 L32 92 L1 97 L2.5 50 Z' fill='${C.highlighter.replace("#", "%23")}' fill-opacity='0.85'/></svg>`;

export const css = `
:root{--ground:${C.ground};--paper:${C.paper};--ink:${C.ink};--hl:${C.highlighter};--red:${C.red};--textg:${C.textOnGround};}
@font-face{font-family:"${F.serif}";src:url("fonts/source-serif-4-latin-700-normal.woff2") format("woff2");font-weight:700;}
@font-face{font-family:"${F.sans}";src:url("fonts/inter-latin-600-normal.woff2") format("woff2");font-weight:600;}
html,body{margin:0;width:${meta.width}px;height:${meta.height}px;overflow:hidden;background:${C.ground};}
#root{position:relative;width:${meta.width}px;height:${meta.height}px;overflow:hidden;background:${C.ground};font-family:"${F.sans}",sans-serif;font-weight:600;color:${C.textOnGround};}
.scene{position:absolute;inset:0;}
.cam{position:absolute;inset:0;transform-origin:50% 50%;}
.card{position:absolute;background:${C.paper};box-shadow:0 24px 60px rgba(0,0,0,0.55);border-radius:3px;isolation:isolate;color:${C.ink};}
.card.photo{border:10px solid ${C.photoBorder};box-sizing:border-box;}
.card.plate{background:${C.plate};}
.drift{position:absolute;inset:0;}
.serif{font-family:"${F.serif}",serif;font-weight:700;line-height:1.05;}
.sans{font-family:"${F.sans}",sans-serif;font-weight:600;}
.kicker{position:absolute;left:136px;top:110px;font-size:30px;letter-spacing:0.14em;color:${C.textOnGround};}
.tag{position:absolute;left:16px;bottom:14px;max-width:calc(100% - 52px);font:600 22px/1.25 "${F.sans}",sans-serif;background:${C.tagBg};color:${C.tagInk};padding:6px 14px;border-radius:18px;}
.hl{background-image:url("data:image/svg+xml;utf8,${HL_SVG}");background-repeat:no-repeat;background-position:left 55%;background-size:0% 88%;background-color:transparent;mix-blend-mode:multiply;padding:0 0.1em;margin:0 -0.1em;color:inherit;white-space:nowrap;}
.hl.low{background-position:left 94%;}
.hl.on-dark{mix-blend-mode:normal;color:${C.ink};}
svg text{font-family:"${F.sans}",sans-serif;font-weight:600;}
svg text.sf{font-family:"${F.serif}",serif;font-weight:700;}
.ann{position:absolute;left:0;top:0;overflow:visible;pointer-events:none;}
.dash{fill:none;stroke:${C.ink};stroke-width:4;stroke-dasharray:14 10;stroke-linecap:butt;}
.arrow.light{stroke:${C.textOnGround};}
.dash.light{stroke:${C.textOnGround};}
.arrow{fill:none;stroke:${C.ink};stroke-width:4;stroke-linecap:round;stroke-linejoin:round;}
.redmark{fill:none;stroke:${C.red};stroke-width:14;stroke-linecap:round;}
#grain{position:absolute;inset:0;width:100%;height:100%;opacity:0.05;mix-blend-mode:screen;pointer-events:none;}
#vignette{position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 55%,rgba(0,0,0,0.2) 100%);}
`;
