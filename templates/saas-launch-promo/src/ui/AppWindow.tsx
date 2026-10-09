import React from "react";
import { interpolate } from "remotion";
import { alpha, C, CARD_SHADOW, color } from "../theme";
import { useEnter } from "./motion";

export const WINDOW_W = 1360;
export const WINDOW_H = 660;

/** Code-built app window with a sidebar; children render in the main pane. */
export const AppWindow: React.FC<{ title: string; children: React.ReactNode; delay?: number }> = ({ title, children, delay = 0 }) => {
  const e = useEnter(delay);
  const tilt = interpolate(e, [0, 1], [8, 0]);
  return (
    <div style={{ perspective: 2000 }}>
      <div
        style={{
          width: WINDOW_W,
          height: WINDOW_H,
          borderRadius: 20,
          background: color.cardFill,
          border: `1px solid ${color.cardBorder}`,
          backdropFilter: "blur(20px)",
          boxShadow: CARD_SHADOW,
          display: "flex",
          overflow: "hidden",
          opacity: e,
          transform: `translateY(${(1 - e) * 40}px) rotateX(${tilt}deg)`,
          position: "relative",
          fontSize: 28,
        }}
      >
        <div style={{ width: 240, borderRight: `1px solid ${color.cardBorder}`, padding: "32px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: color.accent }} />
            <div style={{ fontWeight: 700, fontSize: 28, letterSpacing: "-0.02em" }}>{C.brand.name}</div>
          </div>
          {C.ui.sidebar.map((item, i) => (
            <div
              key={item}
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                fontWeight: 500,
                fontSize: 28,
                color: i === 0 ? color.text : color.muted,
                background: i === 0 ? alpha(color.accent, 0.22) : "transparent",
              }}
            >
              {item}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: "32px 40px", display: "flex", flexDirection: "column" }}>
          <div style={{ fontWeight: 500, fontSize: 28, color: color.muted, marginBottom: 20 }}>{title}</div>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Avatar: React.FC<{ initials: string; size?: number }> = ({ initials, size = 64 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "rgba(255,255,255,0.10)",
      border: `1px solid ${color.cardBorder}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 700,
      fontSize: size * 0.38,
      flexShrink: 0,
    }}
  >
    {initials}
  </div>
);
