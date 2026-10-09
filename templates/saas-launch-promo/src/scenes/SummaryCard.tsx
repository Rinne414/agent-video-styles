import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, SPRING } from "../theme";
import { AppWindow } from "../ui/AppWindow";
import { TeammateRow } from "../ui/TeammateRow";
import { HEADLINE_END, WIN_LEFT, WIN_TOP } from "./Feature";

const T0 = HEADLINE_END;
const ROW_STAGGER = 6;
const TYPE_START = 12; // frames after a row appears
const CHARS_PER_FRAME = 1.5;

/** Feature 2: each teammate row appears, then its AI summary types in. */
export const SummaryCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ position: "absolute", left: WIN_LEFT, top: WIN_TOP }}>
      <AppWindow title={C.ui.appTitle} delay={T0}>
        {C.ui.teammates.map((t, i) => {
          const rowStart = T0 + 8 + i * ROW_STAGGER;
          const enter = spring({ frame: Math.max(0, frame - rowStart), fps, config: SPRING });
          const typed = Math.max(0, Math.floor((frame - rowStart - TYPE_START) * CHARS_PER_FRAME));
          return (
            <TeammateRow
              key={t.name}
              name={t.name}
              initials={t.initials}
              length={t.length}
              text={t.summary.slice(0, typed)}
              tag={typed > 0 ? C.ui.summaryTag : undefined}
              enter={enter}
            />
          );
        })}
      </AppWindow>
    </div>
  );
};
