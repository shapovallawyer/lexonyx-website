import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RU = path.join(ROOT, 'ru');

function htmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) htmlFiles(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const replacements = [
  ['VAT и трансграничные модели', 'НДС и трансграничные модели'],
  ['PE-risk и международные команды', 'Риск постоянного представительства и международные команды'],
  ['Source of Funds / Source of Wealth', 'Происхождение средств / происхождение капитала'],
  ['Частный капитал и family office', 'Частный капитал и семейный офис'],
  ['Сопровождение и advisory', 'Сопровождение и консультирование'],
  ['Фактическое присутствие и governance', 'Фактическое присутствие и корпоративное управление'],
  ['Независимая advisory-практика для международного бизнеса: международное структурирование, tax/VAT/PE риски,\n            банковская готовность и regulatory fit в EU, UK и UAE.', 'Независимая практика для международного бизнеса: структурирование международных групп, налоговые и НДС-риски, риск постоянного представительства, банковская готовность и соответствие регуляторным требованиям в ЕС, Великобритании и ОАЭ.'],
  ['EU · UK · UAE', 'ЕС · Великобритания · ОАЭ'],
  ['compliance-совместимыми структурами', 'структурами, соответствующими требованиям комплаенса'],
  ['Политика cookies', 'Политика файлов cookie'],
  ['Настройки cookies', 'Настройки файлов cookie'],
  ['>Impressum<', '>Правовая информация<']
];

let changed = 0;
for (const file of htmlFiles(RU)) {
  const original = fs.readFileSync(file, 'utf8');
  let html = original;
  for (const [from, to] of replacements) html = html.split(from).join(to);
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU common UI curation] changed=${changed}`);
