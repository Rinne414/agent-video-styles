import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const c = JSON.parse(readFileSync("content.json", "utf8"));
const segments = [
  { id: "open", text: c.opening.speech },
  ...c.stories.map((s) => ({ id: s.id, text: s.speech })),
  { id: "close", text: c.closing.speech },
];
mkdirSync("assets/audio", { recursive: true });
writeFileSync("assets/audio/script.json", JSON.stringify({ voice: c.voice, rate: c.rate, segments }, null, 2));
