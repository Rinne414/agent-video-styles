import { Easing, interpolate, useCurrentFrame } from "remotion";
import { projectAnchor, holdCenter } from "./motion";
import { brand, callout, colors, features, FONT, meta, SAFE, timing, type } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const OUT = Easing.out(Easing.cubic);

/** Screen side for a feature label, chosen from the anchor position at the middle of its hold. */
function sideFor(i: number): "left" | "right" {
  const p = projectAnchor(holdCenter(i), features[i].anchor);
  return p.x < meta.width / 2 ? "left" : "right";
}

const LABEL_W = 560;
const LABEL_GAP = 120;

const Callout = ({ index }: { index: number }) => {
  const frame = useCurrentFrame();
  const f = features[index];
  const start = timing.revealEnd + index * timing.featureLength;
  const local = frame - start;

  const inWindow = interpolate(local, [timing.calloutIn, timing.calloutIn + 4], [0, 1], clamp);
  const outWindow = interpolate(local, [timing.calloutOut, timing.calloutOut + callout.hideFrames], [1, 0], clamp);
  const { x, y, facing } = projectAnchor(frame, f.anchor);
  const facingFade = interpolate(facing, [0.15, 0.3], [0, 1], clamp);
  const vis = Math.min(inWindow, outWindow, facingFade);
  if (vis <= 0) return null;

  const side = sideFor(index);
  const lineP = interpolate(local, [timing.calloutIn, timing.calloutIn + callout.lineFrames], [0, 1], {
    ...clamp,
    easing: OUT,
  });
  const labelP = interpolate(
    local,
    [timing.calloutIn + callout.lineFrames - 4, timing.calloutIn + callout.lineFrames + callout.labelFrames - 4],
    [0, 1],
    { ...clamp, easing: OUT },
  );

  // Label sits in the outer third; a short elbow joins it to the anchor.
  const edgeX = side === "left" ? SAFE : meta.width - SAFE;
  const innerX = side === "left" ? edgeX + LABEL_W : edgeX - LABEL_W;
  const lineY = Math.min(Math.max(y - LABEL_GAP, 330), 640);
  const elbowX = side === "left" ? innerX + 40 : innerX - 40;
  const pts: [number, number][] = [
    [x, y],
    [elbowX, lineY],
    [edgeX, lineY],
  ];
  const lens = [Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]), Math.abs(pts[2][0] - pts[1][0])];
  const total = lens[0] + lens[1];
  const drawn = total * lineP;
  const seg1 = Math.min(drawn, lens[0]) / lens[0];
  const seg2 = Math.max(drawn - lens[0], 0) / lens[1];
  const p1x = pts[0][0] + (pts[1][0] - pts[0][0]) * seg1;
  const p1y = pts[0][1] + (pts[1][1] - pts[0][1]) * seg1;
  const p2x = pts[1][0] + (pts[2][0] - pts[1][0]) * seg2;
  const d = `M ${x} ${y} L ${p1x} ${p1y}` + (seg2 > 0 ? ` L ${p2x} ${lineY}` : "");

  return (
    <div style={{ position: "absolute", inset: 0, opacity: vis }}>
      <svg width={meta.width} height={meta.height} style={{ position: "absolute", inset: 0 }}>
        <path d={d} stroke={colors.ink} strokeWidth={callout.lineWidth} fill="none" strokeLinecap="round" />
        <circle cx={x} cy={y} r={callout.dotRadius} fill={colors.accent} />
        <circle cx={x} cy={y} r={callout.dotRadius + 6} fill="none" stroke={colors.accent} strokeWidth={2} opacity={0.5} />
      </svg>
      <div
        style={{
          position: "absolute",
          top: lineY - 104 + callout.risepx * (1 - labelP),
          [side]: SAFE,
          width: LABEL_W,
          textAlign: side === "left" ? "left" : "right",
          fontFamily: FONT,
          color: colors.ink,
          opacity: labelP,
        }}
      >
        <div style={{ fontSize: type.label.size, fontWeight: type.label.weight, lineHeight: 1.15 }}>{f.label}</div>
        <div style={{ fontSize: type.claim.size, fontWeight: type.claim.weight, opacity: type.claim.opacity, marginTop: 8 }}>
          {f.claim}
        </div>
      </div>
    </div>
  );
};

const Wordmark = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [timing.nameFadeIn, timing.nameFadeIn + 16], [0, 0.85], clamp);
  const lockupP = interpolate(frame, [timing.lockupSettle - 30, timing.lockupSettle - 10], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: SAFE,
        top: SAFE - 20,
        fontFamily: FONT,
        fontSize: type.wordmark.size,
        fontWeight: type.wordmark.weight,
        letterSpacing: type.wordmark.tracking,
        textTransform: "uppercase",
        color: colors.ink,
        opacity: o * (1 - lockupP),
      }}
    >
      {brand.name}
    </div>
  );
};

const Footnote = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [timing.nameFadeIn, timing.nameFadeIn + 16], [0, 0.6], clamp);
  return (
    <div
      style={{
        position: "absolute",
        right: SAFE,
        bottom: SAFE - 40,
        fontFamily: FONT,
        fontSize: type.footnote.size,
        color: colors.ink,
        opacity: o,
      }}
    >
      {brand.footnote}
    </div>
  );
};

const Lockup = () => {
  const frame = useCurrentFrame();
  const nameP = interpolate(frame, [timing.lockupSettle - 40, timing.lockupSettle - 8], [0, 1], { ...clamp, easing: OUT });
  const tagP = interpolate(frame, [timing.lockupSettle - 22, timing.lockupSettle + 6], [0, 1], { ...clamp, easing: OUT });
  if (nameP <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: SAFE + 10,
        textAlign: "center",
        fontFamily: FONT,
        color: colors.ink,
      }}
    >
      <div
        style={{
          fontSize: type.name.size,
          fontWeight: type.name.weight,
          letterSpacing: type.name.tracking,
          lineHeight: 1.05,
          opacity: nameP,
          transform: `translateY(${(1 - nameP) * 14}px)`,
        }}
      >
        {brand.name}
      </div>
      <div
        style={{
          fontSize: type.tagline.size,
          fontWeight: type.tagline.weight,
          letterSpacing: type.tagline.tracking,
          marginTop: 10,
          opacity: tagP * 0.8,
          transform: `translateY(${(1 - tagP) * 10}px)`,
        }}
      >
        {brand.tagline}
      </div>
    </div>
  );
};

const Exposure = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, timing.exposureFade], [1, 0], { ...clamp, easing: Easing.out(Easing.quad) });
  if (o <= 0) return null;
  return <div style={{ position: "absolute", inset: 0, background: "#FFFFFF", opacity: o }} />;
};

export const Overlay = () => (
  <>
    {features.map((_, i) => (
      <Callout key={i} index={i} />
    ))}
    <Wordmark />
    <Footnote />
    <Lockup />
    <Exposure />
  </>
);
