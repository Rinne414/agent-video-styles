import React from "react";
import { C, T, ease } from "./theme";
import { frontX } from "./Wordmark";

const radial = (x: number, y: number, r: number, color: string, alpha: number): React.CSSProperties => ({
  position: "absolute",
  left: x - r,
  top: y - r,
  width: r * 2,
  height: r * 2,
  borderRadius: "50%",
  background: `radial-gradient(circle, ${color} 0%, transparent 65%)`,
  opacity: alpha,
  mixBlendMode: "screen",
});

/** DOM bloom stand-ins: hit flash at the entry point, travelling flare, corner vignette. */
export const Overlay: React.FC<{
  frame: number;
  hit: number;
  hitPx: { x: number; y: number };
  centerY: number;
}> = ({ frame, hit, hitPx, centerY }) => {
  const front = frontX(frame);
  const flareAlpha =
    ease(frame, [T.reveal[0] - 4, T.reveal[0] + 6]) * ease(frame, [T.reveal[1] - 4, T.reveal[1] + 10], [1, 0]);
  return (
    <>
      <div style={radial(hitPx.x, hitPx.y, 90 + 230 * hit, "#ffffff", 0.6 * hit)} />
      <div style={radial(hitPx.x, hitPx.y, 460, C.colors.rim, 0.22 * hit)} />
      <div
        style={{
          position: "absolute",
          left: front - 40,
          top: centerY - 150,
          width: 80,
          height: 300,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(160,176,255,0.35) 40%, transparent 70%)",
          opacity: flareAlpha,
          mixBlendMode: "screen",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.4) 100%)",
        }}
      />
    </>
  );
};
