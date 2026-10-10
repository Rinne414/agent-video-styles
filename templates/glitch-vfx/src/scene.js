// Scene state per frame (pure function of the frame number) and scene painting.
const FLICKER_IN = [1, 0.6, 1, 0.85]; // opacity pattern, 2 frames each
const FLICKER_OUT = [1, 0.25, 1, 0, 0.7, 0, 0];
const FLICKER_BACK = [0.5, 0, 0.9, 0.6, 1];
const SCAN_SPEED = 120; // px per frame
const SCAN_WINDOWS = [
  { start: 64, strength: 0.6 },
  { start: BEATS.holoFlickerIn[0], strength: 1 },
  { start: 180, strength: 0.8 },
];

function pattern(f, start, list) {
  const i = Math.floor((f - start) / 2);
  return list[Math.min(i, list.length - 1)];
}

// story A: solid logo resolves, dissolves into a hologram, flickers out and back.
function holoStory(f) {
  const [fi0, fi1] = BEATS.holoFlickerIn;
  const [fo0, fo1] = BEATS.holoFlickerOut;
  const [fb0, fb1] = BEATS.holoFlickerBack;
  if (f < BEATS.revealAt) return { solid: 0, holo: 0, flicker: false };
  if (f < fi0) return { solid: 1, holo: 0.4, flicker: false };
  if (f < fi1) {
    const m = pattern(f, fi0, FLICKER_IN);
    const p = (f - fi0) / (fi1 - fi0);
    return { solid: m * (1 - p), holo: m * (0.4 + 0.6 * p), flicker: true };
  }
  if (f < fo0) return { solid: 0, holo: 1, flicker: false };
  if (f < fo1) return { solid: 0, holo: pattern(f, fo0, FLICKER_OUT), flicker: true };
  if (f < fb0) return { solid: 0, holo: 0, flicker: false };
  if (f < fb1) return { solid: 0, holo: pattern(f, fb0, FLICKER_BACK), flicker: true };
  return { solid: 0, holo: 1, flicker: false };
}

function scanFor(f) {
  for (const w of SCAN_WINDOWS) {
    const k = f - w.start;
    if (k >= 0 && k <= Math.ceil(H / SCAN_SPEED)) return { y: k * SCAN_SPEED - 40, strength: w.strength };
  }
  return null;
}

function drawBrackets(ctx, f) {
  const [b0, b1] = BEATS.bracketsDraw;
  const corners = [
    [INSET, INSET, 1, 1],
    [W - INSET, INSET, -1, 1],
    [W - INSET, H - INSET, -1, -1],
    [INSET, H - INSET, 1, -1],
  ];
  ctx.strokeStyle = rgba(COL.ink, 0.5);
  ctx.lineWidth = 3;
  ctx.lineCap = "square";
  corners.forEach(([x, y, sx, sy], i) => {
    const len = ARM * easeOut(clamp01((f - b0 - i * 2) / (b1 - b0 - 6)));
    if (len <= 0) return;
    ctx.beginPath();
    ctx.moveTo(x + sx * len, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + sy * len);
    ctx.stroke();
  });
}

function timecode(f) {
  const s = Math.floor(f / FPS);
  const ff = f % FPS;
  return `TC 00:${String(s).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
}

function drawLabels(ctx, f) {
  const a = easeOut(clamp01((f - BEATS.bracketsDraw[0] - 6) / 14));
  if (a <= 0) return;
  ctx.font = `400 ${TYPE.monoSize}px "${TYPE.mono}"`;
  ctx.letterSpacing = "0px";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = rgba(COL.muted, 0.8 * a);
  const pad = INSET + 32;
  ctx.textAlign = "left";
  ctx.fillText(BRAND.hudTopLeft, pad, INSET + 40);
  ctx.fillText(BRAND.hudBottomLeft, pad, H - INSET - 24);
  ctx.textAlign = "right";
  ctx.fillText(timecode(f), W - pad, INSET + 40);
  ctx.fillText(BRAND.hudBottomRight, W - pad, H - INSET - 24);
  ctx.textAlign = "left";
}

function drawTagline(ctx, f) {
  const [t0, t1] = BEATS.taglineIn;
  const p = clamp01((f - t0) / (t1 - t0));
  if (p <= 0) return;
  const e = easeOut(p);
  const ruleW = 140 * easeOut(clamp01((f - t0 + 8) / 12));
  ctx.fillStyle = rgba(COL.ink, 0.4);
  ctx.fillRect(W / 2 - ruleW / 2, LAYOUT.taglineY - 86, ruleW, 2);
  ctx.font = `500 ${TYPE.taglineSize}px "${TYPE.display}"`;
  ctx.letterSpacing = `${0.2 * TYPE.taglineSize}px`;
  const text = BRAND.tagline.toUpperCase();
  const tw = ctx.measureText(text).width - 0.2 * TYPE.taglineSize;
  const x = (W - tw) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x - 4, LAYOUT.taglineY - TYPE.taglineSize, (tw + 8) * e, TYPE.taglineSize * 1.5);
  ctx.clip();
  ctx.fillStyle = COL.muted;
  ctx.textAlign = "left";
  ctx.fillText(text, x, LAYOUT.taglineY);
  ctx.restore();
  if (p < 1) {
    ctx.fillStyle = COL.cyan;
    ctx.fillRect(x + tw * e, LAYOUT.taglineY - TYPE.taglineSize * 0.78, 12, TYPE.taglineSize * 0.78);
  }
}

// variant "A" is the hologram story, "B" the clean end card.
function renderScene(ctx, tmp, f, variant) {
  ctx.clearRect(0, 0, W, H);
  drawBrackets(ctx, f);
  drawLabels(ctx, f);
  const s = 1 + DRIFT * (f / TOTAL_FRAMES);
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.scale(s, s);
  ctx.translate(-W / 2, -H / 2);
  if (variant === "A") {
    const st = holoStory(f);
    const scan = scanFor(f);
    const jitter = st.flicker ? Math.round((mulberry32(SEED + f * 31)() - 0.5) * 10) : 0;
    const scanY = scan ? scan.y : null;
    drawHoloLogo(ctx, tmp, st.holo, scanY, jitter);
    drawSolidLogo(ctx, tmp, st.solid, scanY, jitter);
  } else {
    drawSolidLogo(ctx, tmp, 1, null, 0);
    drawTagline(ctx, f);
  }
  ctx.restore();
}
