import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, MARGIN, SCENES, TABULAR, TYPE, content, prog } from "./theme";
import { SceneFrame } from "./SceneFrame";

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { hook, meta } = content;
  const value = hook.value * prog(frame, 14, 55);
  const claim = prog(frame, 40, 20);
  const kicker = prog(frame, 0, 18);
  return (
    <SceneFrame duration={SCENES.hook}>
      <div style={{ position: "absolute", left: MARGIN, top: MARGIN, opacity: kicker, fontSize: 32, fontWeight: 500, color: C.neutralLight, letterSpacing: 1 }}>
        {meta.kicker}
      </div>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontSize: TYPE.hero, fontWeight: 700, letterSpacing: -6, lineHeight: 1, color: C.highlight, ...TABULAR }}>
          {value.toFixed(hook.decimals)}
          {hook.suffix}
        </div>
        <div style={{ marginTop: 28, fontSize: 64, fontWeight: 700, opacity: claim, translate: `0 ${(1 - claim) * 14}px` }}>
          {hook.claim}
        </div>
      </AbsoluteFill>
    </SceneFrame>
  );
};
