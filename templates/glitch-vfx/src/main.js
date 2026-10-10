// Frame compositor and timeline registration. draw(f) is a pure function of the frame number.
const canvas = document.getElementById("c");
const out = canvas.getContext("2d");
const sceneA = makeCanvas();
const sceneB = makeCanvas();
const ground = makeCanvas();
const logoTmp = makeCanvas().getContext("2d");
const scanPattern = (() => {
  const c = document.createElement("canvas");
  c.width = 1;
  c.height = 4;
  const g = c.getContext("2d");
  g.fillStyle = "rgba(255,255,255,0.04)";
  g.fillRect(0, 0, 1, 2);
  return out.createPattern(c, "repeat");
})();

function paintGround() {
  const g = ground.getContext("2d");
  g.fillStyle = COL.ground;
  g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W / 2, LAYOUT.logoCenterY, 0, W / 2, LAYOUT.logoCenterY, 900);
  glow.addColorStop(0, rgba(COL.cyan, 0.035));
  glow.addColorStop(1, rgba(COL.cyan, 0));
  g.fillStyle = glow;
  g.fillRect(0, 0, W, H);
}

function draw(f) {
  const a = sceneA.getContext("2d");
  const b = sceneB.getContext("2d");
  const inShatter = f >= BEATS.shatterAt && f < shatterEnd();
  out.setTransform(1, 0, 0, 1, 0, 0);
  out.globalAlpha = 1;
  out.drawImage(ground, 0, 0);
  if (f < BEATS.shatterAt) {
    renderScene(a, logoTmp, f, "A");
    drawWithBursts(out, sceneA, f);
  } else {
    renderScene(b, logoTmp, f, "B");
    drawWithBursts(out, sceneB, f);
    if (inShatter) {
      renderScene(a, logoTmp, f, "A");
      drawShatter(out, sceneA, ground, f);
    }
  }
  out.save();
  out.translate(0, f % 4);
  out.fillStyle = scanPattern;
  out.fillRect(0, -4, W, H + 4);
  out.restore();
}

let lastFrame = 0;
function drawFrame(f) {
  lastFrame = f;
  draw(f);
}

paintGround();
drawFrame(0);
const fontJobs = [
  `700 ${TYPE.titleSize}px "${TYPE.display}"`,
  `500 ${TYPE.taglineSize}px "${TYPE.display}"`,
  `400 ${TYPE.monoSize}px "${TYPE.mono}"`,
].map((spec) => document.fonts.load(spec));
Promise.all(fontJobs).then(() => drawFrame(lastFrame));

const proxy = { t: 0 };
const duration = TOTAL_FRAMES / FPS;
const tl = gsap.timeline({ paused: true });
tl.to(proxy, { t: duration, duration, ease: "none", onUpdate: () => drawFrame(Math.round(proxy.t * FPS)) }, 0);
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
