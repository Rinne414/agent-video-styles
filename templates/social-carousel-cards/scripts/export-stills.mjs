// Export one 1080x1350 PNG per card (settled frame) into out/cards/01.png ...
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

const { cards } = JSON.parse(readFileSync(new URL("../content.json", import.meta.url), "utf8"));
mkdirSync("out/cards", { recursive: true });
cards.forEach((_, i) => {
  const n = String(i + 1).padStart(2, "0");
  execFileSync("pnpm", ["exec", "remotion", "still", `Card${i + 1}`, `out/cards/${n}.png`, "--image-format=png"], {
    stdio: "inherit",
    shell: true,
  });
});
