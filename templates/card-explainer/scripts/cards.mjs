// HTML markup per card layout. Timing is passed in as data-at attributes (absolute seconds).
import { splitPhrases, timeOfPhrase, clauseStarts } from "./align.mjs";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const at = (t) => (t === null || t === undefined ? "" : ` data-at="${t.toFixed(3)}"`);

const ICONS = {
  timer: '<circle class="soft" cx="12" cy="13.5" r="8"/><path d="M12 9.5v4l2.5 2.5M9.5 2h5M12 2v3.5"/>',
  layout: '<rect class="soft" x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 21V9"/>',
  coffee: '<path class="soft" d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M17 11h1.5a2.5 2.5 0 0 1 0 5H17M8 2.5v3M12 2.5v3"/>',
  check: '<circle class="soft" cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>',
  flag: '<path class="soft" d="M5 4h12l-2 4 2 4H5z"/><path d="M5 21V4"/>',
  spark: '<path class="soft" d="M12 3l2.2 6.3L21 12l-6.8 2.7L12 21l-2.2-6.3L3 12l6.8-2.7z"/>',
  list: '<path d="M9 6h12M9 12h12M9 18h12"/><circle class="soft" cx="4.5" cy="6" r="1.5"/><circle class="soft" cx="4.5" cy="12" r="1.5"/><circle class="soft" cx="4.5" cy="18" r="1.5"/>',
};
const icon = (name, size = 96) =>
  `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] ?? ICONS.spark}</svg>`;

const tomato = (cls = "", withTick = false) =>
  `<svg class="tomato ${cls}" viewBox="0 0 100 100"><circle cx="50" cy="58" r="36" class="t-body"/><ellipse cx="36" cy="44" rx="9" ry="6" class="t-shine" transform="rotate(-30 36 44)"/><path d="M50 24l-12-9 8 1-2-8 6 6 6-6-2 8 8-1z" class="t-leaf"/>${
    withTick ? '<path class="tick" d="M33 58l12 12 22-24" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="60"/>' : ""
  }</svg>`;

const withHighlight = (text, hl) => {
  if (!hl || !text.includes(hl)) return esc(text);
  const [a, b] = text.split(hl);
  return `${esc(a)}<span class="hl"><i class="hl-bar" data-hl></i><b>${esc(hl)}</b></span>${esc(b)}`;
};
const attribution = (meta) => `<div class="attrib">${esc(meta.source)} - ${esc(meta.author)}</div>`;

/** ctx: {card, meta, times, narration, absStart (audio start on timeline)} */
const R = {
  title({ card, meta }) {
    return `<div class="col">${item(icon(card.icon, 96))}${item(`<div class="kicker">${esc(card.kicker)}</div>`)}
      ${item(`<h1 class="h-key">${esc(card.headline)}</h1>`)}</div>
      <div class="art">${tomato("big")}</div>${attribution(meta)}`;
  },
  key({ card, times, narration, t }) {
    const phrases = card.phrases ?? splitPhrases(card.text);
    const lines = phrases
      .map((ph) => {
        const tt = timeOfPhrase(narration, times, ph.replace(/\s/g, "")) ?? timeOfPhrase(narration, times, ph);
        const hasHl = card.highlight && ph.includes(card.highlight);
        const hlAt = hasHl ? timeOfPhrase(narration, times, card.highlight) : null;
        return `<div class="phrase" data-anim="phrase"${at(tt === null ? null : t(tt))}${hasHl ? ` data-hl-at="${t(hlAt ?? tt ?? 0.5).toFixed(3)}"` : ""}>${withHighlight(ph, hasHl ? card.highlight : null)}</div>`;
      })
      .join("");
    return `<div class="col ${card.variant ?? "plain"}">${item(icon(card.icon, card.variant === "center" ? 120 : 88))}${item(`<div class="kicker">${esc(card.kicker)}</div>`)}
      <div class="key">${lines}</div></div>`;
  },
  bignumber({ card, times, narration, t }) {
    const tt = t(timeOfPhrase(narration, times, String(card.number)) ?? 1.5);
    return `<div class="col">${item(icon(card.icon, 88))}${item(`<div class="kicker">${esc(card.kicker)}</div>`)}
      ${item(`<div class="bignum"><span class="num" data-count="${card.number}" data-at="${tt.toFixed(3)}">0</span><span class="unit">${esc(card.unit)}</span></div>`)}
      ${item(`<div class="body">${esc(card.label)}</div>`)}</div>
      <svg class="ring" viewBox="0 0 200 200"><circle class="ring-bg" cx="100" cy="100" r="86"/><circle class="ring-fg" cx="100" cy="100" r="86" data-ring data-at="${tt.toFixed(3)}" transform="rotate(-90 100 100)"/></svg>`;
  },
  compare({ card, times, narration, t }) {
    const hl = card.highlight && card.right.text.includes(card.highlight) ? card.highlight : null;
    const hlAt = t(timeOfPhrase(narration, times, hl ?? "") ?? 3);
    return `<div class="col wide">${item(`<div class="kicker">${esc(card.kicker)}</div>`)}
      <div class="cmp">
        <div class="cmp-col muted" data-anim="item"><div class="tag">${esc(card.left.tag)}</div><div class="body">${esc(card.left.text)}</div></div>
        <div class="vs">VS</div>
        <div class="cmp-col hot" data-anim="item"><div class="tag">${esc(card.right.tag)}</div><div class="body" data-hl-at="${hlAt.toFixed(3)}">${withHighlight(card.right.text, hl)}</div></div>
      </div></div>`;
  },
  tally({ card, times, narration, t, audioLen }) {
    const t0 = t(times[narration.indexOf("记一个记号")] ?? audioLen * 0.4);
    const t1 = t(audioLen * 0.92);
    const marks = Array.from({ length: card.count }, (_, i) => {
      const ti = t0 + ((t1 - t0) * i) / Math.max(1, card.count - 1);
      return `<div class="mark" data-anim="mark" data-at="${ti.toFixed(3)}">${tomato("", true)}</div>`;
    }).join("");
    return `<div class="col wide">${item(icon(card.icon, 88))}${item(`<div class="kicker">${esc(card.kicker)}</div>`)}
      ${item(`<div class="h-mid">${esc(card.text)}</div>`)}<div class="marks">${marks}</div></div>`;
  },
  list({ card, times, narration, t }) {
    const starts = clauseStarts(narration, times);
    const off = Math.max(0, starts.length - card.bullets.length);
    const lis = card.bullets
      .map((b, i) => `<li data-anim="phrase"${at(t(starts[i + off] ?? 1 + i))}>${icon("check", 56)}<span>${esc(b)}</span></li>`)
      .join("");
    return `<div class="col wide">${item(`<div class="kicker">${esc(card.kicker)}</div>`)}${item(`<h2 class="h-mid">${esc(card.title)}</h2>`)}<ul>${lis}</ul></div>`;
  },
  outro({ card, meta }) {
    return `<div class="col">${item(icon(card.icon, 96))}${item(`<div class="kicker">${esc(card.kicker)}</div>`)}
      ${item(`<h1 class="h-key">${esc(card.headline)}</h1>`)}${item(`<div class="body muted-text">关注 ${esc(meta.handle)}，下期见</div>`)}</div>
      <div class="art">${tomato("big", true)}</div>${attribution(meta)}`;
  },
};

function item(html) {
  return html.replace(/^(\s*<[a-z0-9]+)/, '$1 data-anim="item"');
}

export function renderCard(layout, ctx) {
  const fn = R[layout];
  if (!fn) throw new Error(`Unknown layout "${layout}". Use: ${Object.keys(R).join(", ")}`);
  return fn(ctx);
}
