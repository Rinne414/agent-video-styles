// Drop: full-frame word, hits on every beat, bloom peak, flash + RGB split (from the shared hit list), ring bursts.
SCENES.push(
  (() => {
    const { C, mk, mono, head, glow, prog, clamp, expoOut, col, W, H, beatF, hrand, B } = T;
    const cfg = C.drop;
    const s = { name: "drop", start: beatF(B.drop), end: beatF(B.finale) };
    const ROWS = 5;
    const BEATS = B.finale - B.drop;
    let word;
    let lead;
    let wall = [];
    let burst;
    let alert;
    let stat;

    s.build = (L) => {
      s.near = mk(L.near, `left:0;top:0;width:${W}px;height:${H}px;`);
      const wallText = Array(8).fill(cfg.text).join(" ");
      for (let i = 0; i < ROWS; i++) {
        const row = mk(s.near, `${head(150)}left:0;top:${60 + i * 200}px;color:${col.accent};opacity:0.09;`, wallText);
        row.setAttribute("data-layout-allow-overflow", "");
        wall.push(row);
      }
      burst = mk(s.near, `left:${W / 2}px;top:${H / 2}px;width:10px;height:10px;`);
      burst.innerHTML = `<svg width="2000" height="2000" viewBox="-1000 -1000 2000 2000" style="position:absolute;left:-1000px;top:-1000px"><circle id="burstC" r="100" fill="none" stroke="${col.ice}" stroke-width="2"/></svg>`;
      lead = mk(s.near, `${head(70)}left:50%;top:50%;`, cfg.lead);
      word = mk(s.near, `${head(400)}left:50%;top:50%;`, cfg.text);
      alert = mk(s.near, `${mono(20, 1)}left:50%;top:${180}px;transform:translateX(-50%);color:${col.hit};border:2px solid ${col.hit};padding:8px 20px;`, cfg.alert);
      stat = mk(s.near, `${mono(16, 0.7)}left:${W / 2}px;top:${H - 190}px;transform:translateX(-50%);`);
    };

    s.update = (f, ctx) => {
      ctx.hudOp = 1;
      const t = f - s.start;
      const bi = Math.min(BEATS - 1, Math.floor(((f * C.format.bpm) / (60 * T.fps)) - B.drop));
      const bf = beatF(B.drop + bi);
      const d = f - bf;
      // word slams in on the first beat, then dollies slowly forever
      const p = prog(f, s.start - 5 + 5, s.start + 5);
      const slam = 1.4 - 0.4 * expoOut(prog(f, s.start - 1, s.start + 4));
      const dolly = 1 + 0.07 * (t / (s.end - s.start));
      // bloom peak on the first hit, decaying; smaller pulse every beat after
      const k = 1 + (bi === 0 ? 1.4 : 0.7) * Math.max(0, 1 - d / 10) + 0.1 * (BEATS - bi) / BEATS;
      word.style.transform = `translate(-50%,-50%) translate(0px,40px) scale(${slam * dolly})`;
      word.style.opacity = clamp(t / 2 + 0.3);
      word.style.textShadow = `var(--sp) 0 0 ${col.splitA}, calc(var(--sp) * -1) 0 0 ${col.splitB}, ${glow(k)}`;
      lead.style.transform = `translate(-50%,-50%) translate(0px,-290px) scale(${dolly})`;
      lead.style.textShadow = "none";
      lead.style.opacity = 0.9;
      // wall rows slide, kicked on each beat
      wall.forEach((w, i) => {
        const dir = i % 2 ? 1 : -1;
        w.style.transform = `translateX(${dir * (t * 7 + 90 * expoOut(clamp(d / 8))) - 1200}px)`;
        w.style.opacity = bi >= 1 ? 0.09 : 0.03 + 0.06 * clamp(t / 10);
      });
      // ring burst every beat; the first one is the hit color (moment 1 of 2)
      const c = burst.firstChild.firstChild;
      const bp = expoOut(clamp(d / 10));
      c.setAttribute("r", 120 + 800 * bp);
      c.setAttribute("stroke", bi === 0 ? col.hit : col.ice);
      c.setAttribute("stroke-opacity", (0.7 * (1 - bp)).toFixed(2));
      // alert strip: hit color, moment 2 of 2
      const al = bi === 4 || bi === 5;
      alert.style.display = al ? "block" : "none";
      alert.style.opacity = al ? (Math.floor(f / 3) % 2 ? 1 : 0.55) : 0;
      stat.textContent = `UPTIME 100.00%  //  AGENTS AWAKE ${String(128 - (bi % 2)).padStart(3, "0")}/128  //  HITS ${String(bi + 1).padStart(2, "0")}`;
      ctx.ringScale *= 1 + 0.08 * Math.max(0, 1 - d / 8);
      ctx.ringDY = 40;
      ctx.scanSpeed = 2;
    };
    return s;
  })()
);
