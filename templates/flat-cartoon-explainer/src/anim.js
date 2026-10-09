// Runs in the page. Globals injected by build.mjs: TL (timings), G (geometry), C (palette). Every value is a function of timeline time.
const tl = gsap.timeline({ paused: true });
const F = 1 / 30;
const RAINBOWIDX = [0, 1, 2, 3, 4, 5];
const norm = (s) => s.toLowerCase().replace(/[^a-z]/g, "");
// start time of the nth occurrence of a word in a segment, 2 frames early (word pinning)
const w = (seg, word, nth = 0) => TL.segs[seg].words.filter((x) => x.k === norm(word))[nth].s - 2 * F;
const wEnd = (seg, word, nth = 0) => TL.segs[seg].words.filter((x) => x.k === norm(word))[nth].e;
const O = (p) => ({ svgOrigin: `${p[0]} ${p[1]}` });
let seed = 12345;
const rand = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };

const popSvg = (sel, t, p, d = 0.45) => tl.fromTo(sel, { scale: 0, ...O(p) }, { scale: 1, ...O(p), duration: d, ease: "back.out(1.7)" }, t);
const popHtml = (sel, t, d = 0.45) => tl.fromTo(sel, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, transformOrigin: "50% 50%", duration: d, ease: "back.out(1.7)" }, t);
const squashSvg = (sel, t, p) => {
  tl.to(sel, { scaleX: 1.15, scaleY: 0.85, ...O(p), duration: 0.1, ease: "power2.out" }, t)
    .to(sel, { scaleX: 0.95, scaleY: 1.05, ...O(p), duration: 0.1, ease: "power2.inOut" }, t + 0.1)
    .to(sel, { scaleX: 1, scaleY: 1, ...O(p), duration: 0.1, ease: "power2.out" }, t + 0.2);
};
const draw = (sel, t, d, ease = "power2.out") => tl.fromTo(sel, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d, ease }, t);
const spin = (sel, t, t1, p, deg) => tl.fromTo(sel, { rotation: 0, ...O(p) }, { rotation: deg, ...O(p), duration: t1 - t, ease: "none" }, t);

// pose-to-pose arm rotation (shoulder angle + elbow angle), 0.3 s
function arm(p, side, t, deg, fdeg = 0, d = 0.3) {
  const h = G[p.scene].host, s = side === "L" ? h.sL : h.sR, e = side === "L" ? h.eL : h.eR;
  tl.to(`#${p.id}-a${side}`, { rotation: deg, ...O(s), duration: d, ease: "power2.inOut" }, t);
  tl.to(`#${p.id}-a${side}f`, { rotation: fdeg, ...O(e), duration: d, ease: "power2.inOut" }, t);
}
function wave(p, t0, t1) {
  const e = G[p.scene].host.eR;
  arm(p, "R", t0, -150, 0, 0.3);
  for (let t = t0 + 0.3, k = 0; t < t1 - 0.3; t += 0.28, k++) tl.to(`#${p.id}-aRf`, { rotation: k % 2 ? 22 : -22, ...O(e), duration: 0.28, ease: "sine.inOut" }, t);
}

// host: pop-in is scene-specific; idle bob, seeded blinks and a mouth that flaps on each spoken word are shared
function hostIdle(scene, segIds) {
  const S = TL.scenes[scene], h = G[scene].host, id = scene;
  tl.fromTo(`#${id}-bob`, { y: 0 }, { y: -5, duration: 0.75, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((S.end - S.start) / 0.75) }, S.start);
  for (let t = S.start + 1.6 + rand(); t < S.end - 0.3; t += 2.6 + rand() * 1.4) {
    tl.to(`#${id}-eyes`, { scaleY: 0.1, ...O(h.eyes), duration: 2 * F, ease: "none" }, t)
      .to(`#${id}-eyes`, { scaleY: 1, ...O(h.eyes), duration: 2 * F, ease: "none" }, t + 4 * F);
  }
  for (const sid of segIds) for (const wd of TL.segs[sid].words) {
    tl.to(`#${id}-mouth`, { scaleY: 1.8, ...O(h.mouth), duration: 0.05, ease: "none" }, wd.s)
      .to(`#${id}-mouth`, { scaleY: 1, ...O(h.mouth), duration: 0.06, ease: "none" }, wd.s + 0.07);
  }
  tl.fromTo(`#${id}-ant`, { rotation: -6, ...O(h.ant) }, { rotation: 6, ...O(h.ant), duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: Math.ceil((S.end - S.start) / 0.9) }, S.start);
}
// slow 20 px camera pan over the whole scene (secondary motion, never dead air)
function pan(scene, dir = -1) {
  const S = TL.scenes[scene];
  tl.fromTo(`#${scene}-inner`, { x: 0 }, { x: 20 * dir, duration: S.end - S.start, ease: "none" }, S.start);
}
const segsOf = { open: ["s1"], white: ["s2"], drop: ["s3", "s4", "s5"], eye: ["s6"], arc: ["s7"], wrap: ["s8"] };
for (const sc of Object.keys(segsOf)) { hostIdle(sc, segsOf[sc]); pan(sc, sc === "arc" || sc === "eye" ? 1 : -1); }
const P = (scene) => ({ scene, id: scene });

// ---------------------------------------------------------------- open (s1)
{
  const S = TL.scenes.open, h = G.open.host, s = (k, n = 0) => w("s1", k, n);
  tl.fromTo("#open-host", { scale: 0.35, ...O(h.feet) }, { scale: 1, ...O(h.feet), duration: 0.55, ease: "back.out(1.7)" }, 0);
  popSvg("#open-bub", s("wonder"), [500, 490]);
  arm(P("open"), "R", s("wonder"), -40, 20);
  [1, 2, 3, 4, 5].forEach((n) => popHtml(`#open-title .tw:nth-child(${n})`, s("ever") + (n - 1) * 0.14, 0.5));
  tl.fromTo("#open-title .rb i", { y: 0 }, { y: -14, duration: 0.2, yoyo: true, repeat: 1, ease: "power2.out", stagger: 0.05 }, s("rainbow") + 0.5);
  popSvg("#open-sun", s("sunlight"), [1680, 470], 0.5);
  spin("#open-sun-rays", s("sunlight"), S.end, [1680, 470], 120);
  popSvg("#open-cloud", s("lot"), [1230, 500], 0.5);
  tl.fromTo("#open-cloud", { y: 0 }, { y: 10, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: 6 }, s("lot") + 0.6);
  const t0 = s("tiny");
  for (let i = 0; i < 7; i++) {
    const ti = t0 + i * 0.12;
    tl.set(`#open-rd${i}`, { opacity: 1 }, ti);
    tl.fromTo(`#open-rd${i}`, { y: -35, opacity: 0 }, { y: 255, opacity: 1, duration: 0.9, ease: "power1.in", repeat: Math.ceil((S.end - ti) / 0.9) }, ti);
  }
}

// ---------------------------------------------------------------- white (s2)
{
  const S = TL.scenes.white, h = G.white.host, s = (k, n = 0) => w("s2", k, n);
  tl.fromTo("#white-host", { scale: 0, ...O(h.feet) }, { scale: 1, ...O(h.feet), duration: 0.45, ease: "back.out(1.7)" }, S.start + 0.1);
  popSvg("#white-sun", s("sunlight"), [600, 270], 0.5);
  spin("#white-sun-rays", s("sunlight"), S.end, [600, 270], 90);
  draw(".white-beam", s("white"), 0.55);
  popHtml("#white-l1", s("white") + 0.3);
  tl.to("#white-sun", { scale: 1.1, ...O([600, 270]), duration: 0.15, yoyo: true, repeat: 3, ease: "sine.inOut" }, s("secretly"));
  arm(P("white"), "R", s("mix"), -95, 0);
  RAINBOWIDX.forEach((i) => draw(`.white-f${i}`, s("mix") + i * 0.17, 0.55));
  popHtml("#white-l2", s("color"));
  arm(P("white"), "R", s("color") + 0.6, 0, 0);
}

// ---------------------------------------------------------------- drop (s3-s5)
{
  const S = TL.scenes.drop, h = G.drop.host, g = G.drop;
  tl.fromTo("#drop-host", { scale: 0, ...O(h.feet) }, { scale: 1, ...O(h.feet), duration: 0.45, ease: "back.out(1.7)" }, S.start + 0.1);
  popSvg("#drop-sun", S.start + 0.3, [330, g.P1[1]], 0.5);
  spin("#drop-sun-rays", S.start + 0.3, S.end, [330, g.P1[1]], 100);
  tl.fromTo("#drop-body", { scale: 0, ...O(g.C) }, { scale: 1, ...O(g.C), duration: 0.55, ease: "back.out(1.5)" }, S.start + 0.45);
  const a = (k, n = 0) => w("s3", k, n), b = (k, n = 0) => w("s4", k, n), c = (k, n = 0) => w("s5", k, n);
  arm(P("drop"), "R", a("ray"), -70, 0);
  draw(".drop-r1", a("ray"), 0.9, "none");
  draw(".drop-r2", a("slows"), 0.75, "none");
  popSvg("#drop-p1", a("bends"), g.P1, 0.35);
  popHtml("#drop-lref", a("refraction"));
  tl.to("#drop-lref", { rotation: 4, duration: 0.2, yoyo: true, repeat: 3, ease: "sine.inOut" }, a("refraction") + 0.5);
  popSvg("#drop-star", b("bounces"), g.P2, 0.4);
  popHtml("#drop-lb", b("bounces") + 0.1);
  draw(".drop-r3", b("off"), 0.8, "none");
  tl.to("#drop-star", { rotation: 72, ...O(g.P2), duration: 0.5, ease: "power2.inOut" }, b("mirror"));
  popSvg("#drop-p3", c("bends"), g.P3, 0.35);
  tl.to("#drop-lb", { scale: 0, duration: 0.2, transformOrigin: "50% 50%" }, c("colors") - 0.1);
  tl.to("#drop-lref", { scale: 0, duration: 0.2, transformOrigin: "50% 50%" }, c("colors") - 0.1);
  for (let i = 0; i < 6; i++) draw(`.drop-x${i}`, c("colors") + i * 0.09, 0.6);
  arm(P("drop"), "R", c("colors"), -110, 0);
  popHtml("#drop-lred", c("red"));
  popHtml("#drop-lvio", c("violet"));
  tl.to(".drop-x0", { strokeWidth: "+=6", duration: 0.2, yoyo: true, repeat: 1 }, c("red"));
  arm(P("drop"), "R", c("most") + 0.3, 0, 0);
}

// ---------------------------------------------------------------- eye (s6)
{
  const S = TL.scenes.eye, h = G.eye.host, g = G.eye, s = (k, n = 0) => w("s6", k, n);
  tl.fromTo("#eye-host", { scale: 0, ...O(h.feet) }, { scale: 1, ...O(h.feet), duration: 0.45, ease: "back.out(1.7)" }, S.start + 0.1);
  for (let i = 0; i < 6; i++) {
    popSvg(`#eye-dg${i}`, s("each") + i * 0.1, [g.xs[i], g.ys[i]], 0.4);
    tl.set(`#eye-df${i}`, { opacity: 0 }, 0);
  }
  const fill = (i, t) => { tl.fromTo(`#eye-df${i}`, { opacity: 0 }, { opacity: 1, duration: 0.15 }, t); draw(`.eye-r${i}`, t, 0.7, "none"); squashSvg(`#eye-dg${i}`, t + 0.1, [g.xs[i], g.ys[i]]); };
  fill(3, s("just"));
  tl.fromTo("#eye-ring", { scale: 0, ...O([h.head[0] + 28, h.head[1] - 6]) }, { scale: 1, ...O([h.head[0] + 28, h.head[1] - 6]), duration: 0.45, ease: "back.out(2)" }, s("toward"));
  tl.to("#eye-ring", { scale: 1.25, ...O([h.head[0] + 28, h.head[1] - 6]), duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }, s("toward") + 0.5);
  popHtml("#eye-l1", s("your"));
  fill(0, s("higher"));
  popHtml("#eye-lred", s("red"));
  fill(5, s("lower"));
  popHtml("#eye-lvio", s("violet"));
  [1, 2, 4].forEach((i, k) => fill(i, wEnd("s6", "violet") - 0.1 + k * 0.15));
  arm(P("eye"), "R", s("eye"), -100, 0);
  arm(P("eye"), "R", s("higher") + 0.4, -35, 0);
}

// ---------------------------------------------------------------- arc (s7)
{
  const S = TL.scenes.arc, h = G.arc.host, g = G.arc, s = (k, n = 0) => w("s7", k, n);
  tl.fromTo("#arc-host", { scale: 0, ...O(h.feet) }, { scale: 1, ...O(h.feet), duration: 0.45, ease: "back.out(1.7)" }, S.start + 0.1);
  const t0 = s("millions"), span = wEnd("s7", "color") - t0;
  for (let i = 0; i < 48; i++) {
    const t = t0 + (i / 48) * span;
    tl.fromTo(`#arc-m${i}`, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, transformOrigin: "50% 50%", duration: 0.3, ease: "back.out(2)" }, t);
  }
  for (let i = 0; i < 6; i++) draw(`.arc-b${i}`, s("paint") + i * 0.1, 1.3, "power2.inOut");
  arm(P("arc"), "L", s("paint"), 150, -10, 0.4);
  arm(P("arc"), "R", s("paint"), -150, 10, 0.4);
  tl.to("#arc-host", { y: -12, duration: 0.3, yoyo: true, repeat: 3, ease: "power2.out" }, s("bright"));
  popSvg("#arc-cl", s("sky") - 0.5, [560, 330], 0.5);
  popSvg("#arc-cr", s("sky") - 0.3, [1720, 330], 0.5);
  tl.to("#arc-cl", { y: 8, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: 3 }, s("sky") + 0.3);
}

// ---------------------------------------------------------------- wrap (s8)
{
  const S = TL.scenes.wrap, h = G.wrap.host, g = G.wrap, s = (k, n = 0) => w("s8", k, n);
  tl.fromTo("#wrap-host", { scale: 0, ...O(h.feet) }, { scale: 1, ...O(h.feet), duration: 0.4, ease: "back.out(1.7)" }, S.start + 0.05);
  popSvg("#wrap-sun", s("sun"), [170, 250], 0.5);
  spin("#wrap-sun-rays", s("sun"), S.end, [170, 250], 90);
  popHtml("#wrap-l1", s("sun") + 0.1);
  draw(".wrap-sr", s("behind"), 0.6);
  for (let i = 0; i < 6; i++) draw(`.wrap-b${i}`, s("rainbow") + i * 0.1, 1.1, "power2.inOut");
  arm(P("wrap"), "R", s("front") - 0.3, -88, 0);
  popHtml("#wrap-l2", s("now"), 0.55);
  wave(P("wrap"), s("know") - 0.2, S.end);
}

// ---------------------------------------------------------------- captions + iris wipes
document.querySelectorAll(".cap").forEach((el) => {
  const t = parseFloat(el.dataset.start);
  tl.fromTo(el.firstChild, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.14, ease: "power2.out" }, t);
});
{
  const ids = Object.keys(TL.scenes), IR = 7 * F;
  ids.slice(0, -1).forEach((id) => {
    const b = TL.scenes[id].end;
    tl.set("#iris-c", { attr: { fill: C[TL.scenes[id].iris] } }, b - IR - 0.01);
    tl.fromTo("#iris-c", { attr: { r: 0 } }, { attr: { r: 1260 }, duration: IR, ease: "power2.in" }, b - IR);
    tl.to("#iris-c", { attr: { r: 0 }, duration: IR, ease: "power2.out" }, b);
  });
}

window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
