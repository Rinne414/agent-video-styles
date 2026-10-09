import { Object3D, PerspectiveCamera, Vector3 } from "three";
import { C, T, ease } from "./theme";

const { prismSide: SIDE, prismDepth: DEPTH } = C.layout;
export const PRISM_H = (SIDE * Math.sqrt(3)) / 2;
const FRONT_Z = DEPTH / 2 + 0.03;

/** Light path through the prism, in prism-local units (entry on left face, exit on right face). */
const ENTRY_Y = 0.0;
const EXIT_Y = -0.16 * PRISM_H;
const faceX = (y: number) => (SIDE / 2) * (1 - (y + PRISM_H / 2) / PRISM_H);
const ENTRY_LOCAL = new Vector3(-faceX(ENTRY_Y), ENTRY_Y, FRONT_Z);
const EXIT_LOCAL = new Vector3(faceX(EXIT_Y), EXIT_Y, FRONT_Z);

export type Rig = {
  position: Vector3;
  rotation: { x: number; y: number };
  entry: Vector3;
  exit: Vector3;
  camera: PerspectiveCamera;
};

export const cameraAt = (frame: number, width: number, height: number) => {
  const cam = new PerspectiveCamera(C.camera.fov, width / height, 0.1, 100);
  const dist = ease(frame, T.orbit, C.camera.distance);
  const camX = ease(frame, T.orbit, C.camera.orbitX);
  cam.position.set(camX, 0.15, dist);
  cam.lookAt(0, 0, 0);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  return cam;
};

export const buildRig = (frame: number, width: number, height: number): Rig => {
  const x = ease(frame, T.slide, [0, C.layout.prismFinalX]);
  const settleEnd = T.orbit[1];
  const ry =
    ease(frame, T.orbit, [-0.5, 0.1]) + Math.max(0, frame - settleEnd) * C.motion.driftRadPerFrame;
  const rx = 0.06;

  const dummy = new Object3D();
  dummy.rotation.set(rx, ry, 0);
  dummy.position.set(x, 0, 0);
  dummy.updateMatrixWorld();
  // lift the group so the exit point sits on world y = 0 (the wordmark centre line)
  const exitY = dummy.localToWorld(EXIT_LOCAL.clone()).y;
  dummy.position.y = -exitY;
  dummy.updateMatrixWorld();

  return {
    position: dummy.position.clone(),
    rotation: { x: rx, y: ry },
    entry: dummy.localToWorld(ENTRY_LOCAL.clone()),
    exit: dummy.localToWorld(EXIT_LOCAL.clone()),
    camera: cameraAt(frame, width, height),
  };
};

/** World point to screen pixels. */
export const toPx = (p: Vector3, camera: PerspectiveCamera, width: number, height: number) => {
  const v = p.clone().project(camera);
  return { x: ((v.x + 1) / 2) * width, y: ((1 - v.y) / 2) * height };
};
