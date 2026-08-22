import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'https://lexonyx.com';
const errors = [];
const fail = m => errors.push(m);
const beforeCount = Number(process.env.FM01_BASE_SITEMAP_COUNT || '0');

const sitemap = fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
if (!beforeCount) fail('baseline sitemap count missing');
if (beforeCount && urls.length !== beforeCount + 3) fail(`sitemap expected ${beforeCount + 3} URLs after FM-01, found ${urls.length}`);
if (new Set(urls).size !== urls.length) fail('sitemap contains duplicate URLs');
if (urls.some(u => !u.startsWith(`${BASE}/`))) fail('sitemap contains non-LEXONYX URL');
if (urls.some(u => u.endsWith('.html'))) fail('sitemap contains .html canonical URL');

const redirects = fs.readFileSync(path.join(ROOT,'_redirects'),'utf8');
if (!/^\/\s+\/en\/\s+301!\s*$/m.test(redirects)) fail('root redirect must remain permanent 301 to /en/');

function cleanRouteBacked(route) {
  const rel = route.replace(/^\//,'');
  const candidates = [];
  if (route.endsWith('/')) candidates.push(path.join(ROOT,rel,'index.html'));
  else {
    candidates.push(path.join(ROOT,`${rel}.html`));
    candidates.push(path.join(ROOT,rel,'index.html'));
  }
  if (candidates.some(p => fs.existsSync(p))) return true;
  for (const line of redirects.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const parts = trimmed.split(/\s+/);
    if (parts.length < 3 || parts[0] !== route) continue;
    const dest = parts[1];
    if (!dest.startsWith('/')) continue;
    const destRel = dest.replace(/^\//,'');
    const destCandidates = [path.join(ROOT,destRel),path.join(ROOT,`${destRel}.html`),path.join(ROOT,destRel,'index.html')];
    if (destCandidates.some(p => fs.existsSync(p))) return true;
  }
  return false;
}

for (const url of urls) {
  const route = url.slice(BASE.length) || '/';
  if (!cleanRouteBacked(route)) fail(`sitemap clean URL has no physical/rewrite backing: ${route}`);
}

const fm01 = [
  {lang:'en',route:'/en/insights/deep-dives/founder-moves-business-stays',file:'en/insights/deep-dives/founder-moves-business-stays.html'},
  {lang:'ru',route:'/ru/insayty/razbory/founder-moves-business-stays',file:'ru/insayty/razbory/founder-moves-business-stays.html'},
  {lang:'uk',route:'/uk/insaity/rozbory/founder-moves-business-stays',file:'uk/insaity/rozbory/founder-moves-business-stays.html'}
];
for (const c of fm01) {
  const absolute = `${BASE}${c.route}`;
  if (urls.filter(u => u === absolute).length !== 1) fail(`${c.lang}: FM-01 sitemap URL must appear exactly once`);
  const p = path.join(ROOT,c.file);
  if (!fs.existsSync(p)) { fail(`${c.lang}: FM-01 physical page missing`); continue; }
  const html = fs.readFileSync(p,'utf8');
  if (/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) fail(`${c.lang}: publication page still noindex`);
  if (!html.includes(`<link rel="canonical" href="${absolute}">`)) fail(`${c.lang}: publication canonical mismatch`);
  if (!/<meta property="og:type" content="article">/i.test(html)) fail(`${c.lang}: publication og:type is not article`);
}

if (errors.length) {
  console.error(`[FM-01 post-publication site QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors.slice(0,100)) console.error(' - ' + e);
  process.exit(1);
}
console.log(`[FM-01 post-publication site QA] PASS — sitemap ${beforeCount}→${urls.length}, unique clean URLs backed, root 301 preserved, RU/EN/UK FM-01 indexable`);
