// Frame-driven renderer. Every visual value is a pure function of the frame number.
// DATA is injected by scripts/build.mjs: { fps, total, ink:[[s,e,len,x0,y0,x1,y1,block]], cam:[[s,e,cx,cy]],
// erase:[[startFrame,groupId]], ERASE_FRAMES, board:{w,h} }.
(function () {
  const svgNS = "http://www.w3.org/2000/svg";
  const paths = Array.from(document.querySelectorAll("#ink path"));
  const groups = { hook: document.getElementById("g-hook"), main: document.getElementById("g-main"), end: document.getElementById("g-end") };
  const clips = { hook: document.getElementById("clip-hook-rect"), main: document.getElementById("clip-main-rect") };
  const cam = document.getElementById("cam");
  const pen = document.getElementById("pen");
  const penCap = document.getElementById("pen-cap");
  const eraser = document.getElementById("eraser");
  const state = paths.map(() => -1);
  const INK = DATA.ink;

  // Position along the stroke: ease only the first and last RAMP frames (per-stroke, see DATA.ink[8]) (constant speed in between).
  function progress(f, s, e, RAMP) {
    const n = e - s;
    const u = (f - s) / n;
    if (u <= 0) return 0;
    if (u >= 1) return 1;
    if (RAMP <= 0) return u;
    const a = Math.min(0.5, RAMP / n);
    const norm = 1 - a;
    if (u < a) return (u * u) / (2 * a) / norm;
    if (u <= 1 - a) return (a / 2 + (u - a)) / norm;
    const v = 1 - u;
    return (norm - (v * v) / (2 * a)) / norm;
  }

  const ease2 = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2); // power2.inOut

  function drawInk(f) {
    let active = -1;
    let last = -1;
    for (let i = 0; i < INK.length; i++) {
      const [s, e, len, , , , , , ramp] = INK[i];
      const el = paths[i];
      if (f <= s) {
        if (state[i] !== 0) { el.style.display = "none"; state[i] = 0; }
        continue;
      }
      last = i;
      const p = progress(f, s, e, ramp);
      if (p >= 1) {
        if (state[i] !== 2) { el.style.display = ""; el.style.strokeDasharray = "none"; el.style.strokeDashoffset = "0"; state[i] = 2; }
        continue;
      }
      active = i;
      el.style.display = "";
      el.style.strokeDasharray = "1 2";
      el.style.strokeDashoffset = String(1 - p);
      state[i] = 1;
      el.__p = p;
    }
    return { active, last };
  }

  function drawPen(f, a) {
    let x = 0, y = 0, lift = 0, show = false, color = "#1B1F2A";
    if (a.active >= 0) {
      const el = paths[a.active];
      const pt = el.getPointAtLength((el.__p || 0) * INK[a.active][2]);
      x = pt.x; y = pt.y; show = true; color = el.getAttribute("stroke");
    } else if (a.last >= 0) {
      const k = a.last;
      const gap = f - INK[k][1];
      const next = INK[k + 1];
      if (next && next[7] === INK[k][7] && next[0] - INK[k][1] <= 26) {
        const u = Math.min(1, Math.max(0, gap / Math.max(1, next[0] - INK[k][1])));
        const w = ease2(u);
        x = INK[k][5] + (next[3] - INK[k][5]) * w;
        y = INK[k][6] + (next[4] - INK[k][6]) * w;
        lift = 12 * Math.sin(Math.PI * Math.min(1, u * 1.0)) ; show = true;
        color = paths[k].getAttribute("stroke");
      } else if (gap < 8) {
        x = INK[k][5]; y = INK[k][6]; lift = 12 * Math.min(1, gap / 6); show = true; color = paths[k].getAttribute("stroke");
      }
    }
    if (!show) { pen.setAttribute("display", "none"); return; }
    pen.removeAttribute("display");
    pen.setAttribute("transform", "translate(" + x.toFixed(1) + " " + (y - lift).toFixed(1) + ")");
    penCap.setAttribute("fill", color);
  }

  function drawErase(f) {
    let ex = null;
    for (const [group, start] of DATA.erase) {
      const u = (f - start) / DATA.ERASE_FRAMES;
      const rect = clips[group];
      if (u <= 0) { rect.setAttribute("x", "0"); rect.setAttribute("width", String(DATA.board.w)); continue; }
      if (u >= 1) { rect.setAttribute("x", String(DATA.board.w)); rect.setAttribute("width", "0"); groups[group].setAttribute("display", "none"); continue; }
      groups[group].removeAttribute("display");
      const x = -70 + (DATA.board.w + 70) * ease2(u);
      rect.setAttribute("x", x.toFixed(1));
      rect.setAttribute("width", String(Math.max(0, DATA.board.w - x)));
      ex = x;
    }
    if (ex === null) eraser.setAttribute("display", "none");
    else { eraser.removeAttribute("display"); eraser.setAttribute("transform", "translate(" + (ex - 70).toFixed(1) + " 0)"); }
  }

  function drawCamera(f) {
    let sc = 1, cx = 0, cy = 0;
    for (const [s, e, zx, zy] of DATA.cam) {
      if (f >= s && f < e) { sc = 1 + 0.02 * Math.sin((Math.PI * (f - s)) / (e - s)); cx = zx; cy = zy; break; }
    }
    cam.setAttribute("transform", "translate(" + ((1 - sc) * cx).toFixed(2) + " " + ((1 - sc) * cy).toFixed(2) + ") scale(" + sc.toFixed(5) + ")");
  }

  window.renderBoard = function (f) {
    const a = drawInk(f);
    drawErase(f);
    drawPen(f, a);
    drawCamera(f);
  };

  const proxy = { f: 0 };
  const tl = gsap.timeline({ paused: true });
  tl.to(proxy, { f: DATA.total, duration: DATA.total / DATA.fps, ease: "none", onUpdate: () => window.renderBoard(Math.round(proxy.f)) }, 0);
  window.__timelines = window.__timelines || {};
  window.__timelines["main"] = tl;
  window.renderBoard(0);
})();
