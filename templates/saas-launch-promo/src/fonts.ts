import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import { continueRender, delayRender } from "remotion";
import { C } from "./theme";

// Block rendering until every weight used is decoded, so frame 0 never shows a fallback font.
const handle = delayRender("Loading Inter");
Promise.all(
  ["500", "700", "800"].map((w) => document.fonts.load(`${w} 40px "${C.brand.font}"`)),
)
  .then(() => continueRender(handle))
  .catch((err) => {
    throw err;
  });
