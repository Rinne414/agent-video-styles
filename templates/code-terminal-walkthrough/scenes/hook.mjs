import { FPS, color, font } from "../scripts/theme.mjs";
import { esc, sceneTweens } from "../scripts/lib.mjs";

export function hookScene({ content, plan, t0, dur }) {
  const { title, subtitle, peek, tags } = content.hook;
  const words = title.split(" ");
  const half = Math.ceil(words.length / 2) + 1;
  const l1 = words.slice(0, half).join(" ");
  const l2 = words.slice(half).join(" ");
  const w = (s, k) => s.split(" ").map((x) => `<span class="hw" data-k="${k}">${esc(x)}</span>`).join(" ");
  const rows = peek
    .map((p, i) => `<div class="hrow ${p.endsWith("429") ? "bad" : ""}" id="hook-p${i}">${esc(p)}</div>`)
    .join("");
  sceneTweens(plan, "#hook", t0, dur, { drift: 0.02 });
  plan.tweens.push({ sel: "#hook .hw", from: { y: 40, opacity: 0 }, to: { y: 0, opacity: 1 }, d: 0.4, at: t0 + 0.1, ease: "power3.out", stagger: 5 / FPS });
  plan.tweens.push({ sel: "#hook .sub", from: { y: 30, opacity: 0 }, to: { y: 0, opacity: 1 }, d: 0.4, at: t0 + 0.55, ease: "power3.out" });
  plan.tweens.push({ sel: "#hook .tags", from: { y: 30, opacity: 0 }, to: { y: 0, opacity: 1 }, d: 0.4, at: t0 + 0.7, ease: "power3.out" });
  plan.tweens.push({ sel: "#hook .peek", from: { y: 40, opacity: 0 }, to: { y: 0, opacity: 1 }, d: 0.45, at: t0 + 0.8, ease: "power3.out" });
  peek.forEach((_, i) => plan.tweens.push({ sel: `#hook-p${i}`, from: { opacity: 0 }, to: { opacity: 1 }, d: 0.1, at: t0 + 1.1 + i * 0.25, ease: "power2.out" }));
  plan.tweens.push({ sel: "#hook-p2", from: { scale: 1 }, to: { scale: 1.08 }, d: 0.35, at: t0 + 1.9, ease: "back.out(2)", origin: "left center" });
  return `<section id="hook" class="scene clip" data-start="${t0}" data-duration="${dur}" data-track-index="0">
    <div class="fade"><div class="cam hookcam">
      <h1 class="htitle">${w(l1, 1)}<br>${w(l2, 2)}</h1>
      <div class="sub" style="color:${content.colors.accent}">${esc(subtitle)}</div>
      <div class="tags">${tags.map((x) => `<span class="tag">${esc(x)}</span>`).join("")}</div>
      <div class="peek">${rows}</div>
    </div></div>
  </section>`;
}
