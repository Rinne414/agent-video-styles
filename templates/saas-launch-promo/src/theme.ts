import content from "../content.json";

export const C = content;
export const { fps, width, height } = C.video;
export const BEAT = Math.round((fps * 60) / C.video.bpm); // 15 frames at 120 BPM / 30 fps

export const color = {
  bg: C.brand.background,
  accent: C.brand.accent,
  text: C.brand.textPrimary,
  muted: C.brand.textSecondary,
  warning: C.brand.warning,
  cardFill: "rgba(255,255,255,0.04)",
  cardBorder: "rgba(255,255,255,0.08)",
};

export const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};

export const font = `"${C.brand.font}", system-ui, sans-serif`;

export const SPRING = { damping: 20, stiffness: 160, mass: 1 };
export const SAFE = 80;
export const TOTAL_FRAMES = Math.max(...Object.values(C.timing).map((t) => t[1]));

export const CARD_SHADOW = "0 30px 80px rgba(0,0,0,0.5)";
