import { AbsoluteFill, Composition } from "remotion";
import { Overlay } from "./Overlay";
import { Scene } from "./Scene";
import { meta } from "./theme";

const Turntable = () => (
  <AbsoluteFill>
    <Scene />
    <Overlay />
  </AbsoluteFill>
);

export const RemotionRoot = () => (
  <Composition
    id="Turntable"
    component={Turntable}
    durationInFrames={meta.durationInFrames}
    fps={meta.fps}
    width={meta.width}
    height={meta.height}
  />
);
