import React, { useMemo } from "react";
import { AdditiveBlending, Color, Vector3 } from "three";

const vertexShader = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

// Soft gaussian cross-section, optional comet head, fading tail. Output is additive light.
const fragmentShader = /* glsl */ `
varying vec2 vUv;
uniform vec3 uColor;
uniform float uIntensity;
uniform float uSoft;
uniform float uStartFade;
uniform float uEndPow;
uniform float uHead;
void main() {
  float y = abs(vUv.y - 0.5) * 2.0;
  float side = exp(-pow(y * uSoft, 2.0));
  float start = uStartFade > 0.0 ? smoothstep(0.0, uStartFade, vUv.x) : 1.0;
  float tail = pow(max(1.0 - vUv.x, 0.0), uEndPow);
  float head = 1.0 + uHead * pow(vUv.x, 10.0);
  float a = side * start * tail * head * uIntensity;
  gl_FragColor = vec4(uColor, a);
}`;

type BeamProps = {
  from: Vector3;
  angle: number;
  length: number;
  width: number;
  color: string;
  intensity: number;
  soft?: number;
  startFade?: number;
  endPow?: number;
  head?: number;
};

/** A straight ray of light in the XY plane of its origin, drawn as an additive soft strip. */
export const Beam: React.FC<BeamProps> = ({
  from,
  angle,
  length,
  width,
  color,
  intensity,
  soft = 2.4,
  startFade = 0,
  endPow = 0.6,
  head = 0,
}) => {
  const uniforms = useMemo(
    () => ({
      uColor: { value: new Color() },
      uIntensity: { value: 0 },
      uSoft: { value: 2.4 },
      uStartFade: { value: 0 },
      uEndPow: { value: 0.6 },
      uHead: { value: 0 },
    }),
    [],
  );
  if (intensity <= 0.001 || length <= 0.001) return null;
  return (
    <group position={from} rotation={[0, 0, angle]}>
      <mesh position={[length / 2, 0, 0]} scale={[length, width, 1]} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          depthTest={false}
          blending={AdditiveBlending}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          uniforms-uColor-value={new Color(color)}
          uniforms-uIntensity-value={intensity}
          uniforms-uSoft-value={soft}
          uniforms-uStartFade-value={startFade}
          uniforms-uEndPow-value={endPow}
          uniforms-uHead-value={head}
        />
      </mesh>
    </group>
  );
};
