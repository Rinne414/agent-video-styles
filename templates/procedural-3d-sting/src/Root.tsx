import { Composition } from "remotion";
import { Sting } from "./Sting";
import { T } from "./theme";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="procedural-3d-sting"
    component={Sting}
    durationInFrames={T.durationInFrames}
    fps={T.fps}
    width={1920}
    height={1080}
  />
);
