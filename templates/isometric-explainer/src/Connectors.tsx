import React from "react";
import { Easing, interpolate } from "remotion";
import { polyPath } from "./iso";
import { C, Pt, T, project } from "./theme";

const HALF = C.connectorHalfWidth;

const normalOf = (a: Pt, b: Pt): Pt => {
  const dx = Math.sign(b[0] - a[0]);
  const dy = Math.sign(b[1] - a[1]);
  return [-dy, dx];
};

// Offset an axis-aligned polyline by +/- HALF on the grid, mitering right-angle corners.
const offsetLine = (pts: Pt[], side: 1 | -1): Pt[] =>
  pts.map((p, i) => {
    const normals: Pt[] = [];
    if (i > 0) normals.push(normalOf(pts[i - 1], p));
    if (i < pts.length - 1) normals.push(normalOf(p, pts[i + 1]));
    const nx = normals.reduce((s, n) => s + n[0], 0);
    const ny = normals.reduce((s, n) => s + n[1], 0);
    return [p[0] + side * HALF * nx, p[1] + side * HALF * ny];
  });

// Cut a polyline to a fraction of its length.
const truncate = (pts: Pt[], t: number): Pt[] => {
  const lens = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  let left = lens.reduce((s, l) => s + l, 0) * t;
  const out: Pt[] = [pts[0]];
  for (let i = 0; i < lens.length; i++) {
    if (left >= lens[i]) {
      out.push(pts[i + 1]);
      left -= lens[i];
    } else {
      const k = left / lens[i];
      out.push([pts[i][0] + (pts[i + 1][0] - pts[i][0]) * k, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * k]);
      break;
    }
  }
  return out;
};

const strip = (path: Pt[], t: number): string | null => {
  if (t <= 0) return null;
  const cut = truncate(path, t);
  if (cut.length < 2) return null;
  const left = offsetLine(cut, 1);
  const right = offsetLine(cut, -1).reverse();
  return polyPath([...left, ...right].map(([x, y]) => project(x, y, 0)));
};

// Two passes so overlapping strips merge into one outline: wide grey stroke, then white fill on top.
export const Connectors: React.FC<{ frame: number; sw: number }> = ({ frame, sw }) => {
  const shapes = C.connectors
    .map((c) => {
      const t = interpolate(frame, [c.start, c.start + C.timing.connectorDrawFrames], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      });
      return strip(c.path as Pt[], t);
    })
    .filter((d): d is string => d !== null);
  return (
    <g>
      {shapes.map((d, i) => (
        <path key={`e${i}`} d={d} fill="none" stroke={T.edge} strokeWidth={sw * 2} strokeLinejoin="round" />
      ))}
      {shapes.map((d, i) => (
        <path key={`f${i}`} d={d} fill={T.ground} stroke="none" />
      ))}
    </g>
  );
};
