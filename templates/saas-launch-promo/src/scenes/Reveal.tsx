import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { alpha, C, color } from "../theme";
import { Enter, Stage, useEnter } from "../ui/motion";

export const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.22 }}>
    <div style={{ width: size * 0.78, height: size * 0.78, borderRadius: size * 0.2, background: color.accent, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: size * 0.07, padding: size * 0.16 }}>
      {[0.5, 1, 0.7].map((h, i) => (
        <div key={i} style={{ width: size * 0.12, height: `${h * 100}%`, borderRadius: size * 0.04, background: "#fff" }} />
      ))}
    </div>
    <div style={{ fontSize: size, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{C.brand.name}</div>
  </div>
);

export const Reveal: React.FC<{ duration: number }> = ({ duration }) => {
  const frame = useCurrentFrame();
  const bloom = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  const e = useEnter(0);
  return (
    <Stage duration={duration} glow={0.15 * bloom} punch>
      <div style={{ opacity: e, transform: `translateY(${(1 - e) * 40}px)`, filter: `drop-shadow(0 0 ${60 * bloom}px ${alpha(color.accent, 0.35)})` }}>
        <Wordmark size={150} />
      </div>
      <Enter delay={18} style={{ marginTop: 56, fontSize: 48, fontWeight: 500, color: color.muted }}>
        {C.reveal.tagline}
      </Enter>
    </Stage>
  );
};
