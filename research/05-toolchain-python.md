# 05 - Python toolchain log (Manim, TTS, video inspection)

Date: 2026-10-10. Machine: Windows 11, Python 3.12.9 (`python`), uv 0.11, ffmpeg/ffprobe 8.1, edge-tts 7.2.8, Manim CE 0.22.0, MiKTeX 24.1 (winget, user scope).
Scratch: `...\scratchpad\py-smoke` (test videos, TTS output, contact sheets).

## A. Scripts (skill/scripts/)

| Script | Lines | Tested with |
|--------|-------|-------------|
| `tts.py` | ~125 | en-US (Andrew), zh-CN (Yunxi, Xiaoxiao per-segment override), `--list-voices zh-CN / en-US / ja-JP` |
| `inspect_video.py` | ~150 | 30 s 1080p testsrc+sine (exit 0), black+short audio (exit 1, 4 warnings), static red (exit 1), Manim renders (exit 0), mp4 from make_preview |
| `make_preview.py` | ~85 | 30 s 1080p -> 1280x720, 1.00 MB -> 0.64 MB, webp poster 10.6 KB |

### edge-tts word boundaries
- Source: `edge_tts/communicate.py`. `Communicate(..., boundary="SentenceBoundary")` is the default in 7.x; pass `boundary="WordBoundary"` to get per-word events (`chunk["type"] == "WordBoundary"`, `offset`/`duration` in 100 ns ticks, `text`).
- English output: `Hello 112-400 ms, this 775-925, ...` one event per word, punctuation stripped.
- Chinese output: `大家 | 好 | 今天 | 我们 | 来讲 | 一 | 讲 | 傅里 | 叶 | 变换`: 1-3 char units, some mis-segmented, no punctuation events.
- mp3 `duration_ms` (ffprobe) 3048 vs last word end 2675: trailing silence ~0.37 s.

### Errors and fixes
1. `import edge_tts` from inside `site-packages/edge_tts` -> circular-import error (`edge_tts/typing.py` shadows stdlib). Only caused by cwd; not a real bug.
2. `Cannot connect to host speech.platform.bing.com:443 ... [Could not contact DNS servers]` although curl/OS resolved fine. Cause: aiodns 4.0.4 / c-ares with a VPN adapter (SurfsharkWireGuard) DNS list. Fix: pass `connector=aiohttp.TCPConnector(resolver=ThreadedResolver())` to `Communicate` and `list_voices` (OS resolver). Worked immediately.
3. `SyntaxWarning: invalid escape sequence '\:'` from my own drawtext string -> double the backslash.
4. Contact sheet via `fps=` showed shifted timestamps (output timeline) and only 11 frames. Replaced with `select='gte(t,step/2+step*selected_n)'` which keeps source pts; `drawtext=text='%{pts\:hms}'` then shows true times, 12/12 frames.
5. `blackdetect` defaults (pic_th 0.98) flagged a Manim scene (black background, small shapes) as 6.3 s black. Now `pic_th=0.9999:pix_th=0.08`; Manim OK, all-black clip still flagged.

## B. Manim

- Decision: uv project per template (`templates/math-manim/` with its own `pyproject.toml`, `uv.lock`, `.python-version` = 3.12) rather than `uv tool install`, so scenes can import manim and versions are locked. Template folder NOT created here; only a throwaway `templates/_smoke-manim`.
- `uv init --bare --name smoke-manim --python 3.12; uv add manim` (10 s). Unpinned, uv resolved Python 3.14 (worked, but `uv python pin 3.12` is recommended; re-render on 3.12.9 OK, manim 0.22.0, manimpango 0.7.0, pycairo 1.29.2).
- Scene (Text, CJK Text with "Microsoft YaHei", Circle->Square Transform, Axes + plot of x^2, no numbers): `uv run manim render scene.py Smoke -r 1920,1080 --fps 30 --media_dir media` -> 1920x1080 30 fps h264, 8.5 s, 0.28 MB, 11 s render. Vertical `-r 1080,1920 -o Smoke_v.mp4` -> 1080x1920, output folder `1920p30`.
- Frame review (contact sheet): CJK text and shapes correct; "Manim smoke test" renders in serif default font.
- Path with spaces (`<repo>\templates\_smoke-manim`): rendered fine. Folder deleted afterwards (confirmed `Test-Path` False).
- Without LaTeX, `Axes(...)` with numbers or `MathTex` would need latex; avoided in the first scene.
- Narration: `narr_scene.py` with `add_sound` + `wait(duration_ms/1000 - run)`: audio 6.98 s -> MP4 7.04 s, AAC 48 kHz stereo, inspect_video OK.

### LaTeX (success)
- `winget search MiKTeX` -> `MiKTeX.MiKTeX 25.12`. `winget install --id MiKTeX.MiKTeX --scope user --silent ...` exited 20: already installed (24.1, `%LOCALAPPDATA%\Programs\MiKTeX`). Not on PATH in either shell: `latex`/`dvisvgm` not found; Manim then died with `FileNotFoundError: [WinError 2]` (cryptic).
- `initexmf --set-config-value "[MPM]AutoInstall=1"` (no output = OK; `--get-config-value` is not a valid option).
- Rendered via PowerShell with `$env:Path = "$env:LOCALAPPDATA\Programs\MiKTeX\miktex\bin\x64;$env:Path"`: `MathTex(r"e^{i\pi}+1=0")` -> `TransformMatchingTex` -> `\int_0^1 x^2 dx = 1/3`, plus `Axes.add_coordinates()` numbers; 1080p30, 4 animations, 11 s wall time, no GUI prompt. Frames checked visually.
- Git Bash `export PATH="$LOCALAPPDATA/..."` produced a mixed `C:\...:/` path and failed; use PowerShell or `/c/Users/<user>/AppData/Local/...`. I did not modify the persistent user PATH.

## C. Audio
- ducking: sidechaincompress (threshold 0.03, ratio 8, attack 30, release 500) + `amix normalize=0`; mean volume of mix 0-0.9 s -31.5 dB vs 2-3 s -22.8 dB.
- loudnorm one-pass dynamic: input -21.84 LUFS, TP -6.27; two-pass linear with measured values -> -14.67 LUFS, TP -1.50 (re-measured).
- Mux onto 1080p mp4 with `-c:v copy -c:a aac` OK.

## Open items
- ja-JP word timings not tested; CJK in `MathTex` (xelatex) not tested; Noto Sans SC not installed/checked; macOS/Linux install commands untested.
- Edge TTS depends on internet and an unofficial endpoint.
