// Single source of style tokens. Everything is read from content.json (window.CONTENT).
(function () {
  const C = window.CONTENT;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const hexToRgb = (h) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
  const rgba = (h, a) => { const [r, g, b] = hexToRgb(h); return `rgba(${r},${g},${b},${a})`; };
  const mix = (h1, h2, k) => {
    const a = hexToRgb(h1), b = hexToRgb(h2);
    return "#" + a.map((v, i) => Math.round(v * (1 - k) + b[i] * k).toString(16).padStart(2, "0")).join("");
  };
  const P = C.palette;
  window.THEME = {
    C, P, W: C.video.width, H: C.video.height, SEED: C.video.seed,
    clamp, rgba, hexToRgb, mix,
    ramp: (f, a, b) => clamp((f - a) / (b - a)),
    easeOutCubic: (x) => 1 - Math.pow(1 - clamp(x), 3),
    easeInOut: (x) => { x = clamp(x); return x * x * (3 - 2 * x); },
    glass: { x: 260, y: 130, w: 560, h: 480 },
    // Opaque light tints for the glass, one per stage (the "brush wipe" colour).
    tints: [mix(P.sky, P.paper, 0.45), mix(P.teal, P.paper, 0.62), mix(P.indigo, P.paper, 0.6), mix(P.ochre, P.paper, 0.62)],
    stageColors: [P.sky, P.teal, P.indigo, P.vermilion],
    lineBands: [P.sky, P.ochre, P.teal, P.vermilion],
    zoomPerSec: 0.007,
    text: { y: 850, band: 6 },
  };
})();
