import React from "react";
import { C, color } from "../theme";
import { Enter, Stage } from "../ui/motion";
import { Wordmark } from "./Reveal";

export const Cta: React.FC<{ duration: number }> = ({ duration }) => (
  <Stage duration={duration} glow={0.15} punch>
    <Enter delay={0}>
      <Wordmark size={130} />
    </Enter>
    <Enter delay={9} style={{ marginTop: 64 }}>
      <div style={{ background: color.accent, color: "#fff", fontWeight: 700, fontSize: 48, padding: "28px 64px", borderRadius: 999, letterSpacing: "-0.01em" }}>
        {C.cta.button}
      </div>
    </Enter>
    <Enter delay={18} y={24} style={{ marginTop: 36, fontSize: 44, fontWeight: 500, color: color.muted }}>
      {C.cta.url}
    </Enter>
  </Stage>
);
