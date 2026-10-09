// Single driver: a GSAP proxy tween calls render(frame); every visual value derives from the frame number.
(() => {
  const stage = document.getElementById("stage");
  const layers = HUD.build(stage);
  SCENES.forEach((s) => s.build(layers));

  const lastBeatPulse = (f) => {
    const b = Math.floor((f * T.C.format.bpm) / (60 * T.fps));
    const d = f - T.beatF(b);
    return d < 8 ? 0.08 * Math.pow(1 - d / 8, 2) : 0;
  };

  function render(raw) {
    const f = Math.max(0, Math.min(T.N - 1, Math.round(raw)));
    const ctx = { hudOp: 1, ringScale: 1 + lastBeatPulse(f), ringDX: 0, ringDY: 0, ringDraw: 1, ringOp: 1, scanSpeed: 1, blackout: 0 };
    SCENES.forEach((s) => {
      const on = f >= s.start && f < s.end;
      s.near.style.display = on ? "block" : "none";
      if (on) s.update(f, ctx);
    });
    HUD.update(f, ctx, T.camera(f));
  }

  const proxy = { f: 0 };
  const tl = gsap.timeline({ paused: true });
  tl.to(proxy, { f: T.N, duration: T.N / T.fps, ease: "none", onUpdate: () => render(proxy.f) }, 0);
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  window.__renderFrame = render;
  render(0);
})();
