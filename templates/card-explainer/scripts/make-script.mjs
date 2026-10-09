// content.json -> assets/audio/script.json (input for skill/scripts/tts.py)
import { readFileSync, writeFileSync } from "node:fs";
const c = JSON.parse(readFileSync("content.json", "utf8"));
const script = {
  voice: c.voice.name,
  rate: c.voice.rate,
  segments: c.cards.map((card) => ({ id: card.id, text: card.narration })),
};
writeFileSync("assets/audio/script.json", JSON.stringify(script, null, 2));
console.log(`wrote assets/audio/script.json (${script.segments.length} segments)`);
