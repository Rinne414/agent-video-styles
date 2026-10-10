import { circ, keeper, line, rrect } from "../parts.mjs";

// Scene 3: inside the lantern room. Keeper touches a taper to the great lamp; rays pulse.
export default {
  id: "light",
  anims: { flame: { blink: [0.75, 24] }, rays: { blink: [0.35, 60] } },
  shapes: () => {
    const rays = [];
    for (let i = 0; i < 10; i++) {
      const a = (Math.PI * 2 * i) / 10 + 0.15;
      rays.push({ d: line(540 + Math.cos(a) * 112, 1220 + Math.sin(a) * 112, 540 + Math.cos(a) * 150, 1220 + Math.sin(a) * 150), g: "rays" });
    }
    return [
      { d: `M190 930Q540 590 890 930Z`, fill: "rose" },
      { d: rrect(150, 1480, 780, 60, 10), fill: "gray" },
      { d: rrect(210, 900, 660, 34, 6), fill: "gray" },
      { d: rrect(210, 934, 36, 546, 6), fill: "gray" },
      { d: rrect(834, 934, 36, 546, 6), fill: "gray" },
      { d: rrect(256, 950, 170, 510, 10), fill: "slate" },
      { d: rrect(436, 950, 208, 510, 10), fill: "slate" },
      { d: rrect(654, 950, 170, 510, 10), fill: "slate" },
      { d: rrect(496, 1350, 88, 130, 10), fill: "gray" },
      ...rays,
      { d: circ(540, 1220, 92), fill: "mustard" },
      { d: circ(540, 1220, 50) },
      ...keeper({ x: 290, foot: 1480, s: 1.5, face: 1, legL: -14, legR: 16, armL: [-24, 50], armR: [59, -19] }),
      { d: line(414, 1262, 452, 1172) },
      { d: `M452 1172q-14 -22 0 -44q14 22 0 44Z`, fill: "mustard", g: "flame" },
    ];
  },
};
