// Reads content.json, writes content.js (window.CONTENT) and syncs the root data-duration in index.html.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(join(root, "content.json"), "utf8"));
const totalFrames = Object.values(content.scenes).reduce((sum, s) => sum + s.frames, 0);
const seconds = +(totalFrames / content.fps).toFixed(4);

writeFileSync(join(root, "content.js"), `window.CONTENT = ${JSON.stringify(content)};\n`);

const htmlPath = join(root, "index.html");
const html = readFileSync(htmlPath, "utf8");
const next = html.replace(/(id="root"[^>]*?data-duration=")[^"]*(")/s, `$1${seconds}$2`);
if (next !== html) writeFileSync(htmlPath, next);
console.log(`content.js written, ${totalFrames} frames = ${seconds} s`);
