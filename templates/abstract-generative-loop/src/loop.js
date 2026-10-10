// Pure function of the loop phase. phi = (i % N) / N, so frame N == frame 0 exactly.
(() => {
  const C = window.CONTENT;
  const W = C.width, H = C.height, N = C.frames, TAU = Math.PI * 2;
  const ctx = document.getElementById("c").getContext("2d");

  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const per = (phi, k, off) => Math.sin(TAU * (k * phi + off));
  const easeIO = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  // Static layout, generated once from the seed in a fixed order.
  const rnd = mulberry32(C.seed);
  const pick = () => C.palette[Math.floor(rnd() * C.palette.length)];
  const shapes = Array.from({ length: C.shapes }, (_, n) => ({
    ...(() => { const a = (n / C.shapes) * TAU + rnd() * 0.5, r = 140 + rnd() * 110;
      return { cx: W / 2 + Math.cos(a) * r, cy: H / 2 + Math.sin(a) * r }; })(),
    ax: 40 + rnd() * 90, ay: 40 + rnd() * 90,
    kx: 1 + Math.floor(rnd() * 2), ky: 1 + Math.floor(rnd() * 2),
    ox: rnd(), oy: rnd(),
    size: 100 + rnd() * 170, sizeAmp: 0.1 + rnd() * 0.15, so: rnd(),
    spin: [1, -1][n % 2] * (1 + Math.floor(rnd() * 2)), a0: rnd() * TAU,
    // corner radius fraction in each of the 4 states (0.5 = circle, 0.24 = rounded square)
    states: [0, 1, 2, 3].map(() => [0.5, 0.24, 0.5, 0.3][Math.floor(rnd() * 4)]),
    ring: n % 3 === 2, color: pick(), alpha: 0.55 + rnd() * 0.35,
  }));
  const parts = Array.from({ length: C.particles }, () => ({
    a0: rnd() * TAU, r0: 120 + Math.pow(rnd(), 0.8) * 400, k: 1 + Math.floor(rnd() * 3) * (rnd() < 0.5 ? 1 : -1),
    wob: 10 + rnd() * 40, wk: 1 + Math.floor(rnd() * 3), wo: rnd(),
    rad: 2 + rnd() * 3, alpha: 0.4 + rnd() * 0.55, color: pick(), yScale: 0.8 + rnd() * 0.3,
  }));

  // Periodic state chain 0 -> 1 -> 2 -> 3 -> 0 over four equal quarters with ease-in-out cubic.
  function chain(phi, st) {
    const q = phi * 4, s = Math.min(3, Math.floor(q)), e = easeIO(q - s);
    return lerp(st[s], st[(s + 1) % 4], e);
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.roundRect(x - w / 2, y - h / 2, w, h, r);
  }

  window.renderFrame = (i) => {
    const phi = (i % N) / N;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    ctx.fillStyle = C.ground; ctx.fillRect(0, 0, W, H);

    // Global breathing: peak scale at phi = 0.5 ("Morph 2" quarter), identical at 0 and 1.
    const peak = 0.5 - 0.5 * Math.cos(TAU * phi);

    // Soft backdrop glow
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, 620);
    g.addColorStop(0, "rgba(255,107,74," + (0.10 + 0.08 * peak).toFixed(4) + ")");
    g.addColorStop(1, "rgba(255,107,74,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // Particles (behind shapes): analytic orbits
    const swirl = 1 - 0.28 * peak;
    for (const p of parts) {
      const ang = p.a0 + TAU * p.k * phi;
      const r = (p.r0 + p.wob * per(phi, p.wk, p.wo)) * swirl;
      const x = W / 2 + Math.cos(ang) * r, y = H / 2 + Math.sin(ang) * r * p.yScale;
      ctx.globalAlpha = p.alpha * (0.7 + 0.3 * per(phi, 1, p.wo));
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(x, y, p.rad, 0, TAU); ctx.fill();
    }

    // Shapes
    for (const s of shapes) {
      const x = s.cx + s.ax * per(phi, s.kx, s.ox) + (W / 2 - s.cx) * 0.25 * peak;
      const y = s.cy + s.ay * per(phi, s.ky, s.oy) + (H / 2 - s.cy) * 0.25 * peak;
      const size = s.size * (1 + s.sizeAmp * per(phi, 1, s.so)) * (1 + 0.18 * peak);
      const rr = chain(phi, s.states) * size;
      ctx.save();
      ctx.translate(x, y); ctx.rotate(s.a0 + TAU * s.spin * phi);
      ctx.globalAlpha = s.alpha * (s.ring ? 0.9 : 1);
      ctx.shadowColor = s.color; ctx.shadowBlur = C.glow;
      roundRect(0, 0, size, size, rr);
      if (s.ring) { ctx.strokeStyle = s.color; ctx.lineWidth = 6; ctx.stroke(); }
      else { ctx.fillStyle = s.color; ctx.fill(); }
      ctx.restore();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  };
  window.__ready = Promise.resolve();
})();
