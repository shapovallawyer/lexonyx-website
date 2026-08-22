import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];
const fail = m => errors.push(m);
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

const enTax = read('en/expertise/tax-residency-cfc.html');
const ruTax = read('ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html');
const ukTax = read('uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html');

for (const [label, html, banned] of [
  ['EN tax', enTax, ['Residency is determined not by incorporation', 'actual decision-making centre determines', 'A company’s tax residency is determined by the allocation of functions']],
  ['RU tax', ruTax, ['На самом деле сместилось место фактического управления', 'фактический центр принятия решений определяет налоговую уязвимость', 'Налоговое резидентство компании определяется распределением функций']],
  ['UK tax', ukTax, ['Резидентство визначається не реєстрацією', 'Насправді змістилося місце фактичного управління', 'фактичний центр ухвалення рішень визначає податкову вразливість', 'Податкове резидентство компанії визначається розподілом функцій']]
]) {
  for (const phrase of banned) if (html.includes(phrase)) fail(`${label}: stale absolute formulation remains: ${phrase}`);
}

for (const [label, html, required] of [
  ['EN tax', enTax, ['There is no single universal test for corporate tax residence.', 'the applicable jurisdiction-specific test', 'CFC rules are domestic anti-deferral regimes']],
  ['RU tax', ruTax, ['Универсального международного теста корпоративного налогового резидентства нет.', 'Правила КИК являются нормами внутреннего налогового права.']],
  ['UK tax', ukTax, ['Універсального міжнародного тесту корпоративного податкового резидентства немає.', 'Правила КІК є нормами внутрішнього податкового права.']]
]) {
  for (const phrase of required) if (!html.includes(phrase)) fail(`${label}: required precision wording missing: ${phrase}`);
}

const enRoot = path.join(ROOT, 'en');
function walk(dir) {
  const out=[];
  for (const e of fs.readdirSync(dir,{withFileTypes:true})) {
    const p=path.join(dir,e.name);
    if(e.isDirectory()) out.push(...walk(p));
    else if(e.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}
for (const file of walk(enRoot)) {
  const html=fs.readFileSync(file,'utf8');
  if (/\bRapid Risk Review\b|\brapid risk review\b|\bStrategic Structural Audit\b|\bstrategic structural audit\b/.test(html)) {
    fail(`EN naming: legacy work-format label remains in ${path.relative(ROOT,file)}`);
  }
}
const hub = read('en/work-formats/index.html');
const audit = read('en/work-formats/strategic-structural-audit.html');
for (const phrase of ['Express Risk Review','Strategic Structure Audit']) if (!hub.includes(phrase)) fail(`EN work formats hub missing ${phrase}`);
if (!audit.includes('Strategic Structure Audit')) fail('EN Strategic Structure Audit product page not canonicalised');

if (errors.length) {
  console.error(`[FM-01 site consistency QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - '+e);
  process.exit(1);
}
console.log('[FM-01 site consistency QA] PASS — jurisdiction-neutral tax copy and canonical EN work-format names verified');
