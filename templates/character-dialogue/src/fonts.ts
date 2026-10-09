import "@fontsource/inter/latin-700.css";
import "@fontsource/inter/latin-800.css";
import { cancelRender, continueRender, delayRender } from "remotion";

const handle = delayRender("load fonts");
Promise.all([
  document.fonts.load('700 48px Inter', "Abc=?:!'.;,"),
  document.fonts.load('800 64px Inter', "Abc=?:!'.;,"),
])
  .then(() => continueRender(handle))
  .catch((e) => cancelRender(e));
