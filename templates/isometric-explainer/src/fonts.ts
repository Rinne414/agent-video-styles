import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/jetbrains-mono/latin-500.css";
import { cancelRender, continueRender, delayRender } from "remotion";

// Block the first frame until the vendored fonts are ready.
const handle = delayRender("fonts");
Promise.all([
  document.fonts.load('500 46px "Inter"', "How a web request travels"),
  document.fonts.load('600 64px "Inter"', "A web request, end to end"),
  document.fonts.load('500 26px "JetBrains Mono"', "CLIENT APP-123 GET / 200 OK SELECT"),
])
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));
