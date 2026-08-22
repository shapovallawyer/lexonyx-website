import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const family = {
  en: {
    file:'en/insights/deep-dives/founder-moves-business-stays.html',
    clean:'https://lexonyx.com/en/insights/deep-dives/founder-moves-business-stays',
    h1:'Founder Moves, Business Stays: What Actually Changes in a Cross-Border Structure?',
    required:['Founder relocation should therefore be treated as a cross-border structural event','no automatic presumption of PE','Domestic-law residence and treaty residence are related','CRS and AML/KYC are not the same legal regime','31 December 2021']
  },
  ru: {
    file:'ru/insayty/razbory/founder-moves-business-stays.html',
    clean:'https://lexonyx.com/ru/insayty/razbory/founder-moves-business-stays',
    h1:'Переезд собственника: что меняется в международной структуре?',
    required:['Переезд собственника следует рассматривать как трансграничное структурное событие','не возникает автоматической презумпции PE','Резидентство по внутреннему праву и резидентство для целей налогового соглашения','CRS и AML/KYC — не один правовой режим','31 декабря 2021 года']
  },
  uk: {
    file:'uk/insaity/rozbory/founder-moves-business-stays.html',
    clean:'https://lexonyx.com/uk/insaity/rozbory/founder-moves-business-stays',
    h1:'Переїзд власника: що змінюється в міжнародній структурі?',
    required:['Переїзд власника слід розглядати як транскордонну структурну подію','не виникає автоматичної презумпції PE','Резидентство за внутрішнім правом і резидентство для цілей податкової угоди','CRS і AML/KYC — не один правовий режим','31 грудня 2021 року']
  }
};
const errors=[];
const fail=m=>errors.push(m);
const htmlToText=s=>s.replace(/<script\b[\s\S]*?<\/script>/gi,' ').replace(/<style\b[\s\S]*?<\/style>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim();
const hrefs={ru:'/ru/insayty/razbory/founder-moves-business-stays',en:'/en/insights/deep-dives/founder-moves-business-stays',uk:'/uk/insaity/rozbory/founder-moves-business-stays'};
const internalFiles=[
 'ru/ekspertiza/source-of-funds.html','ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html','ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html','ru/ekspertiza/bankovskaya-gotovnost.html','ru/ekspertiza/substance-i-governance.html','ru/pereezd-sobstvennika-i-biznesa.html','ru/zaprosit-razbor.html',
 'uk/ekspertyza/source-of-funds.html','uk/ekspertyza/pe-ryzyk-ta-mizhnarodni-komandy.html','uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html','uk/ekspertyza/bankivska-gotovnist.html','uk/ekspertyza/substance-ta-governance.html','uk/pereyizd-vlasnyka-i-biznesu.html','uk/zapytaty-rozbir.html'
];
for(const f of internalFiles) if(!fs.existsSync(path.join(ROOT,f))) fail(`target file missing: ${f}`);

for(const [lang,c] of Object.entries(family)){
 const file=path.join(ROOT,c.file);
 if(!fs.existsSync(file)){fail(`${lang}: page missing`);continue;}
 const html=fs.readFileSync(file,'utf8'); const text=htmlToText(html);
 if(!text.includes(c.h1)) fail(`${lang}: H1 missing`);
 for(const q of c.required) if(!text.includes(q)) fail(`${lang}: legal-parity phrase missing: ${q}`);
 if(!html.includes(`rel="canonical" href="${c.clean}"`)) fail(`${lang}: clean self-canonical missing`);
 if(!/<meta\s+name=["']robots["']\s+content=["']noindex,\s*nofollow["']\s*>/i.test(html)) fail(`${lang}: preview noindex,nofollow missing`);
 for(const [hreflang,route] of Object.entries(hrefs)) if(!new RegExp(`hreflang=["']${hreflang}["'][^>]+href=["']https://lexonyx\\.com${route.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`).test(html)) fail(`${lang}: reciprocal hreflang ${hreflang} missing`);
 if(!html.includes(`hreflang="x-default" href="https://lexonyx.com${hrefs.en}"`)) fail(`${lang}: x-default must point EN`);
 if((html.match(/class="principle-card"/g)||[]).length!==7) fail(`${lang}: expected 7 Impact Map cards`);
 if((html.match(/target="_blank" rel="noopener noreferrer" class="text-link"/g)||[]).length<10) fail(`${lang}: fewer than 10 primary-source links`);
 if(/"@type"\s*:\s*"FAQPage"/.test(html)) fail(`${lang}: inherited FAQ structured data remains`);
 if(!/"@type"\s*:\s*"Article"/.test(html)) fail(`${lang}: Article JSON-LD missing`);
 if(lang==='uk' && /Карта не создаёт|Собственник переехал|Проверено 22 августа/.test(text)) fail('uk: Russian fallback copy remains');
 if(lang==='ru' && /Власник переїхав|Перевірено 22 серпня/.test(text)) fail('ru: Ukrainian fallback copy remains');
}
const sitemap=fs.readFileSync(path.join(ROOT,'sitemap.xml'),'utf8');
for(const route of Object.values(hrefs)) if(sitemap.includes(route)) fail(`preview route entered sitemap early: ${route}`);

if(errors.length){console.error(`[FM-01 multilingual preview QA] FAILED — ${errors.length} issue(s)`);for(const e of errors)console.error(' - '+e);process.exit(1);}
console.log('[FM-01 multilingual preview QA] PASS — RU/EN/UK legal parity, sources, reciprocal hreflang, noindex isolation and canonical routes');

const productionSimulation = process.env.CONTEXT === 'production' || process.env.FM01_PUBLISH === '1' || process.env.GITHUB_ACTIONS === 'true';
if (productionSimulation) {
  console.log('[FM-01 publication gate] switching verified preview family to production-state simulation');
  await import('./fm01-publication-state.mjs');
  await import('./fm01-publication-qa.mjs');
  // i18n-page-parity-audit intentionally runs earlier, before clean-url-canonicalizer.
  // Re-running it here would compare the legacy .html URL map against already-normalized clean hreflang URLs.
  await import('./final-production-check.mjs');
  await import('./seo-ui-audit.mjs');
  await import('./clean-url-qa.mjs');
  console.log('[FM-01 publication gate] PASS — production-state simulation and site-wide post-publication audits completed');
}
