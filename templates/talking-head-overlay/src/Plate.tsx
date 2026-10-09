import { AbsoluteFill, useCurrentFrame } from "remotion";
import { content, FONT } from "./theme";

const { plate, faceBox } = content;

// Neutral stand-in for footage: gradient room, a speaker silhouette in the left third, a label.
export const Plate = () => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 38) * 4;
  const glow = 0.5 + 0.5 * Math.sin(frame / 90);
  const cx = plate.speakerCenterX;

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: `radial-gradient(ellipse at ${60 + glow * 6}% 40%, #2c313d 0%, #1b1e26 55%, #121419 100%)`,
      }}
    >
      <svg width={content.width} height={content.height} style={{ position: "absolute", inset: 0 }}>
        <g transform={`translate(0 ${sway})`} fill="#3b404d">
          <circle cx={cx} cy={330} r={118} />
          <rect x={cx - 52} y={430} width={104} height={70} />
          <path
            d={`M ${cx - 300} 1080 C ${cx - 300} 640 ${cx - 150} 500 ${cx} 500 C ${cx + 150} 500 ${cx + 300} 640 ${cx + 300} 1080 Z`}
          />
        </g>
        <rect
          x={faceBox.x}
          y={faceBox.y}
          width={faceBox.w}
          height={faceBox.h}
          rx={16}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={2}
          strokeDasharray="14 12"
        />
        <text
          x={faceBox.x + 16}
          y={faceBox.y - 14}
          fill="rgba(255,255,255,0.45)"
          fontSize={22}
          fontWeight={500}
          fontFamily={FONT}
          letterSpacing={2}
        >
          FACE-SAFE ZONE
        </text>
      </svg>
      <div style={{ position: "absolute", left: 700, right: 64, top: 96, textAlign: "right" }}>
        <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: 8, color: "rgba(255,255,255,0.55)" }}>
          {plate.label}
        </div>
        <div style={{ marginTop: 10, fontSize: 24, fontWeight: 500, color: "rgba(255,255,255,0.35)" }}>
          {plate.hint}
        </div>
      </div>
    </AbsoluteFill>
  );
};
