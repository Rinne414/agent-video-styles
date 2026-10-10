// Generates index.html from content.json + assets/audio/timeline.json.
//   node scripts/build.mjs            build index.html
//   node scripts/build.mjs --script   write assets/audio/script.json for scripts/tts.py
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bbox, mulberry32, toPathData } from "./lib/geom.mjs";
import { loadFont } from "./lib/font.mjs";
import { Seq } from "./lib/seq.mjs";
import { earlyScene, endScene, hookScene, snowballScene, year1Scene, year2Scene, zoneCenter } from "./lib/scenes.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const content = JSON.parse(read("content.json"));
const { meta } = content;
const ERASE_FRAMES = 18;
const CAMERA_PEAK = 1.02;

const segments = [{ id: "hook", text: content.hook.speech }, ...content.blocks.map((b) => ({ id: b.id, text: b.speech })), { id: "end", text: content.end.speech }];

if (process.argv.includes("--script")) {
  writeFileSync(join(root, "assets/audio/script.json"), JSON.stringify({ voice: content.voice.name, rate: content.voice.rate, segments }, null, 2));
  console.log("wrote assets/audio/script.json");
  process.exit(0);
}

const timeline = JSON.parse(read("assets/audio/timeline.json"));
const fps = meta.fps;
const toF = (sec) => Math.round(sec * fps);

// Narration is the master clock: each scene starts when its sentence starts.
let cursor = meta.leadSec;
const plan = timeline.segments.map((seg) => {
  const start = cursor;
  cursor += seg.duration_ms / 1000 + content.gaps.betweenSec;
  return { id: seg.id, file: seg.file, start, dur: seg.duration_ms / 1000, speechEnd: start + seg.words.at(-1).end_ms / 1000 };
});
const totalSec = cursor + meta.tailSec;
const totalFrames = toF(totalSec);

const font = loadFont(join(root, "assets/hershey-futural.json"));
const rand = mulberry32(content.pen.seed);
const mk = (i, group, zone) => new Seq({ startFrame: toF(plan[i].start), group, zone, font, pen: content.pen, palette: content.palette, rand });

const all = [];
const report = [];
const run = (i, group, zone, fn) => {
  const seq = mk(i, group, zone);
  fn(seq);
  const lastEnd = Math.max(...seq.strokes.map((s) => s.e));
  report.push({ id: plan[i].id, inkEnd: lastEnd / fps, speechEnd: plan[i].speechEnd, segEnd: plan[i].start + plan[i].dur, strokes: seq.strokes.length });
  all.push(...seq.strokes.map((s) => ({ ...s, block: i })));
};

const W = meta.width, H = meta.height;
run(0, "hook", -1, (s) => hookScene(s, content, W, H));
const sceneFns = [year1Scene, year2Scene, snowballScene, earlyScene];
content.blocks.forEach((b, k) => run(k + 1, "main", k, (s) => sceneFns[k](s, content, b, k)));
run(plan.length - 1, "end", -1, (s) => endScene(s, content, W, H));

// Camera: per block, centered on the active zone (1.00 -> 1.03 -> 1.00 inside each block).
const cam = content.blocks.map((_, k) => {
  const c = zoneCenter(k);
  return [toF(plan[k + 1].start), toF(plan[k + 2].start), c.cx, c.cy];
});
// Erase sweeps finish exactly when the next section's first stroke starts.
const erase = [["hook", toF(plan[1].start) - ERASE_FRAMES], ["main", toF(plan[plan.length - 1].start) - ERASE_FRAMES]];

// Safe-area check at the camera peak (every main stroke under every zone camera).
let worst = { l: 1e9, t: 1e9, r: -1e9, b: -1e9 };
for (const s of all) {
  const boxes = s.group === "main" ? cam : [[0, 0, W / 2, H / 2, 1]];
  const bb = bbox(s.pts);
  for (const [, , cx, cy] of boxes) {
    const sc = s.group === "main" ? CAMERA_PEAK : 1;
    const tx = (x) => sc * x + (1 - sc) * cx, ty = (y) => sc * y + (1 - sc) * cy;
    worst = { l: Math.min(worst.l, tx(bb.x0 - s.width / 2)), t: Math.min(worst.t, ty(bb.y0 - s.width / 2)), r: Math.max(worst.r, tx(bb.x1 + s.width / 2)), b: Math.max(worst.b, ty(bb.y1 + s.width / 2)) };
  }
}

const pathEl = (s, i) =>
  `<path d="${toPathData(s.pts)}" pathLength="1" stroke="${s.color}" stroke-width="${s.width}" style="display:none;stroke-dasharray:1 2;stroke-dashoffset:1" data-i="${i}"/>`;
const byGroup = (g) => all.map((s, i) => (s.group === g ? pathEl(s, i) : "")).join("");

const data = {
  fps,
  total: totalFrames,
  ERASE_FRAMES,
  board: { w: W, h: H },
  ink: all.map((s) => [+s.s.toFixed(2), +s.e.toFixed(2), +s.len.toFixed(1), ...[s.pts[0], s.pts.at(-1)].flatMap(([x, y]) => [+x.toFixed(1), +y.toFixed(1)]), s.block, s.ramp]),
  cam,
  erase,
};

const audio = plan
  .map((p) => `<audio id="vo-${p.id}" src="assets/audio/${p.file}" data-start="${p.start.toFixed(3)}" data-duration="${p.dur.toFixed(3)}" data-track-index="1" data-volume="1"></audio>`)
  .join("\n    ");

const html = read("src/template.html")
  .replaceAll("/*BOARD*/", content.palette.board)
  .replace("/*FRAME*/", content.palette.frame)
  .replace("/*TRAY*/", content.palette.tray)
  .replaceAll("/*DURATION*/", totalSec.toFixed(3))
  .replace("/*INK_HOOK*/", byGroup("hook"))
  .replace("/*INK_MAIN*/", byGroup("main"))
  .replace("/*INK_END*/", byGroup("end"))
  .replace("/*AUDIO*/", audio)
  .replace("/*DATA*/", JSON.stringify(data))
  .replace("/*DRIVER*/", read("src/driver.js"));
writeFileSync(join(root, "index.html"), html);

console.log(`total ${totalSec.toFixed(2)} s = ${totalFrames} frames, ${all.length} strokes`);
for (const r of report) {
  const flag = r.inkEnd > r.speechEnd ? "  <-- INK LATE" : "";
  console.log(`${r.id.padEnd(9)} ink ends ${r.inkEnd.toFixed(2)} s | speech ends ${r.speechEnd.toFixed(2)} s | segment ends ${r.segEnd.toFixed(2)} s | ${r.strokes} strokes${flag}`);
}
console.log(`ink extent at camera peak: x ${worst.l.toFixed(0)}..${worst.r.toFixed(0)}, y ${worst.t.toFixed(0)}..${worst.b.toFixed(0)} (safe 80..1840, 80..1000)`);
