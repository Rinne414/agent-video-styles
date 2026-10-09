// Turns content.json into out/content.js so the page can load it from file:// (fetch is blocked there).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const json = JSON.parse(readFileSync(resolve(root, "content.json"), "utf8"));
mkdirSync(resolve(root, "out"), { recursive: true });
writeFileSync(resolve(root, "out/content.js"), `window.CONTENT = ${JSON.stringify(json)};\n`);
console.log("wrote out/content.js");
