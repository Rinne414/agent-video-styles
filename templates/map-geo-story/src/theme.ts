// Single source of style tokens and content. Scenes import only from here.
import { cancelRender, continueRender, delayRender } from "remotion";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";
import content from "../content.json";

export const meta = content.meta;
export const theme = content.theme;
export const text = content.text;
export const places = content.places as unknown as Record<
  string,
  {
    name: string;
    lonlat: [number, number];
    label?: { anchor: "start" | "middle" | "end"; dx: number; dy: number };
  }
>;
export const legs = content.legs;
export const regions = content.regions;
export const annotations = content.annotations;
export const cameraKeys = content.camera as {
  frame: number;
  center: [number, number];
  scale: number;
}[];
export const driftPercent = content.driftPercent;
export const outro = content.outro;

export const type = {
  kicker: { size: 30, weight: 600, tracking: 4 },
  title: { size: 64, weight: 700 },
  label: { size: 32, weight: 600 },
  annotationHead: { size: 34, weight: 700 },
  annotationBody: { size: 32, weight: 600 },
  annotationLine: 42,
  source: { size: 30, weight: 600 },
  outro: { size: 48, weight: 700 },
};

export const stroke = { route: 4, border: 1, halo: 6 };
export const dot = { place: 12, waypoint: 7, head: 12, pulseMax: 48, pulseFrames: 24 };
export const dash = "8 6";

// Wait until Inter is ready before the first frame.
const fontHandle = delayRender("inter-font");
Promise.all([
  document.fonts.load(`600 32px ${theme.fontFamily}`, "Chang'an Xi'an 0123456789"),
  document.fonts.load(`700 64px ${theme.fontFamily}`, "The Silk Road in 30 seconds"),
])
  .then(() => continueRender(fontHandle))
  .catch((e) => cancelRender(e));
