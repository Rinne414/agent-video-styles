import React from "react";
import { Composition } from "remotion";
import { Scene } from "./Scene";
import { C } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="IsometricExplainer"
    component={Scene}
    durationInFrames={C.meta.durationInFrames}
    fps={C.meta.fps}
    width={C.meta.width}
    height={C.meta.height}
  />
);
