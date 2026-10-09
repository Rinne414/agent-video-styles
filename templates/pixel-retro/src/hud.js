// ---- timeline model + HUD pieces ----
const T = CONTENT.timing;
const BEAT = Math.round((CONTENT.video.fps * 60) / CONTENT.video.bpm); // frames per beat
const SCENES = (() => {
  const list = [{ id: "title", kind: "title", start: 0, len: T.titleFrames }];
  let s = T.titleFrames;
  CONTENT.quests.forEach((q, i) => { list.push({ id: "q" + i, kind: q.kind, start: s, len: T.questFrames, q, i }); s += T.questFrames; });
  list.push({ id: "outro", kind: "outro", start: s, len: T.outroFrames });
  return list;
})();
const TOTAL_FRAMES = SCENES[SCENES.length - 1].start + SCENES[SCENES.length - 1].len;
const OUTRO_START = SCENES[SCENES.length - 1].start;
const COMPLETE_FRAMES = SCENES.filter((s) => s.q).map((s) => s.start + s.q.completeAt);

function sceneAt(f) {
  for (let i = SCENES.length - 1; i >= 0; i--) if (f >= SCENES[i].start) return SCENES[i];
  return SCENES[0];
}

// screen shake: alternating integer offsets for 6 frames after an event
function shakeAt(f, events) {
  for (const [ef, amp] of events) {
    const l = f - ef;
    if (l >= 0 && l < 6) {
      const a = Math.max(1, amp - Math.floor(l / 3));
      return [(l % 2 ? -a : a), (l % 2 ? a : -a) >> 1];
    }
  }
  return [0, 0];
}
const SHAKE_EVENTS = [[CONTENT.title.dropFrame, 2], [CONTENT.title.dropFrame + BEAT, 2],
  ...COMPLETE_FRAMES.map((c) => [c, 1]), [OUTRO_START, 2]];

function xpValue(f) {
  let v = 0;
  CONTENT.quests.forEach((q, i) => { v += q.xp * Math.min(1, Math.max(0, (f - COMPLETE_FRAMES[i]) / 8)); });
  const l = f - OUTRO_START;
  if (l >= 24) v = v * (1 - Math.min(1, (l - 24) / 12)); // drains after the level-up
  return v;
}

function drawHud(f) {
  const l = f - OUTRO_START, leveled = l >= 0;
  const lv = CONTENT.hud[leveled ? "levelEnd" : "levelStart"];
  const flash = leveled && l < 24 && Math.floor(l / 2) % 2 === 0;
  drawText("LV " + lv, 14, 62, 8, flash ? PAL.yellow : PAL.white, { outline: 1 });
  const bx = 56, by = 58, bw = 198, bh = 14;
  rect(bx, by, bw, bh, PAL.black);
  rect(bx + 1, by + 1, bw - 2, bh - 2, PAL.white);
  rect(bx + 2, by + 2, bw - 4, bh - 4, PAL.navy);
  const chunks = 32, chunkW = 6;
  const filled = Math.floor((xpValue(f) / CONTENT.hud.xpMax) * chunks + 1e-6);
  for (let i = 0; i < filled; i++) rect(bx + 3 + i * chunkW, by + 3, chunkW - 1, bh - 6, flash ? PAL.yellow : PAL.lime);
}

function drawBanner(label, name, L) {
  dialog(14, 88, 242, 40);
  drawText(label, 22, 96, 8, PAL.yellow, { chars: Math.floor((L - 3) / 2) });
  drawText(name, 22, 108, 16, PAL.white, { chars: Math.floor((L - 9) / 2) });
}

function drawChecklist(f) {
  const items = CONTENT.quests, inner = 238, y = 342;
  dialog(14, y, 242, 24);
  const widths = items.map((q) => 12 + q.check.length * 8);
  const gap = Math.floor((inner - widths.reduce((a, b) => a + b, 0)) / (items.length + 1));
  let x = 16 + gap;
  items.forEach((q, i) => {
    const done = f >= COMPLETE_FRAMES[i];
    rect(x, y + 8, 8, 8, PAL.white);
    rect(x + 1, y + 9, 6, 6, done ? PAL.lime : PAL.navy);
    if (done) { rect(x + 2, y + 12, 1, 1, PAL.black); rect(x + 3, y + 13, 1, 1, PAL.black); rect(x + 4, y + 12, 1, 1, PAL.black); rect(x + 5, y + 11, 1, 1, PAL.black); rect(x + 6, y + 10, 1, 1, PAL.black); }
    drawText(q.check, x + 12, y + 8, 8, done ? PAL.white : PAL.silver);
    x += widths[i] + gap;
  });
}

function drawBeatPips(f) {
  const on = Math.floor(f / BEAT) % 4;
  for (let i = 0; i < 4; i++) rect(115 + i * 10, 374, 6, 6, i === on ? PAL.yellow : PAL.navy);
}

// "+20 XP" pop: size swap squash on the first 2 frames, then rises in steps
function drawXpPop(str, l) {
  if (l < 0 || l > 45) return;
  const big = l < 2;
  const size = big ? 24 : 16;
  const y = 220 - Math.min(14, 3 * Math.floor(l / 2)) - (big ? 4 : 0);
  if (l > 36 && Math.floor(l / 2) % 2 === 0) return;
  drawCentered(str, 135, y, size, PAL.yellow, { outline: 2 });
}

// radial star burst, integer steps
const BURST = [[1, 0], [-1, 0], [0, -1], [1, -1], [-1, -1], [2, -1], [-2, -1], [1, -2], [-1, -2], [0, 1]];
function drawBurst(l, cx, cy, speed = 2, life = 16) {
  if (l < 0 || l >= life) return;
  BURST.forEach(([dx, dy], i) => {
    if ((l + i) % 4 === 3) return; // flicker
    const d = 6 + l * speed;
    drawSprite(STAR, cx + dx * d - 2, cy + dy * d - 2);
  });
}
