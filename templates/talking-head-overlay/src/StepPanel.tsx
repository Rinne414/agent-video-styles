import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ACCENT, COLORS, content, FONT, MOTION, outRamp, place, ramp, TYPE } from "./theme";

type Step = (typeof content.steps)[number];

export const StepPanel = ({ step }: { step: Step }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const duration = step.to - step.from;
  const out = outRamp(frame, duration, MOTION.out);
  const wipe = Math.min(ramp(frame, 0, MOTION.panelIn), out);
  const stripe = Math.min(ramp(frame, 0, MOTION.stripeIn), out);
  const pop = spring({ frame: frame - 4, fps, config: MOTION.badgeSpring });
  const labelT = Math.min(ramp(frame, 4 + MOTION.textStagger, 12), out);
  const index = content.steps.indexOf(step);

  return (
    <div style={{ ...place(step.rect), fontFamily: FONT }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: COLORS.panel,
          backdropFilter: "blur(16px)",
          borderRadius: 12,
          clipPath: `inset(0 0 0 ${(1 - wipe) * 100}%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 6,
          background: ACCENT,
          borderRadius: "0 12px 12px 0",
          transformOrigin: "50% 100%",
          scale: `1 ${stripe}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          padding: "0 56px",
          display: "flex",
          alignItems: "center",
          gap: 36,
          opacity: Math.min(wipe * 2, 1),
        }}
      >
        <div
          style={{
            fontSize: TYPE.numeral.size,
            fontWeight: TYPE.numeral.weight,
            color: ACCENT,
            lineHeight: 1,
            letterSpacing: -4,
            fontVariantNumeric: "tabular-nums",
            scale: String(0.85 + 0.15 * Math.min(pop, 1)),
            opacity: Math.min(pop, out, 1),
          }}
        >
          {step.number}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: TYPE.stepLabel.size,
              fontWeight: TYPE.stepLabel.weight,
              color: COLORS.white,
              lineHeight: 1.2,
              opacity: labelT,
              translate: `0 ${(1 - labelT) * MOTION.textRise}px`,
            }}
          >
            {step.label}
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {content.steps.map((s, i) => (
              <div
                key={s.number}
                style={{
                  width: i === index ? 44 : 14,
                  height: 6,
                  borderRadius: 3,
                  background: i === index ? ACCENT : "rgba(255,255,255,0.28)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
