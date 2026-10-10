// The single place where style tokens turn into CSS. Scenes never hard-code colors or sizes.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const content = JSON.parse(readFileSync(join(root, "content.json"), "utf8"));
export const theme = content.theme;

export const css = `
@font-face { font-family: "${theme.font}"; src: url("fonts/eb-garamond-latin-600-normal.woff2") format("woff2"); font-weight: 600; font-style: normal; }
@font-face { font-family: "${theme.font}"; src: url("fonts/eb-garamond-latin-400-normal.woff2") format("woff2"); font-weight: 400; font-style: normal; }
@font-face { font-family: "${theme.font}"; src: url("fonts/eb-garamond-latin-400-italic.woff2") format("woff2"); font-weight: 400; font-style: italic; }
html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: ${theme.paper}; }
#root { position: relative; width: 1920px; height: 1080px; background: ${theme.paper} url("assets/paper.jpg") 0 0 / 1920px 1080px no-repeat; font-family: "${theme.font}", serif; }
.scene, .frame { position: absolute; left: 0; top: 0; width: 1920px; height: 1080px; }
svg { width: 1920px; height: 1080px; display: block; }
path, circle, rect { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.dr { stroke-dasharray: 1 2; }
.c { stroke: ${theme.ink}; stroke-width: ${theme.contourWidth}; }
.h { stroke: ${theme.ink}; stroke-width: ${theme.hatchWidth}; }
.lead { stroke: ${theme.rust}; stroke-width: 1.5; }
.dot { fill: ${theme.rust}; stroke: none; }
.fr { stroke: ${theme.ink}; stroke-width: 2; }
text { fill: ${theme.ink}; font-family: "${theme.font}", serif; }
.tl { font-size: ${theme.titleSize}px; font-weight: 600; line-height: 1.05; }
.head { font-size: ${theme.headSize}px; font-weight: 600; }
.cl { font-size: ${theme.headSize}px; font-weight: 600; }
.era, .nt { fill: ${theme.rust}; font-style: italic; font-weight: 400; }
.era { font-size: ${theme.eraSize}px; }
.nt { font-size: ${theme.noteSize}px; }
.fig { fill: ${theme.rust}; font-size: ${theme.figSize}px; font-weight: 400; letter-spacing: 0.08em; }
.src { fill: ${theme.inkSoft}; font-size: 34px; font-style: italic; }
.sb { stroke: ${theme.rust}; stroke-width: 5; }
.sb2 { stroke: ${theme.rust}; stroke-width: 2; }
.st { fill: ${theme.rust}; font-size: 52px; font-weight: 600; letter-spacing: 0.06em; }
#c-stamp { mix-blend-mode: multiply; }
`;
