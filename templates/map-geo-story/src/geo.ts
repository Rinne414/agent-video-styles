// Geometry, camera and route math. Everything is a pure function of the frame.
import { Easing, interpolate } from "remotion";
import { geoDistance, geoGraticule10, geoInterpolate, geoMercator, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import world50 from "world-atlas/countries-50m.json";
import { cameraKeys, driftPercent, legs, meta, places } from "./theme";

type LonLat = [number, number];
type CountryProps = { name: string };

// Parsed once at module load, never per frame.
const topo = world50 as unknown as Topology<{
  countries: GeometryCollection<CountryProps>;
  land: GeometryCollection;
}>;
export const land = feature(topo, topo.objects.land) as unknown as FeatureCollection;
export const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b);
const countries = (feature(topo, topo.objects.countries) as unknown as FeatureCollection<Geometry, CountryProps>).features;
export const countryByName = (name: string): Feature<Geometry, CountryProps> => {
  const found = countries.find((c) => c.properties.name === name);
  if (!found) throw new Error(`Country not in world-atlas: ${name}`);
  return found;
};
export const graticule = geoGraticule10();

// ---- camera: one easing for scale and centre -------------------------------
const cameraEase = Easing.inOut(Easing.cubic);

export const cameraAt = (frame: number) => {
  let from = cameraKeys[0];
  let to = cameraKeys[cameraKeys.length - 1];
  for (let i = 0; i < cameraKeys.length - 1; i++) {
    if (frame >= cameraKeys[i].frame && frame <= cameraKeys[i + 1].frame) {
      from = cameraKeys[i];
      to = cameraKeys[i + 1];
      break;
    }
  }
  const t = from.frame === to.frame ? 1 : cameraEase(
    interpolate(frame, [from.frame, to.frame], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const mix = (a: number, b: number) => a + (b - a) * t;
  const drift = 1 + (driftPercent / 100) * (frame / meta.durationInFrames);
  return {
    center: [mix(from.center[0], to.center[0]), mix(from.center[1], to.center[1])] as LonLat,
    scale: mix(from.scale, to.scale) * drift,
  };
};

export const projectionAt = (frame: number) => {
  const cam = cameraAt(frame);
  return geoMercator()
    .scale(cam.scale)
    .center(cam.center)
    .translate([meta.width / 2, meta.height / 2])
    .clipExtent([[-60, -60], [meta.width + 60, meta.height + 60]]);
};

export const pathFor = (frame: number) => {
  const projection = projectionAt(frame);
  return { projection, path: geoPath(projection) };
};

// ---- routes: great-circle polylines drawn by distance -----------------------
const SAMPLES_PER_SEGMENT = 32;
const routeEase = Easing.inOut(Easing.quad);

type Leg = {
  points: LonLat[];
  cum: number[]; // normalised cumulative distance 0..1 per point
  waypointFractions: number[]; // fraction at each listed place
  placeIds: string[];
  from: number;
  to: number;
};

const buildLeg = (def: (typeof legs)[number]): Leg => {
  const points: LonLat[] = [];
  const waypointIndex: number[] = [0];
  for (let i = 0; i < def.places.length - 1; i++) {
    const interp = geoInterpolate(places[def.places[i]].lonlat, places[def.places[i + 1]].lonlat);
    for (let s = i === 0 ? 0 : 1; s <= SAMPLES_PER_SEGMENT; s++) points.push(interp(s / SAMPLES_PER_SEGMENT) as LonLat);
    waypointIndex.push(points.length - 1);
  }
  const raw: number[] = [0];
  for (let i = 1; i < points.length; i++) raw.push(raw[i - 1] + geoDistance(points[i - 1], points[i]));
  const total = raw[raw.length - 1];
  return {
    points,
    cum: raw.map((d) => d / total),
    waypointFractions: waypointIndex.map((i) => raw[i] / total),
    placeIds: def.places,
    from: def.from,
    to: def.to,
  };
};

export const routeLegs: Leg[] = legs.map(buildLeg);

export const legProgress = (leg: Leg, frame: number) =>
  routeEase(interpolate(frame, [leg.from, leg.to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

export const partialLine = (leg: Leg, progress: number): LonLat[] => {
  if (progress <= 0) return [];
  const out: LonLat[] = [];
  for (let i = 0; i < leg.points.length; i++) {
    if (leg.cum[i] <= progress) {
      out.push(leg.points[i]);
    } else {
      const prev = i - 1;
      const span = leg.cum[i] - leg.cum[prev];
      const k = span === 0 ? 0 : (progress - leg.cum[prev]) / span;
      const a = leg.points[prev];
      const b = leg.points[i];
      out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]);
      return out;
    }
  }
  return out;
};

// Frame at which the route reaches each place (first leg's origin appears just before it starts).
export const appearFrame: Record<string, number> = (() => {
  const result: Record<string, number> = {};
  routeLegs.forEach((leg, legIndex) => {
    leg.placeIds.forEach((id, i) => {
      let frame: number;
      if (i === 0) {
        frame = legIndex === 0 ? leg.from - 14 : -1;
      } else {
        frame = leg.to;
        for (let f = leg.from; f <= leg.to; f++) {
          if (legProgress(leg, f) >= leg.waypointFractions[i] - 1e-6) {
            frame = f;
            break;
          }
        }
      }
      if (frame >= 0 && (result[id] === undefined || frame < result[id])) result[id] = frame;
    });
  });
  return result;
})();
