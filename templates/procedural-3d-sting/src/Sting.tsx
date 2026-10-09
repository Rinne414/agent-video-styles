import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { C, T, ease } from "./theme";
import { buildRig, toPx } from "./rig";
import { Prism } from "./Prism";
import { Light, hitEnvelope } from "./Light";
import { Dust } from "./Dust";
import { Wordmark } from "./Wordmark";
import { Overlay } from "./Overlay";
import { Environment } from "./Environment";

/** Camera position is derived from the frame; this keeps the R3F camera aimed at the origin. */
const CameraSync: React.FC<{ position: number[] }> = ({ position }) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(position[0], position[1], position[2]);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  return null;
};

export const Sting: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const rig = buildRig(frame, width, height);
  const hit = hitEnvelope(frame);
  const hitPx = toPx(rig.entry, rig.camera, width, height);
  const rimOn = ease(frame, [8, 30]);
  const glow = Math.max(hit, 0.35 * ease(frame, [T.hit, T.hit + 20]) * ease(frame, T.beamFadeOut, [1, 0.3]));

  return (
    <AbsoluteFill style={{ background: C.colors.void }}>
      <ThreeCanvas
        width={width}
        height={height}
        camera={{ fov: C.camera.fov, position: rig.camera.position.toArray(), near: 0.1, far: 100 }}
        flat
        gl={{ antialias: true }}
      >
        <CameraSync position={rig.camera.position.toArray()} />
        <Environment />
        <ambientLight intensity={0.08} />
        <directionalLight position={[3, 4, 5]} intensity={2.4} />
        <directionalLight position={[-3, 2, -4]} intensity={5 * rimOn} color={C.colors.rim} />
        <Dust frame={frame} />
        <Prism rig={rig} frame={frame} glow={glow} />
        <Light frame={frame} rig={rig} />
      </ThreeCanvas>
      <Overlay frame={frame} hit={hit} hitPx={hitPx} centerY={height / 2} />
      <Wordmark frame={frame} centerY={height / 2} />
    </AbsoluteFill>
  );
};
