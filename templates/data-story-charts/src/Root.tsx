import React from "react";
import { AbsoluteFill, Composition, Sequence } from "remotion";
import { C, FONT, FPS, H, SAFE, SCENES, SCENE_STARTS, TOTAL_FRAMES, TYPE, W, content } from "./theme";
import { Hook } from "./Hook";
import { LineChart } from "./LineChart";
import { Ranking } from "./Ranking";
import { Closing } from "./Closing";

const DataStory: React.FC = () => (
  <AbsoluteFill style={{ background: C.background, fontFamily: FONT }}>
    <Sequence from={SCENE_STARTS.hook} durationInFrames={SCENES.hook}>
      <Hook />
    </Sequence>
    <Sequence from={SCENE_STARTS.line} durationInFrames={SCENES.line}>
      <LineChart />
    </Sequence>
    <Sequence from={SCENE_STARTS.ranking} durationInFrames={SCENES.ranking}>
      <Ranking />
    </Sequence>
    <Sequence from={SCENE_STARTS.closing} durationInFrames={SCENES.closing}>
      <Closing />
    </Sequence>
    {/* persistent source line and sample-data tag, visible in every scene */}
    <div style={{ position: "absolute", left: SAFE, bottom: 40, fontSize: TYPE.source, fontWeight: 400, color: C.text, opacity: 0.55 }}>
      {content.meta.sourceLine}
    </div>
    <div
      style={{
        position: "absolute",
        right: SAFE,
        bottom: 36,
        padding: "4px 14px",
        borderRadius: 999,
        border: `1px solid ${C.neutralLight}`,
        fontSize: 20,
        fontWeight: 500,
        letterSpacing: 2,
        color: C.neutralLight,
      }}
    >
      {content.meta.sampleTag}
    </div>
  </AbsoluteFill>
);

export const RemotionRoot: React.FC = () => (
  <Composition id="DataStory" component={DataStory} durationInFrames={TOTAL_FRAMES} fps={FPS} width={W} height={H} />
);
