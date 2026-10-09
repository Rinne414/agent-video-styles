import React from "react";
import { useCurrentFrame } from "remotion";
import { CHARACTERS, FONT, LAYOUT, LINES, TYPE, lineIndexAt } from "./theme";

/** Sentence caption: the full line, hard cut on every line change, tagged in the speaker's color. */
export const Caption: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < LINES[0].startFrame) return null;
  const line = LINES[lineIndexAt(frame)];
  const speaker = CHARACTERS[line.speaker];
  const { x, y, w, h } = LAYOUT.caption;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        boxSizing: "border-box",
        background: "rgba(0,0,0,0.75)",
        borderRadius: 16,
        border: `4px solid ${speaker.color}`,
        padding: "46px 36px 6px",
        fontFamily: FONT,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 8,
          fontSize: TYPE.tag,
          fontWeight: 800,
          color: speaker.color,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {speaker.name}
      </div>
      <div style={{ fontSize: TYPE.caption, fontWeight: 700, color: "#fff", lineHeight: 1.18 }}>{line.text}</div>
    </div>
  );
};
