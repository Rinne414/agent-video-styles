import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors, fontFamily, layout, progress, rowsCenter, sizes, tagline, timing } from "../theme";

/** Scene 5: the tagline slides in from the right beside the settled badge. */
export const Tagline = () => {
  const frame = useCurrentFrame();
  const p = progress(frame, timing.taglineStart, timing.taglineFrames);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: layout.taglineX,
          top: rowsCenter.y - 48,
          height: 96,
          display: "flex",
          alignItems: "center",
          fontFamily,
          fontWeight: 500,
          fontSize: sizes.taglinePx,
          color: colors.accentLight,
          whiteSpace: "nowrap",
          opacity: p,
          transform: `translateX(${interpolate(p, [0, 1], [240, 0])}px)`,
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
