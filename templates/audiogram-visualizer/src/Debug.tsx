import { AbsoluteFill, staticFile } from "remotion";
import { useAudioData } from "@remotion/media-utils";
import { barHeights } from "./audioBars";
import { BARS, DURATION } from "./theme";

/** QA still: bar amplitude stats over the whole clip (peak per bar, max frame-to-frame jump). */
export const Debug = () => {
  const audioData = useAudioData(staticFile("audio/narration.wav"));
  if (!audioData) return null;
  const peaks = new Array(BARS.count).fill(0);
  const means = new Array(BARS.count).fill(0);
  let prev: number[] | null = null;
  let maxJump = 0;
  let over40 = 0;
  let samples = 0;
  for (let f = 0; f < DURATION; f++) {
    const a = barHeights(audioData, f).map((v) => v);
    a.forEach((v, i) => {
      peaks[i] = Math.max(peaks[i], v);
      means[i] += v / DURATION;
      if (prev) {
        const j = Math.abs(v - prev[i]) / BARS.maxH;
        maxJump = Math.max(maxJump, j);
        samples++;
        if (j > 0.4) over40++;
      }
    });
    prev = a;
  }
  return (
    <AbsoluteFill style={{ background: "#fff", color: "#000", fontSize: 22, fontFamily: "monospace", padding: 30 }}>
      <div>peaks: {peaks.map((p) => Math.round(p)).join(" ")}</div>
      <div>means: {means.map((p) => Math.round(p)).join(" ")}</div>
      <div>maxJump (frac of maxH): {maxJump.toFixed(3)}; samples over 0.4: {over40}/{samples}</div>
    </AbsoluteFill>
  );
};
