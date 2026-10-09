import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { C, color } from "../theme";
import { AppWindow, Avatar, WINDOW_H } from "../ui/AppWindow";
import { Cursor, EASE_IO, Ripple, useCursor } from "../ui/motion";
import { HEADLINE_END, WIN_LEFT, WIN_TOP } from "./Feature";

const T0 = HEADLINE_END; // card enters
const CLICK = T0 + 30;
const REC_END = 158;
const BTN = { x: WIN_LEFT + 240 + 40, y: WIN_TOP + WINDOW_H - 32 - 72, w: 300, h: 72 };

const fmt = (s: number) => `0:${String(Math.floor(s)).padStart(2, "0")}`;

export const RecordCard: React.FC = () => {
  const frame = useCurrentFrame();
  const recT = interpolate(frame, [CLICK + 4, REC_END], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE_IO });
  const recording = frame >= CLICK + 4;
  const seconds = recT * 60;
  const cursor = useCursor(
    [
      { at: T0 + 8, x: 1620, y: 520 },
      { at: CLICK - 4, x: BTN.x + 150, y: BTN.y + 36 },
      { at: CLICK + 30, x: BTN.x + 150, y: BTN.y + 36 },
      { at: CLICK + 52, x: 1500, y: 640 },
    ],
    CLICK,
  );
  const btnPress = interpolate(frame, [CLICK, CLICK + 4, CLICK + 9], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ampBase = recording ? 1 : 0.12;

  return (
    <>
      <div style={{ position: "absolute", left: WIN_LEFT, top: WIN_TOP }}>
        <AppWindow title={C.ui.appTitle} delay={T0}>
          <div style={{ height: 380, borderRadius: 16, background: "linear-gradient(160deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))", border: `1px solid ${color.cardBorder}`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Avatar initials="MC" size={150} />
            {recording ? (
              <div style={{ position: "absolute", left: 24, top: 22, display: "flex", alignItems: "center", gap: 10, fontWeight: 700, fontSize: 24 }}>
                <div style={{ width: 16, height: 16, borderRadius: "50%", background: color.accent, opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0.35 }} />
                REC
              </div>
            ) : null}
            <div style={{ position: "absolute", left: 40, right: 40, bottom: 28, height: 90, display: "flex", alignItems: "center", gap: 6 }}>
              {Array.from({ length: 56 }, (_, i) => {
                const wave = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.35 + i * 0.7) * Math.cos(i * 0.31 + frame * 0.11));
                return <div key={i} style={{ flex: 1, height: `${Math.max(6, wave * 100 * ampBase)}%`, borderRadius: 4, background: recording ? color.accent : "rgba(255,255,255,0.25)" }} />;
              })}
            </div>
          </div>
          <div style={{ position: "absolute", left: 40 + 240, bottom: 32, right: 40, height: BTN.h, display: "flex", alignItems: "center", gap: 28 }}>
            <div
              style={{
                width: BTN.w,
                height: BTN.h,
                borderRadius: 999,
                background: color.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 28,
                fontVariantNumeric: "tabular-nums",
                transform: `scale(${btnPress})`,
              }}
            >
              {recording ? `${fmt(seconds)} / 1:00` : C.ui.recordCta}
            </div>
            <div style={{ flex: 1, height: 10, borderRadius: 999, background: "rgba(255,255,255,0.10)", overflow: "hidden" }}>
              <div style={{ width: `${recT * 100}%`, height: "100%", background: color.accent }} />
            </div>
          </div>
        </AppWindow>
      </div>
      {frame >= T0 + 8 ? (
        <>
          <Ripple x={BTN.x + 150} y={BTN.y + 36} at={CLICK} />
          <Cursor x={cursor.x} y={cursor.y} scale={cursor.pulse} />
        </>
      ) : null}
    </>
  );
};
