// Builds index.html: injects content.json and concatenates src/*.js into one inline script.
import { readFileSync, writeFileSync } from "node:fs";

const content = JSON.parse(readFileSync("content.json", "utf8"));
const order = ["theme", "logo", "scene", "fx", "main"];
const script = order.map((n) => readFileSync(`src/${n}.js`, "utf8")).join("\n");
const duration = content.meta.durationFrames / content.meta.fps;

const html = readFileSync("src/index.template.html", "utf8")
  .replaceAll("{{DURATION}}", String(duration))
  .replace("{{CONTENT}}", () => JSON.stringify(content))
  .replace("{{SCRIPT}}", () => script);
writeFileSync("index.html", html);

// Schedule report: burst share of the piece and the shortest clean gap between bursts.
const fps = content.meta.fps;
const bursts = [...content.bursts].sort((a, b) => a.start - b.start);
const burstFrames = bursts.reduce((n, b) => n + b.len, 0);
const gaps = bursts.slice(1).map((b, i) => b.start - (bursts[i].start + bursts[i].len));
console.log(
  `built index.html: ${duration}s @ ${fps}fps, ${bursts.length} bursts, ${burstFrames} burst frames ` +
    `(${((100 * burstFrames) / content.meta.durationFrames).toFixed(1)}%), gaps between bursts: ${gaps.join(",")}`,
);
