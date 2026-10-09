import React, { useMemo } from "react";
import { AbsoluteFill, random } from "remotion";
import { HEIGHT, LAYOUT, PALETTE, WIDTH } from "./theme";

const DUST_COUNT = 700;
const SMUDGES = 7;

/** Static blackboard: chalk dust noise, eraser smudges, board outline, chalk tray and wooden frame. */
export const Blackboard: React.FC = () => {
  const dust = useMemo(
    () =>
      Array.from({ length: DUST_COUNT }, (_, i) => ({
        x: random(`dust-x-${i}`) * WIDTH,
        y: random(`dust-y-${i}`) * HEIGHT,
        r: 0.7 + random(`dust-r-${i}`) * 1.6,
        o: 0.03 + random(`dust-o-${i}`) * 0.05,
      })),
    [],
  );
  const smudges = useMemo(
    () =>
      Array.from({ length: SMUDGES }, (_, i) => ({
        x: 120 + random(`sm-x-${i}`) * 1500,
        y: 80 + random(`sm-y-${i}`) * 700,
        rx: 120 + random(`sm-rx-${i}`) * 220,
        ry: 30 + random(`sm-ry-${i}`) * 60,
        rot: -25 + random(`sm-rot-${i}`) * 50,
      })),
    [],
  );
  const f = LAYOUT.frame;
  const b = LAYOUT.board;
  return (
    <AbsoluteFill style={{ background: PALETTE.board }}>
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <filter id="smudge-blur">
            <feGaussianBlur stdDeviation="28" />
          </filter>
          <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
            <stop offset="60%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.35" />
          </radialGradient>
        </defs>
        <g filter="url(#smudge-blur)">
          {smudges.map((s, i) => (
            <ellipse key={i} cx={s.x} cy={s.y} rx={s.rx} ry={s.ry} fill="#F2F2EA" opacity={0.045} transform={`rotate(${s.rot} ${s.x} ${s.y})`} />
          ))}
        </g>
        {dust.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#F2F2EA" opacity={d.o} />
        ))}
        <rect width={WIDTH} height={HEIGHT} fill="url(#vignette)" />
        <rect x={b.x - 14} y={b.y - 14} width={b.w + 28} height={b.h + 28} rx={14} fill="none" stroke="#F2F2EA" strokeOpacity={0.16} strokeWidth={2} />
        {/* chalk tray the mascots stand on */}
        <rect x={f} y={LAYOUT.trayY} width={WIDTH - 2 * f} height={16} fill="#7C5230" />
        <rect x={f} y={LAYOUT.trayY} width={WIDTH - 2 * f} height={4} fill="#9A6B40" />
        {/* wooden frame */}
        <g fill={PALETTE.frame}>
          <rect x={0} y={0} width={WIDTH} height={f} />
          <rect x={0} y={HEIGHT - f} width={WIDTH} height={f} />
          <rect x={0} y={0} width={f} height={HEIGHT} />
          <rect x={WIDTH - f} y={0} width={f} height={HEIGHT} />
        </g>
        <rect x={f} y={f} width={WIDTH - 2 * f} height={HEIGHT - 2 * f} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={4} />
        <rect x={2} y={2} width={WIDTH - 4} height={HEIGHT - 4} fill="none" stroke="#8B5E34" strokeWidth={4} />
      </svg>
    </AbsoluteFill>
  );
};
