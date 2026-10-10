import { interpolate } from "remotion";
import type { GeoPath, GeoPermissibleObjects } from "d3-geo";
import { borders, countryByName, graticule, land } from "./geo";
import { outro, regions, stroke, theme } from "./theme";

const FILL_FRAMES = 15;
const DIM_FRAMES = 15;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const regionOpacity = (frame: number, from: number, dimAt: number) => {
  if (frame < from) return 0;
  const rise = interpolate(frame, [from, from + FILL_FRAMES], [0, theme.regionActiveOpacity], clamp);
  const dimmed = interpolate(frame, [dimAt, dimAt + DIM_FRAMES], [theme.regionActiveOpacity, theme.regionDimOpacity], clamp);
  const base = Math.min(rise, dimmed);
  return interpolate(
    frame,
    [outro.from, outro.from + DIM_FRAMES * 2],
    [base, Math.max(base, theme.regionOutroOpacity)],
    clamp,
  );
};

export const BaseMap = ({ frame, path }: { frame: number; path: GeoPath }) => (
  <g>
    <path d={path(graticule) ?? ""} fill="none" stroke={theme.text} strokeOpacity={0.06} strokeWidth={1} />
    <path d={path(land as GeoPermissibleObjects) ?? ""} fill={theme.land} />
    {regions.map((region) => {
      const opacity = regionOpacity(frame, region.from, region.dimAt);
      if (opacity <= 0) return null;
      return (
        <path
          key={region.name}
          d={path(countryByName(region.name)) ?? ""}
          fill={theme.highlight}
          fillOpacity={opacity}
        />
      );
    })}
    <path d={path(borders) ?? ""} fill="none" stroke={theme.text} strokeOpacity={0.3} strokeWidth={stroke.border} />
  </g>
);
