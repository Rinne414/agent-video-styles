import React from "react";
import { Composition, staticFile, type CalculateMetadataFunction } from "remotion";
import "./fonts";
import { KaraokeShort, type KaraokeProps } from "./KaraokeShort";
import type { Timeline } from "./chunks";
import { FPS, GAP_MS, HEIGHT, TAIL_MS, WIDTH } from "./theme";

// Narration is the master clock: length = segments + gaps + tail.
const calculateMetadata: CalculateMetadataFunction<KaraokeProps> = async ({ props }) => {
  const timeline: Timeline = props.timeline ?? (await (await fetch(staticFile("audio/timeline.json"))).json());
  const ms = timeline.segments.reduce((s, x) => s + x.duration_ms + GAP_MS, 0) - GAP_MS + TAIL_MS;
  return { durationInFrames: Math.ceil((ms / 1000) * FPS), props: { timeline } };
};

export const RemotionRoot: React.FC = () => (
  <Composition
    id="KaraokeShort"
    component={KaraokeShort}
    durationInFrames={FPS * 30}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={{ timeline: null } as KaraokeProps}
    calculateMetadata={calculateMetadata}
  />
);
