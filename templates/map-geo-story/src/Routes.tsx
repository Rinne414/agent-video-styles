import { interpolate } from "remotion";
import type { GeoPath, GeoProjection } from "d3-geo";
import { legProgress, partialLine, routeLegs } from "./geo";
import { dash, dot, stroke, theme } from "./theme";

const PLANNED_FADE = [40, 70];
const PLANNED_OPACITY = 0.45;

export const Routes = ({ frame, projection, path }: { frame: number; projection: GeoProjection; path: GeoPath }) => {
  const plannedOpacity = interpolate(frame, PLANNED_FADE, [0, PLANNED_OPACITY], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      {routeLegs.map((leg, i) => (
        <path
          key={`plan-${i}`}
          d={path({ type: "LineString", coordinates: leg.points }) ?? ""}
          stroke={theme.route}
          strokeOpacity={plannedOpacity}
          strokeWidth={stroke.route / 2}
          strokeDasharray={dash}
        />
      ))}
      {routeLegs.map((leg, i) => {
        const progress = legProgress(leg, frame);
        const line = partialLine(leg, progress);
        if (line.length < 2) return null;
        const tip = projection(line[line.length - 1]);
        const moving = progress > 0 && progress < 1;
        return (
          <g key={`leg-${i}`}>
            <path d={path({ type: "LineString", coordinates: line }) ?? ""} stroke={theme.route} strokeWidth={stroke.route} />
            {moving && tip ? (
              <circle cx={tip[0]} cy={tip[1]} r={dot.head / 2 + 2} fill={theme.text} stroke={theme.route} strokeWidth={3} />
            ) : null}
          </g>
        );
      })}
    </g>
  );
};
