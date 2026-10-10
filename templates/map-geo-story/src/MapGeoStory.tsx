import { AbsoluteFill, useCurrentFrame } from "remotion";
import { pathFor } from "./geo";
import { meta, theme } from "./theme";
import { BaseMap } from "./BaseMap";
import { Routes } from "./Routes";
import { Places } from "./Places";
import { Annotations } from "./Annotations";
import { TitleBlock, Outro } from "./Overlays";

export const MapGeoStory = () => {
  const frame = useCurrentFrame();
  const { projection, path } = pathFor(frame);
  return (
    <AbsoluteFill style={{ background: theme.ocean, fontFamily: theme.fontFamily }}>
      <svg width={meta.width} height={meta.height} style={{ position: "absolute", inset: 0 }}>
        <BaseMap frame={frame} path={path} />
        <Routes frame={frame} projection={projection} path={path} />
        <Places frame={frame} projection={projection} />
        <Annotations frame={frame} projection={projection} />
      </svg>
      <TitleBlock frame={frame} />
      <Outro frame={frame} />
    </AbsoluteFill>
  );
};
