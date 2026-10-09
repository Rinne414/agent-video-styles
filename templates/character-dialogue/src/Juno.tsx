import React from "react";
import { Brows, Eye, MouthAmount } from "./face";
import { CHARACTERS, Expression, LAYOUT, MASCOT, PALETTE } from "./theme";

const OUT = PALETTE.outline;
const BODY = CHARACTERS.juno.color;

const WING_ANGLE: Record<Expression, number> = { normal: 6, happy: 24, surprised: 18, troubled: -4 };

interface JunoProps {
  expression: Expression;
  blink: boolean;
  mouth: MouthAmount;
}

const st = { stroke: OUT, strokeWidth: 6, strokeLinejoin: "round" as const };
const DISC_R = 44;
const DISCS = [
  { cx: 104, cy: 172, inner: 1 },
  { cx: 196, cy: 172, inner: -1 },
];

/** Eyelid polygon: calm half-lid by default, slanted when troubled, closed on blink. */
const lidPoints = (cx: number, cy: number, inner: number, expression: Expression, blink: boolean): string | null => {
  const l = cx - DISC_R - 4;
  const r = cx + DISC_R + 4;
  const top = cy - DISC_R - 4;
  if (blink) return `${l},${top} ${r},${top} ${r},${cy + 6} ${l},${cy + 6}`;
  if (expression === "surprised" || expression === "happy") return null;
  if (expression === "troubled") {
    const innerY = cy - 30;
    const outerY = cy - 2;
    const yl = inner === 1 ? outerY : innerY;
    const yr = inner === 1 ? innerY : outerY;
    return `${l},${top} ${r},${top} ${r},${yr} ${l},${yl}`;
  }
  return `${l},${top} ${r},${top} ${r},${cy - 24} ${l},${cy - 24}`;
};

/** Juno: a calm owl. The beak is the mouth sprite: it parts and shows #7A1F2B inside when speaking. */
export const Juno: React.FC<JunoProps> = ({ expression, blink, mouth }) => {
  const wing = WING_ANGLE[expression];
  const open = mouth > 0;
  const lower = 232 + 16 * mouth;
  return (
    <svg width={LAYOUT.mascot.w} height={LAYOUT.mascot.h} viewBox="0 0 300 460" style={{ overflow: "visible" }}>
      <defs>
        {DISCS.map((d, i) => (
          <clipPath id={`juno-disc-${i}`} key={i}>
            <circle cx={d.cx} cy={d.cy} r={DISC_R} />
          </clipPath>
        ))}
      </defs>
      {/* feet */}
      {[112, 188].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={440} rx={30} ry={13} fill={MASCOT.beak} {...st} />
          <path d={`M${x - 10} 432 L${x - 10} 446 M${x + 10} 432 L${x + 10} 446`} stroke={OUT} strokeWidth={4} />
        </g>
      ))}
      {/* ear tufts */}
      <path d="M66 126 L54 46 L124 94 Z" fill={MASCOT.junoWing} {...st} />
      <path d="M234 126 L246 46 L176 94 Z" fill={MASCOT.junoWing} {...st} />
      {/* body and belly */}
      <ellipse cx={150} cy={252} rx={118} ry={180} fill={BODY} {...st} />
      <ellipse cx={150} cy={332} rx={76} ry={98} fill={MASCOT.junoBelly} stroke={OUT} strokeWidth={4} />
      {[290, 322, 354, 386].map((y, row) =>
        [-44, -14, 16, 46].map((dx) => (
          <path
            key={`${y}-${dx}`}
            d={`M${150 + dx - 12 + (row % 2) * 14} ${y} q12 12 24 0`}
            fill="none"
            stroke={MASCOT.junoWing}
            strokeWidth={3.5}
            strokeLinecap="round"
          />
        )),
      )}
      {/* wings */}
      <g transform={`translate(44 236) rotate(${wing})`}>
        <ellipse cx={-2} cy={74} rx={30} ry={88} fill={MASCOT.junoWing} {...st} />
      </g>
      <g transform={`translate(256 236) rotate(${-wing})`}>
        <ellipse cx={2} cy={74} rx={30} ry={88} fill={MASCOT.junoWing} {...st} />
      </g>
      {/* eyes */}
      {DISCS.map((d, i) => {
        const lid = lidPoints(d.cx, d.cy, d.inner, expression, blink);
        return (
          <g key={i}>
            <circle cx={d.cx} cy={d.cy} r={DISC_R} fill={MASCOT.junoEye} stroke={OUT} strokeWidth={5} />
            {!blink && <Eye x={d.cx} y={d.cy + 2} expression={expression} blink={false} />}
            {expression === "happy" && blink && <Eye x={d.cx} y={d.cy + 2} expression={expression} blink={false} />}
            {lid && (
              <g clipPath={`url(#juno-disc-${i})`}>
                <polygon points={lid} fill={BODY} stroke={OUT} strokeWidth={4} strokeLinejoin="round" />
              </g>
            )}
            <circle cx={d.cx} cy={d.cy} r={DISC_R} fill="none" stroke={OUT} strokeWidth={5} />
          </g>
        );
      })}
      <Brows cx={150} y={116} gap={46} expression={expression === "surprised" ? "surprised" : "normal"} color={OUT} />
      {/* beak = mouth sprite */}
      {open ? (
        <g>
          <ellipse cx={150} cy={lower - 4} rx={17} ry={6 + 10 * mouth} fill={PALETTE.mouth} stroke={OUT} strokeWidth={4} />
          <path d="M134 202 L166 202 L150 226 Z" fill={MASCOT.beak} {...st} strokeWidth={5} />
          <path d={`M138 ${lower} L162 ${lower} L150 ${lower + 18} Z`} fill={MASCOT.beak} {...st} strokeWidth={5} />
        </g>
      ) : (
        <path d="M136 204 L164 204 L150 236 Z" fill={MASCOT.beak} {...st} strokeWidth={5} />
      )}
    </svg>
  );
};
