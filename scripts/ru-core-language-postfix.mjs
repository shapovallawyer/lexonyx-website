import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const fixes = new Map([
  ['DEMпостоянное представительство', 'функции разработки, совершенствования, поддержания, защиты и использования нематериальных активов (DEMPE)'],
  ['DEMпостоянное', 'DEMPE'],
  ['вопросыable', 'проверяемый']
]);

const targets = [
  'ru/index.html',
  'ru/formaty-raboty/ekspress-proverka-riskov.html'
];

let changed = 0;
for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, 'utf8');
  let html = original;
  for (const [from, to] of fixes) html = html.split(from).join(to);
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}
console.log(`[LEXONYX RU core language postfix] changed=${changed}`);
