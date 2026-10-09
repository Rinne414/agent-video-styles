// Fails when any overlay rect (content.json) intersects the face-safe box.
import { readFileSync } from "node:fs";

const content = JSON.parse(readFileSync(new URL("../content.json", import.meta.url), "utf8"));
const { faceBox } = content;

const overlays = [
  ["lowerThird", content.lowerThird],
  ...content.steps.map((s, i) => [`step${i + 1}`, s]),
  ["callout", content.callout],
  ["subscribe", content.subscribe],
];

const intersects = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

let failed = false;
for (const [name, o] of overlays) {
  const hit = intersects(o.rect, faceBox);
  if (hit) failed = true;
  console.log(`${hit ? "FAIL" : "ok  "} ${name} frames ${o.from}-${o.to}`);
}

// At most two overlays on screen at once.
for (let f = 0; f < content.durationInFrames; f++) {
  const live = overlays.filter(([, o]) => f >= o.from && f < o.to).length;
  if (live > 2) {
    console.log(`FAIL ${live} overlays at frame ${f}`);
    failed = true;
    break;
  }
}
process.exit(failed ? 1 : 0);
