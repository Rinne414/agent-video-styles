// Gallery app: contact-sheet overview with filters, style detail pages, candidates, tools.
import { UI, tagLabel } from './i18n.js';
import { h, safeUrl } from './dom.js';
import { openPicker } from './picker.js';
import { renderDetail } from './detail.js';

const FILTER_KEYS = [
  { key: 'use', label: 'filterUse', values: (s) => s.tags.use },
  { key: 'aspect', label: 'filterAspect', values: (s) => s.tags.aspect },
  { key: 'tool', label: 'filterTool', values: (s) => [s.tools.primary] },
];

const state = { lang: 'en', data: null, pendingFocus: null, listScroll: 0, onDetail: false };

function readLang() {
  const fromUrl = new URLSearchParams(location.search).get('lang');
  if (fromUrl === 'zh' || fromUrl === 'en') return fromUrl;
  try { return localStorage.getItem('avs-lang') === 'zh' ? 'zh' : 'en'; } catch { return 'en'; }
}

function readFilters() {
  const params = new URLSearchParams(location.search);
  return Object.fromEntries(FILTER_KEYS.map(({ key }) => [key, params.getAll(key)]));
}

function writeFilters(filters) {
  const params = new URLSearchParams(location.search);
  for (const { key } of FILTER_KEYS) {
    params.delete(key);
    for (const v of filters[key]) params.append(key, v);
  }
  const query = params.toString();
  history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
}

const matches = (style, filters) => FILTER_KEYS.every(({ key, values }) =>
  filters[key].length === 0 || filters[key].some((v) => values(style).includes(v)));

function edgeText(style) {
  return [style.tools.primary.toUpperCase(), style.duration.toUpperCase(), style.tags.aspect.join(' ')];
}

function selectMark() {
  return h('svg', { class: 'select-mark', viewBox: '0 0 100 100', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
    h('ellipse', { cx: '50', cy: '50', rx: '48', ry: '46', 'vector-effect': 'non-scaling-stroke' }));
}

/** Hover-to-scrub: pointer x position maps to video time. */
function attachScrub(windowEl, style) {
  if (!style.preview) return;
  const fine = matchMedia('(pointer: fine)').matches;
  if (!fine) return;
  const bar = h('div', { class: 'scrub' });
  windowEl.append(bar);
  let video = null;
  windowEl.addEventListener('pointerenter', () => {
    if (video) return;
    video = h('video', { src: style.preview, muted: true, playsinline: true, preload: 'auto' });
    video.muted = true;
    windowEl.querySelector('img')?.replaceWith(video);
  });
  windowEl.addEventListener('pointermove', (e) => {
    if (!video || !Number.isFinite(video.duration)) return;
    const ratio = Math.min(1, Math.max(0, (e.clientX - windowEl.getBoundingClientRect().left) / windowEl.clientWidth));
    video.currentTime = ratio * video.duration;
    bar.style.width = `${ratio * 100}%`;
  });
}

function frame(style, lang, filters, anyFilter) {
  const t = UI[lang];
  const hit = matches(style, filters);
  const media = style.poster
    ? h('img', { src: style.poster, alt: '', loading: 'lazy', width: 640, height: 360 })
    : h('div', { class: 'frame-empty' }, t.noPreview);
  const windowEl = h('div', { class: 'frame-window', title: style.preview ? t.scrubHint : null }, media);
  attachScrub(windowEl, style);
  const [tool, duration, aspect] = edgeText(style);
  return h('figure', { class: `frame${anyFilter && !hit ? ' dim' : ''}` },
    anyFilter && hit ? selectMark() : null,
    h('a', { href: `#/style/${style.id}` },
      windowEl,
      h('div', { class: 'edge', 'aria-hidden': 'true' }, h('span', {}, tool), h('span', {}, duration), h('span', {}, aspect)),
      h('h3', { class: 'frame-title' }, style.name[lang]),
      h('p', { class: 'frame-tag' }, style.tagline[lang]),
    ),
  );
}

function toolbar(styles, filters, lang, rerender) {
  const t = UI[lang];
  const rows = FILTER_KEYS.map(({ key, label, values }) => {
    const all = [...new Set(styles.flatMap(values))];
    const chips = all.map((v) => {
      const on = filters[key].includes(v);
      return h('button', {
        class: 'chip', type: 'button', 'aria-pressed': String(on), 'data-filter': `${key}:${v}`,
        onclick: () => {
          const next = { ...filters, [key]: on ? filters[key].filter((x) => x !== v) : [...filters[key], v] };
          writeFilters(next);
          state.pendingFocus = `${key}:${v}`; // keep keyboard focus on this chip after re-render
          rerender();
        },
      }, tagLabel(lang, v));
    });
    return h('div', { class: 'filter-row', role: 'group', 'aria-label': t[label] }, h('span', {}, t[label]), ...chips);
  });
  const shown = styles.filter((s) => matches(s, filters)).length;
  const anyFilter = FILTER_KEYS.some(({ key }) => filters[key].length);
  return h('div', { class: 'toolbar' }, ...rows,
    h('div', { class: 'toolbar-actions' },
      h('button', { class: 'choose', type: 'button', onclick: () => openPicker(styles, lang, (id) => { location.hash = `#/style/${id}`; }) }, t.choose),
      h('span', { class: 'count', role: 'status' }, t.showing(shown, styles.length)),
      anyFilter ? h('button', { class: 'clear', type: 'button', onclick: () => { writeFilters({ use: [], aspect: [], tool: [] }); rerender(); } }, t.clear) : null,
    ));
}

function sheet(data, lang, rerender) {
  const t = UI[lang];
  const filters = readFilters();
  const anyFilter = FILTER_KEYS.some(({ key }) => filters[key].length);
  const strips = data.families.map((fam) => {
    const members = fam.ids.map((id) => data.styles.find((s) => s.id === id)).filter(Boolean);
    if (!members.length) return null;
    return h('section', { class: 'strip', 'aria-labelledby': `fam-${fam.id}` },
      h('div', { class: 'strip-head' }, h('h2', { id: `fam-${fam.id}` }, fam.name[lang]), h('p', {}, fam.blurb[lang])),
      h('div', { class: 'film' }, ...members.map((s) => frame(s, lang, filters, anyFilter))),
    );
  });
  const none = anyFilter && !data.styles.some((s) => matches(s, filters));
  return [toolbar(data.styles, filters, lang, rerender), none ? h('p', { class: 'empty-state' }, t.noMatch) : null, ...strips, ...lowerBands(data, lang)];
}

function lowerBands(data, lang) {
  const t = UI[lang];
  const candidates = data.candidates.map((c) => h('article', { class: 'candidate' },
    h('h3', {}, c.name[lang]),
    h('p', {}, c.signature),
    h('p', {}, h('span', { class: 'label' }, `${t.missing}: `), c.missing),
    h('p', {}, h('span', { class: 'label' }, `${t.niche}: `), c.niche),
  ));
  const toolRows = data.tools.map((tool) => h('tr', {},
    h('th', { scope: 'row' }, safeUrl(tool.url) ? h('a', { href: tool.url, rel: 'noopener' }, tool.name) : tool.name),
    h('td', {}, tool.best[lang]), h('td', {}, tool.license[lang]), h('td', {}, tool.render[lang])));
  return [
    h('section', { class: 'band install', id: 'use' },
      h('h2', {}, t.useTitle), h('p', {}, t.useBody), h('pre', {}, data.install)),
    h('section', { class: 'band', id: 'tools' },
      h('h2', {}, t.toolsTitle),
      data.tools.length ? h('table', { class: 'tools-table' }, h('tbody', {}, ...toolRows)) : null),
    h('section', { class: 'band', id: 'candidates' },
      h('h2', {}, t.candidatesTitle), h('p', {}, t.candidatesLede), h('div', { class: 'candidates' }, ...candidates)),
    h('section', { class: 'band', id: 'method' }, h('h2', {}, t.methodTitle), h('p', {}, t.methodBody)),
  ];
}

function applyStaticText(lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh' : 'en';
  for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = UI[lang][el.dataset.i18n];
  document.title = UI[lang].title;
}

function render() {
  const { lang, data } = state;
  applyStaticText(lang);
  const view = document.getElementById('view');
  const match = location.hash.match(/^#\/style\/([a-z0-9-]+)$/);
  const style = match && data.styles.find((s) => s.id === match[1]);
  document.body.classList.toggle('on-detail', Boolean(style));
  if (style) {
    view.replaceChildren(...renderDetail(style, lang));
    if (!state.onDetail) window.scrollTo(0, 0);
  } else {
    view.replaceChildren(...sheet(data, lang, render).filter(Boolean));
    if (state.onDetail) {
      const y = state.listScroll;
      requestAnimationFrame(() => window.scrollTo(0, y)); // after layout of the rebuilt list
    }
    if (state.pendingFocus) {
      view.querySelector(`[data-filter="${CSS.escape(state.pendingFocus)}"]`)?.focus();
      state.pendingFocus = null;
    }
  }
  state.onDetail = Boolean(style);
  document.getElementById('colophon').textContent = data.colophon[lang];
}

async function main() {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'; // this app restores scroll itself
  state.lang = readLang();
  const res = await fetch('data.json');
  if (!res.ok) throw new Error(`data.json failed to load (${res.status})`);
  state.data = await res.json();
  document.getElementById('lang-toggle').addEventListener('click', () => {
    state.lang = state.lang === 'en' ? 'zh' : 'en';
    try { localStorage.setItem('avs-lang', state.lang); } catch { /* storage unavailable: keep in memory */ }
    render();
  });
  window.addEventListener('hashchange', render);
  // Remember the list position at the moment a style is opened, so "back" returns to it.
  document.addEventListener('click', (e) => {
    if (!state.onDetail && e.target.closest?.('a[href^="#/style/"]')) state.listScroll = window.scrollY;
  }, true);
  render();
}

main().catch((err) => {
  document.getElementById('view').replaceChildren(h('p', { class: 'empty-state' }, `Could not load the catalog: ${err.message}`));
});
