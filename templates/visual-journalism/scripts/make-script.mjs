// Writes assets/audio/script.json (input for skill/scripts/tts.py) from content.json.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const c = JSON.parse(readFileSync(new URL("../content.json", import.meta.url), "utf8"));
mkdirSync(new URL("../assets/audio/", import.meta.url), { recursive: true });
const script = {
  voice: c.meta.voice,
  rate: c.meta.rate,
  segments: c.narration.map((n) => ({ id: n.id, text: n.speech })),
};
writeFileSync(new URL("../assets/audio/script.json", import.meta.url), JSON.stringify(script, null, 2));
console.log("wrote assets/audio/script.json");
