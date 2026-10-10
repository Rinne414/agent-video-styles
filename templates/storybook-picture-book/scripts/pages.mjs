// One scene function per page type. Each returns the inner SVG (without the paper layers).
import { P, T, darken } from "./theme.mjs";
import { sky, sun, moon, bgClouds, hills, moko, garden, GARDEN, GARDEN_BIG, rain, stars, rainbow } from "./art.mjs";

const CLOUDS_A = [[220, 380, 1.0], [1240, 400, 0.8]];
const CLOUDS_B = [[1480, 360, 1.0], [160, 420, 0.7]];
const FAN = { x0: 840, x1: 1080, g0: 240, g1: 1700 };

const puffArcs = (cx, cy, s) =>
  [-1, 1]
    .map((d) =>
      [0, 1, 2]
        .map((n) => `<circle class="puff" data-d="${d}" cx="${cx + d * (270 * s + n * 10)}" cy="${cy + 20 + n * 26}" r="${16 - n * 3}" fill="${P.cloud}" stroke="${T.ink}" stroke-opacity="0.6" stroke-width="4"/>`)
        .join(""))
    .join("");

const SCENES = {
  cover: (pid) => ({
    bg: sky(pid) + sun(1590, 470, 90) + bgClouds(CLOUDS_A),
    ground: hills(pid, 0),
    front: garden(pid, GARDEN.filter((_, i) => i % 2 === 0), { droop: 140 }) + moko(pid, 960, 620, 1.05, "smile"),
  }),
  dry: (pid) => ({
    bg: sky(pid) + sun(1580, 470, 100) + bgClouds(CLOUDS_B),
    ground: hills(pid, 0),
    front: garden(pid, GARDEN, { droop: 140 }) + moko(pid, 700, 630, 0.95, "smile"),
  }),
  droop: (pid) => ({
    bg: sky(pid) + sun(300, 450, 80) + bgClouds([[760, 400, 0.8]]),
    ground: hills(pid, 0),
    front: garden(pid, GARDEN_BIG, { droop: 145, k: 1.7 }) + moko(pid, 1560, 580, 0.5, "smile"),
  }),
  puff: (pid) => ({
    bg: sky(pid) + sun(1650, 480, 80) + bgClouds([[200, 400, 0.9]]),
    ground: hills(pid, 0),
    front: garden(pid, GARDEN, { droop: 140 }) + moko(pid, 960, 630, 1.1, "strain") + puffArcs(960, 630, 1.1),
  }),
  sad: (pid) => ({
    bg: sky(pid) + `<rect width="1920" height="1080" fill="${P.lavender}" opacity="0.28"/>` + bgClouds([[200, 410, 0.8]]),
    ground: hills(pid, 0),
    front: garden(pid, GARDEN, { droop: 150 }) +
      `<g class="wisp" fill="${P.cloud}" fill-opacity="0.85"><circle cx="1230" cy="610" r="22"/><circle cx="1258" cy="598" r="15"/><circle cx="1280" cy="606" r="10"/></g>` +
      moko(pid, 960, 650, 1.0, "sad"),
  }),
  first: (pid) => ({
    bg: sky(pid) + `<rect width="1920" height="1080" fill="${P.lavender}" opacity="0.14"/>` + sun(1620, 470, 80) + bgClouds([[220, 400, 0.9]]),
    ground: hills(pid, 0),
    front: garden(pid, GARDEN, { droop: 140 }) + rain(pid, 8, 11, FAN) + moko(pid, 960, 620, 1.05, "calm"),
  }),
  rain: (pid) => ({
    bg: sky(pid) + `<rect width="1920" height="1080" fill="${P.lavender}" opacity="0.1"/>` + bgClouds([[1500, 380, 0.8], [180, 420, 0.7]]),
    ground: hills(pid, 0.5, 1),
    front: garden(pid, GARDEN, { droop: 100, hs: 0.8 }) + rain(pid, 22, 23, FAN) +
      [[300, 1010], [835, 985], [1385, 990]].map(([x, y]) => `<ellipse class="puddle" cx="${x}" cy="${y}" rx="90" ry="14" fill="${P.sky}" fill-opacity="0.85"/>`).join("") +
      moko(pid, 960, 590, 1.2, "joy"),
  }),
  bloom: (pid) => ({
    bg: sky(pid) + sun(1700, 440, 80) + rainbow(640, 930, 600) + bgClouds([[1380, 380, 0.7]]),
    ground: hills(pid, 1, 0),
    front: garden(pid, GARDEN, { droop: 0, open: 0.6, hs: 0.8 }) + moko(pid, 1400, 570, 0.72, "joy"),
  }),
  night: (pid) => {
    const nightSky = "#B9C9EA";
    return {
      bg: sky(pid, nightSky) + `<rect width="1920" height="1080" fill="${P.lavender}" opacity="0.35"/>` + stars(5, 9) + moon(1600, 450, 62, "#CDC3EB"),
      ground: hills(pid, 1, 0),
      front: garden(pid, GARDEN, { droop: 0, open: 1, hs: 0.72 }) + moko(pid, 960, 650, 0.9, "sleep"),
    };
  },
};

export function sceneSvg(kind, pid) {
  const s = SCENES[kind](pid);
  return `${s.bg}<g class="wob" filter="url(#wob)">${s.ground}${s.front}</g>`;
}
