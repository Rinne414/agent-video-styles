import content from "../content.json";
import timelineJson from "../assets/audio/timeline.json";
import { FPS } from "./theme";

type RawWord = { text: string; start_ms: number; end_ms: number };
type RawSeg = { id: string; file: string; duration_ms: number; words: RawWord[] };

const { gapMs, tailMs, padFrames } = content.timing;
const msToFrames = (ms: number) => Math.round((ms / 1000) * FPS);

export type Seg = {
  id: string;
  file: string;
  start: number; // absolute frame where the mp3 starts
  frames: number; // mp3 length in frames
  end: number;
  words: RawWord[];
};

let cursorMs = 0;
export const SEGS: Seg[] = (timelineJson.segments as RawSeg[]).map((s) => {
  const start = msToFrames(cursorMs);
  const frames = Math.ceil((s.duration_ms / 1000) * FPS);
  cursorMs += s.duration_ms + gapMs;
  return { id: s.id, file: s.file, start, frames, end: start + frames, words: s.words };
});

export const TOTAL_FRAMES = Math.ceil(((cursorMs - gapMs + tailMs) / 1000) * FPS) + padFrames;

export const seg = (id: string): Seg => {
  const s = SEGS.find((x) => x.id === id);
  if (!s) throw new Error(`unknown segment ${id}`);
  return s;
};

/** Absolute start frame of the nth occurrence of `text` in segment `id` (case/punctuation-insensitive). */
export const at = (id: string, text: string, nth = 0): number => {
  const s = seg(id);
  const hits = s.words.filter((w) => w.text.toLowerCase() === text.toLowerCase());
  const w = hits[nth];
  if (!w) throw new Error(`word "${text}" #${nth} not found in ${id}`);
  return s.start + msToFrames(w.start_ms);
};

/** Absolute end frame of the nth occurrence of `text`. */
export const endOf = (id: string, text: string, nth = 0): number => {
  const s = seg(id);
  const w = s.words.filter((x) => x.text.toLowerCase() === text.toLowerCase())[nth];
  if (!w) throw new Error(`word "${text}" #${nth} not found in ${id}`);
  return s.start + msToFrames(w.end_ms);
};
