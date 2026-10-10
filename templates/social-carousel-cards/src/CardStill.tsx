import React from "react";
import { Card } from "./Card";
import { Counter } from "./Counter";
import { CARDS, TIMING } from "./theme";

/** Settled frame (since the card started entering) used for the exported PNG. */
export const STILL_FRAME = 60;

export const CardStill: React.FC<{ index: number }> = ({ index }) => (
  <div style={{ position: "absolute", inset: 0 }}>
    <Card card={CARDS[index]} f={STILL_FRAME} holdFrames={TIMING.starts[1]} />
    <Counter value={index + 1} total={CARDS.length} dark={CARDS[index].dark} />
  </div>
);
