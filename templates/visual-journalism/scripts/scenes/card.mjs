// Shared markup helpers for scenes.
export const tag = (text) => `<div class="tag">${text}</div>`;

let driftSign = 1;
export const resetDrift = () => { driftSign = 1; };

/** Absolutely positioned paper card. cls: "", "photo" or "plate". */
export function card({ x, y, w, h, r = 0, cls = "", inner, tagText, at }) {
  driftSign = -driftSign;
  const atAttr = at !== undefined ? ` data-rel="${at}"` : "";
  return `<div class="card ${cls}" data-card data-r="${r}"${atAttr} style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="drift" data-drift="${driftSign}">${inner}${tagText ? tag(tagText) : ""}</div></div>`;
}

export const kicker = (text, rel = 0.1) => `<div class="kicker sans" data-in data-rel="${rel}">${text}</div>`;

export const hl = (text, cue, extra = "") => `<mark class="hl${extra}" data-h="${extra.includes("low") ? 46 : 88}" data-layout-allow-overlap data-layout-allow-overflow data-cue="${cue}">${text}</mark>`;
