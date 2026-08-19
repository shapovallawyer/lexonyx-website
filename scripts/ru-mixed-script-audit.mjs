import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const ruUrls = [...sitemap.matchAll(/<loc>https:\/\/lexonyx\.com\/(ru\/[^<]+)<\/loc>/g)].map(m => m[1]);
const errors = [];

function visibleText(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ');
}

for (const rel of ruUrls) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const text = visibleText(fs.readFileSync(file, 'utf8'));
  const tokens = text.match(/[A-Za-zА-Яа-яЁё][A-Za-zА-Яа-яЁё-]*/g) || [];
  const bad = [...new Set(tokens.filter(t => /[A-Za-z]/.test(t) && /[А-Яа-яЁё]/.test(t)))];
  if (bad.length) errors.push(`${rel}: ${bad.slice(0,12).join(', ')}`);
}

if (errors.length) {
  console.error(`[LEXONYX RU mixed-script audit] FAILED — ${errors.length} page(s) contain Cyrillic/Latin corruption:`);
  for (const e of errors.slice(0,80)) console.error(' - ' + e);
  process.exit(1);
}
console.log('[LEXONYX RU mixed-script audit] PASS');
