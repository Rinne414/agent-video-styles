import React from "react";
import { interpolate, spring } from "remotion";
import { Box, FaceText, FlatQuad, Line3, Palette, ellipseAt, palette } from "./iso";
import { FPS, SPRING, T, U, project } from "./theme";

export interface PartProps {
  cx: number;
  cy: number;
  tag: string;
  start: number;
  frame: number;
  dark: number;
  sw: number;
}

const Z0 = T.padThickness;
const STAGGER = 2;

// Drop-in assemble: starts dropUnits higher and transparent, settles on a spring.
const enterOf = (frame: number, start: number, k: number) => {
  const f = frame - start - k * STAGGER;
  const p = spring({ frame: f, fps: FPS, config: SPRING });
  return { dy: (1 - p) * T.dropUnits * U, opacity: interpolate(f, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) };
};

const Drop: React.FC<{ frame: number; start: number; k: number; children: React.ReactNode }> = ({ frame, start, k, children }) => {
  const { dy, opacity } = enterOf(frame, start, k);
  if (opacity <= 0) return null;
  return (
    <g transform={`translate(0 ${-dy})`} opacity={opacity}>
      {children}
    </g>
  );
};

const detailOpacity = (frame: number, start: number, i: number) =>
  interpolate(frame - start - 14 - i, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const Laptop: React.FC<PartProps> = ({ cx, cy, tag, start, frame, dark, sw }) => {
  const pal = palette(dark);
  const x0 = cx - 0.95;
  const y0 = cy - 1.1;
  const keys: React.JSX.Element[] = [];
  let n = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 6; j++) {
      keys.push(
        <g key={`${i}-${j}`} opacity={detailOpacity(frame, start, n++)}>
          <FlatQuad origin={[x0 + 0.3 + i * 0.4, y0 + 0.2 + j * 0.3, Z0 + 0.12]} du={[0.26, 0, 0]} dv={[0, 0.2, 0]} stroke={pal.inner} sw={sw} />
        </g>,
      );
    }
  }
  return (
    <g>
      <Drop frame={frame} start={start} k={0}>
        <Box x={x0} y={y0} z={Z0} w={1.9} d={2.2} h={0.12} pal={pal} sw={sw} />
        {keys}
      </Drop>
      <Drop frame={frame} start={start} k={1}>
        <Box x={x0} y={y0} z={Z0 + 0.12} w={0.12} d={2.2} h={1.6} pal={pal} sw={sw} radius={0.05} />
        <Line3 a={[x0 + 0.12, y0 + 0.15, Z0 + 1.4]} b={[x0 + 0.12, y0 + 2.05, Z0 + 1.4]} stroke={pal.inner} sw={sw} />
        <FaceText at={[x0 + 0.12, cy, Z0 + 0.8]} face="x" text={tag} fill={pal.text} />
      </Drop>
    </g>
  );
};

export const Balancer: React.FC<PartProps> = ({ cx, cy, tag, start, frame, dark, sw }) => {
  const pal = palette(dark);
  const vents: React.JSX.Element[] = [];
  for (let i = 0; i < 5; i++) {
    vents.push(
      <g key={i} opacity={detailOpacity(frame, start, i)}>
        <Line3 a={[cx - 1 + 0.35 + i * 0.4, cy + 1.3, Z0 + 0.1]} b={[cx - 1 + 0.35 + i * 0.4, cy + 1.3, Z0 + 0.3]} stroke={pal.inner} sw={sw} />
      </g>,
    );
  }
  return (
    <g>
      <Drop frame={frame} start={start} k={0}>
        <Box x={cx - 1.3} y={cy - 1.3} z={Z0} w={2.6} d={2.6} h={0.4} pal={pal} sw={sw} />
        {vents}
      </Drop>
      <Drop frame={frame} start={start} k={1}>
        <Box x={cx - 0.85} y={cy - 0.85} z={Z0 + 0.4} w={1.7} d={1.7} h={0.6} pal={pal} sw={sw} />
        <FaceText at={[cx, cy, Z0 + 1.0]} face="top" text={tag} fill={pal.text} />
      </Drop>
    </g>
  );
};

export const Server: React.FC<PartProps> = ({ cx, cy, tag, start, frame, dark, sw }) => {
  const pal = palette(dark);
  const x0 = cx - 1;
  const y0 = cy - 1;
  const slabs = [0, 1, 2].map((i) => {
    const z = Z0 + i * 0.58;
    const slits = [0, 1, 2, 3, 4].map((s) => (
      <g key={s} opacity={detailOpacity(frame, start, i * 5 + s)}>
        <Line3 a={[x0 + 2, y0 + 0.9 + s * 0.2, z + 0.14]} b={[x0 + 2, y0 + 0.9 + s * 0.2, z + 0.36]} stroke={pal.inner} sw={sw} />
      </g>
    ));
    return (
      <Drop key={i} frame={frame} start={start} k={i}>
        <Box x={x0} y={y0} z={z} w={2} d={2} h={0.5} pal={pal} sw={sw} />
        {slits}
        <Line3 a={[x0 + 0.3, y0 + 2, z + 0.25]} b={[x0 + 0.45, y0 + 2, z + 0.25]} stroke={pal.edge} sw={sw * 2.2} />
        {i === 2 && <FaceText at={[cx, cy, z + 0.5]} face="top" text={tag} fill={pal.text} />}
      </Drop>
    );
  });
  return <g>{slabs}</g>;
};

export const Cache: React.FC<PartProps> = ({ cx, cy, tag, start, frame, dark, sw }) => {
  const pal = palette(dark);
  const x0 = cx - 1.1;
  const y0 = cy - 1.1;
  const pins: React.JSX.Element[] = [];
  for (let i = 0; i < 6; i++) {
    const t = 0.3 + i * 0.32;
    pins.push(
      <g key={i} opacity={detailOpacity(frame, start, i)}>
        <Line3 a={[x0 + 2.2, y0 + t, Z0 + 0.15]} b={[x0 + 2.4, y0 + t, Z0 + 0.15]} stroke={pal.edge} sw={sw} />
        <Line3 a={[x0 + t, y0 + 2.2, Z0 + 0.15]} b={[x0 + t, y0 + 2.4, Z0 + 0.15]} stroke={pal.edge} sw={sw} />
      </g>,
    );
  }
  return (
    <g>
      <Drop frame={frame} start={start} k={0}>
        <Box x={x0} y={y0} z={Z0} w={2.2} d={2.2} h={0.3} pal={pal} sw={sw} />
        {pins}
      </Drop>
      <Drop frame={frame} start={start} k={1}>
        <Box x={cx - 0.7} y={cy - 0.7} z={Z0 + 0.3} w={1.4} d={1.4} h={0.14} pal={pal} sw={sw} radius={0.05} />
        <FaceText at={[cx, cy, Z0 + 0.44]} face="top" text={tag} fill={pal.text} size={22} />
      </Drop>
    </g>
  );
};

const Disc: React.FC<{ cx: number; cy: number; z: number; r: number; h: number; pal: Palette; sw: number; label?: string }> = ({
  cx,
  cy,
  z,
  r,
  h,
  pal,
  sw,
  label,
}) => {
  const top = ellipseAt(cx, cy, z + h, r);
  const hh = h * U;
  const body = `M${top.sx - top.rx} ${top.sy}L${top.sx - top.rx} ${top.sy + hh}A${top.rx} ${top.ry} 0 0 0 ${top.sx + top.rx} ${top.sy + hh}L${top.sx + top.rx} ${top.sy}Z`;
  return (
    <g>
      <path d={body} fill={pal.face} stroke={pal.edge} strokeWidth={sw} strokeLinejoin="round" />
      <ellipse cx={top.sx} cy={top.sy} rx={top.rx} ry={top.ry} fill={pal.face} stroke={pal.edge} strokeWidth={sw} />
      {label && <FaceText at={[cx, cy, z + h]} face="top" text={label} fill={pal.text} />}
    </g>
  );
};

export const Database: React.FC<PartProps> = ({ cx, cy, tag, start, frame, dark, sw }) => {
  const pal = palette(dark);
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <Drop key={i} frame={frame} start={start} k={i}>
          <Disc cx={cx} cy={cy} z={Z0 + i * 0.58} r={1} h={0.5} pal={pal} sw={sw} label={i === 2 ? tag : undefined} />
        </Drop>
      ))}
    </g>
  );
};

export const PART_COMPONENTS: Record<string, React.FC<PartProps>> = {
  laptop: Laptop,
  balancer: Balancer,
  server: Server,
  cache: Cache,
  database: Database,
};

export const pad = (cx: number, cy: number, draw: number, sw: number) => {
  const h = T.padSize / 2;
  return <Box x={cx - h} y={cy - h} z={0} w={T.padSize} d={T.padSize} h={T.padThickness} pal={palette(0)} sw={sw} radius={0.04} draw={draw} showInner />;
};

export { project };
