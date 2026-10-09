// Seeded painterly primitives: bristle strokes with draw-on, cached wash sprites, grain.
(function () {
  const { clamp, rgba, hexToRgb } = window.THEME;

  function hash(a, b = 0, c = 0) {
    let h = Math.imul(a | 0, 374761393) ^ Math.imul(b | 0, 668265263) ^ Math.imul(c | 0, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1103515245);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
  function noise1(seed, x) {
    const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f);
    return hash(seed, i) * (1 - u) + hash(seed, i + 1) * u;
  }
  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Polyline -> evenly spaced points with normals and cumulative length.
  function makeStroke(pts, step = 5) {
    const p = [{ x: pts[0][0], y: pts[0][1] }], s = [0];
    let L = 0;
    for (let k = 1; k < pts.length; k++) {
      const [x0, y0] = pts[k - 1], [x1, y1] = pts[k];
      const d = Math.hypot(x1 - x0, y1 - y0), n = Math.max(1, Math.ceil(d / step));
      for (let j = 1; j <= n; j++) {
        const u = j / n;
        L += d / n;
        p.push({ x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u });
        s.push(L);
      }
    }
    const nx = [], ny = [];
    for (let k = 0; k < p.length; k++) {
      const a = p[Math.max(0, k - 2)], b = p[Math.min(p.length - 1, k + 2)];
      const dx = b.x - a.x, dy = b.y - a.y, m = Math.hypot(dx, dy) || 1;
      nx.push(-dy / m); ny.push(dx / m);
    }
    return { p, s, nx, ny, L };
  }

  // Draw stroke S up to fraction t. o: w, color, alpha, t, seed, boil, n bristles, dry, jit, tail.
  function drawStroke(ctx, S, o) {
    const { w, color, alpha = 1, t = 1, seed = 1, boil = 0, n = 9, dry = 0.3, jit = 1.2, tail = 0.1 } = o;
    if (t <= 0 || alpha <= 0) return;
    const sEnd = S.L * Math.min(t, 1);
    ctx.save();
    ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.strokeStyle = color;
    for (let b = 0; b < n; b++) {
      const off = n === 1 ? 0 : (b / (n - 1)) * 2 - 1;
      ctx.globalAlpha = alpha * (0.5 + 0.5 * hash(seed, b, 7));
      ctx.lineWidth = Math.max(1, (w / n) * 1.8 * (0.7 + 0.6 * hash(seed, b, 3)));
      ctx.beginPath();
      let pen = false;
      for (let k = 0; k < S.p.length; k++) {
        const s = S.s[k];
        if (s > sEnd) break;
        if (hash(seed, b, Math.floor(s / 18) + 100) < dry * (0.25 + 0.75 * Math.abs(off))) { pen = false; continue; }
        const prof = Math.min(1, 0.35 + (s / (tail * S.L + 1)) * 0.65, 0.35 + ((sEnd - s) / 30) * 0.65);
        const j = (noise1(seed * 31 + b * 7 + boil * 101, s * 0.04) - 0.5) * 2 * jit;
        const x = S.p[k].x + S.nx[k] * (off * (w / 2) * prof + j);
        const y = S.p[k].y + S.ny[k] * (off * (w / 2) * prof + j);
        if (!pen) { ctx.moveTo(x, y); pen = true; } else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  // Watercolor wash: stacked wobbly polygons + darker pigment edge, built once per key.
  const washCache = new Map();
  function wash(key, rx, ry, hex, seed, irr = 0.16, layers = 14) {
    if (washCache.has(key)) return washCache.get(key);
    const pad = 28, w = Math.ceil(rx * 2 + pad * 2), h = Math.ceil(ry * 2 + pad * 2);
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
    const g = cv.getContext("2d"), rnd = mulberry32(seed), N = 48;
    const poly = (amp) => {
      const ph = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28];
      const pts = [];
      for (let k = 0; k < N; k++) {
        const a = (k / N) * Math.PI * 2;
        const r = 1 + amp * (Math.sin(a * 2 + ph[0]) * 0.5 + Math.sin(a * 3 + ph[1]) * 0.35 + Math.sin(a * 5 + ph[2]) * 0.25);
        pts.push([w / 2 + Math.cos(a) * rx * r, h / 2 + Math.sin(a) * ry * r]);
      }
      return pts;
    };
    const trace = (pts) => { g.beginPath(); pts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
    g.filter = "blur(1.2px)";
    for (let l = 0; l < layers; l++) {
      trace(poly(irr * (0.6 + 0.8 * rnd())));
      g.fillStyle = rgba(hex, 0.07);
      g.fill();
    }
    const [r, gg, b] = hexToRgb(hex);
    trace(poly(irr));
    g.strokeStyle = `rgba(${(r * 0.8) | 0},${(gg * 0.8) | 0},${(b * 0.8) | 0},0.2)`;
    g.lineWidth = 2.5;
    g.stroke();
    g.filter = "none";
    for (let k = 0; k < 140; k++) {
      const a = rnd() * 6.28, d = Math.sqrt(rnd()) * 0.92;
      g.fillStyle = rgba(hex, 0.1);
      g.beginPath(); g.arc(w / 2 + Math.cos(a) * rx * d, h / 2 + Math.sin(a) * ry * d, 0.8 + rnd() * 1.8, 0, 6.28); g.fill();
    }
    washCache.set(key, cv);
    return cv;
  }
  function drawWash(ctx, cv, cx, cy, scale, alpha, mode = "multiply") {
    if (alpha <= 0 || scale <= 0) return;
    ctx.save();
    ctx.globalCompositeOperation = mode; ctx.globalAlpha = clamp(alpha);
    ctx.drawImage(cv, cx - (cv.width / 2) * scale, cy - (cv.height / 2) * scale, cv.width * scale, cv.height * scale);
    ctx.restore();
  }

  // Paper grain: three seeded variants cycled every 3 frames, plus a static low-frequency mottle.
  function makeGrain(W, H, seed) {
    const variants = [];
    for (let v = 0; v < 3; v++) {
      const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
      const g = cv.getContext("2d"), img = g.createImageData(W, H), rnd = mulberry32(seed + 101 * v);
      for (let k = 0; k < W * H; k++) {
        const val = 242 + Math.floor(rnd() * 14);
        img.data[k * 4] = val; img.data[k * 4 + 1] = val - 1; img.data[k * 4 + 2] = val - 3; img.data[k * 4 + 3] = 255;
      }
      g.putImageData(img, 0, 0);
      variants.push(cv);
    }
    const mottle = document.createElement("canvas"); mottle.width = W; mottle.height = H;
    const m = mottle.getContext("2d"), small = document.createElement("canvas"); small.width = 36; small.height = 36;
    const sg = small.getContext("2d"), r2 = mulberry32(seed + 9);
    for (let y = 0; y < 36; y++) {
      for (let x = 0; x < 36; x++) { const v = 244 + Math.floor(r2() * 11); sg.fillStyle = `rgb(${v},${v},${v - 4})`; sg.fillRect(x, y, 1, 1); }
    }
    m.imageSmoothingEnabled = true; m.imageSmoothingQuality = "high"; m.drawImage(small, 0, 0, W, H);
    return { variants, mottle };
  }

  window.BRUSH = { hash, noise1, mulberry32, makeStroke, drawStroke, wash, drawWash, makeGrain };
})();
