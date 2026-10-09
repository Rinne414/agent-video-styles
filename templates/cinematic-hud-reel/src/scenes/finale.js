// Logo finale: NOVA LABS assembles from stroked line segments, locks on the beat, glow settles, tagline + handle.
SCENES.push(
  (() => {
    const { C, mk, mono, glow, prog, clamp, expoOut, lerp, col, W, H, beatF, hrand, B, decode, N } = T;
    const s = { name: "finale", start: beatF(B.finale), end: N };
    const lockF = beatF(B.lock);
    const U = 25; // grid unit in px
    const ADV = 5.4;
    // Stroke letters on a 4 x 6 grid (y down), chamfered corners for a HUD feel.
    const GLYPH = {
      N: [[[0, 6], [0, 0], [4, 6], [4, 0]]],
      O: [[[1, 0], [3, 0], [4, 1], [4, 5], [3, 6], [1, 6], [0, 5], [0, 1], [1, 0]]],
      V: [[[0, 0], [2, 6], [4, 0]]],
      A: [[[0, 6], [2, 0], [4, 6]], [[0.9, 4], [3.1, 4]]],
      L: [[[0, 0], [0, 6], [4, 6]]],
      B: [[[0, 6], [0, 0], [3, 0], [4, 1], [4, 2], [3, 3], [0, 3]], [[3, 3], [4, 4], [4, 5], [3, 6], [0, 6]]],
      S: [[[4, 1], [3, 0], [1, 0], [0, 1], [0, 2], [1, 3], [3, 3], [4, 4], [4, 5], [3, 6], [1, 6], [0, 5]]],
    };
    const name = C.brand.name;
    const totalW = (name.length - 1) * ADV + 4;
    const x0 = (W - totalW * U) / 2;
    const y0 = H / 2 - 3 * U - 20;
    const segs = [];
    let svgPaths = "";
    Array.from(name).forEach((ch, i) => {
      (GLYPH[ch] || []).forEach((pts, j) => {
        const d = pts.map((p, k) => `${k ? "L" : "M"}${(x0 + (i * ADV + p[0]) * U).toFixed(1)},${(y0 + p[1] * U).toFixed(1)}`).join(" ");
        const id = segs.length;
        svgPaths += `<path id="seg${id}" d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" />`;
        segs.push({ id, i, j, dx: (hrand(5, id, 1) * 2 - 1) * 520, dy: (hrand(5, id, 2) * 2 - 1) * 300, rot: (hrand(5, id, 3) * 2 - 1) * 25, cx: x0 + (i * ADV + 2) * U, cy: y0 + 3 * U });
      });
    });
    let svg;
    let logo;
    let tag;
    let handle;
    let subEl;
    const els = [];

    s.build = (L) => {
      s.near = mk(L.near, `left:0;top:0;width:${W}px;height:${H}px;`);
      const hl = y0 + 3 * U;
      s.near.insertAdjacentHTML(
        "beforeend",
        `<svg id="logoSvg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:0;top:0;overflow:visible">
          <g id="logoG" fill="none" stroke="${col.ice}" stroke-width="5" stroke-linejoin="miter" stroke-linecap="square">${svgPaths}</g>
          <g stroke="${col.accent}" stroke-width="2" id="rule">
            <path id="ruleL" d="M${x0 - 40},${hl} H${x0 - 320}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
            <path id="ruleR" d="M${x0 + totalW * U + 40},${hl} H${x0 + totalW * U + 320}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
          </g></svg>`
      );
      svg = document.getElementById("logoSvg");
      logo = document.getElementById("logoG");
      segs.forEach((g) => els.push(document.getElementById("seg" + g.id)));
      subEl = mk(s.near, `${mono(16, 0.6)}left:50%;top:${y0 - 70}px;transform:translateX(-50%);`);
      tag = mk(s.near, `${mono(26, 0.95)}left:50%;top:${y0 + 6 * U + 56}px;transform:translateX(-50%);`);
      handle = mk(s.near, `${mono(18, 0.6)}left:50%;top:${y0 + 6 * U + 120}px;transform:translateX(-50%);`);
    };

    s.update = (f, ctx) => {
      ctx.hudOp = 1;
      const t = f - s.start;
      ctx.ringScale *= 0.92;
      ctx.ringDY = -20;
      segs.forEach((g) => {
        const t0 = s.start + 3 + g.i * 2 + g.j * 1;
        const p = expoOut(prog(f, t0, t0 + 24));
        const e = els[g.id];
        e.setAttribute("stroke-dashoffset", (1 - p).toFixed(3));
        e.setAttribute("opacity", clamp(p * 4).toFixed(2));
        e.setAttribute("transform", `translate(${((1 - p) * g.dx).toFixed(1)} ${((1 - p) * g.dy).toFixed(1)}) rotate(${((1 - p) * g.rot).toFixed(1)} ${g.cx.toFixed(1)} ${g.cy.toFixed(1)})`);
      });
      ["ruleL", "ruleR"].forEach((id) => {
        document.getElementById(id).setAttribute("stroke-dashoffset", (1 - expoOut(prog(f, s.start + 10, lockF))).toFixed(3));
      });
      // glow peaks on the lock hit, then settles
      const settle = f < lockF ? 0.6 + 0.4 * prog(f, s.start, lockF) : 1 + 1.2 * Math.max(0, 1 - (f - lockF) / 24);
      const breathe = 1 + 0.06 * Math.sin(f * 0.18);
      const k = settle * breathe;
      let sp = 0;
      for (const h of T.hits) if (f - h.f >= 0 && f - h.f < 3) sp = Math.max(sp, h.split * (1 - (f - h.f) / 3));
      logo.style.filter = `drop-shadow(${sp}px 0 0 ${col.splitA}) drop-shadow(${-sp}px 0 0 ${col.splitB}) drop-shadow(0 0 ${14 * k}px ${col.accent}) drop-shadow(0 0 ${40 * k}px ${col.accent}88)`;
      subEl.textContent = prog(f, lockF - 14, lockF) > 0 ? decode(C.finale.sub, Math.max(0, f - (lockF - 14)), 14, 71) : "";
      tag.textContent = f >= lockF + 2 ? decode(C.brand.tagline, f - lockF - 2, 12, 72) : "";
      handle.textContent = f >= lockF + 10 ? decode(C.brand.handle, f - lockF - 10, 12, 73) : "";
    };
    return s;
  })()
);
