import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, easeOut, layout, progress, sizes, SPRING_DOT, springAt, timing } from "../theme";

const RAY_START_RADIUS = 40;

/** Scene 1: a glowing dot springs up, then bursts into evenly spaced rays. */
export const Burst = () => {
  const frame = useCurrentFrame();
  const rise = springAt(frame, 0, SPRING_DOT);
  const dotY = interpolate(rise, [0, 1], [320, 0]);
  const dotScale = interpolate(
    frame,
    [timing.raysStart, timing.raysStart + timing.raysExtendFrames / 2, timing.raysStart + timing.raysExtendFrames],
    [1, 1.4, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeOut },
  );
  const extend = progress(frame, timing.raysStart, timing.raysExtendFrames);
  const retract = progress(frame, timing.raysStart + timing.raysExtendFrames, timing.raysRetractFrames);
  const tip = RAY_START_RADIUS + sizes.rayLengthPx * extend;
  const tail = RAY_START_RADIUS + (sizes.rayLengthPx - 40) * retract;
  const angleStep = 360 / sizes.rayCount;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient
            id="ray"
            gradientUnits="userSpaceOnUse"
            x1={RAY_START_RADIUS}
            y1={0}
            x2={RAY_START_RADIUS + sizes.rayLengthPx}
            y2={0}
          >
            <stop offset="0" stopColor={colors.accent} />
            <stop offset="1" stopColor={colors.accentLight} />
          </linearGradient>
        </defs>
        {extend > 0 &&
          retract < 1 &&
          Array.from({ length: sizes.rayCount }, (_, i) => (
            <g
              key={i}
              transform={`translate(${layout.centerX} ${layout.centerY}) rotate(${i * angleStep})`}
              opacity={1 - retract * 0.6}
            >
              <line x1={tail} y1={0} x2={tip} y2={0} stroke="url(#ray)" strokeWidth={sizes.rayWidthPx} strokeLinecap="round" />
            </g>
          ))}
      </svg>
      <div
        style={{
          position: "absolute",
          left: layout.centerX - sizes.dotPx / 2,
          top: layout.centerY - sizes.dotPx / 2 + dotY,
          width: sizes.dotPx,
          height: sizes.dotPx,
          borderRadius: "50%",
          background: colors.accent,
          boxShadow: `0 0 60px ${colors.accent}`,
          transform: `scale(${dotScale})`,
        }}
      />
    </AbsoluteFill>
  );
};
