import { FPS, color, font, win, motion } from "./theme.mjs";
import { esc, typed, caretRun, termLine } from "./lib.mjs";

export const termCap = 17;

// rows: { prompt?, tokens? (typed command), text? (instant output), cls?, t }
// Returns window body html and registers scroll + caret data in the plan.
export function terminalBody(plan, id, rows) {
  let html = "";
  const rowTimes = [];
  rows.forEach((row, i) => {
    const rid = `${id}-r${i}`;
    rowTimes.push(row.t);
    if (row.tokens) {
      const ps = row.prompt ?? "$ ";
      const t = typed(row.tokens, row.t + 1 / FPS, motion.cmdCharsPerFrame, rid);
      caretRun(plan, rid, row.t, t.t1, motion.caretCycle * 2);
      html += `<div class="row" data-t="${row.t}"><span class="ps">${esc(ps)}</span>${t.html}</div>`;
      row.tEnd = t.t1;
    } else {
      html += `<div class="row out ${row.cls ?? ""}" data-t="${row.t}">${row.html ?? esc(row.text)}</div>`;
    }
  });
  plan.scrolls.push({ sel: `#${id} .rows`, times: rowTimes, cap: termCap, line: termLine, frames: motion.scrollFrames });
  return `<div class="rowsclip"><div class="rows">${html}</div></div>`;
}
