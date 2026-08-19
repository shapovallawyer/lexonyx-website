import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RU_ROOT = path.join(ROOT, 'ru');
const allowedAllCaps = new Set(['НДС','КИК','РРТ','СИДН','ЕС','ОАЭ','ООО']);
const errors = [];

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(p));
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function strip(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function seoText(html) {
  const values = [];
  const patterns = [
    /<title>([\s\S]*?)<\/title>/gi,
    /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/gi,
    /<meta\b[^>]*property=["']og:(?:title|description)["'][^>]*content=["']([^"']*)["'][^>]*>/gi,
    /<meta\b[^>]*name=["']twitter:(?:title|description)["'][^>]*content=["']([^"']*)["'][^>]*>/gi
  ];
  for (const re of patterns) for (const m of html.matchAll(re)) values.push(strip(m[1]));
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      const walkJson = v => {
        if (Array.isArray(v)) return v.forEach(walkJson);
        if (!v || typeof v !== 'object') return;
        for (const [k,val] of Object.entries(v)) {
          if (['name','description','text','headline'].includes(k) && typeof val === 'string') values.push(val);
          else if (val && typeof val === 'object') walkJson(val);
        }
      };
      walkJson(data);
    } catch {}
  }
  return values.join(' ');
}

for (const file of walk(RU_ROOT)) {
  const rel = path.relative(ROOT, file).replaceAll(path.sep, '/');
  const html = fs.readFileSync(file, 'utf8');
  const body = (html.match(/<body\b[\s\S]*?<\/body>/i) || [''])[0];
  const text = `${strip(body)} ${seoText(html)}`.replace(/\s+/g, ' ').trim();
  const words = text.match(/[А-ЯЁа-яё-]+/g) || [];
  for (const word of words) {
    if (allowedAllCaps.has(word)) continue;
    if (/^[А-ЯЁ]{2,}[а-яё]/.test(word)) errors.push(`${rel}: malformed capitalization: ${word}`);
  }
}

if (errors.length) {
  console.error(`[LEXONYX RU capitalization audit] FAILED — ${errors.length} issue(s):`);
  for (const e of errors.slice(0,300)) console.error(' - ' + e);
  process.exit(1);
}

console.log(`[LEXONYX RU capitalization audit] PASS`);
