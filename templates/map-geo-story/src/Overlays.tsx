import { Easing, interpolate } from "remotion";
import { outro, text, theme, type } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const haloShadow = `0 0 6px ${theme.ocean}, 0 0 6px ${theme.ocean}, 0 0 12px ${theme.ocean}`;
const ENTER_RISE = 8;
const SCRIM_TOP = 300;
const SCRIM_BOTTOM = 150;
const scrim = { position: "absolute", left: 0, right: 0, pointerEvents: "none" } as const;

export const TitleBlock = ({ frame }: { frame: number }) => {
  const kickerT = interpolate(frame, [6, 22], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const titleT = interpolate(frame, [12, 30], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ ...scrim, top: 0, height: SCRIM_TOP, background: `radial-gradient(ellipse 1300px ${SCRIM_TOP}px at 0% 0%, ${theme.scrim} 50%, transparent 100%)` }} />
      <div style={{ ...scrim, bottom: 0, height: SCRIM_BOTTOM, background: `radial-gradient(ellipse 1700px ${SCRIM_BOTTOM}px at 0% 100%, ${theme.scrim} 50%, transparent 100%)` }} />
      <div
        style={{
          position: "absolute",
          left: theme.safe,
          top: theme.safe,
          opacity: kickerT,
          transform: `translateY(${(1 - kickerT) * ENTER_RISE}px)`,
          color: theme.highlight,
          fontSize: type.kicker.size,
          fontWeight: type.kicker.weight,
          letterSpacing: type.kicker.tracking,
          textShadow: haloShadow,
        }}
      >
        {text.kicker}
      </div>
      <div
        style={{
          position: "absolute",
          left: theme.safe,
          top: theme.safe + 48,
          opacity: titleT,
          transform: `translateY(${(1 - titleT) * ENTER_RISE}px)`,
          color: theme.text,
          fontSize: type.title.size,
          fontWeight: type.title.weight,
          letterSpacing: -1,
          textShadow: haloShadow,
        }}
      >
        {text.title}
      </div>
      <div
        style={{
          position: "absolute",
          left: theme.safe,
          bottom: theme.safe - 12,
          opacity: 0.7,
          color: theme.text,
          fontSize: type.source.size,
          fontWeight: type.source.weight,
          textShadow: haloShadow,
        }}
      >
        {text.source}
      </div>
    </>
  );
};

export const Outro = ({ frame }: { frame: number }) => {
  const t = interpolate(frame, [outro.from, outro.settleBy], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  if (t <= 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: theme.safe,
        bottom: theme.safe + 56,
        padding: "22px 32px",
        background: theme.panel,
        borderLeft: `6px solid ${theme.highlight}`,
        borderRadius: 6,
        opacity: t,
        transform: `translateY(${(1 - t) * 12}px)`,
        color: theme.text,
        fontSize: type.outro.size,
        fontWeight: type.outro.weight,
        lineHeight: 1.25,
      }}
    >
      {text.outro.map((line) => (
        <div key={line}>{line}</div>
      ))}
    </div>
  );
};
