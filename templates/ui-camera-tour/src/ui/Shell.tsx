import React from "react";
import { COLORS, content, FONT, WINDOW } from "../theme";
import { Abs, LogoMark } from "./primitives";
import { R } from "../layout";

const NavDot: React.FC<{ active: boolean; kind: number }> = ({ active, kind }) => {
  const c = active ? COLORS.accentDeep : "#98A2B3";
  const shapes = [
    <g key="a" fill={c}><rect x="3" y="3" width="8" height="8" rx="2" /><rect x="13" y="3" width="8" height="8" rx="2" /><rect x="3" y="13" width="8" height="8" rx="2" /><rect x="13" y="13" width="8" height="8" rx="2" /></g>,
    <rect key="b" x="5" y="3" width="14" height="18" rx="3" fill="none" stroke={c} strokeWidth="2" />,
    <g key="c" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-5 4-7 8-7s7 2 8 7" strokeLinecap="round" /></g>,
    <path key="d" d="M4 19V10M10 19V5M16 19v-6M22 19V8" stroke={c} strokeWidth="2.4" strokeLinecap="round" />,
    <circle key="e" cx="12" cy="12" r="7" fill="none" stroke={c} strokeWidth="2" />,
  ];
  return (
    <svg width="22" height="22" viewBox="0 0 24 24">
      {shapes[kind]}
    </svg>
  );
};

export const WindowChrome: React.FC = () => (
  <Abs r={R.chrome} style={{ background: "#ECEEF2", borderBottom: `1px solid ${COLORS.border}` }}>
    {["#FF5F57", "#FEBC2E", "#28C840"].map((c, i) => (
      <div key={c} style={{ position: "absolute", left: 22 + i * 22, top: 16, width: 12, height: 12, borderRadius: 6, background: c }} />
    ))}
    <div
      style={{
        position: "absolute",
        left: 470,
        top: 8,
        width: 500,
        height: 28,
        borderRadius: 8,
        background: "#FFFFFF",
        color: COLORS.muted,
        fontSize: 14,
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      app.ledgerly.example
    </div>
  </Abs>
);

export const Sidebar: React.FC<{ activeIndex: number }> = ({ activeIndex }) => (
  <Abs r={R.sidebar} style={{ background: COLORS.surface, borderRight: `1px solid ${COLORS.border}` }}>
    <div style={{ position: "absolute", left: 28, top: 28, display: "flex", alignItems: "center", gap: 12 }}>
      <LogoMark size={36} />
      <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 700, color: COLORS.ink, letterSpacing: -0.4 }}>
        {content.brand.name}
      </span>
    </div>
    {content.nav.map((label, i) => (
      <div
        key={label}
        style={{
          position: "absolute",
          left: 16,
          top: 104 + i * 54,
          width: 208,
          height: 44,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 14px",
          boxSizing: "border-box",
          background: i === activeIndex ? COLORS.accentSoft : "transparent",
          color: i === activeIndex ? COLORS.accentDeep : COLORS.muted,
          fontSize: 18,
          fontWeight: i === activeIndex ? 600 : 500,
        }}
      >
        <NavDot active={i === activeIndex} kind={i} />
        {label}
      </div>
    ))}
    <div style={{ position: "absolute", left: 24, bottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          background: "#D0D5DD",
          color: COLORS.ink,
          fontSize: 15,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {content.brand.user
          .split(" ")
          .map((p) => p[0])
          .join("")}
      </div>
      <span style={{ fontSize: 16, fontWeight: 600, color: COLORS.ink }}>{content.brand.user}</span>
    </div>
  </Abs>
);

export const WindowFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: 0,
      width: WINDOW.w,
      height: WINDOW.h,
      borderRadius: WINDOW.radius,
      overflow: "hidden",
      background: COLORS.appBg,
      boxShadow: "0 40px 120px rgba(0,0,0,0.45)",
      fontFamily: FONT,
    }}
  >
    {children}
  </div>
);
