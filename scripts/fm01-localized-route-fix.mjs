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
  ['/uk/ekspertyza/pe-risk-ta-mizhnarodni-komandy','/uk/ekspertyza/pe-ryzyk-ta-mizhnarodni-komandy']
]);
for (const rel of files) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`FM-01 localized page missing: ${rel}`);
  let html = fs.readFileSync(file, 'utf8');
  for (const [from,to] of replacements) html = html.split(from).join(to);
  fs.writeFileSync(file, html, 'utf8');
}
console.log('[FM-01 localized routes] PASS — RU/UK internal routes normalized to existing canonical slugs');
