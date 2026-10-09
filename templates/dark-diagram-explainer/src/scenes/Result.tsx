import React from "react";
import { Check } from "lucide-react";
import { draw, pop, ramp } from "../anim";
import { LINKS, POS } from "../layout";
import type { Pt } from "../anim";
import { BigText } from "../Primitives";
import { Q } from "../story";
import { C, FONT, L } from "../theme";
import { Leg } from "./common";

const BAR_W = 220;
const BAR_H = 16;
const LOOP_FRAMES = 44;

const Tick: React.FC<{ x: number; y: number; scale: number }> = ({ x, y, scale }) =>
  scale <= 0.01 ? null : (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle r={26} fill={C.result} />
      <Check x={-16} y={-16} size={32} strokeWidth={3.5} color="#0A0A0A" />
    </g>
  );

/** A request goes to the edge and the file comes straight back, forever. */
const LoopRow: React.FC<{ f: number; row: [Pt, Pt]; start: number }> = ({ f, row, start }) => {
  const age = f - start;
  if (age < 0) return null;
  const half = LOOP_FRAMES / 2;
  const cyc = age % LOOP_FRAMES;
  return cyc < half ? (
    <Leg f={cyc} start={0} dur={half - 2} from={row[0]} to={row[1]} color={C.primary} r={9} />
  ) : (
    <Leg f={cyc - half} start={0} dur={half - 2} from={row[1]} to={row[0]} color={C.result} file />
  );
};

/** Payoff beat: 200 ms -> 20 ms, origin load drops, both users get the fast version. */
export const ResultScene: React.FC<{ f: number }> = ({ f }) => {
  if (f < Q.milliseconds - 4) return null;
  const compare = ramp(f, Q.milliseconds, Infinity, 10);
  const afterPop = Math.min(1, pop(f, Q.milliseconds + 12));
  const loadOn = ramp(f, Q.traffic - 40, Infinity, 10);
  const loadP = draw(f, Q.far2, 45);
  const loadPct = 1 - 0.88 * loadP;
  const green = ramp(f, Q.far2 + 38, Infinity, 8);
  return (
    <g>
      <g opacity={compare}>
        <g opacity={1 - 0.55 * afterPop}>
          <BigText x={640} y={240} text={L.before} size={100} color={C.problem} />
          <line x1={470} y1={205} x2={810} y2={205} stroke={C.problem} strokeWidth={6} strokeLinecap="round" opacity={afterPop} />
        </g>
        <text x={930} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill={C.muted} opacity={afterPop}>
          {"→"}
        </text>
        <g transform={`translate(1230 240) scale(${0.85 + 0.15 * afterPop}) translate(-1230 -240)`} opacity={afterPop}>
          <BigText x={1230} y={240} text={L.after} size={124} color={C.result} />
        </g>
      </g>
      <g opacity={loadOn}>
        <BigText x={POS.origin[0]} y={POS.origin[1] + 118} text={L.loadBefore} size={30} color={C.muted} weight={600} />
        <rect x={POS.origin[0] - BAR_W / 2} y={POS.origin[1] + 134} width={BAR_W} height={BAR_H} rx={BAR_H / 2} fill="rgba(255,255,255,0.1)" />
        <rect
          x={POS.origin[0] - BAR_W / 2}
          y={POS.origin[1] + 134}
          width={BAR_W * loadPct}
          height={BAR_H}
          rx={BAR_H / 2}
          fill={green > 0.5 ? C.result : C.problem}
        />
      </g>
      <LoopRow f={f} row={LINKS.userTEdgeT} start={Q.milliseconds + 20} />
      <LoopRow f={f} row={LINKS.userPEdgeP} start={Q.milliseconds + 42} />
      <Tick x={POS.userT[0] + 125} y={POS.userT[1] - 75} scale={Math.min(1.15, pop(f, Q.everyone))} />
      <Tick x={POS.userP[0] + 125} y={POS.userP[1] - 75} scale={Math.min(1.15, pop(f, Q.everyone + 8))} />
    </g>
  );
};
