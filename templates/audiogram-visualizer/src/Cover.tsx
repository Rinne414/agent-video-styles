import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLOR, COVER, FONT, INTRO_FRAMES, SPRING_COVER, WIDTH, content } from "./theme";

/** Code-drawn cover art: gradient card, concentric rings, a 3x3 "small batch" grid and the show initial. */
export const Cover = ({ pulse }: { pulse: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: SPRING_COVER, durationInFrames: INTRO_FRAMES });
  const scale = (0.86 + 0.14 * enter) * (1 + 0.02 * pulse);
  const s = COVER.size;
  return (
    <div
      style={{
        position: "absolute",
        left: (WIDTH - s) / 2,
        top: COVER.centerY - s / 2,
        width: s,
        height: s,
        opacity: enter,
        scale: String(scale),
        borderRadius: COVER.radius,
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
      }}
    >
      <svg width={s} height={s} viewBox="0 0 360 360">
        <defs>
          <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={COLOR.cardA} />
            <stop offset="1" stopColor={COLOR.cardB} />
          </linearGradient>
        </defs>
        <rect width={s} height={s} fill="url(#cardGrad)" />
        {[70, 120, 170, 220, 270].map((r, i) => (
          <circle key={r} cx={300} cy={320} r={r} fill="none" stroke={COLOR.accent} strokeWidth={2} opacity={0.5 - i * 0.08} />
        ))}
        {Array.from({ length: 9 }, (_, k) => {
          const hot = k === 4;
          return (
            <rect
              key={k}
              x={30 + (k % 3) * 34}
              y={30 + Math.floor(k / 3) * 34}
              width={24}
              height={24}
              rx={6}
              fill={hot ? COLOR.accent : "none"}
              stroke={COLOR.accent}
              strokeWidth={hot ? 0 : 2}
              opacity={hot ? 1 : 0.6}
            />
          );
        })}
        <text x={36} y={300} fontFamily={FONT} fontWeight={700} fontSize={160} fill={COLOR.text}>
          {content.show.initial}
        </text>
        <text x={330} y={44} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={24} letterSpacing={2} fill={COLOR.text}>
          {content.show.episode.toUpperCase()}
        </text>
      </svg>
    </div>
  );
};
