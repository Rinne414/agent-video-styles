import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-500.css";
import { continueRender, delayRender, cancelRender } from "remotion";
import content from "../content.json";
import timeline from "../assets/audio/timeline.json";
import layout from "../assets/audio/layout.json";

export { content, timeline, layout };

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1080;
export const DURATION = Math.floor((layout.total_ms / 1000) * FPS);

export const FONT = 'Inter, "Helvetica Neue", Arial, sans-serif';

export const COLOR = content.theme;

// Layout tokens (px at 1080x1080). Safe area 96.
export const SAFE = 96;
export const COVER = { size: 360, radius: 28, centerY: 290 };
export const TITLE = { y: 490, size: 44 };
export const BARS = { count: 48, width: 10, gap: 8, maxH: 220, minH: 6, baselineY: 700, tilt: 1.5, softClip: 130 };
export const CAPTION = { centerY: 912, size: 52, maxChars: 28, padX: 24, padY: 12, radius: 20 };
export const PROGRESS = { y: 826, x0: SAFE, x1: WIDTH - SAFE, h: 4 };

export const SPRING_COVER = { damping: 20, stiffness: 160 };
export const INTRO_FRAMES = 18;
export const CAPTION_LEAD_FRAMES = 2;
export const SMOOTH_FRAMES = 1; // average frame-1, frame, frame+1
export const SIGNAL_FLOOR = 0.01;
export const BIN_SAMPLES = 128;
export const BIN_SCALE = 520;

// Wait for the fonts before the first frame is captured.
const handle = delayRender("fonts");
Promise.all([
  document.fonts.load("700 52px Inter", "The Small Batch Podcast Episode 12 0123456789"),
  document.fonts.load("500 30px Inter", "Episode 12"),
])
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));

export const msToFrame = (ms: number) => Math.round((ms / 1000) * FPS);
export const speechEndFrame = msToFrame(layout.speech_end_ms);
