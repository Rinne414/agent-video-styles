import { Composition } from "remotion";
import { MapGeoStory } from "./MapGeoStory";
import { meta } from "./theme";

export const Root = () => (
  <Composition
    id="MapGeoStory"
    component={MapGeoStory}
    durationInFrames={meta.durationInFrames}
    fps={meta.fps}
    width={meta.width}
    height={meta.height}
  />
);
