import { continueRender, delayRender } from "remotion";
import "@fontsource/noto-sans-sc/900.css";
import content from "../content.json";

// Block rendering until every glyph used in content.json is loaded (avoids CJK tofu).
const handle = delayRender("Loading Noto Sans SC 900");
const glyphs = Array.from(new Set(JSON.stringify(content))).join("");

document.fonts
  .load('900 100px "Noto Sans SC"', glyphs)
  .then(() => continueRender(handle))
  .catch((err) => {
    throw err;
  });
