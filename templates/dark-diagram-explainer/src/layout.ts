import type { Pt } from "./anim";

/** World coordinates (the camera moves over this 1920x1080-based canvas). */
export const POS = {
  userT: [300, 380] as Pt,
  userP: [300, 680] as Pt,
  edgeT: [860, 380] as Pt,
  edgeP: [860, 680] as Pt,
  origin: [1560, 530] as Pt,
};

const HALF_W = 125;
const HALF_H = 75;

export const side = (p: Pt, dir: "l" | "r" | "t" | "b"): Pt =>
  dir === "l"
    ? [p[0] - HALF_W, p[1]]
    : dir === "r"
      ? [p[0] + HALF_W, p[1]]
      : dir === "t"
        ? [p[0], p[1] - HALF_H]
        : [p[0], p[1] + HALF_H];

/** Straight links between node borders. */
export const LINKS = {
  userTEdgeT: [side(POS.userT, "r"), side(POS.edgeT, "l")] as [Pt, Pt],
  userPEdgeP: [side(POS.userP, "r"), side(POS.edgeP, "l")] as [Pt, Pt],
  edgeTOrigin: [side(POS.edgeT, "r"), side(POS.origin, "l")] as [Pt, Pt],
  edgePOrigin: [side(POS.edgeP, "r"), side(POS.origin, "l")] as [Pt, Pt],
};

/** Long direct route user (Tokyo) -> origin, drawn as an arc over the top. */
export const ARC: [Pt, Pt, Pt, Pt] = [
  side(POS.userT, "t"),
  [POS.userT[0], 120],
  [POS.origin[0], 120],
  side(POS.origin, "t"),
];
export const ARC_D = `M ${ARC[0].join(" ")} C ${ARC[1].join(" ")} ${ARC[2].join(" ")} ${ARC[3].join(" ")}`;
