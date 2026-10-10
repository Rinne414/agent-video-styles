import { circ, gull, land, lighthouse, sea } from "../parts.mjs";

// Title: centred tower on a small islet, low sun behind it.
export default {
  id: "title",
  anims: { waves: { sway: [8, 120] }, gulls: { bob: [6, 90] } },
  shapes: () => [
    { d: circ(540, 1190, 200), fill: "mustard" },
    ...sea(70, 1010, 1280, 1540, [[130, 1340, 140], [790, 1330, 150], [150, 1440, 120], [820, 1450, 110]]),
    ...land("M200 1500C340 1400 440 1385 540 1388C650 1385 760 1400 880 1500", 200, 880, 1545, "sage"),
    ...lighthouse({ cx: 540, by: 1400, h: 600, wb: 92, wt: 58 }),
    gull(230, 1000, 70, "gulls"),
    gull(330, 940, 56, "gulls"),
    gull(780, 1020, 64, "gulls"),
  ],
};
