import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, color, SPRING } from "../theme";
import { AppWindow } from "../ui/AppWindow";
import { TeammateRow } from "../ui/TeammateRow";
import { HEADLINE_END, WIN_LEFT, WIN_TOP } from "./Feature";

const T0 = HEADLINE_END;
const FLAG_AT = T0 + 42;

/** Feature 3: summaries are already there, the blocker row gets flagged and the rest dim. */
export const BlockerCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flag = spring({ frame: Math.max(0, frame - FLAG_AT), fps, config: SPRING });
  const counter = interpolate(frame, [FLAG_AT + 6, FLAG_AT + 16], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <div style={{ position: "absolute", left: WIN_LEFT, top: WIN_TOP }}>
      <AppWindow title={C.ui.appTitle} delay={T0}>
        <div style={{ position: "absolute", right: 40, top: 28, fontWeight: 700, fontSize: 26, color: color.warning, opacity: counter }}>
          {C.ui.blockerCount}
        </div>
        {C.ui.teammates.map((t, i) => {
          const enter = spring({ frame: Math.max(0, frame - (T0 + 8 + i * 6)), fps, config: SPRING });
          return (
            <TeammateRow
              key={t.name}
              name={t.name}
              initials={t.initials}
              length={t.length}
              text={t.summary}
              enter={enter}
              flag={t.blocker ? flag : 0}
              dim={t.blocker ? 0 : flag}
              flagLabel={t.blocker ? C.ui.blockerTag : undefined}
            />
          );
        })}
      </AppWindow>
    </div>
  );
};
