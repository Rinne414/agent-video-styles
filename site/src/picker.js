// "Help me choose": a short questionnaire that ranks styles by their tags.
import { UI, tagLabel } from './i18n.js';
import { h } from './dom.js';

const QUESTIONS = [
  {
    key: 'use',
    q: { en: 'What is the video for?', zh: '这个视频用来做什么？' },
    options: [
      { v: ['product-launch', 'feature-update'], en: 'Launch a product or feature', zh: '发布产品或新功能' },
      { v: ['explainer', 'education', 'tutorial'], en: 'Explain or teach something', zh: '讲解或教学' },
      { v: ['data-report'], en: 'Show data or results', zh: '展示数据或成果' },
      { v: ['social-short'], en: 'Stop the scroll on social feeds', zh: '在信息流里抓住注意力' },
      { v: ['brand-reel', 'logo-intro', 'personal-brand'], en: 'Brand reel or intro', zh: '品牌片或片头' },
      { v: ['music-video'], en: 'Music or lyric video', zh: '音乐或歌词视频' },
      { v: ['overlay'], en: 'Dress up footage I already filmed', zh: '包装我已经拍好的素材' },
    ],
  },
  {
    key: 'aspect',
    q: { en: 'Where will people watch it?', zh: '观众会在哪里看？' },
    options: [
      { v: ['16:9'], en: 'Wide: YouTube, X, a website', zh: '横屏：YouTube、X、网站' },
      { v: ['9:16'], en: 'Vertical: Shorts, Reels, TikTok, Douyin', zh: '竖屏：Shorts、Reels、TikTok、抖音' },
      { v: [], en: 'Both or not sure', zh: '都有或还不确定' },
    ],
  },
  {
    key: 'have',
    multi: true,
    q: { en: 'What do you already have?', zh: '你手上已经有什么？' },
    options: [
      { v: ['screenshots', 'logo'], en: 'Screenshots or a logo', zh: '截图或 Logo' },
      { v: ['footage'], en: 'Footage of me or my product', zh: '自己或产品的实拍素材' },
      { v: ['data'], en: 'Numbers or a dataset', zh: '数字或数据集' },
      { v: ['script'], en: 'A script or an article', zh: '脚本或文章' },
    ],
  },
  {
    key: 'audio',
    q: { en: 'Should it be narrated?', zh: '需要旁白吗？' },
    options: [
      { v: ['voiceover'], en: 'Yes, with a voiceover', zh: '需要旁白' },
      { v: ['music'], en: 'No, music and sound only', zh: '不需要，只要音乐和音效' },
      { v: [], en: 'Either is fine', zh: '都可以' },
    ],
  },
  {
    key: 'mood',
    q: { en: 'How should it feel?', zh: '希望是什么感觉？' },
    options: [
      { v: ['premium', 'cinematic'], en: 'Premium and cinematic', zh: '高级、电影感' },
      { v: ['energetic'], en: 'Fast and energetic', zh: '快节奏、有冲击力' },
      { v: ['calm', 'technical'], en: 'Calm and clear', zh: '冷静、清晰' },
      { v: ['playful', 'retro'], en: 'Playful', zh: '轻松好玩' },
      { v: ['editorial'], en: 'Editorial and graphic', zh: '杂志感、平面设计感' },
    ],
  },
];

const overlap = (a, b) => a.filter((x) => b.includes(x));

/** Score one style against the answers; returns { score, reasons } or null when unusable. */
function scoreStyle(style, answers, lang) {
  const reasons = [];
  let score = 0;
  const useHit = overlap(answers.use ?? [], style.tags.use);
  if (useHit.length) { score += 4; reasons.push(tagLabel(lang, useHit[0])); }
  if ((answers.use ?? []).includes(style.tags.use[0])) score += 2; // the style's main purpose
  if (style.evidence_strength === 'strong') score += 0.5;
  const aspectHit = overlap(answers.aspect ?? [], style.tags.aspect);
  if (aspectHit.length) { score += 2; reasons.push(aspectHit[0]); }
  else if (answers.aspect?.length) score -= 2;
  const have = answers.have ?? [];
  if (style.tags.needs.includes('footage') && !have.includes('footage')) return null;
  for (const need of style.tags.needs) {
    if (have.includes(need)) { score += 2; reasons.push(tagLabel(lang, need)); }
    else if (need === 'data') score -= 1;
  }
  const audioHit = overlap(answers.audio ?? [], style.tags.audio);
  if (audioHit.length) { score += 2; reasons.push(tagLabel(lang, audioHit[0])); }
  else if (answers.audio?.length) score -= 1;
  const moodHit = overlap(answers.mood ?? [], style.tags.mood);
  if (moodHit.length) { score += moodHit.length; reasons.push(...moodHit.map((m) => tagLabel(lang, m))); }
  return { score, reasons };
}

export function rankStyles(styles, answers, lang, limit = 3) {
  return styles
    .map((style) => ({ style, result: scoreStyle(style, answers, lang) }))
    .filter((x) => x.result)
    .sort((a, b) => b.result.score - a.result.score)
    .slice(0, limit);
}

/** Open the picker dialog. `onOpen(id)` navigates to a style. */
export function openPicker(styles, lang, onOpen) {
  const t = UI[lang];
  const dialog = h('dialog', { class: 'picker', 'aria-label': t.pickerTitle });
  const answers = {};
  let step = 0;

  const close = () => { dialog.close(); dialog.remove(); };

  function renderQuestion(focusIndex = null) {
    const q = QUESTIONS[step];
    const selected = answers[q.key] ?? [];
    const options = q.options.map((opt, index) => {
      const pressed = q.multi
        ? opt.v.length > 0 && opt.v.every((v) => selected.includes(v))
        : answers[`${q.key}:label`] === opt.en;
      return h('button', {
        class: 'option', type: 'button', 'aria-pressed': String(pressed),
        onclick: () => {
          if (q.multi) {
            answers[q.key] = pressed ? selected.filter((v) => !opt.v.includes(v)) : [...selected, ...opt.v];
          } else {
            answers[q.key] = opt.v;
            answers[`${q.key}:label`] = opt.en;
          }
          renderQuestion(index); // re-render keeps focus on the option just chosen
        },
      }, opt[lang]);
    });
    const answered = q.multi || answers[`${q.key}:label`] !== undefined;
    const last = step === QUESTIONS.length - 1;
    const body = h('div', { class: 'picker-inner' },
      h('div', { class: 'picker-step' }, t.pickerStep(step + 1, QUESTIONS.length)),
      h('h2', { tabindex: '-1' }, q.q[lang]),
      h('div', { class: 'options' }, ...options),
      h('div', { class: 'picker-nav' },
        step > 0
          ? h('button', { class: 'ghost', type: 'button', onclick: () => { step -= 1; renderQuestion(); } }, t.backStep)
          : h('button', { class: 'ghost', type: 'button', onclick: close }, t.close),
        h('button', {
          class: 'primary', type: 'button', disabled: !answered,
          onclick: () => { if (last) renderResults(); else { step += 1; renderQuestion(); } },
        }, last ? t.seeResults : t.next),
      ),
    );
    dialog.replaceChildren(body);
    // Same question: return focus to the chosen option. New question: announce it via its heading.
    const focusTarget = focusIndex === null ? body.querySelector('h2') : body.querySelectorAll('.option')[focusIndex];
    focusTarget?.focus();
  }

  function renderResults() {
    const ranked = rankStyles(styles, answers, lang);
    const items = ranked.map(({ style, result }) => h('div', { class: 'result' },
      h('h3', {}, style.name[lang]),
      h('p', {}, style.tagline[lang]),
      h('p', { class: 'why' }, `${t.why}: ${result.reasons.join(', ') || '-'}`),
      h('button', { class: 'open-style', type: 'button', onclick: () => { close(); onOpen(style.id); } }, t.openStyle),
    ));
    dialog.replaceChildren(h('div', { class: 'picker-inner' },
      h('h2', {}, t.results),
      ...items,
      h('div', { class: 'picker-nav' },
        h('button', { class: 'ghost', type: 'button', onclick: () => { step = 0; renderQuestion(); } }, t.restart),
        h('button', { class: 'primary', type: 'button', onclick: close }, t.close),
      ),
    ));
  }

  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  renderQuestion();
  dialog.showModal();
}
