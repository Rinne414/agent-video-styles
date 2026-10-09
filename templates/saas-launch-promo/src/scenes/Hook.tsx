import React from "react";
import { C, SAFE } from "../theme";
import { Headline, Stage } from "../ui/motion";

export const Hook: React.FC<{ duration: number }> = ({ duration }) => (
  <Stage duration={duration} glow={0.1}>
    <div style={{ padding: SAFE }}>
      <Headline lines={C.hook.lines} accentWord={C.hook.accentWord} size={140} />
    </div>
  </Stage>
);
