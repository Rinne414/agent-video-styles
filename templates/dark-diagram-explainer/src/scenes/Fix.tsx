import React from "react";
import { pop, ramp } from "../anim";
import { BigText } from "../Primitives";
import { Q } from "../story";
import { C, L } from "../theme";

/** The "5 ms" tag that shows how close the edge is to the user. */
export const FixScene: React.FC<{ f: number }> = ({ f }) => (
  <BigText
    x={580}
    y={335}
    text={L.edgeNear}
    size={40}
    color={C.result}
    opacity={Math.min(1, pop(f, Q.close)) * (1 - ramp(f, Q.milliseconds - 6, Infinity, 8))}
  />
);
