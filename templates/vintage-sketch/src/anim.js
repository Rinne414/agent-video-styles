// Inlined into index.html by scripts/build.mjs. Needs globals LAYOUT, FPS (injected before this file).
const tl = gsap.timeline({ paused: true });
const T = (frames) => frames / FPS;
const q = (sel) => gsap.utils.toArray(sel);
const draw = (el, at, frames, ease = "power2.inOut") =>
  tl.fromTo(el, { attr: { "stroke-dashoffset": 1 } }, { attr: { "stroke-dashoffset": 0 }, duration: T(frames), ease, immediateRender: true }, T(at));
const rise = (el, at, frames, dy = 8) =>
  tl.fromTo(el, { opacity: 0, y: dy }, { opacity: 1, y: 0, duration: T(frames), ease: "power2.out" }, T(at));

// Outer double rule draws on during the first frames.
q("#frame .fr").forEach((el, i) => draw(el, 2 + i * 6, 44));

LAYOUT.forEach((sc) => {
  const id = "#" + sc.id;
  const s0 = sc.start;
  tl.fromTo(id + " .drift", { scale: 1, svgOrigin: "960 540" }, { scale: 1.03, svgOrigin: "960 540", duration: T(sc.len + sc.fade), ease: "sine.inOut" }, T(s0));
  if (sc.fadeOut) tl.to(id + " svg", { opacity: 0, duration: T(sc.fade), ease: "power3.out" }, T(s0 + sc.len));

  // Contours: stages of up to 4 paths, staggered 8 frames, 66 frames each.
  q(id + " .c").forEach((el) => draw(el, s0 + 1 + Number(el.dataset.s || 0) * 6, 60, "power2.out"));
  // Hatching: one line per frame once the first contours are about 80 percent drawn.
  q(id + " .h").forEach((el) => draw(el, s0 + 52 + Number(el.dataset.i), 10, "none"));
  // Arrows and other rust strokes that are not attached to a note.
  q(id + " .arrows .lead, " + id + " > svg > .drift > .lead").forEach((el, i) => draw(el, s0 + 70 + i * 8, 24));
  // Headline and figure label.
  rise(id + " .head", s0 + 5, 12, 24);
  rise(id + " .fig", s0 + 56, 10);
  // Notes: leader draws 12 frames, dot lands, text rises 6 frames after the leader starts.
  q(id + " .note").forEach((g) => {
    const at = s0 + Number(g.dataset.at);
    const lead = g.querySelector(".lead");
    if (lead) {
      draw(lead, at, 12, "power1.out");
      tl.fromTo(g.querySelector(".dot"), { opacity: 0 }, { opacity: 1, duration: T(2) }, T(at + 12));
    }
    rise(g.querySelector(".nt"), at + (lead ? 6 : 0), 10);
  });
});

const S = Object.fromEntries(LAYOUT.map((l) => [l.id, l.start]));

// Title
{
  const s0 = S["scene-title"];
  q("#scene-title .tl").forEach((el, i) => rise(el, s0 + 14 + i * 10, 16, 30));
  rise("#scene-title .era", s0 + 40, 12);
  tl.fromTo("#t-gear", { rotation: 0, svgOrigin: "1450 560" }, { rotation: 14, svgOrigin: "1450 560", duration: T(75), ease: "sine.inOut" }, T(s0));
}

// Plate 1: the weight sinks, the rope pays out, the drive gear turns (36 px of rope = 21.7 degrees on a 95 px drum).
{
  const s0 = S["scene-p1"];
  const at = s0 + 100;
  const dur = T(90);
  tl.fromTo("#p1-gear", { rotation: 0, svgOrigin: "655 420" }, { rotation: 21.7, svgOrigin: "655 420", duration: dur, ease: "sine.inOut" }, T(at));
  tl.fromTo("#p1-weight", { y: 0 }, { y: 36, duration: dur, ease: "sine.inOut" }, T(at));
  tl.fromTo("#p1-rope", { scaleY: 1, svgOrigin: "750 420" }, { scaleY: 234 / 198, svgOrigin: "750 420", duration: dur, ease: "sine.inOut" }, T(at));
}

// Plate 2: five beats. Anchor rocks 6 degrees each way, the wheel steps half a tooth pitch (15 degrees) per beat.
{
  const s0 = S["scene-p2"];
  const W = "640 700", P = "640 400";
  tl.set("#p2-anchor", { rotation: 0, svgOrigin: P }, 0);
  tl.set("#p2-wheel", { rotation: 0, svgOrigin: W }, 0);
  for (let k = 0; k < 5; k++) {
    const b = s0 + 92 + k * 20;
    tl.to("#p2-anchor", { rotation: k % 2 === 0 ? 6 : -6, svgOrigin: P, duration: T(8), ease: "power2.inOut" }, T(b));
    tl.to("#p2-wheel", { rotation: 15 * (k + 1), svgOrigin: W, duration: T(5), ease: "power3.out" }, T(b + 4));
  }
}

// Plate 3: pendulum swings 8 degrees either side, 60 frames per full period (a seconds pendulum at 30 fps).
{
  const s0 = S["scene-p3"];
  const Q = "640 330";
  tl.set("#p3-pend", { rotation: 0, svgOrigin: Q }, 0);
  const b = s0 + 84;
  tl.to("#p3-pend", { rotation: 8, svgOrigin: Q, duration: T(15), ease: "sine.out" }, T(b));
  [-8, 8, -8].forEach((deg, i) =>
    tl.to("#p3-pend", { rotation: deg, svgOrigin: Q, duration: T(30), ease: "sine.inOut" }, T(b + 15 + i * 30)));
}

// Colophon
{
  const s0 = S["scene-end"];
  q("#scene-end .cl").forEach((el, i) => rise(el, s0 + 2 + i * 8, 12, 24));
  rise("#scene-end .src", s0 + 36, 12);
  tl.fromTo("#c-stamp", { scale: 1.15, rotation: 0, opacity: 0, svgOrigin: "1590 855" },
    { scale: 1, rotation: -4, opacity: 0.9, svgOrigin: "1590 855", duration: T(6), ease: "power3.out" }, T(s0 + 46));
}

window.__timelines["main"] = tl;
