import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Audio } from "@remotion/media";
import content from "../content.json";
import { ramp } from "./anim";
import { Captions } from "./Captions";
import { C, FONT, FPS, L, T } from "./theme";
import { SEGS } from "./timeline";
import { World } from "./World";

const CHAPTER_FADE = 8;

type ChapterSpan = { key: string; start: number; end: number };

const CHAPTERS: ChapterSpan[] = content.segments.reduce<ChapterSpan[]>((acc, cfg) => {
  const seg = SEGS.find((s) => s.id === cfg.id);
  if (!seg) return acc;
  const last = acc[acc.length - 1];
  if (last && last.key === cfg.chapter) return [...acc.slice(0, -1), { ...last, end: seg.end }];
  return [...acc, { key: cfg.chapter, start: seg.start, end: seg.end }];
}, []);

const Chapter: React.FC = () => {
  const f = useCurrentFrame();
  const labels = L.chapters as Record<string, string>;
  return (
    <>
      {CHAPTERS.map((c) => {
        const o = ramp(f, c.start, c.end, CHAPTER_FADE);
        if (o <= 0.005 || !labels[c.key]) return null;
        return (
          <div
            key={c.key}
            style={{
              position: "absolute",
              left: 100,
              top: 56,
              display: "flex",
              alignItems: "center",
              gap: 24,
              opacity: o,
              transform: `translateY(${(1 - o) * -12}px)`,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: T.chapterSize,
              color: C.text,
            }}
          >
            <span style={{ width: 14, height: T.chapterSize * 0.8, borderRadius: 7, background: C.primary }} />
            {labels[c.key]}
          </div>
        );
      })}
    </>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)" }} />
);

export const Explainer: React.FC = () => (
  <AbsoluteFill style={{ background: C.bg, overflow: "hidden" }}>
    <World />
    <Vignette />
    <Chapter />
    <Captions />
    {SEGS.map((s) => (
      <Sequence key={s.id} from={s.start} durationInFrames={s.frames + FPS} premountFor={FPS}>
        <Audio src={staticFile(`audio/${s.file}`)} />
      </Sequence>
    ))}
  </AbsoluteFill>
);
