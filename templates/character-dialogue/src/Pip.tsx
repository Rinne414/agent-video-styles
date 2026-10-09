import React from "react";
import { Brows, Eye, Mouth, MouthAmount } from "./face";
import { CHARACTERS, Expression, LAYOUT, MASCOT, PALETTE } from "./theme";

const OUT = PALETTE.outline;
const BODY = CHARACTERS.pip.color;

const ARM_ANGLE: Record<Expression, number> = { normal: 16, happy: 150, surprised: 112, troubled: 6 };

interface PipProps {
  expression: Expression;
  blink: boolean;
  mouth: MouthAmount;
  antennaSway: number;
}

const st = { stroke: OUT, strokeWidth: 6, strokeLinejoin: "round" as const };

/** Pip: a curious round robot. Original art, drawn in SVG. viewBox 300 x 460, feet at y=450. */
export const Pip: React.FC<PipProps> = ({ expression, blink, mouth, antennaSway }) => {
  const arm = ARM_ANGLE[expression];
  return (
    <svg width={LAYOUT.mascot.w} height={LAYOUT.mascot.h} viewBox="0 0 300 460" style={{ overflow: "visible" }}>
      {/* legs and feet */}
      <rect x={104} y={392} width={32} height={42} rx={10} fill={MASCOT.pipDark} {...st} />
      <rect x={164} y={392} width={32} height={42} rx={10} fill={MASCOT.pipDark} {...st} />
      <ellipse cx={110} cy={440} rx={32} ry={14} fill={MASCOT.pipDark} {...st} />
      <ellipse cx={190} cy={440} rx={32} ry={14} fill={MASCOT.pipDark} {...st} />
      {/* arms, behind the body */}
      <g transform={`translate(90 292) rotate(${arm})`}>
        <rect x={-14} y={0} width={28} height={84} rx={14} fill={BODY} {...st} />
        <circle cx={0} cy={86} r={15} fill={MASCOT.pipLight} {...st} />
      </g>
      <g transform={`translate(210 292) rotate(${-arm})`}>
        <rect x={-14} y={0} width={28} height={84} rx={14} fill={BODY} {...st} />
        <circle cx={0} cy={86} r={15} fill={MASCOT.pipLight} {...st} />
      </g>
      {/* body capsule */}
      <rect x={82} y={246} width={136} height={168} rx={62} fill={BODY} {...st} />
      <ellipse cx={150} cy={332} rx={40} ry={34} fill={MASCOT.pipFace} stroke={OUT} strokeWidth={4} />
      <circle cx={150} cy={332} r={11} fill={PALETTE.chalkYellow} stroke={OUT} strokeWidth={3} />
      {/* antenna */}
      <g transform={`rotate(${antennaSway} 150 44)`}>
        <line x1={150} y1={44} x2={150} y2={16} stroke={OUT} strokeWidth={6} strokeLinecap="round" />
        <circle cx={150} cy={14} r={12} fill={PALETTE.chalkYellow} stroke={OUT} strokeWidth={5} />
      </g>
      {/* head */}
      <rect x={26} y={118} width={22} height={64} rx={10} fill={MASCOT.pipDark} {...st} />
      <rect x={252} y={118} width={22} height={64} rx={10} fill={MASCOT.pipDark} {...st} />
      <circle cx={150} cy={152} r={114} fill={BODY} {...st} />
      <ellipse cx={150} cy={154} rx={92} ry={70} fill={MASCOT.pipFace} stroke={OUT} strokeWidth={4} />
      {expression === "happy" && (
        <g fill={BODY} opacity={0.55}>
          <circle cx={86} cy={172} r={13} />
          <circle cx={214} cy={172} r={13} />
        </g>
      )}
      <Eye x={112} y={140} expression={expression} blink={blink} />
      <Eye x={188} y={140} expression={expression} blink={blink} />
      <Brows cx={150} y={108} gap={38} expression={expression} color={OUT} />
      <Mouth cx={150} cy={184} expression={expression} amount={mouth} />
    </svg>
  );
};
