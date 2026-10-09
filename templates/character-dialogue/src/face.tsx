import React from "react";
import { Expression, MASCOT, PALETTE } from "./theme";

const OUT = PALETTE.outline;

/** 0 = closed, otherwise 0..1 openness of the mouth sprite. */
export type MouthAmount = number;

interface EyeProps {
  x: number;
  y: number;
  expression: Expression;
  blink: boolean;
}

export const Eye: React.FC<EyeProps> = ({ x, y, expression, blink }) => {
  if (expression === "happy") {
    return (
      <path
        d={`M${x - 15} ${y + 6} Q${x} ${y - 14} ${x + 15} ${y + 6}`}
        fill="none"
        stroke={OUT}
        strokeWidth={6}
        strokeLinecap="round"
      />
    );
  }
  if (blink) {
    return <line x1={x - 13} x2={x + 13} y1={y} y2={y} stroke={OUT} strokeWidth={5} strokeLinecap="round" />;
  }
  if (expression === "surprised") {
    return (
      <g>
        <circle cx={x} cy={y} r={21} fill={MASCOT.white} stroke={OUT} strokeWidth={4} />
        <circle cx={x} cy={y} r={7} fill={OUT} />
      </g>
    );
  }
  return (
    <g>
      <circle cx={x} cy={y} r={9} fill={OUT} />
      <circle cx={x - 3} cy={y - 3} r={3} fill={MASCOT.white} />
    </g>
  );
};

interface BrowsProps {
  cx: number;
  y: number;
  gap: number;
  expression: Expression;
  color: string;
}

/** Eyebrows: troubled slants the inner ends up, surprised lifts and arches them. */
export const Brows: React.FC<BrowsProps> = ({ cx, y, gap, expression, color }) => {
  if (expression === "troubled") {
    return (
      <g stroke={color} strokeWidth={6} strokeLinecap="round" fill="none">
        <path d={`M${cx - gap - 18} ${y + 8} L${cx - gap + 16} ${y - 8}`} />
        <path d={`M${cx + gap + 18} ${y + 8} L${cx + gap - 16} ${y - 8}`} />
      </g>
    );
  }
  if (expression === "surprised") {
    return (
      <g stroke={color} strokeWidth={6} strokeLinecap="round" fill="none">
        <path d={`M${cx - gap - 16} ${y - 4} Q${cx - gap} ${y - 20} ${cx - gap + 16} ${y - 4}`} />
        <path d={`M${cx + gap - 16} ${y - 4} Q${cx + gap} ${y - 20} ${cx + gap + 16} ${y - 4}`} />
      </g>
    );
  }
  return null;
};

interface MouthProps {
  cx: number;
  cy: number;
  expression: Expression;
  amount: MouthAmount;
}

/** Mouth sprite: closed = 4 px line (or expression curve), open = 36x28 ellipse family in #7A1F2B. */
export const Mouth: React.FC<MouthProps> = ({ cx, cy, expression, amount }) => {
  const stroke = { stroke: OUT, strokeWidth: 4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const open = amount > 0;
  const a = Math.max(0, Math.min(1, amount));
  switch (expression) {
    case "happy":
      return open ? (
        <path
          d={`M${cx - 26} ${cy - 2} Q${cx} ${cy - 6} ${cx + 26} ${cy - 2} Q${cx + 22} ${cy + 12 + 14 * a} ${cx} ${cy + 14 + 14 * a} Q${cx - 22} ${cy + 12 + 14 * a} ${cx - 26} ${cy - 2}Z`}
          fill={PALETTE.mouth}
          {...stroke}
        />
      ) : (
        <path d={`M${cx - 24} ${cy - 2} Q${cx} ${cy + 18} ${cx + 24} ${cy - 2}`} fill="none" {...stroke} />
      );
    case "surprised":
      return open ? (
        <ellipse cx={cx} cy={cy + 6} rx={15} ry={14 + 10 * a} fill={PALETTE.mouth} {...stroke} />
      ) : (
        <circle cx={cx} cy={cy + 4} r={8} fill="none" {...stroke} />
      );
    case "troubled":
      return open ? (
        <ellipse cx={cx} cy={cy + 4} rx={17} ry={6 + 8 * a} fill={PALETTE.mouth} {...stroke} />
      ) : (
        <path d={`M${cx - 22} ${cy + 6} Q${cx - 11} ${cy - 4} ${cx} ${cy + 6} T${cx + 22} ${cy + 6}`} fill="none" {...stroke} />
      );
    default:
      return open ? (
        <ellipse cx={cx} cy={cy + 2} rx={18} ry={7 + 7 * a} fill={PALETTE.mouth} {...stroke} />
      ) : (
        <line x1={cx - 20} x2={cx + 20} y1={cy + 2} y2={cy + 2} {...stroke} />
      );
  }
};
