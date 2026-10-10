import { arch, circ, keeper, line, poly, rrect } from "../parts.mjs";

// Sawtooth stair flight from (x0,y0) up to (x1,y1), n steps, plank thickness t.
function flight(x0, y0, x1, y1, n, t = 26) {
  const top = [[x0, y0]];
  for (let k = 0; k < n; k++) {
    const xa = x0 + ((x1 - x0) * k) / n;
    const xb = x0 + ((x1 - x0) * (k + 1)) / n;
    const yb = y0 + ((y1 - y0) * (k + 1)) / n;
    top.push([xa, yb], [xb, yb]);
  }
  return poly([...top, [x1, y1 + t], [x0, y0 + t]]);
}

// Scene 2: cutaway of the tower shaft, three zigzag flights, keeper mid-climb with a lantern.
export default {
  id: "climb",
  anims: { lantern: { blink: [0.7, 40] }, star: { blink: [0.4, 70] } },
  shapes: () => {
    const kx = 612;
    const kf = 1238;
    const s = 1.1;
    const hand = [kx - 24 * s - 40 * s, kf - 62 * s - 86 * s + 22 * s + 28 * s];
    return [
      { d: poly([[260, 1590], [260, 872], [282, 850], [300, 872], [300, 1560], [780, 1560], [780, 872], [802, 850], [820, 872], [820, 1590]]), fill: "gray" },
      { d: arch(680, 990, 70, 160), fill: "slate" },
      { d: arch(330, 1190, 70, 160), fill: "slate" },
      { d: flight(300, 1560, 780, 1330, 10), fill: "sage" },
      { d: flight(780, 1330, 300, 1100, 10), fill: "sage" },
      { d: flight(300, 1100, 780, 870, 10), fill: "sage" },
      ...keeper({ x: kx, foot: kf, s, face: -1, legL: -20, legR: 16, armL: [-40, 28], armR: [24, 50] }),
      { d: line(hand[0], hand[1], hand[0], hand[1] + 12) },
      { d: rrect(hand[0] - 18, hand[1] + 12, 36, 48, 8), fill: "mustard", g: "lantern" },
      { d: circ(hand[0], hand[1] + 36, 7), g: "lantern" },
    ];
  },
};
