import React from "react";
import { project, Pt, T, mix, U } from "./theme";

// Rounded closed polygon path (quadratic fillets at each vertex).
export const roundedPath = (pts: Pt[], r: number): string => {
  const n = pts.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const prev = pts[(i + n - 1) % n];
    const cur = pts[i];
    const next = pts[(i + 1) % n];
    const lp = Math.hypot(prev[0] - cur[0], prev[1] - cur[1]);
    const ln = Math.hypot(next[0] - cur[0], next[1] - cur[1]);
    const rp = Math.min(r, lp / 2);
    const rn = Math.min(r, ln / 2);
    const a: Pt = [cur[0] + ((prev[0] - cur[0]) / lp) * rp, cur[1] + ((prev[1] - cur[1]) / lp) * rp];
    const b: Pt = [cur[0] + ((next[0] - cur[0]) / ln) * rn, cur[1] + ((next[1] - cur[1]) / ln) * rn];
    d += `${i === 0 ? "M" : "L"}${a[0].toFixed(2)} ${a[1].toFixed(2)}Q${cur[0].toFixed(2)} ${cur[1].toFixed(2)} ${b[0].toFixed(2)} ${b[1].toFixed(2)}`;
  }
  return d + "Z";
};

export const polyPath = (pts: Pt[], close = true): string =>
  pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join("") + (close ? "Z" : "");

export interface Palette {
  face: string;
  edge: string;
  inner: string;
  text: string;
}

// dark: 0 = white block, 1 = dark accent block with white edges.
export const palette = (dark: number): Palette => ({
  face: mix(T.ground, T.accent, dark),
  edge: mix(T.edge, "#FFFFFF", dark),
  inner: mix(T.inner, "#FFFFFF", dark),
  text: mix(T.textDark, "#FFFFFF", dark),
});

interface BoxProps {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  pal: Palette;
  sw: number; // stroke width in px (already divided by zoom)
  radius?: number; // fraction of the long side
  draw?: number; // 0..1 edge draw-on progress (pads); fill appears near the end
  showInner?: boolean;
}

// One slab: rounded silhouette plus the three visible inner edges. Visible faces are +x, +y, +z.
export const Box: React.FC<BoxProps> = ({ x, y, z, w, d, h, pal, sw, radius = 0.07, draw = 1, showInner = true }) => {
  const top = z + h;
  const A = project(x, y, top);
  const B = project(x + w, y, top);
  const N = project(x + w, y + d, top);
  const Cc = project(x, y + d, top);
  const B2 = project(x + w, y, z);
  const N2 = project(x + w, y + d, z);
  const C2 = project(x, y + d, z);
  const longSide = Math.max(w, d, h) * U * 1.2;
  const shortSide = Math.min(w, d, h) * U;
  const r = Math.min(radius * longSide, 0.38 * shortSide);
  const sil = roundedPath([A, B, B2, N2, C2, Cc], r);
  const shorten = (from: Pt, to: Pt): [Pt, Pt] => {
    const l = Math.hypot(to[0] - from[0], to[1] - from[1]);
    const k = Math.min(0.6 * r, l / 3) / l;
    return [from, [to[0] - (to[0] - from[0]) * k, to[1] - (to[1] - from[1]) * k]];
  };
  const inner = [shorten(N, B), shorten(N, Cc), shorten(N, N2)];
  const fillOpacity = draw >= 1 ? 1 : Math.max(0, (draw - 0.7) / 0.3);
  return (
    <g>
      <path d={sil} fill={pal.face} fillOpacity={fillOpacity} stroke="none" />
      <path
        d={sil}
        fill="none"
        stroke={pal.edge}
        strokeWidth={sw}
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
      />
      {showInner && draw >= 1 &&
        inner.map(([p, q], i) => (
          <path key={i} d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} stroke={pal.edge} strokeWidth={sw} strokeLinecap="round" />
        ))}
    </g>
  );
};

type Face = "top" | "x" | "y";

// Text set into a face: affine matrix maps the text plane onto the iso face (fill only, no stroke).
export const FaceText: React.FC<{ at: [number, number, number]; face: Face; text: string; fill: string; size?: number }> = ({
  at,
  face,
  text,
  fill,
  size = T.tagSize,
}) => {
  const [sx, sy] = project(at[0], at[1], at[2]);
  const m =
    face === "top"
      ? [0.8660254, 0.5, -0.8660254, 0.5]
      : face === "x"
        ? [0.8660254, -0.5, 0, 1]
        : [0.8660254, 0.5, 0, 1];
  return (
    <text
      transform={`matrix(${m.join(" ")} ${sx} ${sy})`}
      textAnchor="middle"
      dominantBaseline="central"
      fontFamily='"JetBrains Mono", monospace'
      fontWeight={500}
      fontSize={size}
      fill={fill}
    >
      {text}
    </text>
  );
};

// Projected line in grid coordinates.
export const Line3: React.FC<{ a: [number, number, number]; b: [number, number, number]; stroke: string; sw: number }> = ({
  a,
  b,
  stroke,
  sw,
}) => {
  const p = project(...a);
  const q = project(...b);
  return <path d={`M${p[0]} ${p[1]}L${q[0]} ${q[1]}`} stroke={stroke} strokeWidth={sw} strokeLinecap="round" />;
};

// Flat rectangle on a plane, as a projected quad (no stroke skew).
export const FlatQuad: React.FC<{
  origin: [number, number, number];
  du: [number, number, number];
  dv: [number, number, number];
  stroke: string;
  sw: number;
  fill?: string;
}> = ({ origin, du, dv, stroke, sw, fill = "none" }) => {
  const add = (a: number[], b: number[], c: number[]): [number, number, number] => [a[0] + b[0] + c[0], a[1] + b[1] + c[1], a[2] + b[2] + c[2]];
  const z0 = [0, 0, 0];
  const pts = [origin, add(origin, du, z0), add(origin, du, dv), add(origin, z0, dv)].map((p) => project(...p));
  return <path d={polyPath(pts)} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
};

// Isometric circle on a horizontal plane: ellipse rx = 1.2247 r, ry = 0.7071 r (in px).
export const ellipseAt = (cx: number, cy: number, z: number, r: number) => {
  const [sx, sy] = project(cx, cy, z);
  return { sx, sy, rx: 1.2247449 * U * r, ry: 0.7071068 * U * r };
};
