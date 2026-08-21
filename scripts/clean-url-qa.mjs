import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'https://lexonyx.com';
const map = JSON.parse(fs.readFileSync(path.join(ROOT, '_url-map-i18n.json'), 'utf8'));

function cleanRel(rel) {
  if (rel.endsWith('/index.html')) return rel.slice(0, -'index.html'.length);
  if (rel.endsWith('.html')) return rel.slice(0, -'.html'.length);
  return rel;
}
function cleanPath(rel) { return '/' + cleanRel(rel); }
function physicalPath(rel) {
  if (rel === 'en/work-formats/external-legal-function.html') return 'en/expertise/external-legal-function.html';
  return rel;
}
function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}=["']([^"']+)["']`, 'i'));
  return m?.[1] || null;
}
function escRe(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const families = [];
for (const [ru, en] of Object.entries(map.en || {})) {
  if (!ru.startsWith('ru/')) continue;
  const uk = map.uk?.[ru];
  if (!uk) throw new Error(`Missing UK counterpart for ${ru}`);
  families.push({ ru, en, uk });
}
if (families.length !== 55) throw new Error(`Expected 55 families, found ${families.length}`);

const expectedUrls = [];
for (const lang of ['ru', 'en', 'uk']) for (const family of families) expectedUrls.push(BASE + cleanPath(family[lang]));
if (new Set(expectedUrls).size !== 165) throw new Error('Expected 165 unique clean canonical URLs');

const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (sitemapUrls.length !== 165) throw new Error(`Sitemap expected 165 URLs, found ${sitemapUrls.length}`);
if (sitemapUrls.some(u => u.endsWith('.html'))) throw new Error('Sitemap still contains .html canonical URLs');
const missing = expectedUrls.filter(u => !sitemapUrls.includes(u));
const extra = sitemapUrls.filter(u => !expectedUrls.includes(u));
if (missing.length || extra.length) throw new Error(`Sitemap mismatch. Missing=${missing.slice(0,5)} Extra=${extra.slice(0,5)}`);

const failures = [];
for (const family of families) {
  const expected = { ru: BASE + cleanPath(family.ru), en: BASE + cleanPath(family.en), uk: BASE + cleanPath(family.uk) };
  for (const lang of ['ru', 'en', 'uk']) {
    const rel = family[lang];
    const file = path.join(ROOT, physicalPath(rel));
    if (!fs.existsSync(file)) { failures.push(`${rel}: physical file missing`); continue; }
    const html = fs.readFileSync(file, 'utf8');
    const canonicalTag = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)?.[0];
    const canonical = canonicalTag ? attr(canonicalTag, 'href') : null;
    if (canonical !== expected[lang]) failures.push(`${rel}: canonical=${canonical} expected=${expected[lang]}`);

    const alts = [...html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["'](ru|en|uk|x-default)["'][^>]*>/gi)];
    const got = {};
    for (const m of alts) got[m[1].toLowerCase()] = attr(m[0], 'href');
    const wanted = { ru: expected.ru, en: expected.en, uk: expected.uk, 'x-default': expected.en };
    for (const [code, url] of Object.entries(wanted)) if (got[code] !== url) failures.push(`${rel}: hreflang ${code}=${got[code]} expected=${url}`);
  }
}

const canonicalSourcePaths = [];
for (const family of families) for (const lang of ['ru','en','uk']) canonicalSourcePaths.push('/' + family[lang]);
for (const lang of ['ru','en','uk']) {
  const stack = [path.join(ROOT, lang)];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) stack.push(p);
      else if (ent.isFile() && ent.name.endsWith('.html')) {
        const html = fs.readFileSync(p, 'utf8');
        for (const oldPath of canonicalSourcePaths) {
          if (html.includes(`href="${oldPath}"`) || html.includes(`href='${oldPath}'`)) {
            failures.push(`${path.relative(ROOT,p)}: internal canonical href still uses ${oldPath}`);
            break;
          }
        }
      }
    }
  }
}

const redirects = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8');
if (!redirects.includes('# BEGIN CLEAN CANONICAL URLS') || !redirects.includes('# END CLEAN CANONICAL URLS')) failures.push('_redirects: managed clean canonical block missing');
if (!/^\/\s+\/en\/\s+301!\s*$/m.test(redirects)) failures.push('_redirects: root must 301 to /en/');

for (const family of families) {
  for (const lang of ['ru','en','uk']) {
    const rel = family[lang];
    const oldPath = '/' + rel;
    const clean = cleanPath(rel);
    if (rel.endsWith('/index.html')) {
      // No explicit redirect rules at all for index-backed directory routes: Netlify resolves these natively.
      const oldRx = new RegExp(`^${escRe(oldPath)}\\s+`, 'm');
      if (oldRx.test(redirects)) failures.push(`_redirects: unsafe explicit index route rule present: ${oldPath}`);
      const noSlash = clean.replace(/\/$/, '');
      if (noSlash && noSlash !== clean) {
        const aliasRx = new RegExp(`^${escRe(noSlash)}\\s+`, 'm');
        if (aliasRx.test(redirects)) failures.push(`_redirects: unsafe explicit directory alias rule present: ${noSlash}`);
      }
    } else {
      const rx = new RegExp(`^${escRe(oldPath)}\\s+${escRe(clean)}\\s+301!\\s*$`, 'm');
      if (!rx.test(redirects)) failures.push(`_redirects: missing ${oldPath} -> ${clean} 301!`);
    }
  }
}

if (!/^\/en\/work-formats\/external-legal-function\s+\/en\/expertise\/external-legal-function\.html\s+200!\s*$/m.test(redirects)) failures.push('_redirects: canonical External Legal Function rewrite missing');

if (failures.length) {
  console.error('[LEXONYX clean URL QA] FAIL');
  for (const f of failures.slice(0, 100)) console.error(' - ' + f);
  process.exit(1);
}
console.log('[LEXONYX clean URL QA] PASS — 165 clean canonicals, sitemap/hreflang parity, internal hrefs clean, directory routes rely on native Netlify resolution');
