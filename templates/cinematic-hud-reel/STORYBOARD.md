# Storyboard: Nova Labs sizzle reel

1920x1080, 30 fps, 22 s = 660 frames, 128 BPM (1 beat = 14.0625 frames, `frame = round(beat * 14.0625)`). Silent render; every hit comes from one list (`hitBeats` in `content.json`) so a soundtrack can be added without retiming. The style's 24 s / 720-frame structure is scaled by 660/720 and snapped to the beat grid.

| # | Beats / frames | On-screen text | Visual + motion | Audio cue (not rendered) |
|---|---|---|---|---|
| 1 Cold open | 0-4 / 0-56 | `> NOVA//OS 4.2 BOOT`, `> LINK ESTABLISHED`, `> AGENT MESH ....... ONLINE`, `SYNC 128 BPM 0-100%` | Black, HUD fades in, boot lines type, rings draw on, loading bar fills, scan bar | riser starts |
| 2 Hits I | 4-12 / 56-169 | `WE BUILD` (b4), `AGENTS.` (b6), `THEY SHIP` (b8), `CODE.` (b10) | Slam 1.4->1.0 landing on each hit, lock-on brackets tighten, glow only on newest word, whip-pan out between lines, mono tag decodes under each word | sub hit on each of b4, 6, 8, 10 |
| 3 Metrics | 12-16 / 169-225 | `128 AGENTS ONLINE`, `4,096 PRS MERGED`, `99.99 UPTIME %` | Whip-in from right with blur, counters tick up, lock glow on b14 | hits b12, b14 |
| 4 Build I | 16-28 / 225-394 | `SCOPE`, `BUILD`, `TEST`, `REVIEW`, `MERGE`, `DEPLOY` (one per 2 beats) | 9-frame decode per word, terminal micro-type left, data spikes right, ring pulse every beat | hits every 2 beats |
| 5 Build II / riser | 28-32 / 394-450 | `THEY NEVER` (b28) | Slam, glow swells, rings accelerate to 4x, HUD flickers, scan bar speeds up, 2-frame blackout before the drop | riser |
| 6 Drop | 32-40 / 450-562 | `SLEEP.` (400 px), small `THEY NEVER`, red `ALERT // DOWNTIME 00:00:00` | Hit on every beat, bloom peak, 30% flash, 8 px RGB split, ring burst per beat (first one in hit red), scrolling word wall, slow dolly | hits b32-b39 |
| 7 Logo finale | 40-47 / 562-660 | `NOVA LABS`, `AGENTS THAT SHIP`, `nova-labs.example/agents` | Wordmark assembles from 13 stroked segments flying in (seeded), flash, locks on b43 (frame 605), glow settles, tagline and handle decode, HUD keeps moving, hold 55 frames (1.8 s) | hits b40, b43 |
