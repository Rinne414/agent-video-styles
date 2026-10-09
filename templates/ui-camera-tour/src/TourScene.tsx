import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { FORMAT, MOTION, WINDOW } from "./theme";
import { cameraAt, clickFrameOf, clickFx, isCameraMoving, SWAP_FRAME, tiltAt } from "./timeline";
import { Backdrop, Callouts, Cursor, Headline, Spotlights } from "./overlays";
import { Outro, uiOpacityAt } from "./Outro";
import { Dashboard } from "./ui/Dashboard";
import { InvoicePage } from "./ui/InvoicePage";
import { Sidebar, WindowChrome, WindowFrame } from "./ui/Shell";

const SWAP_FADE = 6;

const AppWindow: React.FC = () => {
  const frame = useCurrentFrame();
  const swap = interpolate(frame, [SWAP_FRAME, SWAP_FRAME + SWAP_FADE], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const btnClick = clickFrameOf("newBtn");
  const press = frame >= btnClick && frame < btnClick + 6 ? clickFx(frame).press : 0;
  return (
    <WindowFrame>
      <WindowChrome />
      <Sidebar activeIndex={swap > 0.5 ? 1 : 0} />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - swap, transform: `translateY(${-10 * swap}px)` }}>
        {swap < 1 ? <Dashboard btnPress={press} /> : null}
      </div>
      <div style={{ position: "absolute", inset: 0, opacity: swap, transform: `translateY(${10 * (1 - swap)}px)` }}>
        {swap > 0 ? <InvoicePage /> : null}
      </div>
    </WindowFrame>
  );
};

const World: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pose = cameraAt(frame);
  const tilt = tiltAt(frame);
  const enter = spring({ frame, fps, config: { damping: 22, stiffness: 90 } });
  const tx = FORMAT.width / 2 - pose.cx * pose.z;
  const ty = FORMAT.height / 2 - pose.cy * pose.z;
  const uiOpacity = uiOpacityAt(frame);
  return (
    <AbsoluteFill>
      <Backdrop pose={pose} />
      <AbsoluteFill
        style={{
          transform: `perspective(2000px) rotateX(${10 * tilt}deg) rotateY(${-14 * tilt}deg)`,
          transformOrigin: "50% 50%",
          opacity: interpolate(enter, [0, 1], [0, 1]) * uiOpacity,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: WINDOW.w,
            height: WINDOW.h,
            transform: `translate(${tx}px, ${ty}px) scale(${pose.z * (0.94 + 0.06 * enter)})`,
            transformOrigin: "0 0",
          }}
        >
          <AppWindow />
          <Spotlights />
          <Callouts z={pose.z} />
          <div style={{ opacity: interpolate(uiOpacity, [0.3, 1], [0, 1]) }}>
            <Cursor z={pose.z} />
          </div>
        </div>
      </AbsoluteFill>
      <Headline />
      <Outro />
    </AbsoluteFill>
  );
};

export const TourScene: React.FC = () => {
  const frame = useCurrentFrame();
  const moving = isCameraMoving(frame);
  return moving ? (
    <CameraMotionBlur samples={MOTION.blurSamples} shutterAngle={MOTION.shutterAngle}>
      <World />
    </CameraMotionBlur>
  ) : (
    <World />
  );
};
