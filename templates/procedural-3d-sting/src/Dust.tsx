import React from "react";
import { random } from "remotion";
import { C, T, ease } from "./theme";

/** Seeded motes drifting in the void. Position is a pure function of the frame. */
export const Dust: React.FC<{ frame: number }> = ({ frame }) => {
  const fade = ease(frame, T.dustFadeIn);
  const motes = Array.from({ length: C.dust.count }, (_, i) => {
    const r = (k: string) => random(`${C.dust.seed}-${i}-${k}`);
    const x0 = (r("x") - 0.5) * 12;
    const y0 = (r("y") - 0.5) * 6.5;
    const z = -2.5 + r("z") * 4;
    const speed = 0.004 + r("s") * 0.01;
    const size = 0.012 + r("size") * 0.022;
    const twinkle = 0.5 + 0.5 * Math.sin(frame * (0.05 + r("t") * 0.08) + r("p") * 6.28);
    return { x: x0 + frame * speed, y: y0 + Math.sin(frame * 0.02 + r("p") * 6.28) * 0.08, z, size, o: twinkle * (0.15 + r("o") * 0.35) * fade };
  });
  return (
    <>
      {motes.map((m, i) => (
        <mesh key={i} position={[m.x, m.y, m.z]}>
          <sphereGeometry args={[m.size, 8, 8]} />
          <meshBasicMaterial color="#b9c3ff" transparent opacity={m.o} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
};
