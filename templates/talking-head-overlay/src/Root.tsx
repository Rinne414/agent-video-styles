import { Composition } from "remotion";
import { Composite, Overlay } from "./Overlay";
import { content } from "./theme";

const common = {
  fps: content.fps,
  width: content.width,
  height: content.height,
  durationInFrames: content.durationInFrames,
};

export const RemotionRoot = () => (
  <>
    <Composition id="Composite" component={Composite} {...common} />
    <Composition id="Overlay" component={Overlay} {...common} />
  </>
);
