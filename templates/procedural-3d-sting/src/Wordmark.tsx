import React from "react";
import { interpolateColors } from "remotion";
import { loadFont } from "@remotion/fonts";
import interUrl from "@fontsource/inter/files/inter-latin-600-normal.woff2";
import { C, T, ease } from "./theme";

loadFont({ family: "Inter", url: interUrl, weight: "600" });

const { wordmarkLeft: LEFT, wordmarkWidth: WIDTH, wordmarkFontSize: SIZE } = C.layout;
const LETTERS = C.brand.wordmark.split("");
const SPECTRUM = C.colors.spectrum;
const FRONT_PAD = 60;

/** Pixel x of the light front that sweeps across the wordmark (left to right). */
export const frontX = (frame: number) =>
  ease(frame, T.reveal, [LEFT - FRONT_PAD, LEFT + WIDTH + FRONT_PAD]);

const letterCenter = (i: number) => LEFT + ((i + 0.5) / LETTERS.length) * WIDTH;

/** Frame at which the light front reaches a letter's centre. */
const reachFrame = (i: number) => {
  const p = (letterCenter(i) - (LEFT - FRONT_PAD)) / (WIDTH + 2 * FRONT_PAD);
  return T.reveal[0] + p * (T.reveal[1] - T.reveal[0]);
};

/** Letters light up in spectrum colours as the front passes, then cool to white. */
export const Wordmark: React.FC<{ frame: number; centerY: number }> = ({ frame, centerY }) => {
  const front = frontX(frame);
  const barW = ease(frame, T.reveal, [0, WIDTH]);
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: LEFT,
          width: WIDTH,
          top: centerY - SIZE * 0.5,
          height: SIZE,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          fontSize: SIZE,
          lineHeight: 1,
        }}
      >
        {LETTERS.map((ch, i) => {
          const color = SPECTRUM[Math.round(((SPECTRUM.length - 1) * (LETTERS.length - 1 - i)) / (LETTERS.length - 1))];
          const lit = ease(front, [letterCenter(i) - 40, letterCenter(i) + 20]);
          const settle = ease(frame, [reachFrame(i) + 6, reachFrame(i) + 6 + T.colorSettle]);
          const fill = interpolateColors(settle, [0, 1], [color, C.colors.wordmark]);
          const glow = lit * (1 - settle);
          return (
            <span
              key={i}
              style={{
                color: fill,
                opacity: lit,
                textShadow: `0 0 ${24 + 40 * glow}px ${color}${Math.round(255 * (0.25 + 0.75 * glow)).toString(16).padStart(2, "0")}`,
                filter: `brightness(${1 + glow * 0.6})`,
              }}
            >
              {ch}
            </span>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: LEFT,
          top: centerY + SIZE * 0.5 + C.layout.underlineGap,
          width: barW,
          height: C.layout.underlineHeight,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${SPECTRUM.join(",")})`,
          backgroundSize: `${WIDTH}px 100%`,
          opacity: 0.9,
        }}
      />
    </>
  );
};
