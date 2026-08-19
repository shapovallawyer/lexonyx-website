import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const mapPath = path.join(ROOT, '_url-map-i18n.json');
const sitemapPath = path.join(ROOT, 'sitemap.xml');
const redirectsPath = path.join(ROOT, '_redirects');

const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const families = [];

for (const [ru, en] of Object.entries(map.en || {})) {
  if (!ru.startsWith('ru/')) continue;
  const uk = map.uk?.[ru];
  if (!uk) throw new Error(`Missing UK counterpart for canonical RU page: ${ru}`);
  families.push({ ru, en, uk });
}

if (families.length !== 55) {
  throw new Error(`Expected 55 canonical multilingual families, found ${families.length}`);
}

const urls = [];
for (const lang of ['ru', 'en', 'uk']) {
  for (const family of families) urls.push(family[lang]);
}

if (new Set(urls).size !== urls.length) {
  throw new Error('Duplicate canonical URL detected while generating sitemap');
}

const retired = /(?:czechia|lithuania|malta|chehiya|litva|lytva)/i;
const retiredUrls = urls.filter(url => retired.test(url));
if (retiredUrls.length) {
  throw new Error(`Retired jurisdiction URL entered canonical sitemap set: ${retiredUrls.join(', ')}`);
}

const groups = ['ru', 'en', 'uk'].map(lang => families.map(family => family[lang]));
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];

for (const group of groups) {
  for (const rel of group) {
    lines.push(`  <url><loc>https://lexonyx.com/${rel}</loc></url>`);
  }
  lines.push('');
}
lines.pop();
lines.push('</urlset>', '');
fs.writeFileSync(sitemapPath, lines.join('\n'));

let redirects = fs.readFileSync(redirectsPath, 'utf8');
const temporaryRoot = /^\/\s+\/en\/index\.html\s+302!\s*$/m;
const permanentRoot = /^\/\s+\/en\/index\.html\s+301!\s*$/m;

if (temporaryRoot.test(redirects)) {
  redirects = redirects.replace(temporaryRoot, '/                               /en/index.html                                                301!');
  redirects = redirects.replace(
    '# Root language entry — temporary default to EN; forced so the legacy root index.html is not served.',
    '# Root language entry — permanent default to EN; forced so the legacy root index.html is not served.'
  );
  fs.writeFileSync(redirectsPath, redirects);
} else if (!permanentRoot.test(redirects)) {
  throw new Error('Canonical root redirect to /en/index.html is missing');
}

console.log(`[LEXONYX final SEO source normalizer] PASS — sitemap URLs=${urls.length}, families=${families.length}, root redirect=301`);
