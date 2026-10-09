// Single source of style tokens and timing. Scenes import only from here.
// Content comes from ../content.json, audio timings from ../assets/audio/timeline.json.
import content from "../content.json";
import timeline from "../assets/audio/timeline.json";

export type SpeakerId = "pip" | "juno";
export type Expression = "normal" | "happy" | "surprised" | "troubled";
export interface Word {
  text: string;
  start_ms: number;
  end_ms: number;
}

export const FPS = content.video.fps;
export const WIDTH = content.video.width;
export const HEIGHT = content.video.height;
export const PALETTE = content.palette;
export const CHARACTERS = content.characters;
export const LABELS = content.labels;
export const BULLETS = content.bullets;
export const TOPIC = content.topic;
export const AUDIO = content.audio;

export const FONT = 'Inter, "Noto Sans SC", sans-serif';
export const TYPE = { boardTitle: 64, bullet: 44, caption: 48, tag: 30, label: 34, small: 28 };

export const LAYOUT = {
  frame: 24,
  board: { x: 120, y: 100, w: 1180, h: 620 },
  caption: { x: 320, y: 860, w: 1280, h: 180 },
  // Characters stand on the tray at feet=852, right of the board, above the caption box.
  mascot: { w: 300, h: 460, feet: 852 },
  pipX: 1295,
  junoX: 1585,
  trayY: 850,
};

// Mascot art colors that are not part of the editable palette.
export const MASCOT = {
  pipFace: "#FFE9F1",
  pipDark: "#B52F66",
  pipLight: "#F7A8C6",
  junoBelly: "#C8EBD0",
  junoWing: "#27843F",
  junoEye: "#FFF6DC",
  beak: "#F5A623",
  white: "#FFFFFF",
};

export const MOTION = {
  hopPx: 12,
  hopSpring: { damping: 12, stiffness: 180 },
  flapFrames: 4,
  flapGapMs: 120,
  breathAmp: 0.015,
  breathPeriodS: 2.5,
  blinkFrames: 4,
  blinkMinS: 3,
  blinkMaxS: 5,
  listenerDim: 0.85,
  popScale: 0.08,
  popSpring: { damping: 7, stiffness: 300 },
  wipeFrames: 16,
};

export const msToFrame = (ms: number) => Math.round((ms * FPS) / 1000);

export interface DialogueLine {
  id: string;
  speaker: SpeakerId;
  expression: Expression;
  reaction: Expression;
  text: string;
  file: string;
  startFrame: number;
  audioFrames: number;
  endFrame: number;
  words: Word[];
}

const segById = new Map(timeline.segments.map((s) => [s.id, s]));
let cursorMs = content.video.leadMs;
const rawLines = content.lines.map((l) => {
  const seg = segById.get(l.id);
  if (!seg) throw new Error(`No audio segment for line ${l.id}; run: pnpm run audio`);
  const startMs = cursorMs;
  cursorMs += seg.duration_ms + content.video.gapMs;
  return { l, seg, startMs };
});

export const TOTAL_FRAMES = msToFrame(cursorMs - content.video.gapMs + content.video.tailMs);

export const LINES: DialogueLine[] = rawLines.map(({ l, seg, startMs }, i) => {
  const next = rawLines[i + 1];
  return {
    id: l.id,
    speaker: l.speaker as SpeakerId,
    expression: l.expression as Expression,
    reaction: l.reaction as Expression,
    text: l.text,
    file: seg.file,
    startFrame: msToFrame(startMs),
    audioFrames: Math.ceil((seg.duration_ms * FPS) / 1000),
    endFrame: next ? msToFrame(next.startMs) : TOTAL_FRAMES,
    words: seg.words,
  };
});

export const LAST_AUDIO_END = LINES[LINES.length - 1].startFrame + LINES[LINES.length - 1].audioFrames;

/** Index of the line whose window [startFrame, next startFrame) contains `frame`. */
export const lineIndexAt = (frame: number): number => {
  let idx = 0;
  LINES.forEach((l, i) => {
    if (frame >= l.startFrame) idx = i;
  });
  return idx;
};

/** Frame at which each board item starts to appear (line start + delay). */
export const BOARD_START: Record<string, number> = {};
export const BOARD_SFX: string[] = [];
content.board.forEach((b) => {
  const line = LINES.find((l) => l.id === b.line);
  if (!line) throw new Error(`Board item ${b.item} refers to unknown line ${b.line}`);
  BOARD_START[b.item] = line.startFrame + b.delay;
  if ((b as { sfx?: boolean }).sfx !== false) BOARD_SFX.push(b.item);
});
