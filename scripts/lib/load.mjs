// Load and validate style metadata (data/styles/*.yaml) and the v2 candidate list.
import { readFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export const TOOLS = ['remotion', 'hyperframes', 'manim', 'html-capture', 'motion-canvas'];
const TIERS = ['core'];
const STRENGTHS = ['strong', 'medium'];
const VERIFIED = ['opened', 'aggregator', 'snippet'];
const TAG_KEYS = ['use', 'platform', 'aspect', 'audio', 'mood', 'needs'];
const MIN_EVIDENCE = 2;

const exists = (p) => access(p).then(() => true, () => false);

function checkBilingual(errors, id, key, value, kind = 'string') {
  for (const lang of ['en', 'zh']) {
    const v = value?.[lang];
    const ok = kind === 'list' ? Array.isArray(v) && v.length > 0 : typeof v === 'string' && v.trim();
    if (!ok) errors.push(`${id}: ${key}.${lang} must be a non-empty ${kind}`);
  }
}

function validateStyle(style, fileId) {
  const errors = [];
  const id = style?.id ?? fileId;
  if (style.id !== fileId) errors.push(`${fileId}: id "${style.id}" does not match file name`);
  if (!TIERS.includes(style.tier)) errors.push(`${id}: tier must be one of ${TIERS}`);
  if (!STRENGTHS.includes(style.evidence_strength)) errors.push(`${id}: evidence_strength must be one of ${STRENGTHS}`);
  checkBilingual(errors, id, 'name', style.name);
  checkBilingual(errors, id, 'tagline', style.tagline);
  for (const key of ['signature', 'best_for', 'avoid_when']) checkBilingual(errors, id, key, style[key], 'list');
  for (const key of TAG_KEYS) {
    if (!Array.isArray(style.tags?.[key])) errors.push(`${id}: tags.${key} must be a list`);
  }
  if (!style.duration) errors.push(`${id}: duration is required`);
  if (![1, 2, 3].includes(style.difficulty)) errors.push(`${id}: difficulty must be 1, 2 or 3`);
  if (!TOOLS.includes(style.tools?.primary)) errors.push(`${id}: tools.primary must be one of ${TOOLS}`);
  for (const alt of style.tools?.alternatives ?? []) {
    if (!TOOLS.includes(alt)) errors.push(`${id}: unknown alternative tool "${alt}"`);
  }
  checkBilingual(errors, id, 'tools.why', style.tools?.why);
  for (const v of style.variants ?? []) {
    if (!v.id || !v.en || !v.zh) errors.push(`${id}: every variant needs id, en, zh`);
  }
  const evidence = style.evidence ?? [];
  if (evidence.length < MIN_EVIDENCE) errors.push(`${id}: needs at least ${MIN_EVIDENCE} evidence entries`);
  for (const e of evidence) {
    if (!e.url?.startsWith('http')) errors.push(`${id}: evidence "${e.creator}" has no valid url`);
    if (!VERIFIED.includes(e.verified)) errors.push(`${id}: evidence "${e.creator}" verified must be one of ${VERIFIED}`);
  }
  if (style.template !== `templates/${id}`) errors.push(`${id}: template must be templates/${id}`);
  return errors;
}

export async function loadStyles(root) {
  const dir = path.join(root, 'data', 'styles');
  const files = (await readdir(dir)).filter((f) => f.endsWith('.yaml')).sort();
  const styles = [];
  const errors = [];
  for (const file of files) {
    const fileId = path.basename(file, '.yaml');
    let style;
    try {
      style = YAML.parse(await readFile(path.join(dir, file), 'utf8'));
    } catch (err) {
      errors.push(`${fileId}: invalid YAML (${err.message.split('\n')[0]})`);
      continue;
    }
    if (!style || typeof style !== 'object') {
      errors.push(`${fileId}: file is empty or not a mapping`);
      continue;
    }
    const styleErrors = validateStyle(style, fileId);
    errors.push(...styleErrors);
    const recipePath = path.join(root, 'skill', 'references', 'styles', `${fileId}.md`);
    if (!(await exists(recipePath))) errors.push(`${fileId}: missing skill/references/styles/${fileId}.md`);
    else style.recipe = (await readFile(recipePath, 'utf8')).replace(/\r\n/g, '\n');
    style.hasTemplate = await exists(path.join(root, 'templates', fileId));
    style.hasPreview = await exists(path.join(root, 'previews', `${fileId}.mp4`));
    if (styleErrors.length === 0) styles.push(style);
  }
  errors.push(...(await checkReferences(root, styles)));
  errors.push(...(await checkFamilies(root, styles)));
  return { styles, errors };
}

/** Every core style must appear in exactly one gallery family (data/families.yaml). */
async function checkFamilies(root, styles) {
  const families = YAML.parse(await readFile(path.join(root, 'data', 'families.yaml'), 'utf8')) ?? [];
  const listed = families.flatMap((f) => f.ids ?? []);
  const ids = styles.map((s) => s.id);
  const errors = [];
  for (const id of ids) {
    const count = listed.filter((x) => x === id).length;
    if (count !== 1) errors.push(`families.yaml: "${id}" appears ${count} times (expected once)`);
  }
  for (const id of listed) {
    if (!ids.includes(id)) errors.push(`families.yaml: unknown style "${id}"`);
  }
  return errors;
}

/** avoid_when may only point at core styles, never at drafts or candidates. */
async function checkReferences(root, styles) {
  const core = new Set(styles.map((s) => s.id));
  const nonCore = (await loadCandidates(root)).map((c) => c.id).filter((id) => !core.has(id));
  const errors = [];
  for (const s of styles) {
    const text = [...(s.avoid_when.en ?? []), ...(s.avoid_when.zh ?? [])].join(' ');
    for (const id of nonCore) {
      if (new RegExp(`\\b${id}\\b`).test(text)) errors.push(`${s.id}: avoid_when references non-core style "${id}"`);
    }
  }
  return errors;
}

export async function loadCandidates(root) {
  const text = await readFile(path.join(root, 'data', 'candidates.yaml'), 'utf8');
  return YAML.parse(text) ?? [];
}
