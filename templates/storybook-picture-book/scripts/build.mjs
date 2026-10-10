// Generates index.html from content.json + assets/audio/timeline.json (narration is the master clock).
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import path from "node:path";
import { ROOT, content, W, H, FPS, P, T, f2s } from "./theme.mjs";
import { sceneSvg } from "./pages.mjs";
import { defs, paperLayers } from "./art.mjs";

const tm = content.timing;
const timeline = JSON.parse(readFileSync(path.join(ROOT, "assets/audio/timeline.json"), "utf8"));
const seg = Object.fromEntries(timeline.segments.map((s) => [s.id, s]));

// vendor gsap + font so the render needs no network
mkdirSync(path.join(ROOT, "vendor"), { recursive: true });
mkdirSync(path.join(ROOT, "fonts"), { recursive: true });
copyFileSync(path.join(ROOT, "node_modules/gsap/dist/gsap.min.js"), path.join(ROOT, "vendor/gsap.min.js"));
copyFileSync(path.join(ROOT, "node_modules/@fontsource/baloo-2/files/baloo-2-latin-700-normal.woff2"), path.join(ROOT, "fonts/baloo-2-latin-700-normal.woff2"));

// page lengths in whole frames: lead + last spoken word + tail (the page turn starts after the last word)
let cursor = 0;
const pages = content.pages.map((p, i) => {
  const s = seg[p.id];
  if (!s) throw new Error(`no narration segment for page ${p.id}; run tts`);
  const lastWord = Math.ceil((s.words.at(-1).end_ms / 1000) * FPS);
  const isLast = i === content.pages.length - 1;
  const frames = isLast ? tm.leadFrames + tm.endTagDelayFrames + tm.endHoldFrames : tm.leadFrames + lastWord + tm.tailFrames;
  const page = {
    ...p, kind: p.scene, startF: cursor, frames, isLast,
    start: f2s(cursor), dur: f2s(frames),
    audioAt: f2s(cursor + tm.leadFrames), audioDur: s.duration_ms / 1000,
    capAt: f2s(cursor + tm.leadFrames) + s.words[0].start_ms / 1000,
  };
  cursor += frames;
  return page;
});
const totalFrames = cursor;
const total = f2s(totalFrames);

const words = (t) => t.split(/\s+/).length;
for (const p of pages) if (words(p.caption) > 14) throw new Error(`caption too long on ${p.id}`);

const turnS = f2s(tm.turnFrames);
const pageHtml = pages.map((p, i) => {
  const big = p.kind === "cover";
  const z = pages.length - i;
  const dur = p.dur + (p.isLast ? 0 : turnS);
  const tag = p.isLast ? `<div class="tag">${content.endTag}</div>` : "";
  return `<section id="pg-${p.id}" class="scene clip" data-start="${p.start}" data-duration="${dur}" data-track-index="0" style="z-index:${z}">
<div class="page"><svg class="art" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${sceneSvg(p.kind, p.id)}${paperLayers()}</svg>
<div class="band${big ? " cover" : ""}"><p class="cap">${p.caption}</p></div>${tag}</div></section>`;
}).join("\n");

// alternate two audio tracks so the silent tail of one clip never overlaps the next on the same track
const audioHtml = pages.map((p, i) =>
  `<audio id="vo-${p.id}" src="assets/audio/${seg[p.id].file}" data-start="${p.audioAt}" data-duration="${p.audioDur}" data-track-index="${1 + (i % 2)}" data-volume="1"></audio>`).join("\n");

const TLD = {
  fps: FPS, total, turn: tm.turnFrames, drift: T.drift, enter: T.enter, endTagAt: tm.leadFrames + tm.endTagDelayFrames - 24,
  tokens: { dry: T.dry, wobbleEvery: T.wobble.everyFrames, wobbleSeeds: T.wobble.seeds, bobSeconds: T.bob.seconds, bobPx: T.bob.px, blinkFrames: T.blinkFrames },
  turnTokens: { minScale: T.turn.minScale, skew: T.turn.skew, shadow: T.turn.shadow },
  pages: pages.map(({ id, kind, start, dur, capAt }) => ({ id, kind, start, dur, capAt })),
};

const b = T.band;
const css = `
@font-face { font-family: "Baloo 2"; src: url("fonts/baloo-2-latin-700-normal.woff2") format("woff2"); font-weight: 700; }
html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: ${P.paper}; }
#root { position: relative; width: ${W}px; height: ${H}px; font-family: "Baloo 2", sans-serif; }
.scene { position: absolute; inset: 0; }
.page { position: absolute; inset: 0; background: ${P.paper}; }
.art { position: absolute; left: 0; top: 0; }
.band { position: absolute; left: ${b.x}px; top: ${b.y}px; width: ${b.w}px; height: ${b.h}px; box-sizing: border-box; border-radius: ${b.r}px;
  background: ${P.paper}; border: 4px solid rgba(91,70,54,.6); display: flex; align-items: center; justify-content: center; padding: 0 56px; }
.cap { margin: 0; text-align: center; text-wrap: balance; font-weight: 700; font-size: ${T.textSize}px; line-height: 1.12; color: ${P.text}; }
.band.cover .cap { font-size: ${T.coverTextSize}px; }
.tag { position: absolute; left: 700px; top: 330px; width: 520px; height: 128px; box-sizing: border-box; border-radius: 64px; background: ${P.paper};
  border: 4px solid rgba(91,70,54,.6); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 80px; color: ${P.text}; }
`;

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=${W}, height=${H}" />
<script src="vendor/gsap.min.js"></script>
<style>${css}</style></head>
<body>
${defs()}
<div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="${W}" data-height="${H}">
${pageHtml}
${audioHtml}
</div>
<script>const TLD = ${JSON.stringify(TLD)};</script>
<script>${readFileSync(path.join(ROOT, "scripts/anim.js"), "utf8")}</script>
</body></html>
`;
writeFileSync(path.join(ROOT, "index.html"), html);
console.log(`index.html: ${totalFrames} frames, ${total.toFixed(2)} s, ${pages.length} pages`);
