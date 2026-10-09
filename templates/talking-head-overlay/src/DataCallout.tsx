import { useCurrentFrame } from "remotion";
import { ACCENT, COLORS, content, FONT, MOTION, outRamp, place, ramp, TYPE } from "./theme";

const { callout } = content;
const DURATION = callout.to - callout.from;

export const DataCallout = () => {
  const frame = useCurrentFrame();
  const out = outRamp(frame, DURATION, MOTION.out);
  const wipe = Math.min(ramp(frame, 0, MOTION.panelIn), out);
  const count = Math.round(callout.value * ramp(frame, 6, MOTION.countUp));
  const line = Math.min(ramp(frame, 10, 20), out);
  const captionT = Math.min(ramp(frame, 16, 12), out);

  return (
    <div style={{ ...place(callout.rect), fontFamily: FONT }}>
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
          inset: 0,
          padding: "0 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          opacity: Math.min(wipe * 2, 1),
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              fontSize: TYPE.callout.size,
              fontWeight: TYPE.callout.weight,
              color: COLORS.white,
              lineHeight: 1,
              letterSpacing: -4,
              fontVariantNumeric: "tabular-nums",
              minWidth: 190,
            }}
          >
            {count}
          </span>
          <span
            style={{
              fontSize: TYPE.calloutUnit.size,
              fontWeight: TYPE.calloutUnit.weight,
              color: ACCENT,
            }}
          >
            {callout.unit}
          </span>
        </div>
        <div
          style={{
            height: 3,
            marginTop: 22,
            background: ACCENT,
            transformOrigin: "0 50%",
            scale: `${line} 1`,
          }}
        />
        <div
          style={{
            marginTop: 20,
            fontSize: TYPE.calloutCaption.size,
            fontWeight: TYPE.calloutCaption.weight,
            color: COLORS.white,
            opacity: captionT,
            translate: `0 ${(1 - captionT) * MOTION.textRise}px`,
          }}
        >
          {callout.caption}
        </div>
      </div>
    </div>
  );
};
