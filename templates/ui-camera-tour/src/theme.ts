import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import { cancelRender, continueRender, delayRender, Easing } from "remotion";
import content from "../content.json";

export { content };

export const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';

// Block the first frame until all four weights are decoded.
const fontHandle = delayRender("fonts");
Promise.all(
  [400, 500, 600, 700].map((w) => document.fonts.load(`${w} 40px Inter`, "Aa0$#")),
)
  .then(() => continueRender(fontHandle))
  .catch((e) => cancelRender(e));

const f = content.format;
export const FORMAT = {
  fps: f.fps,
  width: f.width,
  height: f.height,
  bpm: f.bpm,
  framesPerBeat: (f.fps * 60) / f.bpm,
  durationInFrames: Math.round(f.durationBeats * ((f.fps * 60) / f.bpm)),
};

/** Beats (may be fractional) to a whole frame number. */
export const beat = (b: number) => Math.round(b * FORMAT.framesPerBeat);

export const COLORS = {
  accent: content.brand.accent,
  accentInk: content.brand.accentInk,
  accentDeep: "#047857",
  accentSoft: "#D1FAE5",
  backdrop: "#0E0E10",
  appBg: "#F4F5F7",
  surface: "#FFFFFF",
  ink: "#101828",
  muted: "#667085",
  border: "#E4E7EC",
  fieldBorder: "#D0D5DD",
  sentBg: "#DBEAFE",
  sentInk: "#1D4ED8",
  draftBg: "#EAECF0",
  draftInk: "#475467",
  overdueBg: "#FEE4E2",
  overdueInk: "#B42318",
  white: "#FFFFFF",
};

export const MOTION = {
  cameraEase: Easing.bezier(0.65, 0, 0.35, 1),
  travelFrames: content.timeline.travelFrames,
  clickDelay: content.timeline.clickDelayFrames,
  charFrames: 2,
  spacePauseFrames: 6,
  blinkFrames: 16,
  blurSamples: 20,
  shutterAngle: 90,
};

export const WINDOW = { w: 1440, h: 900, radius: 20 };
