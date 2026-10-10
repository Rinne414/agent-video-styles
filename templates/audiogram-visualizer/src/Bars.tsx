import { interpolateColors, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { barRank } from "./audioBars";
import { BARS, COLOR, FPS, WIDTH } from "./theme";

const RISE_START = 10;
const IDLE_PERIOD = 1.5 * FPS;
const IDLE_PHASE_PER_BAR = 4;
const FULL_COLOR_AT = 60;

/** Mirrored vertical bars about the baseline; heights come from `heights` (px), frame-indexed. */
export const Bars = ({ heights }: { heights: number[] }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const total = BARS.count * BARS.width + (BARS.count - 1) * BARS.gap;
  const x0 = (WIDTH - total) / 2;
  return (
    <>
      {heights.map((h, i) => {
        const rise = spring({ frame: frame - RISE_START - barRank(i), fps, config: { damping: 20, stiffness: 160 } });
        const idle = BARS.minH + 2 * Math.sin((2 * Math.PI * (frame + i * IDLE_PHASE_PER_BAR)) / IDLE_PERIOD);
        const height = Math.max(idle, h) * rise;
        const color = interpolateColors(Math.min(1, height / FULL_COLOR_AT), [0, 1], [COLOR.floor, COLOR.accent]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x0 + i * (BARS.width + BARS.gap),
              top: BARS.baselineY - height / 2,
              width: BARS.width,
              height,
              borderRadius: BARS.width / 2,
              background: color,
            }}
          />
        );
      })}
    </>
  );
};
