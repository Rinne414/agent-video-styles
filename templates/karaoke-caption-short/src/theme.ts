import content from "../content.json";

export type CardType = "hook" | "spaced" | "recall" | "teach" | "cta";

export type CardSpec = {
  type: CardType;
  big: string;
  unit?: string;
  label: string;
  marks?: string[];
};

export type SegmentSpec = {
  id: string;
  text: string;
  keyTerms: string[];
  emphasis: string;
  card: CardSpec;
};

export const FPS = content.video.fps;
export const WIDTH = content.video.width;
export const HEIGHT = content.video.height;
export const GAP_MS = content.video.gapMs;
export const TAIL_MS = content.video.tailMs;
export const SEGMENTS = content.segments as SegmentSpec[];

export const COLORS = {
  highlight: content.theme.highlight,
  text: content.theme.text,
  bgFrom: content.theme.bgFrom,
  bgTo: content.theme.bgTo,
  blobs: content.theme.blobs,
  glass: "rgba(255,255,255,0.09)",
  glassBorder: "rgba(255,255,255,0.20)",
  dim: "rgba(255,255,255,0.35)",
};

export const FONT_FAMILY = '"Noto Sans SC", sans-serif';

// Layout tokens (1080x1920), from the style recipe.
export const LAYOUT = {
  captionCenterY: 1150,
  captionFont: 104,
  captionWidth: 820,
  safeLeft: 80,
  cardWidth: 880,
  cardTop: 380,
  cardHeight: 580,
  cardRadius: 32,
  progressHeight: 8,
};

export const CHUNK_SPRING = { damping: 14, stiffness: 220 };
export const CHUNK_MAX_CHARS = 14;
