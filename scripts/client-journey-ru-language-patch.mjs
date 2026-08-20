import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'ru', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const replacements = [
  ['Первая иностранная компания, растущая HoldCo/OpCo-структура или действующая модель, которая уже не соответствует реальной работе бизнеса.', 'Первая иностранная компания, растущая холдинговая и операционная структура или действующая модель, которая уже не соответствует реальной работе бизнеса.'],
  ['Проверка банка / PSP / Source of Funds', 'Проверка банка / PSP / происхождение средств'],
  ['Онбординг, усиленная проверка или повторяющиеся вопросы об ownership, UBO, потоках, Source of Funds / Source of Wealth и бизнес-модели.', 'Онбординг, усиленная проверка или повторяющиеся вопросы о структуре владения, бенефициаре, потоках, происхождении средств и капитала и самой бизнес-модели.'],
  ['Частный капитал или Family Office', 'Частный капитал или семейный офис']
];

for (const [from, to] of replacements) {
  if (!html.includes(from)) throw new Error(`RU client journey phrase not found: ${from}`);
  html = html.replace(from, to);
}

fs.writeFileSync(file, html, 'utf8');
console.log('[LEXONYX client journeys RU] naturalized funnel copy');
