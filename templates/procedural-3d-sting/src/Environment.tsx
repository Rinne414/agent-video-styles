import React, { useMemo } from "react";
import { useThree } from "@react-three/fiber";
import { BoxGeometry, Color, Mesh, MeshBasicMaterial, PMREMGenerator, Scene } from "three";

/** One emissive strip in the reflection studio: [width, height, x, y, z, hdr colour]. */
const STRIPS: [number, number, number, number, number, [number, number, number]][] = [
  [0.5, 9, -6, 0, 4, [7, 7, 8]], // tall key softbox, front left
  [10, 0.35, 0, 5.5, 3, [4, 4.5, 6]], // top bar
  [0.7, 7, 6.5, 0, -3, [5, 3, 10]], // violet rim strip, behind right
  [10, 0.25, 0, -5.5, 2, [1.5, 4, 6]], // cool floor bar
];

/** Reflection studio generated in code (no HDRI download): dark room, a few bright strips. */
export const Environment: React.FC = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const texture = useMemo(() => {
    const studio = new Scene();
    studio.background = new Color("#02030a");
    for (const [w, h, x, y, z, rgb] of STRIPS) {
      const material = new MeshBasicMaterial();
      material.color.setRGB(rgb[0], rgb[1], rgb[2]);
      const mesh = new Mesh(new BoxGeometry(w, h, 0.1), material);
      mesh.position.set(x, y, z);
      mesh.lookAt(0, 0, 0);
      studio.add(mesh);
    }
    const pmrem = new PMREMGenerator(gl);
    const tex = pmrem.fromScene(studio, 0.02).texture;
    pmrem.dispose();
    scene.environmentIntensity = 1;
    return tex;
  }, [gl, scene]);
  return <primitive object={texture} attach="environment" />;
};
