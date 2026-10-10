// Moments two (rolled and dried), three (carried by sea) and four (poured at last).
const tri = (L, period) => {
  const m = L % period, half = period / 2;
  return (m < half ? m / half : (period - m) / half) * 2 - 1;
};
// Dried-tea colour ladder: fresh green, then olive, then brown.
const leafColour = (L) => (L < 70 ? PAL.green : L < 120 ? PAL.olive : PAL.brown);
// Offset a ship/pot-local point by rotation about its origin.
const rot2 = (dx, dy, deg) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return [dx * c - dy * s, dx * s + dy * c];
};

function sceneDry(L) {
  const m = CONTENT.moments[1];
  piece({ id: "d-wall", g: rectG(2100, 1300), fill: PAL.pink, pat: "stripeL", x: 960, y: 540, shadow: false, jit: 0.3 });
  const sun = pop(L, 6);
  if (sun) piece({ id: "d-sun", g: starG(125, 88, 10), fill: PAL.orange, pat: "dotsL", x: 1640, y: 200, r: L * 5, s: sun });
  for (let i = 0; i < 7; i++) {
    const a = slide(L, 8 + i * 3, 0, -200);
    if (a) piece({ id: "d-flag" + i, g: polyG([[-34, -30], [34, -30], [0, 40]]), fill: [PAL.mustard, PAL.teal, PAL.paper][i % 3], pat: i % 2 ? "dotsD" : "stripeD", x: 80 + i * 150 + (i > 3 ? 600 : 0) * 0, y: 70 + a.y + Math.abs(i - 3) * -4, r: sw(L + i * 2, 12) * 3, amp: 3 });
  }
  // lantern on a cord
  piece({ id: "d-cord", g: rectG(5, 130), fill: PAL.ink, x: 1100, y: 65, rim: false, amp: 0, shadow: false, jit: 0.3 });
  piece({ id: "d-lantern", g: ellG(46, 60), fill: PAL.mustard, pat: "stripeD", x: 1100, y: 170, r: sw(L, 16) * 3 });
  piece({ id: "d-table", g: rectG(2100, 420), fill: PAL.navy, pat: "dotsD", x: 960, y: 980 });
  // drying rack (right)
  piece({ id: "d-pole1", g: rectG(16, 470), fill: PAL.ink, x: 1470, y: 560, rim: false, amp: 1.5 });
  piece({ id: "d-pole2", g: rectG(16, 470), fill: PAL.ink, x: 1810, y: 560, rim: false, amp: 1.5 });
  piece({ id: "d-bar", g: rectG(380, 18), fill: PAL.ink, x: 1640, y: 340, rim: false, amp: 1.5 });
  for (let i = 0; i < 5; i++) {
    const a = slide(L, 14 + i * 4, 0, -500);
    if (a) piece({ id: "d-hang" + i, g: leafG(130, 32), fill: leafColour(L), x: 1510 + i * 70, y: 430 + a.y, r: 90 + sw(L + i * 6, 10) * 5, pat: "stripeD" });
  }
  // tray, pile and the rolling hand
  scaled(740, 860, 1.4, () => {
  const tr = pop(L, 10);
  if (tr) {
    piece({ id: "d-tray", g: ellG(400, 95), fill: PAL.mustard, pat: "stripeD", x: 740, y: 860, s: tr });
    piece({ id: "d-pile", g: ellG(230, 62), fill: leafColour(L), pat: "dotsD", x: 740, y: 830, s: tr });
  }
  if (L >= 20) {
    const t = tri(L, 48), hx = 740 + t * 80;
    piece({ id: "d-roll", g: ellG(92, 46), fill: L < 70 ? PAL.leafDark : L < 120 ? PAL.brown : PAL.ink, pat: "stripeD", x: 740 + t * 40, y: 770, r: t * 70 });
    piece({ id: "d-sleeve", g: rectG(330, 84), fill: PAL.teal, pat: "gingham", x: hx + 240, y: 685, r: -8 });
    piece({ id: "d-hand", g: polyG([[-86, -26], [70, -30], [96, 0], [70, 30], [-86, 26]]), fill: PAL.skin, x: hx, y: 705, r: -6, amp: 3 });
  }
  });
  // sleeping cat
  const c = pop(L, 24);
  if (c) {
    piece({ id: "d-tail", g: leafG(150, 22), fill: PAL.purple, x: 90, y: 940, r: sw(L, 20) * 10 - 20, s: c });
    piece({ id: "d-cat", g: ellG(125, 62), fill: PAL.purple, pat: "stripeD", x: 250, y: 930, s: c });
    piece({
      id: "d-cathead", g: ellG(52, 46), fill: PAL.purple, x: 365, y: 905, s: c, amp: 3, rim: false,
      extra: `<path d="M-24 0 Q-14 8 -4 0 M8 0 Q18 8 28 0" stroke="${PAL.ink}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    });
    piece({ id: "d-ear1", g: polyG([[-18, 20], [0, -26], [18, 20]]), fill: PAL.purple, x: 342, y: 865, s: c, rim: false, amp: 1.5 });
    piece({ id: "d-ear2", g: polyG([[-18, 20], [0, -26], [18, 20]]), fill: PAL.purple, x: 392, y: 865, s: c, rim: false, amp: 1.5 });
  }
  // potted plant + dust motes
  piece({ id: "d-pot", g: polyG([[-40, -36], [40, -36], [30, 40], [-30, 40]]), fill: PAL.teal, pat: "dotsL", x: 1290, y: 800 });
  for (let i = 0; i < 3; i++) piece({ id: "d-pl" + i, g: leafG(110, 30), fill: PAL.green, x: 1290 + (i - 1) * 40, y: 720 - (i === 1 ? 20 : 0), r: -90 + (i - 1) * 40 + sw(L + i * 4, 14) * 3, rim: false, amp: 2 });
  for (let i = 0; i < 4; i++) {
    const x = 500 + i * 230 + rnd("d-dust" + i, Math.floor(L / 8)) * 60, y = 380 + ((L * 1.5 + i * 90) % 260);
    piece({ id: "d-dust" + i, g: ellG(6, 6, 12), fill: PAL.mustard, x, y, rim: false, amp: 0, shadow: false });
  }
  momentTags(L, m, 2);
}

function sceneShip(L) {
  const m = CONTENT.moments[2];
  piece({ id: "s-sky", g: rectG(2100, 1300), fill: PAL.mustard, pat: "dotsL", x: 960, y: 540, shadow: false, jit: 0.3 });
  const sun = pop(L, 6);
  if (sun) piece({ id: "s-sun", g: ellG(135, 135), fill: PAL.paper, pat: "dotsD", x: 1500, y: 300, s: sun, amp: 3 });
  [[420, 200, 320], [1000, 130, 240], [1700, 180, 300]].forEach((c, i) => {
    piece({ id: "s-cloud" + i, g: cloudG(c[2], 80), fill: PAL.pink, x: c[0] + Math.floor(L / 2) * (3 + i), y: c[1], rim: false, amp: 3 });
  });
  piece({ id: "s-island", g: hillG(900, 240, 40), fill: PAL.purple, pat: "stripeL", x: 380, y: 720 });
  const wave = (id, w, bumps, spd, y, fill, pat, h, bh) => {
    const period = w / bumps;
    piece({ id, g: scallopG(w, h, bumps, bh), fill, pat, x: 960 - ((L * spd) % period), y, jit: 0.5 });
  };
  wave("s-sea1", 3800, 19, 1.5, 850, PAL.teal, "dotsL", 400, 34);
  // ship
  const sh = slide(L, 8, -1500, 0, 16);
  if (sh) scaled(1200, 650, 1.1, () => {
    const sx = 1250 + sh.x + L * 1.2, tilt = sw(L, 16) * 2.2, sy = 650 + sw(L + 8, 16) * 6;
    const P = (dx, dy) => { const [rx, ry] = rot2(dx, dy, tilt); return [sx + rx, sy + ry]; };
    const place = (id, g, fill, dx, dy, o = {}) => { const [x, y] = P(dx, dy); piece(Object.assign({ id, g, fill, x, y, r: tilt }, o)); };
    place("s-mast1", rectG(14, 340), PAL.ink, -60, -190, { rim: false, amp: 1.5 });
    place("s-mast2", rectG(14, 290), PAL.ink, 100, -165, { rim: false, amp: 1.5 });
    place("s-sail1", polyG([[-84, -120], [84, -120], [74, 120], [-74, 120]]), PAL.paper, -60, -170, { pat: "stripeD" });
    place("s-sail2", polyG([[-66, -100], [66, -100], [58, 100], [-58, 100]]), PAL.paper, 100, -150, { pat: "stripeD" });
    place("s-flag", polyG([[0, -20], [70, 0], [0, 20]]), PAL.orange, -60 + 44, -352, { r: tilt + sw(L, 8) * 8, rim: false, amp: 2 });
    place("s-hull", polyG([[-230, -40], [230, -40], [160, 55], [-160, 55]]), PAL.pink, 0, 30, { pat: "gingham" });
    place("s-crate1", rectG(62, 58), PAL.mustard, -140, -22, { pat: "stripeD" });
    place("s-crate2", rectG(62, 58), PAL.mustard, -72, -22, { pat: "stripeD" });
    place("s-crate3", rectG(62, 58), PAL.mustard, -106, -80, { pat: "stripeD" });
  });
  wave("s-sea2", 3600, 14, 2.5, 940, PAL.navy, "stripeL", 400, 38);
  wave("s-sea3", 3600, 11, 4, 1040, PAL.teal, "dotsL", 400, 40);
  for (let i = 0; i < 3; i++) {
    const bx = ((L * 3 + i * 700) % 2400) - 240;
    piece({ id: "s-gull" + i, g: birdG(sw(L + i * 6, 6) > 0), fill: PAL.ink, x: bx, y: 230 + i * 90 + Math.sin(L / 12 + i) * 16, rim: false, amp: 1.5, shadow: false, s: 1.2 });
  }
  const jf = (L + 20) % 60;
  if (jf < 24) {
    const u = jf / 24;
    piece({ id: "s-fish", g: leafG(90, 26), fill: PAL.paper, x: 1250 + u * 160, y: 870 - Math.sin(u * Math.PI) * 120, r: -50 + u * 100, rim: false, amp: 1.5 });
  }
  momentTags(L, m, 3);
}

function sceneCup(L) {
  const m = CONTENT.moments[3];
  piece({ id: "c-wall", g: rectG(2100, 1300), fill: PAL.teal, pat: "dotsL", x: 960, y: 540, shadow: false, jit: 0.3 });
  const win = pop(L, 4);
  if (win) {
    piece({ id: "c-window", g: rectG(340, 440), fill: PAL.sky, x: 1730, y: 370, s: win });
    piece({ id: "c-sun", g: ellG(70, 70), fill: PAL.mustard, x: 1690, y: 310, s: win, rim: false, amp: 3, shadow: false });
    piece({ id: "c-bar1", g: rectG(14, 440), fill: PAL.paper, x: 1730, y: 370, s: win, rim: false, amp: 1.5 });
    piece({ id: "c-bar2", g: rectG(340, 14), fill: PAL.paper, x: 1730, y: 370, s: win, rim: false, amp: 1.5 });
  }
  piece({ id: "c-table", g: rectG(2100, 420), fill: PAL.kraft, pat: "stripeD", x: 960, y: 990 });
  const pl = pop(L, 12);
  if (pl) {
    for (let i = 0; i < 3; i++) piece({ id: "c-pl" + i, g: leafG(130, 36), fill: PAL.green, x: 210 + (i - 1) * 46, y: 640, r: -90 + (i - 1) * 42 + sw(L + i * 4, 14) * 3, s: pl, rim: false, amp: 2 });
    piece({ id: "c-pot", g: polyG([[-46, -42], [46, -42], [34, 46], [-34, 46]]), fill: PAL.mustard, pat: "dotsD", x: 210, y: 735, s: pl });
  }
  const cp = pop(L, 14);
  if (cp) {
    piece({ id: "c-saucer", g: ellG(190, 38), fill: PAL.paper, pat: "dotsD", x: 960, y: 830, s: cp });
    piece({ id: "c-handle", g: arcG(48, 20, -90, 90), fill: PAL.paper, x: 1096, y: 720, s: cp });
    piece({ id: "c-cup", g: cupG(290, 190), fill: PAL.paper, pat: "dotsD", x: 960, y: 730, s: cp });
    piece({ id: "c-open", g: ellG(145, 30), fill: PAL.cupShade, x: 960, y: 636, s: cp, rim: false, amp: 2, shadow: false });
    const fill = prog(L, 72, 80);
    if (fill > 0) piece({ id: "c-tea", g: ellG(128, 24), fill: PAL.orange, x: 960, y: 640, sy: Math.max(0.15, fill), rim: false, amp: 2, shadow: false });
  }
  for (let i = 0; i < 2; i++) {
    const b = pop(L, 26 + i * 4);
    if (b) piece({ id: "c-bisc" + i, g: ellG(48, 48, 24), fill: PAL.mustard, pat: "dotsD", x: 1390 + i * 90, y: 860 + i * 18, s: b });
  }
  // teapot: pieces rotate about the pot centre
  const slideIn = slide(L, 20, 700, 0, 10);
  if (slideIn) {
    const down = L >= 160 ? 1 - prog(L, 160, 24) : prog(L, 40, 24);
    const th = -24 * easeOut(down), cx = 1180 + slideIn.x, cy = 480;
    const place = (id, g, fill, dx, dy, o = {}) => { const [rx, ry] = rot2(dx, dy, th); piece(Object.assign({ id, g, fill, x: cx + rx, y: cy + ry, r: th }, o)); };
    place("c-spout", polyG([[-95, -5], [-175, -65], [-195, -80], [-205, -62], [-120, 32]]), PAL.navy, -20, 0, { pat: "stripeL" });
    place("c-phandle", arcG(62, 24, -70, 70), PAL.navy, 120, 0);
    place("c-pot-body", ellG(135, 108), PAL.navy, 0, 0, { pat: "stripeL" });
    place("c-lid", ellG(72, 22), PAL.navy, 0, -104, { pat: "dotsL" });
    place("c-knob", ellG(15, 15, 16), PAL.mustard, 0, -130, { amp: 1.5, rim: false });
    const sg = L >= 64 && L < 160 ? easeOut(prog(L, 64, 8)) : 0;
    if (sg > 0) piece({ id: "c-stream", g: rectG(20, 150), fill: PAL.orange, x: 975, y: 495 + 75 * sg, sy: sg, rim: false, amp: 2, shadow: false });
  }
  if (L >= 150) {
    for (let i = 0; i < 3; i++) {
      const st = pop(L, 150 + i * 6);
      if (st) piece({ id: "c-steam" + i, g: ribbonG(170, 30, 36, i * 2 + Math.floor(L / 6) * 0.9), fill: PAL.paper, x: 900 + i * 60, y: 600, s: st, rim: false, amp: 2 });
    }
  }
  if (L >= 176) {
    [[740, 560], [1190, 590], [1060, 440]].forEach((p, i) => {
      const s = pop(L, 176 + i * 4) * (sw(L + i * 4, 8) > 0 ? 1 : 0.8);
      if (s) piece({ id: "c-spark" + i, g: starG(24, 8, 4), fill: PAL.mustard, x: p[0], y: p[1], s, rim: false, amp: 1.5, shadow: false });
    });
  }
  if (L < 204) momentTags(L, m, 4);
  else if (L < 210) {
    const s = Math.max(0, 1 - prog(L, 204, 6));
    if (s > 0) tag({ id: "ttl4", kind: "title", text: m.title, size: 104, left: 96, y: 285, r: 1.5, s });
  }
  if (L >= 210) {
    const e = 1 - easeOut(prog(L, 210, 8));
    tag({ id: "end", kind: "title", text: CONTENT.end.text, size: 112, x: 900, y: 250, r: -2, dy: -600 * e });
  }
}
