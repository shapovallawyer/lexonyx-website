import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const publish = process.env.CONTEXT === 'production' || process.env.FM01_PUBLISH === '1' || process.env.GITHUB_ACTIONS === 'true';
if (!publish) {
  console.log(`[FM-01 publication state] SKIP — context=${process.env.CONTEXT || 'unset'}; preview remains noindex and undiscoverable`);
  process.exit(0);
}

const family = {
  en: {
    file:'en/insights/deep-dives/founder-moves-business-stays.html',
    route:'/en/insights/deep-dives/founder-moves-business-stays',
    search:'en/scripts/search-index-en.js',
    hub:'en/insights/deep-dives/index.html',
    title:'Founder Mobility: What Changes When the Founder Moves?',
    category:'Insights',
    meta:'Founder mobility · Tax residence · CFC · PE',
    heading:'Founder moves, business stays: what actually changes?',
    summary:'A structural review of what can change when the owner relocates: personal and corporate residence, management, PE, CFC, banking, governance and evidence.',
    link:'Read the founder mobility analysis →'
  },
  ru: {
    file:'ru/insayty/razbory/founder-moves-business-stays.html',
    route:'/ru/insayty/razbory/founder-moves-business-stays',
    search:'ru/scripts/search-index-ru.js',
    hub:'ru/insayty/razbory/index.html',
    title:'Переезд собственника: что меняется в международной структуре?',
    category:'Инсайты',
    meta:'Переезд · Резидентство · КИК · PE',
    heading:'Переезд собственника: что меняется в международной структуре?',
    summary:'Системный разбор того, что может измениться при переезде собственника: личное и корпоративное резидентство, управление, PE, КИК, банки, governance и доказательства.',
    link:'Читать разбор переезда →'
  },
  uk: {
    file:'uk/insaity/rozbory/founder-moves-business-stays.html',
    route:'/uk/insaity/rozbory/founder-moves-business-stays',
    search:'uk/scripts/search-index-uk.js',
    hub:'uk/insaity/rozbory/index.html',
    title:'Переїзд власника: що змінюється в міжнародній структурі?',
    category:'Інсайти',
    meta:'Переїзд · Резидентство · КІК · PE',
    heading:'Переїзд власника: що змінюється в міжнародній структурі?',
    summary:'Системний розбір того, що може змінитися після переїзду власника: особисте й корпоративне резидентство, управління, PE, КІК, банки, governance та докази.',
    link:'Читати розбір переїзду →'
  }
};

for (const c of Object.values(family)) {
  const file = path.join(ROOT,c.file);
  if (!fs.existsSync(file)) throw new Error(`FM-01 page missing: ${c.file}`);
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/\s*<meta\s+name=["']robots["'][^>]*>/i,'');
  if (/<meta\s+property=["']og:type["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+property=["']og:type["'][^>]*>/i,'<meta property="og:type" content="article">');
  } else {
    html = html.replace(/(<meta\s+property=["']og:url["'][^>]*>)/i,'<meta property="og:type" content="article">\n  $1');
  }
  if (!/"datePublished"\s*:/.test(html)) {
    html = html.replace(/("dateModified"\s*:\s*"2026-08-22")/,'"datePublished": "2026-08-22",\n  $1');
  }
  fs.writeFileSync(file,html,'utf8');
}

const sitemapPath = path.join(ROOT,'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath,'utf8');
for (const c of Object.values(family)) {
  const loc = `  <url><loc>https://lexonyx.com${c.route}</loc></url>`;
  if (!sitemap.includes(loc)) sitemap = sitemap.replace('</urlset>',`${loc}\n</urlset>`);
}
fs.writeFileSync(sitemapPath,sitemap,'utf8');

for (const c of Object.values(family)) {
  const searchPath = path.join(ROOT,c.search);
  let js = fs.readFileSync(searchPath,'utf8');
  if (!js.includes(c.route)) {
    const item = `  {"title":${JSON.stringify(c.title)},"url":${JSON.stringify(c.route)},"category":${JSON.stringify(c.category)}},\n`;
    js = js.replace(/\n\];\s*$/i,`\n${item}];\n`);
    fs.writeFileSync(searchPath,js,'utf8');
  }

  const hubPath = path.join(ROOT,c.hub);
  let hub = fs.readFileSync(hubPath,'utf8');
  if (!hub.includes(c.route)) {
    const card = `\n      <article class="deep-dive-card fm01-card">\n        <div class="deep-dive-card-meta">${c.meta}</div>\n        <h2>${c.heading}</h2>\n        <p>${c.summary}</p>\n        <a href="${c.route}" class="deep-dive-link">${c.link}</a>\n      </article>\n`;
    hub = hub.replace(/(<div class="deep-dives-list">\s*)/i,`$1${card}`);
    fs.writeFileSync(hubPath,hub,'utf8');
  }
}

const redirectsPath = path.join(ROOT,'_redirects');
let redirects = fs.readFileSync(redirectsPath,'utf8');
redirects = redirects.replace(/\n?# BEGIN FM-01 PUBLICATION[\s\S]*?# END FM-01 PUBLICATION\n?/g,'\n');
const block = ['# BEGIN FM-01 PUBLICATION'];
for (const c of Object.values(family)) block.push(`${c.route}.html ${c.route} 301!`);
block.push('# END FM-01 PUBLICATION');
redirects = `${redirects.trimEnd()}\n\n${block.join('\n')}\n`;
fs.writeFileSync(redirectsPath,redirects,'utf8');

console.log('[FM-01 publication state] PASS — indexable RU/EN/UK family, sitemap, search, Deep Dives listings and redirects prepared');
