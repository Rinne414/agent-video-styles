// Title card and moment one (misty hillside). L = scene-local held frame.
const cupG = (w, h) => {
  const pts = [[-w / 2, -h / 2], [w / 2, -h / 2]];
  for (let i = 1; i <= 14; i++) { const a = (i / 14) * Math.PI; pts.push([Math.cos(a) * (w / 2), -h / 2 + Math.sin(a) * h]); }
  return pts;
};
const birdG = (up) => (up ? [[-28, -8], [0, 2], [28, -8], [0, -3]] : [[-28, 6], [0, -6], [28, 6], [0, -1]]);
const tuftG = () => [[-22, 0], [-14, -34], [-7, -8], [0, -44], [7, -8], [15, -36], [22, 0]];

// Chapter tags: kicker first, then the title card (text tag arrives last).
function momentTags(L, m, idx) {
  const t0 = CONTENT.tagArriveFrame;
  if (L >= t0) {
    const e = 1 - easeOut(prog(L, t0, 8));
    tag({ id: "kick" + idx, kind: "tag", text: m.kicker, size: 56, left: 96, y: 132, r: -3, dx: -700 * e, fill: PAL.mustard });
  }
  if (L >= t0 + 6) {
    const e = 1 - easeOut(prog(L, t0 + 6, 8));
    tag({ id: "ttl" + idx, kind: "title", text: m.title, size: 104, left: 96, y: 285, r: 1.5, dx: -1500 * e });
  }
}

function sceneTitle(L) {
  const T = CONTENT.title;
  let a;
  if ((a = slide(L, 4, 0, 700))) piece({ id: "t-hillL", g: hillG(1200, 560, 60), fill: PAL.green, pat: "stripeD", x: 260, y: 1010 + a.y });
  if ((a = slide(L, 8, 0, 700))) piece({ id: "t-hillR", g: hillG(1300, 500, 50, 1.1, 1), fill: PAL.teal, pat: "dotsL", x: 1640, y: 1030 + a.y });
  if ((a = slide(L, 12, -600, 0))) piece({ id: "t-pink", g: ellG(140, 100), fill: PAL.pink, pat: "gingham", x: 250 + a.x, y: 230 });
  const sp = pop(L, 16);
  if (sp) piece({ id: "t-sun", g: ellG(140, 140), fill: PAL.mustard, pat: "dotsL", x: 1590, y: 250, s: sp });
  if ((a = slide(L, 20, 0, 600))) piece({ id: "t-leaf1", g: leafG(330, 90), fill: PAL.green, pat: "dotsL", x: 430, y: 820 + a.y, r: -28 });
  if ((a = slide(L, 24, 0, 600))) piece({ id: "t-leaf2", g: leafG(260, 74), fill: PAL.leafDark, pat: "stripeL", x: 1500 + a.x, y: 790 + a.y, r: 38 });
  const cp = pop(L, 28);
  if (cp) {
    piece({ id: "t-saucer", g: ellG(190, 36), fill: PAL.paper, x: 960, y: 930, s: cp, pat: "dotsD" });
    piece({ id: "t-cup", g: cupG(250, 150), fill: PAL.orange, pat: "stripeL", x: 960, y: 830, s: cp });
    piece({ id: "t-handle", g: arcG(48, 18, -90, 90), fill: PAL.orange, x: 1090, y: 820, s: cp });
  }
  for (let i = 0; i < 2; i++) {
    const sd = pop(L, 40 + i * 4);
    if (sd) piece({ id: "t-steam" + i, g: ribbonG(100, 24, 26, i * 2), fill: PAL.sky, x: 930 + i * 60, y: 750, s: sd, rim: false, amp: 2 });
  }
  const dropT = slide(L, 0, 0, -700, 10);
  const tw = tagW(T.text, 132, "title");
  tag({ id: "t-title", kind: "title", text: T.text, size: 132, x: 960, y: 440 + (dropT ? dropT.y : -700), r: -2 });
  if (L >= 40) {
    const e = 1 - easeOut(prog(L, 40, 8));
    tag({ id: "t-sub", kind: "tag", text: T.sub, size: 72, x: 960, y: 585, r: 2, dy: -300 * e, fill: PAL.mustard });
  }
  return tw;
}

function drawPicker(L, px, py) {
  const s0 = pop(L, 14);
  if (!s0) return;
  scaled(px, py, 1.7, () => {
    const s = s0, reach = sw(L, 12) > 0;
    for (let i = 0; i < 3; i++) {
      const t = (L + i * 12) % 36;
      if (t >= 30) continue;
      const ph = t / 30, sx = px + 125, sy = py - 120, ex = px - 62, ey = py - 110;
      const x = sx + (ex - sx) * ph, y = sy + (ey - sy) * ph - Math.sin(ph * Math.PI) * 40;
      piece({ id: "h-fly" + i, g: leafG(40, 13), fill: PAL.green, x, y, r: ph * 220, amp: 1.5, rim: false, shadow: false });
    }
    piece({ id: "h-basket", g: polyG([[-30, -45], [30, -45], [22, 45], [-22, 45]]), fill: PAL.orange, pat: "stripeL", x: px - 62, y: py - 100, r: -8, s });
    piece({ id: "h-body", g: polyG([[-34, -70], [34, -70], [58, 70], [-58, 70]]), fill: PAL.pink, pat: "gingham", x: px, y: py - 70, s });
    piece({
      id: "h-head", g: ellG(36, 38), fill: PAL.skin, x: px, y: py - 172, s, amp: 2.5, rim: false,
      extra: `<circle cx="-12" cy="-2" r="4" fill="${PAL.ink}"/><circle cx="12" cy="-2" r="4" fill="${PAL.ink}"/><path d="M-8 14 Q0 20 8 14" stroke="${PAL.ink}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    });
    piece({ id: "h-hat", g: polyG([[-90, 14], [90, 14], [0, -50]]), fill: PAL.mustard, pat: "stripeD", x: px, y: py - 208, s });
    piece({ id: "h-arm", g: polyG([[-9, 0], [9, 0], [9, 92], [-9, 92]]), fill: PAL.skin, x: px + 28, y: py - 132, r: reach ? -68 : -112, s, amp: 2, rim: false });
  });
}

function sceneHill(L) {
  const m = CONTENT.moments[0];
  piece({ id: "h-sky", g: rectG(2100, 1300), fill: PAL.sky, x: 960, y: 540, shadow: false, jit: 0.3 });
  const sun = pop(L, 6);
  if (sun) piece({ id: "h-sun", g: ellG(105, 105), fill: PAL.mustard, x: 1500, y: 230, s: sun });
  [[300, 190, 300, 0.35], [980, 120, 220, 0.25], [1700, 340, 260, 0.3]].forEach((c, i) => {
    piece({ id: "h-cloud" + i, g: cloudG(c[2], 80), fill: PAL.paper, x: c[0] + Math.floor(L / 2) * c[3] * 2, y: c[1], rim: false, amp: 3 });
  });
    piece({ id: "h-far", g: hillG(2400, 520, 70), fill: PAL.mint, pat: "stripeL", x: 960, y: 760 });
  piece({ id: "h-mist1", g: hillG(2300, 90, 26, 2), fill: PAL.paper, x: 900 + sw(L, 40) * 20 + Math.floor(L / 4), y: 640, rim: false, amp: 5 });
  piece({ id: "h-mid", g: hillG(2700, 560, 60, 1.4, 1), fill: PAL.teal, pat: "dotsL", x: 900, y: 860 });
  piece({ id: "h-mist2", g: hillG(2300, 100, 28, 1.6, 1), fill: PAL.paper, x: 1000 - Math.floor(L / 4), y: 790, rim: false, amp: 5 });
  piece({ id: "h-mist3", g: hillG(1500, 120, 30, 1.5), fill: PAL.paper, x: 380 + sw(L, 48) * 12 + Math.floor(L / 6), y: 720, rim: false, amp: 5 });
  piece({ id: "h-front", g: hillG(2700, 520, 50, 0.9, 2), fill: PAL.green, pat: "stripeD", x: 1300, y: 1000 });
  piece({ id: "h-row1", g: scallopG(2400, 60, 19, 26), fill: PAL.leafDark, pat: "dotsL", x: 1100, y: 850 });
  drawPicker(L, 1300, 975);
  piece({ id: "h-row2", g: scallopG(2200, 80, 16, 32), fill: PAL.leafDark, pat: "dotsL", x: 1000, y: 960 });
  piece({ id: "h-row3", g: scallopG(2600, 100, 14, 40), fill: PAL.leafDark, pat: "dotsL", x: 1100, y: 1080 });
  [[200, 1000], [640, 1040], [1760, 1020]].forEach((t, i) => piece({ id: "h-tuft" + i, g: tuftG(), fill: PAL.green, x: t[0], y: t[1], s: 1.5, rim: false, amp: 1.5 }));
  for (let i = 0; i < 3; i++) {
    const bx = ((L * 4 + i * 520) % 2300) - 200;
    piece({ id: "h-bird" + i, g: birdG(sw(L + i * 4, 6) > 0), fill: PAL.navy, x: bx, y: 300 + i * 70 + Math.sin(L / 14 + i) * 14, rim: false, amp: 1.5, shadow: false });
  }
  momentTags(L, m, 1);
}
