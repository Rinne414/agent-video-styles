import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Burst } from "./scenes/Burst";
import { IconsBadge } from "./scenes/IconsBadge";
import { Tagline } from "./scenes/Tagline";
import { Title } from "./scenes/Title";
import { badgeGroup, colors, layout, progress, rowsCenter, timing, video } from "./theme";

export const IconBurstTitle = () => {
  const frame = useCurrentFrame();
  const camera = interpolate(frame, [0, video.durationInFrames], [1, timing.cameraZoomEnd]);
  const fadeOut = 1 - progress(frame, video.durationInFrames - timing.fadeOutFrames, timing.fadeOutFrames, (t) => t);
  // One soft glow behind the current focal point: screen center, then the badge.
  const toBadge = progress(frame, timing.orbitStart, timing.orbitFrames);
  const group = badgeGroup(frame);
  const glowX = layout.centerX + group.x;
  const glowY = interpolate(toBadge, [0, 1], [layout.centerY, rowsCenter.y]);

  return (
    <AbsoluteFill style={{ background: colors.ground }}>
      <AbsoluteFill style={{ transform: `scale(${camera})`, opacity: fadeOut }}>
        <div
          style={{
            position: "absolute",
            left: glowX - 350,
            top: glowY - 350,
            width: 700,
            height: 700,
            background: `radial-gradient(circle, ${colors.accent}2E 0%, ${colors.accent}00 70%)`,
          }}
        />
        <Burst />
        <Title />
        <IconsBadge />
        <Tagline />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
