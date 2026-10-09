// Theme + timing helpers. Scenes read tokens only from T (which reads content.json).
const T = (() => {
  const C = window.CONTENT;
  const fm = C.format;
  const col = C.colors;
  const W = fm.width;
  const H = fm.height;
  const fps = fm.fps;
  const N = Math.round(fm.durationSec * fps);
  const beatF = (b) => Math.round(((b * 60) / fm.bpm) * fps) + fm.offsetFrames;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const prog = (f, a, b) => clamp((f - a) / (b - a));
  const expoOut = (p) => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p));
  const expoIn = (p) => (p <= 0 ? 0 : Math.pow(2, 10 * p - 10));
  const sineInOut = (p) => -(Math.cos(Math.PI * p) - 1) / 2;

  // Frame-indexed seeded random: same keys, same value, every render.
  function hrand(...keys) {
    let h = (C.seed | 0) ^ 0x9e3779b9;
    for (const k of keys) {
      h = Math.imul(h ^ (k | 0), 0x85ebca6b);
      h ^= h >>> 13;
      h = Math.imul(h, 0xc2b2ae35);
      h ^= h >>> 16;
    }
    return (h >>> 0) / 4294967296;
  }

  const B = C.beats;
  const drop0 = beatF(B.drop);
  const finale0 = beatF(B.finale);
  // One list: camera punch, flash, RGB split (and sound, if added) all read it.
  const hits = C.hitBeats.map((beat) => {
    const inDrop = beat >= B.drop && beat < B.finale;
    const heavy = beat === B.drop || beat === B.finale;
    return {
      beat,
      f: beatF(beat),
      w: inDrop || heavy ? 1 : 0.75,
      flash: heavy ? 0.3 : inDrop ? 0.14 : beat === B.lock ? 0.2 : 0,
      split: inDrop || beat >= B.finale ? 8 : 4,
    };
  });

  function camera(f) {
    let s = 1;
    let x = 0;
    let y = 0;
    for (const h of hits) {
      const d = f - h.f;
      if (d < 0 || d >= 6) continue;
      const amp = 0.06 * h.w;
      s = d < 2 ? 1 + amp * expoOut((d + 1) / 2) : 1 + amp * (1 - sineInOut((d - 1) / 4));
      if (d < 4) {
        const k = (1 - d / 4) * 6 * h.w;
        x = (hrand(h.f, d, 1) * 2 - 1) * k;
        y = (hrand(h.f, d, 2) * 2 - 1) * k;
      }
    }
    return { s, x, y };
  }

  const glow = (k = 1) =>
    `0 0 ${24 * k}px ${col.accent}99, 0 0 ${64 * k}px ${col.accent}40` + (k > 1.3 ? `, 0 0 ${140 * k}px ${col.accent}30` : "");

  function mk(parent, css, text, tag = "div") {
    const e = document.createElement(tag);
    e.style.cssText = "position:absolute;" + css;
    if (text != null) e.textContent = text;
    parent.appendChild(e);
    return e;
  }

  const GLYPHS = "01<>/\\|#$%&*+=?";
  // Left-to-right resolve; chars not yet resolved show seeded glyphs.
  function decode(text, d, frames, salt) {
    let out = "";
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (c === " ") out += c;
      else if (d >= ((i + 1) * frames) / text.length) out += c;
      else out += GLYPHS[Math.floor(hrand(salt, d, i) * GLYPHS.length)];
    }
    return out;
  }

  const head = (px) => `font-family:'${C.fonts.headline}',sans-serif;font-weight:800;font-size:${px}px;letter-spacing:0.02em;text-transform:uppercase;color:${col.ice};white-space:nowrap;line-height:1;`;
  const mono = (px, op = 0.6) => `font-family:'${C.fonts.mono}',monospace;font-size:${px}px;letter-spacing:0.12em;text-transform:uppercase;color:${col.ice};opacity:${op};white-space:nowrap;`;
  const centered = (x, y, s = 1) => `left:50%;top:50%;transform:translate(-50%,-50%) translate(${x}px,${y}px) scale(${s});`;

  return { C, col, W, H, fps, N, beatF, clamp, lerp, prog, expoOut, expoIn, sineInOut, hrand, hits, camera, glow, mk, decode, head, mono, centered, drop0, finale0, B };
})();
