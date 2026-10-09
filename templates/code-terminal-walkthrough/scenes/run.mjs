import { FPS, motion } from "../scripts/theme.mjs";
import { esc, windowHtml, pillHtml, sceneTweens } from "../scripts/lib.mjs";
import { terminalBody } from "../scripts/terminal.mjs";

const gapFrames = (s, c) => Math.ceil(s.length / c) + 1;

export function runScene({ content, plan, t0, dur, tokenize }) {
  const r = content.run;
  const fr = (n) => n / FPS;
  const rows = [];
  let t = t0 + fr(10);
  // multi-line command (shell shows "> " continuation prompts)
  const cmdTokens = tokenize(r.commandLines.join("\n"), "bash");
  r.commandLines.forEach((_, i) => {
    rows.push({ prompt: i === 0 ? "$ " : "> ", tokens: cmdTokens[i], t });
    t += fr(gapFrames(r.commandLines[i], motion.cmdCharsPerFrame) + (i < r.commandLines.length - 1 ? 3 : motion.cmdPauseFrames));
  });
  // output flood: one line per frame, slowing down for the last lines so the switch to 429 lands
  let badTime = 0;
  const lastOk = r.limit; // number of 200s
  r.output.forEach((line, i) => {
    const n = i + 1;
    const isBad = line.endsWith("429");
    const slow = n > lastOk - 5 && n <= lastOk;
    if (n === lastOk + 1) { t += fr(25); badTime = t; }
    rows.push({ text: line, t, cls: isBad ? "bad" : "", html: lineHtml(line) });
    t += fr(isBad ? 8 : slow ? 4 : motion.floodLineGap);
  });
  t += fr(24);
  const tFinal = t;
  const finalTokens = tokenize(r.finalCommand, "bash")[0];
  rows.push({ tokens: finalTokens, t });
  t += fr(gapFrames(r.finalCommand, motion.cmdCharsPerFrame) + motion.cmdPauseFrames);
  rows.push({ html: `<span class="bad-text">${esc(r.finalOutput)}</span>`, text: r.finalOutput, t, cls: "bad" });
  const tBadge = t + fr(6);
  plan.tweens.push({ sel: "#badge", from: { scale: 0.6, opacity: 0 }, to: { scale: 1, opacity: 1 }, d: 0.4, at: tBadge, ease: "back.out(2)" });
  sceneTweens(plan, "#run", t0, dur, { fadeOut: false });
  const body = terminalBody(plan, "term2", rows);
  return `<section id="run" class="scene clip" data-start="${t0}" data-duration="${dur}" data-track-index="0">
    <div class="fade">${pillHtml("pill4", content.steps[3])}
    <div class="cam">${windowHtml({ id: "term2", bg: "#010409", bar: `<span class="wtitle">${esc(content.install.cwd)}  -  zsh</span>`, body })}
    <div class="badge" id="badge">${esc(r.badge)}</div></div></div>
  </section>`;
}

function lineHtml(line) {
  const m = line.match(/^(\d+): (\d+)$/);
  if (!m) return esc(line);
  return `<span class="idx">${m[1]}:</span> <span class="${m[2] === "200" ? "ok-text" : "bad-text"}">${m[2]}</span>`;
}
