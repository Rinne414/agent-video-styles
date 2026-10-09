// Render single frames to PNG: node scripts/still.mjs 40 150 300 --dir out/stills
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const dirAt = args.indexOf("--dir");
const dir = resolve(root, dirAt >= 0 ? args.splice(dirAt, 2)[1] : "out/stills");
const frames = args.map(Number).filter(Number.isFinite);
const chrome = process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe";
mkdirSync(dir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: chrome,
  headless: true,
  args: ["--hide-scrollbars", "--force-color-profile=srgb"],
  defaultViewport: { width: 1080, height: 1080, deviceScaleFactor: 1 },
});
try {
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.error("page error:", e.message));
  await page.goto(pathToFileURL(resolve(root, "index.html")).href, { waitUntil: "load" });
  await page.evaluate(async () => { await window.__ready; });
  for (const f of frames) {
    await page.evaluate(async (i) => window.renderFrame(i, 30), f);
    writeFileSync(resolve(dir, `f${String(f).padStart(4, "0")}.png`), await page.screenshot({ type: "png" }));
    console.log("still", f);
  }
} finally {
  await browser.close();
}
