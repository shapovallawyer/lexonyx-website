import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const targets=['ru/podhod/index.html','ru/podhod/strukturnaya-model.html','ru/podhod/principy-mezhdunarodnyh-struktur.html','ru/podhod/karta-riskov.html','ru/dlya-ukrainskogo-biznesa.html','ru/kontakty.html','ru/zaprosit-razbor.html','ru/accessibility.html','ru/cookie-policy.html','ru/impressum.html','ru/privacy-policy.html','ru/terms-of-use.html','ru/intake/intake.html','ru/intake/intake_thankyou.html','ru/intake/spasibo.html','ru/intake/spasibo-newsletter.html'];
const allowed=new Set([
'LEXONYX','KYC','AML','FATF','MLI','PPT','GAAR','DEMPE','MiCA','SaaS','OSS','IOSS','EOR','PSP','EMI','UBO','GDPR','CRS','NDA','Web3','SOF','SOW','BRAO','RAK','DSGVO','TTDSG','TMG','DDG','BGB','VSBG','MStV','BORA','RVG','CCBE','ePrivacy','GA4','IP','CTF','DPA','SCC','TLS','SSL','WCAG','AA','ARIA','EAA','localStorage','ID','ga',
'Google','Analytics','Netlify','GitHub','LinkedIn','Telegram','WhatsApp','Instagram','Microsoft','Cloudflare','OpenAI','Amazon','Etsy',
'Rechtsanwaltskammer','München','Rechtsanwalt','Steuerberater','Bundesrechtsanwaltsordnung','Berufsordnung','Rechtsanwälte','Rechtsanwaltsvergütungsgesetz','Berufsregeln','der','Europäischen','Union','Bundesrechtsanwaltskammer','Schlichtungsstelle','Rechtsanwaltschaft','Impressum',
'Liudmyla','Miroshnychenko','liudmyla','mir','Haunstetter','Straße','Augsburg','Germany','Tal','HDI','Versicherung','AG','Hannover','Rauchstraße','Berlin','Abs','Bayerisches','Landesamt','für','Datenschutzaufsicht','BayLDA','Promenade','Ansbach','EDPB','Advokat','Ukraine','EU','EWR',
'cookie','cookies','Cookie','Cookies','UA','DE','CY','PL','NL','AE','EE','IE','CH','RU','EN','UK','target','blank','rel','noopener','as'
]);
const errors=[];
function strip(fragment){return fragment
.replace(/https?:\/\/[^\s<>'"]+/gi,' ')
.replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,' ')
.replace(/\b(?:www\.)?[a-z0-9.-]+\.(?:com|org|net|de|eu|io)(?:\/[^\s<>'"]*)?/gi,' ')
.replace(/@[A-Za-z0-9_.-]+/g,' ')
.replace(/<script\b[\s\S]*?<\/script>/gi,' ')
.replace(/<style\b[\s\S]*?<\/style>/gi,' ')
.replace(/<svg\b[\s\S]*?<\/svg>/gi,' ')
.replace(/<!--([\s\S]*?)-->/g,' ')
.replace(/<[^>]+>/g,' ')
.replace(/&[a-z#0-9]+;/gi,' ')
.replace(/\s+/g,' ').trim();}
function relevantSeo(html){const values=[];const patterns=[/<title>([\s\S]*?)<\/title>/gi,/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/gi,/<meta\b[^>]*property=["']og:(?:title|description)["'][^>]*content=["']([^"']*)["'][^>]*>/gi,/<meta\b[^>]*name=["']twitter:(?:title|description)["'][^>]*content=["']([^"']*)["'][^>]*>/gi];for(const re of patterns)for(const m of html.matchAll(re))values.push(strip(m[1]));for(const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)){try{const d=JSON.parse(m[1]);const walk=v=>{if(Array.isArray(v))return v.forEach(walk);if(!v||typeof v!=='object')return;for(const [k,val] of Object.entries(v)){if(['name','description','text','headline'].includes(k)&&typeof val==='string')values.push(strip(val));else if(val&&typeof val==='object')walk(val);}};walk(d);}catch{}}return values.join(' ');}
function latinTokens(text){return [...new Set(text.match(/[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ0-9-]*/g)||[])].map(t=>t.replace(/-+$/,'')).filter(t=>t.length>1&&!/\d/.test(t)&&!allowed.has(t));}
for(const rel of targets){const f=path.join(ROOT,rel);if(!fs.existsSync(f)){errors.push(`${rel}: missing`);continue;}const h=fs.readFileSync(f,'utf8');const c=(h.match(/<main\b[\s\S]*?<\/main>/i)||h.match(/<body\b[\s\S]*?<\/body>/i)||[''])[0];if(!c){errors.push(`${rel}: content container missing`);continue;}const text=`${strip(c)} ${relevantSeo(h)}`.replace(/\s+/g,' ').trim();const latin=latinTokens(text);if(latin.length)errors.push(`${rel}: avoidable Latin terms: ${latin.slice(0,100).join(', ')}`);for(const m of c.matchAll(/<(?:p|h1|h2|h3|h4|li|summary|label)\b[^>]*>([\s\S]*?)<\/(?:p|h1|h2|h3|h4|li|summary|label)>/gi)){const b=strip(m[1]);if(/^[а-яё]/.test(b))errors.push(`${rel}: lowercase block start: ${b.slice(0,110)}`);}const bad=[/\bпо риск\b/i,/\bс риск\b/i,/\bчастью целевая\b/i,/\bи и\b/i,/\bв в\b/i,/\bдля для\b/i,/\bструктура структура\b/i,/\bуправление управление\b/i,/\bмодель модель\b/i,/\bпроверка проверка\b/i,/\bсогласие согласие\b/i];for(const re of bad)if(re.test(text))errors.push(`${rel}: suspicious grammar: ${re}`);}
if(errors.length){console.error(`[LEXONYX RU remaining editorial audit] FAILED — ${errors.length} issue(s):`);for(const e of errors.slice(0,240))console.error(' - '+e);process.exit(1);}console.log(`[LEXONYX RU remaining editorial audit] PASS — pages=${targets.length}`);
