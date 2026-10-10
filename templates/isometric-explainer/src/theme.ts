import content from "../content.json";

export type Pt = [number, number];
export type Vec3 = [number, number, number];

export const C = content;
export const T = content.theme;
export const FPS = content.meta.fps;

export const COS30 = 0.8660254;
export const U = T.unit;
export const SPRING = T.springs;

// Project a grid coordinate to screen pixels (true isometric).
// Origin offset puts the scene bounding box centre at theme.sceneCenter.
const rawX = (x: number, y: number) => COS30 * U * (x - y);
const rawY = (x: number, y: number, z: number) => 0.5 * U * (x + y) - U * z;

const half = T.padSize / 2;
const corners: Pt[] = [];
for (const part of content.parts) {
  const [cx, cy] = part.at;
  corners.push([cx - half, cy - half], [cx + half, cy - half], [cx - half, cy + half], [cx + half, cy + half]);
}
const xs = corners.map(([x, y]) => rawX(x, y));
const ys = corners.map(([x, y]) => rawY(x, y, 0));
const OX = T.sceneCenter[0] - (Math.min(...xs) + Math.max(...xs)) / 2;
const OY = T.sceneCenter[1] - (Math.min(...ys) + Math.max(...ys)) / 2;

export const project = (x: number, y: number, z: number): Pt => [OX + rawX(x, y), OY + rawY(x, y, z)];

// Colour mixing for the dark-accent focus handover.
const hex = (c: string): Vec3 => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)) as Vec3;
export const mix = (a: string, b: string, t: number): string => {
  const [r1, g1, b1] = hex(a);
  const [r2, g2, b2] = hex(b);
  const k = Math.max(0, Math.min(1, t));
  const f = (p: number, q: number) => Math.round(p + (q - p) * k).toString(16).padStart(2, "0");
  return `#${f(r1, r2)}${f(g1, g2)}${f(b1, b2)}`;
};

export const PART_BY_ID = Object.fromEntries(content.parts.map((p) => [p.id, p]));
