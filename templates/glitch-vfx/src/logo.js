// Logo lockup: a 6x6 pixel block split along a diagonal rift, plus the wordmark. Drawn in code, no external art.
const MARK_N = 6;
const MARK_PITCH = LAYOUT.markCell + LAYOUT.markGap;
const MARK_SIZE = MARK_N * MARK_PITCH - LAYOUT.markGap;
const RIFT_SHIFT = 8; // each half moves this far away from the crack
const STRAY = 12; // loose pixel size inside the crack

function setTitleFont(ctx) {
  ctx.font = `700 ${TYPE.titleSize}px "${TYPE.display}"`;
  ctx.letterSpacing = `${-0.03 * TYPE.titleSize}px`;
  ctx.textBaseline = "alphabetic";
}

function lockupGeometry(ctx) {
  setTitleFont(ctx);
  const m = ctx.measureText(BRAND.title);
  const markBlock = MARK_SIZE + RIFT_SHIFT * 2;
  const total = markBlock + LAYOUT.lockupGap + m.width;
  const x0 = (W - total) / 2;
  return {
    markX: x0 + RIFT_SHIFT,
    markY: LAYOUT.logoCenterY - MARK_SIZE / 2,
    textX: x0 + markBlock + LAYOUT.lockupGap,
    baseline: LAYOUT.logoCenterY + m.actualBoundingBoxAscent / 2,
  };
}

function markRects(g) {
  const cells = [];
  const strays = [];
  for (let r = 0; r < MARK_N; r++) {
    for (let c = 0; c < MARK_N; c++) {
      const s = r + c;
      const x = g.markX + c * MARK_PITCH;
      const y = g.markY + r * MARK_PITCH;
      if (s === MARK_N - 1) {
        if (r % 2 === 1 || r === 4) strays.push([x + (LAYOUT.markCell - STRAY) / 2, y + (LAYOUT.markCell - STRAY) / 2, STRAY]);
        continue;
      }
      const shift = s < MARK_N - 1 ? -RIFT_SHIFT : RIFT_SHIFT;
      cells.push([x + shift, y + shift, LAYOUT.markCell]);
    }
  }
  return cells.concat(strays);
}

// mode: "fill" paints solid shapes, "stroke" paints the outline only.
function drawLogoShapes(ctx, g, mode) {
  const rects = markRects(g);
  for (const [x, y, s] of rects) {
    if (mode === "fill") ctx.fillRect(x, y, s, s);
    else ctx.strokeRect(x + 1.5, y + 1.5, s - 3, s - 3);
  }
  setTitleFont(ctx);
  if (mode === "fill") ctx.fillText(BRAND.title, g.textX, g.baseline);
  else ctx.strokeText(BRAND.title, g.textX, g.baseline);
}

function paintScanBand(ctx, scanY) {
  const grad = ctx.createLinearGradient(0, scanY - 34, 0, scanY + 34);
  grad.addColorStop(0, rgba(COL.cyan, 0));
  grad.addColorStop(0.5, "rgba(230,255,255,0.95)");
  grad.addColorStop(1, rgba(COL.cyan, 0));
  ctx.globalCompositeOperation = "source-atop";
  ctx.fillStyle = grad;
  ctx.fillRect(0, scanY - 34, W, 68);
  ctx.globalCompositeOperation = "source-over";
}

// Solid clean logo, optionally lit by a scan band.
function drawSolidLogo(target, tmp, alpha, scanY, jitter) {
  if (alpha <= 0) return;
  tmp.clearRect(0, 0, W, H);
  const g = lockupGeometry(tmp);
  tmp.fillStyle = COL.ink;
  drawLogoShapes(tmp, g, "fill");
  if (scanY !== null) paintScanBand(tmp, scanY);
  target.globalAlpha = alpha;
  target.drawImage(tmp.canvas, jitter, 0);
  target.globalAlpha = 1;
}

// Hologram: translucent cyan fill, edge-lit outline, horizontal stripes, glow.
function drawHoloLogo(target, tmp, alpha, scanY, jitter) {
  if (alpha <= 0) return;
  tmp.clearRect(0, 0, W, H);
  const g = lockupGeometry(tmp);
  tmp.lineJoin = "round";
  tmp.fillStyle = rgba(COL.cyan, 0.16);
  drawLogoShapes(tmp, g, "fill");
  tmp.strokeStyle = COL.cyan;
  tmp.lineWidth = 3;
  drawLogoShapes(tmp, g, "stroke");
  tmp.globalCompositeOperation = "destination-out";
  tmp.fillStyle = "rgba(0,0,0,0.38)";
  for (let y = 0; y < H; y += 4) tmp.fillRect(0, y, W, 1.5);
  tmp.globalCompositeOperation = "source-over";
  if (scanY !== null) paintScanBand(tmp, scanY);
  target.save();
  target.globalAlpha = alpha;
  target.shadowColor = rgba(COL.cyan, 0.75);
  target.shadowBlur = 22;
  target.drawImage(tmp.canvas, jitter, 0);
  target.restore();
}
