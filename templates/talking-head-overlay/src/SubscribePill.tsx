import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, COLORS, content, FONT, MOTION, place, TYPE } from "./theme";

const { subscribe } = content;
const PRESS_AT = 26;

export const SubscribePill = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: MOTION.badgeSpring });
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const press = interpolate(frame, [PRESS_AT, PRESS_AT + 3, PRESS_AT + 9], [1, 0.94, 1], clamp);
  const fill = interpolate(frame, [PRESS_AT, PRESS_AT + 6], [0, 1], clamp);

  return (
    <div
      style={{
        ...place(subscribe.rect),
        fontFamily: FONT,
        opacity: Math.min(pop, 1),
        scale: String((0.85 + 0.15 * Math.min(pop, 1)) * press),
        borderRadius: 999,
        background: COLORS.glassFill,
        border: `1px solid ${COLORS.glassBorder}`,
        backdropFilter: "blur(18px)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: ACCENT, opacity: fill * 0.9 }} />
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ position: "relative" }}
      >
        <path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7" />
        <path d="M10 20a2 2 0 0 0 4 0" />
      </svg>
      <span
        style={{
          position: "relative",
          fontSize: TYPE.badge.size,
          fontWeight: TYPE.badge.weight,
          color: COLORS.white,
        }}
      >
        {subscribe.label}
      </span>
    </div>
  );
};
