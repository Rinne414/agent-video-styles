import { Easing, interpolate } from "remotion";
import * as THREE from "three";
import { camera as cam, meta, timing, turn } from "./theme";

const DEG = Math.PI / 180;
const clamp01 = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const inOut4 = Easing.inOut(Easing.poly(4));

/** Frame at the middle of feature i's callout hold. */
export const holdCenter = (i: number) =>
  timing.revealEnd + i * timing.featureLength + (timing.calloutIn + timing.calloutOut) / 2;

/** Turntable yaw in radians: slow at each feature stop, 360 deg in total. */
export function yawAt(frame: number): number {
  const frames = [0, ...turn.stopYawDeg.map((_, i) => holdCenter(i)), timing.lockupSettle];
  const yaws = [0, ...turn.stopYawDeg, turn.endYawDeg];
  let seg = frames.length - 2;
  for (let i = 0; i < frames.length - 1; i++) {
    if (frame < frames[i + 1]) {
      seg = i;
      break;
    }
  }
  const a = interpolate(frame, [frames[seg], frames[seg + 1]], [yaws[seg], yaws[seg + 1]], {
    ...clamp01,
    easing: inOut4,
  });
  return a * DEG;
}

/** 0 = cups upright, 1 = cups swivelled flat. */
export function foldAt(frame: number): number {
  const ease = Easing.inOut(Easing.cubic);
  const fold = interpolate(frame, [timing.foldStart, timing.foldEnd], [0, 1], { ...clamp01, easing: ease });
  const unfold = interpolate(frame, [timing.unfoldStart, timing.unfoldEnd], [0, 1], { ...clamp01, easing: ease });
  return fold - unfold;
}

export function cameraAt(frame: number) {
  const sine = Easing.inOut(Easing.sin);
  const push = interpolate(frame, [0, timing.lockupSettle], [0, 1], { ...clamp01, easing: sine });
  const dist = cam.distanceFrom + (cam.distanceTo - cam.distanceFrom) * push;
  const az = cam.orbitDeg * DEG * push;
  const el = cam.elevationDeg * DEG;
  const lift = interpolate(frame, [timing.lockupSettle - 40, timing.lockupSettle], [0, 1], {
    ...clamp01,
    easing: Easing.out(Easing.cubic),
  });
  const targetY = cam.targetY + (cam.lockupTargetY - cam.targetY) * lift;
  const target = new THREE.Vector3(0, targetY, 0);
  const position = new THREE.Vector3(
    Math.sin(az) * Math.cos(el) * dist,
    Math.sin(el) * dist + targetY,
    Math.cos(az) * Math.cos(el) * dist,
  );
  return { position, target, fov: cam.fov };
}

/** Build a camera object from the shared cameraAt helper (used for DOM projection). */
export function threeCameraAt(frame: number): THREE.PerspectiveCamera {
  const { position, target, fov } = cameraAt(frame);
  const c = new THREE.PerspectiveCamera(fov, meta.width / meta.height, 0.1, 100);
  c.position.copy(position);
  c.lookAt(target);
  c.updateMatrixWorld();
  c.updateProjectionMatrix();
  return c;
}

/** Anchor points in model space (position + outward normal). */
export const ANCHORS: Record<string, { p: THREE.Vector3; n: THREE.Vector3 }> = {
  cupLeft: { p: new THREE.Vector3(-1.32, 0.62, 0.0), n: new THREE.Vector3(-1, 0, 0) },
  cupRight: { p: new THREE.Vector3(1.32, 0.62, 0.0), n: new THREE.Vector3(1, 0, 0) },
  hingeRight: { p: new THREE.Vector3(1.1, 1.17, 0.0), n: new THREE.Vector3(1, 0.2, 0) },
};

export function projectAnchor(frame: number, name: string) {
  const { p, n } = ANCHORS[name];
  const rot = new THREE.Matrix4().makeRotationY(yawAt(frame));
  const world = p.clone().applyMatrix4(rot);
  const normal = n.clone().transformDirection(rot);
  const cam3 = threeCameraAt(frame);
  const view = cam3.position.clone().sub(world).normalize();
  const facing = normal.dot(view);
  const ndc = world.clone().project(cam3);
  return { x: ((ndc.x + 1) / 2) * meta.width, y: ((1 - ndc.y) / 2) * meta.height, facing };
}
