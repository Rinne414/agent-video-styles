// Generic timeline: build.mjs writes the absolute start frame of every animated element into data-at.
// CFG (fps, motion) is injected by the build script before this file.
const F = (frames) => frames / CFG.fps;
const tl = gsap.timeline({ paused: true });
const all = (sel) => Array.from(document.querySelectorAll(sel));

all(".rule[data-at], .logo[data-at]").forEach((el) => {
  tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: F(CFG.motion.rule.frames), ease: CFG.motion.rule.ease }, F(+el.dataset.at));
});

all(".line[data-at]").forEach((el) => {
  tl.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: F(CFG.motion.line.frames), ease: CFG.motion.line.ease }, F(+el.dataset.at));
});

all(".strip[data-at]").forEach((el) => {
  tl.fromTo(el, { yPercent: 0 }, { yPercent: -+el.dataset.to, duration: F(CFG.motion.roll.frames), ease: CFG.motion.roll.ease }, F(+el.dataset.at));
});

all(".fill[data-at]").forEach((el) => {
  tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: F(+el.dataset.dur), ease: "power1.inOut" }, F(+el.dataset.at));
});

window.__timelines["main"] = tl;
