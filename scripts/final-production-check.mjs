import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];
const warnings = [];

function read(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { errors.push(`missing file: ${rel}`); return ''; }
  return fs.readFileSync(p, 'utf8');
}
function assert(cond, msg) { if (!cond) errors.push(msg); }
function allHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) allHtml(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const redirects = read('_redirects');
const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>https:\/\/lexonyx\.com\/([^<]+)<\/loc>/g)].map(m => m[1]);
assert(urls.length > 80, `sitemap unexpectedly small: ${urls.length}`);
for (const rel of urls) {
  const physical = fs.existsSync(path.join(ROOT, rel));
  const escaped = ('/' + rel).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const backedByRedirect = new RegExp(`^${escaped}\\s+\\S+\\s+(?:200!?|301!?|302!?)$`, 'm').test(redirects);
  assert(physical || backedByRedirect, `sitemap target missing and not rewrite-backed: ${rel}`);
}

const retired = /(lithuania|malta|czechia|\/litva\.html|\/chehiya\.html|\/lytva\.html)/i;
assert(!retired.test(sitemap), 'retired jurisdiction remains in sitemap');

for (const lang of ['en', 'ru', 'uk']) {
  const countryDir = lang === 'en' ? 'en/jurisdictions' : (lang === 'ru' ? 'ru/yurisdikcii' : 'uk/yurysdyktsiyi');
  const expected = lang === 'en'
    ? ['ukraine.html','germany.html','cyprus.html','poland.html','netherlands.html','uae.html','estonia.html','ireland.html','united-kingdom.html','switzerland.html']
    : lang === 'ru'
      ? ['ukraina.html','germaniya.html','kipr.html','polsha.html','niderlandy.html','oae.html','estoniya.html','irlandiya.html','velikobritaniya.html','shveycariya.html']
      : ['ukrayina.html','nimechchyna.html','kipr.html','polshcha.html','niderlandy.html','oae.html','estoniya.html','irlandiya.html','velykobrytaniya.html','shveytsariya.html'];
  for (const f of expected) {
    const html = read(`${countryDir}/${f}`);
    assert(html.includes('lx-compliance-perimeter'), `professional perimeter missing: ${countryDir}/${f}`);
  }
}

const all = [...allHtml(path.join(ROOT, 'en')), ...allHtml(path.join(ROOT, 'ru')), ...allHtml(path.join(ROOT, 'uk'))];
let retiredLinks = 0;
let invalidSearch = 0;
for (const file of all) {
  const html = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file).split(path.sep).join('/');
  retiredLinks += (html.match(/href=["'][^"']*(?:lithuania|malta|czechia|\/litva\.html|\/chehiya\.html|\/lytva\.html)[^"']*["']/gi) || []).length;
  invalidSearch += (html.match(/\/ru\/search\.html/gi) || []).length;
  if (/<link\b[^>]*hreflang=["']en["'][^>]*>/i.test(html) && /<link\b[^>]*hreflang=["']x-default["'][^>]*>/i.test(html)) {
    const en = (html.match(/<link\b[^>]*hreflang=["']en["'][^>]*href=["']([^"']+)["'][^>]*>/i) || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*hreflang=["']en["'][^>]*>/i) || [])[1];
    const xd = (html.match(/<link\b[^>]*hreflang=["']x-default["'][^>]*href=["']([^"']+)["'][^>]*>/i) || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*hreflang=["']x-default["'][^>]*>/i) || [])[1];
    if (en && xd && en !== xd) errors.push(`x-default mismatch: ${rel}`);
  }
}
assert(retiredLinks === 0, `retired jurisdiction links remain in deployed HTML: ${retiredLinks}`);
assert(invalidSearch === 0, `invalid /ru/search.html references remain: ${invalidSearch}`);

for (const lang of ['en','ru','uk']) {
  const privacy = read(`${lang}/privacy-policy.html`);
  assert(/Haunstetter\s+Stra(?:ß|ss)e\s+105/i.test(privacy), `German controller address missing in ${lang} privacy`);
  assert(!/Republic of Cyprus|Республик(?:и|а) Кипр|Республіки Кіпр/i.test(privacy), `legacy Cyprus controller wording remains in ${lang} privacy`);
  assert(/BayLDA|Bayerisches Landesamt für Datenschutzaufsicht/i.test(privacy), `BayLDA complaint authority missing in ${lang} privacy`);

  const cookie = read(`${lang}/cookie-policy.html`);
  assert(!/<code>_gid<\/code>/i.test(cookie), `legacy _gid cookie remains in ${lang} cookie policy`);
  assert(/<code>_ga<\/code>/i.test(cookie) && /<code>_ga_\*<\/code>/i.test(cookie), `GA4 cookie description incomplete in ${lang} cookie policy`);

  const terms = read(`${lang}/terms-of-use.html`);
  assert(!/works since 2012|работает с 2012|працює з 2012/i.test(terms), `legacy 2012 practice claim remains in ${lang} terms`);
  assert(!/national law.{0,40}Cyprus|национальн.{0,40}Кипр|національн.{0,40}Кіпр/is.test(terms), `legacy Cyprus governing law remains in ${lang} terms`);

  const imp = read(`${lang}/impressum.html`);
  assert(!/href=["']#i5["']/i.test(imp), `broken i5 TOC link remains in ${lang} impressum`);
  assert(!/ПЕРЕД ПУБЛИКАЦИЕЙ/i.test(imp), `pre-publication comment remains in ${lang} impressum`);
  if (lang === 'en') assert(!/Terms of Use — LEXONYX/i.test(imp), 'wrong Terms of Use metadata remains in EN impressum');
}

for (const rel of ['en/expertise/regulatory-licensing.html','ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html','uk/ekspertyza/regulyatorna-arhitektura-ta-litsenzuvannya.html']) {
  const html = read(rel);
  assert(!/We determine whether a licence is needed at all/i.test(html), `overbroad licensing conclusion remains: ${rel}`);
  assert(!/€\s*(?:20|50|125|150|350)[,.]?000|€20k|€50k|€125k|€150k/i.test(html), `static regulatory capital marketing number remains: ${rel}`);
  assert(!/Lithuania is a faster practical route/i.test(html), `jurisdiction speed ranking remains: ${rel}`);
}

for (const rel of ['en/request-review.html','ru/zaprosit-razbor.html','uk/zapytaty-rozbir.html']) {
  const html = read(rel);
  assert(/data-netlify=["']true["']/i.test(html), `Netlify intake form marker missing: ${rel}`);
  assert(/privacy_consent/i.test(html), `privacy consent missing: ${rel}`);
  assert(/Preliminary Issue Map|Предварительная карта вопросов|Попередня карта питань/i.test(html), `intake qualification wording not updated: ${rel}`);
}

const consent = read('ru/scripts/lx-consent.js');
assert(/policyUrl:\s*'\/en\/cookie-policy\.html'/.test(consent), 'EN cookie banner copy missing');
assert(/policyUrl:\s*'\/uk\/cookie-policy\.html'/.test(consent), 'UK cookie banner copy missing');
assert(/\[data-cookie-settings\]/.test(consent), 'Cookie Settings handler missing');

assert(/^\/\s+\/en\/index\.html\s+301!$/m.test(redirects), 'root redirect is not permanent 301 to EN');

if (warnings.length) {
  console.log('[LEXONYX production gate] warnings:');
  for (const w of warnings) console.log(' - ' + w);
}
if (errors.length) {
  console.error(`[LEXONYX production gate] FAILED with ${errors.length} issue(s):`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log(`[LEXONYX production gate] PASS — sitemap URLs=${urls.length}, HTML files=${all.length}, retired links=${retiredLinks}, invalid search refs=${invalidSearch}`);
