import { circ, land, lighthouse, poly, rocks, sea, ship, star } from "../parts.mjs";

// Closing: ship has slipped past the rocks; tower on the right, beam trailing over the water.
export default {
  id: "safe",
  anims: { waves: { sway: [8, 120] }, bob: { bob: [6, 90], drift: [-50, 50] }, stars: { blink: [0.35, 70] }, beam: { bob: [5, 120] } },
  shapes: () => [
    { d: circ(200, 700, 54), fill: "mustard" },
    star(380, 640, 12, "stars"),
    star(520, 760, 9, "stars"),
    star(640, 620, 11, "stars"),
    star(120, 900, 9, "stars"),
    ...sea(70, 1010, 1200, 1560, [[120, 1500, 150], [460, 1520, 150], [640, 1450, 120]]),
    ...rocks([[500, 1340], [540, 1260], [585, 1300], [620, 1210], [665, 1290], [700, 1340]]),
    ...land("M690 1520C780 1420 880 1385 1010 1400", 690, 1010, 1560, "sage"),
    ...lighthouse({ cx: 880, by: 1400, h: 520, wb: 76, wt: 48, lit: true, door: false }),
    { d: poly([[836, 832], [80, 1120], [80, 1330], [836, 846]]), fill: "mustard", stroke: false, op: 0.5, g: "beam" },
    ...ship({ x: 290, y: 1400, s: 1.3, g: "bob" }),
  ],
};
