import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C, CLAMP, FONT, H, INOUT, MARGIN, SCENES, TABULAR, TYPE, W, content, prog } from "./theme";
import { Headline, SceneFrame } from "./SceneFrame";

// Plot geometry
const LEFT = 190;
const RIGHT = W - MARGIN;
const TOP = 380;
const BOTTOM = 880;
const PAD = 60;

// Timing (frames inside the scene)
const AXES = 12;
const DRAW_START = 20;
const DRAW_DUR = 60;
const DIM_START = 100;
const PEAK_START = 106;
const DIP_START = 140;

export const LineChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { line } = content;
  const n = line.values.length;
  const xs = line.values.map((_, i) => LEFT + PAD + (i * (RIGHT - LEFT - 2 * PAD)) / (n - 1));
  const ys = line.values.map((v) => BOTTOM - (v / line.yMax) * (BOTTOM - TOP));

  // cumulative length so the head dot can ride the path
  const seg = xs.slice(1).map((x, i) => Math.hypot(x - xs[i], ys[i + 1] - ys[i]));
  const total = seg.reduce((a, b) => a + b, 0);
  const p = prog(frame, DRAW_START, DRAW_DUR, INOUT);
  const drawn = p * total;
  const starts = seg.map((_, i) => seg.slice(0, i).reduce((a, b) => a + b, 0));
  let head = { x: xs[0], y: ys[0] };
  for (let i = 0; i < seg.length; i++) {
    const t = Math.min(1, Math.max(0, (drawn - starts[i]) / seg[i]));
    head = { x: xs[i] + (xs[i + 1] - xs[i]) * t, y: ys[i] + (ys[i + 1] - ys[i]) * t };
    if (t < 1) break;
  }

  const axes = prog(frame, 0, AXES);
  const dim = interpolate(frame, [DIM_START, DIM_START + 10], [1, 0.35], CLAMP);
  const keep = prog(frame, DIM_START, 10);
  const headVisible = frame >= DRAW_START && frame < DIM_START ? 1 : 0;
  const points = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const lastSeg = `${xs[n - 2]},${ys[n - 2]} ${xs[n - 1]},${ys[n - 1]}`;

  const peakP = prog(frame, PEAK_START, 12);
  const dipP = prog(frame, DIP_START, 12);
  const peakIdx = n - 1;
  const dipIdx = line.values.indexOf(Math.min(...line.values));

  return (
    <SceneFrame duration={SCENES.line}>
      <Headline title={line.headline} subtitle={line.subtitle} />
      <AbsoluteFill>
        <svg width={W} height={H} style={{ fontFamily: FONT }}>
          {line.ticks.map((t) => {
            const y = BOTTOM - (t / line.yMax) * (BOTTOM - TOP);
            return (
              <g key={t}>
                <line x1={LEFT} x2={LEFT + (RIGHT - LEFT) * axes} y1={y} y2={y} stroke={C.text} strokeOpacity={0.12} strokeWidth={t === 0 ? 2 : 1} />
                <text x={LEFT - 20} y={y + 8} textAnchor="end" fontSize={TYPE.axis} fontWeight={500} fill={C.text} fillOpacity={0.6 * axes} {...TABULAR}>
                  {t}
                </text>
              </g>
            );
          })}
          {line.months.map((m, i) => (
            <text key={m} x={xs[i]} y={BOTTOM + 44} textAnchor="middle" fontSize={TYPE.axis} fontWeight={500} fill={C.text} fillOpacity={0.6 * axes}>
              {m}
            </text>
          ))}

          <g opacity={dim}>
            <polyline
              points={points}
              fill="none"
              stroke={C.highlight}
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={total}
              strokeDashoffset={total * (1 - p)}
            />
            {xs.map((x, i) => (
              <circle key={i} cx={x} cy={ys[i]} r={6} fill={C.background} stroke={C.highlight} strokeWidth={3} opacity={drawn >= starts[Math.max(0, i - 1)] + (i === 0 ? 0 : seg[i - 1]) - 0.5 ? 1 : 0} />
            ))}
          </g>

          {/* the highlighted last segment returns to full strength after the dim */}
          <polyline points={lastSeg} fill="none" stroke={C.highlight} strokeWidth={6} strokeLinecap="round" opacity={keep} />

          <circle cx={head.x} cy={head.y} r={10} fill={C.highlight} opacity={headVisible} />

          {/* December peak annotation */}
          <g opacity={peakP}>
            <line x1={xs[peakIdx]} y1={ys[peakIdx] - 18} x2={xs[peakIdx]} y2={ys[peakIdx] - 18 - 56 * peakP} stroke={C.highlight} strokeWidth={2} />
            <circle cx={xs[peakIdx]} cy={ys[peakIdx]} r={12} fill={C.highlight} />
            <text x={xs[peakIdx]} y={ys[peakIdx] - 88} textAnchor="end" fontSize={TYPE.label + 4} fontWeight={700} fill={C.highlight} {...TABULAR}>
              {line.peakLabel}
            </text>
          </g>

          {/* summer dip annotation (neutral) */}
          <g opacity={dipP}>
            <line x1={xs[dipIdx]} y1={ys[dipIdx] + 18} x2={xs[dipIdx]} y2={ys[dipIdx] + 18 + 52 * dipP} stroke={C.neutralLight} strokeWidth={2} />
            <circle cx={xs[dipIdx]} cy={ys[dipIdx]} r={9} fill={C.text} />
            <text x={xs[dipIdx]} y={ys[dipIdx] + 108} textAnchor="middle" fontSize={TYPE.label} fontWeight={500} fill={C.text} {...TABULAR}>
              {line.dipLabel}
            </text>
          </g>
        </svg>
      </AbsoluteFill>
    </SceneFrame>
  );
};
