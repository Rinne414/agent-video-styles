// node scripts/build.mjs -> writes index.html, copies vendored gsap + fonts. Run before check/render.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, T, content } from "./theme.mjs";
import { buildSchedule } from "./schedule.mjs";
import { css, chatMarkup, postMarkup } from "./markup.mjs";

const S = buildSchedule();

mkdirSync(join(ROOT, "vendor"), { recursive: true });
mkdirSync(join(ROOT, "fonts"), { recursive: true });
copyFileSync(join(ROOT, "node_modules/gsap/dist/gsap.min.js"), join(ROOT, "vendor/gsap.min.js"));
for (const w of [400, 500, 600, 700]) {
  const f = `inter-latin-${w}-normal.woff2`;
  copyFileSync(join(ROOT, "node_modules/@fontsource/inter/files", f), join(ROOT, "fonts", f));
}

const K = {
  fps: T.fps,
  totalFrames: T.totalFrames,
  typeFramesPerChar: T.typeFramesPerChar,
  enter: T.enter,
  pushFrames: T.pushFrames,
  fadeOut: T.fadeOut,
  cardIn: T.cardIn,
  likesCount: T.likesCount,
  driftScale: T.driftScale,
  sentFill: T.colors.sentFill,
  recvFill: T.colors.recvFill,
};
const anim = readFileSync(join(ROOT, "scripts/anim.js"), "utf8");
const dur = content.meta.durationSeconds;

const html = `<!doctype html>
<html lang="en"><head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${T.rootW}, height=${T.H}" />
<script src="vendor/gsap.min.js"></script>
<style>${css}</style>
</head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${dur}" data-width="${T.rootW}" data-height="${T.H}">
${chatMarkup(S)}
${postMarkup(S)}
</div>
<script>
const S = ${JSON.stringify(S)};
const K = ${JSON.stringify(K)};
const P = ${JSON.stringify(content.post)};
${anim}
</script>
</body></html>
`;
writeFileSync(join(ROOT, "index.html"), html);

const rows = S.msgs.map((m) => `${m.from.padEnd(4)} land ${m.land} end ${m.end}${m.indStart ? ` ind ${m.indStart}` : ` type ${m.typeStart}`}`);
console.log(rows.join("\n"));
console.log(`fadeOut ${S.fadeOutAt}  card ${S.cardAt}  likes ${S.likesAt}  comment ${S.commentAt}  settled ${S.settledAt}  / ${T.totalFrames}`);
if (S.settledAt > T.totalFrames * 0.9) console.warn("WARNING: end card settles after 90% of the video");
