import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const edits = [
  {
    file: 'ru/insayty/razbory/founder-moves-business-stays.html',
    from: 'Собственник переехал, бизнес остался: что на самом деле меняется в международной структуре?',
    to: 'Переезд собственника: что меняется в международной структуре?'
  },
  {
    file: 'uk/insaity/rozbory/founder-moves-business-stays.html',
    from: 'Власник переїхав, бізнес залишився: що насправді змінюється в міжнародній структурі?',
    to: 'Переїзд власника: що змінюється в міжнародній структурі?'
  }
];

for (const edit of edits) {
  const file = path.join(ROOT, edit.file);
  if (!fs.existsSync(file)) throw new Error(`FM-01 localized page missing: ${edit.file}`);
  let html = fs.readFileSync(file, 'utf8');
  if (!html.includes(edit.from)) throw new Error(`FM-01 expected H1 not found: ${edit.file}`);
  html = html.split(edit.from).join(edit.to);
  fs.writeFileSync(file, html, 'utf8');
}

console.log('[FM-01 mobile title polish] PASS — RU/UK H1 shortened without changing article scope');
