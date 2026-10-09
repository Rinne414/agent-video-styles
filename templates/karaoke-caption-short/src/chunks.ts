import { CHUNK_MAX_CHARS, type SegmentSpec } from "./theme";

export type TimelineWord = { text: string; start_ms: number; end_ms: number };
export type TimelineSegment = {
  id: string;
  file: string;
  duration_ms: number;
  words: TimelineWord[];
};
export type Timeline = { segments: TimelineSegment[] };

export type ChunkWord = {
  text: string;
  startMs: number;
  endMs: number;
  gapBefore: boolean;
  isKey: boolean;
  isEmphasis: boolean;
};

export type Chunk = { startMs: number; endMs: number; words: ChunkWord[] };

const PUNCT = /[，。？！：；、,.?!:;]/;
const SHORT_CLAUSE_CHARS = 3;

// Clauses of the original script, punctuation removed (TTS drops punctuation).
const splitClauses = (text: string): string[] =>
  text.split(PUNCT).map((c) => c.trim()).filter(Boolean);

// Character ranges of key terms inside the punctuation-free segment text.
const keyMask = (plain: string, terms: string[]): boolean[] => {
  const mask = new Array<boolean>(plain.length).fill(false);
  for (const term of terms) {
    let at = plain.indexOf(term);
    while (at !== -1) {
      for (let i = at; i < at + term.length; i++) mask[i] = true;
      at = plain.indexOf(term, at + term.length);
    }
  }
  return mask;
};

export const buildChunks = (spec: SegmentSpec, seg: TimelineSegment): Chunk[] => {
  const clauses = splitClauses(spec.text);
  const plain = clauses.join("");
  const mask = keyMask(plain, spec.keyTerms);

  // Assign TTS words to clauses by cumulative character count.
  const groups: ChunkWord[][] = [];
  let wi = 0;
  let charPos = 0;
  for (const clause of clauses) {
    const group: ChunkWord[] = [];
    let used = 0;
    while (used < clause.length) {
      const w = seg.words[wi++];
      if (!w) throw new Error(`[${seg.id}] ran out of TTS words in clause "${clause}"`);
      const covered = mask.slice(charPos, charPos + w.text.length);
      group.push({
        text: w.text,
        startMs: w.start_ms,
        endMs: w.end_ms,
        gapBefore: false,
        isKey: covered.length > 0 && covered.every(Boolean),
        isEmphasis: w.text === spec.emphasis,
      });
      used += w.text.length;
      charPos += w.text.length;
    }
    if (used !== clause.length) {
      throw new Error(`[${seg.id}] TTS word straddles clause boundary near "${clause}"`);
    }
    groups.push(group);
  }

  // Merge a very short clause ("第一") with the next one so it never shows alone.
  const merged: ChunkWord[][] = [];
  for (let i = 0; i < groups.length; i++) {
    const len = groups[i].reduce((n, w) => n + w.text.length, 0);
    const next = groups[i + 1];
    if (len <= SHORT_CLAUSE_CHARS && next) {
      next[0] = { ...next[0], gapBefore: true };
      groups[i + 1] = [...groups[i], ...next];
    } else {
      merged.push(groups[i]);
    }
  }

  return merged.map((words, i) => {
    const chars = words.reduce((n, w) => n + w.text.length, 0);
    if (chars > CHUNK_MAX_CHARS) throw new Error(`[${seg.id}] chunk too long (${chars})`);
    return {
      words,
      startMs: i === 0 ? 0 : words[0].startMs,
      endMs: i === merged.length - 1 ? seg.duration_ms : merged[i + 1][0].startMs,
    };
  });
};
