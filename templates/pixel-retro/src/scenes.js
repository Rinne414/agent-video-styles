// ---- scenes: each takes local frame L and draws its stage + hero ----
const bobAt = (L) => (L % BEAT < 8 ? 0 : 1);

function sceneTitle(f) {
  const t = CONTENT.title, wake = t.wakeFrame;
  drawWorld(f, "title", { stars: true });
  const asleep = f < wake;
  let dy = 0;
  if (f >= wake && f < wake + 14) dy = hopDy(f - wake);
  drawHero({ bob: bobAt(f), eyes: asleep ? "shut" : "open", mouth: asleep ? "flat" : "o" }, dy);
  if (asleep) { // Z particles rise in 4 frame steps
    for (let k = 0; k < 2; k++) {
      const l = (f + k * 22) % 44, step = Math.floor(l / 4);
      drawText("Z", 150 + step * 2, 240 - step * 3, k ? 8 : 16, PAL.white, { outline: 1 });
    }
  } else if (f < wake + 20) drawText("!", 140, 214, 16, PAL.red, { outline: 2 });
  // title lines drop in stepped rows and land on beats 2 and 3
  t.lines.forEach((line, i) => {
    const land = t.dropFrame + i * BEAT, l = f - (land - 5), finalY = 92 + i * 44;
    if (l < 0) return;
    const y = l < 6 ? finalY - 20 * (5 - l) - 0 : l < 8 ? finalY + 4 : finalY;
    const color = i ? PAL.red : PAL.yellow;
    drawCentered(line, 135, y, 32, color, { outline: 2 });
  });
  const promptOn = f >= t.dropFrame + 2 * BEAT && Math.floor((f - (t.dropFrame + 2 * BEAT)) / 8) % 2 === 0;
  if (promptOn) drawCentered(t.prompt, 135, 196, 16, PAL.white, { outline: 2 });
}

function questHero(kind, L, q) {
  const done = L - q.completeAt;
  const hops = [q.completeAt + BEAT, q.completeAt + 2 * BEAT, q.completeAt + 3 * BEAT];
  const base = { bob: bobAt(L) };
  let pose = base, dy = 0, extra = null;
  if (kind === "water") {
    const cupHeld = (lv, y) => ({ x: 16, y, lv });
    if (L < 15) pose = base;
    else if (L < 30) pose = { ...base, rh: [24, 22], cup: { x: 23, y: 15, lv: 4 } };
    else if (L < q.completeAt) {
      const lv = L < 37 ? 4 : L < 45 ? 3 : L < 52 ? 2 : 1;
      pose = { ...base, bob: 0, eyes: "shut", rh: [22, 17], cup: cupHeld(lv, 12 + (Math.floor(L / 4) % 2 ? 0 : 1)) };
    } else pose = { ...base, eyes: "happy", lh: [5, 8], rh: [22, 24] };
  } else if (kind === "stretch") {
    if (L < 15) pose = base;
    else if (L < 30) pose = { ...base, lh: [1, 17], rh: [29, 17] };
    else if (L < 45) pose = { ...base, lh: [6, 0], rh: [24, 0], mouth: "o" };
    else if (L < 60) pose = { ...base, dx: -2, lh: [0, 3], rh: [18, 0], eyes: "shut" };
    else if (L < q.completeAt) pose = { ...base, dx: 2, lh: [14, 0], rh: [30, 3], eyes: "shut" };
    else pose = { ...base, lh: [6, 0], rh: [24, 0], eyes: "happy" };
  } else if (kind === "task") {
    if (L < 30) pose = base;
    else if (L < q.completeAt) pose = { ...base, mouth: "flat", rh: [21, 16] };
    else pose = { ...base, eyes: "happy", rh: [27, 1] };
  }
  if (done >= 0) dy = hopFrom(hops, L);
  if (dy !== 0) pose = { ...pose, legs: "jump" };
  return { pose, dy };
}

function drawPitcher(L) {
  const g = (rows, m) => gridSprite(rows, m);
  const pitcher = drawPitcher.s || (drawPitcher.s = g([
    "...WWWWWW...",
    "..WBBBBBBW..",
    ".WBBBBBBBWWW",
    ".WWBBBBBBW.W",
    "..WBBBBBBW.W",
    "..WBBBBBBWWW",
    "..WBBBBBBW..",
    "..WWWWWWWW..",
  ], { W: PAL.white, B: PAL.blue }));
  rect(42, GROUND_Y - 16, 28, 4, PAL.brown); rect(44, GROUND_Y - 12, 3, 16, PAL.brown); rect(65, GROUND_Y - 12, 3, 16, PAL.brown);
  rect(42, GROUND_Y - 16, 28, 1, PAL.orange);
  drawSprite(pitcher, 43, GROUND_Y - 16 - pitcher.height * 2, 2);
}

function drawMat() {
  rect(95, GROUND_Y + 6, 80, 6, PAL.black);
  rect(96, GROUND_Y + 6, 78, 5, PAL.red);
  rect(96, GROUND_Y + 6, 78, 1, PAL.pink);
}

function drawCards(L, q) {
  const cx = [14, 100, 186], w = 70, h = 56, y0 = 140, colors = [PAL.red, PAL.orange, PAL.blue];
  const pick = L >= q.completeAt;
  q.tasks.forEach((label, i) => {
    const l = L - (15 + i * 5);
    if (l < 0) return;
    const y = y0 - Math.max(0, 72 - 12 * l);
    const sel = i === q.picked;
    const [c, g] = makeCanvas(w, h);
    const save = ctx; // draw card into an offscreen canvas for the dither-out
    const border = pick && sel ? (Math.floor((L - q.completeAt) / 2) % 2 && L - q.completeAt < 30 ? PAL.white : PAL.yellow) : PAL.white;
    g.fillStyle = border; g.fillRect(0, 0, w, h);
    g.fillStyle = PAL.navy; g.fillRect(2, 2, w - 4, h - 4);
    g.fillStyle = colors[i]; g.fillRect(2, 2, w - 4, 8);
    const num = textSprite(String(i + 1), 16, colors[i]); g.drawImage(num, 27, 18);
    const lab = textSprite(label, 8, PAL.white); g.drawImage(lab, Math.floor((w - label.length * 8) / 2), 40);
    if (pick && !sel) {
      const lvl = Math.min(16, (L - q.completeAt) * 2);
      const d = g.getImageData(0, 0, w, h);
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) if (BAYER4[yy & 3][xx & 3] < lvl) d.data[(yy * w + xx) * 4 + 3] = 0;
      g.putImageData(d, 0, 0);
    }
    ctx.drawImage(c, cx[i], y);
  });
  // pixel hand cursor hops on beats: card 1, card 3, then the picked card
  if (L >= 30 && L < q.completeAt + 6) {
    const seq = [0, 2, q.picked], idx = Math.min(2, Math.floor((L - 30) / BEAT));
    const target = seq[idx], phase = (L - 30) % BEAT;
    const hop = phase < 4 ? [0, 4, 6, 4][phase] : 0;
    const bob = Math.floor(L / 8) % 2 ? 2 : 0;
    drawSprite(CURSOR, cx[target] + w / 2 - 10, y0 + h + 4 - hop - bob, 2);
  }
}

const CURSOR = gridSprite([
  "...WW...",
  "..WWWW..",
  ".WWWWWW.",
  "WWWWWWWW",
  "...WW...",
  "...WW...",
  "...WW...",
], { W: PAL.white }, true);

function sceneQuest(f, s) {
  const { q, i } = s, L = f - s.start;
  drawWorld(f, q.kind === "task" ? "task" : q.kind);
  if (q.kind === "water") drawPitcher(L);
  if (q.kind === "stretch") drawMat();
  const { pose, dy } = questHero(q.kind, L, q);
  drawHero(pose, dy);
  if (q.kind === "stretch" && L >= 30 && L < q.completeAt && Math.floor(L / 4) % 2 === 0) {
    for (const [x, y] of [[96, 236], [166, 236], [92, 250], [170, 250]]) { rect(x, y, 5, 1, PAL.white); rect(x + 1, y + 4, 3, 1, PAL.white); }
  }
  if (q.kind === "task") drawCards(L, q);
  const l = L - q.completeAt;
  drawBurst(l, 135, 262);
  drawXpPop("+" + q.xp + " XP", l);
  drawBanner(q.label, q.name, L);
}

function sceneOutro(f) {
  const L = f - OUTRO_START, lu = CONTENT.levelUp;
  drawWorld(f, "outro");
  const JUMP = [0, -6, -14, -22, -28, -32, -34, -32, -28, -22, -14, -6, 0];
  const jumping = L < JUMP.length * 2;
  const dy = jumping ? JUMP[Math.floor(L / 2)] : hopFrom([45, 75], L);
  const pose = { bob: bobAt(L), eyes: "happy", lh: [6, 0], rh: [24, 0], legs: jumping || dy ? "jump" : "stand", mouth: "o" };
  drawHero(pose, dy);
  drawBurst(L, 135, 262, 3, 26);
  // headline: pop at 40 px for 4 frames, then 32 px, colour cycles until it settles
  const cycle = [PAL.yellow, PAL.orange, PAL.red, PAL.pink, PAL.white];
  const col = L < 44 ? cycle[Math.floor(L / 4) % cycle.length] : PAL.yellow;
  const size = L < 4 ? 40 : 32;
  drawCentered(lu.headline, 135, L < 4 ? 90 : 94, size, col, { outline: 2 });
  // dialog box with typewriter text
  if (L >= 12) {
    dialog(14, 144, 242, 66);
    const chars = Math.floor((L - 15) / 2);
    const [a, b] = lu.lines;
    drawText(a, 24, 156, 16, PAL.white, { chars });
    drawText(b, 24, 180, 16, PAL.white, { chars: chars - a.length });
    if (chars >= a.length + b.length && Math.floor((L - 15) / 8) % 2 === 0) { rect(232, 194, 8, 1, PAL.yellow); rect(233, 195, 6, 1, PAL.yellow); rect(234, 196, 4, 1, PAL.yellow); rect(235, 197, 2, 1, PAL.yellow); }
  }
  // twinkles around the hero once settled
  if (L >= 30) for (const [x, y, ph] of [[84, 250, 0], [186, 244, 8], [100, 226, 16], [170, 224, 24]]) if ((L + ph) % 32 < 20) drawSprite(STAR_SMALL, x, y);
}
