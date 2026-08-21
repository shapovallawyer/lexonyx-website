import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'ru', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const required = [
  'Международное расширение или структура группы',
  'Переезд собственника или основателя',
  'Проверка банка / PSP / происхождения средств',
  'Частный капитал или семейный офис',
  'Сделка, инвестор или крупное изменение структуры',
  'Для украинских собственников и бизнеса в Европе'
];

for (const phrase of required) {
  if (!html.includes(phrase)) throw new Error(`RU client journey phrase missing: ${phrase}`);
}

const forbidden = [
  'Растущий бизнес без внутренней международной юридической команды',
  'Внешняя юридическая функция →',
  'Украинский собственник или бизнес в Европе'
];

for (const phrase of forbidden) {
  if (html.includes(phrase)) throw new Error(`Old RU client journey phrase still present: ${phrase}`);
}

fs.writeFileSync(file, html, 'utf8');
console.log('[LEXONYX client journeys RU] five situational entries + dedicated Ukrainian route verified');
