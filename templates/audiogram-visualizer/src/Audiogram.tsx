import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { useAudioData } from "@remotion/media-utils";
import { Bars } from "./Bars";
import { CaptionView } from "./CaptionView";
import { Cover } from "./Cover";
import { barHeights, lowEnergy } from "./audioBars";
import { buildCaptions } from "./captions";
import { BARS, COLOR, FONT, PROGRESS, SPRING_COVER, TITLE, WIDTH, content, speechEndFrame } from "./theme";

const captions = buildCaptions();
const IDLE_HEIGHTS = new Array<number>(BARS.count).fill(0);
const OUTRO_FADE_FRAMES = 14;

const Title = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame: frame - 6, fps, config: SPRING_COVER });
  return (
    <div
      style={{
        position: "absolute",
        top: TITLE.y,
        width: WIDTH,
        textAlign: "center",
        fontFamily: FONT,
        opacity: enter,
        translate: `0 ${(1 - enter) * 16}px`,
      }}
    >
      <div style={{ fontSize: TITLE.size, fontWeight: 700, color: COLOR.text, lineHeight: 1.15 }}>{content.show.title}</div>
      <div style={{ fontSize: 30, fontWeight: 500, color: COLOR.accent, marginTop: 6 }}>{content.show.episode}</div>
    </div>
  );
};

const Progress = () => {
  const frame = useCurrentFrame();
  const frac = interpolate(frame, [0, speechEndFrame], [0, 1], { extrapolateRight: "clamp" });
  const w = PROGRESS.x1 - PROGRESS.x0;
  return (
    <div style={{ position: "absolute", left: PROGRESS.x0, top: PROGRESS.y, width: w, height: PROGRESS.h, borderRadius: 2, background: COLOR.floor }}>
      <div style={{ width: w * frac, height: PROGRESS.h, borderRadius: 2, background: COLOR.accent }} />
    </div>
  );
};

/** Final card: replaces the captions once the speech ends. */
const Outro = () => {
  const frame = useCurrentFrame();
  const start = speechEndFrame + 12;
  const t = interpolate(frame, [start, start + OUTRO_FADE_FRAMES], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (t === 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 912,
        width: WIDTH,
        display: "flex",
        justifyContent: "center",
        opacity: t,
        translate: `0 ${(1 - t) * 12}px`,
      }}
    >
      <div
        style={{
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.7)",
          borderRadius: 20,
          padding: "14px 28px",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: 44,
          color: COLOR.text,
          textAlign: "center",
          whiteSpace: "nowrap",
        }}
      >
        Listen at <span style={{ color: COLOR.accent }}>{content.show.url}</span>
      </div>
    </div>
  );
};

export const Audiogram = () => {
  const frame = useCurrentFrame();
  const audioData = useAudioData(staticFile("audio/narration.wav"));
  const heights = audioData ? barHeights(audioData, frame) : IDLE_HEIGHTS;
  return (
    <AbsoluteFill style={{ background: COLOR.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle 450px at ${WIDTH / 2}px ${BARS.baselineY}px, ${COLOR.accent}1F, transparent 100%)`,
        }}
      />
      <Audio src={staticFile("audio/narration.wav")} />
      <Cover pulse={lowEnergy(heights)} />
      <Title />
      <Bars heights={heights} />
      <Progress />
      <CaptionView captions={captions} />
      <Outro />
    </AbsoluteFill>
  );
};
