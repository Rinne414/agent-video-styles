import React from "react";
import type { LucideIcon } from "lucide-react";
import { FileText } from "lucide-react";
import { cubicAt, lerp, type Pt } from "./anim";
import { C, FONT, T } from "./theme";

export const Defs: React.FC = () => (
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={T.glowBlur} />
    </filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation={6} />
    </filter>
  </defs>
);

type NodeProps = {
  center: Pt;
  Icon: LucideIcon;
  label: string;
  /** 0 = not yet visible, 1 = settled (spring output, may overshoot). */
  appear: number;
  /** 1 = active (accent stroke and glow), 0 = dimmed. */
  focus: number;
  accent: string;
  /** Overall visibility multiplier (fades the node out of the scene). */
  vis?: number;
  cache?: { state: "empty" | "full"; pop: number; color: string };
};

export const Node: React.FC<NodeProps> = ({ center, Icon, label, appear, focus, accent, vis = 1, cache }) => {
  const [cx, cy] = center;
  const a = Math.min(1, Math.max(0, appear));
  const scale = lerp(0.85, 1, appear);
  const opacity = a * vis * lerp(T.dimLevel, 1, focus);
  if (opacity <= 0.005) return null;
  const labelA = Math.max(0, Math.min(1, (appear - 0.55) / 0.45));
  const iconX = cache ? cx - 52 : cx;
  return (
    <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      <rect
        x={cx - T.nodeW / 2}
        y={cy - T.nodeH / 2}
        width={T.nodeW}
        height={T.nodeH}
        rx={T.nodeRadius}
        fill={accent}
        opacity={T.glowAlpha * focus}
        filter="url(#glow)"
      />
      <rect
        x={cx - T.nodeW / 2}
        y={cy - T.nodeH / 2}
        width={T.nodeW}
        height={T.nodeH}
        rx={T.nodeRadius}
        fill={C.node}
        stroke={focus > 0.5 ? accent : T.nodeStroke}
        strokeWidth={focus > 0.5 ? 3 : 2}
      />
      <Icon
        x={iconX - T.iconSize / 2}
        y={cy - 54}
        size={T.iconSize}
        strokeWidth={T.iconStroke}
        color={focus > 0.5 ? accent : C.text}
      />
      {cache ? <CacheSlot cx={cx + 56} cy={cy - 26} state={cache.state} pop={cache.pop} color={cache.color} /> : null}
      <text
        x={cx}
        y={cy + 52}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={600}
        fontSize={T.labelSize}
        fill={C.text}
        opacity={labelA}
      >
        {label}
      </text>
    </g>
  );
};

const CacheSlot: React.FC<{ cx: number; cy: number; state: "empty" | "full"; pop: number; color: string }> = ({
  cx,
  cy,
  state,
  pop,
  color,
}) => {
  const full = state === "full";
  const s = full ? lerp(0.6, 1, Math.min(1.2, pop)) : 1;
  return (
    <g>
      <rect
        x={cx - 36}
        y={cy - 30}
        width={72}
        height={60}
        rx={10}
        fill={full ? color : "none"}
        fillOpacity={full ? 0.18 : 0}
        stroke={full ? color : "rgba(255,255,255,0.35)"}
        strokeWidth={2}
        strokeDasharray={full ? undefined : "6 6"}
      />
      <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})`}>
        <FileText x={cx - 18} y={cy - 18} size={36} strokeWidth={2} color={full ? color : "rgba(255,255,255,0.35)"} />
      </g>
    </g>
  );
};

type LinkProps = {
  from: Pt;
  to: Pt;
  progress: number;
  color: string;
  opacity?: number;
  dashed?: boolean;
  width?: number;
};

/** Straight arrow whose length grows with `progress`, round caps, 10 px head. */
export const Link: React.FC<LinkProps> = ({ from, to, progress, color, opacity = 1, dashed, width = T.arrowStroke }) => {
  if (progress <= 0.001 || opacity <= 0.005) return null;
  const x = lerp(from[0], to[0], progress);
  const y = lerp(from[1], to[1], progress);
  const ang = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const head = 12;
  const showHead = progress > 0.97;
  const h1: Pt = [x - head * Math.cos(ang - 0.5), y - head * Math.sin(ang - 0.5)];
  const h2: Pt = [x - head * Math.cos(ang + 0.5), y - head * Math.sin(ang + 0.5)];
  return (
    <g opacity={opacity} stroke={color} strokeWidth={width} strokeLinecap="round" fill="none">
      <line x1={from[0]} y1={from[1]} x2={x} y2={y} strokeDasharray={dashed ? "2 10" : undefined} />
      {showHead ? <polyline points={`${h1.join(",")} ${x},${y} ${h2.join(",")}`} strokeLinejoin="round" /> : null}
    </g>
  );
};

/** Cubic path drawn with stroke-dashoffset. */
export const ArcPath: React.FC<{ d: string; progress: number; color: string; opacity?: number }> = ({
  d,
  progress,
  color,
  opacity = 1,
}) => {
  if (progress <= 0.001 || opacity <= 0.005) return null;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={T.arrowStroke}
      strokeLinecap="round"
      opacity={opacity}
      pathLength={1}
      strokeDasharray={1}
      strokeDashoffset={1 - progress}
    />
  );
};

type PacketProps = { pos: Pt; color: string; opacity?: number; r?: number; file?: boolean };

export const Packet: React.FC<PacketProps> = ({ pos, color, opacity = 1, r = 11, file }) => {
  if (opacity <= 0.005) return null;
  return (
    <g opacity={opacity}>
      <circle cx={pos[0]} cy={pos[1]} r={r * 2.2} fill={color} opacity={0.35} filter="url(#soft)" />
      {file ? (
        <g>
          <rect x={pos[0] - 15} y={pos[1] - 18} width={30} height={36} rx={5} fill={C.node} stroke={color} strokeWidth={2.5} />
          <line x1={pos[0] - 7} y1={pos[1] - 5} x2={pos[0] + 7} y2={pos[1] - 5} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={pos[0] - 7} y1={pos[1] + 4} x2={pos[0] + 7} y2={pos[1] + 4} stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      ) : (
        <circle cx={pos[0]} cy={pos[1]} r={r} fill={color} />
      )}
    </g>
  );
};

export const linePoint = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
export const arcPoint = (arc: [Pt, Pt, Pt, Pt], t: number): Pt => cubicAt(arc[0], arc[1], arc[2], arc[3], t);

type PillProps = {
  x: number;
  y: number;
  text: string;
  color: string;
  scale?: number;
  opacity?: number;
  size?: number;
  Icon?: LucideIcon;
};

/** Rounded status pill (MISS / HIT / LATENCY). */
export const Pill: React.FC<PillProps> = ({ x, y, text, color, scale = 1, opacity = 1, size = 30, Icon }) => {
  if (opacity <= 0.005 || scale <= 0.01) return null;
  const textW = text.length * size * 0.68;
  const iconW = Icon ? size + 18 : 0;
  const w = textW + 56 + iconW;
  const h = size + 28;
  return (
    <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill="#0A0A0A" />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={color} fillOpacity={0.16} stroke={color} strokeWidth={3} />
      {Icon ? <Icon x={-w / 2 + 24} y={-size / 2} size={size} strokeWidth={2.2} color={color} /> : null}
      <text
        x={iconW / 2}
        y={size * 0.36}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={700}
        fontSize={size}
        fill={color}
        letterSpacing={2}
      >
        {text}
      </text>
    </g>
  );
};

type BigTextProps = {
  x: number;
  y: number;
  text: string;
  size: number;
  color: string;
  opacity?: number;
  weight?: number;
  anchor?: "middle" | "start" | "end";
  spacing?: number;
};

export const BigText: React.FC<BigTextProps> = ({ x, y, text, size, color, opacity = 1, weight = 700, anchor = "middle", spacing = 0 }) =>
  opacity <= 0.005 ? null : (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontFamily={FONT}
      fontWeight={weight}
      fontSize={size}
      fill={color}
      opacity={opacity}
      letterSpacing={spacing}
    >
      {text}
    </text>
  );
