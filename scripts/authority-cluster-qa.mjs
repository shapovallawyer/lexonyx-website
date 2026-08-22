import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CFG = {
  en: {file:'en/insights/index.html', route:'/en/founder-mobility-business-relocation', labels:['International Expansion & Group Architecture','Founder Mobility & Business Relocation','Banking Readiness & Source of Funds','Private Capital & Family Office','Structural Audit & Transaction Readiness']},
  ru: {file:'ru/insayty/index.html', route:'/ru/pereezd-sobstvennika-i-biznesa', labels:['Международное расширение и архитектура группы','Переезд собственника и бизнеса','Банковская готовность и происхождение средств','Частный капитал и семейный офис','Структурный аудит и готовность к сделке']},
  uk: {file:'uk/insaity/index.html', route:'/uk/pereyizd-vlasnyka-i-biznesu', labels:['Міжнародне розширення та архітектура групи','Переїзд власника та бізнесу','Банківська готовність і походження коштів','Приватний капітал і сімейний офіс','Структурний аудит і готовність до угоди']}
};
const errors=[];
const fail=x=>errors.push(x);

for (const [lang,c] of Object.entries(CFG)) {
  const html=fs.readFileSync(path.join(ROOT,c.file),'utf8');
  const section=(html.match(/<section\b(?=[^>]*\bauthority-clusters\b)[^>]*>[\s\S]*?<\/section>/i)||[])[0]||'';
  if (!section) { fail(`${lang}: authority cluster section missing`); continue; }
  const cards=[...section.matchAll(/data-authority-cluster=["'](\d+)["']/g)];
  if (cards.length!==5) fail(`${lang}: expected 5 authority clusters, found ${cards.length}`);
  for (const label of c.labels) if (!section.includes(label)) fail(`${lang}: cluster label missing: ${label}`);
  if (!section.includes(`href="${c.route}"`)) fail(`${lang}: founder relocation authority route missing`);
  if (/eight interconnected elements|восемь взаимосвязанных элементов|вісім взаємопов.?язаних елементів/i.test(html)) fail(`${lang}: stale eight-element claim remains`);
  if (lang==='ru' && section.includes('Framework')) fail('ru: Framework remains in authority layer');
  if (lang==='uk' && section.includes('Framework')) fail('uk: Framework remains in authority layer');
}

if (errors.length) {
  console.error(`[LEXONYX authority architecture QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - '+e);
  process.exit(1);
}
console.log('[LEXONYX authority architecture QA] PASS — five clusters × EN/RU/UK, relocation route present, stale eight-element copy removed');
