# character-dialogue

Two original, code-drawn mascots talk over a blackboard: **Pip** (curious round robot) asks and **Juno** (calm owl) explains what an API is with the restaurant-waiter analogy. Mouths flap with the TTS audio, expressions change per line, a caption box shows each line, and the board draws a chalk diagram as the talk progresses.

- Style recipe: `skill/references/styles/character-dialogue.md`
- Tool: Remotion 4.0.534 (pinned). 1920x1080, 30 fps, about 50 s.
- Voices: `en-US-AnaNeural` (Pip), `en-US-AndrewNeural` (Juno), generated with Edge TTS and shipped in `assets/audio/`.
- Audio extras are synthesized by `scripts/make_sfx.py` (a "pon" and a quiet chord pad). No third-party art, fonts files or music.

## Run

```
pnpm install
pnpm exec remotion browser ensure   # once, downloads Chrome Headless Shell
pnpm run render                     # writes out/character-dialogue.mp4
pnpm run still                      # out/still.png (frame 300)
pnpm run studio                     # live preview
```

The render is CPU heavy because of the chalk filter on the board (several minutes on a busy machine).

## Edit the content

Everything editable is in `content.json`:

| Key | What it controls |
|---|---|
| `video` | size, fps, lead-in, gap between lines, tail hold |
| `palette` | board, frame, chalk and outline colors |
| `characters` | name, voice, rate and caption/body color per mascot |
| `lines` | the dialogue: speaker, caption `text`, TTS `tts` spelling, `expression` of the speaker and `reaction` of the listener (`normal`, `happy`, `surprised`, `troubled`) |
| `labels`, `bullets`, `topic` | chalk text on the board |
| `board` | when each board item appears: the `line` id plus a frame `delay`; `"sfx": false` silences its "pon" |

Change copy or voices, then regenerate audio and timings:

```
python scripts/build_audio.py        # needs edge-tts and ffprobe; uses ../../skill/scripts/tts.py
```

Timings (`assets/audio/timeline.json`) drive the video length, caption timing and mouth flap, so no scene code changes are needed for a different line length. Captions are limited to two lines at 48 px (about 90 characters). The board diagram itself (table, waiter, kitchen) is code in `src/Board.tsx`.

## Layout

```
src/theme.ts       tokens, content.json + timeline loading, line timing
src/Dialogue.tsx   the composition (board, mascots, caption, audio)
src/Board.tsx      chalk board: write-on text and diagram
src/Pip.tsx, src/Juno.tsx, src/face.tsx   mascot art and face sprites
src/Character.tsx  lip flap, hop, breathing, blink, brightness
src/Caption.tsx, src/Blackboard.tsx
```

## License notes

Remotion requires a paid Company License for for-profit companies with 4 or more people (https://www.remotion.pro/license). Edge TTS is an unofficial client of a Microsoft service; check its terms before commercial use. Pip and Juno are original artwork released with this repo.
