import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  colors,
  fontFamily,
  layout,
  progress,
  sizes,
  SPRING_LETTER,
  springAt,
  timing,
  title,
  titleAccentWord,
} from "../theme";

/** Scene 2: the title bounces in letter by letter, then parks small at the top. */
export const Title = () => {
  const frame = useCurrentFrame();
  const move = progress(frame, timing.titleMoveStart, timing.titleMoveFrames);
  const y = interpolate(move, [0, 1], [layout.centerY, layout.titleTopY]);
  const scale = interpolate(move, [0, 1], [1, sizes.titleSmallScale]);

  let letterIndex = 0;
  const words = title.split(" ");

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          top: y,
          display: "flex",
          justifyContent: "center",
          gap: sizes.titlePx * 0.28,
          transform: `translateY(-50%) scale(${scale})`,
          transformOrigin: "50% 50%",
          fontFamily,
          fontWeight: 800,
          fontSize: sizes.titlePx,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {words.map((word, w) => (
          <span key={w} style={{ display: "flex", color: word === titleAccentWord ? colors.accent : colors.text }}>
            {word.split("").map((ch, c) => {
              const enter = springAt(frame, timing.titleStart + letterIndex++ * timing.letterGapFrames, SPRING_LETTER);
              return (
                <span
                  key={c}
                  style={{
                    display: "inline-block",
                    opacity: Math.min(1, enter * 4),
                    transform: `translateY(${interpolate(enter, [0, 1], [40, 0])}px) scale(${interpolate(enter, [0, 1], [0.4, 1])})`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </span>
        ))}
      </div>
    </AbsoluteFill>
  );
};
