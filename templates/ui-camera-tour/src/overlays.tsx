import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { beat, COLORS, content, FONT } from "./theme";
import { rectByName, type Rect } from "./layout";
import { clickFx, cursorAt, type Pose } from "./timeline";

/** Places children at a window point with a constant on-screen size, whatever the camera zoom. */
const ScreenSized: React.FC<{ x: number; y: number; z: number; children: React.ReactNode; style?: React.CSSProperties }> = ({
  x,
  y,
  z,
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 0,
      height: 0,
      transform: `scale(${1 / z})`,
      transformOrigin: "0 0",
      ...style,
    }}
  >
    {children}
  </div>
);

const CURSOR_SIZE = 48;

export const Cursor: React.FC<{ z: number }> = ({ z }) => {
  const frame = useCurrentFrame();
  const p = cursorAt(frame);
  const { press, ripple } = clickFx(frame);
  return (
    <ScreenSized x={p.x} y={p.y} z={z}>
      {ripple >= 0 ? (
        <div
          style={{
            position: "absolute",
            left: -ripple * 48,
            top: -ripple * 48,
            width: ripple * 96,
            height: ripple * 96,
            borderRadius: "50%",
            border: `3px solid ${COLORS.accent}`,
            opacity: 1 - ripple,
            boxSizing: "border-box",
          }}
        />
      ) : null}
      <svg
        width={CURSOR_SIZE}
        height={CURSOR_SIZE * 1.4}
        viewBox="0 0 24 34"
        style={{ position: "absolute", left: -2, top: -2, transform: `scale(${1 - press * 0.08})`, transformOrigin: "2px 2px", filter: "drop-shadow(0 3px 5px rgba(0,0,0,0.4))" }}
      >
        <path d="M2 2 L2 27 L8.2 21.4 L12.4 31.5 L16.6 29.7 L12.5 19.8 L21 19.6 Z" fill="#101828" stroke="#FFFFFF" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </ScreenSized>
  );
};

export const Callouts: React.FC<{ z: number }> = ({ z }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <>
      {content.callouts.map((c) => {
        const from = beat(c.fromBeat);
        const to = beat(c.toBeat);
        if (frame < from || frame > to + 6) return null;
        const inn = spring({ frame: frame - from, fps, config: { damping: 16, stiffness: 170 } });
        const out = interpolate(frame, [to, to + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        const k = inn * out;
        const tr = rectByName(c.target);
        const t = { x: tr.x + tr.w / 2, y: tr.y + tr.h };
        const [ox, oy] = c.offset;
        return (
          <ScreenSized key={c.text} x={t.x} y={t.y} z={z} style={{ opacity: k }}>
            <svg style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }} width="1" height="1">
              <line x1={0} y1={0} x2={ox * k} y2={oy * k} stroke={COLORS.accent} strokeWidth={2} />
              <circle cx={0} cy={0} r={6} fill={COLORS.accent} />
            </svg>
            <div
              style={{
                position: "absolute",
                left: ox,
                top: oy,
                transform: `translate(-50%, -50%) scale(${0.85 + 0.15 * k})`,
                whiteSpace: "nowrap",
                fontFamily: FONT,
                fontWeight: 600,
                fontSize: 30,
                color: COLORS.accentInk,
                background: COLORS.accent,
                padding: "11px 24px",
                borderRadius: 999,
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              }}
            >
              {c.text}
            </div>
          </ScreenSized>
        );
      })}
    </>
  );
};

const PAD = 8;

export const Spotlights: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {content.spotlights.map((s) => {
        const from = beat(s.fromBeat);
        const to = beat(s.toBeat);
        const k =
          interpolate(frame, [from, from + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) *
          interpolate(frame, [to, to + 6], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        if (k <= 0) return null;
        const r: Rect = rectByName(s.target);
        return (
          <div
            key={s.target}
            style={{
              position: "absolute",
              left: r.x - PAD,
              top: r.y - PAD,
              width: r.w + PAD * 2,
              height: r.h + PAD * 2,
              borderRadius: 12 + 4,
              boxShadow: `0 0 0 9999px rgba(0,0,0,${0.55 * k}), 0 0 0 3px ${COLORS.accent}, 0 0 8px 8px ${COLORS.accent}66`,
              opacity: 1,
            }}
          />
        );
      })}
    </>
  );
};

export const Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fade = interpolate(frame, [beat(4.6), beat(6.4)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (fade <= 0) return null;
  return (
    <div style={{ position: "absolute", left: 120, top: 330, opacity: fade, fontFamily: FONT, color: COLORS.white }}>
      {content.brand.headline.map((line, i) => {
        const s = spring({ frame: frame - 6 - i * 6, fps, config: { damping: 18, stiffness: 120 } });
        return (
          <div
            key={line}
            style={{
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 1.04,
              letterSpacing: -3,
              opacity: s,
              transform: `translateY(${(1 - s) * 40}px)`,
              color: i === 1 ? COLORS.accent : COLORS.white,
            }}
          >
            {line}
          </div>
        );
      })}
      <div style={{ marginTop: 28, fontSize: 36, fontWeight: 500, color: "#A1A1AA", opacity: interpolate(frame, [26, 40], [0, 1], { extrapolateRight: "clamp" }) }}>
        {content.brand.subline}
      </div>
    </div>
  );
};

export const Backdrop: React.FC<{ pose: Pose }> = ({ pose }) => {
  // glow follows the window at 0.6x for parallax
  const sx = 960 + (720 - pose.cx) * pose.z;
  const sy = 540 + (450 - pose.cy) * pose.z;
  const gx = 960 + (sx - 960) * 0.6;
  const gy = 540 + (sy - 540) * 0.6;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(900px 700px at ${gx}px ${gy}px, ${COLORS.accent}1F, transparent 70%), ${COLORS.backdrop}`,
      }}
    />
  );
};
