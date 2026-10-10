// In-page animation. Every visual value is a pure function of the frame number.
// CFG is injected by scripts/build.mjs (timing, scene ranges, animation groups).
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - 2 * (1 - p) * (1 - p)); // power2.inOut

const maskCss = (p, feather, width) => {
  const x = -feather + p * (width + feather);
  const v = `linear-gradient(to right, #000 ${x.toFixed(1)}px, transparent ${(x + feather).toFixed(1)}px)`;
  return v;
};

const scenes = CFG.scenes.map((sc) => {
  const root = document.getElementById("scene-" + sc.id);
  return {
    ...sc,
    root,
    stage: root.querySelector(".stage"),
    lineEls: [...root.querySelectorAll(".m-line")],
    colorEls: [...root.querySelectorAll(".m-color")],
    capEls: [...root.querySelectorAll(".cap")],
    animEls: [...root.querySelectorAll("[data-g]")].filter((el) => (CFG.anims[sc.id] || {})[el.dataset.g]),
  };
});

function applyAnims(sc, local) {
  const table = CFG.anims[sc.id] || {};
  for (const el of sc.animEls) {
    const a = table[el.dataset.g];
    let dx = 0;
    let dy = 0;
    if (a.bob) dy = a.bob[0] * Math.sin((2 * Math.PI * local) / a.bob[1]);
    if (a.sway) dx = a.sway[0] * Math.sin((2 * Math.PI * local) / a.sway[1]);
    if (a.drift) dx += a.drift[0] + (a.drift[1] - a.drift[0]) * (local / sc.frames);
    el.setAttribute("transform", `translate(${dx.toFixed(2)} ${dy.toFixed(2)})`);
    if (a.blink) {
      const k = 0.5 + 0.5 * Math.sin((2 * Math.PI * local) / a.blink[1]);
      el.style.opacity = (a.blink[0] + (1 - a.blink[0]) * k).toFixed(3);
    }
  }
}

function render(frame) {
  for (const sc of scenes) {
    const local = frame - sc.start;
    if (local < 0 || local >= sc.frames) continue;
    const lp = easeInOut(clamp01((local - sc.line.start) / sc.line.frames));
    const cp = easeInOut(clamp01((local - sc.color.start) / sc.color.frames));
    const lineMask = maskCss(lp, CFG.timing.lineFeather, CFG.width);
    const colorMask = maskCss(cp, CFG.timing.colorFeather, CFG.width);
    for (const el of sc.lineEls) el.style.webkitMaskImage = lineMask;
    for (const el of sc.colorEls) el.style.webkitMaskImage = colorMask;
    const capP = clamp01((local - sc.capStart) / CFG.timing.captionFade);
    for (const el of sc.capEls) el.style.opacity = capP.toFixed(3);
    const holdFrom = sc.color.start + sc.color.frames;
    const z = clamp01((local - holdFrom) / (sc.frames - holdFrom));
    sc.stage.style.transform = `scale(${(1 + (CFG.timing.zoomTo - 1) * z).toFixed(5)})`;
    applyAnims(sc, local);
  }
}

const proxy = { t: 0 };
const total = CFG.totalFrames / CFG.fps;
const tl = gsap.timeline({ paused: true });
tl.fromTo(proxy, { t: 0 }, { t: total, duration: total, ease: "none", immediateRender: false, onUpdate: () => render(Math.round(proxy.t * CFG.fps)) }, 0);
render(0);
window.__timelines["main"] = tl;
