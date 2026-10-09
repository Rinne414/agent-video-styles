// Deterministic runtime: every visual value is a function of the timeline time.
const PLAN = __PLAN__;
const FPS = __FPS__;
const tl = gsap.timeline({ paused: true });

for (const x of PLAN.tweens) {
  const to = { ...x.to, duration: x.d, ease: x.ease || "power2.out", immediateRender: false };
  const from = { ...x.from };
  if (x.origin) { from.transformOrigin = x.origin; to.transformOrigin = x.origin; }
  if (x.stagger) to.stagger = x.stagger;
  tl.fromTo(x.sel, from, to, x.at);
}

const $ = (s) => [...document.querySelectorAll(s)];
const timed = $("[data-t]").map((el) => ({ el, t: +el.dataset.t }));
const classed = PLAN.classes.map((c) => ({ el: document.querySelector(c.sel), cls: c.cls, t: c.t }));
const runs = PLAN.runs.map((r) => {
  const chars = $(`[data-r="${r.id}"]`);
  return { ...r, chars, times: chars.map((c) => +c.dataset.t), cur: -1 };
});
const scrolls = PLAN.scrolls.map((s) => ({ ...s, el: document.querySelector(s.sel) }));
const outCubic = (p) => 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3);

function apply(t) {
  for (const e of timed) e.el.style.opacity = t >= e.t ? "1" : "0";
  for (const c of classed) c.el.classList.toggle(c.cls, t >= c.t);
  for (const r of runs) {
    let n = 0;
    while (n < r.chars.length && r.times[n] <= t) n++;
    // caret: hidden while typing, blinks (8 on / 7 off frames) while idle
    const idle = t >= r.t1 && t <= r.until;
    const on = idle && n > 0 && Math.floor(t * FPS) % 15 < 8;
    const idx = on ? n - 1 : -1;
    if (idx !== r.cur) {
      if (r.cur >= 0) r.chars[r.cur].classList.remove("caret");
      if (idx >= 0) r.chars[idx].classList.add("caret");
      r.cur = idx;
    }
  }
  for (const s of scrolls) {
    let shift = 0;
    for (let k = s.cap; k < s.times.length; k++) shift += outCubic((t - s.times[k]) / (s.frames / FPS));
    s.el.style.transform = `translateY(${-shift * s.line}px)`;
  }
}

const proxy = { t: 0 };
tl.fromTo(proxy, { t: 0 }, { t: PLAN.duration, duration: PLAN.duration, ease: "none", immediateRender: false, onUpdate: () => apply(proxy.t) }, 0);
apply(0);
window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
