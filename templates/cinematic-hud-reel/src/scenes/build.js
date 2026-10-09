// Build: one decoded keyword per two beats, terminal micro-type, data spikes, riser into "THEY NEVER".
SCENES.push(
  (() => {
    const { C, mk, mono, head, glow, prog, clamp, expoOut, col, W, H, beatF, decode, hrand, B } = T;
    const cfg = C.build;
    const s = { name: "build", start: beatF(B.build), end: beatF(B.drop) };
    const DECODE = 9;
    const words = cfg.words.map((w) => ({ ...w, f: beatF(w.beat) }));
    const never = { ...cfg.never, f: beatF(cfg.never.beat) };
    const BARS = 20;
    const SP = "text-shadow:var(--sp) 0 0 " + col.splitA + ", calc(var(--sp) * -1) 0 0 " + col.splitB + ";";
    let term;
    let termTitle;
    let bars = [];
    let chartLabel;
    let wordEl;
    let neverEl;
    let cells = [];
    let panels;

    // Per-character cells keep the layout stable while glyphs cycle.
    function cellWord(parent, text, px) {
      const wrap = mk(parent, `left:50%;top:50%;${head(px)}display:flex;transform:translate(-50%,-50%);`);
      const cells = Array.from(text).map((ch) => {
        const c = document.createElement("span");
        c.style.cssText = "display:inline-block;text-align:center;";
        c.textContent = ch;
        wrap.appendChild(c);
        return { c, ch };
      });
      return { wrap, cells, measured: false };
    }

    s.build = (L) => {
      s.near = mk(L.near, `left:0;top:0;width:${W}px;height:${H}px;`);
      panels = mk(s.near, `left:0;top:0;width:${W}px;height:${H}px;`);
      termTitle = mk(panels, `left:120px;top:300px;${mono(14, 0.5)}`, "AGENT.LOG // LIVE");
      mk(panels, `left:120px;top:326px;width:280px;height:1px;background:${col.accent}66;`);
      term = mk(panels, `left:120px;top:340px;width:280px;${mono(15, 0.7)}line-height:1.65;`);
      chartLabel = mk(panels, `right:120px;top:300px;${mono(14, 0.5)}text-align:right;`, "THROUGHPUT // PR/MIN");
      mk(panels, `right:120px;top:326px;width:280px;height:1px;background:${col.accent}66;`);
      for (let i = 0; i < BARS; i++) {
        bars.push(mk(panels, `right:${120 + (BARS - 1 - i) * 15}px;top:340px;width:9px;height:10px;background:${col.accent};opacity:0.7;transform-origin:50% 0;`));
      }
      mk(panels, `right:120px;top:560px;${mono(14, 0.5)}text-align:right;`, "UTIL 98.6%  //  QUEUE 0");
      neverEl = mk(s.near, `${head(160)}${SP}left:50%;top:50%;`, never.text);
      s.wordMeta = [];
      words.forEach((w) => {
        s.wordMeta.push({ w, ...cellWord(s.near, w.text, 168) });
      });
    };

    s.update = (f, ctx) => {
      ctx.hudOp = 1;
      const nv = f >= never.f - 5;
      const riser = prog(f, beatF(C.beats.riserFrom), beatF(B.drop));
      panels.style.opacity = nv ? 0.4 : 1;
      // terminal: ~1 line / 7 frames
      const t = f - s.start;
      const idx = Math.floor(t / 7);
      const lines = cfg.terminal;
      let html = "";
      for (let i = Math.max(0, idx - 8); i <= idx; i++) {
        const ln = lines[i % lines.length];
        const part = i === idx ? ln.slice(0, Math.ceil(ln.length * ((t % 7) + 1) / 7)) : ln;
        html += `<span style="color:${ln.startsWith("[ok]") ? col.accent : col.ice}">${part}</span><br>`;
      }
      term.innerHTML = html;
      bars.forEach((b, i) => {
        const h = 20 + 150 * hrand(31, Math.floor(f / 2), i) * (0.5 + 0.5 * Math.sin(i * 0.5 + f * 0.05) ** 2 + riser * 0.8);
        b.style.height = Math.min(190, h) + "px";
        b.style.opacity = i === (Math.floor(f / 2) % BARS) ? 1 : 0.6;
      });
      // decoded keywords
      s.wordMeta.forEach((m, mi) => {
        const nextF = words[mi + 1] ? words[mi + 1].f - 3 : never.f - 5;
        const on = f >= m.w.f - 3 && f < nextF;
        m.wrap.style.display = on ? "flex" : "none";
        if (!on) return;
        if (!m.measured && document.fonts.status === "loaded") {
          m.cells.forEach((c) => {
            c.c.style.width = "";
            c.c.style.width = c.c.offsetWidth + 2 + "px";
          });
          m.measured = true;
        }
        const d = f - (m.w.f - 3);
        m.cells.forEach((c, i) => {
          const done = d >= ((i + 1) * DECODE) / m.cells.length;
          c.c.textContent = done ? c.ch : T.decode("x", d, 99, 50 + i * 7 + mi)[0];
          c.c.style.color = done ? col.ice : col.accent;
        });
        const k = 1 - expoOut(prog(f, m.w.f - 3, m.w.f + 3));
        m.wrap.style.transform = `translate(-50%,-50%) scale(${1 + 0.1 * k})`;
        m.wrap.style.textShadow = glow(1);
      });
      // THEY NEVER slam
      neverEl.style.display = nv ? "block" : "none";
      if (nv) {
        const p = prog(f, never.f - 5, never.f);
        neverEl.style.transform = `translate(-50%,-50%) scale(${1.4 - 0.4 * expoOut(p)})`;
        neverEl.style.opacity = clamp(p * 1.6);
        neverEl.style.textShadow = `var(--sp) 0 0 ${col.splitA}, calc(var(--sp) * -1) 0 0 ${col.splitB}, ${glow(1 + 0.8 * riser)}`;
        ctx.ringScale *= 1 + 0.1 * riser * riser;
      }
      // riser: flicker the HUD, then a 2-frame blackout before the drop
      if (riser > 0) ctx.hudOp = hrand(9, f) > riser * 0.5 ? 1 : 0.5;
      ctx.scanSpeed = 1 + 2 * riser;
      if (f >= s.end - 2) ctx.blackout = 1;
    };
    return s;
  })()
);
