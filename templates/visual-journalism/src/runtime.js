// Inline runtime: turns data-* markup into one paused GSAP timeline.
// Globals injected by build.mjs before this file: TL (scene times), MOTION (frames), FPS.
(function () {
  const f = (n) => n / FPS;
  const tl = gsap.timeline({ paused: true });
  const num = (el, k, d) => (el.getAttribute(k) !== null ? parseFloat(el.getAttribute(k)) : d);

  document.querySelectorAll(".scene").forEach((scene) => {
    const start = num(scene, "data-start", 0);
    const dur = num(scene, "data-duration", 3);
    const cam = scene.querySelector(".cam");
    tl.fromTo(cam, { scale: 1 }, { scale: MOTION.camPush, duration: dur, ease: "power1.out" }, start);

    // Cards: enter with a 5-frame stagger unless a data-rel time is given.
    let k = 0;
    scene.querySelectorAll("[data-card]").forEach((card) => {
      const r = num(card, "data-r", 0);
      const t = card.hasAttribute("data-t") ? num(card, "data-t", start) : start + f(4 + k * MOTION.staggerFrames);
      k++;
      tl.fromTo(card, { y: 60, rotation: r + 3, opacity: 0 }, { y: 0, rotation: r, opacity: 1, duration: f(MOTION.entranceFrames), ease: "power3.out" }, t);
      const drift = card.querySelector(".drift");
      tl.fromTo(drift, { y: 0 }, { y: -MOTION.driftPx * num(drift, "data-drift", 1), duration: dur, ease: "sine.inOut" }, start);
    });

    // Headline plate: tilt and unblur.
    scene.querySelectorAll("[data-plate]").forEach((plate) => {
      tl.fromTo(plate, { rotationY: -15, filter: "blur(14px)", opacity: 0, transformPerspective: 1400 },
        { rotationY: 0, filter: "blur(0px)", opacity: 1, duration: f(MOTION.plateFrames), ease: "power3.out" }, start + f(2));
      tl.fromTo(plate, { y: 0 }, { y: -MOTION.driftPx, duration: dur, ease: "sine.inOut" }, start);
    });

    // Fade-up text / labels.
    scene.querySelectorAll("[data-in]").forEach((el) => {
      const t = num(el, "data-t", start);
      tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: f(10), ease: "power2.out" }, t);
    });

    // Marker highlights wipe left to right behind the words.
    scene.querySelectorAll("mark.hl").forEach((m) => {
      const t = num(m, "data-t", start);
      tl.fromTo(m, { backgroundSize: "0% " + num(m, "data-h", 88) + "%" }, { backgroundSize: "100% " + num(m, "data-h", 88) + "%", duration: f(MOTION.highlightFrames), ease: "power2.inOut" }, t);
    });

    // Dashed lines: a white stroked mask with pathLength=1 draws them on.
    scene.querySelectorAll("path[data-draw]").forEach((p, i) => {
      const svg = p.ownerSVGElement;
      const ns = "http://www.w3.org/2000/svg";
      let defs = svg.querySelector("defs");
      if (!defs) { defs = document.createElementNS(ns, "defs"); svg.insertBefore(defs, svg.firstChild); }
      const id = "m-" + scene.id + "-" + defs.children.length + "-" + i;
      const mask = document.createElementNS(ns, "mask");
      mask.setAttribute("id", id);
      mask.setAttribute("maskUnits", "userSpaceOnUse");
      mask.setAttribute("x", "-600"); mask.setAttribute("y", "-600"); mask.setAttribute("width", "3000"); mask.setAttribute("height", "3000");
      const m = document.createElementNS(ns, "path");
      m.setAttribute("d", p.getAttribute("d"));
      m.setAttribute("pathLength", "1");
      m.setAttribute("fill", "none"); m.setAttribute("stroke", "#fff"); m.setAttribute("stroke-width", "16"); m.setAttribute("stroke-linecap", "round");
      m.setAttribute("stroke-dasharray", "1 2");
      mask.appendChild(m); defs.appendChild(mask);
      p.setAttribute("mask", "url(#" + id + ")");
      tl.fromTo(m, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: f(MOTION.drawFrames), ease: "power1.inOut" }, num(p, "data-t", start));
    });

    // Solid marks (red) draw with dashoffset directly.
    scene.querySelectorAll("path[data-wipe]").forEach((p) => {
      p.setAttribute("pathLength", "1"); p.setAttribute("stroke-dasharray", "1 2");
      tl.fromTo(p, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: f(12), ease: "power2.out" }, num(p, "data-t", start));
    });

    // Arrow heads pop at the end of the draw they belong to.
    scene.querySelectorAll("path[data-pop]").forEach((p) => {
      const t = num(p, "data-t", start) + f(MOTION.drawFrames);
      tl.fromTo(p, { scale: 0, opacity: 0, svgOrigin: num(p, "data-ox", 0) + " " + num(p, "data-oy", 0) }, { scale: 1, opacity: 1, duration: f(8), ease: "back.out(2.5)", svgOrigin: num(p, "data-ox", 0) + " " + num(p, "data-oy", 0) }, t);
    });

    // Bars grow from the baseline.
    scene.querySelectorAll("[data-grow]").forEach((r) => {
      tl.fromTo(r, { scaleY: 0, svgOrigin: num(r, "data-ox", 0) + " " + num(r, "data-oy", 0) }, { scaleY: 1, duration: f(18), ease: "power3.out", svgOrigin: num(r, "data-ox", 0) + " " + num(r, "data-oy", 0) }, num(r, "data-t", start));
    });
  });

  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
})();
