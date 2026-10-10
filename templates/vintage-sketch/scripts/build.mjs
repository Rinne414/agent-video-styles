// Generates index.html from content.json + src/. Run: node scripts/build.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { content, theme, css } from "../src/theme.mjs";
import { titleScene, plate1, plate2, plate3, colophonScene } from "../src/scenes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fps = theme.fps;
const { title, plates, colophon, fade } = content.timing;

const scenes = [
  { id: "scene-title", len: title, fadeOut: true, svg: titleScene(theme, content) },
  { id: "scene-p1", len: plates[0], fadeOut: true, svg: plate1(theme, content.plates[0]) },
  { id: "scene-p2", len: plates[1], fadeOut: true, svg: plate2(theme, content.plates[1]) },
  { id: "scene-p3", len: plates[2], fadeOut: true, svg: plate3(theme, content.plates[2]) },
  { id: "scene-end", len: colophon, fadeOut: false, svg: colophonScene(theme, content) },
];

let cursor = 0;
const layout = scenes.map((s) => {
  const entry = { id: s.id, start: cursor, len: s.len, fade, fadeOut: s.fadeOut };
  cursor += s.len;
  return entry;
});
const totalFrames = cursor;

const frameSvg =
  `<svg viewBox="0 0 1920 1080"><rect class="dr fr" pathLength="1" x="40" y="40" width="1840" height="1000"/>` +
  `<rect class="dr fr" pathLength="1" x="48" y="48" width="1824" height="984"/></svg>`;

const sections = scenes
  .map((s, i) => {
    const l = layout[i];
    const dur = (l.len + (s.fadeOut ? fade : 0)) / fps;
    return `<section id="${s.id}" class="scene clip" data-start="${l.start / fps}" data-duration="${dur}" data-track-index="${i + 1}" data-layout-allow-overlap>` +
      `<svg viewBox="0 0 1920 1080">${s.svg}</svg></section>`;
  })
  .join("\n");

const anim = readFileSync(join(root, "src", "anim.js"), "utf8");
const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" /><meta name="viewport" content="width=1920, height=1080" />
<script src="vendor/gsap.min.js"></script>
<style>${css}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${totalFrames / fps}" data-width="1920" data-height="1080">
<section id="frame" class="frame clip" data-start="0" data-duration="${totalFrames / fps}" data-track-index="0">${frameSvg}</section>
${sections}
</div>
<script>
const FPS = ${fps};
const LAYOUT = ${JSON.stringify(layout)};
${anim}
</script>
</body></html>
`;
writeFileSync(join(root, "index.html"), html);
console.log(`index.html written: ${totalFrames} frames (${totalFrames / fps} s)`);
