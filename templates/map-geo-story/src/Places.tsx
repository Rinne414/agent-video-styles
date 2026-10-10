import { interpolate, spring, useVideoConfig } from "remotion";
import type { GeoProjection } from "d3-geo";
import { appearFrame } from "./geo";
import { dot, places, stroke, theme, type } from "./theme";

const LABEL_DELAY = 6;
const LABEL_FADE = 6;
const LABEL_RISE = 8;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Places = ({ frame, projection }: { frame: number; projection: GeoProjection }) => {
  const { fps } = useVideoConfig();
  return (
    <g>
      {Object.entries(places).map(([id, place]) => {
        const start = appearFrame[id];
        if (start === undefined || frame < start) return null;
        const xy = projection(place.lonlat);
        if (!xy) return null;
        const age = frame - start;
        const isMajor = Boolean(place.label);
        const radius = (isMajor ? dot.place : dot.waypoint) / 2;
        const pop = spring({ frame: age, fps, config: { damping: 12, stiffness: 200 } });
        const pulse = interpolate(age, [0, dot.pulseFrames], [0, 1], clamp);
        const labelT = interpolate(age, [LABEL_DELAY, LABEL_DELAY + LABEL_FADE], [0, 1], clamp);
        return (
          <g key={id}>
            {isMajor && pulse < 1 ? (
              <circle
                cx={xy[0]}
                cy={xy[1]}
                r={radius + pulse * (dot.pulseMax - radius)}
                fill="none"
                stroke={theme.text}
                strokeWidth={3}
                strokeOpacity={1 - pulse}
              />
            ) : null}
            <circle
              cx={xy[0]}
              cy={xy[1]}
              r={radius * pop}
              fill={isMajor ? theme.text : theme.route}
              stroke={theme.ocean}
              strokeWidth={3}
            />
            {place.label ? (
              <text
                x={xy[0] + place.label.dx}
                y={xy[1] + place.label.dy + (1 - labelT) * LABEL_RISE}
                textAnchor={place.label.anchor}
                fontFamily={theme.fontFamily}
                fontSize={type.label.size}
                fontWeight={type.label.weight}
                fill={theme.text}
                fillOpacity={labelT}
                stroke={theme.ocean}
                strokeOpacity={labelT}
                strokeWidth={stroke.halo}
                strokeLinejoin="round"
                style={{ paintOrder: "stroke" }}
              >
                {place.name}
              </text>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};
