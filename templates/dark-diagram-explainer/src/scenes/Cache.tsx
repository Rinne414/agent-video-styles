import React from "react";
import { User } from "lucide-react";
import { clamp01, pop, ramp } from "../anim";
import { LINKS, POS } from "../layout";
import { BigText, Packet, Pill } from "../Primitives";
import { Q } from "../story";
import { C, L } from "../theme";
import { Leg } from "./common";

const UT_ET = LINKS.userTEdgeT;
const ET_OR = LINKS.edgeTOrigin;
const PILL_Y = POS.edgeT[1] - 128;
const CROWD_COLS = 7;
const CROWD_ROWS = 2;
const CROWD_X0 = 150;
const CROWD_DX = 50;
const CROWD_Y0 = 205;
const CROWD_DY = 48;
const FLOW_PERIOD = 26;

const rev = (p: [[number, number], [number, number]]): [[number, number], [number, number]] => [p[1], p[0]];

const Crowd: React.FC<{ f: number }> = ({ f }) => {
  if (f < Q.million) return null;
  const vis = 1 - ramp(f, Q.crowdEnd, Infinity, 8);
  const items = [];
  for (let r = 0; r < CROWD_ROWS; r++) {
    for (let c = 0; c < CROWD_COLS; c++) {
      const idx = r * CROWD_COLS + c;
      const a = Math.min(1, pop(f, Q.million + idx * 2));
      items.push(
        <g key={idx} opacity={a}>
          <User x={CROWD_X0 + c * CROWD_DX - 16} y={CROWD_Y0 + r * CROWD_DY - 16} size={32} strokeWidth={2} color={C.text} />
        </g>,
      );
    }
  }
  const flowStart = Q.million + 30;
  const flows =
    f >= flowStart
      ? [0, 1, 2].map((k) => {
          const local = (f - flowStart - k * 9) % FLOW_PERIOD;
          if (f - flowStart - k * 9 < 0) return null;
          const t = clamp01(local / (FLOW_PERIOD - 6));
          const x0 = UT_ET[0][0];
          const x1 = UT_ET[1][0];
          return <Packet key={k} pos={[x0 + (x1 - x0) * t, UT_ET[0][1]]} color={C.result} r={8} opacity={t < 1 ? 1 : 0} />;
        })
      : null;
  return (
    <g opacity={vis}>
      {items}
      <BigText x={300} y={160} text={L.crowd} size={36} color={C.text} weight={600} opacity={pop(f, Q.million)} />
      {flows}
    </g>
  );
};

/** Miss, hit and crowd beats on the User - Edge - Origin row. */
export const CacheScene: React.FC<{ f: number }> = ({ f }) => {
  const missPill = ramp(f, Q.miss, Q.next, 6);
  const hitPill = ramp(f, Q.hit, Q.million, 6);
  const slow = ramp(f, Q.asks, Q.copy, 8);
  return (
    <g>
      {/* miss */}
      <Leg f={f} start={Q.first + 2} dur={16} from={UT_ET[0]} to={UT_ET[1]} color={C.primary} />
      <Pill x={POS.edgeT[0]} y={PILL_Y} text={L.miss} color={C.problem} scale={Math.min(1.1, pop(f, Q.miss)) * missPill} opacity={missPill} />
      <Leg f={f} start={Q.asks} dur={22} from={ET_OR[0]} to={ET_OR[1]} color={C.problem} />
      <Leg f={f} start={Q.once} dur={24} from={rev(ET_OR)[0]} to={rev(ET_OR)[1]} color={C.result} file />
      <BigText x={1215} y={405} text={L.before} size={40} color={C.problem} opacity={slow} />
      <Leg f={f} start={Q.copy + 2} dur={16} from={rev(UT_ET)[0]} to={rev(UT_ET)[1]} color={C.result} file />
      {/* hit */}
      <Leg f={f} start={Q.next + 2} dur={16} from={UT_ET[0]} to={UT_ET[1]} color={C.primary} />
      <Pill x={POS.edgeT[0]} y={PILL_Y} text={L.hit} color={C.result} scale={Math.min(1.1, pop(f, Q.hit)) * hitPill} opacity={hitPill} />
      <Leg f={f} start={Q.answers} dur={14} from={rev(UT_ET)[0]} to={rev(UT_ET)[1]} color={C.result} file />
      <Crowd f={f} />
      <BigText
        x={POS.origin[0]}
        y={POS.origin[1] + 130}
        text={L.originFetches}
        size={34}
        color={C.muted}
        weight={600}
        opacity={Math.min(1, pop(f, Q.barely)) * (1 - ramp(f, Q.milliseconds - 6, Infinity, 8))}
      />
    </g>
  );
};
