import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'https://lexonyx.com';
const routes = {
  en: 'en/founder-mobility-business-relocation.html',
  ru: 'ru/pereezd-sobstvennika-i-biznesa.html',
  uk: 'uk/pereyizd-vlasnyka-i-biznesu.html'
};
const clean = {
  en: '/en/founder-mobility-business-relocation',
  ru: '/ru/pereezd-sobstvennika-i-biznesa',
  uk: '/uk/pereyizd-vlasnyka-i-biznesu'
};
const block = `\n  <link rel="alternate" hreflang="ru" href="${BASE}${clean.ru}" />\n  <link rel="alternate" hreflang="en" href="${BASE}${clean.en}" />\n  <link rel="alternate" hreflang="uk" href="${BASE}${clean.uk}" />\n  <link rel="alternate" hreflang="x-default" href="${BASE}${clean.en}" />`;

for (const [lang, rel] of Object.entries(routes)) {
  const file = path.join(ROOT, rel);
  let html = fs.readFileSync(file, 'utf8');
  html = html.replace(/<link\b(?=[^>]*rel=["']alternate["'])[^>]*>\s*/gi, '');
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
  if (!canonical) throw new Error(`${lang}: canonical missing before hreflang postfix`);
  html = html.replace(canonical, canonical + block);
  fs.writeFileSync(file, html, 'utf8');
}
console.log('[LEXONYX relocation route postfix] hreflang graph normalized on RU/EN/UK route pages');
