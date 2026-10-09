// Cold open: black, boot lines type in, rings draw on, loading bar fills up to the first hit.
SCENES.push(
  (() => {
    const { C, mk, mono, prog, clamp, expoOut, col, W, H, beatF } = T;
    const s = { name: "cold", start: 0, end: beatF(C.beats.hits) };
    const lines = C.cold.boot;
    const total = lines.reduce((n, l) => n + l.length, 0);
    let boot;
    let bar;
    let barFill;
    let centerEl;

    s.build = (L) => {
      s.near = mk(L.near, `left:0;top:0;width:${W}px;height:${H}px;`);
      boot = mk(s.near, `left:160px;top:${H / 2 - 40}px;${mono(20, 0.75)}line-height:1.7;`);
      centerEl = mk(s.near, `left:50%;top:${H / 2 + 330}px;transform:translateX(-50%);${mono(18, 0.7)}`);
      bar = mk(s.near, `left:${W / 2 - 240}px;top:${H / 2 + 372}px;width:480px;height:2px;background:${col.accent}33;`);
      barFill = mk(bar, `left:0;top:0;height:2px;width:0;background:${col.accent};`);
    };

    s.update = (f, ctx) => {
      const p = prog(f, 0, s.end - 6);
      ctx.hudOp = clamp(f / 14);
      ctx.ringDraw = expoOut(prog(f, 4, s.end - 8));
      ctx.scanSpeed = 1.5;
      let typed = Math.floor(total * clamp((f - 4) / (s.end - 16)));
      let html = "";
      for (const l of lines) {
        const n = clamp(typed, 0, l.length);
        html += l.slice(0, n) + (n > 0 && n < l.length && Math.floor(f / 3) % 2 ? "█" : "") + "<br>";
        typed -= l.length;
      }
      boot.innerHTML = html;
      centerEl.textContent = p > 0.3 ? C.cold.center + "  " + String(Math.floor(p * 100)).padStart(3, "0") + "%" : "";
      barFill.style.width = `${p * 480}px`;
    };
    return s;
  })()
);
