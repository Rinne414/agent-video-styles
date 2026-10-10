import { interpolate } from "remotion";
import type { GeoProjection } from "d3-geo";
import { annotations, places, theme, type } from "./theme";

const FADE = 8;
const RISE = 8;
const PAD_X = 28;
const PAD_Y = 22;
const ACCENT_W = 6;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Annotations = ({ frame, projection }: { frame: number; projection: GeoProjection }) => (
  <g>
    {annotations.map((a) => {
      const t = Math.min(
        interpolate(frame, [a.from, a.from + FADE], [0, 1], clamp),
        interpolate(frame, [a.to - FADE, a.to], [1, 0], clamp),
      );
      if (t <= 0) return null;
      const anchor = projection(places[a.place].lonlat);
      if (!anchor) return null;
      const x = anchor[0] + a.dx;
      const y = anchor[1] + a.dy + (1 - t) * RISE;
      const height = PAD_Y * 2 + type.annotationLine * (a.lines.length + 1) - 4;
      // leader line: from the dot to the nearest vertical edge of the box
      const edgeX = a.dx >= 0 ? x : x + a.width;
      const edgeY = y + height / 2;
      const headY = y + PAD_Y + type.annotationHead.size * 0.8;
      return (
        <g key={a.place} opacity={t}>
          <line x1={anchor[0]} y1={anchor[1]} x2={edgeX} y2={edgeY} stroke={theme.text} strokeOpacity={0.7} strokeWidth={2} />
          <rect x={x} y={y} width={a.width} height={height} rx={6} fill={theme.panel} stroke={theme.text} strokeOpacity={0.25} />
          <rect x={x} y={y} width={ACCENT_W} height={height} rx={3} fill={theme.highlight} />
          <text
            x={x + PAD_X}
            y={headY}
            fontFamily={theme.fontFamily}
            fontSize={type.annotationHead.size}
            fontWeight={type.annotationHead.weight}
            fill={theme.highlight}
          >
            {a.head}
          </text>
          {a.lines.map((line, i) => (
            <text
              key={line}
              x={x + PAD_X}
              y={headY + type.annotationLine * (i + 1)}
              fontFamily={theme.fontFamily}
              fontSize={type.annotationBody.size}
              fontWeight={type.annotationBody.weight}
              fill={theme.text}
            >
              {line}
            </text>
          ))}
        </g>
      );
    })}
  </g>
);
