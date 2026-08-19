import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const exists = rel => fs.existsSync(path.join(ROOT, rel));
const fail = msg => errors.push(msg);

const sitemap = read('sitemap.xml');
const robots = read('robots.txt');
const redirects = read('_redirects');
const map = JSON.parse(read('_url-map-i18n.json'));
const invEn = new Map(Object.entries(map.en || {}).map(([ru,en]) => [en,ru]));
const invUk = new Map(Object.entries(map.uk || {}).map(([ru,uk]) => [uk,ru]));

const urls = [...sitemap.matchAll(/<loc>https:\/\/lexonyx\.com\/([^<]+)<\/loc>/g)].map(m => m[1]);
if (urls.length !== 105) fail(`sitemap URL count expected 105, got ${urls.length}`);
if (!/Sitemap:\s*https:\/\/lexonyx\.com\/sitemap\.xml/i.test(robots)) fail('robots.txt does not advertise the canonical sitemap');
if (/Disallow:\s*\//i.test(robots)) fail('robots.txt blocks crawling');

function hreflangMap(html) {
  const out = {};
  const re = /<link\b[^>]*rel=["']alternate["'][^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const tag = m[0];
    const h = (tag.match(/hreflang=["']([^"']+)["']/i) || [])[1];
    const u = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    if (h && u) out[h.toLowerCase()] = u;
  }
  return out;
}
function canonicalLinks(html) {
  const out = [];
  const re = /<link\b[^>]*rel=["']canonical["'][^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const u = (m[0].match(/href=["']([^"']+)["']/i) || [])[1];
    if (u) out.push(u);
  }
  return out;
}
function expectedLangLinks(rel) {
  let ruKey = null;
  if (rel.startsWith('ru/')) ruKey = rel;
  else if (rel.startsWith('en/')) ruKey = invEn.get(rel) || null;
  else if (rel.startsWith('uk/')) ruKey = invUk.get(rel) || null;
  if (!ruKey) return null;
  const en = map.en?.[ruKey], uk = map.uk?.[ruKey];
  if (!en || !uk) return null;
  return {
    ru: `https://lexonyx.com/${ruKey}`,
    en: `https://lexonyx.com/${en}`,
    uk: `https://lexonyx.com/${uk}`,
    'x-default': `https://lexonyx.com/${en}`,
    paths: {ru:'/'+ruKey,en:'/'+en,uk:'/'+uk}
  };
}
function langSwitchHrefs(html, lang) {
  const out = [];
  const re = /<a\b[^>]*class=["'][^"']*lang-option[^"']*["'][^>]*>/gi;
  for (const m of html.matchAll(re)) {
    const tag = m[0];
    const l = (tag.match(/lang=["'](ru|en|uk)["']/i) || [])[1];
    const href = (tag.match(/href=["']([^"']+)["']/i) || [])[1];
    if (l === lang && href) out.push(href);
  }
  return out;
}
function textOfTitle(html) {
  const m = html.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? m[1].replace(/\s+/g,' ').trim() : '';
}
function metaDescription(html) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    if (/name=["']description["']/i.test(tag)) return (tag.match(/content=["']([^"']*)["']/i) || [])[1] || '';
  }
  return '';
}

const titlesByLang = {en:new Map(),ru:new Map(),uk:new Map()};
for (const rel of urls) {
  if (!exists(rel)) { fail(`sitemap target missing: ${rel}`); continue; }
  const html = read(rel);
  const expectedCanonical = `https://lexonyx.com/${rel}`;
  const title = textOfTitle(html);
  const desc = metaDescription(html);
  if (!title) fail(`missing title: ${rel}`);
  if (!desc || desc.length < 50) fail(`missing/too-short meta description: ${rel}`);
  if (/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)) fail(`sitemap URL is noindex: ${rel}`);
  const canon = canonicalLinks(html);
  if (!canon.includes(expectedCanonical)) fail(`self-canonical missing: ${rel}`);
  if (canon.some(x => x !== expectedCanonical)) fail(`conflicting canonical on ${rel}: ${canon.join(', ')}`);
  const exp = expectedLangLinks(rel);
  if (!exp) fail(`sitemap page missing i18n map entry: ${rel}`);
  else {
    const alts = hreflangMap(html);
    for (const l of ['ru','en','uk','x-default']) if (alts[l] !== exp[l]) fail(`hreflang ${l} mismatch: ${rel} -> ${alts[l] || 'missing'} expected ${exp[l]}`);
  }
  if (/\/ru\/search\.html/i.test(html)) fail(`obsolete SearchAction/search URL remains: ${rel}`);
  if (/href=["'][^"']*(?:\/lithuania\.html|\/malta\.html|\/czechia\.html|\/litva\.html|\/chehiya\.html|\/lytva\.html)/i.test(html)) fail(`retired jurisdiction link remains: ${rel}`);

  const lang = rel.split('/')[0];
  if (titlesByLang[lang]) {
    if (!titlesByLang[lang].has(title)) titlesByLang[lang].set(title, []);
    titlesByLang[lang].get(title).push(rel);
  }
}

// Verify the two clusters that were intentionally rewritten now use the full canonical site chrome.
const uiTargets = urls.filter(rel =>
  /^en\/jurisdictions\//.test(rel) || /^ru\/yurisdikcii\//.test(rel) || /^uk\/yurysdyktsiyi\//.test(rel) ||
  /^(?:en|ru|uk)\/(?:privacy-policy|cookie-policy|terms-of-use|impressum|accessibility)\.html$/.test(rel)
);
for (const rel of uiTargets) {
  const html = read(rel);
  for (const needle of ['id="search-toggle"','class="header-lang-switch"','id="mobile-menu-toggle"','id="mobile-menu"','class="footer-disclaimer"','data-cookie-settings']) {
    if (!html.includes(needle)) fail(`non-standard header/footer on ${rel}: missing ${needle}`);
  }
  const exp = expectedLangLinks(rel);
  if (exp) {
    for (const l of ['ru','en','uk']) {
      const hrefs = langSwitchHrefs(html, l);
      if (!hrefs.length) fail(`language switch ${l} missing: ${rel}`);
      for (const href of hrefs) if (href !== exp.paths[l]) fail(`language switch ${l} wrong on ${rel}: ${href} expected ${exp.paths[l]}`);
    }
  }
  if (!/src=["']\/scripts\/ui-runtime\.js["']/i.test(html)) fail(`UI runtime missing: ${rel}`);
}

// Homepage regression guard: RU must never point to /index.html because / is the EN default.
const enHome = read('en/index.html');
const ruHomeSwitches = langSwitchHrefs(enHome, 'ru');
if (!ruHomeSwitches.length || ruHomeSwitches.some(h => h !== '/ru/index.html')) fail(`EN homepage RU switch regression: ${ruHomeSwitches.join(', ') || 'missing'}`);
if (!/"knowsLanguage"\s*:\s*\[[^\]]*"uk"/i.test(enHome)) fail('EN homepage structured data still omits Ukrainian language');
if (/SearchAction|\/ru\/search\.html/i.test(enHome)) fail('EN homepage still exposes invalid SearchAction');

// Internal-link existence check over sitemap pages. Redirected legacy paths are accepted.
const redirectSources = new Set();
for (const line of redirects.split(/\r?\n/)) {
  const t = line.trim();
  if (!t || t.startsWith('#')) continue;
  const first = t.split(/\s+/)[0];
  if (first?.startsWith('/')) redirectSources.add(first);
}
function routeExists(href) {
  let p = href.split('#')[0].split('?')[0];
  if (!p || !p.startsWith('/')) return true;
  if (/^\/(?:images|scripts|fonts|assets)\//.test(p) || /\.(?:css|js|png|jpe?g|svg|ico|webp|pdf|xml|txt|json)$/i.test(p)) return true;
  if (redirectSources.has(p)) return true;
  let rel = p.slice(1);
  if (!rel) rel = 'index.html';
  if (rel.endsWith('/')) rel += 'index.html';
  if (!path.extname(rel)) rel += '/index.html';
  return exists(rel);
}
let brokenInternal = 0;
for (const rel of urls) {
  const html = read(rel);
  for (const m of html.matchAll(/href=["']([^"']+)["']/gi)) {
    const href = m[1];
    if (!href.startsWith('/')) continue;
    if (!routeExists(href)) { brokenInternal++; if (brokenInternal <= 30) fail(`broken internal link: ${rel} -> ${href}`); }
  }
}

for (const [lang, byTitle] of Object.entries(titlesByLang)) {
  for (const [title, rels] of byTitle) if (rels.length > 1) warnings.push(`duplicate ${lang} title: "${title}" on ${rels.join(', ')}`);
}

if (warnings.length) {
  console.log('[LEXONYX SEO/UI audit] warnings:');
  for (const w of warnings.slice(0,40)) console.log(' - ' + w);
}
if (errors.length) {
  console.error(`[LEXONYX SEO/UI audit] FAILED with ${errors.length} issue(s):`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`[LEXONYX SEO/UI audit] PASS — sitemap=${urls.length}, UI targets=${uiTargets.length}, broken internal links=${brokenInternal}`);
