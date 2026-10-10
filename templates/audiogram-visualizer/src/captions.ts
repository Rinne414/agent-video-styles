import { content, layout, timeline, msToFrame, CAPTION, CAPTION_LEAD_FRAMES } from "./theme";

export type Word = { text: string; startFrame: number; endFrame: number };
export type Caption = { startFrame: number; endFrame: number; lines: Word[][] };

const CLAUSE_END = /[.,;:?!]$/;
const MIN_WORDS = 3;
const HARD_MAX = CAPTION.maxChars * 2;

const len = (ws: { text: string }[]) => ws.map((w) => w.text).join(" ").length;

/** Split a word list into the most balanced halves until each fits `max` characters. */
function splitBalanced(ws: Word[], max: number): Word[][] {
  if (len(ws) <= max || ws.length < 2) return [ws];
  let best = 1;
  let diff = Infinity;
  for (let k = 1; k < ws.length; k++) {
    const d = Math.abs(len(ws.slice(0, k)) - len(ws.slice(k)));
    if (d < diff) {
      diff = d;
      best = k;
    }
  }
  return [...splitBalanced(ws.slice(0, best), max), ...splitBalanced(ws.slice(best), max)];
}

/** Caption tokens from the original text (keeps punctuation) with TTS word timing. */
function tokensOf(segId: string, text: string, offsetFrames: number): Word[] {
  const seg = timeline.segments.find((s) => s.id === segId)!;
  const toks = text.split(/\s+/);
  if (toks.length !== seg.words.length) {
    throw new Error(`caption/speech mismatch in ${segId}: ${toks.length} vs ${seg.words.length}`);
  }
  return toks.map((t, i) => ({
    text: t,
    startFrame: offsetFrames + msToFrame(seg.words[i].start_ms),
    endFrame: offsetFrames + msToFrame(seg.words[i].end_ms),
  }));
}

/** Two display lines of at most CAPTION.maxChars each. */
function toLines(ws: Word[]): Word[][] {
  const parts = splitBalanced(ws, CAPTION.maxChars);
  if (parts.length > 2) throw new Error(`caption needs ${parts.length} lines: ${ws.map((w) => w.text).join(" ")}`);
  return parts;
}

function chunkSegment(ws: Word[]): Word[][] {
  const clauses: Word[][] = [];
  let cur: Word[] = [];
  for (const w of ws) {
    cur.push(w);
    if (CLAUSE_END.test(w.text)) {
      clauses.push(cur);
      cur = [];
    }
  }
  if (cur.length) clauses.push(cur);
  const pieces = clauses.flatMap((c) => splitBalanced(c, HARD_MAX));
  const merged: Word[][] = [];
  for (const p of pieces) {
    const prev = merged[merged.length - 1];
    if (prev && (prev.length < MIN_WORDS || p.length < MIN_WORDS) && len([...prev, ...p]) <= HARD_MAX) {
      merged[merged.length - 1] = [...prev, ...p];
    } else merged.push(p);
  }
  return merged;
}

export function buildCaptions(): Caption[] {
  const chunks: Word[][] = [];
  for (const seg of content.segments) {
    const start = layout.segments.find((s) => s.id === seg.id)!.start_ms;
    chunks.push(...chunkSegment(tokensOf(seg.id, seg.text, msToFrame(start))));
  }
  const speechEnd = msToFrame(layout.speech_end_ms);
  return chunks.map((c, i) => {
    const next = chunks[i + 1];
    const startFrame = c[0].startFrame - CAPTION_LEAD_FRAMES;
    // hold until the next chunk starts, but never longer than 0.5 s past the last word
    const holdTo = c[c.length - 1].endFrame + msToFrame(500);
    const endFrame = Math.min(next ? next[0].startFrame - CAPTION_LEAD_FRAMES : speechEnd + 6, holdTo);
    return { startFrame, endFrame, lines: toLines(c) };
  });
}

