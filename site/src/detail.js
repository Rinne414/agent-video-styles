// Style detail page.
import { UI, tagLabel } from './i18n.js';
import { h, safeUrl } from './dom.js';

function list(items) {
  return h('ul', {}, ...items.map((x) => h('li', {}, x)));
}

function player(style, lang) {
  const t = UI[lang];
  const media = style.preview
    ? h('video', { src: style.preview, poster: style.poster ?? null, controls: true, muted: true, playsinline: true, loop: true, preload: 'metadata' })
    : h('div', { class: 'frame-window' }, h('div', { class: 'frame-empty' }, t.noPreview));
  return h('div', { class: 'player' }, media,
    h('div', { class: 'edge', 'aria-hidden': 'true' },
      h('span', {}, style.tools.primary.toUpperCase()), h('span', {}, style.duration.toUpperCase()), h('span', {}, style.tags.aspect.join(' '))));
}

function evidence(style, lang) {
  const t = UI[lang];
  const rows = style.evidence.map((e) => {
    const url = safeUrl(e.url);
    return h('li', {},
      h('div', {}, h('span', { class: 'who' }, url ? h('a', { href: url, rel: 'noopener', target: '_blank' }, e.creator) : e.creator), ' ',
        h('span', { class: `badge ${e.verified}` }, t.verified[e.verified] ?? e.verified)),
      h('div', { class: 'meta' }, `${e.platform} / ${e.tool}`),
      h('div', { class: 'note' }, e.note));
  });
  return h('section', {},
    h('h3', {}, t.popularized),
    h('p', { class: 'meta' }, t.evidenceNote(style.evidence.length, style.evidence_strength)),
    h('ul', { class: 'evidence' }, ...rows));
}

function brief(style, lang) {
  const t = UI[lang];
  if (!style.brief) return null;
  const button = h('button', { class: 'copy', type: 'button' }, t.copy);
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(style.brief);
      button.textContent = t.copied;
    } catch {
      button.textContent = '-';
    }
  });
  return h('section', { class: 'brief' }, h('h3', {}, t.brief), button, h('pre', {}, style.brief));
}

function recipe(style, lang) {
  // recipeHtml is rendered at build time from this repository's own markdown files.
  const body = h('div', { class: 'recipe-body' });
  body.innerHTML = style.recipeHtml;
  return h('section', {}, h('details', { class: 'recipe' }, h('summary', {}, UI[lang].recipe), body));
}

export function renderDetail(style, lang) {
  const t = UI[lang];
  const needs = style.tags.needs.length ? style.tags.needs.map((n) => tagLabel(lang, n)).join(', ') : t.nothingNeeded;
  const alts = style.tools.alternatives.map((a) => tagLabel(lang, a)).join(', ');
  const variants = (style.variants ?? []).map((v) => h('li', {}, h('strong', {}, v.id), ': ', v[lang]));
  return [
    h('a', { class: 'back', href: '#/' }, t.back),
    h('article', { class: 'detail' },
      player(style, lang),
      h('div', {},
        h('h2', { class: 'style-name' }, style.name[lang]),
        h('p', { class: 'tagline' }, style.tagline[lang]),
        h('dl', { class: 'facts' },
          h('dt', {}, t.tier), h('dd', {}, style.tier === 'experimental' ? t.tierExperimental : t.tierCore),
          h('dt', {}, t.duration), h('dd', {}, style.duration),
          h('dt', {}, t.difficulty), h('dd', {}, `${style.difficulty} / 3`),
          h('dt', {}, t.needs), h('dd', {}, needs),
          h('dt', {}, t.template), h('dd', {}, style.template)),
        h('section', {}, h('h3', {}, t.looksLike), list(style.signature[lang])),
        h('section', { class: 'pair' },
          h('div', {}, h('h3', {}, t.useFor), list(style.best_for[lang])),
          h('div', {}, h('h3', {}, t.skipWhen), list(style.avoid_when[lang]))),
        h('section', {}, h('h3', {}, t.toolHeading),
          h('p', {}, h('strong', {}, `${t.primaryTool}: ${tagLabel(lang, style.tools.primary)}`), alts ? ` / ${t.altTools}: ${alts}` : ''),
          h('p', {}, style.tools.why[lang])),
        variants.length ? h('section', {}, h('h3', {}, t.variants), h('ul', {}, ...variants)) : null,
        brief(style, lang),
        evidence(style, lang),
        recipe(style, lang),
      ),
    ),
  ];
}
