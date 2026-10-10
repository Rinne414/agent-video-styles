import { circ, land, lighthouse, poly, rocks, sea, ship, star } from "../parts.mjs";

// Scene 4: night sea. Tower on the left throws a beam across water; rocks mid-sea, ship far right.
export default {
  id: "beam",
  anims: { waves: { sway: [8, 120] }, bob: { bob: [6, 90] }, stars: { blink: [0.35, 70] }, beam: { bob: [5, 120] } },
  shapes: () => [
    { d: circ(830, 690, 58), fill: "mustard" },
    star(400, 640, 12, "stars"),
    star(570, 720, 9, "stars"),
    star(640, 590, 11, "stars"),
    star(960, 880, 9, "stars"),
    ...sea(70, 1010, 1150, 1560, [[480, 1420, 150], [330, 1480, 130], [700, 1470, 150], [900, 1420, 100]]),
    ...rocks([[520, 1330], [565, 1200], [605, 1260], [650, 1090], [705, 1250], [745, 1330]]),
    ...land("M70 1495C170 1470 300 1470 420 1510", 70, 420, 1560, "sage"),
    ...lighthouse({ cx: 220, by: 1500, h: 620, wb: 92, wt: 58, lit: true, door: false }),
    { d: poly([[262, 822], [1008, 1200], [1008, 1400], [262, 838]]), fill: "mustard", stroke: false, op: 0.5, g: "beam" },
    ...ship({ x: 850, y: 1370, s: 0.9, g: "bob" }),
  ],
};
