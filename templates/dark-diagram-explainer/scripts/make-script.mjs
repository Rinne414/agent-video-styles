// Writes assets/audio/script.json (tts.py input) from content.json.
import { readFileSync, writeFileSync } from "node:fs";

const content = JSON.parse(readFileSync(new URL("../content.json", import.meta.url), "utf8"));
const script = {
  voice: content.voice.name,
  rate: content.voice.rate,
  segments: content.segments.map((s) => ({ id: s.id, text: s.speech })),
};
writeFileSync(new URL("../assets/audio/script.json", import.meta.url), JSON.stringify(script, null, 2) + "\n");
console.log(`wrote script.json with ${script.segments.length} segments`);
