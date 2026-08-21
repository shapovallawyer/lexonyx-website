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

// Upgrade the second EN journey to the commercial client-situation name,
// regardless of the exact legacy wording generated earlier in the build.
const enHomePath = path.join(ROOT, 'en/index.html');
let enHome = fs.readFileSync(enHomePath, 'utf8');
const cardRx = /<article\b[^>]*>[\s\S]*?data-funnel-journey=["']founder-owner-relocation["'][\s\S]*?<\/article>/i;
const cardMatch = enHome.match(cardRx);
if (!cardMatch) throw new Error('EN homepage founder relocation journey card missing');
const upgradedCard = cardMatch[0].replace(/<h3\b[^>]*>[\s\S]*?<\/h3>/i, '<h3>Founder Mobility &amp; Business Relocation</h3>');
enHome = enHome.replace(cardRx, upgradedCard);
fs.writeFileSync(enHomePath, enHome, 'utf8');

console.log('[LEXONYX relocation route postfix] hreflang graph normalized and EN homepage relocation title upgraded');
