// Canvas setup and the renderFrame contract for scripts/capture_html.mjs.
(function () {
  const T = window.THEME, B = window.BRUSH, { W, H, P, C, ramp, easeOutCubic: eo } = T;

  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  const layer = document.createElement("canvas");
  layer.width = W; layer.height = H;
  const lg = layer.getContext("2d");

  let grain = null, vignette = null;

  function render(f) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1;
    ctx.fillStyle = P.paper; ctx.fillRect(0, 0, W, H);

    window.SCENES.drawArt(lg, f);
    const z = 1 + T.zoomPerSec * (f / C.video.fps);
    const fade = 1 - 0.7 * eo(ramp(f, C.closeStart, C.closeStart + 55));
    ctx.save();
    ctx.translate(W / 2, 380); ctx.scale(z, z); ctx.translate(-W / 2, -380);
    ctx.globalAlpha = fade;
    ctx.drawImage(layer, 0, 0);
    ctx.restore();

    window.SCENES.drawLyrics(ctx, f);

    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.drawImage(grain.mottle, 0, 0);
    ctx.drawImage(grain.variants[Math.floor(f / 3) % 3], 0, 0);
    ctx.fillStyle = vignette; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  window.__ready = (async () => {
    const f = C.font;
    await document.fonts.load(`italic ${f.weight} ${f.size}px "${f.family}"`);
    grain = B.makeGrain(W, H, T.SEED);
    vignette = ctx.createRadialGradient(W / 2, H / 2, W * 0.42, W / 2, H / 2, W * 0.78);
    vignette.addColorStop(0, "rgb(255,255,255)"); vignette.addColorStop(1, "rgb(222,212,192)");
  })();

  window.renderFrame = async (i) => { await window.__ready; render(i); };
})();
