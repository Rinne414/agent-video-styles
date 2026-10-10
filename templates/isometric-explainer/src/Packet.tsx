import React from "react";
import { Box, ellipseAt, palette } from "./iso";
import { LEGS, packetAt } from "./timeline";
import { C, T, project } from "./theme";

const PK = C.packet;

export const Packet: React.FC<{ frame: number; sw: number }> = ({ frame, sw }) => {
  const st = packetAt(frame);
  if (!st) return null;
  const s = PK.size;
  const age = frame - LEGS[st.legIndex].t0;
  // Hairline rings pulsing outward on the ground stand in for a glow (the style forbids blur).
  const rings = [0, 1].map((i) => {
    const ph = ((age + i * 12) % 24) / 24;
    const e = ellipseAt(st.x, st.y, 0.14, 0.35 + ph * 0.9);
    return <ellipse key={i} cx={e.sx} cy={e.sy} rx={e.rx} ry={e.ry} fill="none" stroke={T.edge} strokeWidth={sw} opacity={1 - ph} />;
  });
  const [lx, ly] = project(st.x, st.y, PK.z + 1.1);
  const w = st.label.length * 14 + 28;
  return (
    <g>
      {rings}
      <Box x={st.x - s / 2} y={st.y - s / 2} z={PK.z} w={s} d={s} h={s} pal={palette(1)} sw={sw} radius={0.14} />
      <g transform={`translate(${lx} ${ly})`}>
        <rect x={-w / 2} y={-18} width={w} height={36} rx={8} fill={T.ground} stroke={T.edge} strokeWidth={sw} />
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily='"JetBrains Mono", monospace'
          fontWeight={500}
          fontSize={22}
          fill={T.textDark}
        >
          {st.label}
        </text>
      </g>
    </g>
  );
};
