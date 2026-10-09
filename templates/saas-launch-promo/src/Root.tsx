import "./fonts";
import React from "react";
import { Composition } from "remotion";
import { Launch } from "./Launch";
import { fps, height, TOTAL_FRAMES, width } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition id="driftboard-launch" component={Launch} durationInFrames={TOTAL_FRAMES} fps={fps} width={width} height={height} />
);
