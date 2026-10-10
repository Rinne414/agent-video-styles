import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import "./fonts";
import { Connectors } from "./Connectors";
import { Packet } from "./Packet";
import { PART_COMPONENTS, pad } from "./parts";
import { darkOf } from "./timeline";
import { C, T } from "./theme";

const Captions: React.FC<{ frame: number }> = ({ frame }) => (
  <>
    {C.captions.map((c, i) => {
      const isEnd = "end" in c && Boolean(c.end);
      const o = interpolate(frame, [c.from, c.from + 6, c.to - 6, c.to], [0, 1, 1, isEnd ? 1 : 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      if (o <= 0) return null;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: T.captionY - 60,
            textAlign: "center",
            opacity: o,
            fontFamily: "Inter, sans-serif",
            fontWeight: isEnd ? 600 : 500,
            fontSize: isEnd ? T.titleSize : T.captionSize,
            color: isEnd ? T.textDark : T.textMid,
            letterSpacing: isEnd ? -1 : 0,
          }}
        >
          {c.text}
        </div>
      );
    })}
  </>
);

export const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const total = C.meta.durationInFrames;
  const zoom = interpolate(frame, [0, total], [1, T.pushTo], { easing: Easing.inOut(Easing.quad) });
  const sw = T.edgePx / zoom;
  const [cx, cy] = T.sceneCenter;

  const order = [...C.parts].sort((a, b) => a.at[0] + a.at[1] - (b.at[0] + b.at[1]));
  const padDraw = interpolate(frame, [0, C.timing.plinthDrawFrames], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ background: T.ground }}>
      <svg width={C.meta.width} height={C.meta.height} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})`}>
          {order.map((p) => (
            <g key={`pad-${p.id}`}>{pad(p.at[0], p.at[1], padDraw, sw)}</g>
          ))}
          <Connectors frame={frame} sw={sw} />
          {order.map((p) => {
            const Part = PART_COMPONENTS[p.kind];
            return <Part key={p.id} cx={p.at[0]} cy={p.at[1]} tag={p.tag} start={p.assembleAt} frame={frame} dark={darkOf(p.id, frame)} sw={sw} />;
          })}
          <Packet frame={frame} sw={sw} />
        </g>
      </svg>
      <Captions frame={frame} />
    </AbsoluteFill>
  );
};
