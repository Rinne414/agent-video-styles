import React, { useMemo } from "react";
import { Color, ExtrudeGeometry, Shape } from "three";
import { C, T, ease } from "./theme";
import { PRISM_H, Rig } from "./rig";

const buildGeometry = () => {
  const s = C.layout.prismSide;
  const shape = new Shape();
  shape.moveTo(-s / 2, -PRISM_H / 2);
  shape.lineTo(s / 2, -PRISM_H / 2);
  shape.lineTo(0, PRISM_H / 2);
  shape.closePath();
  const geo = new ExtrudeGeometry(shape, {
    depth: C.layout.prismDepth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 4,
  });
  geo.translate(0, 0, -C.layout.prismDepth / 2);
  return geo;
};

const vertexShader = /* glsl */ `
varying vec3 vLocal;
varying vec3 vNormalV;
varying vec3 vViewDir;
void main() {
  vLocal = position;
  vNormalV = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

// Procedural glass: tinted vertical gradient, fresnel rim, two travelling sheen bands.
const fragmentShader = /* glsl */ `
varying vec3 vLocal;
varying vec3 vNormalV;
varying vec3 vViewDir;
uniform vec3 uBase;
uniform vec3 uTop;
uniform vec3 uRim;
uniform float uHeight;
uniform float uSweepA;
uniform float uSweepB;
uniform float uGlow;
uniform float uOpacity;
void main() {
  float t = clamp((vLocal.y + uHeight * 0.5) / uHeight, 0.0, 1.0);
  vec3 col = mix(uBase, uTop, pow(t, 1.4));
  float fres = pow(1.0 - abs(dot(normalize(vNormalV), normalize(vViewDir))), 2.2);
  col += uRim * fres * 1.1;
  float d = dot(vLocal.xy, normalize(vec2(0.62, 0.78)));
  float sheenA = exp(-pow((d - uSweepA) * 2.6, 2.0));
  float sheenB = exp(-pow((d - uSweepB) * 3.4, 2.0));
  col += vec3(0.85, 0.9, 1.0) * (sheenA * 0.55 + sheenB * 0.4);
  col += uRim * uGlow * 0.5;
  float alpha = clamp((0.5 + 0.35 * fres + 0.4 * (sheenA + sheenB) + 0.3 * uGlow) * uOpacity, 0.0, 1.0);
  gl_FragColor = vec4(col, alpha);
}`;

/** The single hero object: a glass triangular prism with bright rim edges. */
export const Prism: React.FC<{ rig: Rig; frame: number; glow: number }> = ({ rig, frame, glow }) => {
  const geometry = useMemo(buildGeometry, []);
  const uniforms = useMemo(
    () => ({
      uBase: { value: new Color("#0d1136") },
      uTop: { value: new Color("#5a62d8") },
      uRim: { value: new Color(C.colors.rim) },
      uHeight: { value: PRISM_H },
      uSweepA: { value: 0 },
      uSweepB: { value: 0 },
      uGlow: { value: 0 },
      uOpacity: { value: 1 },
    }),
    [],
  );
  const appear = ease(frame, T.prismFadeIn);
  const scale = 0.92 + 0.08 * appear;
  return (
    <group position={rig.position} rotation={[rig.rotation.x, rig.rotation.y, 0]} scale={scale}>
      <mesh geometry={geometry} renderOrder={5}>
        <shaderMaterial
          transparent
          depthWrite={false}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          uniforms-uSweepA-value={ease(frame, T.sheenA, [-2.6, 2.6])}
          uniforms-uSweepB-value={ease(frame, T.sheenB, [-2.6, 2.6])}
          uniforms-uGlow-value={glow}
          uniforms-uOpacity-value={appear}
        />
      </mesh>
      <lineSegments renderOrder={6}>
        <edgesGeometry args={[geometry, 25]} />
        <lineBasicMaterial color="#cfd6ff" transparent opacity={0.6 * appear + 0.4 * glow} />
      </lineSegments>
    </group>
  );
};
