import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY, LAYOUT, type CardSpec } from "./theme";

const W = LAYOUT.cardWidth;
const ART_H = 330;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], clamp);

const stroke = (color: string, w = 10) => ({
  stroke: color,
  strokeWidth: w,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
});

const Shell: React.FC<{ spec: CardSpec; children: React.ReactNode }> = ({ spec, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 14, stiffness: 220 }, durationInFrames: 14 });
  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - W) / 2,
        top: LAYOUT.cardTop,
        width: W,
        height: LAYOUT.cardHeight,
        borderRadius: LAYOUT.cardRadius,
        background: COLORS.glass,
        border: `2px solid ${COLORS.glassBorder}`,
        boxShadow: "0 24px 60px rgba(0,0,0,0.35)",
        fontFamily: FONT_FAMILY,
        scale: String(interpolate(enter, [0, 1], [0.9, 1])),
        opacity: ramp(frame, 0, 5),
        translate: `0 ${interpolate(enter, [0, 1], [40, 0])}px`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 28, padding: "36px 52px 0" }}>
        <span style={{ fontSize: 190, fontWeight: 900, lineHeight: 1, color: COLORS.highlight }}>
          {spec.big}
          {spec.unit ? <span style={{ fontSize: 96 }}>{spec.unit}</span> : null}
        </span>
        <span style={{ fontSize: 68, fontWeight: 900, color: COLORS.text }}>{spec.label}</span>
      </div>
      <svg width={W} height={ART_H} viewBox={`0 0 ${W} ${ART_H}`} style={{ position: "absolute", left: 0, bottom: 8 }}>
        {children}
      </svg>
    </div>
  );
};

const DAY_LABELS = ["第一天", "第二天", "第三天"];

// Memory bar draining toward a small remainder.
const HookArt: React.FC<{ f: number }> = ({ f }) => {
  const level = interpolate(f, [10, 90], [1, 0.3], clamp);
  return (
    <g>
      <rect x={80} y={130} width={720} height={44} rx={22} fill="rgba(255,255,255,0.14)" />
      <rect x={80} y={130} width={720 * level} height={44} rx={22} fill={COLORS.highlight} />
      <text x={80} y={110} fill={COLORS.text} fontSize={40} fontWeight={900} fontFamily={FONT_FAMILY}>记忆</text>
      <text x={800} y={110} textAnchor="end" fill={COLORS.highlight} fontSize={44} fontWeight={900} fontFamily={FONT_FAMILY}>
        {Math.round(level * 100)}%
      </text>
      {DAY_LABELS.map((label, i) => (
        <g key={label} opacity={ramp(f, 20 + i * 18, 30 + i * 18)}>
          <rect x={80 + i * 250} y={220} width={220} height={70} rx={35} {...stroke(COLORS.glassBorder, 4)} />
          <text x={190 + i * 250} y={269} textAnchor="middle" fill={COLORS.text} fontSize={38} fontWeight={900} fontFamily={FONT_FAMILY}>
            {label}
          </text>
        </g>
      ))}
    </g>
  );
};

// Forgetting curve that resets at each review, with widening intervals.
const SPACED_POINTS = [0, 0.3, 0.62];
const CURVE_X0 = 70;
const CURVE_X1 = 810;
const CURVE_TOP = 40;
const CURVE_BASE = 215;
const CURVE_DRAW_START = 8;
const CURVE_DRAW_END = 150;

const curvePath = (): { d: string; marks: { x: number; y: number }[] } => {
  const pts: string[] = [];
  const marks: { x: number; y: number }[] = [];
  const ends = [...SPACED_POINTS.slice(1), 1];
  SPACED_POINTS.forEach((s, k) => {
    const decay = 3.2 - k * 0.9;
    const xa = CURVE_X0 + s * (CURVE_X1 - CURVE_X0);
    const xb = CURVE_X0 + ends[k] * (CURVE_X1 - CURVE_X0);
    marks.push({ x: xa, y: CURVE_TOP });
    for (let i = 0; i <= 24; i++) {
      const u = i / 24;
      const x = xa + u * (xb - xa);
      const y = CURVE_TOP + (CURVE_BASE - CURVE_TOP) * (1 - Math.exp(-decay * u)) * 0.9;
      pts.push(`${pts.length === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  });
  return { d: pts.join(" "), marks };
};

const SpacedArt: React.FC<{ f: number; marksText: string[] }> = ({ f, marksText }) => {
  const { fps } = useVideoConfig();
  const { d, marks } = curvePath();
  const draw = ramp(f, CURVE_DRAW_START, CURVE_DRAW_END);
  return (
    <g>
      <line x1={CURVE_X0} y1={240} x2={CURVE_X1} y2={240} {...stroke("rgba(255,255,255,0.3)", 4)} />
      <path d={d} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} {...stroke(COLORS.highlight, 10)} />
      {marks.map((m, i) => {
        const at = CURVE_DRAW_START + SPACED_POINTS[i] * (CURVE_DRAW_END - CURVE_DRAW_START);
        const pop = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 220 }, durationInFrames: 12 });
        return (
          <g key={i} transform={`translate(${m.x} ${m.y})`}>
            <circle r={interpolate(pop, [0, 1], [0, 18])} fill={COLORS.text} stroke="#000" strokeWidth={4} />
            <text y={248} textAnchor="middle" fill={COLORS.text} fontSize={38} fontWeight={900} fontFamily={FONT_FAMILY} opacity={pop}>
              {marksText[i]}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// A book that closes, then a speech bubble that fills with recalled points.
const RecallArt: React.FC<{ f: number }> = ({ f }) => {
  const close = ramp(f, 6, 30);
  const open = 1 - close;
  const pageW = 120 * open + 4;
  return (
    <g>
      <g transform="translate(210 170)">
        <rect x={-pageW - 10} y={-100} width={pageW} height={200} rx={10} fill={COLORS.text} opacity={open} />
        <rect x={10} y={-100} width={pageW} height={200} rx={10} fill={COLORS.text} opacity={open} />
        <rect x={-70} y={-104} width={140} height={208} rx={14} fill="#5B3BFF" opacity={close} stroke="#000" strokeWidth={5} />
        <rect x={-70} y={-104} width={20} height={208} rx={8} fill="#3D22C8" opacity={close} />
        <rect x={-30} y={-60} width={70} height={14} rx={7} fill={COLORS.highlight} opacity={close} />
      </g>
      <g opacity={ramp(f, 34, 42)} transform={`translate(${interpolate(ramp(f, 34, 48), [0, 1], [30, 0])} 0)`}>
        <rect x={380} y={40} width={430} height={230} rx={36} fill="rgba(255,255,255,0.96)" />
        <path d="M392 190 L350 236 L430 250 Z" fill="rgba(255,255,255,0.96)" />
        {[0, 1, 2].map((i) => {
          const p = ramp(f, 50 + i * 22, 66 + i * 22);
          const ck = ramp(f, 66 + i * 22, 76 + i * 22);
          return (
            <g key={i} transform={`translate(0 ${i * 62})`}>
              <rect x={440} y={78} width={230 * p} height={18} rx={9} fill="#2A2A3C" />
              <path d="M720 88 L736 104 L764 70" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ck} {...stroke("#12B76A", 10)} />
            </g>
          );
        })}
      </g>
    </g>
  );
};

const Person: React.FC<{ x: number; color: string }> = ({ x, color }) => (
  <g transform={`translate(${x} 0)`}>
    <circle cx={0} cy={140} r={44} fill={color} stroke="#000" strokeWidth={5} />
    <path d="M-80 300 C-80 215 80 215 80 300 Z" fill={color} stroke="#000" strokeWidth={5} />
  </g>
);

// Teacher (left) sends ideas to a learner (right); the bulb lights up.
const TeachArt: React.FC<{ f: number }> = ({ f }) => {
  const bulb = ramp(f, 70, 84);
  return (
    <g>
      <Person x={150} color={COLORS.highlight} />
      <Person x={730} color={COLORS.text} />
      <g opacity={ramp(f, 6, 14)}>
        <rect x={110} y={14} width={150} height={70} rx={24} fill={COLORS.text} />
        <path d="M150 80 L140 112 L180 82 Z" fill={COLORS.text} />
        <rect x={134} y={36} width={102} height={12} rx={6} fill="#2A2A3C" />
        <rect x={134} y={56} width={64} height={12} rx={6} fill="#2A2A3C" />
      </g>
      {[0, 1, 2, 3].map((i) => {
        const period = 56;
        const u = ((((f - 18 - i * 14) % period) + period) % period) / period;
        const on = f > 18 + i * 14;
        return (
          <circle key={i} cx={270 + u * 360} cy={190 - Math.sin(u * Math.PI) * 50} r={12} fill={COLORS.highlight} opacity={on ? Math.sin(u * Math.PI) : 0} />
        );
      })}
      <g transform="translate(730 52)">
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <line key={i} x1={Math.cos(a) * 42} y1={Math.sin(a) * 42} x2={Math.cos(a) * 66} y2={Math.sin(a) * 66} {...stroke(COLORS.highlight, 7)} opacity={bulb} />
          );
        })}
        <circle r={interpolate(bulb, [0, 1], [24, 32])} fill={bulb > 0.5 ? COLORS.highlight : "rgba(255,255,255,0.3)"} stroke="#000" strokeWidth={5} />
        <rect x={-14} y={30} width={28} height={14} rx={4} fill={COLORS.text} />
      </g>
    </g>
  );
};

// Follow button pulse beside a notebook whose lines write themselves.
const CtaArt: React.FC<{ f: number }> = ({ f }) => {
  const pulse = 1 + 0.05 * Math.sin(f / 4);
  return (
    <g>
      <g transform={`translate(190 160) scale(${pulse})`}>
        <rect x={-130} y={-62} width={260} height={124} rx={62} fill={COLORS.highlight} stroke="#000" strokeWidth={6} />
        <text y={26} textAnchor="middle" fontSize={64} fontWeight={900} fill="#000" fontFamily={FONT_FAMILY}>+关注</text>
      </g>
      <g transform="translate(520 30)">
        <rect width={290} height={270} rx={22} fill={COLORS.text} stroke="#000" strokeWidth={5} />
        <rect width={46} height={270} rx={14} fill="#5B3BFF" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={80} y={50 + i * 52} width={170 * ramp(f, 10 + i * 14, 26 + i * 14)} height={16} rx={8} fill="#2A2A3C" />
        ))}
      </g>
    </g>
  );
};

export const Card: React.FC<{ spec: CardSpec }> = ({ spec }) => {
  const f = useCurrentFrame();
  const art = {
    hook: <HookArt f={f} />,
    spaced: <SpacedArt f={f} marksText={spec.marks ?? []} />,
    recall: <RecallArt f={f} />,
    teach: <TeachArt f={f} />,
    cta: <CtaArt f={f} />,
  }[spec.type];
  return <Shell spec={spec}>{art}</Shell>;
};
