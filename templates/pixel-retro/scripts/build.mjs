// Generates index.html from content.json + src/*.js (static markup so `hyperframes check` sees everything).
import { readFileSync, writeFileSync, existsSync, copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const content = JSON.parse(read("content.json"));

// vendor offline assets from npm packages when they are installed
const vendor = [
  ["node_modules/gsap/dist/gsap.min.js", "vendor/gsap.min.js"],
  ["node_modules/@fontsource/press-start-2p/files/press-start-2p-latin-400-normal.woff2", "fonts/PressStart2P.woff2"],
];
for (const [from, to] of vendor) {
  if (existsSync(join(root, from))) {
    mkdirSync(dirname(join(root, to)), { recursive: true });
    copyFileSync(join(root, from), join(root, to));
  }
}

const { width, height, fps } = content.video;
const t = content.timing;
const frames = t.titleFrames + t.questFrames * content.quests.length + t.outroFrames;
const scripts = ["gfx", "hero", "world", "hud", "scenes", "main"].map((n) => read(`src/${n}.js`)).join("\n");

const html = read("src/template.html")
  .replaceAll("{{WIDTH}}", width).replaceAll("{{HEIGHT}}", height)
  .replace("{{DURATION}}", frames / fps)
  .replace("{{CRT}}", content.crt ? "block" : "none")
  .replace("{{CONTENT}}", () => JSON.stringify(content))
  .replace("{{SCRIPTS}}", () => scripts);
writeFileSync(join(root, "index.html"), html);
console.log(`index.html written: ${frames} frames, ${frames / fps} s`);
