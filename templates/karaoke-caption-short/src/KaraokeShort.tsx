import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { Background } from "./Background";
import { SegmentCaptions } from "./Captions";
import { Card } from "./cards";
import { buildChunks, type Timeline } from "./chunks";
import { COLORS, FPS, GAP_MS, LAYOUT, SEGMENTS } from "./theme";

export type KaraokeProps = { timeline: Timeline | null };

const msToFrames = (ms: number) => Math.round((ms / 1000) * FPS);

const segmentStarts = (timeline: Timeline): number[] => {
  const starts: number[] = [];
  let cursor = 0;
  for (const seg of timeline.segments) {
    starts.push(msToFrames(cursor));
    cursor += seg.duration_ms + GAP_MS;
  }
  return starts;
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: LAYOUT.progressHeight,
        width: `${(frame / durationInFrames) * 100}%`,
        background: COLORS.highlight,
      }}
    />
  );
};

export const KaraokeShort: React.FC<KaraokeProps> = ({ timeline }) => {
  if (!timeline) return null;
  const starts = segmentStarts(timeline);
  return (
    <AbsoluteFill>
      <Background />
      {timeline.segments.map((seg, i) => {
        const spec = SEGMENTS[i];
        const from = starts[i];
        const to = i + 1 < starts.length ? starts[i + 1] : from + msToFrames(seg.duration_ms + GAP_MS);
        return (
          <Sequence key={seg.id} from={from} durationInFrames={to - from} premountFor={FPS}>
            <Audio src={staticFile(`audio/${seg.file}`)} />
            <Card spec={spec.card} />
            <SegmentCaptions chunks={buildChunks(spec, seg)} />
          </Sequence>
        );
      })}
      <ProgressBar />
    </AbsoluteFill>
  );
};
