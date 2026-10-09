import { FPS, win, motion } from "../scripts/theme.mjs";
import { esc, typed, caretRun, windowHtml, pillHtml, sceneTweens, codeLine as L, codeCharW } from "../scripts/lib.mjs";

const WIN_LEFT = (1920 - win.w) / 2;
const WIN_TOP = 130;
const CODE_X = win.gutter + 24; // body x of first code column
const CALLOUT_X = 880;

// Local beat sheet, in frames from the start of the editor scene.
const B = {
  groupA: 14, groupB: 50,
  focus1: 140, zoom1: 140, callout1: 158, callout2: 184, unfocus1: 232, zoomOut1: 232,
  groupC: 262, callout3: 290, zoomOut2: 372,
};

export function editorScene({ content, plan, t0, dur, tokenize }) {
  const file = content.file;
  const lines = file.lines;
  const tokens = tokenize(lines.map((l) => l.text).join("\n"), file.lang); // final code, tokenized once
  const at = (fr) => t0 + fr / FPS;
  const twn = (sel, from, to, fr, d, ease = "power2.out", extra = {}) =>
    plan.tweens.push({ sel, from, to, d, at: at(fr), ease, ...extra });

  // --- group timing: lines of a group type one after another at 2 chars/frame
  const tl = lines.map(() => ({}));
  for (const g of ["A", "B", "C"]) {
    let fr = B["group" + g];
    lines.forEach((l, i) => {
      if (l.group !== g) return;
      const n = l.text.length;
      tl[i] = { start: fr, end: fr + n / motion.codeCharsPerFrame };
      fr += Math.max(n / motion.codeCharsPerFrame, 3) + 3;
    });
    tl.groupEnd = { ...(tl.groupEnd || {}), [g]: fr };
  }

  // --- line markup
  let rowsHtml = "";
  lines.forEach((l, i) => {
    const ins = !!l.group;
    const id = `ln${i}`;
    let inner = "";
    if (l.text) {
      const t = typed(tokens[i], ins ? at(tl[i].start + 2) : t0, ins ? motion.codeCharsPerFrame : 1000, id);
      inner = t.html;
      if (ins) caretRun(plan, id, at(tl[i].start + 2), t.t1, lines[i + 1]?.group === l.group ? 0 : 30);
    }
    if (ins) {
      twn(`#${id}`, { height: 0 }, { height: L }, tl[i].start, motion.expandFrames / FPS, "power2.out");
      plan.classes.push({ sel: `#${id}`, cls: "live", t: +at(tl[i].start).toFixed(4) });
      if (l.group === "C") plan.classes.push({ sel: `#${id}`, cls: "diff", t: +at(tl[i].start).toFixed(4) });
    }
    rowsHtml += `<div class="line${ins ? " ins" : ""}${l.group === "C" ? " added" : ""}" id="${id}" style="height:${ins ? 0 : L}px;line-height:${L}px"><span class="gut"></span><span class="code">${inner}</span></div>`;
  });

  // --- bands, callouts
  const idx = (g) => lines.map((l, i) => (l.group === g ? i : -1)).filter((i) => i >= 0);
  const yTop = (i) => win.padTop + i * L;
  const bandB = idx("B");
  const bandC = idx("C");
  const band = (id, a, b, cls = "") => `<div class="band ${cls}" id="${id}" style="top:${yTop(a)}px;height:${(b - a + 1) * L}px;opacity:0"></div>`;
  let overlay = band("band1", bandB[0], bandB[bandB.length - 1]) + band("band2", bandC[0], bandC[0], "add");
  const callouts = [];
  lines.forEach((l, i) => {
    if (!l.callout) return;
    const id = `co${callouts.length}`;
    const endX = CODE_X + l.text.length * codeCharW + 16;
    overlay += `<div class="callout" id="${id}" style="top:${yTop(i)}px;height:${L}px;left:${endX}px;opacity:0">
      <span class="leader" style="width:${CALLOUT_X - endX}px"></span><span class="cpill">${esc(l.callout)}</span></div>`;
    callouts.push({ id, i });
  });

  // --- focus / dim
  const focusSet = (keep, fr, state) => {
    // state: current opacity map; tween every line whose target differs
    lines.forEach((_, i) => {
      const to = keep === null || keep.includes(i) ? 1 : 0.3;
      if (state[i] !== to) {
        twn(`#ln${i}`, { opacity: state[i] }, { opacity: to }, fr, motion.focusFrames / FPS, "power2.inOut");
        state[i] = to;
      }
    });
  };
  const st = Object.fromEntries(lines.map((_, i) => [i, 1]));
  focusSet(bandB, B.focus1, st);
  twn("#band1", { opacity: 0 }, { opacity: 1 }, B.focus1, motion.focusFrames / FPS);
  twn("#co0", { opacity: 0, x: -14 }, { opacity: 1, x: 0 }, B.callout1, 0.35, "power3.out");
  twn("#co1", { opacity: 0, x: -14 }, { opacity: 1, x: 0 }, B.callout2, 0.35, "power3.out");
  twn("#co0 .leader", { scaleX: 0 }, { scaleX: 1 }, B.callout1, 0.3, "power2.out", { origin: "left center" });
  twn("#co1 .leader", { scaleX: 0 }, { scaleX: 1 }, B.callout2, 0.3, "power2.out", { origin: "left center" });
  twn("#co0", { opacity: 1 }, { opacity: 0 }, B.unfocus1, 0.25, "power2.in");
  twn("#co1", { opacity: 1 }, { opacity: 0 }, B.unfocus1, 0.25, "power2.in");
  twn("#band1", { opacity: 1 }, { opacity: 0 }, B.unfocus1, motion.focusFrames / FPS);
  focusSet(null, B.unfocus1, st);
  // step 3: dim everything except the new line
  const addedFocus = [bandC[0]];
  focusSet(addedFocus, B.groupC - 4, st);
  twn("#band2", { opacity: 0 }, { opacity: 1 }, B.groupC, motion.focusFrames / FPS);
  twn("#co2", { opacity: 0, x: -14 }, { opacity: 1, x: 0 }, B.callout3, 0.35, "power3.out");
  twn("#co2 .leader", { scaleX: 0 }, { scaleX: 1 }, B.callout3, 0.3, "power2.out", { origin: "left center" });

  // --- camera zoom (transform-origin follows the focused block)
  const z = motion.zoom, zf = motion.zoomFrames / FPS;
  // zoom about the window's top edge so the step pill never gets covered
  const o1 = `${win.w / 2 + WIN_LEFT}px ${WIN_TOP}px`;
  const o2 = o1;
  twn("#zoom", { scale: 1 }, { scale: z }, B.zoom1, zf, "power2.inOut", { origin: o1 });
  twn("#zoom", { scale: z }, { scale: 1 }, B.zoomOut1, zf, "power2.inOut", { origin: o1 });
  twn("#zoom", { scale: 1 }, { scale: z }, B.groupC - 6, zf, "power2.inOut", { origin: o2 });
  twn("#zoom", { scale: z }, { scale: 1 }, B.zoomOut2, zf, "power2.inOut", { origin: o2 });

  // step pills swap
  twn("#pill2", { opacity: 0, y: -10 }, { opacity: 1, y: 0 }, 6, 0.3, "power2.out");
  twn("#pill2", { opacity: 1 }, { opacity: 0 }, B.zoomOut1, 0.2, "power2.in");
  twn("#pill3", { opacity: 0, y: -10 }, { opacity: 1, y: 0 }, B.zoomOut1 + 6, 0.3, "power2.out");
  sceneTweens(plan, "#editor", t0, dur, { drift: 0 });

  const body = `<div class="lines" style="padding-top:${win.padTop}px">${rowsHtml}</div>${overlay}`;
  return `<section id="editor" class="scene clip" data-start="${t0}" data-duration="${dur}" data-track-index="0">
    <div class="fade">${pillHtml("pill2", content.steps[1])}${pillHtml("pill3", content.steps[2])}
    <div class="cam"><div id="zoom" class="zoomwrap">${windowHtml({ id: "ed", bar: `<span class="tab">${esc(file.name)}</span>`, body })}</div></div></div>
  </section>`;
}
