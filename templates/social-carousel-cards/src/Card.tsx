import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C, CARDS, CardData, FONT_SANS, MOTION, T } from "./theme";
import { Visual } from "./visuals";

const SIZE_W = 1080;

export const visualStartFrame = (card: CardData): number =>
  (card.title.length - 1) * MOTION.lineStagger + MOTION.visualDelay;

const useRise = (f: number, delay: number) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: MOTION.titleSpring });
  return { p, y: (1 - p) * MOTION.titleRise, opacity: Math.min(1, p * 1.6) };
};

const TitleLine: React.FC<{ text: string; f: number; delay: number; color: string }> = ({
  text, f, delay, color,
}) => {
  const r = useRise(f, delay);
  return (
    <div
      style={{
        transform: `translateY(${r.y}px)`,
        opacity: r.opacity,
        whiteSpace: "nowrap",
        color,
      }}
    >
      {text}
    </div>
  );
};

type Props = {
  card: CardData;
  /** frames since this card started entering (drives all motion) */
  f: number;
  /** frames the card is held, for the slow scale drift */
  holdFrames: number;
  showHint?: boolean;
};

export const Card: React.FC<Props> = ({ card, f, holdFrames, showHint }) => {
  const fg = card.dark ? C.paper : C.ink;
  const bg = card.dark ? C.ink : C.paper;
  const drift = 1 + MOTION.drift * Math.min(1, Math.max(0, f / holdFrames));
  const bodyDelay = card.title.length * MOTION.lineStagger;
  const body = useRise(f, bodyDelay);
  const kicker = useRise(f, 0);
  const vStart = visualStartFrame(card);
  const bodyTop = T.titleTop + 40 + card.title.length * T.titleSize * T.titleLineHeight + 36;

  return (
    <div style={{ position: "absolute", inset: 0, background: bg, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${drift})`,
          transformOrigin: "50% 50%",
          fontFamily: FONT_SANS,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: T.margin,
            top: T.margin + 8,
            fontSize: 40,
            fontWeight: 700,
            color: C.accent,
            transform: `translateY(${kicker.y}px)`,
            opacity: kicker.opacity,
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: 18,
              height: 18,
              borderRadius: 9,
              background: C.accent,
              marginRight: 16,
            }}
          />
          <span style={{ color: fg }}>{card.kicker}</span>
        </div>
        <div
          style={{
            position: "absolute",
            left: T.margin,
            top: T.titleTop + 40,
            fontSize: T.titleSize,
            lineHeight: T.titleLineHeight,
            fontWeight: T.titleWeight,
            letterSpacing: T.titleTracking,
          }}
        >
          {card.title.map((line, i) => (
            <TitleLine key={i} text={line} f={f} delay={i * MOTION.lineStagger} color={fg} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: T.margin,
            top: bodyTop,
            width: SIZE_W - 2 * T.margin,
            fontSize: T.bodySize,
            fontWeight: T.bodyWeight,
            color: fg,
            transform: `translateY(${body.y}px)`,
            opacity: body.opacity,
          }}
        >
          {card.body}
        </div>
        <Visual card={card} f={f - vStart} />
        {showHint ? <SwipeHint f={f} top={bodyTop + 2} /> : null}
      </div>
    </div>
  );
};

const SwipeHint: React.FC<{ f: number; top: number }> = ({ f, top }) => {
  const start = 40;
  const cycle = MOTION.hintFrames;
  const local = Math.min(Math.max(f - start, 0), cycle * 2);
  const shift = Math.sin(((local % cycle) / cycle) * Math.PI) * MOTION.hintShift;
  const show = interpolate(f, [start - 8, start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <svg
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
      stroke={C.accent}
      strokeWidth={5}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        position: "absolute",
        right: T.margin,
        top,
        opacity: show,
        transform: `translateX(${shift}px)`,
      }}
    >
      <path d="M6 24H40M26 10L40 24L26 38" />
    </svg>
  );
};

export const cardCount = CARDS.length;
