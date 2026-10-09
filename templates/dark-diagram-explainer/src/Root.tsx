import React from "react";
import { Composition } from "remotion";
import { Explainer } from "./Explainer";
import { FPS, HEIGHT, WIDTH } from "./theme";
import { TOTAL_FRAMES } from "./timeline";

export const RemotionRoot: React.FC = () => (
  <Composition id="Explainer" component={Explainer} durationInFrames={TOTAL_FRAMES} fps={FPS} width={WIDTH} height={HEIGHT} />
);
