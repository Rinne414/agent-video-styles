import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import type { Chunk, ChunkWord } from "./chunks";
import { CHUNK_SPRING, COLORS, FONT_FAMILY, LAYOUT } from "./theme";

const msToFrame = (ms: number, fps: number) => Math.floor((ms * fps) / 1000);

const wordScale = (frame: number, startF: number, endF: number, pop: boolean) => {
  if (frame < startF) return 1;
  if (frame >= endF) return interpolate(frame, [endF, endF + 2], [pop ? 1.08 : 1.12, 1], { extrapolateRight: "clamp" });
  const t = frame - startF;
  if (pop) return interpolate(t, [0, 4, 8], [1, 1.18, 1.08], { extrapolateRight: "clamp" });
  return interpolate(t, [0, 3], [1, 1.12], { extrapolateRight: "clamp" });
};

const Word: React.FC<{ word: ChunkWord; frame: number; fps: number }> = ({ word, frame, fps }) => {
  const startF = msToFrame(word.startMs, fps);
  const endF = msToFrame(word.endMs, fps);
  const active = frame >= startF && frame < endF;
  const color = active || word.isKey ? COLORS.highlight : COLORS.text;
  return (
    <span
      style={{
        display: "inline-block",
        color,
        marginLeft: word.gapBefore ? 28 : 0,
        scale: String(wordScale(frame, startF, endF, word.isEmphasis)),
        WebkitTextStroke: "8px #000",
        paintOrder: "stroke fill",
        textShadow: "0 6px 0 rgba(0,0,0,0.6)",
      }}
    >
      {word.text}
    </span>
  );
};

// One caption chunk; `frame` is local to the segment Sequence.
export const CaptionChunk: React.FC<{ chunk: Chunk; frame: number }> = ({ chunk, frame }) => {
  const { fps } = useVideoConfig();
  const startF = msToFrame(chunk.startMs, fps);
  const enter = spring({ frame: frame - startF, fps, config: CHUNK_SPRING, durationInFrames: 12 });
  const opacity = interpolate(frame - startF, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        left: LAYOUT.safeLeft,
        width: LAYOUT.captionWidth,
        top: LAYOUT.captionCenterY,
        transform: "translateY(-50%)",
        textAlign: "center",
        fontFamily: FONT_FAMILY,
        fontWeight: 900,
        fontSize: LAYOUT.captionFont,
        lineHeight: 1.28,
        letterSpacing: 2,
        textWrap: "balance",
        opacity,
        scale: String(interpolate(enter, [0, 1], [0.8, 1])),
      }}
    >
      {chunk.words.map((w, i) => (
        <Word key={i} word={w} frame={frame} fps={fps} />
      ))}
    </div>
  );
};

export const SegmentCaptions: React.FC<{ chunks: Chunk[] }> = ({ chunks }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const current = [...chunks].reverse().find((c) => frame >= msToFrame(c.startMs, fps)) ?? chunks[0];
  return <CaptionChunk key={current.startMs} chunk={current} frame={frame} />;
};
