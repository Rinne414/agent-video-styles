import { Composition, Still } from "remotion";
import { Audiogram } from "./Audiogram";
import { Debug } from "./Debug";
import { DURATION, FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot = () => (
  <>
    <Composition id="Audiogram" component={Audiogram} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
    <Still id="Debug" component={Debug} width={WIDTH} height={HEIGHT} />
  </>
);
