import { C, PART_BY_ID, U, T } from "./theme";

export interface DarkWindow {
  part: string;
  from: number; // frame where the fade to dark starts
  to: number; // frame where the fade back to white starts
  forever?: boolean;
}

export interface PacketKey {
  frame: number; // frame the packet is at this point
  x: number;
  y: number;
  visible: boolean;
  label: string;
}

const pk = C.packet;
const ramp = T.focusRamp;

// Distance in px between two node centres (axis-aligned legs).
const legLen = (a: string, b: string) => {
  const [ax, ay] = PART_BY_ID[a].at;
  const [bx, by] = PART_BY_ID[b].at;
  return Math.hypot(bx - ax, by - ay) * U;
};

export interface Leg {
  from: string;
  to: string;
  t0: number; // frame the packet leaves the hide radius of `from`
  t1: number; // frame the packet reaches the hide radius of `to`
  label: string;
}

const buildLegs = (): { legs: Leg[]; windows: DarkWindow[]; end: number } => {
  const forward = pk.route;
  const hops: [string, string, string][] = [];
  forward.slice(0, -1).forEach((id, i) => hops.push([id, forward[i + 1], pk.labelsOut[i]]));
  const back = [...forward].reverse();
  back.slice(0, -1).forEach((id, i) => hops.push([id, back[i + 1], pk.labelsBack[i]]));

  const legs: Leg[] = [];
  const windows: DarkWindow[] = [];
  let t = pk.start;
  // The first node is dark while the packet is absorbed into it, then it leaves.
  windows.push({ part: hops[0][0], from: t - ramp, to: t + pk.dwell - ramp });
  t += pk.dwell;
  hops.forEach(([a, b, label], i) => {
    const visibleLen = legLen(a, b) - 2 * pk.hideRadius * U;
    const frames = Math.round(visibleLen / pk.speedPxPerFrame);
    legs.push({ from: a, to: b, t0: t, t1: t + frames, label });
    t += frames;
    const last = i === hops.length - 1;
    windows.push({ part: b, from: t, to: t + pk.dwell - ramp, forever: last });
    if (!last) t += pk.dwell;
  });
  return { legs, windows, end: t };
};

const built = buildLegs();
export const LEGS = built.legs;
export const PACKET_END = built.end;

// Dark-accent windows: build-phase focus, packet dwell, final hero hold. At most one is active at a time.
export const DARK_WINDOWS: DarkWindow[] = [
  ...C.parts.flatMap((p) => (p.focus ? [{ part: p.id, from: p.focus[0], to: p.focus[1] }] : [])),
  ...built.windows.slice(0, -1),
  { ...built.windows[built.windows.length - 1], part: C.hero.part, forever: true },
];

const trap = (frame: number, w: DarkWindow) => {
  const up = Math.min(1, Math.max(0, (frame - w.from) / ramp));
  if (w.forever) return up;
  const down = Math.min(1, Math.max(0, (frame - w.to) / ramp));
  return Math.max(0, up - down);
};

export const darkOf = (part: string, frame: number): number =>
  Math.max(0, ...DARK_WINDOWS.filter((w) => w.part === part).map((w) => trap(frame, w)));

// Packet state at a frame: grid position plus visibility.
export const packetAt = (frame: number): { x: number; y: number; visible: boolean; label: string; legIndex: number } | null => {
  if (frame < pk.start) return null;
  for (let i = 0; i < LEGS.length; i++) {
    const leg = LEGS[i];
    if (frame >= leg.t0 && frame <= leg.t1) {
      const [ax, ay] = PART_BY_ID[leg.from].at;
      const [bx, by] = PART_BY_ID[leg.to].at;
      const L = Math.hypot(bx - ax, by - ay);
      const dx = (bx - ax) / L;
      const dy = (by - ay) / L;
      const k = leg.t1 === leg.t0 ? 1 : (frame - leg.t0) / (leg.t1 - leg.t0);
      const d = pk.hideRadius + k * (L - 2 * pk.hideRadius);
      return { x: ax + dx * d, y: ay + dy * d, visible: true, label: leg.label, legIndex: i };
    }
  }
  return null;
};
