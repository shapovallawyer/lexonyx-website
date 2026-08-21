import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'ru', 'index.html');
const html = fs.readFileSync(file, 'utf8');

const required = [
  'Выход в новую страну или построение группы',
  'Переезд собственника или основателя',
  'Проверка банка / PSP / происхождения средств',
  'Частный капитал или семейный офис',
  'Действующая структура перед сделкой или внешней проверкой',
  'Для украинских собственников и бизнеса в Европе',
  'От первичной проверки к внедрению и постоянной координации'
];

const forbiddenLegacy = [
  'Украинский собственник или бизнес в Европе',
  'Основатель или международная группа',
  'Растущий бизнес без внутренней международной юридической команды'
];

for (const phrase of required) {
  if (!html.includes(phrase)) throw new Error(`RU final client journey phrase missing: ${phrase}`);
}

for (const phrase of forbiddenLegacy) {
  if (html.includes(phrase)) throw new Error(`RU legacy client journey phrase still present: ${phrase}`);
}

console.log('[LEXONYX client journeys RU] final situational architecture confirmed');
