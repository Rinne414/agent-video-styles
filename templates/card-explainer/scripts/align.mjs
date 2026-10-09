// Map TTS word timings (punctuation dropped) back onto the original narration text.
const PUNCT = /[，。？！：；、,.?!:;]/;
const MIN_CAPTION_CHARS = 6;
const MAX_CAPTION_CHARS = 16;

/** Time (seconds, relative to segment audio start) for every character index of `narration`. */
export function charTimes(narration, words) {
  const times = new Array(narration.length).fill(null);
  const starts = new Set();
  let p = 0;
  for (const w of words) {
    const chars = [...w.text];
    let first = true;
    chars.forEach((ch, k) => {
      while (p < narration.length && narration[p] !== ch) p++;
      if (p >= narration.length) return;
      const f = chars.length > 1 ? k / chars.length : 0;
      if (first) starts.add(p);
      first = false;
      times[p] = (w.start_ms + (w.end_ms - w.start_ms) * f) / 1000;
      p++;
    });
  }
  let next = words.at(-1).end_ms / 1000;
  for (let i = narration.length - 1; i >= 0; i--) {
    if (times[i] === null) times[i] = next;
    else next = times[i];
  }
  times.starts = starts;
  return times;
}

/** First time the given phrase is spoken, or null when it is not in the narration. */
export function timeOfPhrase(narration, times, phrase) {
  const i = narration.indexOf(phrase);
  return i < 0 ? null : times[i];
}

/** Caption chunks [{text, t0, t1}] (relative seconds), each 6-16 characters, cut at TTS word boundaries. */
export function captionChunks(narration, times, endSec) {
  const starts = times.starts;
  const ranges = [];
  let a = 0;
  for (let i = 0; i <= narration.length; i++) {
    if (i === narration.length || PUNCT.test(narration[i])) {
      if (i > a) ranges.push([a, i]);
      a = i + 1;
    }
  }
  const merged = [];
  for (let k = 0; k < ranges.length; k++) {
    let [x, y] = ranges[k];
    while (y - x < MIN_CAPTION_CHARS && k + 1 < ranges.length) y = ranges[++k][1];
    merged.push([x, y]);
  }
  const chunks = [];
  for (const [x, y] of merged) {
    const n = Math.ceil((y - x) / MAX_CAPTION_CHARS);
    let from = x;
    for (let j = 1; j <= n; j++) {
      let to = j === n ? y : Math.round(x + ((y - x) * j) / n);
      if (j < n) {
        const cands = [...starts].filter((s) => s > from + 3 && s < y - 3);
        if (cands.length) to = cands.reduce((m, c) => (Math.abs(c - to) < Math.abs(m - to) ? c : m));
      }
      const end = narration[to] === "？" ? to + 1 : to;
      chunks.push({ text: narration.slice(from, end).replace(/[。！]/g, " ").trim(), t0: times[from] });
      from = to;
    }
  }
  return chunks.map((c, i) => ({ ...c, t1: i + 1 < chunks.length ? chunks[i + 1].t0 : endSec }));
}

export const splitPhrases = (text) => text.split(/(?<=[，。？！：；])/).filter(Boolean);
export const clauseStarts = (narration, times) => {
  const out = [];
  let start = 0;
  for (let i = 0; i <= narration.length; i++) {
    if (i === narration.length || PUNCT.test(narration[i])) {
      if (i > start) out.push(times[start]);
      start = i + 1;
    }
  }
  return out;
};
