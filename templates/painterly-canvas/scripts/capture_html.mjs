#!/usr/bin/env node
// Deterministic HTML -> MP4 capture. The page must expose
//   window.renderFrame(i, fps)   // draw frame i synchronously (or return a Promise)
// and optionally `window.__ready` (Promise) when fonts/assets are loaded.
// Usage: node capture_html.mjs <page.html> --out out.mp4 [--width 1080 --height 1080
//        --fps 30 --frames 150 --start 0 --audio a.mp3 --selector canvas --crf 18]
// Still: node capture_html.mjs <page.html> --out still.png --start 120   (one PNG of frame 120)
// Needs: ffmpeg on PATH, system Chrome/Chromium, and `puppeteer-core`
// (npm i puppeteer-core in the project dir; resolved from cwd, then this script's dir).
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const USAGE =
  "usage: node capture_html.mjs <page.html> --out out.mp4|still.png [--width 1080] [--height 1080] [--fps 30] [--frames 150] [--start 0] [--audio a.mp3] [--selector canvas] [--crf 18] [--chrome path]";
const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

function fail(msg) {
  console.error(`capture_html: ${msg}`);
  process.exit(1);
}

function parseArgs(argv) {
  const opts = { width: 1080, height: 1080, fps: 30, frames: 150, crf: 18, start: 0 };
  const positional = [];
  for (let k = 0; k < argv.length; k++) {
    const a = argv[k];
    if (!a.startsWith("--")) {
      positional.push(a);
      continue;
    }
    const key = a.slice(2);
    const val = argv[++k];
    if (val === undefined) fail(`missing value for ${a}\n${USAGE}`);
    if (["width", "height", "fps", "frames", "crf"].includes(key)) {
      opts[key] = Number(val);
      if (!Number.isFinite(opts[key]) || opts[key] <= 0) fail(`${a} must be a positive number`);
    } else if (key === "start") {
      opts.start = Number(val);
      if (!Number.isInteger(opts.start) || opts.start < 0) fail("--start must be a non-negative integer");
    } else if (["out", "audio", "selector", "chrome"].includes(key)) {
      opts[key] = val;
    } else fail(`unknown option ${a}\n${USAGE}`);
  }
  opts.page = positional[0];
  if (!opts.page || !opts.out) fail(USAGE);
  if (opts.width % 2 || opts.height % 2) fail("width and height must be even (yuv420p)");
  return opts;
}

async function loadPuppeteer() {
  const bases = [process.cwd() + "/", dirname(fileURLToPath(import.meta.url)) + "/"];
  for (const base of bases) {
    try {
      const entry = createRequire(base).resolve("puppeteer-core");
      return (await import(pathToFileURL(entry).href)).default;
    } catch {
      /* try next base */
    }
  }
  return fail("puppeteer-core not found. Run: npm i puppeteer-core (in your project dir)");
}

function startFfmpeg(o) {
  const args = ["-y", "-v", "error", "-f", "image2pipe", "-framerate", String(o.fps), "-c:v", "png", "-i", "-"];
  if (o.audio) args.push("-i", resolve(o.audio));
  args.push("-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", String(o.crf), "-preset", "medium");
  if (o.audio) args.push("-c:a", "aac", "-b:a", "192k", "-shortest");
  args.push("-movflags", "+faststart", resolve(o.out));
  const proc = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });
  proc.stdin.on("error", () => {}); // a dead pipe is reported through `done` below
  const done = new Promise((res, rej) => {
    proc.on("error", (e) => rej(new Error(`ffmpeg failed to start: ${e.message}`)));
    proc.on("close", (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited with ${code}`))));
  });
  done.catch(() => {}); // surfaced by the awaiting caller; avoids unhandled rejection mid-loop
  return { proc, done };
}

/** Write one frame; fail fast if ffmpeg exits instead of waiting for a drain that never comes. */
async function writeFrame(ff, buf) {
  if (ff.proc.stdin.write(buf)) return;
  const exited = ff.done.then(() => {
    throw new Error("ffmpeg exited before all frames were written");
  });
  await Promise.race([new Promise((r) => ff.proc.stdin.once("drain", r)), exited]);
}

async function main() {
  const o = parseArgs(process.argv.slice(2));
  const pagePath = resolve(o.page);
  if (!existsSync(pagePath)) fail(`page not found: ${pagePath}`);
  if (o.audio && !existsSync(o.audio)) fail(`audio not found: ${o.audio}`);
  const chrome = o.chrome || CHROME_CANDIDATES.find((p) => p && existsSync(p));
  if (!chrome) fail("Chrome not found; pass --chrome <path> or set CHROME_PATH");

  const puppeteer = await loadPuppeteer();
  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    args: ["--hide-scrollbars", "--force-color-profile=srgb", "--disable-background-timer-throttling"],
    defaultViewport: { width: o.width, height: o.height, deviceScaleFactor: 1 },
  });
  const stillMode = o.out.toLowerCase().endsWith(".png");
  if (!stillMode && spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).error) {
    fail("ffmpeg not found on PATH (needed to encode the video)");
  }
  const ff = stillMode ? null : startFfmpeg(o);
  const started = Date.now();
  try {
    const page = await browser.newPage();
    page.on("pageerror", (e) => console.error("page error:", e.message));
    page.on("console", (m) => m.type() === "error" && console.error("page console.error:", m.text()));
    await page.goto(pathToFileURL(pagePath).href, { waitUntil: "load" });
    await page.evaluate(async () => {
      if (typeof window.renderFrame !== "function") throw new Error("window.renderFrame(i, fps) is not defined");
      await (window.__ready ?? document.fonts.ready);
    });
    const target = o.selector ? await page.waitForSelector(o.selector) : page;
    const draw = (frame) => page.evaluate(async (f, fps) => window.renderFrame(f, fps), frame, o.fps);
    if (stillMode) {
      await draw(o.start);
      await target.screenshot({ type: "png", path: resolve(o.out) });
    } else {
      for (let n = 0; n < o.frames; n++) {
        await draw(o.start + n);
        await writeFrame(ff, await target.screenshot({ type: "png" }));
        if (n % 30 === 0) process.stderr.write(`\rframe ${n + 1}/${o.frames}`);
      }
      process.stderr.write(`\rframe ${o.frames}/${o.frames}\n`);
      ff.proc.stdin.end();
      await ff.done;
    }
  } catch (err) {
    ff?.proc.stdin.destroy();
    throw err;
  } finally {
    await browser.close();
  }
  const count = stillMode ? `frame ${o.start}` : `${o.frames} frames from ${o.start}`;
  console.log(`wrote ${resolve(o.out)} (${count}, ${((Date.now() - started) / 1000).toFixed(1)}s)`);
}

main().catch((e) => fail(e.message));
