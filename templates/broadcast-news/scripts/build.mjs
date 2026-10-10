// Generates index.html from content.json + assets/audio/timeline.json + src/*.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { content, FPS, MOTION, FONTS, cssVars } from "../src/theme.mjs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const timeline = JSON.parse(read("assets/audio/timeline.json"));
const dur = Object.fromEntries(timeline.segments.map((s) => [s.id, s]));

// ---- vendored runtime files (no network at render time)
mkdirSync(new URL("fonts/", root), { recursive: true });
mkdirSync(new URL("vendor/", root), { recursive: true });
for (const f of FONTS) {
  copyFileSync(new URL(`node_modules/@fontsource/${f.pkg}/files/${f.file}`, root), new URL(`fonts/${f.file}`, root));
}
copyFileSync(new URL("node_modules/gsap/dist/gsap.min.js", root), new URL("vendor/gsap.min.js", root));

// ---- scene plan: narration is the master clock
const gapF = Math.ceil(content.gapSeconds * FPS);
const frames = (ms) => Math.ceil((ms * FPS) / 1000);
const plan = [];
let cursor = 0;
function add(kind, id, extra) {
  const narr = frames(dur[extra.seg].duration_ms);
  const len = MOTION.leadFrames + narr + (kind === "closing" ? MOTION.closingHoldFrames : gapF + content.tailFrames);
  plan.push({ kind, id, start: cursor, len, narrStart: cursor + MOTION.leadFrames, narrSec: dur[extra.seg].duration_ms / 1000, ...extra });
  cursor += len;
}
add("opening", "open", { seg: "open" });
content.stories.forEach((s, i) => add("story", s.id, { seg: s.id, index: i }));
add("closing", "close", { seg: "close" });
const total = cursor;

// ---- markup
function splitLines(text, max) {
  if (text.length <= max) return [text];
  const w = text.split(" ");
  let best = 1, diff = Infinity;
  for (let k = 1; k < w.length; k++) {
    const d = Math.abs(w.slice(0, k).join(" ").length - w.slice(k).join(" ").length);
    if (d < diff) { diff = d; best = k; }
  }
  return [w.slice(0, best).join(" "), w.slice(best).join(" ")];
}
const lines = (text, max) => splitLines(text, max).map((l) => `<span class="ln"><span>${esc(l)}</span></span>`).join("");

function sceneOpen(sc, i) {
  const o = content.opening;
  const chips = content.stories.map((s) => `<div class="chip" style="background:${s.panel};color:${s.numeralColor}">${s.numeral}</div>`).join("");
  return `<div class="open-wrap"><div class="cam" style="position:absolute;inset:0">
    <div class="kicker" style="top:210px"><i style="background:${content.colors.text}"></i><span>Tech desk</span></div>
    <div class="open-title">${lines(o.title, 99)}</div>
    <div class="open-sub">${esc(o.subtitle)}</div>
    <div class="chips">${chips}</div></div></div>`;
}

function sceneStory(sc) {
  const s = content.stories[sc.index];
  return `<div class="panel" style="background:${s.panel}"><div class="numeral" style="color:${s.numeralColor}">${s.numeral}</div></div>
  <div class="right"><div class="cam">
    <div class="kicker"><i style="background:${s.panel}"></i><span>${esc(s.kicker)}</span></div>
    <h2 class="headline" style="margin:0">${lines(s.headline, 22)}</h2>
    <div class="specs" style="--c:${s.panel}">${s.specs.map((t) => `<div class="spec">${esc(t)}</div>`).join("")}</div>
  </div></div>`;
}

function sceneClose() {
  const c = content.closing;
  const rows = content.stories.map((s, i) => `<div class="recap-row" style="top:${290 + i * 150}px">
      <div class="recap-num" style="background:${s.panel};color:${s.numeralColor}">${s.numeral}</div>
      <div class="recap-head">${esc(s.headline)}</div></div>`).join("");
  return `<div class="cover" style="position:absolute;inset:0;background:${content.colors.bg}"></div>
  <div class="open-wrap">
    <div class="kicker" style="top:200px"><i style="background:${content.colors.text}"></i><span>${esc(c.title)}</span></div>
    ${rows}
    <div class="source">${esc(c.source)}</div>
    <div class="signoff">${esc(c.signoff)}</div></div>`;
}

const body = { opening: sceneOpen, story: sceneStory, closing: sceneClose };
let scenes = "", audio = "";
plan.forEach((sc, i) => {
  const last = i === plan.length - 1;
  const lenSec = (sc.len + (last ? 0 : MOTION.wipe)) / FPS;
  scenes += `<section id="sc-${sc.id}" class="scene clip" data-start="${sc.start / FPS}" data-duration="${lenSec}" data-track-index="${i % 2}" style="z-index:${i + 1}">${body[sc.kind](sc)}</section>\n`;
  audio += `<audio id="vo-${sc.id}" src="assets/audio/${dur[sc.seg].file}" data-start="${sc.narrStart / FPS}" data-duration="${sc.narrSec}" data-track-index="9" data-volume="1"></audio>\n`;
});

const sep = content.ticker.separator;
const items = [...content.stories.map((s) => s.headline), ...content.ticker.extra];
const oneLoop = items.map((t) => `<span class="item">${esc(t)}</span><span class="sep">${esc(sep)}</span>`).join("");

const fontFace = FONTS.map((f) => `@font-face { font-family: "${f.family}"; src: url("fonts/${f.file}") format("woff2"); font-weight: ${f.weight}; }`).join("\n");
const animate = read("src/animate.js");
const planJson = JSON.stringify({ fps: FPS, total, motion: MOTION, scenes: plan });

const html = read("src/template.html")
  .replace("/*FONTFACE*/", () => fontFace)
  .replace("/*VARS*/", () => cssVars())
  .replace("/*DURATION*/", () => String(total / FPS))
  .replace("/*TAG*/", () => esc(content.tag))
  .replace("/*LABEL*/", () => esc(content.ticker.label))
  .replace("<!--AUDIO-->", () => audio)
  .replace("<!--SCENES-->", () => scenes)
  .replace("<!--TICKER-->", () => oneLoop + oneLoop)
  .replace("/*PLAN*/", () => `const PLAN = ${planJson};`)
  .replace("/*ANIMATE*/", () => animate);

writeFileSync(new URL("index.html", root), html);
console.log(`index.html: ${total} frames = ${(total / FPS).toFixed(2)} s`, plan.map((p) => `${p.id}@${p.start}+${p.len}`).join(" "));
