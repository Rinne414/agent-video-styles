// Frame driver: every output is a pure function of the held frame number.
const BOUNDS = [0].concat(CONTENT.moments.map((m) => m.start));
const SCENES = [sceneTitle, sceneHill, sceneDry, sceneShip, sceneCup];
const SCENE_LEN = BOUNDS.map((b, i) => (i + 1 < BOUNDS.length ? BOUNDS[i + 1] : CONTENT.video.durationFrames) - b);
const WIPE_FILL = [PAL.green, PAL.pink, PAL.mustard, PAL.teal]; // next scene's colour, one strip leads the paper strip
const WIPE_STEPS = 5;

function sceneIndexAt(h) {
  let s = 0;
  BOUNDS.forEach((b, i) => { if (h >= b) s = i; });
  return s;
}

// Torn paper strip crossing the screen (right to left) in 10 frames; scene swaps at its centre step.
function wipeMarkup(h) {
  for (let i = 1; i < BOUNDS.length; i++) {
    const step = (h - (BOUNDS[i] - 4)) / HOLD;
    if (step < 0 || step >= WIPE_STEPS) continue;
    const left = 1920 - 1230 * step;
    const save = CUR.buf;
    CUR.buf = "";
    piece({ id: "wipeB" + i, g: rectG(3600, 1300), fill: WIPE_FILL[i - 1], x: left - 380 + 1800, y: 540, shadow: false, amp: 8, jit: 0.4 });
    piece({ id: "wipeA" + i, g: rectG(3600, 1300), fill: PAL.paper, x: left + 1800, y: 540, amp: 7, rim: false, jit: 0.4 });
    const out = CUR.buf;
    CUR.buf = save;
    return out;
  }
  return "";
}

function draw(frame) {
  const h = frame - (frame % HOLD);
  if (draw.last === h) return;
  draw.last = h;
  CUR.k = h / HOLD; CUR.buf = ""; CUR.ui = "";
  const s = sceneIndexAt(h), L = Math.max(0, h - BOUNDS[s]);
  SCENES[s](L);
  const p = prog(L, 0, SCENE_LEN[s]);
  const cam = 1 + 0.06 * p;
  const camTf = `translate(960 540) scale(${f1(cam * 1000) / 1000}) translate(${f1(-960 - 30 * p)} -540)`;
  document.getElementById("layer").innerHTML = `<g transform="${camTf}">${CUR.buf}</g>${CUR.ui}${wipeMarkup(h)}`;
}
