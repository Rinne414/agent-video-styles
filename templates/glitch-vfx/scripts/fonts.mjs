// Copies the three small woff2 files used by the template out of node_modules into fonts/.
import { copyFileSync, mkdirSync } from "node:fs";
const files = [
  ["space-grotesk", "space-grotesk-latin-700-normal.woff2"],
  ["space-grotesk", "space-grotesk-latin-500-normal.woff2"],
  ["jetbrains-mono", "jetbrains-mono-latin-400-normal.woff2"],
];
mkdirSync("fonts", { recursive: true });
for (const [pkg, f] of files) copyFileSync(`node_modules/@fontsource/${pkg}/files/${f}`, `fonts/${f}`);
console.log("fonts copied");
