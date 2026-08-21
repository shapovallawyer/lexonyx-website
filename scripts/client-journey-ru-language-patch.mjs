import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const ruFile = path.join(ROOT, 'ru', 'index.html');
const ukFile = path.join(ROOT, 'uk', 'index.html');
let ruHtml = fs.readFileSync(ruFile, 'utf8');
let ukHtml = fs.readFileSync(ukFile, 'utf8');

const requiredRu = [
  'Выход в новую страну или построение группы',
  'Переезд собственника или основателя',
  'Проверка банка / PSP / происхождения средств',
  'Частный капитал или семейный офис',
  'Действующая структура перед сделкой или внешней проверкой',
  'Для украинских собственников и бизнеса в Европе',
  'От первичной проверки к внедрению и постоянной координации'
];

const forbiddenLegacyRu = [
  'Украинский собственник или бизнес в Европе',
  'Основатель или международная группа',
  'Растущий бизнес без внутренней международной юридической команды'
];

for (const phrase of requiredRu) {
  if (!ruHtml.includes(phrase)) throw new Error(`RU final client journey phrase missing: ${phrase}`);
}

for (const phrase of forbiddenLegacyRu) {
  if (ruHtml.includes(phrase)) throw new Error(`RU legacy client journey phrase still present: ${phrase}`);
}

const oldUkTaxRoute = '/uk/ekspertyza/podatkove-rezydentstvo-i-kik.html';
const canonicalUkTaxRoute = '/uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html';
if (ukHtml.includes(oldUkTaxRoute)) {
  ukHtml = ukHtml.replaceAll(oldUkTaxRoute, canonicalUkTaxRoute);
  fs.writeFileSync(ukFile, ukHtml, 'utf8');
}
if (!ukHtml.includes(canonicalUkTaxRoute)) throw new Error('UK canonical Tax Residence & CFC route missing from client journey');

console.log('[LEXONYX client journeys language patch] RU situational copy confirmed; UK Tax Residence route canonicalized');
