import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-800.css";
import "@fontsource/noto-sans-sc/500.css";
import "@fontsource/noto-sans-sc/700.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import { cancelRender, continueRender, delayRender } from "remotion";
import { allText } from "./theme";

const glyphs = Array.from(new Set(allText())).join("");
const handle = delayRender("fonts");
Promise.all([
  document.fonts.load("800 100px Inter", glyphs),
  document.fonts.load("500 44px Inter", glyphs),
  document.fonts.load("700 100px 'Noto Sans SC'", glyphs),
  document.fonts.load("500 44px 'Noto Sans SC'", glyphs),
  document.fonts.load("500 36px 'JetBrains Mono'", glyphs),
])
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));
