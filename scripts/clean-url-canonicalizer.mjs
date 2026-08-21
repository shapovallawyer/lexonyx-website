import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'https://lexonyx.com';
const MAP_PATH = path.join(ROOT, '_url-map-i18n.json');
const SITEMAP_PATH = path.join(ROOT, 'sitemap.xml');
const REDIRECTS_PATH = path.join(ROOT, '_redirects');
const map = JSON.parse(fs.readFileSync(MAP_PATH, 'utf8'));

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function cleanRel(rel) {
  if (rel.endsWith('/index.html')) return rel.slice(0, -'index.html'.length);
  if (rel.endsWith('.html')) return rel.slice(0, -'.html'.length);
  return rel;
}
function cleanPath(rel) { return '/' + cleanRel(rel); }

const families = [];
for (const [ru, en] of Object.entries(map.en || {})) {
  if (!ru.startsWith('ru/')) continue;
  const uk = map.uk?.[ru];
  if (!uk) throw new Error(`Missing UK counterpart for ${ru}`);
  families.push({ ru, en, uk });
}
if (families.length !== 55) throw new Error(`Expected 55 families, found ${families.length}`);

const canonicalRels = [];
for (const lang of ['ru', 'en', 'uk']) for (const family of families) canonicalRels.push(family[lang]);
if (canonicalRels.length !== 165 || new Set(canonicalRels).size !== 165) {
  throw new Error('Canonical family set must contain 165 unique source paths');
}

const replacements = [];
for (const rel of canonicalRels) {
  const fromPath = '/' + rel;
  const toPath = cleanPath(rel);
  replacements.push([BASE + fromPath, BASE + toPath], [fromPath, toPath]);
}
replacements.sort((a, b) => b[0].length - a[0].length);

let changedFiles = 0;
for (const lang of ['ru', 'en', 'uk']) {
  for (const file of walkHtml(path.join(ROOT, lang))) {
    const before = fs.readFileSync(file, 'utf8');
    let after = before;
    for (const [from, to] of replacements) after = after.split(from).join(to);
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changedFiles++;
    }
  }
}

const sitemapLines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
];
for (const lang of ['ru', 'en', 'uk']) {
  for (const family of families) sitemapLines.push(`  <url><loc>${BASE}${cleanPath(family[lang])}</loc></url>`);
  sitemapLines.push('');
}
sitemapLines.pop();
sitemapLines.push('</urlset>', '');
fs.writeFileSync(SITEMAP_PATH, sitemapLines.join('\n'), 'utf8');

let redirects = fs.readFileSync(REDIRECTS_PATH, 'utf8');
redirects = redirects.replace(/# BEGIN CLEAN CANONICAL URLS[\s\S]*?# END CLEAN CANONICAL URLS\n?/g, '');
redirects = redirects.replace(/^\/\s+\/en\/index\.html\s+301!\s*\n?/m, '');
redirects = redirects.replace(/^\/en\/work-formats\/external-legal-function\.html\s+\/en\/expertise\/external-legal-function\.html\s+200!\s*\n?/m, '');

const block = [];
block.push('# BEGIN CLEAN CANONICAL URLS');
block.push('# Canonical public URLs are extensionless; directory index pages use a trailing slash.');
block.push('# IMPORTANT: do not force index.html -> directory redirects on Netlify; directory file resolution can re-enter forced rules.');
block.push('/                               /en/                                                       301!');
// Non-index HTML pages redirect safely to their extensionless canonical routes.
for (const rel of canonicalRels.filter(r => !r.endsWith('/index.html'))) {
  block.push(`${'/' + rel}  ${cleanPath(rel)}  301!`);
}
// Directory aliases without the trailing slash normalize to the clean directory route.
for (const rel of canonicalRels.filter(r => r.endsWith('/index.html'))) {
  const clean = cleanPath(rel);
  const noSlash = clean.replace(/\/$/, '');
  if (noSlash && noSlash !== clean) block.push(`${noSlash}  ${clean}  301!`);
}
// Canonical EN route is backed by a legacy physical source file.
block.push('/en/work-formats/external-legal-function  /en/expertise/external-legal-function.html  200!');
block.push('# END CLEAN CANONICAL URLS');
block.push('');

const firstNl = redirects.indexOf('\n');
redirects = firstNl >= 0
  ? redirects.slice(0, firstNl + 1) + block.join('\n') + redirects.slice(firstNl + 1)
  : redirects + '\n' + block.join('\n');
fs.writeFileSync(REDIRECTS_PATH, redirects, 'utf8');

console.log(`[LEXONYX clean URL canonicalizer] PASS — canonical URLs=165, HTML files updated=${changedFiles}, sitemap=clean, redirects=managed without index-loop rules`);
