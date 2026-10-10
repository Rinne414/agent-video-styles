// Style tokens for editorial-swiss. Everything numeric lives here; scenes import only from this module.
export const GRID = { margin: 96, gutter: 24, pitch: 146, columns: 12 };
export const col = (n) => GRID.margin + n * GRID.pitch;
export const span = (k) => k * GRID.pitch - GRID.gutter;

export const TYPE = {
  title: 168,
  headline: 120,
  numeral: 440,
  numeralCell: 360, // px height of one digit cell; keeps the roll on whole pixels
  summary: 140,
  body: 38,
  bodyLine: 50,
  label: 30,
  labelLine: 36,
};

export const Y = {
  topRule: 96,
  topLabel: 120,
  statRule: 360,
  statKicker: 384,
  statHeadline: 450,
  statBody: 722,
  bottomRule: 912,
  bottomLabel: 932,
  bottomCells: 948,
  mastheadTitle: 330,
  mastheadRule: 720,
  mastheadMeta: 744,
  colophonLogo: 190,
  colophonSummary: 360,
  colophonRule: 660,
  colophonCredits: 684,
};

export const MOTION = {
  rule: { frames: 14, ease: "power3.inOut" },
  line: { frames: 12, ease: "power3.out", stagger: 3 },
  roll: { frames: 20, ease: "power3.out", stagger: 3 },
};

export function themeCss(theme) {
  const { paper, ink, secondary, rail, signal, headlineFont, labelFont } = theme;
  return `
@font-face { font-family: "${headlineFont}"; src: url("fonts/inter-tight-latin-400-normal.woff2") format("woff2"); font-weight: 400; }
@font-face { font-family: "${headlineFont}"; src: url("fonts/inter-tight-latin-700-normal.woff2") format("woff2"); font-weight: 700; }
@font-face { font-family: "${labelFont}"; src: url("fonts/ibm-plex-mono-latin-500-normal.woff2") format("woff2"); font-weight: 500; }
:root { --paper: ${paper}; --ink: ${ink}; --secondary: ${secondary}; --rail: ${rail}; --signal: ${signal}; }
html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: var(--paper); }
#root { position: relative; width: 1920px; height: 1080px; background: var(--paper); color: var(--ink);
  font-family: "${headlineFont}", sans-serif; font-weight: 700; }
.scene { position: absolute; inset: 0; }
.abs { position: absolute; }
.rule { position: absolute; height: 3px; background: var(--ink); transform-origin: 0 50%; }
.rail { position: absolute; height: 3px; background: var(--rail); }
.fill { position: absolute; height: 3px; background: var(--signal); transform-origin: 0 50%; }
.m { display: block; overflow: hidden; }
.line { display: block; white-space: nowrap; }
.lab { font-family: "${labelFont}", monospace; font-weight: 500; font-size: ${TYPE.label}px; line-height: ${TYPE.labelLine}px;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink); white-space: nowrap; }
.hl { font-size: ${TYPE.headline}px; line-height: 0.95; letter-spacing: -0.03em; }
.hl .m { padding-bottom: 0.14em; margin-bottom: -0.14em; }
.title { font-size: ${TYPE.title}px; line-height: 0.95; letter-spacing: -0.03em; }
.title .m { padding-bottom: 0.14em; margin-bottom: -0.14em; }
.summary { font-size: ${TYPE.summary}px; line-height: 0.95; letter-spacing: -0.03em; }
.summary .m { padding-bottom: 0.14em; margin-bottom: -0.14em; }
.body { font-weight: 400; font-size: ${TYPE.body}px; line-height: ${TYPE.bodyLine}px; color: var(--secondary); }
.accent { color: var(--signal); }
.num { font-size: ${TYPE.numeral}px; line-height: ${TYPE.numeralCell}px; letter-spacing: -0.03em; color: var(--signal);
  font-variant-numeric: tabular-nums; white-space: nowrap; display: flex; }
.dg { position: relative; display: block; height: ${TYPE.numeralCell}px; overflow: hidden; }
.dg .sp { visibility: hidden; display: block; height: ${TYPE.numeralCell}px; }
.dg .strip { position: absolute; left: 0; top: 0; }
.dg .strip i { display: block; height: ${TYPE.numeralCell}px; font-style: normal; }
.suffix { display: block; height: ${TYPE.numeralCell}px; overflow: hidden; }
.logo { position: absolute; width: ${span(1)}px; height: ${span(1)}px; background: var(--signal); transform-origin: 0 50%; }
`;
}
