import React from "react";
import { Easing, interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { alpha, color, font, SPRING } from "../theme";

/** Entrance progress 0 -> 1 using the style's spring. */
export const useEnter = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: Math.max(0, frame - delay), fps, config: SPRING });
};

export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);

/** Fade/slide wrapper for any element. */
export const Enter: React.FC<{ delay?: number; y?: number; blur?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  delay = 0,
  y = 40,
  blur = 0,
  style,
  children,
}) => {
  const e = useEnter(delay);
  return (
    <div style={{ opacity: e, transform: `translateY(${(1 - e) * y}px)`, filter: blur ? `blur(${(1 - e) * blur}px)` : undefined, ...style }}>
      {children}
    </div>
  );
};

/** Scene shell: dark canvas, accent glow behind the focal element, slow camera drift. */
export const Stage: React.FC<{
  duration: number;
  glow?: number;
  glowY?: number;
  punch?: boolean;
  children: React.ReactNode;
}> = ({ duration, glow = 0.12, glowY = 50, punch = false, children }) => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, duration], [1, 1.04], { easing: Easing.out(Easing.quad) });
  const punchIn = punch
    ? interpolate(frame, [0, 10], [1.1, 1], { extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })
    : 1;
  return (
    <div style={{ position: "absolute", inset: 0, background: color.bg, overflow: "hidden", fontFamily: font, color: color.text }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${drift * punchIn})` }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: `${glowY}%`,
            width: 1100,
            height: 1100,
            marginLeft: -550,
            marginTop: -550,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${alpha(color.accent, glow)} 0%, transparent 65%)`,
          }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

/** Headline: words slam in 4 frames apart; one accent word swaps color 6 frames after landing. */
export const Headline: React.FC<{
  lines: string[][];
  accentWord: string;
  size?: number;
  start?: number;
  exitAt?: number;
}> = ({ lines, accentWord, size = 120, start = 0, exitAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  let index = 0;
  const exit = exitAt === undefined ? 0 : interpolate(frame, [exitAt, exitAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic) });
  return (
    <div style={{ textAlign: "center", opacity: 1 - exit, transform: `translateY(${-exit * 30}px)` }}>
      {lines.map((line, li) => (
        <div key={li} style={{ display: "flex", justifyContent: "center", gap: size * 0.26, lineHeight: 1.02 }}>
          {line.map((word) => {
            const delay = start + index * 4;
            index += 1;
            const e = spring({ frame: Math.max(0, frame - delay), fps, config: SPRING });
            const isAccent = word.toLowerCase().replace(/[^a-z-]/g, "") === accentWord.toLowerCase().replace(/[^a-z-]/g, "");
            const c = isAccent ? interpolateColors(frame, [delay + 6, delay + 12], [color.text, color.accent]) : color.text;
            return (
              <span
                key={word + li}
                style={{
                  display: "inline-block",
                  fontSize: size,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: c,
                  opacity: e,
                  transform: `translateY(${(1 - e) * 40}px)`,
                  filter: `blur(${(1 - e) * 12}px)`,
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const Cursor: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1 }) => (
  <svg width={44} height={44} viewBox="0 0 24 24" style={{ position: "absolute", left: x, top: y, transform: `scale(${scale})`, transformOrigin: "3px 3px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.6))" }}>
    <path d="M3 2l7.5 19 2.6-7.9L21 10.5z" fill="#fff" stroke="#0A0A0B" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

export const Ripple: React.FC<{ x: number; y: number; at: number }> = ({ x, y, at }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at, at + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  if (t <= 0 || t >= 1) return null;
  return (
    <div style={{ position: "absolute", left: x - 40, top: y - 40, width: 80, height: 80, borderRadius: "50%", border: `3px solid ${color.accent}`, opacity: 1 - t, transform: `scale(${0.4 + t * 1.2})` }} />
  );
};

/** Cursor path with eased moves between waypoints and a click pulse. */
export const useCursor = (path: { at: number; x: number; y: number }[], clickAt: number) => {
  const frame = useCurrentFrame();
  const frames = path.map((p) => p.at);
  const x = interpolate(frame, frames, path.map((p) => p.x), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IO });
  const y = interpolate(frame, frames, path.map((p) => p.y), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IO });
  const pulse = interpolate(frame, [clickAt, clickAt + 4, clickAt + 9], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { x, y, pulse };
};
