import { useCurrentFrame } from "remotion";
import { ACCENT, COLORS, content, FONT, MOTION, outRamp, place, ramp, TYPE } from "./theme";

const { lowerThird: lt } = content;
const DURATION = lt.to - lt.from;

export const LowerThird = () => {
  const frame = useCurrentFrame();
  const out = outRamp(frame, DURATION, MOTION.out);
  const stripe = Math.min(ramp(frame, 0, MOTION.stripeIn), out);
  const panel = Math.min(ramp(frame, 2, MOTION.panelIn), out);
  const nameT = Math.min(ramp(frame, 4, 12), out);
  const titleT = Math.min(ramp(frame, 4 + MOTION.textStagger, 12), out);

  return (
    <div style={{ ...place(lt.rect), fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: ACCENT,
          transformOrigin: "50% 100%",
          scale: `1 ${stripe}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 6,
          top: 0,
          right: 0,
          bottom: 0,
          background: COLORS.panel,
          backdropFilter: "blur(16px)",
          borderRadius: "0 12px 12px 0",
          clipPath: `inset(0 ${(1 - panel) * 100}% 0 0)`,
          padding: "22px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: TYPE.name.size,
            fontWeight: TYPE.name.weight,
            color: COLORS.white,
            lineHeight: 1.1,
            opacity: nameT,
            translate: `0 ${(1 - nameT) * MOTION.textRise}px`,
          }}
        >
          {lt.name}
        </div>
        <div
          style={{
            fontSize: TYPE.title.size,
            fontWeight: TYPE.title.weight,
            color: COLORS.muted,
            opacity: titleT,
            translate: `0 ${(1 - titleT) * MOTION.textRise}px`,
          }}
        >
          {lt.title}
        </div>
      </div>
    </div>
  );
};
