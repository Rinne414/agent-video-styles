import React from "react";
import { useCurrentFrame } from "remotion";
import { C, MARGIN, SCENES, TABULAR, content, prog } from "./theme";
import { SceneFrame } from "./SceneFrame";

const CARD_START = 70;
const CARD_STAGGER = 5;

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const { closing } = content;
  const kick = prog(frame, 6, 16);
  const lead = prog(frame, 14, 22);
  const rest = prog(frame, 26, 22);
  return (
    <SceneFrame duration={SCENES.closing} fadeOut={false}>
      <div style={{ position: "absolute", left: MARGIN, top: 200, opacity: kick, fontSize: 32, fontWeight: 500, color: C.neutralLight, letterSpacing: 1 }}>
        {closing.kicker}
      </div>
      <div style={{ position: "absolute", left: MARGIN, top: 260, fontSize: 150, fontWeight: 700, letterSpacing: -4, lineHeight: 1.05 }}>
        <div style={{ color: C.highlight, opacity: lead, translate: `0 ${(1 - lead) * 24}px` }}>{closing.lead}</div>
        <div style={{ opacity: rest, translate: `0 ${(1 - rest) * 24}px` }}>{closing.rest}</div>
      </div>
      <div style={{ position: "absolute", left: MARGIN, right: MARGIN, top: 700, display: "flex", gap: 40 }}>
        {closing.cards.map((card, i) => {
          const p = prog(frame, CARD_START + i * CARD_STAGGER, 18);
          return (
            <div
              key={card.label}
              style={{
                flex: 1,
                padding: "32px 36px",
                borderRadius: 16,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                opacity: p,
                translate: `0 ${(1 - p) * 30}px`,
              }}
            >
              <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -2, lineHeight: 1, color: i === 2 ? C.highlight : C.text, ...TABULAR }}>{card.value}</div>
              <div style={{ marginTop: 14, fontSize: 28, fontWeight: 500, color: C.neutralLight }}>{card.label}</div>
            </div>
          );
        })}
      </div>
    </SceneFrame>
  );
};
