// ---- gfx: logical 270x480 canvas, integer-only drawing, palette-pure text ----
const W = 270, H = 480, GROUND_Y = 300;
const PAL = CONTENT.palette;
const cv = document.getElementById("screen");
const ctx = cv.getContext("2d");
ctx.imageSmoothingEnabled = false;
const FONT = '"Press Start 2P"';
const BAYER4 = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]];

const ri = (v) => Math.round(v);
function rect(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(ri(x), ri(y), ri(w), ri(h));
}

function makeCanvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d");
  g.imageSmoothingEnabled = false;
  return [c, g];
}

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

// Text is rasterised once at its native size, then alpha is thresholded so no
// anti-aliased (off-palette) pixels survive.
const textCache = {};
function textSprite(str, size, color) {
  const key = str + "|" + size + "|" + color;
  if (textCache[key]) return textCache[key];
  // Rasterise at 8x, then sample the centre of every font pixel: immune to sub-pixel baseline offsets
  const K = 8, w = Math.max(1, str.length * size);
  const [big, bg] = makeCanvas(w * K, size * K);
  bg.font = size * K + "px " + FONT;
  bg.textBaseline = "top";
  bg.fillStyle = "#fff";
  bg.fillText(str, 0, 0);
  const src = bg.getImageData(0, 0, w * K, size * K).data;
  const [c, g] = makeCanvas(w, size);
  const out = g.createImageData(w, size);
  const [r, gg, b] = hexToRgb(color);
  for (let y = 0; y < size; y++) for (let x = 0; x < w; x++) {
    const on = src[((y * K + K / 2) * w * K + (x * K + K / 2)) * 4 + 3] > 127;
    const o = (y * w + x) * 4;
    out.data[o] = r; out.data[o + 1] = gg; out.data[o + 2] = b; out.data[o + 3] = on ? 255 : 0;
  }
  g.putImageData(out, 0, 0);
  if (document.fonts.check(size * K + "px " + FONT)) textCache[key] = c;
  return c;
}

const textWidth = (str, size) => str.length * size;

// opts: outline (px, black), shadow (px, color), chars (typewriter count)
function drawText(str, x, y, size, color, opts = {}) {
  const n = opts.chars === undefined ? str.length : Math.max(0, Math.min(str.length, opts.chars));
  if (n === 0) return;
  const s = str.slice(0, n);
  x = ri(x); y = ri(y);
  if (opts.outline) {
    const o = opts.outline, k = textSprite(s, size, PAL.black);
    for (const [ox, oy] of [[-o, 0], [o, 0], [0, -o], [0, o], [-o, -o], [o, -o], [-o, o], [o, o]]) ctx.drawImage(k, x + ox, y + oy);
  }
  if (opts.shadow) ctx.drawImage(textSprite(s, size, opts.shadowColor || PAL.black), x + opts.shadow, y + opts.shadow);
  ctx.drawImage(textSprite(s, size, color), x, y);
}

function drawCentered(str, cx, y, size, color, opts = {}) {
  drawText(str, cx - Math.floor(textWidth(str, size) / 2), y, size, color, opts);
}

// RPG dialog box: 2 px border on navy
function dialog(x, y, w, h, fill = PAL.navy, border = PAL.white) {
  rect(x, y, w, h, border);
  rect(x + 2, y + 2, w - 4, h - 4, fill);
}

// Sprite from a string grid; map char -> palette color; auto 1 px outline
function gridSprite(rows, map, outline = true) {
  const h = rows.length, w = rows[0].length, pad = outline ? 1 : 0;
  const [c, g] = makeCanvas(w + pad * 2, h + pad * 2);
  const at = (x, y) => (x >= 0 && y >= 0 && x < w && y < h && rows[y][x] !== "." ? map[rows[y][x]] : null);
  for (let y = -pad; y < h + pad; y++) {
    for (let x = -pad; x < w + pad; x++) {
      let col = at(x, y);
      if (!col && outline && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) col = PAL.black;
      if (col) { g.fillStyle = col; g.fillRect(x + pad, y + pad, 1, 1); }
    }
  }
  return c;
}

function drawSprite(c, x, y, scale = 1) {
  ctx.drawImage(c, ri(x), ri(y), c.width * scale, c.height * scale);
}

// Bayer 4x4 dither mask in a colour: level 0..16 of 16 pixels covered
const maskCache = {};
function ditherMask(level, color) {
  const key = level + color;
  if (maskCache[key]) return maskCache[key];
  const [c, g] = makeCanvas(W, H);
  g.fillStyle = color;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (BAYER4[y & 3][x & 3] < level) g.fillRect(x, y, 1, 1);
  maskCache[key] = c;
  return c;
}

const CLOUD = gridSprite([
  "......WWWW......",
  "...WWWWWWWWW....",
  "..WWWWWWWWWWWW..",
  ".WWWWWWWWWWWWWW.",
  "WWWWWWWWWWWWWWWW",
  "SSSSSSSSSSSSSSSS",
], { W: PAL.white, S: PAL.silver }, false);

const STAR = gridSprite([
  "..Y..",
  "..Y..",
  "YYWYY",
  "..Y..",
  "..Y..",
], { Y: PAL.yellow, W: PAL.white }, false);

const STAR_SMALL = gridSprite([".Y.", "YWY", ".Y."], { Y: PAL.yellow, W: PAL.white }, false);
