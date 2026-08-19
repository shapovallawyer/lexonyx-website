import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const mapPath = path.join(ROOT, '_url-map-i18n.json');
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const invEn = new Map(Object.entries(map.en || {}).map(([ru, en]) => [en, ru]));
const invUk = new Map(Object.entries(map.uk || {}).map(([ru, uk]) => [uk, ru]));

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...htmlFiles(p));
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function expectedLangLinks(rel) {
  let ruKey = null;
  if (rel.startsWith('ru/')) ruKey = rel;
  else if (rel.startsWith('en/')) ruKey = invEn.get(rel) || null;
  else if (rel.startsWith('uk/')) ruKey = invUk.get(rel) || null;
  if (!ruKey) return null;
  const en = map.en?.[ruKey];
  const uk = map.uk?.[ruKey];
  if (!en || !uk) return null;
  return { ru: '/' + ruKey, en: '/' + en, uk: '/' + uk };
}

function normalizeLangOptions(html, links) {
  if (!links) return html;
  return html.replace(/<a\b[^>]*class=["'][^"']*lang-option[^"']*["'][^>]*>/gi, tag => {
    const m = tag.match(/lang=["'](ru|en|uk)["']/i);
    if (!m) return tag;
    const href = links[m[1].toLowerCase()];
    if (!href) return tag;
    return /href=/i.test(tag) ? tag.replace(/href=["'][^"']*["']/i, `href="${href}"`) : tag.replace(/>$/, ` href="${href}">`);
  });
}

const replacements = [
  ['we design the model so that it reads as a coherent whole and withstands review by a bank, tax authority or regulator.', 'we structure the model so that its logic, facts and evidence can be presented coherently to a bank, tax authority or regulator.'],
  ['Such a model does not create contradictions under bank or tax authority review because the stated position matches the factual reality — that is the defensibility of the structure.', 'The aim is to reduce contradictions between the stated position and the factual reality, so that the structure is explainable and can be supported with evidence when reviewed.'],
  ['We structure the work so that decisions withstand review against documents and the reality of the operating model.', 'We structure the work so that decisions can be explained against the documents and the reality of the operating model.'],
  ['мы выстраиваем модель так, чтобы она читалась целостно и выдерживала проверку банка, налогового органа и регулятора.', 'мы выстраиваем модель так, чтобы её логика, факты и доказательная база могли быть последовательно представлены банку, налоговому органу или регулятору.'],
  ['Такая модель не вызывает противоречий при проверке банком или налоговым органом, потому что заявленное совпадает с фактическим — это и есть защищаемость структуры.', 'Цель — уменьшить противоречия между заявленной позицией и фактической реальностью, чтобы структура была объяснимой и могла быть подтверждена доказательной базой при внешней проверке.'],
  ['Мы выстраиваем работу так, чтобы решения выдерживали проверку документами и фактической моделью бизнеса.', 'Мы выстраиваем работу так, чтобы решения можно было объяснить через документы и фактическую модель бизнеса.'],
  ['ми вибудовуємо модель так, щоб вона читалася цілісно та витримувала перевірку банку, податкового органу й регулятора.', 'ми вибудовуємо модель так, щоб її логіка, факти та доказова база могли бути послідовно представлені банку, податковому органу або регулятору.'],
  ['Така модель не створює суперечностей під час перевірки банком або податковим органом, тому що заявлене збігається з фактичним — це і є захищеність структури.', 'Мета — зменшити суперечності між заявленою позицією та фактичною реальністю, щоб структура була пояснюваною і могла бути підтверджена доказовою базою під час зовнішньої перевірки.']
];

function patchMarketing(html, rel) {
  for (const [from, to] of replacements) html = html.split(from).join(to);

  if (/\/(request-review|zaprosit-razbor|zapytaty-rozbir)\.html$/.test('/' + rel)) {
    html = html.replace(/<h3>1\) Preliminary Risk Map<\/h3>/g, '<h3>1) Preliminary Issue Map</h3>');
    html = html.replace(/A high-level map covering tax \/ VAT \/ PE \/ banks\/PSPs \/ regulatory perimeter — without promises of a specific outcome\./g, 'A high-level map of the factual and structural issues that may require deeper analysis or specialist confirmation — without substantive conclusions or promises of a specific outcome.');
    html = html.replace(/<h3>1\) Предварительная карта рисков<\/h3>/g, '<h3>1) Предварительная карта вопросов</h3>');
    html = html.replace(/<h3>1\) Попередня карта ризиків<\/h3>/g, '<h3>1) Попередня карта питань</h3>');
  }
  return html;
}

let scanned = 0, changed = 0, unmappedSwitchers = [];
for (const lang of ['en', 'ru', 'uk']) {
  for (const file of htmlFiles(path.join(ROOT, lang))) {
    scanned++;
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const original = fs.readFileSync(file, 'utf8');
    const links = expectedLangLinks(rel);
    let html = normalizeLangOptions(original, links);
    html = patchMarketing(html, rel);
    if (!links && /class=["'][^"']*lang-option/i.test(original) && !/(?:privacy-policy|cookie-policy|terms-of-use|impressum)\.html$/.test(rel)) unmappedSwitchers.push(rel);
    if (html !== original) { fs.writeFileSync(file, html, 'utf8'); changed++; }
  }
}

console.log(`[LEXONYX final i18n/marketing cleanup] scanned=${scanned} changed=${changed}`);
if (unmappedSwitchers.length) console.log('[LEXONYX final i18n/marketing cleanup] unmapped language-switch pages: ' + unmappedSwitchers.slice(0, 30).join(', '));
