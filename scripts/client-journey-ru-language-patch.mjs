import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ruFile = path.join(root, 'ru', 'index.html');
const ukFile = path.join(root, 'uk', 'index.html');
let ru = fs.readFileSync(ruFile, 'utf8');
let uk = fs.readFileSync(ukFile, 'utf8');

const requiredRu = [
  'Международное расширение или структура группы',
  'Переезд собственника или основателя',
  'Проверка банка / PSP / происхождения средств',
  'Частный капитал или семейный офис',
  'Сделка, инвестор или крупное изменение структуры',
  'Для украинских собственников и бизнеса в Европе'
];

for (const phrase of requiredRu) {
  if (!ru.includes(phrase)) throw new Error(`RU client journey phrase missing: ${phrase}`);
}

const forbiddenRu = [
  'Растущий бизнес без внутренней международной юридической команды',
  'Внешняя юридическая функция →',
  'Украинский собственник или бизнес в Европе'
];

for (const phrase of forbiddenRu) {
  if (ru.includes(phrase)) throw new Error(`Old RU client journey phrase still present: ${phrase}`);
}

ru = ru.replace('реорганизацией, due diligence или существенным изменением бизнеса.', 'реорганизацией, комплексной проверкой или существенным изменением бизнеса.');
uk = uk.replace('реорганізацією, due diligence або суттєвою зміною бізнесу.', 'реорганізацією, комплексною перевіркою або суттєвою зміною бізнесу.');

fs.writeFileSync(ruFile, ru, 'utf8');
fs.writeFileSync(ukFile, uk, 'utf8');
console.log('[LEXONYX client journeys RU/UK] five situational entries + dedicated Ukrainian route verified and naturalized');
