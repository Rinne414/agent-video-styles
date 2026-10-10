import React from "react";
import { interpolate, spring, useVideoConfig } from "remotion";
import { C, CardData, FONT_MONO, FONT_SANS, MOTION, T } from "./theme";

const PANEL_W = 1080 - 2 * T.margin;
const border = `2px solid ${C.ink}${T.borderAlpha}`;

const useEnter = (f: number, delay = 0) => {
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: MOTION.titleSpring });
  return { y: (1 - p) * MOTION.titleRise, opacity: Math.min(1, Math.max(0, p * 1.6)) };
};

const Panel: React.FC<{
  f: number;
  top: number;
  height: number;
  sample?: string;
  children: React.ReactNode;
}> = ({ f, top, height, sample, children }) => {
  const e = useEnter(f);
  return (
    <div
      style={{
        position: "absolute",
        left: T.margin,
        top,
        width: PANEL_W,
        height,
        boxSizing: "border-box",
        background: C.white,
        border,
        borderRadius: T.radius,
        padding: "0 48px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
        transform: `translateY(${e.y}px)`,
        opacity: e.opacity,
        fontFamily: FONT_MONO,
        color: C.ink,
      }}
    >
      {sample ? (
        <div
          style={{
            position: "absolute",
            right: 36,
            top: 22,
            fontFamily: FONT_SANS,
            fontSize: 28,
            fontWeight: 500,
            color: `${C.ink}A6`,
          }}
        >
          {sample}
        </div>
      ) : null}
      {children}
    </div>
  );
};

const Dot: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: C.accent, flex: "none" }} />
);

const Mark: React.FC<{ ok: boolean }> = ({ ok }) => (
  <svg
    width={56}
    height={56}
    viewBox="0 0 56 56"
    fill="none"
    strokeWidth={6}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flex: "none" }}
  >
    {ok ? (
      <path d="M10 29L23 42L46 14" stroke={C.accent} />
    ) : (
      <path d="M14 14L42 42M42 14L14 42" stroke={`${C.ink}80`} />
    )}
  </svg>
);

const clamp01 = (f: number, a: number, b: number) =>
  interpolate(f, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

type V = { card: CardData; f: number };

export const Visual: React.FC<V> = ({ card, f }) => {
  const v = card.visual as any;
  const top = card.title.length > 2 ? 800 : 700;
  const common = { f, sample: v.sample as string };
  const issueEnter = useEnter(f, MOTION.visualDelay);
  switch (v.type) {
    case "log":
      return (
        <Panel {...common} top={top} height={400}>
          {(v.lines as string[]).map((l) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 500 }}>
              <Dot />
              {l}
            </div>
          ))}
        </Panel>
      );
    case "versus": {
      const u = clamp01(f, 14, 30);
      const verb = (v.good as string).split(" ")[0];
      const rest = (v.good as string).slice(verb.length);
      return (
        <Panel {...common} top={top} height={440}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 50, fontWeight: 500, color: `${C.ink}8C` }}
          >
            <Mark ok={false} />
            <span style={{ textDecoration: "line-through" }}>{v.bad}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 50, fontWeight: 500 }}>
            <Mark ok />
            <span>
              <span style={{ position: "relative", display: "inline-block" }}>
                {verb}
                <span
                  style={{ position: "absolute", left: 0, bottom: -4, height: 8, width: `${u * 100}%`, background: C.accent }}
                />
              </span>
              {rest}
            </span>
          </div>
        </Panel>
      );
    }
    case "meter": {
      const n = (v.text as string).length;
      const t = clamp01(f, 8, 30);
      const fill = t * (n / v.limit);
      const shown = Math.round(t * n);
      return (
        <Panel {...common} top={top} height={500}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 20, fontFamily: FONT_SANS }}>
            <span style={{ fontSize: 180, fontWeight: 800, color: C.accent, lineHeight: 1, letterSpacing: "-0.02em" }}>
              {shown}
            </span>
            <span style={{ fontSize: 48, fontWeight: 500 }}>/ {v.limit} 字符</span>
          </div>
          <div style={{ position: "relative", height: 28, borderRadius: 14, background: `${C.ink}1A` }}>
            <div
              style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, borderRadius: 14, background: C.accent }}
            />
            <div style={{ position: "absolute", right: 0, top: -12, width: 6, height: 52, borderRadius: 3, background: C.ink }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 500 }}>{v.text}</div>
        </Panel>
      );
    }
    case "message":
      return (
        <Panel {...common} top={top} height={500}>
          <div style={{ fontSize: 44, fontWeight: 500 }}>{v.subject}</div>
          <div style={{ display: "flex", gap: 24 }}>
            <div style={{ width: 8, borderRadius: 4, background: C.accent, flex: "none" }} />
            <div style={{ fontSize: 38, fontWeight: 500, lineHeight: 1.5 }}>
              {(v.body as string[]).map((l) => (
                <div key={l}>{l}</div>
              ))}
            </div>
          </div>
        </Panel>
      );
    case "timeline":
      return (
        <Panel {...common} top={top} height={500}>
          <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 56 }}>
            <div style={{ position: "absolute", left: 10, top: 20, bottom: 20, width: 4, background: `${C.ink}1A` }} />
            {(v.commits as string[]).map((c) => (
              <div
                key={c}
                style={{ position: "relative", display: "flex", alignItems: "center", gap: 28, fontSize: 44, fontWeight: 500 }}
              >
                <Dot size={24} />
                {c}
              </div>
            ))}
          </div>
        </Panel>
      );
    case "issue":
      return (
        <>
          <Panel {...common} top={top} height={330}>
            <div style={{ fontSize: 48, fontWeight: 500 }}>{v.subject}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 44, fontWeight: 500 }}>
              {v.footer}
              <span style={{ background: C.ink, color: C.white, borderRadius: 16, padding: "6px 26px" }}>{v.issue}</span>
            </div>
          </Panel>
          {card.cta ? (
            <div
              style={{
                position: "absolute",
                left: T.margin,
                top: top + 330 + 70,
                width: T.ctaW,
                height: T.ctaH,
                borderRadius: T.ctaH / 2,
                background: C.accent,
                color: C.ink,
                fontFamily: FONT_SANS,
                fontSize: 40,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `translateY(${issueEnter.y}px)`,
                opacity: issueEnter.opacity,
              }}
            >
              {card.cta}
            </div>
          ) : null}
        </>
      );
    default:
      return null;
  }
};
