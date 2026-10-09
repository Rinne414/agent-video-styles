// Tiny DOM builder: h('a', { href, onclick }, 'text', child). Text is always set as text, never HTML.
export function h(tag, attrs = {}, ...children) {
  const el = document.createElementNS(
    tag === 'svg' || tag === 'ellipse' ? 'http://www.w3.org/2000/svg' : 'http://www.w3.org/1999/xhtml',
    tag,
  );
  for (const [key, value] of Object.entries(attrs)) {
    if (value === undefined || value === null || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
    else if (value === true) el.setAttribute(key, '');
    else el.setAttribute(key, String(value));
  }
  for (const child of children.flat()) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return el;
}

/** Only allow http(s) links from data files. */
export const safeUrl = (url) => (/^https?:\/\//.test(url ?? '') ? url : null);
