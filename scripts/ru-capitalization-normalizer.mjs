import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RU_ROOT = path.join(ROOT, 'ru');
const protectedAllCaps = new Set(['НДС','КИК','РРТ','СИДН','ЕС','ОАЭ','ООО']);

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function normalizeBrokenCaps(text) {
  return text.replace(/(^|[^А-ЯЁа-яё])([А-ЯЁ])([А-ЯЁ])(?=[а-яё])/g, (m, prefix, first, second, offset, whole) => {
    const tail = whole.slice(offset + m.length - 1).match(/^[а-яё-]*/)?.[0] || '';
    const candidate = first + second + tail;
    if (protectedAllCaps.has(candidate)) return m;
    return prefix + first + second.toLowerCase();
  });
}

function normalizeJsonLd(html) {
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (all, open, body, close) => {
    try {
      const data = JSON.parse(body);
      const walkJson = value => {
        if (Array.isArray(value)) return value.map(walkJson);
        if (value && typeof value === 'object') {
          for (const key of Object.keys(value)) value[key] = walkJson(value[key]);
          return value;
        }
        if (typeof value === 'string' && !/^https?:\/\//i.test(value)) return normalizeBrokenCaps(value);
        return value;
      };
      return open + JSON.stringify(walkJson(data), null, 2) + close;
    } catch {
      return all;
    }
  });
}

let changed = 0;
for (const file of walk(RU_ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;

  html = normalizeJsonLd(html);

  const held = [];
  html = html.replace(/<(?:script|style|svg)\b[\s\S]*?<\/(?:script|style|svg)>/gi, block => {
    held.push(block);
    return `__RU_CAP_HELD_${held.length - 1}__`;
  });
  html = normalizeBrokenCaps(html);
  html = html.replace(/__RU_CAP_HELD_(\d+)__/g, (_, i) => held[Number(i)]);

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU capitalization normalizer] PASS — changed=${changed}`);
