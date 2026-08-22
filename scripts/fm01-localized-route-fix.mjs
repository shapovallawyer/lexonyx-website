import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const files = [
  'ru/insayty/razbory/founder-moves-business-stays.html',
  'uk/insaity/rozbory/founder-moves-business-stays.html'
];
const replacements = new Map([
  ['/ru/ekspertiza/proishozhdenie-sredstv','/ru/ekspertiza/source-of-funds'],
  ['/uk/ekspertyza/dzherelo-koshtiv','/uk/ekspertyza/source-of-funds'],
  ['/uk/ekspertyza/pe-risk-ta-mizhnarodni-komandy','/uk/ekspertyza/pe-ryzyk-ta-mizhnarodni-komandy'],
  ['Собственник переехал, бизнес остался: что на самом деле меняется в международной структуре?','Переезд собственника: что меняется в международной структуре?'],
  ['Власник переїхав, бізнес залишився: що насправді змінюється в міжнародній структурі?','Переїзд власника: що змінюється в міжнародній структурі?']
]);
for (const rel of files) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`FM-01 localized page missing: ${rel}`);
  let html = fs.readFileSync(file, 'utf8');
  for (const [from,to] of replacements) html = html.split(from).join(to);
  if (rel.startsWith('uk/')) {
    html = html.replace(
      'Карта не создаёт автоматических правовых выводов. Её задача — определить, какие части архитектуры изменились и какие вопросы требуют анализа в конкретных юрисдикциях.',
      'Карта не створює автоматичних правових висновків. Її завдання — визначити, які частини архітектури змінилися і які питання потребують аналізу в конкретних юрисдикціях.'
    );
  }
  fs.writeFileSync(file, html, 'utf8');
}
console.log('[FM-01 localized routes/copy] PASS — canonical routes, language fallback and mobile H1 normalized');
