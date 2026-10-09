import { Composition } from "remotion";
import { TourScene } from "./TourScene";
import { FORMAT } from "./theme";

export const RemotionRoot = () => (
  <Composition
    id="UiCameraTour"
    component={TourScene}
    durationInFrames={FORMAT.durationInFrames}
    fps={FORMAT.fps}
    width={FORMAT.width}
    height={FORMAT.height}
  />
);
