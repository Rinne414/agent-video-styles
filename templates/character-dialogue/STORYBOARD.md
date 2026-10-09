# Storyboard: "What is an API?" (character-dialogue)

Style: `character-dialogue`. Tool: Remotion 4.0.534. 1920x1080, 30 fps. Pip (round robot, `en-US-AnaNeural`) asks, Juno (calm owl, `en-US-AndrewNeural`) explains with the restaurant-waiter analogy. Narration is the master clock: frame ranges below come from `assets/audio/timeline.json` (line = audio + 200 ms gap, 400 ms lead-in, 1.4 s tail hold).

Total: 1488 frames = 49.6 s, 10 lines (46.0 s of speech).

| # | Frames | Speaker / expression | Caption text | Board (chalk) | Audio cue |
|---|---|---|---|---|---|
| 1 | 12-123 | Juno happy | Welcome to the board! Today's question: what is an API? | Title "API 101" writes on, yellow underline | Juno l01, pon on title |
| 2 | 129-302 | Pip normal | Hi Juno! I keep hearing about APIs. What is one? | Pink bullet "Q: What is an API?" | Pip l02, pon |
| 3 | 308-437 | Juno normal | Picture a restaurant. You sit at a table; the food is made in the kitchen. | Diner at a table ("You"), then a steaming pot ("Kitchen") | Juno l03, 2 pons |
| 4 | 443-545 | Pip troubled | But I cannot just walk into the kitchen, right? | Dashed pink line You to Kitchen with a cross, "no direct access" | Pip l04, pon |
| 5 | 551-693 | Juno happy | Exactly! The waiter carries your order to the kitchen, then brings the food back. | Dashed line fades; waiter appears in the middle; pink request arrows, then yellow response arrows | Juno l05, pon |
| 6 | 699-807 | Pip surprised | Oh! So the waiter is the API? | Yellow ring around the waiter | Pip l06, pon |
| 7 | 813-1001 | Juno happy (Pip happy) | Yes! An API is a waiter between your app and a server, carrying requests and responses. | Bullet "Waiter = API"; labels change to Your app / API / Server | Juno l07, pon |
| 8 | 1007-1115 | Pip happy | Neat! But how do I know what to order? | Nothing new (hold) | Pip l08 |
| 9 | 1121-1262 | Juno normal | The menu lists what you can order. For an API, that is the documentation. | Menu card drawn, then bullet "Menu = API docs" | Juno l09, 2 pons |
| 10 | 1268-1446 | Pip happy (Juno happy) | Got it! Request in, response out. Thanks, Juno! | Yellow bullet "Request in, response out" + underline | Pip l10, pon |
| - | 1446-1488 | Both happy | (last caption stays) | Final board held | BGM fades out |

Motion notes: speaker hops 12 px on a spring at line start and stays at full brightness; the listener drops to 85 %. Mouths flap on a 4-frame cadence only while a TTS word is active (gaps over 120 ms stay closed). Breathing 2.5 s, seeded blinks every 3-5 s. Expression swaps pop with a short bounce. Quiet synthesized pad (BGM) and a synthesized "pon" on each board write.
