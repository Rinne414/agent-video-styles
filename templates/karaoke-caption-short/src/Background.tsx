import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "./theme";

// Blob drift speed = amplitude * 2*PI / period; 160 px / 30 s is about 33 px/s.
const BLOBS = [
  { cx: 0.2, cy: 0.25, ax: 170, ay: 120, period: 30, phase: 0, size: 820 },
  { cx: 0.85, cy: 0.55, ax: 140, ay: 180, period: 26, phase: 2, size: 760 },
  { cx: 0.3, cy: 0.88, ax: 190, ay: 130, period: 34, phase: 4, size: 880 },
];

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const angle = 160 + Math.sin(t / 5) * 25;
  return (
    <AbsoluteFill style={{ background: `linear-gradient(${angle}deg, ${COLORS.bgFrom}, ${COLORS.bgTo})` }}>
      {BLOBS.map((b, i) => {
        const w = (2 * Math.PI) / b.period;
        const x = b.cx * WIDTH + Math.sin(t * w + b.phase) * b.ax;
        const y = b.cy * HEIGHT + Math.cos(t * w * 0.8 + b.phase) * b.ay;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - b.size / 2,
              top: y - b.size / 2,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              background: COLORS.blobs[i % COLORS.blobs.length],
              opacity: 0.42,
              filter: "blur(140px)",
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%)" }} />
    </AbsoluteFill>
  );
};
