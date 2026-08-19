import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const map = JSON.parse(fs.readFileSync(path.join(ROOT, '_url-map-i18n.json'), 'utf8'));
const ruKeys = new Set([
  ...Object.keys(map.en || {}).filter(k => k.startsWith('ru/')),
  ...Object.keys(map.uk || {}).filter(k => k.startsWith('ru/'))
]);

function switchMarkup(rel, kind) {
  const en = map.en?.[rel];
  const uk = map.uk?.[rel];
  const cls = kind === 'header' ? 'header-lang-switch' : 'mobile-lang-switch';
  const aria = kind === 'header' ? ' aria-label="Переключение языка"' : '';
  const parts = [`<a href="/${rel}" class="lang-option active" lang="ru">RU</a>`];
  if (en) parts.push('<span class="lang-divider">|</span>', `<a href="/${en}" class="lang-option" lang="en">EN</a>`);
  if (uk) parts.push('<span class="lang-divider">|</span>', `<a href="/${uk}" class="lang-option" lang="uk">UK</a>`);
  return `<div class="${cls}"${aria}>\n            ${parts.join('\n            ')}\n          </div>`;
}

function replaceSwitch(html, rel, kind) {
  const cls = kind === 'header' ? 'header-lang-switch' : 'mobile-lang-switch';
  const re = new RegExp(`<div\\b[^>]*class=["'][^"']*\\b${cls}\\b[^"']*["'][^>]*>[\\s\\S]*?<\\/div>`, 'i');
  return re.test(html) ? html.replace(re, switchMarkup(rel, kind)) : html;
}

let changed = 0;
for (const rel of ruKeys) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  let html = before;

  html = replaceSwitch(html, rel, 'header');
  html = replaceSwitch(html, rel, 'mobile');

  if (!/href=["']\/ru\/visual-fixes\.css["']/i.test(html)) {
    html = html.replace(/<\/head>/i, '  <link rel="stylesheet" href="/ru/visual-fixes.css" />\n</head>');
  }

  if (rel === 'ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html') {
    html = html.replace(/Вернуться к структурированию группы/g, 'К структурированию группы');
  }
  if (rel === 'ru/zaprosit-razbor.html') {
    html = html.replace(/Предпочитаю написать напрямую/g, 'Написать напрямую');
  }

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU final visual fixes] changed=${changed}/${ruKeys.size}`);
