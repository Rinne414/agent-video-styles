import { readFileSync } from "node:fs";

// Hershey Simplex single-stroke font (centerline paths). Glyph y runs top-down, cap height = 21 units,
// baseline at y = 22, advance = 2 * o.
const CAP_UNITS = 21;
const BASE_Y = 22;
const SPACE_ADVANCE = 16;

export function loadFont(file) {
  const raw = JSON.parse(readFileSync(file, "utf8"));
  const glyphs = raw.chars.map((c) => ({
    adv: c.o * 2,
    strokes: c.d
      ? c.d.split("M").filter(Boolean).map((s) =>
          s.trim().replace(/L/g, " ").split(/\s+/).map((p) => p.split(",").map(Number)))
      : [],
  }));
  return { glyphs, first: raw.first };
}

export function glyphFor(font, ch) {
  return font.glyphs[ch.charCodeAt(0) - font.first] ?? null;
}

const scaleFor = (size) => size / 28;

export function textWidth(font, str, size) {
  const s = scaleFor(size);
  let w = 0;
  for (const ch of str) w += (glyphFor(font, ch)?.adv ?? SPACE_ADVANCE) * s;
  return w;
}

// Returns [{ pts, word, letter, ch }]. (x, y) is the top-left of the capital-letter box.
export function layoutText(font, str, { x, y, size, rand }) {
  const s = scaleFor(size);
  const out = [];
  let cx = x;
  let word = 0;
  let letter = 0;
  for (const ch of str) {
    const g = glyphFor(font, ch);
    if (!g || ch === " ") {
      cx += (g?.adv ?? SPACE_ADVANCE) * s;
      if (ch === " ") word++;
      continue;
    }
    const dy = (rand() - 0.5) * size * 0.03; // seeded baseline jitter, frozen at build time
    for (const stroke of g.strokes) {
      out.push({
        pts: stroke.map(([gx, gy]) => [cx + gx * s, y + dy + (gy - (BASE_Y - CAP_UNITS)) * s]),
        word,
        letter,
        ch,
      });
    }
    cx += g.adv * s;
    letter++;
  }
  return out;
}
