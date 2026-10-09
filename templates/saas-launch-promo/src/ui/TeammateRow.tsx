import React from "react";
import { alpha, color } from "../theme";
import { Avatar } from "./AppWindow";

type Props = {
  name: string;
  initials: string;
  length: string;
  text: string;
  tag?: string;
  enter: number; // 0..1 entrance progress
  flag?: number; // 0..1 blocker emphasis
  dim?: number; // 0..1 how much to fade when another row is flagged
  flagLabel?: string;
};

export const ROW_H = 172;

export const TeammateRow: React.FC<Props> = ({ name, initials, length, text, tag, enter, flag = 0, dim = 0, flagLabel }) => (
  <div
    style={{
      height: ROW_H - 16,
      marginBottom: 16,
      borderRadius: 16,
      padding: "0 28px",
      display: "flex",
      alignItems: "center",
      gap: 24,
      position: "relative",
      background: flag > 0 ? alpha(color.warning, 0.1 * flag) : "rgba(255,255,255,0.03)",
      border: `1px solid ${flag > 0 ? alpha(color.warning, 0.6 * flag) : color.cardBorder}`,
      opacity: enter * (1 - 0.55 * dim),
      transform: `translateY(${(1 - enter) * 40}px)`,
      overflow: "hidden",
    }}
  >
    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 6, background: color.warning, opacity: flag }} />
    <Avatar initials={initials} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 30 }}>{name}</span>
        <span style={{ fontWeight: 500, fontSize: 24, color: color.muted, fontVariantNumeric: "tabular-nums" }}>{length}</span>
        {tag ? (
          <span style={{ fontWeight: 500, fontSize: 22, color: color.accent, background: alpha(color.accent, 0.14), padding: "2px 12px", borderRadius: 999 }}>{tag}</span>
        ) : null}
      </div>
      <div style={{ fontWeight: 500, fontSize: 30, color: "#D1D5DB", whiteSpace: "nowrap", height: 40, overflow: "hidden" }}>{text}</div>
    </div>
    {flagLabel ? (
      <div
        style={{
          fontWeight: 700,
          fontSize: 26,
          color: "#1A1205",
          background: color.warning,
          padding: "8px 20px",
          borderRadius: 999,
          opacity: flag,
          transform: `scale(${0.8 + 0.2 * flag})`,
        }}
      >
        {flagLabel}
      </div>
    ) : null}
  </div>
);
