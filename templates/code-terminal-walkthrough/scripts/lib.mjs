import { createHighlighter } from "shiki";
import { FPS, color, font, win, motion } from "./theme.mjs";

export const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const r4 = (n) => Math.round(n * 10000) / 10000;

export const codeLine = Math.round(font.codeSize * font.lineHeight);
export const termLine = Math.round(font.termSize * font.lineHeight);
export const codeCharW = font.codeSize * font.charWidth;

export async function makeHighlighter(theme, langs) {
  const hl = await createHighlighter({ themes: [theme], langs });
  // Tokenize a whole text ONCE; returns tokens[line][token].
  return (code, lang) => hl.codeToTokensBase(code, { lang, theme }).map((l) => l);
}

// Per-character reveal markup for pre-tokenized text. Each character gets its own absolute
// reveal time, so highlighting never changes while typing (no flicker).
export function typed(tokens, t0, charsPerFrame, runId) {
  const cps = charsPerFrame * FPS;
  let k = 0;
  let html = "";
  for (const tok of tokens) {
    const style = [`color:${tok.color || color.text}`];
    if (tok.fontStyle & 1) style.push("font-style:italic");
    if (tok.fontStyle & 2) style.push("font-weight:700");
    let inner = "";
    for (const ch of tok.content) {
      inner += `<i data-t="${r4(t0 + k / cps)}" data-r="${runId}">${esc(ch)}</i>`;
      k++;
    }
    html += `<span style="${style.join(";")}">${inner}</span>`;
  }
  return { html, count: k, t1: t0 + k / cps };
}

export function caretRun(plan, id, t0, t1, holdFrames = motion.caretCycle * 2) {
  plan.runs.push({ id, t0: r4(t0), t1: r4(t1), until: r4(t1 + holdFrames / FPS) });
}

// Window chrome shared by editor and terminal scenes.
export function windowHtml({ id, bar, body, bg = color.canvas }) {
  const dots = color.dots.map((c) => `<i class="dot" style="background:${c}"></i>`).join("");
  return `<div class="window" id="${id}" style="width:${win.w}px;height:${win.h}px;border-radius:${win.radius}px;background:${bg}">
    <div class="bar" style="height:${win.bar}px">${dots}${bar}</div>
    <div class="body" style="height:${win.h - win.bar}px">${body}</div>
  </div>`;
}

export function pillHtml(id, text) {
  return `<div class="steppill" id="${id}">${esc(text)}</div>`;
}

// Standard scene fade-in/out and slow camera drift, as generic tweens.
export function sceneTweens(plan, sel, t0, dur, { fadeOut = true, drift = 0.03 } = {}) {
  const fade = motion.fadeFrames / FPS;
  plan.tweens.push({ sel: `${sel} .fade`, from: { opacity: 0 }, to: { opacity: 1 }, d: fade, at: t0, ease: "power2.out" });
  if (fadeOut) plan.tweens.push({ sel: `${sel} .fade`, from: { opacity: 1 }, to: { opacity: 0 }, d: 5 / FPS, at: t0 + dur - 5 / FPS, ease: "power2.in" });
  if (drift) plan.tweens.push({ sel: `${sel} .cam`, from: { scale: 1 }, to: { scale: 1 + drift }, d: dur, at: t0, ease: "sine.inOut" });
}
