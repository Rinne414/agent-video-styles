// Runs inside the composition. PLAN is injected by scripts/build.mjs (see src/theme.mjs for the tokens).
const F = 1 / PLAN.fps;
const M = PLAN.motion;
const at = (frame) => frame * F;
const tl = gsap.timeline({ paused: true });

function rise(sel, frame, extra = {}) {
  tl.fromTo(sel, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: M.specDur * F, ease: M.specEase, ...extra }, at(frame));
}

function exitRight(sc, sel) {
  tl.to(sel, { opacity: 0, duration: M.exit * F, ease: "none" }, at(sc.start + sc.len - M.exit));
}

function drift(sc, sel) {
  tl.fromTo(sel, { scale: 1 }, { scale: M.cameraScale, duration: sc.len * F, ease: "none" }, at(sc.start));
}

function wipe(sc, sel) {
  tl.fromTo(sel, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: M.wipe * F, ease: M.wipeEase }, at(sc.start));
}

function story(sc) {
  const q = (s) => `#sc-${sc.id} ${s}`;
  wipe(sc, q(".panel"));
  tl.fromTo(q(".numeral"), { scale: M.numeralScale, opacity: 0 },
    { scale: 1, opacity: 1, duration: M.numeralDur * F, ease: "power2.out" }, at(sc.start + M.numeralFrom));
  tl.fromTo(q(".kicker"), { x: M.kickerSlide, opacity: 0 },
    { x: 0, opacity: 1, duration: M.kickerDur * F, ease: M.specEase }, at(sc.start + M.kickerAt));
  document.querySelectorAll(q(".ln > span")).forEach((el, i) => {
    tl.fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: M.headlineDur * F, ease: M.specEase },
      at(sc.start + M.headlineAt + i * M.headlineLineStep));
  });
  document.querySelectorAll(q(".spec")).forEach((el, i) => rise(el, sc.start + M.specAt[i]));
  drift(sc, q(".cam"));
  exitRight(sc, q(".right"));
}

function opening(sc) {
  const q = (s) => `#sc-${sc.id} ${s}`;
  tl.fromTo(q(".kicker"), { x: M.kickerSlide, opacity: 0 }, { x: 0, opacity: 1, duration: M.kickerDur * F, ease: M.specEase }, at(sc.start + 4));
  document.querySelectorAll(q(".ln > span")).forEach((el, i) => {
    tl.fromTo(el, { yPercent: 110 }, { yPercent: 0, duration: 14 * F, ease: M.specEase }, at(sc.start + 12 + i * M.headlineLineStep));
  });
  rise(q(".open-sub"), sc.start + 40);
  document.querySelectorAll(q(".chip")).forEach((el, i) => {
    tl.fromTo(el, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: M.wipe * F, ease: M.wipeEase }, at(sc.start + 54 + i * M.specDur));
  });
  drift(sc, q(".open-wrap"));
  exitRight(sc, q(".open-wrap"));
}

function closing(sc) {
  const q = (s) => `#sc-${sc.id} ${s}`;
  wipe(sc, q(".cover"));
  tl.fromTo(q(".kicker"), { x: M.kickerSlide, opacity: 0 }, { x: 0, opacity: 1, duration: M.kickerDur * F, ease: M.specEase }, at(sc.start + 10));
  document.querySelectorAll(q(".recap-row")).forEach((el, i) => rise(el, sc.start + 20 + i * 14));
  rise(q(".source"), sc.start + 60);
  rise(q(".signoff"), sc.start + 72);
}

for (const sc of PLAN.scenes) ({ story, opening, closing })[sc.kind](sc);

// Ticker marquee and scanline drift: pure functions of the frame number.
const track = document.getElementById("track");
const scan = document.getElementById("scan");
function applyLayers(frame) {
  const loop = track.offsetWidth / 2;
  track.style.transform = `translateX(${-((frame * M.tickerPxPerFrame) % loop)}px)`;
  scan.style.backgroundPosition = `0px ${frame % M.scanlinePitch}px`;
}
const proxy = { f: 0 };
tl.to(proxy, { f: PLAN.total, duration: PLAN.total * F, ease: "none", onUpdate: () => applyLayers(Math.round(proxy.f)) }, 0);
applyLayers(0);

window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
