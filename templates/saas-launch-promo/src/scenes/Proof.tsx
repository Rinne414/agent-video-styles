import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { C, color } from "../theme";
import { Enter, Stage } from "../ui/motion";

const COUNT_FRAMES = 45;

export const Proof: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const n = Math.round(interpolate(frame, [0, COUNT_FRAMES], [0, C.proof.value], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) }));
  return (
    <Stage duration={duration} glow={0.14} punch>
      <div style={{ fontSize: 280, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1, fontVariantNumeric: "tabular-nums", color: color.text }}>
        {n.toLocaleString("en-US")}
      </div>
      <Enter delay={14} style={{ marginTop: 28, fontSize: 64, fontWeight: 500, color: color.muted, letterSpacing: "-0.01em" }}>
        {C.proof.label}
      </Enter>
    </Stage>
  );
};
