import { Lightbulb, Rocket, Terminal, type LucideIcon } from "lucide-react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  badgeGroup,
  colors,
  easeInOut,
  easeOut,
  fontFamily,
  icons,
  layout,
  progress,
  rowsCenter,
  sizes,
  timing,
} from "../theme";

const ICON_MAP: Record<string, LucideIcon> = { terminal: Terminal, lightbulb: Lightbulb, rocket: Rocket };
// Resting angle of each icon on the badge (degrees, 0 = right, clockwise on screen).
const BADGE_ANGLES = [-90, 30, 150];

/** Scenes 3+4: icons fly in beside their lines, then orbit into a circular badge. */
export const IconsBadge = () => {
  const frame = useCurrentFrame();
  const group = badgeGroup(frame);
  const badgeIn = progress(frame, timing.orbitStart + 15, 30);
  const orbit = progress(frame, timing.orbitStart, timing.orbitFrames, easeInOut);
  const labelFade = 1 - progress(frame, timing.orbitStart - 4, 10);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${group.x}px) scale(${group.scale})`,
          transformOrigin: `${rowsCenter.x}px ${rowsCenter.y}px`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: rowsCenter.x - sizes.badgePx / 2,
            top: rowsCenter.y - sizes.badgePx / 2,
            width: sizes.badgePx,
            height: sizes.badgePx,
            borderRadius: "50%",
            background: colors.accent,
            border: `${sizes.badgeRingPx}px solid ${colors.text}`,
            boxSizing: "border-box",
            transform: `scale(${badgeIn})`,
          }}
        />
        {icons.map((item, i) => {
          const Icon = ICON_MAP[item.icon];
          const start = timing.iconsStart + i * timing.iconGapFrames;
          const fly = progress(frame, start, timing.iconFlyFrames);
          const rowY = rowsCenter.y + (i - 1) * layout.rowGapPx;
          // Row position relative to the badge center, as polar coordinates
          const dx0 = layout.iconX - rowsCenter.x;
          const dy0 = rowY - rowsCenter.y;
          const r0 = Math.hypot(dx0, dy0);
          const a0 = (Math.atan2(dy0, dx0) * 180) / Math.PI;
          const spin = ((((BADGE_ANGLES[i] - a0) % 360) + 360) % 360) + 360; // a full turn or more, clockwise
          const angle = ((a0 + spin * orbit) * Math.PI) / 180;
          const radius = interpolate(orbit, [0, 1], [r0, sizes.badgeOrbitRadiusPx]);
          const flyX = interpolate(fly, [0, 1], [-300, 0]);
          const x = rowsCenter.x + Math.cos(angle) * radius + flyX;
          const y = rowsCenter.y + Math.sin(angle) * radius;
          const labelIn = progress(frame, start + timing.labelDelayFrames, 14);
          return (
            <div key={item.label}>
              <div
                style={{
                  position: "absolute",
                  left: x - sizes.iconPx / 2,
                  top: y - sizes.iconPx / 2,
                  opacity: Math.min(1, fly * 3),
                }}
              >
                <Icon
                  size={sizes.iconPx}
                  color={colors.text}
                  strokeWidth={sizes.iconStrokePx}
                  absoluteStrokeWidth
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: layout.labelX + interpolate(labelIn, [0, 1], [40, 0], { easing: easeOut }),
                  top: rowY - 48,
                  height: 96,
                  display: "flex",
                  alignItems: "center",
                  fontFamily,
                  fontWeight: 600,
                  fontSize: sizes.labelPx,
                  color: colors.text,
                  opacity: labelIn * labelFade,
                }}
              >
                {item.label}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
