import React from "react";
import { AbsoluteFill, Sequence, interpolate, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { Blackboard } from "./Blackboard";
import { Board } from "./Board";
import { Caption } from "./Caption";
import { Character } from "./Character";
import { AUDIO, BOARD_SFX, BOARD_START, FPS, LINES, TOTAL_FRAMES } from "./theme";

const BGM_FADE_FRAMES = 45;

export const Dialogue: React.FC = () => (
  <AbsoluteFill>
    <Blackboard />
    <Board />
    <Character id="pip" />
    <Character id="juno" />
    <Caption />
    {LINES.map((l) => (
      <Sequence key={l.id} from={l.startFrame} durationInFrames={l.audioFrames + 2} premountFor={FPS}>
        <Audio src={staticFile(`audio/${l.file}`)} />
      </Sequence>
    ))}
    {BOARD_SFX.map((item) => (
      <Sequence key={item} from={BOARD_START[item]} durationInFrames={FPS} premountFor={FPS}>
        <Audio src={staticFile("sfx/pon.wav")} volume={AUDIO.sfxVolume} />
      </Sequence>
    ))}
    <Audio
      src={staticFile("music/pad.mp3")}
      volume={(f) =>
        AUDIO.bgmVolume *
        interpolate(f, [0, BGM_FADE_FRAMES, TOTAL_FRAMES - BGM_FADE_FRAMES, TOTAL_FRAMES], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  </AbsoluteFill>
);
