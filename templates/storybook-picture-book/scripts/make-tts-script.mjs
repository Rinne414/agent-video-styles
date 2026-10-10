// Writes assets/audio/script.json from content.json so the narration text has one source of truth.
// Then run: python ../../skill/scripts/tts.py assets/audio/script.json --out-dir assets/audio
import { writeFileSync } from "node:fs";
import path from "node:path";
import { ROOT, content } from "./theme.mjs";

const script = {
  voice: content.voice.id,
  rate: content.voice.rate,
  segments: content.pages.map((p) => ({ id: p.id, text: p.caption })),
};
writeFileSync(path.join(ROOT, "assets/audio/script.json"), JSON.stringify(script, null, 2) + "\n");
console.log(`wrote assets/audio/script.json (${script.segments.length} segments)`);
