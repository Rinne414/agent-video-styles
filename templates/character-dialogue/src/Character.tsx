import React from "react";
import { random, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Juno } from "./Juno";
import { Pip } from "./Pip";
import {
  Expression,
  FPS,
  LAST_AUDIO_END,
  LAYOUT,
  LINES,
  MOTION,
  SpeakerId,
  TOTAL_FRAMES,
  Word,
  lineIndexAt,
} from "./theme";

/** Mouth amount for the speaking character: 0 closed, 0.35..1 open. 4-frame flap while a word is active. */
export const mouthAmount = (words: Word[], relFrame: number): number => {
  const tMs = ((relFrame + 0.5) * 1000) / FPS;
  let idx = words.findIndex((w) => tMs >= w.start_ms && tMs < w.end_ms);
  if (idx < 0) {
    // bridge only short gaps between words; longer gaps keep the mouth closed
    const prev = words.findIndex((w, i) => tMs >= w.end_ms && words[i + 1] && tMs < words[i + 1].start_ms);
    if (prev >= 0 && words[prev + 1].start_ms - words[prev].end_ms <= MOTION.flapGapMs) idx = prev;
  }
  if (idx < 0) return 0;
  const isOpenPhase = Math.floor(relFrame / MOTION.flapFrames) % 2 === 0;
  if (!isOpenPhase) return 0;
  return [1, 0.55, 0.85, 0.4][idx % 4];
};

/** Seeded blink schedule: one blink every 3-5 s, 4 frames long. */
const blinkStarts = (id: SpeakerId): number[] => {
  const starts: number[] = [];
  let t = 0;
  for (let k = 0; t < TOTAL_FRAMES; k++) {
    t += Math.round(FPS * (MOTION.blinkMinS + (MOTION.blinkMaxS - MOTION.blinkMinS) * random(`blink-${id}-${k}`)));
    starts.push(t);
  }
  return starts;
};
const BLINKS: Record<SpeakerId, number[]> = { pip: blinkStarts("pip"), juno: blinkStarts("juno") };

const expressionFor = (lineIdx: number, id: SpeakerId): Expression => {
  const line = LINES[Math.max(0, lineIdx)];
  return line.speaker === id ? line.expression : line.reaction;
};

interface CharacterProps {
  id: SpeakerId;
}

export const Character: React.FC<CharacterProps> = ({ id }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const idx = lineIndexAt(frame);
  const line = LINES[idx];
  const finished = frame >= LAST_AUDIO_END;
  const isSpeaker = line.speaker === id && !finished;
  const rel = frame - line.startFrame;

  const expression: Expression = finished ? "happy" : expressionFor(idx, id);
  const changed = finished
    ? expressionFor(LINES.length - 1, id) !== "happy"
    : expression !== expressionFor(idx - 1, id) && idx > 0;
  const changeRel = finished ? frame - LAST_AUDIO_END : rel;
  const pop = changed
    ? 1 + MOTION.popScale * (1 - spring({ frame: changeRel, fps, config: MOTION.popSpring }))
    : 1;

  const hopUp = spring({ frame: rel, fps, config: MOTION.hopSpring });
  const hopDown = spring({ frame: rel - 10, fps, config: MOTION.hopSpring });
  const hop = isSpeaker ? -MOTION.hopPx * (hopUp - hopDown) : 0;

  const phase = id === "pip" ? 0 : Math.PI;
  const breath = 1 + MOTION.breathAmp * (0.5 + 0.5 * Math.sin((2 * Math.PI * frame) / (MOTION.breathPeriodS * fps) + phase));
  const blink = BLINKS[id].some((s) => frame >= s && frame < s + MOTION.blinkFrames);
  const mouth = isSpeaker ? mouthAmount(line.words, rel) : 0;
  const bright = isSpeaker || finished ? 1 : MOTION.listenerDim;
  const left = id === "pip" ? LAYOUT.pipX : LAYOUT.junoX;
  const top = LAYOUT.mascot.feet - LAYOUT.mascot.h + 10;

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: left + 40,
          top: LAYOUT.mascot.feet - 14,
          width: LAYOUT.mascot.w - 80,
          height: 26,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.28)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left,
          top,
          width: LAYOUT.mascot.w,
          height: LAYOUT.mascot.h,
          transformOrigin: "50% 100%",
          transform: `translateY(${hop}px) scale(${pop}) scaleY(${breath})`,
          filter: `brightness(${bright})`,
        }}
      >
        {id === "pip" ? (
          <Pip expression={expression} blink={blink} mouth={mouth} antennaSway={5 * Math.sin(frame / 14)} />
        ) : (
          <Juno expression={expression} blink={blink} mouth={mouth} />
        )}
      </div>
    </>
  );
};
