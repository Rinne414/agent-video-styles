import React from "react";
import { Composition } from "remotion";
import "./fonts";
import { Dialogue } from "./Dialogue";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="CharacterDialogue"
    component={Dialogue}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
