// Glitch effects: seeded burst schedule (built once), RGB split, slice tearing, shatter tiles.
function burstLength(b) {
  return REDUCED ? Math.min(b.len, 3) : b.len;
}

function makeSegments(rng, intensity) {
  const n = TEAR.slicesMin + Math.floor(rng() * (TEAR.slicesMax - TEAR.slicesMin + 1));
  const slices = [];
  for (let i = 0; i < n; i++) {
    const h = TEAR.heightMin + rng() * (TEAR.heightMax - TEAR.heightMin);
    const nearLogo = rng() < 0.6;
    const y = nearLogo ? LAYOUT.logoCenterY - 170 + rng() * 340 : rng() * (H - h);
    const mag = (10 + 50 * intensity) * (0.4 + 0.6 * rng());
    slices.push({ y: Math.min(y, H - h), h, dx: (rng() < 0.5 ? -1 : 1) * mag });
  }
  slices.sort((a, b) => a.y - b.y);
  const segs = [];
  let cur = 0;
  for (const s of slices) {
    const y0 = Math.round(Math.max(s.y, cur));
    const y1 = Math.round(Math.min(H, s.y + s.h));
    if (y1 <= y0) continue;
    if (y0 > cur) segs.push({ y0: cur, y1: y0, dx: 0 });
    segs.push({ y0, y1, dx: Math.round(s.dx) });
    cur = y1;
  }
  if (cur < H) segs.push({ y0: cur, y1: H, dx: 0 });
  return segs;
}

function makeBars(rng) {
  const bars = [];
  const n = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < n; i++) {
    bars.push({
      x: Math.round(rng() * (W - 700)),
      y: Math.round(rng() * H),
      w: Math.round(200 + rng() * 500),
      h: Math.round(3 + rng() * 3),
      color: rng() < 0.5 ? COL.cyan : COL.magenta,
    });
  }
  return bars;
}

// Frame number -> effect parameters. Everything is drawn from seeded generators, so frames repeat exactly.
function buildFxFrames() {
  const table = new Map();
  CONTENT.bursts.forEach((b, idx) => {
    const intensity = b.intensity * (REDUCED ? 0.5 : 1);
    const len = burstLength(b);
    for (let k = 0; k < len; k++) {
      const f = b.start + k;
      const rngF = mulberry32(SEED * 7919 + f * 104729 + 13);
      const rngS = mulberry32(SEED * 131 + b.start * 31 + Math.floor(k / TEAR.holdEvery) * 977);
      const isCut = b.mode === "cut";
      const dx = isCut ? CUT_SPLIT : CHANNEL_BASE + CHANNEL_GAIN * intensity;
      const dy = isCut ? 0 : 2 * intensity;
      table.set(f, {
        idx,
        k,
        dx,
        dy: dy * (rngF() < 0.5 ? -1 : 1),
        flip: rngF() < 0.5 ? -1 : 1,
        segs: isCut ? [{ y0: 0, y1: H, dx: 0 }] : makeSegments(rngS, intensity),
        bars: isCut ? [] : makeBars(rngF),
      });
    }
  });
  return table;
}

const FX = buildFxFrames();

const tintCyan = makeCanvas();
const tintMagenta = makeCanvas();
function tint(target, src, color) {
  const t = target.getContext("2d");
  t.globalCompositeOperation = "source-over";
  t.clearRect(0, 0, W, H);
  t.drawImage(src, 0, 0);
  t.globalCompositeOperation = "source-atop";
  t.fillStyle = color;
  t.fillRect(0, 0, W, H);
  t.globalCompositeOperation = "source-over";
  return target;
}

function blit(ctx, src, offX, offY, segs, alpha) {
  ctx.globalAlpha = alpha;
  for (const s of segs) {
    ctx.drawImage(src, 0, s.y0, W, s.y1 - s.y0, Math.round(offX + s.dx), Math.round(offY + s.y0), W, s.y1 - s.y0);
  }
  ctx.globalAlpha = 1;
}

// Draw a scene canvas onto ctx, with burst effects when this frame is inside a burst.
function drawWithBursts(ctx, scene, f) {
  const fx = FX.get(f);
  if (!fx) {
    ctx.drawImage(scene, 0, 0);
    return;
  }
  const cyan = tint(tintCyan, scene, COL.cyan);
  const magenta = tint(tintMagenta, scene, COL.magenta);
  blit(ctx, scene, 0, 0, fx.segs, 1);
  ctx.globalCompositeOperation = "screen";
  blit(ctx, cyan, -fx.dx * fx.flip, -fx.dy, fx.segs, 0.9);
  blit(ctx, magenta, fx.dx * fx.flip, fx.dy, fx.segs, 0.9);
  ctx.globalCompositeOperation = "source-over";
  for (const b of fx.bars) {
    ctx.fillStyle = rgba(b.color, 0.55);
    ctx.fillRect(b.x, b.y, b.w, b.h);
  }
}

// Shatter: a grid of tiles cut from the outgoing frame drifts, rotates and fades over the incoming scene.
function buildTiles() {
  const rng = mulberry32(SEED * 3 + 7);
  const tiles = [];
  for (let r = 0; r < SHATTER.rows; r++) {
    for (let c = 0; c < SHATTER.cols; c++) {
      const ang = rng() * Math.PI * 2;
      const dist = SHATTER.driftMin + rng() * (SHATTER.driftMax - SHATTER.driftMin);
      tiles.push({
        x0: Math.round((c * W) / SHATTER.cols),
        x1: Math.round(((c + 1) * W) / SHATTER.cols),
        y0: Math.round((r * H) / SHATTER.rows),
        y1: Math.round(((r + 1) * H) / SHATTER.rows),
        delay: Math.floor(rng() * (SHATTER.maxDelay + 1)),
        dx: Math.cos(ang) * dist,
        dy: Math.sin(ang) * dist,
        rot: ((rng() * 2 - 1) * SHATTER.rotateMax * Math.PI) / 180,
      });
    }
  }
  return tiles;
}
const TILES = buildTiles();

function shatterEnd() {
  return BEATS.shatterAt + SHATTER.maxDelay + SHATTER.frames;
}

function drawShatter(ctx, outgoing, ground, f) {
  const k = f - BEATS.shatterAt;
  for (const t of TILES) {
    const p = clamp01((k - t.delay) / SHATTER.frames);
    if (p >= 1) continue;
    const e = easeOut(p);
    const w = t.x1 - t.x0;
    const h = t.y1 - t.y0;
    ctx.save();
    ctx.translate(t.x0 + w / 2 + t.dx * e, t.y0 + h / 2 + t.dy * e);
    ctx.rotate(t.rot * e);
    ctx.globalAlpha = 1 - e * e;
    ctx.drawImage(ground, t.x0, t.y0, w, h, -w / 2, -h / 2, w, h);
    ctx.drawImage(outgoing, t.x0, t.y0, w, h, -w / 2, -h / 2, w, h);
    if (p > 0) {
      ctx.strokeStyle = rgba(COL.cyan, 0.6);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }
}
