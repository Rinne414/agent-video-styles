import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import * as THREE from "three";
import { Headphones } from "./Headphones";
import { cameraAt, foldAt, yawAt } from "./motion";
import { ContactShadow, Studio } from "./Studio";

const KEY_SWEEP_FRAMES = 70;
const KEY_SWEEP_RAD = (20 * Math.PI) / 180;

const Rig = ({ frame }: { frame: number }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const { position, target, fov } = cameraAt(frame);
  camera.position.copy(position);
  camera.fov = fov;
  camera.lookAt(target);
  camera.updateProjectionMatrix();
  return null;
};

export const Scene = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const yaw = yawAt(frame);
  const keyAngle = interpolate(frame, [0, KEY_SWEEP_FRAMES], [-KEY_SWEEP_RAD, 0], {
    extrapolateRight: "clamp",
  });
  return (
    <ThreeCanvas
      width={width}
      height={height}
      shadows="variance"
      flat
      gl={{ antialias: true }}
      camera={{ fov: 40, near: 0.1, far: 100, position: [0, 3, 7.5] }}
    >
      <Rig frame={frame} />
      <Studio keyAngle={keyAngle} />
      <ContactShadow yaw={yaw} />
      <group rotation={[0, yaw, 0]}>
        <Headphones fold={foldAt(frame)} />
      </group>
    </ThreeCanvas>
  );
};
