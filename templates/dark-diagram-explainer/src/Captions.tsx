import React from "react";
import { useCurrentFrame } from "remotion";
import content from "../content.json";
import { C, FONT, FPS, T } from "./theme";
import { SEGS } from "./timeline";

type CapWord = { text: string; start: number; end: number }; // absolute frames
type Chunk = { words: CapWord[]; start: number; end: number };

const MIN_COMMA_CHARS = 40;
const MAX_CHARS = 76;
const msToFrames = (ms: number) => Math.round((ms / 1000) * FPS);

/** Pair caption tokens with TTS words; `merge` joins spelled-out letters ("C D N") into one token. */
const alignWords = (segId: string): CapWord[] => {
  const cfg = content.segments.find((s) => s.id === segId);
  const seg = SEGS.find((s) => s.id === segId);
  if (!cfg || !seg) throw new Error(`segment ${segId} missing`);
  const merges = (cfg as { merge?: number[][] }).merge ?? [];
  const tts: { start: number; end: number }[] = [];
  for (let i = 0; i < seg.words.length; i++) {
    const m = merges.find(([from]) => from === i);
    const last = m ? m[1] : i;
    tts.push({ start: msToFrames(seg.words[i].start_ms), end: msToFrames(seg.words[last].end_ms) });
    i = last;
  }
  const tokens = cfg.caption.split(/\s+/).filter(Boolean);
  if (tokens.length !== tts.length) {
    throw new Error(`caption/TTS mismatch in ${segId}: ${tokens.length} tokens vs ${tts.length} words`);
  }
  return tokens.map((text, i) => ({ text, start: seg.start + tts[i].start, end: seg.start + tts[i].end }));
};

const chunkWords = (words: CapWord[], segEnd: number): Chunk[] => {
  const chunks: Chunk[] = [];
  let cur: CapWord[] = [];
  const flush = () => {
    if (cur.length) chunks.push({ words: cur, start: cur[0].start, end: 0 });
    cur = [];
  };
  for (const w of words) {
    cur.push(w);
    const chars = cur.map((x) => x.text).join(" ").length;
    const sentenceEnd = /[.?!]$/.test(w.text);
    const comma = /,$/.test(w.text) && chars >= MIN_COMMA_CHARS;
    if (sentenceEnd || comma || chars >= MAX_CHARS) flush();
  }
  flush();
  return chunks.map((c, i) => ({ ...c, end: i + 1 < chunks.length ? chunks[i + 1].start : segEnd }));
};

const CHUNKS: Chunk[] = SEGS.flatMap((s) => chunkWords(alignWords(s.id), s.end + 6));

export const Captions: React.FC = () => {
  const f = useCurrentFrame();
  const chunk = CHUNKS.find((c) => f >= c.start - 3 && f < c.end);
  if (!chunk) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: T.captionBottom,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: T.captionSize,
          lineHeight: 1.25,
          color: C.text,
          padding: "10px 28px",
          borderRadius: 18,
          background: "rgba(10,10,10,0.72)",
        }}
      >
        {chunk.words.map((w, i) => {
          const active = f >= w.start && f < w.end;
          return (
            <span key={i} style={{ color: active ? C.primary : C.text, fontWeight: active ? 700 : 600 }}>
              {w.text}
              {i < chunk.words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </div>
    </div>
  );
};
