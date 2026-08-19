import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const UK = path.join(ROOT, 'uk');

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(file));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(file);
  }
  return out;
}

const forbidden = [
  'кваліфікувати запит',
  'кваліфікації запиту',
  'первинної кваліфікації',
  'первинна кваліфікація',
  'правильний формат',
  'правильного формату',
  'group architecture',
  'regulatory workstreams',
  'current-law workstreams',
  'паперовою структурою',
  'паперова структура',
  'єдиного narrative',
  'єдиний narrative',
  'головний тригер',
  'модель читається цілісно',
  'виглядає модель пояснюваною',
  'розповідають різні історії',
  'структура не проходить перевірку',
  'підхід, що витримує перевірку',
  'витримувала перевірку',
  'Незалежна advisory-практика',
  'незалежна advisory-практика',
  'Advisory як ongoing-формат',
  'Супровід та advisory',
  'Супровід і advisory',
  'candidate jurisdictions',
  'кандидатних юрисдикціях'
];

function hrefFor(html, lang) {
  const patterns = [
    new RegExp(`<link\\b[^>]*rel=["']alternate["'][^>]*hreflang=["']${lang}["'][^>]*href=["']([^"']+)["'][^>]*>`, 'i'),
    new RegExp(`<link\\b[^>]*hreflang=["']${lang}["'][^>]*href=["']([^"']+)["'][^>]*rel=["']alternate["'][^>]*>`, 'i'),
    new RegExp(`<link\\b[^>]*href=["']([^"']+)["'][^>]*hreflang=["']${lang}["'][^>]*rel=["']alternate["'][^>]*>`, 'i')
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) return m[1];
  }
  return '';
}

let files = 0;
let failures = 0;
for (const file of walk(UK)) {
  files++;
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const html = fs.readFileSync(file, 'utf8');
  const issues = [];

  for (const phrase of forbidden) if (html.includes(phrase)) issues.push(`copy:${phrase}`);

  if (/"inLanguage"\s*:\s*"ru"/.test(html)) issues.push('metadata:inLanguage=ru');

  const canonicalTags = html.match(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi) || [];
  if (canonicalTags.length > 1) issues.push(`metadata:duplicate-canonical=${canonicalTags.length}`);

  const en = hrefFor(html, 'en');
  const xd = hrefFor(html, 'x-default');
  if (en && xd && en !== xd) issues.push(`metadata:x-default=${xd}; expected=${en}`);

  if (!html.includes('/uk/visual-fixes.css?v=20260819')) issues.push('ui:missing-uk-visual-fixes');

  if (rel === 'uk/index.html') {
    if (html.includes('/ru/search.html')) issues.push('metadata:stale-ru-search-action');
    if (!/"knowsLanguage"\s*:\s*\[[^\]]*"uk"/s.test(html)) issues.push('metadata:knowsLanguage-missing-uk');
  }

  if (issues.length) {
    failures += issues.length;
    console.error(`FAIL ${rel}`);
    for (const issue of issues) console.error(`  ${issue}`);
  }
}

// Runtime copy is multilingual. UK QA must inspect only the Ukrainian copy object;
// otherwise valid English terms in the EN block create false failures.
const runtime = fs.readFileSync(path.join(ROOT, 'scripts', 'compliance-runtime.js'), 'utf8');
const ukStart = runtime.indexOf('\n      uk: {');
const ukEnd = ukStart >= 0 ? runtime.indexOf('\n      }\n    };', ukStart) : -1;
let ukRuntime = '';
if (ukStart < 0 || ukEnd < 0) {
  failures++;
  console.error('FAIL scripts/compliance-runtime.js\n  runtime-structure:uk-copy-block-not-found');
} else {
  ukRuntime = runtime.slice(ukStart, ukEnd + '\n      }'.length);
}

const runtimeForbidden = [
  'ownership, контроль, компанії та доходи',
  'current-law workstreams',
  'prudential requirements',
  're-authorisation',
  'prudential safeguards',
  'supervisory requirements',
  'regulatory perimeter для підтвердження',
  'кандидатних юрисдикціях'
];
for (const phrase of runtimeForbidden) {
  if (ukRuntime.includes(phrase)) {
    failures++;
    console.error(`FAIL scripts/compliance-runtime.js\n  uk-runtime-copy:${phrase}`);
  }
}

console.log(`[LEXONYX UK final copy QA] files=${files} failures=${failures}`);
if (failures) process.exit(1);
