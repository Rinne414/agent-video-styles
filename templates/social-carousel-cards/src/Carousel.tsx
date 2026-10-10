import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Card } from "./Card";
import { Counter } from "./Counter";
import { C, CARDS, META, MOTION, TIMING } from "./theme";

const { starts, swipeFrames, totalFrames } = TIMING;

/** Frame at which card i begins entering (its swipe-in starts here). */
const entryFrame = (i: number) => (i === 0 ? 0 : starts[i] - swipeFrames);
const endFrame = (i: number) => (i === CARDS.length - 1 ? totalFrames : starts[i + 1]);

export const Carousel: React.FC = () => {
  const frame = useCurrentFrame();
  const W = META.width;

  let offset = 0;
  for (let i = 1; i < CARDS.length; i++) {
    offset +=
      W *
      interpolate(frame, [entryFrame(i), starts[i]], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: MOTION.swipeEase,
      });
  }

  // The counter digit swaps with a short fade once the swipe passes its midpoint.
  let current = 0;
  for (let i = 1; i < CARDS.length; i++) {
    if (frame >= entryFrame(i) + swipeFrames / 2) current = i;
  }
  const mid = current === 0 ? -1000 : entryFrame(current) + swipeFrames / 2;
  const fade = interpolate(frame, [mid, mid + MOTION.counterFade], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dark = CARDS[current].dark;

  return (
    <AbsoluteFill style={{ background: C.paper }}>
      <div style={{ position: "absolute", inset: 0, transform: `translateX(${-offset}px)` }}>
        {CARDS.map((card, i) => (
          <div
            key={card.id}
            style={{
              position: "absolute",
              left: i * W,
              top: 0,
              width: W,
              height: META.height,
              borderLeft: i === 0 ? undefined : `2px solid ${C.ink}1A`,
              boxSizing: "border-box",
            }}
          >
            <Card
              card={card}
              f={Math.max(0, frame - entryFrame(i))}
              holdFrames={endFrame(i) - starts[i]}
              showHint={i === 0}
            />
          </div>
        ))}
      </div>
      <Counter value={current + 1} total={CARDS.length} dark={dark} opacity={mid < 0 ? 1 : fade} />
    </AbsoluteFill>
  );
};
