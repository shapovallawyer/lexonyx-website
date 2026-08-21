import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'https://lexonyx.com';
const CFG = {
  en: {file:'en/founder-mobility-business-relocation.html', clean:'/en/founder-mobility-business-relocation', home:'en/index.html', title:'Founder Mobility & Business Relocation'},
  ru: {file:'ru/pereezd-sobstvennika-i-biznesa.html', clean:'/ru/pereezd-sobstvennika-i-biznesa', home:'ru/index.html', title:'Переезд собственника и бизнеса'},
  uk: {file:'uk/pereyizd-vlasnyka-i-biznesu.html', clean:'/uk/pereyizd-vlasnyka-i-biznesu', home:'uk/index.html', title:'Переїзд власника та бізнесу'}
};
const ALT = {
  ru: BASE + '/ru/pereezd-sobstvennika-i-biznesa',
  en: BASE + '/en/founder-mobility-business-relocation',
  uk: BASE + '/uk/pereyizd-vlasnyka-i-biznesu',
  'x-default': BASE + '/en/founder-mobility-business-relocation'
};
const errors = [];
function fail(x){ errors.push(x); }
function read(rel){ return fs.readFileSync(path.join(ROOT,rel),'utf8'); }
function attr(tag,name){ return (tag.match(new RegExp(`${name}=["']([^"']+)["']`,'i'))||[])[1]||null; }

for (const [lang,c] of Object.entries(CFG)) {
  if (!fs.existsSync(path.join(ROOT,c.file))) { fail(`${lang}: route page missing ${c.file}`); continue; }
  const html = read(c.file);
  const main = (html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i)||[])[0] || '';
  const h1 = [...html.matchAll(/<h1\b[^>]*>/gi)].length;
  if (h1 !== 1) fail(`${lang}: expected one H1, found ${h1}`);
  if (!html.includes(c.title)) fail(`${lang}: page title/H1 phrase missing`);
  const canonical = (html.match(/<link\b[^>]*rel=["']canonical["'][^>]*>/i)||[])[0] || '';
  if (attr(canonical,'href') !== BASE + c.clean) fail(`${lang}: canonical mismatch ${attr(canonical,'href')}`);
  if (/name=["']robots["'][^>]*noindex/i.test(html)) fail(`${lang}: route page is noindex`);
  for (const [code,url] of Object.entries(ALT)) {
    const tags = [...html.matchAll(/<link\b[^>]*rel=["']alternate["'][^>]*>/gi)].map(m=>m[0]);
    const match = tags.find(t => attr(t,'hreflang')?.toLowerCase() === code);
    if (!match || attr(match,'href') !== url) fail(`${lang}: hreflang ${code} mismatch`);
  }
  for (const code of ['ru','en','uk']) {
    const expected = ALT[code].replace(BASE,'');
    const switches = [...html.matchAll(/<a\b[^>]*class=["'][^"']*lang-option[^"']*["'][^>]*>/gi)].map(m=>m[0]);
    const sw = switches.find(t => attr(t,'lang')?.toLowerCase() === code);
    if (!sw || attr(sw,'href') !== expected) fail(`${lang}: language switch ${code} mismatch`);
  }
  if (!/qualified|квалифицирован|кваліфікован/i.test(main) || !/jurisdiction|юрисдикц/i.test(main)) fail(`${lang}: professional-perimeter statement missing`);
  if (!/strategic|стратегичес|стратегіч/i.test(main) || !/audit|аудит/i.test(main)) fail(`${lang}: Strategic Structural Audit route missing`);
  if (!/express|экспресс|експрес/i.test(main)) fail(`${lang}: diagnostic/Express Risk Review route missing`);
  if (lang === 'ru' && /\b(?:governance|workstreams|treaty|Source|Wealth|substance)\b/i.test(main)) fail('ru: avoidable Latin terminology in custom route main');
  if (lang === 'uk' && /\b(?:governance|workstreams|treaty|Source|Wealth|substance)\b/i.test(main)) fail('uk: avoidable Latin terminology in custom route main');

  const home = read(c.home);
  const marker = 'data-funnel-journey="founder-owner-relocation"';
  const pos = home.indexOf(marker);
  if (pos < 0) fail(`${lang}: homepage founder journey marker missing`);
  else {
    const start = home.lastIndexOf('<article',pos), end = home.indexOf('</article>',pos);
    const card = start >= 0 && end >= 0 ? home.slice(start,end+10) : '';
    if (!card.includes(`href="${c.clean}"`)) fail(`${lang}: homepage founder journey does not link to relocation route`);
    if (!card.includes(c.title)) fail(`${lang}: homepage founder journey title not upgraded`);
  }
}

const sitemap = read('sitemap.xml');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
if (urls.length !== 168) fail(`sitemap expected 168 URLs after relocation route, found ${urls.length}`);
for (const c of Object.values(CFG)) if (!urls.includes(BASE+c.clean)) fail(`sitemap missing ${c.clean}`);
if (new Set(urls).size !== urls.length) fail('sitemap contains duplicate URLs');
if (urls.some(u=>u.endsWith('.html'))) fail('sitemap contains .html URL after clean canonical stage');

const redirects = read('_redirects');
for (const c of Object.values(CFG)) {
  const old = '/' + c.file;
  const escaped = old.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const target = c.clean.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  if (!new RegExp(`^${escaped}\\s+${target}\\s+301!\\s*$`,'m').test(redirects)) fail(`redirect missing ${old} -> ${c.clean}`);
}

for (const [lang,c] of Object.entries(CFG)) {
  const search = read(`${lang}/scripts/search-index-${lang}.js`);
  if (!search.includes(c.clean)) fail(`${lang}: search index missing relocation route`);
}

if (errors.length) {
  console.error(`[LEXONYX relocation route QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('[LEXONYX relocation route QA] PASS — RU/EN/UK route family, homepage links, clean canonicals, hreflang, sitemap=168 and redirects verified');
