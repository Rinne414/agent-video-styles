// Generates index.html from content.json + src/*.js. Run before check/render.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const content = JSON.parse(read("content.json"));

const parts = [
  "src/theme.js",
  "const SCENES = [];",
  "src/hud.js",
  "src/scenes/cold.js",
  "src/scenes/hits.js",
  "src/scenes/build.js",
  "src/scenes/drop.js",
  "src/scenes/finale.js",
  "src/main.js",
];
const script = parts.map((p) => (p.endsWith(".js") ? read(p) : p)).join("\n");

const html = read("src/template.html")
  .replaceAll("{{BG}}", content.colors.bg)
  .replaceAll("{{MONO}}", content.fonts.mono)
  .replaceAll("{{DURATION}}", String(content.format.durationSec))
  .replace("{{CONTENT}}", () => JSON.stringify(content))
  .replace("{{SCRIPT}}", () => script);

writeFileSync(join(root, "index.html"), html);
console.log(`index.html written (${content.format.durationSec}s @ ${content.format.fps}fps)`);
