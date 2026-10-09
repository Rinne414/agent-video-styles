import React from "react";
import { Sequence } from "remotion";
import { BlockerCard } from "./scenes/BlockerCard";
import { Cta } from "./scenes/Cta";
import { Feature } from "./scenes/Feature";
import { Hook } from "./scenes/Hook";
import { Proof } from "./scenes/Proof";
import { RecordCard } from "./scenes/RecordCard";
import { Reveal } from "./scenes/Reveal";
import { SummaryCard } from "./scenes/SummaryCard";
import { C, fps } from "./theme";

const T = C.timing;
const dur = (t: number[]) => t[1] - t[0];

const Scene: React.FC<{ range: number[]; children: React.ReactNode }> = ({ range, children }) => (
  <Sequence from={range[0]} durationInFrames={dur(range)} premountFor={fps}>
    {children}
  </Sequence>
);

export const Launch: React.FC = () => (
  <>
    <Scene range={T.hook}>
      <Hook duration={dur(T.hook)} />
    </Scene>
    <Scene range={T.reveal}>
      <Reveal duration={dur(T.reveal)} />
    </Scene>
    <Scene range={T.feature1}>
      <Feature index={0} duration={dur(T.feature1)} punch>
        <RecordCard />
      </Feature>
    </Scene>
    <Scene range={T.feature2}>
      <Feature index={1} duration={dur(T.feature2)}>
        <SummaryCard />
      </Feature>
    </Scene>
    <Scene range={T.feature3}>
      <Feature index={2} duration={dur(T.feature3)}>
        <BlockerCard />
      </Feature>
    </Scene>
    <Scene range={T.proof}>
      <Proof duration={dur(T.proof)} />
    </Scene>
    <Scene range={T.cta}>
      <Cta duration={dur(T.cta)} />
    </Scene>
  </>
);
