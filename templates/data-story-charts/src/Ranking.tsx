import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, CLAMP, MARGIN, SCENES, TABULAR, TYPE, W, content, prog } from "./theme";
import { Headline, SceneFrame } from "./SceneFrame";

const ROW_TOP = 400;
const ROW_STEP = 110;
const BAR_H = 64;
const NAME_W = 340;
const BAR_X = MARGIN + NAME_W + 40;
const BAR_MAX_W = 960;

const BARS_START = 16;
const STAGGER = 3;
const BAR_DUR = 30;
const DIM_START = 110;
const NOTE_START = 122;

export const Ranking: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { ranking } = content;
  const axes = prog(frame, 0, 12);
  const dim = interpolate(frame, [DIM_START, DIM_START + 10], [1, 0.35], CLAMP);
  const note = prog(frame, NOTE_START, 12);
  const leaderEnd = BAR_X + (ranking.items[0].value / ranking.axisMax) * BAR_MAX_W + 130;

  return (
    <SceneFrame duration={SCENES.ranking}>
      <Headline title={ranking.headline} subtitle={ranking.subtitle} />
      <div
        style={{
          position: "absolute",
          left: BAR_X - 2,
          top: ROW_TOP - 24,
          width: 2,
          height: (ranking.items.length - 1) * ROW_STEP + BAR_H + 48,
          background: C.text,
          opacity: 0.2 * axes,
          transformOrigin: "top",
          scale: `1 ${axes}`,
        }}
      />
      {ranking.items.map((item, i) => {
        // critically damped spring: reaches the value with no overshoot
        const grow = spring({ frame: frame - BARS_START - i * STAGGER, fps, config: { damping: 200 }, durationInFrames: BAR_DUR });
        const width = (item.value / ranking.axisMax) * BAR_MAX_W * grow;
        const isTop = i === 0;
        const rowOpacity = isTop ? 1 : dim;
        const labelOpacity = isTop ? 1 : interpolate(dim, [0.35, 1], [0.55, 1]);
        const y = ROW_TOP + i * ROW_STEP;
        const shown = Math.round(item.value * grow);
        const entered = prog(frame, BARS_START + i * STAGGER, 10);
        return (
          <React.Fragment key={item.name}>
            <div style={{ position: "absolute", left: MARGIN, top: y, height: BAR_H, width: NAME_W, display: "flex", alignItems: "center", fontSize: TYPE.label + 4, fontWeight: 500, opacity: entered * labelOpacity }}>
              {item.name}
            </div>
            <div style={{ position: "absolute", left: BAR_X, top: y, height: BAR_H, width, background: isTop ? C.highlight : C.neutral, borderRadius: "0 8px 8px 0", opacity: rowOpacity }} />
            <div style={{ position: "absolute", left: BAR_X + width + 20, top: y, height: BAR_H, display: "flex", alignItems: "center", fontSize: TYPE.value, fontWeight: 700, color: isTop ? C.highlight : C.text, opacity: entered * labelOpacity, ...TABULAR }}>
              {shown}%
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: "absolute", left: leaderEnd, top: ROW_TOP + BAR_H / 2 - 24, height: 48, display: "flex", alignItems: "center", opacity: note }}>
        <div style={{ width: 40 * note, height: 2, background: C.highlight }} />
        <div style={{ marginLeft: 14, fontSize: TYPE.label - 4, fontWeight: 500, whiteSpace: "nowrap", maxWidth: W - leaderEnd - MARGIN - 54, ...TABULAR }}>
          {ranking.annotation}
        </div>
      </div>
    </SceneFrame>
  );
};
