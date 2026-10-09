# Storyboard: Add rate limiting to an Express API in 3 steps

1920x1080, 30 fps, 35 s = 1050 frames, silent. Style: `code-terminal-walkthrough` (HyperFrames, `github-dark`).
Unattended run: this table was written before building and then implemented as-is.

| # | Frames (s) | On-screen text | Visual + motion | Audio cue |
|---|---|---|---|---|
| 1 Hook | 0-90 (0-3 s) | "Add rate limiting to an Express API / in 3 steps"; tags Node.js, Express, express-rate-limit; peek `99: 200`, `100: 200`, `101: 429` | Title words rise in 5 frames apart, accent subtitle, small terminal panel shows the real result; the `429` line pops. Slow 2% drift. | none |
| 2 Install (step 1) | 90-210 (3-7 s) | pill "1 / 3 Install the package"; `$ npm install express express-rate-limit` + real npm output | Terminal window; command types at 1.5 chars/frame, 10-frame pause, output lines 2 frames apart; held 2.1 s after the last line. 3% camera drift. | none |
| 3 Limiter (step 2) | 210-300 (7-10 s of 12.5 s editor scene, local f0-f140) | pill "2 / 3 Write the limiter"; `server.js` | Editor window with boilerplate; the import line and the `rateLimit({...})` block expand in and type at 2 chars/frame (caret hidden while typing). | none |
| 3b Focus | local f140-232 | callouts "15-minute window" (on `windowMs`), "100 requests per window" (on `limit`) | Other lines dim to 30% over 8 frames, blue focus band, camera zoom 1.0 to 1.1 over 20 frames, leader lines grow to pills. Held 3 s after typing ends. | none |
| 4 Apply (step 3) | local f232-375 (about 15.5-20.5 s) | pill "3 / 3 Apply it to the app"; `+ app.use(limiter);`; callout "Applies to every route" | Unfocus, then two added lines expand over 8 frames (green bg, `+` in the gutter, lines below slide down), `app.use(limiter);` types, others dimmed, zoom in, callout; held 4 s. | none |
| 5 Run | 615-990 (20.5-33 s) | pill "Run it"; 3-line `for` loop, 103 output lines, `curl -si ... \| head -1`, badge "429 Too Many Requests" | Command types line by line (`>` continuation prompt), output floods at 1 line/frame with smooth scroll, slows for lines 96-100, 25-frame pause before `101: 429` (red rows), second command types, `HTTP/1.1 429 Too Many Requests`, badge pops in top-right. Command and result visible 2.7 s at the end. | none |
| 6 Outro | 990-1050 (33-35 s) | "Rate limiting in 3 steps", `$ npm install express-rate-limit`, "15-minute window / 100 requests / app.use(limiter)" | Fade and rise in; final frame is the held end card. | none |

Code and output are real: `server.js` was run with express 5.3.0 and express-rate-limit 8.7.1; requests 1-100 returned 200, 101-103 returned 429, and `curl -si` printed `HTTP/1.1 429 Too Many Requests`.
