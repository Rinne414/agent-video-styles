import React from "react";
import { C, FONT_SANS, T } from "./theme";

export const Counter: React.FC<{ value: number; total: number; dark: boolean; opacity?: number }> = ({
  value,
  total,
  dark,
  opacity = 1,
}) => (
  <div
    style={{
      position: "absolute",
      right: T.margin,
      top: T.margin + 10,
      fontFamily: FONT_SANS,
      fontSize: T.counterSize,
      fontWeight: 700,
      color: dark ? C.paper : C.ink,
      opacity,
    }}
  >
    {value}/{total}
  </div>
);
