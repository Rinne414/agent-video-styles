// Hits I: keyword slams on the beat, lock-on brackets, then a metrics shot that whips in.
SCENES.push(
  (() => {
    const { C, mk, mono, head, glow, prog, clamp, expoOut, expoIn, lerp, col, W, H, beatF, decode, centered, B } = T;
    const cfg = C.hits;
    const s = { name: "hits", start: beatF(B.hits), end: beatF(B.build) };
    const shots = cfg.shots.map((x) => ({ ...x, f: beatF(x.beat) }));
    const mf = beatF(cfg.metricsBeat);
    const WHIP = 5;
    const lineIds = [...new Set(shots.map((x) => x.line))];
    const lines = lineIds.map((id, i) => {
      const mine = shots.filter((x) => x.line === id);
      const nextF = i + 1 < lineIds.length ? shots.find((x) => x.line === lineIds[i + 1]).f : mf;
      return { shots: mine, show: mine[0].f - 5, end: nextF - 6 };
    });
    let words = [];
    let tags = [];
    let box;
    let corners = [];
    let met;
    let metEls = [];

    s.build = (L) => {
      s.near = mk(L.near, `left:0;top:0;width:${W}px;height:${H}px;`);
      shots.forEach((x) => {
        const sp = `text-shadow:var(--sp) 0 0 ${col.splitA}, calc(var(--sp) * -1) 0 0 ${col.splitB};`;
        words.push(mk(s.near, `${head(176)}${sp}`, x.text));
        tags.push(mk(s.near, `${mono(16, 0.65)}left:50%;top:50%;`, ""));
      });
      box = mk(s.near, "left:0;top:0;width:10px;height:10px;");
      for (let i = 0; i < 4; i++) {
        const cs = `width:40px;height:40px;border:0 solid ${col.accent};`;
        const b = [`border-top-width:2px;border-left-width:2px;left:0;top:0;`, `border-top-width:2px;border-right-width:2px;right:0;top:0;`, `border-bottom-width:2px;border-left-width:2px;left:0;bottom:0;`, `border-bottom-width:2px;border-right-width:2px;right:0;bottom:0;`][i];
        corners.push(mk(box, cs + b));
      }
      met = mk(s.near, `left:0;top:0;width:${W}px;height:${H}px;`);
      cfg.metrics.forEach((m, i) => {
        const x = W / 2 + (i - 1) * 520;
        const col1 = mk(met, `left:${x}px;top:${H / 2}px;transform:translate(-50%,-50%);text-align:center;`);
        const num = mk(col1, `${head(i === 1 ? 140 : 108)}position:relative;font-variant-numeric:tabular-nums;`, "0");
        const lab = mk(col1, `${mono(16, 0.65)}position:relative;margin-top:22px;`, m.label);
        metEls.push({ col1, num, lab, m });
      });
    };

    s.update = (f, ctx) => {
      ctx.hudOp = 1;
      let focal = -1;
      let focalLine = null;
      lines.forEach((ln, li) => {
        const vis = f >= ln.show && f < ln.end;
        const wp = prog(f, ln.end - WHIP, ln.end);
        ln.shots.forEach((x) => {
          const i = shots.indexOf(x);
          const el = words[i];
          const on = vis && f >= x.f - 5;
          el.style.display = on ? "block" : "none";
          tags[i].style.display = on ? "block" : "none";
          if (!on) return;
          const p = prog(f, x.f - 5, x.f);
          const latest = ln.shots.filter((y) => f >= y.f - 5).slice(-1)[0] === x;
          const sc = 1.4 - 0.4 * expoOut(p);
          const dx = -W * expoIn(wp);
          const blur = 24 * wp;
          const st = el.style;
          st.left = "50%";
          st.top = "50%";
          st.transform = `translate(-50%,-50%) translate(${dx}px,${x.row * 105}px) scale(${sc})`;
          st.opacity = (clamp(p * 1.6) * (latest ? 1 : 0.8)).toFixed(2);
          st.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : "none";
          st.textShadow = `var(--sp) 0 0 ${col.splitA}, calc(var(--sp) * -1) 0 0 ${col.splitB}${latest ? "," + glow(1) : ""}`;
          tags[i].style.transform = `translate(-50%,-50%) translate(${dx}px,${x.row * 105 + (x.row > 0 ? 130 : -118)}px)`;
          tags[i].textContent = latest ? decode(x.tag, Math.max(0, f - x.f), 8, i + 11) : x.tag;
          tags[i].style.opacity = latest ? 0.7 : 0.3;
          if (latest && wp === 0) {
            focal = i;
            focalLine = x;
          }
        });
      });
      // lock-on box around the newest word
      if (focal >= 0) {
        const el = words[focal];
        const w = el.offsetWidth * 1.0;
        const h = 176;
        const k = 1 - expoOut(prog(f, focalLine.f - 5, focalLine.f + 3));
        const pad = 36 + 70 * k;
        const cx = W / 2;
        const cy = H / 2 + focalLine.row * 105;
        box.style.display = "block";
        Object.assign(box.style, { left: `${cx - w / 2 - pad}px`, top: `${cy - h / 2 - pad}px`, width: `${w + pad * 2}px`, height: `${h + pad * 2}px`, opacity: 0.9 - 0.4 * k });
        ctx.ringDY = focalLine.row * 40;
      } else {
        box.style.display = "none";
      }
      // metrics shot
      const metOn = f >= mf - 6;
      met.style.display = metOn ? "block" : "none";
      if (metOn) {
        const enter = expoOut(prog(f, mf - 6, mf));
        const wx = W * (1 - enter);
        const blur = 24 * (1 - enter);
        const count = expoOut(prog(f, mf, beatF(cfg.metricsBeat + 2)));
        const lockD = f - beatF(cfg.metricsBeat + 2);
        met.style.transform = `translateX(${wx}px)`;
        met.style.filter = blur > 0.5 ? `blur(${blur.toFixed(1)}px)` : "none";
        metEls.forEach((e, i) => {
          const v = e.m.value * count;
          const txt = v.toLocaleString("en-US", { minimumFractionDigits: e.m.decimals, maximumFractionDigits: e.m.decimals });
          e.num.textContent = txt;
          const focalNum = i === 1;
          e.num.style.textShadow = focalNum ? glow(lockD >= 0 && lockD < 8 ? 1.6 : 1) : "none";
          e.num.style.opacity = focalNum ? 1 : 0.85;
        });
        ctx.ringDY = 0;
        ctx.ringScale *= 1 + 0.06 * (1 - enter);
      }
    };
    return s;
  })()
);
