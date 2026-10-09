# Audio: voiceover, captions, music, loudness

Tool-agnostic. Every command below was run here (Windows 11, ffmpeg 8.1, edge-tts 7.2.8) unless marked [not run here].

## Voiceover or music-only?

- Voiceover: explainers, tutorials, product demos, anything that teaches. Narration drives the timeline.
- Music-only (+ SFX): mood pieces, kinetic typography, logo reveals, loops, gallery previews. Captions/on-screen text carry the message.
- Silent brief (no music, no voice): render silent. Sound-related quality-bar items become N/A; keep any hit list in `content.json` so sound can be added later. No tested recipe for synthesized whoosh/SFX exists here; narration-only or the tested sine pad below are the fallbacks.
- Muted autoplay (social, web gallery): treat captions as mandatory either way.

## tts.py: usage and the timeline contract

Script: `skill/scripts/tts.py` (Python 3.10+, needs `pip install edge-tts` or `uv run --with edge-tts ...` [uv form not run here], ffprobe on PATH).

```bash
python skill/scripts/tts.py script.json --out-dir audio     # writes audio/<id>.mp3 + audio/timeline.json
python skill/scripts/tts.py --list-voices zh-CN             # filter by locale prefix
```

Input `script.json` (per-segment `voice` / `rate` override the top-level ones; optional `pitch`, `volume`):

```json
{"voice": "en-US-AndrewNeural", "rate": "+0%",
 "segments": [{"id": "s1", "text": "Hello, world."}]}
```

Output `timeline.json` (times in ms, relative to the start of that segment's mp3):

```json
{"voice": "en-US-AndrewNeural", "segments": [
  {"id": "s1", "file": "s1.mp3", "duration_ms": 3048,
   "words": [{"text": "Hello", "start_ms": 112, "end_ms": 400}]}]}
```

Facts verified by running it:
- `duration_ms` comes from ffprobe on the mp3, and is longer than the last word's `end_ms` (3048 vs 2675 ms: trailing silence). Place segments back to back using `duration_ms`, not the last `end_ms`.
- edge-tts 7.x defaults to sentence boundaries; tts.py requests `boundary="WordBoundary"`. Offsets are 100 ns ticks (divide by 10 000).
- English: one event per word, punctuation is not a separate event ("Hello," -> `Hello`).
- Chinese (zh-CN): the service returns short words/phrases of 1-3 characters, e.g. `大家|好|今天|我们|来讲|一|讲|傅里|叶|变换`. Segmentation is imperfect (`傅里|叶`); treat units as timing anchors, not linguistic words. Units keep inner spaces (`25 分钟`), punctuation is dropped, and a numeral is one unit. Rebuild display text from the original script with the recipe below.
- If the machine's DNS is odd (VPN adapter), aiodns raised "Could not contact DNS servers"; tts.py uses the OS resolver to avoid it.
- Edge TTS is an unofficial client of Microsoft's online service: fine for prototyping; check Microsoft's terms before commercial use. Needs internet.

## Recommended voices (from `--list-voices`)

| Locale | Voice | Notes |
|--------|-------|-------|
| en-US | `en-US-AndrewNeural` (M), `en-US-AvaNeural` (F) | warm, clear; default for explainers |
| en-US | `en-US-ChristopherNeural` (M), `en-US-EmmaNeural` (F) | authority / cheerful |
| en-US | `en-US-AnaNeural` (F) | child-like and slow: ~110 wpm (13 words took 7.1 s), ~0.8 s trailing silence; use rate +10..+15% |
| zh-CN | `zh-CN-YunxiNeural` (M), `zh-CN-XiaoxiaoNeural` (F) | lively / warm; both tested |
| zh-CN | `zh-CN-YunyangNeural` (M) | professional, news-like |
| ja-JP | `ja-JP-NanamiNeural` (F), `ja-JP-KeitaNeural` (M) | the only two ja-JP voices listed [timings not tested for ja] |

Dialogue: `tts.py` honors a per-segment `"voice"`, so two speakers go in ONE `script.json` (each segment with its own `voice`) and produce ONE `timeline.json`; no merge step is needed. Keep a `speaker` field in your own content file keyed by segment id. Length budget: sum of `duration_ms` + ~200 ms per line + lead + tail.

Adjust speed with `"rate": "-10%"` .. `"+15%"`. Do not exceed about +20%.

## Pacing and caption limits

- English: 150-170 words per minute (about 2.5-2.8 words/s). Measured: `en-US-AndrewNeural` at +0% ran about 2.4 words/s (137 words = 56.9 s), so words = (target s - 1.5 s tail - 0.15 s x segments) x 2.4. Chinese: 4-5.5 characters/s. Leave 0.3-0.6 s between sentences/segments.
- Caption line: at most ~42 Latin characters or ~14-16 CJK characters, 1-2 lines, at least 1 s on screen. Budget for a two-line caption at 48 px on 1080p (box about 1280 px wide): about 88 Latin characters total (~46 per line); split longer lines into two segments.
- Keep segments to one idea (1-2 sentences, under ~12 s) so a re-render only changes one mp3.

## CJK caption recipe

Map TTS units back onto the original script by character order, then chunk at punctuation (adapted from `templates/card-explainer/scripts/align.mjs`; `templates/karaoke-caption-short/src/chunks.ts` is a clause-based variant):

```js
const PUNCT = /[，。？！：；、,.?!:;]/;
function charTimes(script, words) {                 // seconds per character index of `script`
  const t = new Array(script.length).fill(null), starts = new Set(); let p = 0;
  for (const w of words) {
    const cs = [...w.text]; let first = true;
    cs.forEach((ch, k) => {
      while (p < script.length && script[p] !== ch) p++;   // skips punctuation and spaces
      if (p >= script.length) return;
      if (first) starts.add(p); first = false;
      t[p] = (w.start_ms + (w.end_ms - w.start_ms) * (k / cs.length)) / 1000; p++;
    });
  }
  let next = words.at(-1).end_ms / 1000;            // punctuation takes the NEXT known time
  for (let i = script.length - 1; i >= 0; i--) t[i] === null ? t[i] = next : next = t[i];
  t.starts = starts; return t;                       // starts = unit boundaries, the only legal cut points
}
```
Chunking rules: split the script at `PUNCT`; merge clauses under ~4-6 characters into the next one; split a clause over 14-16 characters at the nearest unit start (`t.starts`), never mid-unit; a chunk ends where the next begins (last one at the segment end). Because the TTS unit boundaries are unpredictable (1-3 characters), any emphasised or highlighted term must equal whole TTS units; read `timeline.json` to pick valid ones. `@remotion/captions` grouping is optional and breaks on CJK clause boundaries.

## English caption chunking

Latin text has word-level units, so chunk by clause, not by character mapping. [Not run here as written; the idea was verified in a report.] TTS drops punctuation, so run it on caption tokens taken from the original script text, each carrying its word's times (the next section). Break at punctuation, split any clause over ~38 characters at the most balanced word boundary (a greedy fill leaves orphans like "a lot of | tiny raindrops"), merge pieces under ~8 characters into a neighbor:

```js
function chunk(words, max = 38) {                      // words: caption tokens [{text (with punctuation),start_ms,end_ms}]
  const out = []; let cur = [];
  const flush = () => { if (cur.length) out.push(cur); cur = []; };
  for (const w of words) { cur.push(w); if (/[.,;:?!]$/.test(w.text)) flush(); } 
  flush();
  return out.flatMap(c => {
    const len = a => a.map(w => w.text).join(" ").length;
    if (len(c) <= max) return [c];
    let best = 1, diff = 1e9;                           // most balanced split
    for (let k = 1; k < c.length; k++) { const d = Math.abs(len(c.slice(0, k)) - len(c.slice(k))); if (d < diff) { diff = d; best = k; } }
    return [c.slice(0, best), c.slice(best)];
  });
}
```
A chunk shows from its first word's `start_ms` to the next chunk's first `start_ms`.

## Speech text vs caption text

TTS must hear "C D N" but the caption must read "CDN" (same for symbols: speak "percent", show "%"). Store both per segment and map by tokens; `content.json` shape:

```json
{"segments": [{"id": "s1", "speech": "A C D N serves files from nearby.", "caption": "A CDN serves files from nearby.",
               "merge": [[1, 3]]}]}
```
Feed `speech` to `tts.py`. TTS returns word units `A | C | D | N | serves ...`. Split `caption` on whitespace; each `merge` range `[first, last]` (indexes into the TTS words) collapses those words into one caption token whose time span runs from the first word's `start_ms` to the last word's `end_ms`. Throw if the caption token count after merging differs from the number of TTS word groups, so a drifted script fails loudly.

## Hitting a target length

Measure before building: sum of `duration_ms` plus gaps. Rules of thumb at rate `+0%`: Chinese ~120 characters is about 24 s; English about 150 wpm. Rates of +5..+10% for shorts can leave a 30 s brief at 22-24 s, so use rate `-5%..+0%`, 0.3-0.5 s gaps between segments, and add framing sentences (hook, "remember this", summary, outro) to reach longer targets. A 170-character article gave about 35 s.

## Caption styles

| Style | How | Best for |
|-------|-----|----------|
| Word highlight (karaoke) | full line visible; highlight the word active between `start_ms` and `end_ms` | tutorials, accessibility |
| Chunked 2-4 words | show a few words at a time, advance on the first word's `start_ms` | short-form vertical video |
| Sentence | one caption per segment, shown for the segment's `duration_ms` | calm explainers, documentary |

Convert to absolute times by adding the segment's start offset (sum of earlier `duration_ms` plus gaps).

## Music and SFX sourcing

- Check the licence of every track and keep the source URL: Pixabay Music/SFX (Pixabay Content Licence, free, no attribution required), YouTube Audio Library (per-track terms), Free Music Archive (per-track CC), Kevin MacLeod / incompetech (CC BY 4.0, attribution required), freesound.org (per-file CC0/CC BY) [terms as I know them, not re-checked here].
- Code-synthesized music keeps everything licence-free: ffmpeg `sine`/`anoisesrc` + `amix`, or Python generating a WAV. Tested pad: `ffmpeg -f lavfi -i "sine=f=220:d=12" -f lavfi -i "sine=f=277:d=12" -f lavfi -i "sine=f=330:d=12" -filter_complex "[0][1][2]amix=inputs=3:normalize=0,volume=0.5,afade=t=in:d=1,afade=t=out:st=10:d=2" -ac 2 music.mp3`.
- Never commit third-party music you cannot redistribute into an open-source repo; link or document it.

## Ducking music under voice (tested)

`voice.wav` and `music.mp3` in, voice-keyed sidechain compression on the music:

```bash
ffmpeg -y -i voice.wav -i music.mp3 -filter_complex \
"[0:a]aformat=sample_rates=48000:channel_layouts=stereo,asplit=2[voice][sc];\
[1:a]aformat=sample_rates=48000:channel_layouts=stereo[bgm];\
[bgm][sc]sidechaincompress=threshold=0.03:ratio=8:attack=30:release=500[ducked];\
[voice][ducked]amix=inputs=2:duration=first:normalize=0[mix]" -map "[mix]" mix.wav
```

Measured: music-only part -31.5 dB mean vs -22.8 dB where voice plays (the mix is voice-dominated). Lower `threshold` or raise `ratio` for stronger ducking. Build `voice.wav` from segments by placing each mp3 at its timeline offset (`adelay`) or by `concat` plus `apad` to the video length. Pre-mix music at about -20 dB before the sidechain for mostly-quiet beds.

## Loudness: -14 LUFS for social

Measure, then apply two-pass linear normalisation (values from the measurement go in `measured_*`):

```bash
ffmpeg -hide_banner -nostats -i mix.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null -
ffmpeg -y -i mix.wav -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=-21.84:measured_TP=-6.27:measured_LRA=6.50:measured_thresh=-32.26:offset=0.80:linear=true" -ar 48000 final.wav
```

Re-measuring `final.wav` gave integrated -14.67 LUFS, true peak -1.50 dBTP (within tolerance of -14). Skip the linear flag and loudnorm falls back to dynamic mode, which colours the sound. Mux onto video without re-encoding the picture: `ffmpeg -i video.mp4 -i final.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest out.mp4`. Then run `skill/scripts/inspect_video.py` to confirm audio/video durations match.

Other targets: -16 LUFS podcasts/web gallery, -23 LUFS broadcast (EBU R128) [not tested].
