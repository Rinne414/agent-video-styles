import { esc, sceneTweens } from "../scripts/lib.mjs";

export function outroScene({ content, plan, t0, dur }) {
  const o = content.outro;
  sceneTweens(plan, "#outro", t0, dur, { fadeOut: false, drift: 0 });
  plan.tweens.push({ sel: "#outro .ohead", from: { y: 30, opacity: 0 }, to: { y: 0, opacity: 1 }, d: 0.4, at: t0 + 0.1, ease: "power3.out" });
  plan.tweens.push({ sel: "#outro .ocmd", from: { y: 30, opacity: 0 }, to: { y: 0, opacity: 1 }, d: 0.4, at: t0 + 0.25, ease: "power3.out" });
  plan.tweens.push({ sel: "#outro .orecap", from: { opacity: 0 }, to: { opacity: 1 }, d: 0.4, at: t0 + 0.45, ease: "power2.out" });
  return `<section id="outro" class="scene clip" data-start="${t0}" data-duration="${dur}" data-track-index="0">
    <div class="fade"><div class="cam outrocam">
      <div class="ohead">${esc(o.headline)}</div>
      <div class="ocmd"><span class="ps">$ </span>${esc(o.command)}</div>
      <div class="orecap">${esc(o.recap)}</div>
    </div></div>
  </section>`;
}
