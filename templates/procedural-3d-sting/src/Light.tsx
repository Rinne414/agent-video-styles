import React from "react";
import { Beam } from "./Beam";
import { Rig } from "./rig";
import { C, T, deg, ease, easeOut } from "./theme";
import { Vector3 } from "three";

const SPECTRUM = C.colors.spectrum;
const BEAM_START_X = -7.5;
const FAN_LENGTH = 16;

/** Brightness spike on the hit frame: instant rise, eased fall. */
export const hitEnvelope = (frame: number) => {
  const { hitFlashFrames: flash, hitDecayFrames: decay } = C.motion;
  if (frame < T.hit) return 0;
  if (frame < T.hit + flash) return 1;
  return ease(frame, [T.hit + flash, T.hit + flash + decay], [1, 0]);
};

/** Incoming beam, light inside the glass, the spectrum fan, and the recombined line. */
export const Light: React.FC<{ frame: number; rig: Rig }> = ({ frame, rig }) => {
  const { entry, exit } = rig;
  const fade = ease(frame, T.beamFadeOut, [1, 0]);
  const hit = hitEnvelope(frame);

  const travel = easeOut(frame, T.beamTravel);
  const inLength = Math.max(0, (entry.x - BEAM_START_X) * travel);
  const inside = new Vector3().subVectors(exit, entry);
  const insideAngle = Math.atan2(inside.y, inside.x);
  const insideOn = frame >= T.hit ? 1 : 0;

  const grow = easeOut(frame, T.sweep);
  const recombine = ease(frame, T.recombine, [1, 0]);
  const sweepAngle = ease(frame, T.sweep, C.motion.sweepAngleDeg.map(deg)) ;
  const spread = easeOut(frame, T.fanOpen, [0, deg(C.motion.fanSpreadDeg)]) * recombine;
  const center = sweepAngle * recombine;
  const lineGlow = ease(frame, [T.recombine[0] + 10, T.recombine[1]], [0, 1]);
  const bandIntensity = (0.5 - 0.22 * (1 - recombine)) * fade;

  return (
    <>
      <Beam
        from={new Vector3(BEAM_START_X, entry.y, entry.z)}
        angle={0}
        length={inLength}
        width={0.22}
        color="#ffffff"
        intensity={(0.85 + 0.6 * hit) * fade}
        startFade={0.4}
        endPow={0}
        head={1.6}
      />
      <Beam
        from={new Vector3(BEAM_START_X, entry.y, entry.z)}
        angle={0}
        length={inLength}
        width={0.9}
        color="#9fb0ff"
        intensity={0.2 * fade}
        soft={2.6}
        startFade={0.5}
        endPow={0.7}
      />
      <Beam
        from={entry}
        angle={insideAngle}
        length={inside.length() * insideOn}
        width={0.2}
        color="#ffffff"
        intensity={(1.1 + 0.8 * hit) * fade}
        endPow={0}
      />
      {SPECTRUM.map((color, i) => {
        const angle = center + (3 - i) * (spread / 6);
        const length = FAN_LENGTH * grow;
        return (
          <React.Fragment key={color}>
            <Beam from={exit} angle={angle} length={length} width={0.34} color={color} intensity={bandIntensity} startFade={0.02} />
            <Beam from={exit} angle={angle} length={length} width={1.1} color={color} intensity={0.12 * fade} soft={2.6} startFade={0.25} endPow={0.8} />
          </React.Fragment>
        );
      })}
      <Beam from={exit} angle={0} length={FAN_LENGTH * grow} width={0.2} color="#ffffff" intensity={0.55 * lineGlow * fade} startFade={0.02} endPow={0.3} />
    </>
  );
};
