import React from "react";
import { AbsoluteFill } from "remotion";
import { pop } from "../anim";
import { Q } from "../story";
import { C, FONT, L } from "../theme";

/** End card in screen space: CDN, then its expansion. Held to the last frame. */
export const OutroScene: React.FC<{ f: number }> = ({ f }) => {
  if (f < Q.cdn - 2) return null;
  const a = Math.min(1, pop(f, Q.cdn));
  const b = Math.min(1, pop(f, Q.content));
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", paddingBottom: 60 }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 260,
          letterSpacing: 12,
          color: C.text,
          opacity: a,
          transform: `scale(${0.88 + 0.12 * a})`,
          textShadow: `0 0 60px ${C.primary}88`,
          lineHeight: 1,
        }}
      >
        {L.cdn}
      </div>
      <div style={{ fontFamily: FONT, fontWeight: 600, fontSize: 56, color: C.muted, opacity: b, marginTop: 28, transform: `translateY(${(1 - b) * 16}px)` }}>
        {L.cdnFull}
      </div>
    </AbsoluteFill>
  );
};
