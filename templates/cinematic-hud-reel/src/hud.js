// Persistent layers: far (stars + grid), mid (HUD), near (scene type). All values are pure functions of the frame.
const HUD = (() => {
  const { W, H, col, mk, prog, expoOut, hrand, beatF, C } = T;
  const CX = W / 2;
  const CY = H / 2;
  const SAFE = 96;
  const RINGS = [
    { r: 240, dash: "3 9", w: 2, op: 0.55, rate: 0.6 },
    { r: 330, dash: "140 30 40 30", w: 1.5, op: 0.6, rate: -1.1 },
    { r: 450, dash: "2 14", w: 1, op: 0.45, rate: 0.9 },
    { r: 560, dash: "260 60", w: 2, op: 0.35, rate: -0.5 },
    { r: 640, dash: "1 6", w: 1, op: 0.3, rate: 1.6 },
  ];
  const riserA = beatF(C.beats.riserFrom);
  const riserB = beatF(C.beats.drop);
  const L = {};
  const ringG = [];
  let drawRing;
  let scan;
  let flashEl;
  let blackEl;
  let rulerL;
  let rulerR;
  let tr;
  let bl;
  let br;
  let brk;

  // Ring clock: f plus the integral of a 1->4x speed ramp over the riser.
  function ringClock(f) {
    const len = riserB - riserA;
    const r = Math.min(Math.max(f - riserA, 0), len);
    return f + (r * r * r) / (len * len);
  }

  function drawFar() {
    const cv = document.createElement("canvas");
    cv.width = 2300;
    cv.height = 1300;
    cv.style.cssText = "position:absolute;left:-190px;top:-110px;";
    const g = cv.getContext("2d");
    g.strokeStyle = "rgba(255,255,255,0.03)";
    g.lineWidth = 1;
    for (let x = 0; x <= 2300; x += 80) {
      g.beginPath();
      g.moveTo(x + 0.5, 0);
      g.lineTo(x + 0.5, 1300);
      g.stroke();
    }
    for (let y = 0; y <= 1300; y += 80) {
      g.beginPath();
      g.moveTo(0, y + 0.5);
      g.lineTo(2300, y + 0.5);
      g.stroke();
    }
    for (let i = 0; i < 240; i++) {
      const a = 0.02 + 0.02 * T.hrand(1000, i, 3);
      g.fillStyle = `rgba(255,255,255,${a})`;
      const s = 1 + Math.floor(T.hrand(1000, i, 4) * 2);
      g.fillRect(T.hrand(1000, i, 1) * 2300, T.hrand(1000, i, 2) * 1300, s, s);
    }
    L.far.appendChild(cv);
  }

  function ringSvg() {
    const c = col.accent;
    let s = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;overflow:visible">`;
    s += `<g id="hudRings">`;
    RINGS.forEach((r, i) => {
      s += `<g id="ring${i}"><circle r="${r.r}" fill="none" stroke="${c}" stroke-width="${r.w}" stroke-dasharray="${r.dash}"/></g>`;
    });
    s += `<circle id="drawRing" r="285" fill="none" stroke="${col.ice}" stroke-opacity="0.5" stroke-width="1.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="0" transform="rotate(-90)"/>`;
    s += `</g>`;
    s += `<g stroke="${c}" stroke-width="2" fill="none" opacity="0.8" id="brk">`;
    const a = 40;
    const o = SAFE;
    s += `<path d="M${o},${o + a} V${o} H${o + a}"/><path d="M${W - o - a},${o} H${W - o} V${o + a}"/>`;
    s += `<path d="M${o},${H - o - a} V${H - o} H${o + a}"/><path d="M${W - o - a},${H - o} H${W - o} V${H - o - a}"/>`;
    s += `</g>`;
    s += `<g stroke="${col.ice}" stroke-opacity="0.5" stroke-width="1" id="xhair"><path d="M${CX - 14},${CY} H${CX + 14} M${CX},${CY - 14} V${CY + 14}"/></g>`;
    s += `</svg>`;
    return s;
  }

  function build(stage) {
    L.far = mk(stage, `left:0;top:0;width:${W}px;height:${H}px;`);
    L.mid = mk(stage, `left:0;top:0;width:${W}px;height:${H}px;`);
    L.near = mk(stage, `left:0;top:0;width:${W}px;height:${H}px;`);
    drawFar();
    L.mid.insertAdjacentHTML("beforeend", ringSvg());
    RINGS.forEach((_, i) => ringG.push(document.getElementById("ring" + i)));
    drawRing = document.getElementById("drawRing");
    brk = document.getElementById("brk");
    const ruler = `repeating-linear-gradient(to bottom, rgba(207,232,255,0.5) 0 1px, transparent 1px 12px)`;
    rulerL = mk(L.mid, `left:${SAFE + 16}px;top:340px;width:14px;height:400px;background:${ruler};opacity:0.35;`);
    rulerR = mk(L.mid, `left:${W - SAFE - 30}px;top:340px;width:14px;height:400px;background:${ruler};opacity:0.35;`);
    scan = mk(L.mid, `left:0;top:0;width:${W}px;height:60px;background:linear-gradient(to bottom, transparent, ${col.accent}22 90%, ${col.accent}aa 98%, ${col.accent} 100%);opacity:0.5;`);
    mk(L.mid, `left:${SAFE + 28}px;top:${SAFE + 20}px;${T.mono(16)}`, C.brand.sys + "  //  SYS.ONLINE");
    tr = mk(L.mid, `right:${SAFE + 28}px;top:${SAFE + 20}px;${T.mono(16)}text-align:right;`);
    bl = mk(L.mid, `left:${SAFE + 28}px;bottom:${SAFE + 20}px;${T.mono(14, 0.5)}line-height:1.5;`);
    br = mk(L.mid, `right:${SAFE + 28}px;bottom:${SAFE + 20}px;${T.mono(16)}text-align:right;`);
    flashEl = mk(L.near, `left:0;top:0;width:${W}px;height:${H}px;background:#fff;opacity:0;`);
    blackEl = mk(stage, `left:0;top:0;width:${W}px;height:${H}px;background:${col.bg};opacity:0;`);
    return L;
  }

  const pad = (n, k = 2) => String(n).padStart(k, "0");

  function update(f, ctx, cam) {
    const apply = (el, k) => {
      el.style.transform = `translate(${cam.x * k}px,${cam.y * k}px) scale(${1 + (cam.s - 1) * k})`;
    };
    L.far.style.transform = `translate(${cam.x * 0.3 - f * 0.2}px,${cam.y * 0.3}px) scale(${1 + (cam.s - 1) * 0.3})`;
    apply(L.mid, 0.6);
    apply(L.near, 1);
    L.mid.style.opacity = ctx.hudOp;

    const clk = ringClock(f);
    RINGS.forEach((r, i) => {
      const d = T.clamp(ctx.ringDraw * 1.6 - i * 0.15);
      const sc = ctx.ringScale * (0.7 + 0.3 * expoOut(d));
      ringG[i].setAttribute("transform", `translate(${CX + ctx.ringDX} ${CY + ctx.ringDY}) rotate(${clk * r.rate}) scale(${sc})`);
      ringG[i].setAttribute("opacity", (r.op * expoOut(d) * ctx.ringOp).toFixed(3));
    });
    drawRing.setAttribute("stroke-dashoffset", (1 - ctx.ringDraw).toFixed(3));
    drawRing.setAttribute("transform", `translate(${CX + ctx.ringDX} ${CY + ctx.ringDY}) rotate(-90) scale(${ctx.ringScale})`);

    const sy = ((f * ctx.scanSpeed) % 45) / 45;
    scan.style.transform = `translateY(${sy * H - 60}px)`;
    rulerL.style.backgroundPositionY = `${f * 3}px`;
    rulerR.style.backgroundPositionY = `${-f * 3}px`;
    brk.setAttribute("opacity", (0.8 - 0.3 * (T.hits.some((h) => f - h.f >= 0 && f - h.f < 2) ? 0 : 1)).toFixed(2));

    const sec = Math.floor(f / T.fps);
    const fr = Math.floor((f % T.fps) / 2) * 2;
    tr.textContent = `TC 00:${pad(sec)}:${pad(fr)}  //  REC`;
    const hx = (n) => Math.floor(hrand(77, Math.floor(f / 2), n) * 0xffffff).toString(16).toUpperCase().padStart(6, "0");
    bl.innerHTML = `0x${hx(1)} 0x${hx(2)}<br>0x${hx(3)} 0x${hx(4)}<br>MESH ${pad(128 - (Math.floor(f / 6) % 3))}/128`;
    const beat = (f * C.format.bpm) / (60 * T.fps);
    br.textContent = `BPM ${C.format.bpm}  //  BAR ${pad(Math.floor(beat / 4) + 1)}.${Math.floor(beat % 4) + 1}`;

    let fl = 0;
    let sp = 0;
    for (const h of T.hits) {
      const d = f - h.f;
      if (d >= 0 && d < 2) fl = Math.max(fl, h.flash);
      if (d >= 0 && d < 3) sp = Math.max(sp, h.split * (1 - d / 3));
    }
    flashEl.style.opacity = fl;
    L.near.style.setProperty("--sp", sp.toFixed(1) + "px");
    blackEl.style.opacity = ctx.blackout;
  }

  return { build, update, ringClock };
})();
