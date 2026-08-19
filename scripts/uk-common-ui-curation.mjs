import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const base = path.join(ROOT, 'uk');
const pairs = [
  ['Source of Funds / Source of Wealth', 'Походження коштів / походження капіталу'],
  ['Source of Funds / SoW', 'Походження коштів / походження капіталу'],
  ['Source of Funds', 'Походження коштів'],
  ['Source of Wealth', 'Походження капіталу'],
  ['family office', 'сімейний офіс'], ['Family Office', 'Сімейний офіс'],
  ['Substance and Governance', 'Фактична присутність і корпоративне управління'],
  ['Substance & Governance', 'Фактична присутність і корпоративне управління'],
  ['substance and governance', 'фактична присутність і корпоративне управління'],
  ['substance', 'фактична економічна присутність'], ['governance', 'корпоративне управління'],
  ['PE-risk', 'ризик постійного представництва'], ['PE Risk', 'ризик постійного представництва'],
  ['VAT', 'ПДВ'], ['Banking Readiness', 'Банківська готовність'], ['banking readiness', 'банківська готовність'],
  ['Tax Residency and CFC', 'Податкове резидентство і КІК'], ['Tax Residency & CFC', 'Податкове резидентство і КІК'],
  ['International Structure Architecture', 'Архітектура міжнародних структур'],
  ['International Structuring Advisory', 'Консультаційний супровід міжнародного структурування'],
  ['International Structuring', 'Міжнародне структурування'], ['Group Structuring', 'Структурування групи'],
  ['Regulatory Architecture', 'Регуляторна архітектура'], ['Regulatory & Licensing', 'Регулювання та ліцензування'],
  ['advisory', 'консультаційний супровід'], ['Advisory', 'Консультаційний супровід'],
  ['ownership', 'структура володіння'], ['Ownership', 'Структура володіння'],
  ['banking', 'банківська модель'], ['Banking', 'Банківська модель'],
  ['regulatory', 'регуляторний'], ['Regulatory', 'Регуляторний'],
  ['cross-border', 'транскордонний'], ['Cross-border', 'Транскордонний'],
  ['workstreams', 'напрями роботи'], ['Workstreams', 'Напрями роботи'],
  ['Cookie Settings', 'Налаштування файлів cookie'], ['Privacy Policy', 'Політика конфіденційності'],
  ['Terms of Use', 'Умови використання'], ['Legal Notice', 'Правова інформація'], ['Accessibility', 'Доступність'],
  ['Request a Review', 'Запросити розбір'], ['Request a review', 'Запросити розбір'],
  ['Language', 'Мова'], ['Поиск по разделам и темам…', 'Пошук за розділами й темами…'], ['Поиск по сайту', 'Пошук по сайту']
];

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function replaceToken(text, from, to) {
  const left = /^[A-Za-z0-9]/.test(from) ? '(?<![A-Za-z0-9])' : '';
  const right = /[A-Za-z0-9]$/.test(from) ? '(?![A-Za-z0-9])' : '';
  return text.replace(new RegExp(left + esc(from) + right, 'g'), to);
}
function clean(text) {
  let out = text;
  for (const [a,b] of pairs) out = replaceToken(out, a, b);
  return out.replace(/\s{2,}/g, ' ');
}
function cleanZone(zone) {
  const held=[];
  let z=zone.replace(/<(?:script|style|svg)\b[\s\S]*?<\/(?:script|style|svg)>/gi, block=>{held.push(block);return `__UK_UI_HELD_${held.length-1}__`;});
  z=z.replace(/>([^<>]+)</g,(all,text)=>`>${clean(text)}<`);
  z=z.replace(/\b(placeholder|aria-label|title)=(['"])(.*?)\2/gi,(all,attr,q,value)=>`${attr}=${q}${clean(value)}${q}`);
  z=z.replace(/__UK_UI_HELD_(\d+)__/g,(_,i)=>held[Number(i)]);
  return z;
}
function allHtml(dir,out=[]) { for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,ent.name);if(ent.isDirectory())allHtml(p,out);else if(ent.isFile()&&ent.name.endsWith('.html'))out.push(p);} return out; }
let changed=0;
for(const file of allHtml(base)){
  const before=fs.readFileSync(file,'utf8'); let html=before;
  const hs=html.search(/<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>/i); const ms=html.search(/<main\b/i);
  if(hs>=0&&ms>hs){const zone=html.slice(hs,ms);html=html.slice(0,hs)+cleanZone(zone)+html.slice(ms);}
  const fs0=html.search(/<footer\b[^>]*class=["'][^"']*site-footer[^"']*["'][^>]*>/i);
  if(fs0>=0){const fe=html.indexOf('</footer>',fs0);if(fe>=0){const zone=html.slice(fs0,fe+9);html=html.slice(0,fs0)+cleanZone(zone)+html.slice(fe+9);}}
  if(html!==before){fs.writeFileSync(file,html,'utf8');changed++;}
}
console.log(`[LEXONYX UK common UI curation] changed=${changed}`);
