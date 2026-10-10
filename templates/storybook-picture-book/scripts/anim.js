// Browser-side timeline. Runs inline in index.html. Every value is a function of time.
// TLD is injected by build.mjs: { fps, total, turn, enter, bob, tokens, pages:[{id,kind,start,dur,words,lead}] }
(function () {
  const { fps, total, turn: TURN, tokens: K } = TLD;
  const f = (n) => n / fps;
  const tl = gsap.timeline({ paused: true });
  const $ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const lerp = (a, b, t) => a + (b - a) * t;

  // ---- flower head state (rotation about the stem tip, petals spread by "open") ----
  function headState(h, droop, open) {
    const tx = +h.dataset.tipx, ty = +h.dataset.tipy, cx = +h.dataset.cx, cy = +h.dataset.cy, k = +h.dataset.k;
    gsap.set(h, { rotation: droop, svgOrigin: tx + " " + ty });
    $(".pt", h).forEach((p) => {
      const a = (+p.dataset.a * Math.PI) / 180, d = lerp(8, 56, open) * k;
      gsap.set(p, { x: Math.cos(a) * d, y: Math.sin(a) * d, scale: lerp(0.72, 1, open), svgOrigin: cx + " " + cy });
    });
    gsap.set($(".ctr", h), { scale: open, opacity: open > 0.05 ? 1 : 0, svgOrigin: cx + " " + cy });
  }
  function headTween(h, at, dur, to, ease) {
    const tx = +h.dataset.tipx, ty = +h.dataset.tipy, cx = +h.dataset.cx, cy = +h.dataset.cy, k = +h.dataset.k;
    const from = { droop: +h.dataset.cur_droop, open: +h.dataset.cur_open };
    h.dataset.cur_droop = to.droop; h.dataset.cur_open = to.open;
    tl.fromTo(h, { rotation: from.droop, svgOrigin: tx + " " + ty }, { rotation: to.droop, svgOrigin: tx + " " + ty, duration: dur, ease, immediateRender: false }, at);
    $(".pt", h).forEach((p) => {
      const a = (+p.dataset.a * Math.PI) / 180;
      const d0 = lerp(8, 56, from.open) * k, d1 = lerp(8, 56, to.open) * k;
      tl.fromTo(p, { x: Math.cos(a) * d0, y: Math.sin(a) * d0, scale: lerp(0.72, 1, from.open), svgOrigin: cx + " " + cy },
        { x: Math.cos(a) * d1, y: Math.sin(a) * d1, scale: lerp(0.72, 1, to.open), svgOrigin: cx + " " + cy, duration: dur, ease, immediateRender: false }, at);
      if (to.color) tl.fromTo($("circle", p), { attr: { fill: K.dry } }, { attr: { fill: h.dataset.color }, duration: dur, ease: "power2.out", immediateRender: false }, at);
    });
    tl.fromTo($(".ctr", h), { scale: from.open, opacity: from.open > 0.05 ? 1 : 0, svgOrigin: cx + " " + cy },
      { scale: to.open, opacity: to.open > 0.05 ? 1 : 0, svgOrigin: cx + " " + cy, duration: dur, ease, immediateRender: false }, at);
  }

  // init head states and dry coloring
  $(".head").forEach((h) => {
    const droop = +h.dataset.droop, open = +h.dataset.open;
    h.dataset.cur_droop = droop; h.dataset.cur_open = open;
    headState(h, droop, open);
    if (droop >= 60) $("circle", h).forEach((c) => c.setAttribute("fill", K.dry)), $(".pt circle", h).forEach((c) => c.setAttribute("fill", K.dry));
  });

  // ---- per page ----
  const CAP_FADE = 10, ENT = TLD.enter;
  TLD.pages.forEach((pg, pi) => {
    const root = document.getElementById("pg-" + pg.id), S = pg.start, E = S + pg.dur;
    const page = $(".page", root)[0];
    const q = (s) => $(s, root);

    // band + caption
    tl.fromTo(q(".band"), { y: ENT.dy, opacity: 0 }, { y: 0, opacity: 1, duration: f(ENT.frames), ease: "power2.out" }, S + f(4));
    tl.fromTo(q(".cap"), { opacity: 0 }, { opacity: 1, duration: f(CAP_FADE), ease: "power1.out" }, pg.capAt);

    // entrances: sun, clouds, flowers float up (6 frames apart), hero pops with back.out
    tl.fromTo(q(".sun"), { opacity: 0 }, { opacity: 1, duration: f(ENT.frames), ease: "power2.out" }, S + f(2));
    tl.fromTo(q(".drift"), { opacity: 0 }, { opacity: 0.8, duration: f(ENT.frames), ease: "power2.out", stagger: f(ENT.stagger) }, S + f(6));
    tl.to(q(".drift"), { x: TLD.drift, duration: pg.dur + f(TURN), ease: "sine.inOut" }, S);
    q(".fl").forEach((el, i) => tl.fromTo(el, { y: ENT.dy, opacity: 0 }, { y: 0, opacity: 1, duration: f(ENT.frames), ease: "power2.out" }, S + f(10 + i * ENT.stagger)));
    const heroAt = S + f(10 + q(".fl").length * ENT.stagger);
    if (pg.kind === "cover") tl.fromTo(q(".hero"), { x: 900, opacity: 0 }, { x: 0, opacity: 1, duration: f(40), ease: "power2.out" }, S + f(6));
    else tl.fromTo(q(".hero"), { scale: 0.6, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: f(ENT.frames), ease: "back.out(" + ENT.heroBack + ")", transformOrigin: "50% 50%" }, Math.min(heroAt, S + f(30)));

    const heads = q(".head");
    const kindFx = {
      puff() {
        const t0 = S + f(30);
        tl.fromTo(q(".squash"), { scale: 1, transformOrigin: "50% 60%" }, { scale: 1.07, transformOrigin: "50% 60%", duration: f(12), ease: "power2.inOut", yoyo: true, repeat: 5 }, t0);
        tl.fromTo(q(".cheek"), { scale: 1, transformOrigin: "50% 50%" }, { scale: 1.25, transformOrigin: "50% 50%", duration: f(12), ease: "power2.inOut", yoyo: true, repeat: 5 }, t0);
        q(".puff").forEach((p, i) => tl.fromTo(p, { opacity: 0, x: 0 }, { opacity: 1, x: +p.dataset.d * 40, duration: f(14), ease: "power2.out", yoyo: true, repeat: 3 }, t0 + f((i % 3) * 5)));
      },
      sad() {
        tl.fromTo(q(".moko"), { rotation: 0, transformOrigin: "50% 50%" }, { rotation: -4, transformOrigin: "50% 50%", duration: f(40), ease: "sine.inOut" }, S + f(20));
        tl.fromTo(q(".wisp"), { x: 0, y: 0, opacity: 0 }, { x: 140, y: -70, opacity: 1, duration: f(30), ease: "power2.out" }, pg.capAt + f(40));
        tl.to(q(".wisp"), { opacity: 0, duration: f(30), ease: "power1.in" }, pg.capAt + f(70));
      },
      first() {
        tl.fromTo(q(".rain"), { opacity: 0 }, { opacity: 1, duration: f(24), ease: "power1.out" }, pg.capAt + f(14));
        tl.fromTo(q(".wetground"), { opacity: 0 }, { opacity: 0.5, duration: pg.dur - f(30), ease: "sine.inOut" }, S + f(30));
        heads.forEach((h) => headTween(h, S + f(40), pg.dur - f(40), { droop: 100, open: 0.45, color: false }, "sine.inOut"));
      },
      rain() {
        tl.fromTo(q(".rain"), { opacity: 0 }, { opacity: 1, duration: f(20), ease: "power1.out" }, S + f(4));
        tl.fromTo(q(".wetground"), { opacity: 0.5 }, { opacity: 1, duration: f(70), ease: "sine.inOut" }, S + f(10));
        tl.fromTo(q(".dryground"), { opacity: 1 }, { opacity: 0, duration: f(70), ease: "sine.inOut" }, S + f(10));
        q(".puddle").forEach((p, i) => tl.fromTo(p, { scaleX: 0.15, opacity: 0, transformOrigin: "50% 50%" }, { scaleX: 1, opacity: 1, transformOrigin: "50% 50%", duration: f(40), ease: "power2.out" }, S + f(30 + i * 14)));
        heads.forEach((h, i) => headTween(h, S + f(20 + i * 8), f(80), { droop: 10, open: 0.6, color: true }, "power2.inOut"));
      },
      bloom() {
        heads.forEach((h, i) => headTween(h, S + f(16 + i * 12), f(40), { droop: 0, open: 1, color: false }, "back.out(1.4)"));
        const arcs = q(".rainbow path");
        tl.fromTo(arcs, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: f(48), ease: "power2.out", stagger: f(4) }, S + f(10));
      },
      night() {
        tl.fromTo(q(".star"), { opacity: 0, scale: 0.2, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, transformOrigin: "50% 50%", duration: f(18), ease: "back.out(1.4)", stagger: f(6) }, S + f(14));
        tl.fromTo(q(".tag"), { y: ENT.dy, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: f(18), ease: "back.out(1.4)" }, S + f(TLD.endTagAt));
      },
    };
    (kindFx[pg.kind] || (() => {}))();

    // page turn: the old page curls left over 14 frames and reveals the next one
    if (pi < TLD.pages.length - 1) {
      const T0 = E;
      tl.fromTo(page, { scaleX: 1, skewY: 0, transformOrigin: "0% 50%", boxShadow: "0px 0px 0px rgba(62,47,37,0)" },
        { scaleX: TLD.turnTokens.minScale, skewY: TLD.turnTokens.skew, transformOrigin: "0% 50%", boxShadow: "30px 0px 60px rgba(62,47,37," + TLD.turnTokens.shadow + ")", duration: f(TURN), ease: "power2.inOut", immediateRender: false }, T0);
      tl.fromTo(page, { opacity: 1 }, { opacity: 0, duration: 0.01, immediateRender: false }, T0 + f(TURN));
    }
  });

  // ---- idle motion driven by one proxy tween (bob, blink, wobble seed, rain) ----
  const noise = document.getElementById("wobNoise");
  const bobs = $(".bob"), eyes = $(".eyes");
  const drops = TLD.pages.map((pg) => ({ pg, els: $(".drop", document.getElementById("pg-" + pg.id)) })).filter((d) => d.els.length);
  let lastSeed = -1;
  function apply(t) {
    const fr = Math.round(t * fps);
    const seed = (Math.floor(fr / K.wobbleEvery) % K.wobbleSeeds) + 1;
    if (seed !== lastSeed) { noise.setAttribute("seed", String(seed)); lastSeed = seed; }
    bobs.forEach((b, i) => gsap.set(b, { y: Math.sin(((t / K.bobSeconds) + i * 0.37) * Math.PI * 2) * K.bobPx }));
    eyes.forEach((e, i) => {
      const phase = (fr + 23 * i + 31) % 90;
      gsap.set(e, { scaleY: phase < K.blinkFrames ? 0.1 : 1, transformOrigin: "50% 50%" });
    });
    drops.forEach(({ pg, els }) => {
      const local = Math.max(0, t - pg.start);
      els.forEach((el) => {
        const u = (local * +el.dataset.sp + +el.dataset.ph) % 1;
        const x = +el.dataset.x0 + (+el.dataset.x1 - +el.dataset.x0) * u;
        const y = 735 + 250 * (0.35 * u + 0.65 * u * u);
        const o = Math.min(1, u * 8) * (u > 0.9 ? (1 - u) / 0.1 : 1);
        gsap.set(el, { x, y, opacity: o });
      });
    });
  }
  const proxy = { t: 0 };
  tl.to(proxy, { t: total, duration: total, ease: "none", onUpdate: () => apply(proxy.t) }, 0);
  apply(0);
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
})();
