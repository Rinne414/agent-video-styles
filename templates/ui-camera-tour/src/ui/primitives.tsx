import React from "react";
import { COLORS, FONT } from "../theme";
import type { ChipState } from "../timeline";
import type { Rect } from "../layout";

export const Abs: React.FC<{
  r: Rect;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({ r, style, children }) => (
  <div style={{ position: "absolute", left: r.x, top: r.y, width: r.w, height: r.h, ...style }}>{children}</div>
);

export const Card: React.FC<{ r: Rect; children?: React.ReactNode; style?: React.CSSProperties }> = ({
  r,
  children,
  style,
}) => (
  <Abs
    r={r}
    style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 16,
      boxShadow: "0 1px 2px rgba(16,24,40,0.05)",
      ...style,
    }}
  >
    {children}
  </Abs>
);

export const Label: React.FC<{ r: Rect; text: string }> = ({ r, text }) => (
  <Abs
    r={r}
    style={{ fontSize: 14, fontWeight: 600, color: COLORS.muted, letterSpacing: 0.2, display: "flex", alignItems: "center" }}
  >
    {text}
  </Abs>
);

const CHIP_STYLE: Record<ChipState | "overdue", { bg: string; ink: string; label: string }> = {
  draft: { bg: COLORS.draftBg, ink: COLORS.draftInk, label: "Draft" },
  sent: { bg: COLORS.sentBg, ink: COLORS.sentInk, label: "Sent" },
  paid: { bg: COLORS.accentSoft, ink: COLORS.accentDeep, label: "Paid" },
  overdue: { bg: COLORS.overdueBg, ink: COLORS.overdueInk, label: "Overdue" },
};

export const StatusChip: React.FC<{
  state: ChipState | "overdue";
  r?: Rect;
  size?: number;
  pop?: number;
}> = ({ state, r, size = 16, pop = 0 }) => {
  const s = CHIP_STYLE[state];
  const body = (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 7,
        height: "100%",
        width: "100%",
        padding: "0 14px",
        boxSizing: "border-box",
        borderRadius: 999,
        background: s.bg,
        color: s.ink,
        fontSize: size,
        fontWeight: 600,
        transform: `scale(${1 + pop * 0.12})`,
        boxShadow: pop > 0 ? `0 0 ${24 * pop}px ${COLORS.accent}` : "none",
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: 4, background: s.ink }} />
      {s.label}
    </div>
  );
  return r ? <Abs r={r}>{body}</Abs> : <div style={{ display: "inline-block", width: 92, height: 30 }}>{body}</div>;
};

export const PrimaryButton: React.FC<{ r: Rect; label: string; press?: number; icon?: React.ReactNode; ghost?: boolean }> = ({
  r,
  label,
  press = 0,
  icon,
  ghost = false,
}) => (
  <Abs
    r={r}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderRadius: 12,
      fontFamily: FONT,
      fontSize: 18,
      fontWeight: 600,
      background: ghost ? COLORS.surface : COLORS.accent,
      color: ghost ? COLORS.ink : COLORS.accentInk,
      border: ghost ? `1px solid ${COLORS.fieldBorder}` : "none",
      boxShadow: ghost ? "none" : "0 1px 2px rgba(16,24,40,0.12), inset 0 1px 0 rgba(255,255,255,0.25)",
      transform: `scale(${1 - press * 0.06})`,
    }}
  >
    {icon}
    {label}
  </Abs>
);

export const Caret: React.FC<{ visible: boolean }> = ({ visible }) => (
  <span
    style={{
      display: "inline-block",
      width: 2,
      height: "1.1em",
      marginLeft: 1,
      verticalAlign: "text-bottom",
      background: COLORS.ink,
      opacity: visible ? 1 : 0,
    }}
  />
);

export const SendIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22l-4-9-9-4 20-7z" />
  </svg>
);

export const CheckIcon: React.FC<{ color: string; size?: number }> = ({ color, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const LogoMark: React.FC<{ size: number; radius?: number }> = ({ size, radius }) => (
  <svg width={size} height={size} viewBox="0 0 48 48">
    <rect width="48" height="48" rx={radius ?? 13} fill={COLORS.accent} />
    <rect x="13" y="12" width="22" height="5" rx="2.5" fill={COLORS.accentInk} />
    <rect x="13" y="21.5" width="16" height="5" rx="2.5" fill={COLORS.accentInk} />
    <rect x="13" y="31" width="22" height="5" rx="2.5" fill={COLORS.accentInk} />
  </svg>
);
