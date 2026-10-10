// Writes index.html from content.json + src/theme.mjs + src/anim.js, and vendors fonts and GSAP.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { col, span, TYPE, Y, MOTION, themeCss } from "../src/theme.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(join(root, "content.json"), "utf8"));
const { video, timing, theme, stats } = content;

// ---- vendor assets (no network at render time) ----
mkdirSync(join(root, "fonts"), { recursive: true });
mkdirSync(join(root, "vendor"), { recursive: true });
const fontFiles = [
  ["@fontsource/inter-tight", "inter-tight-latin-400-normal.woff2"],
  ["@fontsource/inter-tight", "inter-tight-latin-700-normal.woff2"],
  ["@fontsource/ibm-plex-mono", "ibm-plex-mono-latin-500-normal.woff2"],
];
for (const [pkg, file] of fontFiles) copyFileSync(join(root, "node_modules", pkg, "files", file), join(root, "fonts", file));
copyFileSync(join(root, "node_modules/gsap/dist/gsap.min.js"), join(root, "vendor/gsap.min.js"));

// ---- timeline in frames ----
const starts = { masthead: 0, stat: [], colophon: 0 };
let cursor = timing.mastheadFrames;
for (let i = 0; i < stats.length; i++) { starts.stat.push(cursor); cursor += timing.statFrames; }
starts.colophon = cursor;
const totalFrames = cursor + timing.colophonFrames;
const sec = (f) => +(f / video.fps).toFixed(4);

// ---- markup helpers ----
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pos = (left, top, width) => `left:${left}px;top:${top}px${width ? `;width:${width}px` : ""}`;
const line = (html, at) => `<span class="m"><span class="line" data-at="${at}">${html}</span></span>`;
const rule = (left, top, width, at) => `<div class="rule" data-at="${at}" style="${pos(left, top, width)}"></div>`;
const lab = (text, left, top, at) => `<div class="abs lab" style="${pos(left, top)}">${line(esc(text), at)}</div>`;
const stack = (cls, lines, left, top, at0) => {
  const step = MOTION.line.stagger;
  return `<div class="abs ${cls}" style="${pos(left, top)}">${lines.map((l, i) => line(l, at0 + i * step)).join("")}</div>`;
};
const pad2 = (n) => String(n).padStart(2, "0");

function numeral(stat, at) {
  const digits = [...stat.digits];
  const cells = Array.from({ length: 20 }, (_, i) => `<i>${i % 10}</i>`).join("");
  const dgs = digits.map((d, i) => {
    const fromRight = digits.length - 1 - i;
    const end = (10 + +d) * 5; // percent of the 20-cell strip
    return `<span class="dg"><span class="sp">${d}</span><span class="strip" data-at="${at + fromRight * MOTION.roll.stagger}" data-to="${end}">${cells}</span></span>`;
  }).join("");
  const suffix = stat.suffix ? `<span class="suffix"><span class="line" data-at="${at}">${esc(stat.suffix)}</span></span>` : "";
  return `<div class="abs num" style="${pos(col(0), Y.statRule)}">${dgs}${suffix}</div>`;
}

function mastheadScene() {
  const m = content.masthead;
  const titleLines = m.titleLines.map((l) => esc(l.text) + (l.accent ? `<span class="accent">${esc(l.accent)}</span>` : ""));
  const meta = m.meta.map((t, i) => lab(t, col(i * 3), Y.mastheadMeta, 36 + i * 3)).join("");
  return `<section id="s0" class="scene clip" data-start="0" data-duration="${sec(timing.mastheadFrames)}" data-track-index="0">
${stack("title", titleLines, col(0), Y.mastheadTitle, 14)}
${rule(col(0), Y.mastheadRule, span(12), 30)}
${meta}
${lab(m.counter, col(10), Y.topLabel, 2)}
</section>`;
}

function statScene(stat, i) {
  const s = starts.stat[i];
  const textX = col(7);
  const body = stat.body.map((t) => esc(t));
  return `<section id="s${i + 1}" class="scene clip" data-start="${sec(s)}" data-duration="${sec(timing.statFrames)}" data-track-index="0">
${numeral(stat, s)}
${rule(textX, Y.statRule, span(5), s)}
${lab(`${pad2(i + 1)} / ${pad2(stats.length)}`, col(10), Y.topLabel, s + 2)}
${lab(stat.kicker, textX, Y.statKicker, s + 8)}
${stack("hl", stat.headline.map(esc), textX, Y.statHeadline, s + 12)}
${stack("body", body, textX, Y.statBody, s + 30)}
</section>`;
}

function colophonScene() {
  const c = content.colophon;
  const s = starts.colophon;
  const credits = c.credits.map((t, i) => lab(t, col([0, 6, 9][i]), Y.colophonCredits, s + 18 + i * 3)).join("");
  return `<section id="s${stats.length + 1}" class="scene clip" data-start="${sec(s)}" data-duration="${sec(timing.colophonFrames)}" data-track-index="0">
<div class="logo" data-at="${s}" style="${pos(col(0), Y.colophonLogo)}"></div>
${stack("summary", c.summaryLines.map(esc), col(0), Y.colophonSummary, s + 4)}
${rule(col(0), Y.colophonRule, span(12), s + 12)}
${credits}
${lab(c.endLabel, col(10), Y.topLabel, s + 2)}
</section>`;
}

function frameLayer() {
  const cells = stats.map((_, i) => {
    const left = col(7 + i);
    return `<div class="rail" style="${pos(left, Y.bottomCells, span(1))}"></div>` +
      `<div class="fill" data-at="${starts.stat[i]}" data-dur="${timing.statFrames}" style="${pos(left, Y.bottomCells, span(1))}"></div>`;
  }).join("");
  return `<section id="frame" class="scene clip" data-start="0" data-duration="${sec(totalFrames)}" data-track-index="1">
${rule(col(0), Y.topRule, span(12), 0)}
${lab("Annual report 2026", col(0), Y.topLabel, 6)}
${lab(content.sampleLabel, col(6), Y.topLabel, 9)}
${rule(col(0), Y.bottomRule, span(12), 4)}
${lab(content.source, col(0), Y.bottomLabel, 14)}
${cells}
</section>`;
}

const cfg = { fps: video.fps, motion: MOTION };
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=${video.width}, height=${video.height}" />
<title>${esc(content.masthead.titleLines.map((l) => l.text + (l.accent || "")).join(" "))}</title>
<script src="vendor/gsap.min.js"></script>
<style>${themeCss(theme)}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${sec(totalFrames)}" data-width="${video.width}" data-height="${video.height}">
${mastheadScene()}
${stats.map(statScene).join("\n")}
${colophonScene()}
${frameLayer()}
</div>
<script>
const CFG = ${JSON.stringify(cfg)};
${readFileSync(join(root, "src/anim.js"), "utf8")}
</script>
</body></html>
`;
writeFileSync(join(root, "index.html"), html);
console.log(`index.html written: ${totalFrames} frames (${sec(totalFrames)} s)`);
