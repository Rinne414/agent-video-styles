// Builds index.html from content.json + src/*.js (HyperFrames needs a static, inline-script composition).
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(join(root, "content.json"), "utf8"));
const parts = ["prng", "paper", "scenes-a", "scenes-b", "main"].map((n) => readFileSync(join(root, "src", `${n}.js`), "utf8"));
const script = `const CONTENT = ${JSON.stringify(content)};\n` + parts.join("\n");
const dur = content.video.durationFrames / content.video.fps;

const html = readFileSync(join(root, "src", "template.html"), "utf8")
  .replaceAll("__DUR__", String(dur))
  .replaceAll("__TABLE__", content.palette.table)
  .replaceAll("__GRAIN__", String(content.video.grainOpacity))
  .replace("__SCRIPT__", () => script);
writeFileSync(join(root, "index.html"), html);
console.log(`index.html written, ${dur}s`);
