import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { beat, COLORS, content, FONT } from "./theme";
import { LogoMark } from "./ui/primitives";

const O = content.timeline.outro;

export const uiOpacityAt = (frame: number) =>
  interpolate(frame, [beat(O.fadeFromBeat), beat(O.fadeToBeat)], [1, O.uiOpacity], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = beat(O.lockupFromBeat);
  if (frame < start) return null;
  const s = (delay: number) => spring({ frame: frame - start - delay, fps, config: { damping: 18, stiffness: 120 } });
  const logo = s(0);
  const word = s(5);
  const sub = s(10);
  const cta = s(15);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        gap: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: logo,
          background: "radial-gradient(ellipse 760px 560px at 50% 50%, rgba(14,14,16,0.88), rgba(14,14,16,0.55) 55%, transparent 100%)",
        }}
      />
      <div style={{ opacity: logo, transform: `scale(${0.7 + 0.3 * logo})` }}>
        <LogoMark size={132} radius={32} />
      </div>
      <div
        style={{
          marginTop: 26,
          fontSize: 120,
          fontWeight: 700,
          letterSpacing: -3,
          color: COLORS.white,
          opacity: word,
          transform: `translateY(${(1 - word) * 30}px)`,
          textShadow: "0 6px 40px rgba(0,0,0,0.6)",
        }}
      >
        {content.brand.name}
      </div>
      <div style={{ marginTop: 6, fontSize: 40, fontWeight: 500, color: "#D4D4D8", opacity: sub, transform: `translateY(${(1 - sub) * 20}px)` }}>
        {content.brand.subline}
      </div>
      <div
        style={{
          marginTop: 44,
          padding: "16px 40px",
          borderRadius: 999,
          background: COLORS.accent,
          color: COLORS.accentInk,
          fontSize: 38,
          fontWeight: 700,
          opacity: cta,
          transform: `translateY(${(1 - cta) * 20}px)`,
        }}
      >
        {content.brand.cta}
      </div>
    </div>
  );
};
