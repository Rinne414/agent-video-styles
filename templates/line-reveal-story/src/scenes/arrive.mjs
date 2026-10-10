import { circ, keeper, land, lighthouse, line, sea } from "../parts.mjs";

// Scene 1: wide shot. Keeper walks along the cliff towards the tower on the right.
export default {
  id: "arrive",
  anims: { waves: { sway: [8, 120] }, gulls: { bob: [6, 90] } },
  shapes: () => [
    { d: `M142 1230A120 120 0 0 1 382 1230Z`, fill: "mustard" },
    ...sea(70, 1010, 1230, 1520, [[560, 1300, 140], [820, 1350, 140], [420, 1410, 120]]),
    { d: line(170, 1275, 330, 1275) },
    { d: line(200, 1312, 300, 1312) },
    { d: line(230, 1348, 270, 1348) },
    ...land("M70 1510C250 1440 400 1450 560 1490C720 1530 860 1470 1010 1450", 70, 1010, 1620, "sage"),
    ...lighthouse({ cx: 790, by: 1500, h: 620, wb: 92, wt: 58 }),
    ...keeper({ x: 330, foot: 1462, s: 1.4, face: 1, legL: -24, legR: 22, armL: [-24, 52], armR: [26, 48] }),
    { d: `M540 1000q18 -22 36 0q18 -22 36 0`, g: "gulls" },
    { d: `M640 950q14 -18 28 0q14 -18 28 0`, g: "gulls" },
  ],
};
