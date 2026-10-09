// ---- main: one paused GSAP timeline, canvas redrawn as a pure function of the frame ----
function draw(f) {
  const s = sceneAt(f);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  rect(0, 0, W, H, PAL.black);
  const [sx, sy] = shakeAt(f, SHAKE_EVENTS);
  ctx.setTransform(1, 0, 0, 1, sx, sy);
  if (s.kind === "title") sceneTitle(f);
  else if (s.kind === "outro") sceneOutro(f);
  else sceneQuest(f, s);
  if (s.kind !== "title") { drawHud(f); drawChecklist(f); }
  drawBeatPips(f);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // dither dissolve centred on each cut
  for (const sc of SCENES.slice(1)) {
    const d = f - sc.start;
    if (d >= -6 && d < 6) ctx.drawImage(ditherMask(Math.round(16 * (1 - Math.abs(d + 0.5) / 6.5)), PAL.black), 0, 0);
  }
  if (f === OUTRO_START || f === OUTRO_START + 1) rect(0, 0, W, H, PAL.white); // 2 frame flash
}

const FPS = CONTENT.video.fps;
const proxy = { t: 0 };
const tl = gsap.timeline({ paused: true });
tl.to(proxy, {
  t: TOTAL_FRAMES / FPS,
  duration: TOTAL_FRAMES / FPS,
  ease: "none",
  onUpdate: () => draw(Math.min(TOTAL_FRAMES - 1, Math.round(proxy.t * FPS))),
}, 0);
window.__timelines["main"] = tl;
["8", "16", "24", "32", "40"].forEach((px) => document.fonts.load(px + "px " + FONT));
draw(0);
