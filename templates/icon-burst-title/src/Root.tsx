import { Composition } from "remotion";
import { IconBurstTitle } from "./IconBurstTitle";
import { video } from "./theme";

export const RemotionRoot = () => (
  <Composition
    id="IconBurstTitle"
    component={IconBurstTitle}
    durationInFrames={video.durationInFrames}
    fps={video.fps}
    width={video.width}
    height={video.height}
  />
);
