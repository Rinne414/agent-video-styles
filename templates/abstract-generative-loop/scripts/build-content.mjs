// Reads content.json and writes out/content.js (window.CONTENT = {...}) for the classic <script> tag.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const content = JSON.parse(readFileSync(resolve(root, "content.json"), "utf8"));
if (content.frames % 60 !== 0) throw new Error("content.frames must be a multiple of 60");
mkdirSync(resolve(root, "out"), { recursive: true });
writeFileSync(resolve(root, "out/content.js"), `window.CONTENT = ${JSON.stringify(content)};\n`);
console.log("wrote out/content.js");
