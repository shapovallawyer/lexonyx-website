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

let changed = 0;
for (const file of walk(RU_ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
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
