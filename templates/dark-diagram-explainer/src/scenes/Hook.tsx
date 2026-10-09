import React from "react";
import { Zap } from "lucide-react";
import { draw, pop, ramp } from "../anim";
import { POS } from "../layout";
import { BigText } from "../Primitives";
import { Q } from "../story";
import { seg } from "../timeline";
import { C, FONT, L } from "../theme";

const BAR_X = 580;
const BAR_W = 700;
const BAR_H = 22;
const FILL_FRAMES = 16;

const SpeedRow: React.FC<{ f: number; y: number; at: number; vis: number }> = ({ f, y, at, vis }) => {
  const p = draw(f, at + 6, FILL_FRAMES);
  const label = pop(f, at + 6 + FILL_FRAMES);
  return (
    <g opacity={vis}>
      <BigText x={BAR_X} y={y - 38} text={L.hookLoad} size={28} color={C.muted} weight={600} anchor="start" />
      <rect x={BAR_X} y={y - BAR_H / 2} width={BAR_W} height={BAR_H} rx={BAR_H / 2} fill="rgba(255,255,255,0.1)" />
      <rect x={BAR_X} y={y - BAR_H / 2} width={BAR_W * p} height={BAR_H} rx={BAR_H / 2} fill={C.result} />
      <g opacity={label} transform={`translate(${BAR_X + BAR_W + 70} ${y})`}>
        <Zap x={-86} y={-22} size={44} strokeWidth={2} color={C.result} />
        <text x={-30} y={16} fontFamily={FONT} fontWeight={700} fontSize={48} fill={C.result}>
          {L.hookTime}
        </text>
      </g>
    </g>
  );
};

/** Hook: two users, both pages load fast. */
export const HookScene: React.FC<{ f: number }> = ({ f }) => {
  const vis = 1 - ramp(f, seg("s2").start - 2, Infinity, 10);
  if (vis <= 0.005) return null;
  return (
    <g>
      <SpeedRow f={f} y={POS.userT[1]} at={Q.tokyo} vis={vis} />
      <SpeedRow f={f} y={POS.userP[1]} at={Q.paris} vis={vis} />
    </g>
  );
};
