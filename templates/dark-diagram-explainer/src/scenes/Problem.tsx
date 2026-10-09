import React from "react";
import { Easing } from "remotion";
import { Clock } from "lucide-react";
import { clamp01, mix, pop, ramp } from "../anim";
import { ARC, POS } from "../layout";
import { BigText, Packet, Pill, arcPoint } from "../Primitives";
import { Q } from "../story";
import { C, L } from "../theme";

const TRIP_HALF = 46;
const BURST_HALF = 34;
const BURST_COUNT = 6;
const BURST_STEP = 11;

/** A packet out along the arc and back again. */
const Trip: React.FC<{ f: number; start: number; half: number; r?: number }> = ({ f, start, half, r }) => {
  if (f < start || f > start + 2 * half + 3) return null;
  const u = (f - start) / half;
  const e = u <= 1 ? Easing.inOut(Easing.quad)(clamp01(u)) : 1 - Easing.inOut(Easing.quad)(clamp01(u - 1));
  const o = 1 - clamp01((f - (start + 2 * half)) / 3);
  return <Packet pos={arcPoint(ARC, e)} color={C.problem} opacity={o} r={r} />;
};

/** Setup beat: the request travels the long arc; latency and the round-trip timer. */
export const ProblemScene: React.FC<{ f: number }> = ({ f }) => {
  const vis = 1 - ramp(f, Q.fixes, Infinity, 10);
  if (vis <= 0.005 || f < Q.request - 2) return null;
  const ms = Math.round(mix(f, [[Q.rttStart, 0], [Q.rttEnd, 200]]));
  const counterOn = ramp(f, Q.rttStart, Infinity, 8);
  const burst = Array.from({ length: BURST_COUNT }, (_, k) => Q.dozens + k * BURST_STEP);
  return (
    <g opacity={vis}>
      <Trip f={f} start={Q.request} half={TRIP_HALF} />
      <Trip f={f} start={Q.rttStart + 6} half={TRIP_HALF} />
      {burst.map((s) => (
        <Trip key={s} f={f} start={s} half={BURST_HALF} r={9} />
      ))}
      <BigText x={930} y={278} text={L.distance} size={40} color={C.problem} weight={600} opacity={pop(f, Q.miles)} />
      <BigText x={POS.origin[0]} y={POS.origin[1] + 122} text={L.originPlace} size={32} color={C.muted} weight={600} opacity={pop(f, Q.virginia)} />
      <Pill x={930} y={185} text={L.latency} color={C.problem} Icon={Clock} scale={pop(f, Q.latency)} />
      <g opacity={counterOn}>
        <BigText x={930} y={455} text={String(ms)} size={170} color={C.problem} />
        <BigText x={930} y={520} text={L.rtt} size={36} color={C.muted} weight={600} />
      </g>
    </g>
  );
};
