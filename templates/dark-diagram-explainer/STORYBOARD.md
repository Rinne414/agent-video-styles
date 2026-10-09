# Storyboard: how a CDN makes websites fast

Style `dark-diagram-explainer`, 1920x1080, 30 fps, target about 55 s (actual 57.4 s). Narration is the master clock: frames below come from `assets/audio/timeline.json` (segment start = previous segments' `duration_ms` + 150 ms gaps). Every visual event is keyed to a spoken word by `src/story.ts`.

| Beat | Segments |
|---|---|
| Hook | s1 |
| Setup (problem, red) | s2, s2b |
| Mechanism | s3 (edge servers), s4 (miss), s5 + s5b (hit, crowd) |
| Payoff (green) | s6 |
| Outro | s7 plus a 2.2 s hold |

| Seg | Frames | On-screen text (captions) | Visual + motion | Audio cue |
|---|---|---|---|---|
| s1 | 0-119 | Why does a website load fast in Tokyo, and just as fast in Paris? | Users Tokyo and Paris pop in on their names; green "page loaded" bars fill to 20 ms (Camera 1.12x on the left; spring node entrances) | voice, `s1.mp3` (4.0 s) |
| s2 | 123-412 | Your site lives on one origin server. If that server is far away, every request must travel thousands of miles, and back. That delay is called latency. | Origin node enters on "origin"; red arc draws on "far"; request packet rides the arc out and back; "6,800 miles" on "miles"; LATENCY pill on "latency" (Camera pans to the Tokyo-origin span; Paris parked) | voice, `s2.mp3` (9.6 s) |
| s2b | 417-649 | From Tokyo to a server in Virginia, one round trip takes around two hundred milliseconds. And a single page needs dozens of them. | "Virginia, USA" tag; round-trip counter 0 to 200 ms; six packets burst along the arc on "dozens" (Slow 2% drift) | voice, `s2b.mp3` (7.7 s) |
| s3 | 653-861 | A CDN fixes this. It places edge servers close to your users, each one holding copies of your files. | Red arc fades on "fixes"; edge nodes spring in on "edge servers"; user-edge links draw with a "5 ms" tag on "close"; edge-origin dotted links; empty cache slots (Camera widens to all five nodes) | voice, `s3.mp3` (6.9 s) |
| s4 | 865-1030 | First visit? That is a cache miss. The edge asks the origin once, then keeps a copy. | Request packet user to edge; CACHE MISS pill on "miss"; red packet edge to origin with "200 ms"; file packet returns on "once"; cache slot fills on "keeps"; file to user (Camera pushes to 1.15x on the Tokyo row; Paris row hidden) | voice, `s4.mp3` (5.5 s) |
| s5 | 1033-1188 | Next visit? That is a cache hit. The edge already has the file, and answers right away. | Request to edge; CACHE HIT pill on "hit"; origin dims; file answers straight back (Same camera, drift) | voice, `s5.mp3` (5.2 s) |
| s5b | 1193-1337 | Now a million visitors can share one copy, and the origin barely notices. | 14 visitor icons pop in on "million"; green packets stream to the edge; "1 origin fetch" under the dimmed origin (Camera shifts left to include the crowd) | voice, `s5b.mp3` (4.8 s) |
| s6 | 1340-1551 | The result: pages load in milliseconds, and the origin handles far less traffic. Everyone gets the fast version. | "200 ms" struck through, "20 ms" springs in on "milliseconds"; origin load bar shrinks on "far less traffic"; all links turn green; check marks on "Everyone" (Camera pulls back to 0.95x) | voice, `s6.mp3` (7.0 s) |
| s7 | 1555-1649 | A CDN. Content, closer to everyone. | Diagram fades to ~3%; "CDN" with glow, then "Content Delivery Network"; held to the last frame (Hold) | voice, `s7.mp3` (3.1 s) |

Chapter titles (top left, 72 px): How a CDN works / The problem: distance / The fix: edge servers / Cache miss / Cache hit / The result. Max 5 nodes on screen at once; one icon set (Lucide); indigo = active, red = problem, green = result.
