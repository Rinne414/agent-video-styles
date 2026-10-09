// Builds index.html from content.json + assets/audio/timeline.json. Run: node scripts/build.mjs [--script]
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildScenes } from "../src/scenes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const content = JSON.parse(read("content.json"));
const FPS = content.meta.fps;
const snap = (s) => Math.round(s * FPS) / FPS;

if (process.argv.includes("--script")) {
  const script = { voice: content.voice.id, rate: content.voice.rate, segments: content.segments.map(({ id, text }) => ({ id, text })) };
  writeFileSync(join(root, "assets/audio/script.json"), JSON.stringify(script, null, 2));
  console.log("wrote assets/audio/script.json");
  process.exit(0);
}

// fonts come from npm packages and are copied next to the page (offline render)
mkdirSync(join(root, "fonts"), { recursive: true });
for (const [pkg, file, out] of [["baloo-2", "baloo-2-latin-700-normal.woff2", "baloo-2-700.woff2"], ["nunito", "nunito-latin-700-normal.woff2", "nunito-700.woff2"]]) {
  const src = join(root, "node_modules/@fontsource", pkg, "files", file);
  if (existsSync(src)) copyFileSync(src, join(root, "fonts", out));
}

const timeline = JSON.parse(read("assets/audio/timeline.json"));
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
const { leadSec, gapSec, tailSec } = content.timing;

// 1. place narration segments back to back (narration is the master clock)
const segs = {};
let cursor = leadSec;
for (const seg of timeline.segments) {
  const dur = seg.duration_ms / 1000;
  segs[seg.id] = {
    off: cursor, dur, file: seg.file,
    words: seg.words.map((w) => ({ text: w.text, k: norm(w.text), s: cursor + w.start_ms / 1000, e: cursor + w.end_ms / 1000 })),
  };
  cursor += dur + gapSec;
}
const lastSeg = timeline.segments.at(-1);
const total = snap(Math.ceil((segs[lastSeg.id].off + segs[lastSeg.id].dur + tailSec) * FPS) / FPS);

// 2. scene boundaries sit in the middle of the gap between narration segments
const scenes = {};
content.scenes.forEach((sc, i) => {
  const first = segs[sc.segments[0]], last = segs[sc.segments.at(-1)];
  const prev = i ? scenes[content.scenes[i - 1].id].end : 0;
  const end = i === content.scenes.length - 1 ? total : snap(last.off + last.dur + gapSec / 2);
  scenes[sc.id] = { start: prev, end, iris: sc.iris, firstWord: first.off };
});

// 3. caption chunks: <= 38 chars, break after punctuation, never a one-word chunk
function chunks(seg, text) {
  const toks = text.split(/\s+/);
  const words = seg.words.map((w, i) => ({ ...w, shown: toks.length === seg.words.length ? toks[i] : w.text }));
  const clauses = []; let cur = [];
  for (const w of words) { cur.push(w); if (/[.?!,;]$/.test(w.shown)) { clauses.push(cur); cur = []; } }
  if (cur.length) clauses.push(cur);
  const len = (ws) => ws.map((x) => x.shown).join(" ").length;
  const split = (ws) => {                        // balanced split of an over-long clause
    if (len(ws) <= 38 || ws.length < 4) return [ws];
    let best = 1;
    for (let k = 2; k < ws.length; k++) if (Math.abs(len(ws.slice(0, k)) - len(ws.slice(k))) < Math.abs(len(ws.slice(0, best)) - len(ws.slice(best)))) best = k;
    return [...split(ws.slice(0, best)), ...split(ws.slice(best))];
  };
  const out = [];
  for (const cl of clauses.flatMap(split)) {
    if (out.length && len(cl) < 8) out.at(-1).push(...cl); else out.push([...cl]);   // never a tiny orphan chunk
  }
  return out.map((ws) => ({ text: ws.map((x) => x.shown).join(" "), start: ws[0].s }));
}
const caps = [];
for (const s of content.segments) {
  const seg = segs[s.id], cs = chunks(seg, s.text), segEnd = Math.min(seg.off + seg.dur, seg.words.at(-1).e + 0.45);
  cs.forEach((c, i) => caps.push({ text: c.text, start: snap(c.start - 0.05), end: snap(i + 1 < cs.length ? cs[i + 1].start - 0.05 : segEnd) }));
}

// 4. markup
const sceneParts = buildScenes(content.palette, content.labels);
const G = Object.fromEntries(Object.entries(sceneParts).map(([k, v]) => [k, v.g]));
const num = (n) => Number(n.toFixed(3));
const sections = content.scenes.map((sc, i) => {
  const s = scenes[sc.id];
  return `<section id="sc-${sc.id}" class="scene clip" data-start="${num(s.start)}" data-duration="${num(s.end - s.start)}" data-track-index="0"><div class="floor"></div><div id="${sc.id}-inner" class="inner">${sceneParts[sc.id].html}</div></section>`;
}).join("\n");
const audio = timeline.segments.map((seg) => `<audio id="vo-${seg.id}" src="assets/audio/${seg.file}" data-start="${num(segs[seg.id].off)}" data-duration="${num(segs[seg.id].dur)}" data-track-index="1" data-volume="1"></audio>`).join("\n");
const capHtml = caps.map((c, i) => `<div id="cap${i}" class="cap clip" data-start="${num(c.start)}" data-duration="${num(c.end - c.start)}" data-track-index="4"><span>${c.text}</span></div>`).join("\n");
const cssVars = Object.entries(content.palette).map(([k, v]) => `--${k}: ${v};`).join(" ");

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<script src="vendor/gsap.min.js"></script>
<style>:root { ${cssVars} }
${read("src/style.css")}</style>
</head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${num(total)}" data-width="1920" data-height="1080">
${sections}
<svg id="iris" class="layer clip" data-start="0" data-duration="${num(total)}" data-track-index="3" viewBox="0 0 1920 1080"><circle id="iris-c" cx="960" cy="540" r="0" fill="${content.palette.yellow}" stroke="${content.palette.ink}" stroke-width="5"/></svg>
${capHtml}
${audio}
</div>
<script>
const TL = ${JSON.stringify({ segs, scenes, total, fps: FPS })};
const G = ${JSON.stringify(G)};
const C = ${JSON.stringify(content.palette)};
${read("src/anim.js")}
</script>
</body></html>
`;
writeFileSync(join(root, "index.html"), html);
console.log(`index.html written: ${num(total)} s, ${caps.length} captions, ${Object.keys(scenes).length} scenes`);
