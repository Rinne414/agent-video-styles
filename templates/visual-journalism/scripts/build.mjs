// Generates index.html and sources.json from content.json + assets/audio/timeline.json.
// Narration is the master clock: scene lengths come from the audio durations.
import { readFileSync, writeFileSync } from "node:fs";
import { content, meta, timing, narration, sources, sourceList, M, FPS, css } from "./theme.mjs";
import { resetDrift } from "./scenes/card.mjs";
import s1 from "./scenes/s1.mjs";
import s2 from "./scenes/s2.mjs";
import s3 from "./scenes/s3.mjs";
import s4 from "./scenes/s4.mjs";
import s5 from "./scenes/s5.mjs";
import s6 from "./scenes/s6.mjs";
import s7 from "./scenes/s7.mjs";

const root = new URL("../", import.meta.url);
const timeline = JSON.parse(readFileSync(new URL("assets/audio/timeline.json", root), "utf8"));
const builders = { s1, s2, s3, s4, s5, s6, s7 };
const frame = (sec) => Math.round(sec * FPS) / FPS;
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9 ]/g, "").split(" ")[0];

let cursor = timing.leadSec;
let sceneHtml = "";
let audioHtml = "";
const TL = {};

narration.forEach((n, idx) => {
  const seg = timeline.segments.find((s) => s.id === n.id);
  if (!seg) throw new Error(`timeline.json has no segment ${n.id}; run the tts step`);
  const isLast = idx === narration.length - 1;
  const sceneStart = idx === 0 ? 0 : frame(cursor);
  const audioStart = frame(idx === 0 ? timing.leadSec : cursor);
  const audioDur = seg.duration_ms / 1000;
  const sceneEnd = frame(audioStart + audioDur + (isLast ? timing.tailSec : timing.gapSec));
  const words = seg.words.map((w) => ({ text: norm(w.text), t: audioStart + w.start_ms / 1000 }));
  TL[n.id] = { start: sceneStart, end: sceneEnd, words };

  const at = (cue) => {
    const hit = words.filter((w) => w.text === norm(cue));
    if (!hit.length) throw new Error(`cue "${cue}" not found in ${n.id}: ${words.map((w) => w.text).join(" ")}`);
    return hit[0].t;
  };
  resetDrift();
  let inner = builders[n.id]();
  // Resolve timing: data-cue (spoken word) and data-rel (seconds from scene start) become absolute data-t.
  inner = inner.replace(/data-cue="([^"]+)"/g, (_, cue) => {
    // highlights start a few frames before the word; everything else on the word
    return `data-t="${frame(at(cue))}" data-cue-w="${cue}"`;
  });
  inner = inner.replace(/data-rel="([\d.]+)"/g, (_, rel) => `data-t="${frame(sceneStart + parseFloat(rel))}"`);
  // highlight lead: shift mark.hl cue times by -highlightLeadFrames
  inner = inner.replace(/(<mark class="hl[^"]*") data-t="([\d.]+)"/g, (_, pre, t) => `${pre} data-t="${(parseFloat(t) - M.highlightLeadFrames / FPS).toFixed(4)}"`);
  // clean attributes the runtime does not need
  sceneHtml += `<section id="scene-${n.id}" class="scene clip" data-start="${sceneStart}" data-duration="${(sceneEnd - sceneStart).toFixed(4)}" data-track-index="0"><div class="cam">${inner}</div></section>\n`;
  audioHtml += `<audio id="vo-${n.id}" src="assets/audio/${seg.file}" data-start="${audioStart}" data-duration="${audioDur}" data-track-index="1" data-volume="1"></audio>\n`;
  cursor = audioStart + audioDur + timing.gapSec;
});

const total = TL[narration.at(-1).id].end;
const runtime = readFileSync(new URL("src/runtime.js", root), "utf8");

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=${meta.width}, height=${meta.height}" />
<title>${meta.title}</title>
<script src="vendor/gsap.min.js"></script>
<style>${css}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${total.toFixed(4)}" data-width="${meta.width}" data-height="${meta.height}">
${sceneHtml}<svg id="grain" xmlns="http://www.w3.org/2000/svg"><filter id="g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#g)"/></svg>
<div id="vignette"></div>
${audioHtml}</div>
<script>
const FPS = ${FPS};
const MOTION = ${JSON.stringify(M)};
const TL = ${JSON.stringify(TL)};
${runtime}
</script>
</body></html>
`;
writeFileSync(new URL("index.html", root), html);

// Source ledger for the checked-in illustrations and cited facts.
const ledger = sources.filter((s) => sourceList.includes(s.id)).map(({ id, label, kind, url, license }) => ({ id, label, kind, url: url ?? null, license }));
writeFileSync(new URL("sources.json", root), JSON.stringify({ images: "All images are code-drawn illustrations (tagged ILLUSTRATION).", sources: ledger }, null, 2));
console.log(`index.html written: ${total.toFixed(2)} s (${Math.round(total * FPS)} frames), ${content.narration.length} scenes`);
