import React from "react";
import { Composition, Still } from "remotion";
import "./fonts";
import { Carousel } from "./Carousel";
import { CardStill } from "./CardStill";
import { CARDS, META, TIMING } from "./theme";

export const Root: React.FC = () => (
  <>
    <Composition
      id="Carousel"
      component={Carousel}
      durationInFrames={TIMING.totalFrames}
      fps={META.fps}
      width={META.width}
      height={META.height}
    />
    {CARDS.map((card, i) => (
      <Still
        key={card.id}
        id={`Card${i + 1}`}
        component={CardStill}
        width={META.width}
        height={META.height}
        defaultProps={{ index: i }}
      />
    ))}
  </>
);
