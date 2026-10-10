import { visualizeAudio } from "@remotion/media-utils";
import type { MediaUtilsAudioData } from "@remotion/media-utils";
import { BARS, BIN_SAMPLES, BIN_SCALE, FPS, SMOOTH_FRAMES } from "./theme";

const LOWER_BINS = BIN_SAMPLES / 2;
const HALF = BARS.count / 2; // bars mirror about the centre: lows in the middle, highs outward

/** Raw spectrum (0..1 per bin) at one frame, lower half only. */
const rawBins = (audioData: MediaUtilsAudioData, frame: number): number[] =>
  visualizeAudio({
    fps: FPS,
    frame: Math.max(0, frame),
    audioData,
    numberOfSamples: BIN_SAMPLES,
    optimizeFor: "speed",
  }).slice(0, LOWER_BINS);

/** Distance of bar i from the centre, 0..HALF-1. */
export const barRank = (i: number) => Math.floor(Math.abs(i - (BARS.count - 1) / 2));

/**
 * Frame-indexed amplitude in px for every bar: 3-frame moving average over neighbouring
 * frames, sqrt curve, a mild high-frequency tilt (speech energy is low), soft clip at maxH.
 */
export function barHeights(audioData: MediaUtilsAudioData, frame: number): number[] {
  const frames: number[][] = [];
  for (let d = -SMOOTH_FRAMES; d <= SMOOTH_FRAMES; d++) frames.push(rawBins(audioData, frame + d));
  return Array.from({ length: BARS.count }, (_, i) => {
    const rank = barRank(i);
    const bin = Math.floor((rank * LOWER_BINS) / HALF);
    const mean = frames.reduce((s, f) => s + f[bin], 0) / frames.length;
    const tilt = 1 + (rank / (HALF - 1)) * BARS.tilt;
    const px = Math.pow(mean, 0.5) * BIN_SCALE * tilt;
    return BARS.maxH * Math.tanh(px / BARS.softClip);
  });
}

/** 0..1 energy of the centre (low-frequency) bars, for the cover pulse. */
export const lowEnergy = (heights: number[]): number => {
  const mid = heights.slice(HALF - 4, HALF + 4);
  return Math.min(1, mid.reduce((s, v) => s + v, 0) / mid.length / (BARS.maxH * 0.7));
};
