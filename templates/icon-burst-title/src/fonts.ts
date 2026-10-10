import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-800.css";
import { cancelRender, continueRender, delayRender } from "remotion";

// Load once, before the first frame is rendered.
const handle = delayRender("fonts");
Promise.all([
  document.fonts.load('800 100px "Inter"', "Code with Kai"),
  document.fonts.load('600 100px "Inter"', "LearnBuildShip"),
  document.fonts.load('500 60px "Inter"', "New videos every week"),
])
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));
