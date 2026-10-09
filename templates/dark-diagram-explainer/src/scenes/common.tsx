import React from "react";
import { Easing } from "remotion";
import { clamp01, type Pt } from "../anim";
import { Packet, linePoint } from "../Primitives";

type LegProps = {
  f: number;
  start: number;
  dur: number;
  from: Pt;
  to: Pt;
  color: string;
  file?: boolean;
  r?: number;
};

/** One packet travelling a straight leg; visible only while in flight. */
export const Leg: React.FC<LegProps> = ({ f, start, dur, from, to, color, file, r }) => {
  if (f < start || f > start + dur + 3) return null;
  const t = Easing.inOut(Easing.quad)(clamp01((f - start) / dur));
  const o = 1 - clamp01((f - (start + dur)) / 3);
  return <Packet pos={linePoint(from, to, t)} color={color} opacity={o} file={file} r={r} />;
};
