// All motion is a function of the timeline position. Timings come from data-* attributes written by scripts/build.mjs.
const { cards, n, outSec } = window.CE;
const tl = gsap.timeline({ paused: true });
const IN_SEC = 0.5;
const STAGGER_SEC = 5 / 30;
const HL_SEC = 12 / 30;
const COUNT_SEC = 30 / 30;
const RING_LEN = 540.35;

cards.forEach((c, i) => {
  const sec = document.getElementById(c.id);
  const card = sec.querySelector(".card");
  const inner = sec.querySelector(".card-inner");
  tl.fromTo(card, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: IN_SEC, ease: "power3.out" }, c.start);
  tl.fromTo(inner, { scale: 1 }, { scale: 1.02, duration: c.len, ease: "sine.out" }, c.start);
  if (!c.isLast) tl.to(card, { scale: 0.96, opacity: 0, duration: outSec, ease: "power2.in" }, c.start + c.len - outSec);
  tl.fromTo(".bar-fill", { scaleX: i / n }, { scaleX: (i + 1) / n, duration: 0.5, ease: "power3.out", immediateRender: i === 0 }, c.start);

  let k = 0;
  sec.querySelectorAll("[data-anim]").forEach((el) => {
    const at = el.dataset.at ? parseFloat(el.dataset.at) : c.start + 0.15 + STAGGER_SEC * k++;
    tl.fromTo(el, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, at);
  });
  sec.querySelectorAll("[data-hl-at]").forEach((el) => {
    const bar = el.querySelector("[data-hl]");
    if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: HL_SEC, ease: "power2.out" }, parseFloat(el.dataset.hlAt));
  });
  sec.querySelectorAll("[data-count]").forEach((el) => {
    const proxy = { v: 0 };
    const target = parseInt(el.dataset.count, 10);
    tl.fromTo(
      proxy,
      { v: 0 },
      { v: target, duration: COUNT_SEC, ease: "power3.out", onUpdate: () => (el.textContent = Math.round(proxy.v)) },
      parseFloat(el.dataset.at),
    );
  });
  sec.querySelectorAll("[data-ring]").forEach((el) => {
    tl.fromTo(el, { strokeDashoffset: RING_LEN }, { strokeDashoffset: 0, duration: 1.4, ease: "power3.out" }, parseFloat(el.dataset.at));
  });
  sec.querySelectorAll(".mark").forEach((el) => {
    const tick = el.querySelector(".tick");
    tl.fromTo(tick, { strokeDashoffset: 60 }, { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, parseFloat(el.dataset.at) + 0.25);
  });
});

document.querySelectorAll(".cap").forEach((el) => {
  const t0 = parseFloat(el.dataset.t0);
  const t1 = parseFloat(el.dataset.t1);
  tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, t0);
  tl.set(el, { opacity: 0 }, t1);
});

window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
