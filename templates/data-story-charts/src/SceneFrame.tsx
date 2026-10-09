import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, FONT, MARGIN, TYPE, prog } from "./theme";

const FADE = 8;

/** Fades the scene in/out and applies the slow 1.00 -> 1.03 camera push. */
export const SceneFrame: React.FC<{
  duration: number;
  fadeOut?: boolean;
  children: React.ReactNode;
}> = ({ duration, fadeOut = true, children }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, FADE], [0, 1], CLAMP);
  const out = fadeOut ? interpolate(frame, [duration - FADE, duration], [1, 0], CLAMP) : 1;
  const scale = 1 + 0.03 * (frame / duration);
  return (
    <AbsoluteFill style={{ opacity: fadeIn * out, scale: String(scale), fontFamily: FONT, color: C.text }}>
      {children}
    </AbsoluteFill>
  );
};

/** Takeaway headline (top-left at the safe margin) and a subtitle that states the unit. */
export const Headline: React.FC<{ title: string; subtitle: string; delay?: number }> = ({
  title,
  subtitle,
  delay = 6,
}) => {
  const frame = useCurrentFrame();
  const p = prog(frame, delay, 18);
  return (
    <div style={{ position: "absolute", left: MARGIN, top: MARGIN, opacity: p, translate: `0 ${(1 - p) * 16}px` }}>
      <div style={{ fontSize: TYPE.headline, fontWeight: 700, letterSpacing: -1.5, lineHeight: 1.1 }}>{title}</div>
      <div style={{ fontSize: TYPE.subtitle, fontWeight: 500, color: C.neutralLight, marginTop: 14 }}>{subtitle}</div>
    </div>
  );
};
