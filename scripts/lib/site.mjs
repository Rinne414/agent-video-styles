// Build the static gallery into site/dist from data/ and previews/.
import { readFile, writeFile, mkdir, cp, rm, access } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
import { Marked } from 'marked';

const exists = (p) => access(p).then(() => true, () => false);

const INSTALL = [
  '# Claude Code: install the skill for your user',
  'cp -r skill ~/.claude/skills/agent-video-styles',
  '',
  '# then, in any project',
  'claude "Make a 30 second launch video for my app, accent #6366F1"',
].join('\n');

const COLOPHON = {
  en: 'Recipes and code: MIT. Previews are rendered from the templates in this repository. Creator links point to public posts; their work belongs to them.',
  zh: '配方与代码采用 MIT 授权。预览由本仓库的模板渲染。创作者链接指向公开内容，作品版权归原作者所有。',
};

// Markdown from this repo is trusted, but raw HTML and non-http links are still stripped as a precaution.
const escapeHtml = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const marked = new Marked({
  renderer: {
    html: ({ text }) => escapeHtml(text),
    link({ href, tokens }) {
      const label = this.parser.parseInline(tokens);
      return /^(https?:\/\/|#|\.{0,2}\/)/.test(href) ? `<a href="${escapeHtml(href)}" rel="noopener">${label}</a>` : label;
    },
  },
});

/** The fenced block under "## Agent brief" is the copy-paste brief. */
function extractBrief(markdown) {
  const match = markdown.match(/## Agent brief[^\n]*\n[\s\S]*?```[a-z]*\n([\s\S]*?)```/);
  return match ? match[1].trimEnd() : null;
}

async function loadTools(root) {
  const file = path.join(root, 'data', 'tools.yaml');
  return (await exists(file)) ? YAML.parse(await readFile(file, 'utf8')) ?? [] : [];
}

// families.yaml is validated in load.mjs (checkFamilies) before any file is written.
async function loadFamilies(root) {
  return YAML.parse(await readFile(path.join(root, 'data', 'families.yaml'), 'utf8'));
}

function siteStyle(style) {
  const { recipe, hasTemplate, hasPreview, ...meta } = style;
  return {
    ...meta,
    brief: extractBrief(recipe),
    recipeHtml: marked.parse(recipe),
    preview: hasPreview ? `previews/${style.id}.mp4` : null,
    poster: hasPreview ? `previews/${style.id}.webp` : null,
  };
}

export async function buildSite(root, styles, candidates) {
  const dist = path.join(root, 'site', 'dist');
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(path.join(root, 'site', 'src'), dist, { recursive: true });
  if (await exists(path.join(root, 'previews'))) {
    await cp(path.join(root, 'previews'), path.join(dist, 'previews'), { recursive: true });
  }
  const data = {
    families: await loadFamilies(root),
    styles: styles.map(siteStyle),
    candidates,
    tools: await loadTools(root),
    install: INSTALL,
    colophon: COLOPHON,
  };
  await writeFile(path.join(dist, 'data.json'), JSON.stringify(data));
  console.log(`Built site/dist (${styles.length} styles, ${data.tools.length} tools)`);
}
