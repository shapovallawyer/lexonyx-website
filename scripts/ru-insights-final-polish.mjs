import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const targets = [
  'ru/insayty/razbory/deep-dive-banking-readiness.html',
  'ru/insayty/razbory/deep-dive-vat-architecture.html',
  'ru/insayty/instrumenty/checklists.html',
  'ru/insayty/instrumenty/checklist-substance.html'
];

const pairs = [
  ['Source of funds', 'Происхождение средств'],
  ['source of funds', 'происхождение средств'],
  ['BANKING', 'БАНКОВСКАЯ СФЕРА'],
  ['FE', 'постоянное место ведения деятельности'],
  ['transfer pricing', 'трансфертное ценообразование'],
  ['Transfer pricing', 'Трансфертное ценообразование'],
  ['Signals', 'Сигналы'],
  ['signals', 'сигналы'],
  ['evidence', 'доказательства'],
  ['Evidence', 'Доказательства'],
  ['documentation', 'документация'],
  ['Documentation', 'Документация'],
  ['defendable', 'защищаемый'],
  ['Defendable', 'Защищаемый'],
  ['advisory-', 'консультационный '],
  ['Advisory-', 'Консультационный '],
  ['brand', 'бренд'],
  ['Brand', 'Бренд'],
  ['cookie', 'файлы браузера'],
  ['Cookie', 'Файлы браузера'],
  ['’s', ''],
  ["'s", '']
];

function cleanText(text) {
  let out = text;
  for (const [from,to] of pairs) out = out.split(from).join(to);
  out = out
    .replace(/\bs\b/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1');
  return out;
}

function cleanJsonLd(html) {
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (all, open, body, close) => {
    try {
      const data = JSON.parse(body);
      const walk = value => {
        if (Array.isArray(value)) return value.map(walk);
        if (value && typeof value === 'object') {
          for (const key of Object.keys(value)) value[key] = walk(value[key]);
          return value;
        }
        if (typeof value === 'string' && !/^https?:\/\//i.test(value)) return cleanText(value);
        return value;
      };
      return open + JSON.stringify(walk(data), null, 2) + close;
    } catch { return all; }
  });
}

for (const rel of targets) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  const held = [];
  html = html.replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi, block => {
    held.push(block);
    return `__LEXONYX_HELD_${held.length - 1}__`;
  });
  html = html.replace(/>([^<>]+)</g, (m, text) => `>${cleanText(text)}<`);
  html = html.replace(/(<meta\b[^>]*\bcontent=["'])([^"']*)(["'][^>]*>)/gi, (m, a, value, b) => a + cleanText(value) + b);
  html = html.replace(/__LEXONYX_HELD_(\d+)__/g, (_, i) => held[Number(i)]);
  html = cleanJsonLd(html);
  fs.writeFileSync(file, html, 'utf8');
}

console.log('[LEXONYX RU insights final polish] PASS');
