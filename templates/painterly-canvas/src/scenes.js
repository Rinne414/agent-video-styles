// Scenes: window frame, four glass stages (rain, rivulets, city, lamp + figure) and the lyric lines.
// Every value is a pure function of the frame number f.
(function () {
  const T = window.THEME, B = window.BRUSH;
  const { P, glass: G, ramp, easeOutCubic: eo, rgba, mix, C } = T;
  const S = C.stages;
  const H = B.hash;

  function roundU(x, y, w, h, r) {
    const pts = [[x, y + h], [x, y + r]];
    for (let k = 1; k <= 4; k++) { const a = Math.PI + (k / 4) * (Math.PI / 2); pts.push([x + r + Math.cos(a) * r, y + r + Math.sin(a) * r]); }
    pts.push([x + w - r, y]);
    for (let k = 1; k <= 4; k++) { const a = -Math.PI / 2 + (k / 4) * (Math.PI / 2); pts.push([x + w - r + Math.cos(a) * r, y + r + Math.sin(a) * r]); }
    pts.push([x + w, y + h]);
    return pts;
  }

  // ---- strokes built once -------------------------------------------------
  const ink = {
    frame: B.makeStroke(roundU(G.x - 4, G.y - 4, G.w + 8, G.h + 8, 12)),
    frame2: B.makeStroke(roundU(G.x + 5, G.y + 6, G.w - 8, G.h - 10, 10)),
    sill: B.makeStroke([[G.x - 40, G.y + G.h + 20], [G.x + 140, G.y + G.h + 15], [540, G.y + G.h + 21], [G.x + 420, G.y + G.h + 15], [G.x + G.w + 40, G.y + G.h + 20]]),
    sill2: B.makeStroke([[G.x - 5, G.y + G.h + 40], [G.x + 200, G.y + G.h + 37], [G.x + 400, G.y + G.h + 41], [G.x + G.w - 5, G.y + G.h + 37]]),
    bar: B.makeStroke([[G.x, G.y + 200], [G.x + 180, G.y + 197], [G.x + 380, G.y + 202], [G.x + G.w, G.y + 198]]),
  };

  const tintPasses = T.tints.map((_, k) => Array.from({ length: 5 }, (__, j) => {
    const y = G.y + 20 + j * ((G.h - 40) / 4);
    const a = [G.x - 40, y], b = [G.x + G.w + 40, y + 10];
    return B.makeStroke(j % 2 ? [b, a] : [a, b], 6);
  }));

  const counts = [56, 40, 28, 18];
  const drops = Array.from({ length: 56 }, (_, i) => ({
    x: G.x + H(i, 1) * G.w, sp: 540 + H(i, 2) * 420, len: 34 + H(i, 3) * 70, ph: H(i, 4), w: 1.2 + H(i, 5) * 1.8, a: 0.24 + 0.22 * H(i, 6),
  }));
  const beads = Array.from({ length: 16 }, (_, i) => ({
    x: G.x + 30 + H(i, 11) * (G.w - 60), y: G.y + 30 + H(i, 12) * (G.h - 60), r: 3 + H(i, 13) * 5,
  }));

  const rivulets = Array.from({ length: 6 }, (_, i) => {
    const x0 = G.x + 50 + i * ((G.w - 100) / 5) + (H(i, 21) - 0.5) * 24, y0 = G.y + 10 + H(i, 23) * 90, n = Math.floor((G.h - 20 - (y0 - G.y) - H(i, 24) * 120) / 12);
    const pts = [];
    for (let k = 0; k <= n; k++) pts.push([x0 + (B.noise1(300 + i, k * 0.16) - 0.5) * 46 + 4 * Math.sin(k * 0.7 + i), y0 + k * 12]);
    return { stroke: B.makeStroke(pts), start: S[1] + i * 8, dur: 70, seed: 300 + i, x0 };
  });

  const buildings = Array.from({ length: 8 }, (_, i) => {
    const x = G.x + 30 + i * ((G.w - 60) / 7) + (H(i, 31) - 0.5) * 20, top = G.y + G.h - (110 + H(i, 32) * 150);
    return { stroke: B.makeStroke([[x, G.y + G.h + 10], [x + (H(i, 33) - 0.5) * 8, top]]), w: 60 + H(i, 34) * 24, start: S[2] + i * 5, seed: 400 + i };
  });
  const bokeh = Array.from({ length: 14 }, (_, i) => ({
    x: G.x + 40 + H(i, 41) * (G.w - 80), y: G.y + G.h - 40 - H(i, 42) * 220, r: 12 + H(i, 43) * 18,
    color: i % 5 === 4 ? P.vermilion : P.ochre, start: S[2] + 20 + i * 4,
  }));

  const gb = G.y + G.h, cx = G.x + G.w / 2;
  const figure = [
    { s: B.makeStroke([[cx, gb - 84], [cx, gb + 6]]), w: 70, n: 10, dry: 0.02, start: 0 },
    { s: B.makeStroke([[cx - 58, gb - 50], [cx - 20, gb - 58], [cx + 22, gb - 57], [cx + 58, gb - 49]]), w: 44, n: 8, dry: 0.02, start: 4 },
    { s: B.makeStroke(Array.from({ length: 48 }, (_, k) => { const a = k * 0.5, r = 3 + (k / 47) * 23; return [cx + Math.cos(a) * r, gb - 112 + Math.sin(a) * r]; }), 3), w: 12, n: 4, dry: 0, start: 9 },
  ];

  // ---- helpers -------------------------------------------------------------
  const stageIndex = (f) => S.reduce((n, s, k) => (f >= s ? k : n), -1);
  const glassClip = (g) => { g.save(); g.beginPath(); g.roundRect(G.x, G.y, G.w, G.h, 12); g.clip(); };

  function drawHalos(g, f) {
    S.forEach((s, k) => {
      const p = eo(ramp(f, s, s + 30)), out = k < S.length - 1 ? eo(ramp(f, S[k + 1], S[k + 1] + 30)) : 0;
      B.drawWash(g, B.wash(`halo${k}`, 400, 340, T.stageColors[k], 50 + k, 0.2), 540, 380, 0.85 + 0.15 * p, 0.22 * p * (1 - out));
    });
  }

  function drawTints(g, f, boil) {
    S.forEach((s, k) => {
      if (f < s) return;
      tintPasses[k].forEach((st, j) => {
        B.drawStroke(g, st, { w: 170, color: T.tints[k], alpha: 0.95, t: eo(ramp(f - s, j * 2.5, j * 2.5 + 10)), seed: 100 + k * 10 + j, boil, n: 12, dry: 0.04, jit: 1.2, tail: 0.02 });
      });
      const bloom = eo(ramp(f, s + 6, s + 36));
      B.drawWash(g, B.wash(`glass${k}`, 260, 220, T.stageColors[k], 70 + k, 0.14), 540, G.y + G.h / 2, 0.7 + 0.3 * bloom, 0.5 * bloom);
    });
  }

  function drawRain(g, f) {
    const vis = ramp(f, S[0] + 10, S[0] + 40);
    if (vis <= 0) return;
    let count = counts[0];
    for (let k = 1; k < S.length; k++) count += (counts[k] - counts[k - 1]) * ramp(f, S[k], S[k] + 20);
    const col = mix(P.indigo, P.paper, 0.35 * ramp(f, S[2], S[2] + 20));
    const light = ramp(f, S[2], S[2] + 20);
    g.save();
    g.lineCap = "round";
    drops.forEach((d, i) => {
      const cyc = G.h + 2 * d.len, y = G.y - d.len + (((f / 30) * d.sp + d.ph * cyc) % cyc), x = d.x - (y - G.y) * 0.04;
      g.globalAlpha = vis * d.a * Math.min(1, Math.max(0, count - i)) * (1 - 0.15 * light);
      g.strokeStyle = light > 0.5 ? mix(P.sky, "#ffffff", 0.3) : col;
      g.lineWidth = d.w;
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + d.len * 0.12, y - d.len); g.stroke();
    });
    g.restore();
    beads.forEach((b, i) => {
      const a = eo(ramp(f, 60 + i * 3, 80 + i * 3));
      if (a <= 0) return;
      g.save();
      g.globalAlpha = 0.6 * a; g.fillStyle = mix(P.paper, "#ffffff", 0.5);
      g.beginPath(); g.ellipse(b.x, b.y, b.r * 0.8, b.r, 0, 0, 6.3); g.fill();
      g.globalAlpha = 0.4 * a; g.strokeStyle = P.indigo; g.lineWidth = 1.4;
      g.beginPath(); g.ellipse(b.x, b.y, b.r * 0.8, b.r, 0, 0.3, 2.8); g.stroke();
      g.restore();
    });
  }

  function glowDot(g, x, y, r, color, a) {
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, rgba(color, a)); gr.addColorStop(0.5, rgba(color, a * 0.55)); gr.addColorStop(1, rgba(color, 0));
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }

  function drawRivulets(g, f, boil) {
    const fade = 1 - 0.6 * ramp(f, S[2], S[2] + 40);
    rivulets.forEach((r, i) => {
      const t = eo(ramp(f, r.start, r.start + r.dur));
      if (t <= 0) return;
      B.drawStroke(g, r.stroke, { w: 13, color: P.ochre, alpha: 0.8 * fade, t, seed: r.seed, boil, n: 6, dry: 0.12, jit: 1, tail: 0.04 });
      B.drawStroke(g, r.stroke, { w: 4, color: mix(P.paper, "#ffffff", 0.5), alpha: 0.7 * fade, t, seed: r.seed + 50, boil, n: 3, dry: 0.2, jit: 0.8, tail: 0.04 });
      const head = r.stroke.p[Math.min(r.stroke.p.length - 1, Math.floor(t * (r.stroke.p.length - 1)))];
      if (t < 1) glowDot(g, head.x, head.y, 22, P.ochre, 0.8 * fade);
      else {
        const u = (((f - r.start - r.dur) / 30) * 0.12 + H(i, 5)) % 1, p = r.stroke.p[Math.floor(u * (r.stroke.p.length - 1))];
        glowDot(g, p.x, p.y, 18, P.ochre, 0.7 * fade);
      }
    });
  }

  function drawCity(g, f, boil) {
    const soft = ramp(f, S[2] + 40, S[3] + 20), out = ramp(f, S[3], S[3] + 30);
    buildings.forEach((b) => {
      B.drawStroke(g, b.stroke, { w: b.w, color: P.indigo, alpha: (0.6 - 0.3 * soft) * (1 - 0.4 * out), t: eo(ramp(f, b.start, b.start + 26)), seed: b.seed, boil, n: 14, dry: 0.03, jit: 1.2, tail: 0.02 });
    });
    bokeh.forEach((b, i) => {
      const a = eo(ramp(f, b.start, b.start + 24));
      if (a > 0) glowDot(g, b.x, b.y, b.r * (1 + 0.7 * soft) * (0.6 + 0.4 * a), b.color, (0.85 - 0.25 * soft) * a * (1 - 0.5 * out));
    });
  }

  function drawLamp(g, f) {
    const p = eo(ramp(f, S[3] + 4, S[3] + 40));
    if (p <= 0) return;
    B.drawWash(g, B.wash("lampOchre", 300, 230, P.ochre, 91, 0.18), cx, gb - 90, 0.6 + 0.4 * p, 0.4 * p);
    B.drawWash(g, B.wash("lampVerm", 200, 160, P.vermilion, 92, 0.2), cx, gb - 60, 0.5 + 0.5 * p, 0.5 * p);
  }

  function drawFigure(g, f, boil) {
    figure.forEach((fg, i) => {
      B.drawStroke(g, fg.s, { w: fg.w, color: P.ink, alpha: 0.9, t: eo(ramp(f, S[3] + 20 + fg.start, S[3] + 42 + fg.start)), seed: 500 + i, boil, n: fg.n, dry: fg.dry, jit: 1.4, tail: 0.04 });
    });
  }

  function drawFrame(g, f, boil) {
    const o = (st, a, b, w, extra = {}) => B.drawStroke(g, st, { w, color: P.ink, alpha: 0.95, t: eo(ramp(f, a, b)), seed: 600 + (a | 0), boil, n: 7, dry: 0.12, jit: 1.2, tail: 0.04, ...extra });
    o(ink.frame, 4, 40, 9);
    o(ink.frame2, 16, 48, 3.5, { n: 3, alpha: 0.6 });
    o(ink.bar, 30, 52, 7);
    o(ink.sill, 22, 48, 18, { n: 8 });
    o(ink.sill2, 34, 56, 6, { n: 4, alpha: 0.55 });
  }

  function drawArt(g, f) {
    const boil = Math.floor(f / 3);
    g.clearRect(0, 0, T.W, T.H);
    drawHalos(g, f);
    glassClip(g);
    drawTints(g, f, boil);
    drawCity(g, f, boil);
    drawRain(g, f);
    drawRivulets(g, f, boil);
    g.restore();
    drawLamp(g, f);
    glassClip(g);
    drawFigure(g, f, boil);
    g.restore();
    drawFrame(g, f, boil);
  }

  // ---- lyrics ---------------------------------------------------------------
  function drawLyrics(c, f) {
    const boil = Math.floor(f / 3), fnt = C.font;
    C.lines.forEach((ln, k) => {
      const u = f - ln.start, last = k === C.lines.length - 1;
      if (u < 0 || (!last && f >= ln.end)) return;
      const out = last ? 1 : 1 - ramp(f, ln.end - 8, ln.end);
      const inA = ramp(u, 6, 16), rise = 6 * (1 - eo(ramp(u, 6, 16)));
      c.save();
      c.font = `italic ${fnt.weight} ${fnt.size}px "${fnt.family}"`;
      c.letterSpacing = "1px";
      const tw = c.measureText(ln.text).width, x0 = T.W / 2 - tw / 2, y = T.text.y;
      c.translate(T.W / 2, y); c.rotate(((H(k, 77) - 0.5) * 2 * 0.9 * Math.PI) / 180); c.translate(-T.W / 2, -y);
      const band = B.makeStroke([[x0 - 34, y - T.text.band + 3], [x0 + tw * 0.5, y - T.text.band - 3], [x0 + tw + 34, y - T.text.band + 2]], 6);
      B.drawStroke(c, band, { w: 40, color: T.lineBands[k], alpha: 0.42 * out, t: eo(ramp(u, 0, 20)), seed: 700 + k, boil, n: 8, dry: 0.15, jit: 1.2, tail: 0.04 });
      const reveal = eo(ramp(u, 6, 30));
      c.beginPath(); c.rect(x0 - 12, y - 90, (tw + 24) * reveal, 130); c.clip();
      c.globalAlpha = inA * out; c.fillStyle = P.ink; c.textBaseline = "alphabetic";
      c.fillText(ln.text, x0, y + rise);
      c.restore();
    });
    const credit = ramp(f, C.closeStart + 20, C.closeStart + 40);
    if (credit > 0) {
      c.save();
      c.font = `italic ${fnt.weight} 34px "${fnt.family}"`; c.letterSpacing = "3px";
      c.globalAlpha = 0.65 * credit; c.fillStyle = P.ink; c.textAlign = "center";
      c.fillText(C.credit, T.W / 2, 970 + 6 * (1 - eo(credit)));
      c.restore();
    }
  }

  window.SCENES = { drawArt, drawLyrics, stageIndex };
})();
