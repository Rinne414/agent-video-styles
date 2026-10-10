// Inlined into index.html by build.mjs. Globals injected before this file: S (schedule), K (theme constants), P (post data).
// Every value is a function of the frame number; no clocks, no randomness.
const sec = (f) => f / K.fps;
const $ = (id) => document.getElementById(id);
const tl = gsap.timeline({ paused: true });

// ---- timestamp label
tl.fromTo("#ts", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: sec(8), ease: "power2.out" }, sec(S.ts.at));

// ---- thread push (bottom anchored container)
S.pushes.forEach((p, i) => {
  const from = i === 0 ? S.y0 : S.pushes[i - 1].y;
  tl.fromTo("#thread", { y: from }, { y: p.y, duration: sec(K.pushFrames), ease: "power3.out", immediateRender: i === 0 }, sec(p.at));
});

// ---- messages
S.msgs.forEach((m) => {
  const origin = m.from === "me" ? "100% 100%" : "0% 100%";
  tl.fromTo(
    "#b" + m.id,
    { opacity: 0, y: 60, scale: 0.9, transformOrigin: origin },
    { opacity: 1, y: 0, scale: 1, duration: sec(K.enter), ease: "back.out(1.2)" },
    sec(m.land)
  );
  if (m.from === "them") {
    tl.fromTo("#typ" + m.id, { opacity: 0, y: 24, scale: 0.9, transformOrigin: "0% 100%" }, { opacity: 1, y: 0, scale: 1, duration: sec(8), ease: "back.out(1.2)" }, sec(m.indStart));
    tl.to("#typ" + m.id, { opacity: 0, duration: sec(4), ease: "power1.in" }, sec(m.land));
  }
  if (m.hasReceipt) {
    const rc = "#rc" + m.id;
    tl.fromTo(rc, { opacity: 0 }, { opacity: 1, duration: sec(6) }, sec(m.land + 8));
    tl.set(rc + " .d", { opacity: 1 }, sec(m.land + 8));
    tl.set(rc + " .d", { opacity: 0 }, sec(m.readAt));
    tl.set(rc + " .r", { opacity: 1 }, sec(m.readAt));
  }
  if (m.reaction) {
    const chip = "#chip" + m.id;
    tl.fromTo(chip, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1.15, duration: sec(6), ease: "power2.out" }, sec(m.reactAt));
    tl.to(chip, { scale: 1, duration: sec(4), ease: "power2.inOut" }, sec(m.reactAt + 6));
  }
});

// ---- per-frame imperatives: input bar typing, caret, typing dots
const typed = $("typed"), caret = $("caret"), ph = $("ph"), disc = $("disc");
const me = S.msgs.filter((m) => m.from === "me");
const them = S.msgs.filter((m) => m.from === "them");
const dots = them.map((m) => [...$("typ" + m.id).querySelectorAll("i")]);
// caret x positions: measured once at load, before the timeline is registered
const prefixW = new Map();
me.forEach((m) => {
  const ws = [0];
  for (let n = 1; n <= m.chars; n++) {
    typed.textContent = m.text.slice(0, n);
    ws.push(typed.getBoundingClientRect().width);
  }
  prefixW.set(m.id, ws);
});
typed.textContent = "";

function applyFrame(f) {
  // input bar
  let text = "";
  let w = 0;
  for (const m of me) {
    if (f >= m.typeStart && f < m.pushAt) {
      const n = Math.min(m.chars, Math.floor((f - m.typeStart) / K.typeFramesPerChar) + 1);
      text = m.text.slice(0, n);
      w = prefixW.get(m.id)[n];
    }
  }
  typed.textContent = text;
  ph.style.opacity = text ? 0 : 1;
  disc.style.background = text ? K.sentFill : K.recvFill;
  caret.style.left = 36 + w + (text ? 3 : 0) + "px";
  caret.style.opacity = Math.floor(f / 15) % 2 === 0 || text ? 1 : 0;
  // typing dots: opacity 1 -> 0.5 over 15 frames, 10-frame stagger per dot
  them.forEach((m, mi) => {
    if (f < m.indStart || f > m.land) return;
    dots[mi].forEach((d, di) => {
      const ph30 = (((f - m.indStart - 10 * di) % 30) + 30) % 30;
      d.style.opacity = ph30 < 15 ? 1 - (0.5 * ph30) / 15 : 0.5 + (0.5 * (ph30 - 15)) / 15;
    });
  });
  // like counters
  const p0 = (f - S.likesAt) / K.likesCount;
  const q = Math.min(1, Math.max(0, p0));
  const e = 1 - Math.pow(1 - q, 2);
  $("nLikes").textContent = Math.round(P.likes * e).toLocaleString("en-US");
  $("nReplies").textContent = Math.round(P.replies * e).toLocaleString("en-US");
  $("nReposts").textContent = Math.round(P.reposts * e).toLocaleString("en-US");
}
const proxy = { f: 0 };
tl.to(proxy, { f: K.totalFrames, duration: sec(K.totalFrames), ease: "none", onUpdate: () => applyFrame(Math.round(proxy.f)) }, 0);
applyFrame(0);

// ---- cutaway: chat out, post card in
tl.to("#chat", { opacity: 0, duration: sec(K.fadeOut), ease: "power2.in" }, sec(S.fadeOutAt));
tl.set("#cardscene", { opacity: 1 }, sec(S.cardAt));
tl.fromTo("#post", { opacity: 0, scale: 0.94, y: 40, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, y: 0, duration: sec(K.cardIn), ease: "back.out(1.2)" }, sec(S.cardAt));
tl.fromTo("#nLikes", { scale: 1, transformOrigin: "0% 50%" }, { scale: 1.12, duration: sec(6), ease: "power2.out" }, sec(S.likesAt));
tl.to("#nLikes", { scale: 1, duration: sec(8), ease: "power2.inOut" }, sec(S.likesAt + 6));
tl.fromTo("#comment", { opacity: 0, scale: 0.94, y: 40, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, y: 0, duration: sec(K.cardIn), ease: "back.out(1.2)" }, sec(S.commentAt));

// ---- camera drift (screens never frozen)
tl.fromTo("#chat", { scale: 1, transformOrigin: "540px 960px" }, { scale: K.driftScale, duration: sec(S.fadeOutAt + K.fadeOut), ease: "sine.inOut" }, 0);
tl.fromTo("#cardscene", { scale: 1, transformOrigin: "540px 960px" }, { scale: K.driftScale, duration: sec(K.totalFrames - S.cardAt), ease: "sine.inOut" }, sec(S.cardAt));

window.__timelines = window.__timelines || {};
window.__timelines["main"] = tl;
