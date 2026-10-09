import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import {
  BOARD_START,
  BULLETS,
  FONT,
  LABELS,
  LAYOUT,
  MOTION,
  PALETTE,
  TOPIC,
  TYPE,
} from "./theme";

const WHITE = PALETTE.chalkWhite;
const YELLOW = PALETTE.chalkYellow;
const PINK = PALETTE.chalkPink;
const ease = Easing.out(Easing.cubic);

/** 0..1 progress of a board item over `dur` frames, starting at its content.json start frame. */
const useProgress = (item: string, dur: number, extraDelay = 0): number => {
  const frame = useCurrentFrame();
  const t0 = BOARD_START[item] + extraDelay;
  return interpolate(frame, [t0, t0 + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: ease,
  });
};

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

interface StrokeProps {
  d: string;
  p: number;
  color?: string;
  w?: number;
}

/** Chalk stroke that writes itself on (SVG dash on a normalized path length). */
const Stroke: React.FC<StrokeProps> = ({ d, p, color = WHITE, w = 5 }) => (
  <path
    d={d}
    pathLength={1}
    fill="none"
    stroke={color}
    strokeWidth={w}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeDasharray="1 1"
    strokeDashoffset={1 - p}
    opacity={p > 0 ? 1 : 0}
  />
);

/** Stagger several strokes inside one progress value. */
const sub = (p: number, i: number, n: number) => {
  const d = 1 / (0.5 * n + 0.5);
  return Math.max(0, Math.min(1, (p - i * 0.5 * d) / d));
};

const Strokes: React.FC<{ paths: string[]; p: number; color?: string; w?: number }> = ({ paths, p, color, w }) => (
  <>
    {paths.map((d, i) => (
      <Stroke key={i} d={d} p={sub(p, i, paths.length)} color={color} w={w} />
    ))}
  </>
);

interface WipeProps {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  p: number;
  children: React.ReactNode;
}

/** Left-to-right clip wipe, used for text and dashed lines. */
const Wipe: React.FC<WipeProps> = ({ id, x, y, w, h, p, children }) => (
  <>
    <clipPath id={id}>
      <rect x={x} y={y} width={w * p} height={h} />
    </clipPath>
    <g clipPath={`url(#${id})`}>{children}</g>
  </>
);

interface ChalkTextProps {
  x: number;
  y: number;
  size: number;
  color?: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
  opacity?: number;
  children: React.ReactNode;
}

const ChalkText: React.FC<ChalkTextProps> = ({ x, y, size, color = WHITE, weight = 700, anchor = "start", opacity = 1, children }) => (
  <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={weight} fill={color} textAnchor={anchor} opacity={opacity}>
    {children}
  </text>
);

// ---- diagram geometry (board-local coordinates, board is 1180 x 620) ----
const X_YOU = 200;
const X_WAITER = 590;
const X_KITCHEN = 980;
const LABEL_Y = 414;

const YOU_PATHS = [
  "M120 302 L280 302",
  "M138 302 L138 350",
  "M262 302 L262 350",
  circle(200, 190, 28),
  "M200 218 L200 296",
  "M200 236 L164 270",
  "M200 236 L236 270",
  "M168 290 q32 -14 64 0",
];
const KITCHEN_PATHS = [
  "M922 258 L1038 258 L1030 336 Q1030 344 1020 344 L940 344 Q930 344 930 336 Z",
  "M908 250 L1052 250",
  circle(980, 236, 9),
  "M922 286 Q894 286 894 308 Q894 326 922 326",
  "M1038 286 Q1066 286 1066 308 Q1066 326 1038 326",
];
const STEAM_PATHS = ["M952 214 q-14 -18 0 -36 q14 -18 0 -36", "M980 214 q-14 -18 0 -36 q14 -18 0 -36", "M1008 214 q-14 -18 0 -36 q14 -18 0 -36"];
const FLAME_PATHS = ["M948 352 q-6 9 0 17 q8 -7 4 -17", "M980 352 q-7 11 0 20 q9 -8 4 -20", "M1012 352 q-6 9 0 17 q8 -7 4 -17"];
const WAITER_PATHS = [
  circle(590, 186, 26),
  "M590 212 L590 292",
  "M590 292 L568 348",
  "M590 292 L612 348",
  "M590 232 L558 282",
  "M590 232 L636 208",
  "M606 206 L690 206",
  "M624 206 A28 28 0 0 1 672 206",
];
const BOWTIE = "M576 218 L590 226 L604 218 L604 234 L590 226 L576 234 Z";
const MENU_PATHS = [
  "M356 126 L436 126 L436 220 L356 220 Z",
  "M372 152 L420 152",
  "M372 172 L420 172",
  "M372 192 L408 192",
];

const BULLET_Y = { question: 470, waiter: 516, menu: 562, summary: 608 };

const Bullet: React.FC<{ item: string; y: number; color: string; text: string }> = ({ item, y, color, text }) => {
  const p = useProgress(item, MOTION.wipeFrames);
  const dot = useProgress(item, 6);
  return (
    <g>
      <circle cx={66} cy={y - 15} r={8} fill={color} opacity={dot > 0 ? 1 : 0} />
      <Wipe id={`wipe-${item}`} x={84} y={y - 48} w={760} h={64} p={p}>
        <ChalkText x={90} y={y} size={TYPE.bullet} color={color} weight={700}>
          {text}
        </ChalkText>
      </Wipe>
    </g>
  );
};

export const Board: React.FC = () => {
  const frame = useCurrentFrame();
  const title = useProgress("title", MOTION.wipeFrames);
  const titleLine = useProgress("title", 14, MOTION.wipeFrames);
  const you = useProgress("you", 24);
  const kitchen = useProgress("kitchen", 24);
  const direct = useProgress("direct", 20);
  const waiter = useProgress("waiter", 26);
  const request = useProgress("request", 36);
  const response = useProgress("response", 36);
  const ring = useProgress("ring", 20);
  const relabel = useProgress("relabel", 12);
  const menu = useProgress("menu", 22);
  const underline = useProgress("underline", 16);

  const directFade = interpolate(frame, [BOARD_START.waiter - 4, BOARD_START.waiter + 8], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const L = LABELS;
  const b = LAYOUT.board;

  const labelPair = (before: string, after: string, x: number, vis: number, afterColor = WHITE) => (
    <>
      <ChalkText x={x} y={LABEL_Y} size={TYPE.label} anchor="middle" opacity={vis * (1 - relabel)}>
        {before}
      </ChalkText>
      <ChalkText x={x} y={LABEL_Y} size={TYPE.label} anchor="middle" color={afterColor} opacity={vis * relabel}>
        {after}
      </ChalkText>
    </>
  );

  return (
    <svg width={b.w} height={b.h} style={{ position: "absolute", left: b.x, top: b.y }}>
      <defs>
        <filter id="chalk" x="-4%" y="-4%" width="108%" height="108%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 2.1" result="mask" />
          <feComposite in="SourceGraphic" in2="mask" operator="in" result="grainy" />
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="warp" />
          <feDisplacementMap in="grainy" in2="warp" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter="url(#chalk)">
        {/* title */}
        <Wipe id="wipe-title" x={50} y={30} w={420} h={90} p={title}>
          <ChalkText x={60} y={92} size={TYPE.boardTitle} weight={800} color={YELLOW}>
            {TOPIC}
          </ChalkText>
        </Wipe>
        <Stroke d="M58 112 Q170 124 300 108" p={titleLine} color={YELLOW} w={5} />

        <g transform="translate(0 -24)">
        {/* you / table */}
        <Strokes paths={YOU_PATHS} p={you} />
        {labelPair(L.before.you, L.after.you, X_YOU, you > 0.3 ? 1 : 0, YELLOW)}

        {/* kitchen / pot */}
        <Strokes paths={KITCHEN_PATHS} p={kitchen} />
        <Strokes paths={STEAM_PATHS} p={sub(kitchen, 4, 6)} color="#BFD6CC" w={4} />
        <Strokes paths={FLAME_PATHS} p={sub(kitchen, 5, 6)} color={YELLOW} w={5} />
        {labelPair(L.before.kitchen, L.after.kitchen, X_KITCHEN, kitchen > 0.3 ? 1 : 0, YELLOW)}

        {/* "no direct access": dashed line with a cross, fades when the waiter arrives */}
        <g opacity={directFade}>
          <Wipe id="wipe-direct" x={290} y={200} w={610} h={100} p={direct}>
            <path d="M300 262 L880 262" stroke={PINK} strokeWidth={5} strokeDasharray="18 14" strokeLinecap="round" fill="none" />
          </Wipe>
          <Stroke d="M566 238 L614 286" p={sub(direct, 1, 3)} color={PINK} w={8} />
          <Stroke d="M614 238 L566 286" p={sub(direct, 2, 3)} color={PINK} w={8} />
          <ChalkText x={590} y={222} size={TYPE.small} color={PINK} anchor="middle" opacity={direct > 0.5 ? 1 : 0}>
            {L.noAccess}
          </ChalkText>
        </g>

        {/* waiter */}
        <Strokes paths={WAITER_PATHS} p={waiter} />
        <path d={BOWTIE} fill={PINK} stroke={PINK} strokeWidth={3} strokeLinejoin="round" opacity={waiter > 0.6 ? 1 : 0} />
        {labelPair(L.before.waiter, L.after.waiter, X_WAITER, waiter > 0.3 ? 1 : 0, YELLOW)}

        {/* request and response arrows */}
        <Stroke d="M304 274 L500 274" p={sub(request, 0, 2)} color={PINK} w={6} />
        <Stroke d="M478 258 L502 274 L478 290" p={sub(request, 0, 2) > 0.9 ? 1 : 0} color={PINK} w={6} />
        <Stroke d="M694 274 L890 274" p={sub(request, 1, 2)} color={PINK} w={6} />
        <Stroke d="M868 258 L892 274 L868 290" p={sub(request, 1, 2) > 0.9 ? 1 : 0} color={PINK} w={6} />
        <ChalkText x={402} y={262} size={TYPE.small} color={PINK} anchor="middle" opacity={request > 0.2 ? 1 : 0}>
          {L.request}
        </ChalkText>
        <ChalkText x={792} y={262} size={TYPE.small} color={PINK} anchor="middle" opacity={request > 0.7 ? 1 : 0}>
          {L.request}
        </ChalkText>
        <Stroke d="M886 322 L694 322" p={sub(response, 0, 2)} color={YELLOW} w={6} />
        <Stroke d="M716 306 L692 322 L716 338" p={sub(response, 0, 2) > 0.9 ? 1 : 0} color={YELLOW} w={6} />
        <Stroke d="M496 322 L304 322" p={sub(response, 1, 2)} color={YELLOW} w={6} />
        <Stroke d="M326 306 L302 322 L326 338" p={sub(response, 1, 2) > 0.9 ? 1 : 0} color={YELLOW} w={6} />
        <ChalkText x={790} y={366} size={TYPE.small} color={YELLOW} anchor="middle" opacity={response > 0.2 ? 1 : 0}>
          {L.response}
        </ChalkText>
        <ChalkText x={400} y={366} size={TYPE.small} color={YELLOW} anchor="middle" opacity={response > 0.7 ? 1 : 0}>
          {L.response}
        </ChalkText>

        {/* highlight ring around the waiter */}
        <Stroke d="M490 258 a100 126 0 1 1 200 0 a100 126 0 1 1 -200 0" p={ring} color={YELLOW} w={6} />

        {/* menu card */}
        <Strokes paths={MENU_PATHS} p={menu} color={WHITE} w={5} />
        <ChalkText x={342} y={186} size={TYPE.small} color={WHITE} anchor="end" opacity={menu > 0.6 ? 1 : 0}>
          {LABELS.menu}
        </ChalkText>

        </g>

        {/* bullets */}
        <Bullet item="question" y={BULLET_Y.question} color={PINK} text={BULLETS.question} />
        <Bullet item="bulletWaiter" y={BULLET_Y.waiter} color={WHITE} text={BULLETS.waiter} />
        <Bullet item="bulletMenu" y={BULLET_Y.menu} color={WHITE} text={BULLETS.menu} />
        <Bullet item="summary" y={BULLET_Y.summary} color={YELLOW} text={BULLETS.summary} />
        <Stroke d={`M88 ${BULLET_Y.summary + 12} Q300 ${BULLET_Y.summary + 20} 560 ${BULLET_Y.summary + 10}`} p={underline} color={YELLOW} w={5} />
      </g>
    </svg>
  );
};
