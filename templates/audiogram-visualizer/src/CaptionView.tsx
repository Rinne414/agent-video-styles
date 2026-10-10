import { interpolate, useCurrentFrame } from "remotion";
import type { Caption } from "./captions";
import { CAPTION, CAPTION_LEAD_FRAMES, COLOR, WIDTH } from "./theme";

const UPCOMING = "#9AA4B2"; // about 7:1 on the pill
const FADE = 4;
const ACTIVE_TAIL = 2;

const clampOpts = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Word-timed caption pill: the active word turns accent, spoken words stay white. */
export const CaptionView = ({ captions }: { captions: Caption[] }) => {
  const frame = useCurrentFrame();
  const cap = captions.find((c) => frame >= c.startFrame && frame < c.endFrame);
  if (!cap) return null;
  const opacity = interpolate(frame, [cap.startFrame, cap.startFrame + FADE, cap.endFrame - FADE, cap.endFrame], [0, 1, 1, 0], clampOpts);
  const rise = interpolate(frame, [cap.startFrame, cap.startFrame + FADE * 2], [10, 0], clampOpts);
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        width: WIDTH,
        top: CAPTION.centerY,
        display: "flex",
        justifyContent: "center",
        opacity,
        translate: `0 ${rise}px`,
      }}
    >
      <div
        style={{
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.7)",
          borderRadius: CAPTION.radius,
          padding: `${CAPTION.padY}px ${CAPTION.padX}px`,
          fontFamily: "Inter, sans-serif",
          fontWeight: 700,
          fontSize: CAPTION.size,
          lineHeight: 1.12,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        {cap.lines.map((line, li) => (
          <div key={li}>
            {line.map((w, wi) => {
              const active = frame >= w.startFrame - CAPTION_LEAD_FRAMES && frame < w.endFrame + ACTIVE_TAIL;
              const spoken = frame >= w.endFrame + ACTIVE_TAIL;
              const color = active ? COLOR.accent : spoken ? COLOR.text : UPCOMING;
              return (
                <span key={wi} style={{ color }}>
                  {w.text}
                  {wi < line.length - 1 ? " " : ""}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
