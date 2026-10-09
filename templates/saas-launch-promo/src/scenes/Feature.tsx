import React from "react";
import { C, color, SAFE } from "../theme";
import { Enter, Headline, Stage } from "../ui/motion";

export const HEADLINE_END = 60; // frames of headline before the UI card takes over
export const WIN_LEFT = 280;
export const WIN_TOP = 250;

type FeatureProps = { index: number; duration: number; punch?: boolean; children: React.ReactNode };

/** Headline for 60 frames, then a small label and the demo card. */
export const Feature: React.FC<FeatureProps> = ({ index, duration, punch, children }) => {
  const f = C.features[index];
  return (
    <Stage duration={duration} glow={0.12} glowY={55} punch={punch}>
      <div style={{ position: "absolute", inset: 0 }}>
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: SAFE }}>
          <Headline lines={f.lines} accentWord={f.accentWord} size={128} exitAt={HEADLINE_END - 10} />
        </div>
        <Enter delay={HEADLINE_END} y={20} style={{ position: "absolute", left: WIN_LEFT, top: 130, fontSize: 34, fontWeight: 500, color: color.muted }}>
          {f.label}
        </Enter>
        {children}
      </div>
    </Stage>
  );
};
