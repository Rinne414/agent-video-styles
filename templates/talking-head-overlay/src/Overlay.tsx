import { AbsoluteFill, Sequence } from "remotion";
import { DataCallout } from "./DataCallout";
import { LowerThird } from "./LowerThird";
import { Plate } from "./Plate";
import { StepPanel } from "./StepPanel";
import { SubscribePill } from "./SubscribePill";
import { content } from "./theme";

const span = (o: { from: number; to: number }) => ({
  from: o.from,
  durationInFrames: o.to - o.from,
  premountFor: content.fps,
});

// Graphics only: no background, so the render keeps alpha.
export const Overlay = () => (
  <AbsoluteFill>
    <Sequence {...span(content.lowerThird)}>
      <LowerThird />
    </Sequence>
    {content.steps.map((step) => (
      <Sequence key={step.number} {...span(step)}>
        <StepPanel step={step} />
      </Sequence>
    ))}
    <Sequence {...span(content.callout)}>
      <DataCallout />
    </Sequence>
    <Sequence {...span(content.subscribe)}>
      <SubscribePill />
    </Sequence>
  </AbsoluteFill>
);

export const Composite = () => (
  <AbsoluteFill>
    <Plate />
    <Overlay />
  </AbsoluteFill>
);
