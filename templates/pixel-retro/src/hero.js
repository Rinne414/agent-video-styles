// ---- hero: 32x32 sprite composed from rects per pose, then outlined ----
const heroCache = {};
const HERO_GRID = 32;

function heroSprite(p) {
  const key = JSON.stringify(p);
  if (heroCache[key]) return heroCache[key];
  const G = HERO_GRID;
  const grid = new Array(G * G).fill(null);
  const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < G && y < G) grid[y * G + x] = c; };
  const box = (x, y, w, h, c) => { for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) put(x + i, y + j, c); };
  const h0 = 4 + (p.bob || 0), dx = p.dx || 0;

  // legs (planted; only the upper body bobs)
  if (p.legs === "jump") {
    box(11, 25, 3, 3, PAL.navy); box(18, 25, 3, 3, PAL.navy);
    box(8, 28, 5, 2, PAL.brown); box(19, 28, 5, 2, PAL.brown);
  } else {
    box(12, 25, 3, 5, PAL.navy); box(17, 25, 3, 5, PAL.navy);
    box(11, 30, 4, 2, PAL.brown); box(17, 30, 4, 2, PAL.brown);
  }
  // body
  box(11 + dx, h0 + 12, 10, 9, PAL.blue);
  box(11 + dx, h0 + 18, 10, 1, PAL.white);
  box(15 + dx, h0 + 18, 2, 1, PAL.yellow);
  // head
  box(11 + dx, h0, 10, 1, PAL.brown);
  box(10 + dx, h0 + 1, 12, 2, PAL.brown);
  box(10 + dx, h0 + 3, 12, 1, PAL.red);
  put(22 + dx, h0 + 3, PAL.red); put(23 + dx, h0 + 4 + (p.bob ? 1 : 0), PAL.red); put(24 + dx, h0 + 5 + (p.bob ? 1 : 0), PAL.red);
  box(10 + dx, h0 + 4, 12, 8, PAL.peach);
  box(10 + dx, h0 + 4, 1, 3, PAL.brown); box(21 + dx, h0 + 4, 1, 3, PAL.brown);
  box(11 + dx, h0 + 4, 4, 1, PAL.brown);
  put(12 + dx, h0 + 9, PAL.pink); put(19 + dx, h0 + 9, PAL.pink);
  // eyes
  const eyes = p.eyes || "open";
  if (eyes === "open") { box(13 + dx, h0 + 6, 1, 2, PAL.black); box(18 + dx, h0 + 6, 1, 2, PAL.black); }
  else if (eyes === "shut") { box(12 + dx, h0 + 7, 3, 1, PAL.black); box(17 + dx, h0 + 7, 3, 1, PAL.black); }
  else {
    put(12 + dx, h0 + 7, PAL.black); put(13 + dx, h0 + 6, PAL.black); put(14 + dx, h0 + 7, PAL.black);
    put(17 + dx, h0 + 7, PAL.black); put(18 + dx, h0 + 6, PAL.black); put(19 + dx, h0 + 7, PAL.black);
  }
  // mouth
  const mouth = p.mouth || "smile";
  if (mouth === "smile") { put(14 + dx, h0 + 10, PAL.black); put(17 + dx, h0 + 10, PAL.black); box(15 + dx, h0 + 11, 2, 1, PAL.black); }
  else if (mouth === "o") box(15 + dx, h0 + 9, 2, 2, PAL.black);
  else box(15 + dx, h0 + 10, 2, 1, PAL.black);
  // cup (drawn over the face, under the hand)
  if (p.cup) {
    const { x, y, lv } = p.cup;
    box(x - 1, y - 1, 8, 9, PAL.black);
    box(x, y, 6, 7, PAL.navy);
    box(x, y, 1, 7, PAL.white); box(x + 5, y, 1, 7, PAL.white); box(x, y + 6, 6, 1, PAL.white);
    box(x + 1, y + 6 - lv, 4, lv, PAL.blue);
  }
  // arms: sleeve line from shoulder, skin hand at the target
  const arm = (sx, sy, [tx, ty]) => {
    let x = sx, y = sy;
    const ddx = Math.abs(tx - x), ddy = -Math.abs(ty - y), stx = x < tx ? 1 : -1, sty = y < ty ? 1 : -1;
    let err = ddx + ddy;
    for (let guard = 0; guard < 80; guard++) {
      box(x, y, 2, 2, PAL.blue);
      if (x === tx && y === ty) break;
      const e2 = 2 * err;
      if (e2 >= ddy) { err += ddy; x += stx; }
      if (e2 <= ddx) { err += ddx; y += sty; }
    }
    box(tx, ty, 2, 2, PAL.peach);
  };
  arm(10 + dx, h0 + 13, p.lh || [8, 24]);
  arm(20 + dx, h0 + 13, p.rh || [22, 24]);

  // outline pass
  const [c, g] = makeCanvas(G + 2, G + 2);
  const at = (x, y) => (x >= 0 && y >= 0 && x < G && y < G ? grid[y * G + x] : null);
  for (let y = -1; y <= G; y++) for (let x = -1; x <= G; x++) {
    let col = at(x, y);
    if (!col && (at(x - 1, y) || at(x + 1, y) || at(x, y - 1) || at(x, y + 1))) col = PAL.black;
    if (col) { g.fillStyle = col; g.fillRect(x + 1, y + 1, 1, 1); }
  }
  heroCache[key] = c;
  return c;
}

const HERO_SCALE = 2;
const HERO_X = 135 - (HERO_GRID + 2);               // centred, scale 2
const HERO_Y = GROUND_Y + 6 - (HERO_GRID + 2) * HERO_SCALE;

// dy is in logical px (negative = up)
function drawHero(pose, dy = 0, shadowFlat = true) {
  const lift = -dy;
  const sw = Math.max(16, 44 - Math.floor(lift / 3) * 2);
  rect(135 - sw / 2, GROUND_Y + 4, sw, 2, PAL.black);
  drawSprite(heroSprite(pose), HERO_X, HERO_Y + dy, HERO_SCALE);
}

// stepped hop: dy values held 2 frames each
const HOP = [0, -4, -8, -10, -8, -4, 0];
function hopDy(l) { return l >= 0 && l < HOP.length * 2 ? HOP[Math.floor(l / 2)] : 0; }
// last beat-aligned hop before/at frame l among starts
function hopFrom(starts, l) {
  for (const s of starts) { const d = hopDy(l - s); if (d !== 0) return d; }
  return 0;
}
