import { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { colors } from "./theme";

const CURVE_R = 1.5;
const WALL_Z = -4.5;
const SHADOW_OPACITY = 0.2;

/** Brightness of the sweep at (x, y, z): soft pool of light behind the product, falling off to the edges. */
function sweepBrightness(x: number, y: number, z: number): number {
  const d = Math.hypot(x * 0.55, z + 1.2 + y * 0.8);
  const pool = 1 - 0.2 * Math.min(d / 9, 1.4);
  const wallFade = 1 - 0.12 * Math.min(y / 8, 1);
  return pool * wallFade;
}

/** Floor and wall joined by a quarter-circle, extruded across X, with baked vertex-colour light. */
function buildSweep(): THREE.BufferGeometry {
  const profile: [number, number][] = []; // [y, z]
  profile.push([0, 30]);
  profile.push([0, 12]);
  profile.push([0, 4]);
  profile.push([0, WALL_Z + CURVE_R]);
  const steps = 24;
  for (let i = 1; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    profile.push([CURVE_R - Math.cos(a) * CURVE_R, WALL_Z + CURVE_R - Math.sin(a) * CURVE_R]);
  }
  profile.push([6, WALL_Z]);
  profile.push([30, WALL_Z]);
  const cols = 24;
  const half = 40;
  const base = new THREE.Color(colors.sweep);
  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  profile.forEach(([y, z]) => {
    for (let c = 0; c <= cols; c++) {
      const x = -half + (2 * half * c) / cols;
      pos.push(x, y, z);
      const b = sweepBrightness(x, y, z);
      col.push(base.r * b, base.g * b, base.b * b);
    }
  });
  const row = cols + 1;
  for (let i = 0; i < profile.length - 1; i++) {
    for (let c = 0; c < cols; c++) {
      const a = i * row + c;
      idx.push(a, a + row, a + 1, a + 1, a + row, a + row + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function blobTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, "rgba(20,20,26,1)");
  g.addColorStop(0.35, "rgba(20,20,26,0.55)");
  g.addColorStop(1, "rgba(20,20,26,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const Blob = ({ x, sx, sz, opacity, tex }: { x: number; sx: number; sz: number; opacity: number; tex: THREE.Texture }) => (
  <mesh position={[x, 0.004, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[sx, sz, 1]} renderOrder={1}>
    <planeGeometry args={[1, 1]} />
    <meshBasicMaterial map={tex} transparent opacity={opacity} depthWrite={false} toneMapped={false} />
  </mesh>
);

/** Baked radial-gradient contact shadow; rotates with the product. */
export const ContactShadow = ({ yaw }: { yaw: number }) => {
  const tex = useMemo(blobTexture, []);
  return (
    <group rotation={[0, yaw, 0]}>
      <Blob x={0} sx={4.4} sz={2.2} opacity={0.22} tex={tex} />
      <Blob x={1.1} sx={1.5} sz={1.4} opacity={0.5} tex={tex} />
      <Blob x={-1.1} sx={1.5} sz={1.4} opacity={0.5} tex={tex} />
    </group>
  );
};

export const Studio = ({ keyAngle }: { keyAngle: number }) => {
  const { gl, scene } = useThree();
  const sweep = useMemo(buildSweep, []);
  useMemo(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const tex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.55;
    scene.background = new THREE.Color(colors.sweep);
    pmrem.dispose();
  }, [gl, scene]);

  // Key light sweeps once across the reveal: keyAngle is the azimuth offset in radians.
  const kx = Math.sin(keyAngle + 0.62) * 7.2;
  const kz = Math.cos(keyAngle + 0.62) * 7.2;
  return (
    <>
      <mesh geometry={sweep}>
        <meshBasicMaterial vertexColors toneMapped={false} />
      </mesh>
      <mesh geometry={sweep} receiveShadow renderOrder={0}>
        <shadowMaterial opacity={SHADOW_OPACITY} depthWrite={false} />
      </mesh>
      <ambientLight intensity={0.08} />
      <hemisphereLight args={["#FFFFFF", "#D8D2C8", 0.12]} />
      <directionalLight
        position={[kx, 6, kz]}
        intensity={1.0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={10}
        shadow-blurSamples={20}
        shadow-bias={-0.0004}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-camera-near={1}
        shadow-camera-far={25}
      />
      <directionalLight position={[-5, 4, -4]} intensity={1.2} color="#BFD6FF" />
    </>
  );
};
