import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const publish = process.env.CONTEXT === 'production' || process.env.FM01_PUBLISH === '1' || process.env.GITHUB_ACTIONS === 'true';
if (!publish) {
  console.log(`[FM-01 publication QA] SKIP — context=${process.env.CONTEXT || 'unset'}; preview publication checks not applicable`);
  process.exit(0);
}

const family = {
  en:{file:'en/insights/deep-dives/founder-moves-business-stays.html',route:'/en/insights/deep-dives/founder-moves-business-stays',search:'en/scripts/search-index-en.js',hub:'en/insights/deep-dives/index.html'},
  ru:{file:'ru/insayty/razbory/founder-moves-business-stays.html',route:'/ru/insayty/razbory/founder-moves-business-stays',search:'ru/scripts/search-index-ru.js',hub:'ru/insayty/razbory/index.html'},
  uk:{file:'uk/insaity/rozbory/founder-moves-business-stays.html',route:'/uk/insaity/rozbory/founder-moves-business-stays',search:'uk/scripts/search-index-uk.js',hub:'uk/insaity/rozbory/index.html'}
};
const errors=[];
const fail=m=>errors.push(m);
const sitemap=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
const redirects=fs.readFileSync(path.join(ROOT,'_redirects'),'utf8');
const hrefs={ru:family.ru.route,en:family.en.route,uk:family.uk.route};

for(const [lang,c] of Object.entries(family)){
  const p=path.join(ROOT,c.file);
  if(!fs.existsSync(p)){fail(`${lang}: page missing`);continue;}
  const html=fs.readFileSync(p,'utf8');
  if(/<meta\s+name=["']robots["'][^>]*noindex/i.test(html)) fail(`${lang}: noindex remains in publication state`);
  if(!html.includes(`<link rel="canonical" href="https://lexonyx.com${c.route}">`)) fail(`${lang}: clean canonical missing`);
  if(!/<meta property="og:type" content="article">/i.test(html)) fail(`${lang}: og:type must be article`);
  if(!/"datePublished"\s*:\s*"2026-08-22"/.test(html)) fail(`${lang}: datePublished missing`);
  if(!/"dateModified"\s*:\s*"2026-08-22"/.test(html)) fail(`${lang}: dateModified missing`);
  for(const [hreflang,route] of Object.entries(hrefs)) if(!html.includes(`hreflang="${hreflang}" href="https://lexonyx.com${route}"`)) fail(`${lang}: hreflang ${hreflang} missing`);
  if(!html.includes(`hreflang="x-default" href="https://lexonyx.com${family.en.route}"`)) fail(`${lang}: x-default must point EN`);

  const loc=`<loc>https://lexonyx.com${c.route}</loc>`;
  if((sitemap.match(new RegExp(loc.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length!==1) fail(`${lang}: sitemap entry must exist exactly once`);

  const search=fs.readFileSync(path.join(ROOT,c.search),'utf8');
  if((search.match(new RegExp(c.route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length!==1) fail(`${lang}: search entry must exist exactly once`);

  const hub=fs.readFileSync(path.join(ROOT,c.hub),'utf8');
  if((hub.match(new RegExp(c.route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length!==1) fail(`${lang}: Deep Dives listing must exist exactly once`);

  const redirect=`${c.route}.html ${c.route} 301!`;
  if((redirects.match(new RegExp(redirect.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length!==1) fail(`${lang}: clean redirect missing or duplicated`);
}

if((redirects.match(/# BEGIN FM-01 PUBLICATION/g)||[]).length!==1 || (redirects.match(/# END FM-01 PUBLICATION/g)||[]).length!==1) fail('FM-01 redirect block markers must exist exactly once');

if(errors.length){console.error(`[FM-01 publication QA] FAILED — ${errors.length} issue(s)`);for(const e of errors)console.error(' - '+e);process.exit(1);}
console.log('[FM-01 publication QA] PASS — indexable RU/EN/UK family, sitemap/search/listings, metadata, hreflang and redirects');
