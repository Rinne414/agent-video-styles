// Generates index.html from content.json + src/scenes/*.mjs.
// Usage: node scripts/build.mjs   (run from the template root)
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(join(root, "content.json"), "utf8"));
const { video, palette, type, stroke, timing } = content;
const W = video.composeWidth;
const H = video.height;
const fps = video.fps;

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
const gAttr = (s) => (s.g ? ` data-g="${s.g}"` : "");
const isOccluder = (s) => s.fill && (s.op === undefined || s.op >= 1);

function colourSvg(shapes) {
  const paths = shapes
    .filter((s) => s.fill)
    .map((s) => `<path d="${s.d}" fill="${palette[s.fill]}"${s.op !== undefined ? ` fill-opacity="${s.op}"` : ""}${gAttr(s)}/>`);
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${paths.join("")}</svg>`;
}

/**
 * Line layer with painter's-order occlusion: a stroke is knocked out wherever a LATER opaque fill
 * covers it, so a figure standing in front of a window hides the window frame behind it.
 */
function lineSvg(sceneId, shapes) {
  const nextOcc = (i) => shapes.findIndex((s, j) => j > i && isOccluder(s));
  const masks = new Map();
  const maskFor = (from) => {
    if (!masks.has(from)) {
      const knock = shapes
        .slice(from)
        .filter(isOccluder)
        .map((s) => `<path d="${s.d}" fill="#000"${gAttr(s)}/>`)
        .join("");
      masks.set(
        from,
        `<mask id="k-${sceneId}-${from}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#fff"/>${knock}</mask>`,
      );
    }
    return `k-${sceneId}-${from}`;
  };
  let body = "";
  let open = -2;
  shapes.forEach((s, i) => {
    if (s.stroke === false) return;
    const m = nextOcc(i);
    if (m !== open) {
      if (open !== -2) body += "</g>";
      body += m === -1 ? "<g>" : `<g mask="url(#${maskFor(m)})">`;
      open = m;
    }
    body += `<path d="${s.d}"${gAttr(s)}/>`;
  });
  if (open !== -2) body += "</g>";
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"><defs>${[...masks.values()].join("")}</defs><g fill="none" stroke="${palette.ink}" stroke-width="${stroke.width}" stroke-linecap="round" stroke-linejoin="round">${body}</g></svg>`;
}

let cursor = 0;
let sectionsHtml = "";
const cfgScenes = [];
const anims = {};

for (const sc of content.scenes) {
  const mod = (await import(pathToFileURL(join(root, "src", "scenes", `${sc.id}.mjs`)).href)).default;
  const shapes = mod.shapes();
  anims[sc.id] = mod.anims;
  const line = sc.line ?? { start: timing.lineStart, frames: timing.lineFrames };
  const color = sc.color ?? { start: line.start + line.frames + timing.colorGap, frames: timing.colorFrames };
  const capStart = sc.captionStart ?? timing.captionStart;
  cfgScenes.push({ id: sc.id, start: cursor, frames: sc.frames, line, color, capStart });

  const text = sc.title
    ? `<div class="titlewrap m-line"><h1 class="title">${esc(sc.title)}</h1></div>\n      <p class="sub cap" style="top:${type.captionTop + 1.2 * type.titleSize + 40}px">${esc(sc.subtitle)}</p>`
    : `<p class="cap">${esc(sc.caption)}</p>`;

  sectionsHtml += `    <section id="scene-${sc.id}" class="scene clip" data-start="${cursor / fps}" data-duration="${sc.frames / fps}" data-track-index="0">
      <div class="stage">
        <div class="layer m-color">${colourSvg(shapes)}</div>
        <div class="layer m-line">${lineSvg(sc.id, shapes)}</div>
      </div>
      ${text}
    </section>\n`;
  cursor += sc.frames;
}

const cfg = { fps, width: W, totalFrames: cursor, timing, scenes: cfgScenes, anims };
const runtime = readFileSync(join(root, "src", "runtime.js"), "utf8");
const subs = {
  W,
  H,
  PAPER: palette.paper,
  INK: palette.ink,
  SIDE: type.sideMargin,
  CAPW: video.width - 2 * type.sideMargin,
  CAPTOP: type.captionTop,
  CAPSIZE: type.captionSize,
  CAPLH: type.captionLineHeight,
  TITLESIZE: type.titleSize,
  SUBSIZE: type.subtitleSize,
  SUBTOP: type.captionTop,
  DURATION: cursor / fps,
};
let html = readFileSync(join(root, "src", "template.html"), "utf8");
for (const [k, v] of Object.entries(subs)) html = html.replaceAll(`/*${k}*/`, String(v));
html = html.replace("<!--SCENES-->", () => sectionsHtml).replace("/*CFG*/", () => JSON.stringify(cfg)).replace("/*RUNTIME*/", () => runtime);
writeFileSync(join(root, "index.html"), html);
console.log(`index.html: ${cursor} frames (${cursor / fps}s), ${cfgScenes.length} scenes`);
