import { useMemo } from "react";
import * as THREE from "three";
import { colors } from "./theme";

const CUP_Y = 0.62;
const CUP_X = 1.1;
const BAND_CENTER_Y = 1.45;
const BAND_R = 1.1;
const BAND_YSCALE = 1.1;
const KNUCKLE_Y = 1.3;

/** Disc with rounded edges, axis along local Y. */
function roundedDisc(radius: number, depth: number, corner: number): THREE.LatheGeometry {
  const h = depth / 2;
  const pts: THREE.Vector2[] = [new THREE.Vector2(0, h)];
  const steps = 10;
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - corner + Math.sin(a) * corner, h - corner + Math.cos(a) * corner));
  }
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    pts.push(new THREE.Vector2(radius - corner + Math.cos(a) * corner, -h + corner - Math.sin(a) * corner));
  }
  pts.push(new THREE.Vector2(0, -h));
  return new THREE.LatheGeometry(pts, 64);
}

const Cup = ({ side, fold }: { side: 1 | -1; fold: number }) => {
  const shell = useMemo(() => roundedDisc(0.62, 0.34, 0.09), []);
  const plate = useMemo(() => roundedDisc(0.46, 0.04, 0.015), []);
  // Cup axis is X. Swivel about the vertical axis through the cup centre.
  const swivel = -side * fold * (Math.PI / 2);
  return (
    <group position={[side * CUP_X, CUP_Y, 0]} rotation={[0, swivel, 0]}>
      <group rotation={[0, 0, side * (Math.PI / 2)]}>
        <mesh geometry={shell} castShadow receiveShadow>
          <meshStandardMaterial color={colors.shell} roughness={0.45} metalness={0.05} />
        </mesh>
        <mesh geometry={plate} position={[0, -0.18, 0]} castShadow>
          <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={1} />
        </mesh>
        <mesh position={[0, -0.205, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.3, 0.012, 12, 64]} />
          <meshStandardMaterial color={colors.shell} roughness={0.5} metalness={0.2} />
        </mesh>
        <mesh position={[0.17, -0.205, 0.17]}>
          <cylinderGeometry args={[0.035, 0.035, 0.012, 24]} />
          <meshStandardMaterial color="#0A0A0C" roughness={0.6} />
        </mesh>
      </group>
      <mesh position={[-side * 0.2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.5, 0.14, 32, 64]} />
        <meshStandardMaterial color={colors.cushion} roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
};

const Band = () => (
  <group position={[0, BAND_CENTER_Y, 0]} scale={[1, BAND_YSCALE, 1]}>
    <mesh castShadow>
      <torusGeometry args={[BAND_R, 0.07, 24, 128, Math.PI]} />
      <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={1} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2 - 0.8]} castShadow>
      <torusGeometry args={[BAND_R - 0.06, 0.085, 24, 96, 1.6]} />
      <meshStandardMaterial color={colors.cushion} roughness={0.85} />
    </mesh>
    {[-1, 1].map((k) => {
      const a = Math.PI / 2 + k * 0.8;
      return (
        <mesh key={k} position={[(BAND_R - 0.06) * Math.cos(a), (BAND_R - 0.06) * Math.sin(a), 0]}>
          <sphereGeometry args={[0.085, 24, 16]} />
          <meshStandardMaterial color={colors.cushion} roughness={0.85} />
        </mesh>
      );
    })}
  </group>
);

const Yoke = ({ side }: { side: 1 | -1 }) => (
  <group position={[side * CUP_X, 0, 0]}>
    <mesh position={[0, (BAND_CENTER_Y + KNUCKLE_Y) / 2, 0]} castShadow>
      <capsuleGeometry args={[0.055, BAND_CENTER_Y - KNUCKLE_Y, 8, 24]} />
      <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={1} />
    </mesh>
    <mesh position={[0, KNUCKLE_Y - 0.02, 0]} castShadow>
      <cylinderGeometry args={[0.1, 0.1, 0.18, 48]} />
      <meshStandardMaterial color={colors.metal} roughness={0.3} metalness={1} />
    </mesh>
  </group>
);

export const Headphones = ({ fold }: { fold: number }) => (
  <group>
    <Band />
    <Yoke side={1} />
    <Yoke side={-1} />
    <Cup side={1} fold={fold} />
    <Cup side={-1} fold={fold} />
  </group>
);
