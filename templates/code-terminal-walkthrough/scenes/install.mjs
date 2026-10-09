import { FPS, motion, win } from "../scripts/theme.mjs";
import { esc, windowHtml, pillHtml, sceneTweens } from "../scripts/lib.mjs";
import { terminalBody } from "../scripts/terminal.mjs";

export function installScene({ content, plan, t0, dur, tokenize }) {
  const ins = content.install;
  const start = t0 + 10 / FPS;
  const cmdFrames = Math.ceil(ins.command.length / motion.cmdCharsPerFrame);
  const rows = [{ tokens: tokenize(ins.command, "bash")[0], t: start }];
  let t = start + (cmdFrames + 1 + motion.cmdPauseFrames) / FPS;
  for (const line of ins.output) {
    rows.push({ text: line, t });
    t += motion.outLineGap / FPS;
  }
  sceneTweens(plan, "#install", t0, dur);
  const body = terminalBody(plan, "term1", rows);
  return `<section id="install" class="scene clip" data-start="${t0}" data-duration="${dur}" data-track-index="0">
    <div class="fade">${pillHtml("pill1", content.steps[0])}
    <div class="cam">${windowHtml({ id: "term1", bg: "#010409", bar: `<span class="wtitle">${esc(ins.cwd)}  -  zsh</span>`, body })}</div></div>
  </section>`;
}
