# Storyboard: Morning Quest (pixel-retro)

18 s, 1080x1920, 30 fps = 540 frames. Implied 120 BPM: 1 beat = 15 frames, 36 beats. Logical canvas 270x480 scaled 4x. Silent. Every scene boundary and every event below sits on a multiple of 15 frames (or the half-beat 7/8 for sprite swaps). Scene frames come from `content.json` `timing`.

Layout (logical px): HUD y 56-76 (level + XP bar), quest dialog box y 88-128, stage y 140-300, ground from y 300, checklist y 348, beat pips y 400. Nothing important in the top 56 or below y 380 (platform UI zones).

| # | Frames | On-screen text | Visual + motion | Audio cue (implied, silent) |
|---|---|---|---|---|
| 1 Title | 0-90 | "MORNING" / "QUEST" (32 px pixel font), "PRESS START" blinking 8 on / 8 off | Night-to-dawn sky with dither bands, sun half behind hills. Hero stands asleep (eyes shut, Z particles). Title drops in stepped rows at f15 (beat 2) with 6-frame shake. Hero wakes at f60 ("!" pops). Hard dither dissolve into scene 2 at f90 | Kick on beat 2 (drop), blip at wake |
| 2 Quest 1 | 90-210 | "QUEST 1/3" + "DRINK WATER" typewriter (1 char / 2 f); "+20 XP" pop; checklist "WATER" ticks | Pitcher on stool. Hero lifts cup (f15), sips in 3 steps (cup level drops), lowers cup at f60 = quest complete: +20 XP pops, XP bar fills 0 to 20/60 in stepped chunks, 6-frame shake (1 px), sparkles, hero hops on beats f75, f90, f105 | Coin on f60, blips on each sip |
| 3 Quest 2 | 210-330 | "QUEST 2/3" + "STRETCH"; "+20 XP"; checklist "STRETCH" ticks | Hero on a red mat. Poses on beats: arms out (f15), arms up (f30), lean left (f45), lean right (f60), arms up (f75) = complete: +20 XP pop, bar to 40/60, stretch lines flick at hands | Coin on f75 |
| 4 Quest 3 | 330-450 | "QUEST 3/3" + "PICK 1 TASK"; task cards "WRITE" "CALL" "TIDY"; "+20 XP"; checklist "TASK" ticks | Three cards drop in on f15/f20/f25. Pixel cursor hops card 1 (f30), card 3 (f45), card 2 (f60) = pick: card flashes yellow, the other two dither away, hero fist-pumps, +20 XP pop, bar to 60/60 | Blip per hop, coin on f60 |
| 5 Level up | 450-540 | "LV UP!" (32 px) at f0; "HAVE A / GOOD DAY" in dialog box typewriter from f15; HUD flips to LV 2 | Hard cut on beat with 2-frame white flash, +/-2 px shake for 6 frames, XP bar flashes. Hero jumps in integer steps, star burst radiates from hero, sky is full day. Final state (headline, dialog box, hero victory pose) settles by f45 and holds to f90 with beat hops | Fanfare on f0 |

Persistent: HUD (LV + XP bar), checklist, beat pips (4 squares, one lit per beat).
Palette: PICO-8 16, no other colors. Transitions: Bayer 4x4 dither dissolve, 12 frames centred on each scene cut. CRT overlay: off by default (`content.json` `crt`).
