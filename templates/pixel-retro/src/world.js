// ---- world: dithered sky bands, sun, parallax hills, ground ----
const BG_PAD = 4; // extra pixels so screen shake never reveals an edge
const skyCache = {};

function skyCanvas(name) {
  if (skyCache[name]) return skyCache[name];
  const cols = CONTENT.skies[name];
  const [c, g] = makeCanvas(W + BG_PAD * 2, GROUND_Y);
  const bandH = GROUND_Y / cols.length, blend = 16;
  const bayer2 = [[0, 2], [3, 1]];
  for (let y = 0; y < GROUND_Y; y++) {
    const k = Math.min(cols.length - 1, Math.floor(y / bandH));
    const edge = (k + 1) * bandH, d = y - (edge - blend / 2);
    if (k < cols.length - 1 && d >= 0) {
      for (let x = 0; x < c.width; x++) {
        g.fillStyle = (d / blend) * 4 > bayer2[y & 1][x & 1] + 0.5 ? cols[k + 1] : cols[k];
        g.fillRect(x, y, 1, 1);
      }
    } else {
      g.fillStyle = cols[k]; g.fillRect(0, y, c.width, 1);
    }
  }
  skyCache[name] = c;
  return c;
}

function drawSun(cx, cy) {
  const R = 16;
  for (let dy = -R; dy <= R; dy++) {
    const half = Math.floor(Math.sqrt(R * R - dy * dy));
    rect(cx - half, cy + dy, half * 2 + 1, 1, PAL.red);
    const inner = Math.floor(Math.sqrt(Math.max(0, (R - 2) * (R - 2) - dy * dy)));
    if (Math.abs(dy) <= R - 2) rect(cx - inner, cy + dy, inner * 2 + 1, 1, PAL.white);
  }
}

function drawStars(f) {
  const rng = mulberry32(7);
  for (let i = 0; i < 26; i++) {
    const x = Math.floor(rng() * W), y = 4 + Math.floor(rng() * 190), ph = Math.floor(rng() * 40);
    if ((f + ph) % 40 < 30) rect(x, y, 1 + (i % 4 === 0 ? 1 : 0), 1 + (i % 4 === 0 ? 1 : 0), i % 3 ? PAL.white : PAL.yellow);
  }
}

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawClouds(f) {
  const step = Math.floor(f / 6); // integer scroll, 1 px per 6 frames
  const span = W + 80;
  [[40, 30], [200, 146], [110, 190]].forEach(([x0, y], i) => {
    const x = ((x0 - step * (i % 2 + 1) + 200 * span) % span) - 40;
    drawSprite(CLOUD, x, y, 2);
  });
}

function drawHills(f) {
  const farOff = Math.floor(f / 24), midOff = Math.floor(f / 10);
  for (let x = -BG_PAD; x < W + BG_PAD; x++) {
    const hf = 40 + Math.round(10 * Math.sin((x + farOff) / 41) + 6 * Math.sin((x + farOff) / 17));
    rect(x, GROUND_Y - hf, 1, hf, PAL.lavender);
    const hm = 20 + Math.round(8 * Math.sin((x + midOff) / 29 + 1) + 3 * Math.sin((x + midOff) / 11));
    rect(x, GROUND_Y - hm, 1, hm, PAL.green);
    rect(x, GROUND_Y - hm, 1, 1, PAL.lime);
  }
}

function drawGround() {
  rect(-BG_PAD, GROUND_Y, W + BG_PAD * 2, 5, PAL.lime);
  rect(-BG_PAD, GROUND_Y + 5, W + BG_PAD * 2, 30, PAL.green);
  // dirt with 2x2 Bayer-style checker transition
  for (let y = GROUND_Y + 35; y < H + BG_PAD; y++) {
    const dense = y < GROUND_Y + 43;
    for (let x = -BG_PAD; x < W + BG_PAD; x++) {
      const on = dense ? (x + y) % 2 === 0 : true;
      if (dense) rect(x, y, 1, 1, on ? PAL.brown : PAL.green);
    }
  }
  rect(-BG_PAD, GROUND_Y + 43, W + BG_PAD * 2, H, PAL.brown);
  const rng = mulberry32(11);
  for (let i = 0; i < 40; i++) rect(Math.floor(rng() * W), GROUND_Y + 48 + Math.floor(rng() * 120), 3, 2, PAL.stone);
}

function drawFlowers() {
  const spots = [[22, 0, PAL.red], [58, 3, PAL.yellow], [212, 1, PAL.pink], [246, 4, PAL.white], [186, 6, PAL.red]];
  for (const [x, o, c] of spots) {
    rect(x + 1, GROUND_Y + 8 + o, 1, 3, PAL.black);
    rect(x, GROUND_Y + 6 + o, 3, 3, c);
    rect(x + 1, GROUND_Y + 7 + o, 1, 1, PAL.yellow);
  }
}

function drawWorld(f, skyName, opts = {}) {
  ctx.drawImage(skyCanvas(skyName), -BG_PAD, 0);
  if (opts.stars) drawStars(f);
  drawSun(CONTENT.sun.x, CONTENT.sun.y[skyName]);
  drawClouds(f);
  drawHills(f);
  drawGround();
  drawFlowers();
}
