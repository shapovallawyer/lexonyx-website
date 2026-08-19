import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const targets = [
  'ru/index.html',
  'ru/ekspertiza/index.html',
  'ru/ekspertiza/strukturirovanie-gruppy.html',
  'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
  'ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html',
  'ru/ekspertiza/bankovskaya-gotovnost.html',
  'ru/ekspertiza/substance-i-governance.html',
  'ru/ekspertiza/vat-i-transgranichnye-modeli.html',
  'ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html',
  'ru/ekspertiza/source-of-funds.html',
  'ru/ekspertiza/chastnyy-kapital-i-family-office.html',
  'ru/formaty-raboty/index.html',
  'ru/formaty-raboty/kak-nachat.html',
  'ru/formaty-raboty/ekspress-proverka-riskov.html',
  'ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html',
  'ru/formaty-raboty/soprovozhdenie-i-advisory.html',
  'ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html',
  'ru/o-praktike/index.html',
  'ru/o-praktike/kto-my.html',
  'ru/o-praktike/kak-my-rabotaem.html'
];

const allowed = new Set([
  'LEXONYX','KYC','AML','FATF','MLI','PPT','GAAR','SaaS','OSS','IOSS','EOR','B2B','B2C',
  'Rechtsanwalt','Steuerberater','BRAO','GDPR','e-Residency','LinkedIn','Telegram','Email'
]);

const errors = [];

function visibleAndSeo(html) {
  const scripts = [];
  const jsonStrings = [];
  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      const walk = v => {
        if (Array.isArray(v)) return v.forEach(walk);
        if (v && typeof v === 'object') return Object.values(v).forEach(walk);
        if (typeof v === 'string' && !/^https?:\/\//i.test(v)) jsonStrings.push(v);
      };
      walk(data);
    } catch {}
  }
  const meta = [...html.matchAll(/<meta\b[^>]*\bcontent=["']([^"']*)["'][^>]*>/gi)].map(m => m[1]).join(' ');
  const visible = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return `${visible} ${meta} ${jsonStrings.join(' ')}`.replace(/\s+/g,' ').trim();
}

for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { errors.push(`${rel}: missing`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const text = visibleAndSeo(html);

  const latin = [...new Set(text.match(/[A-Za-z][A-Za-z-]*/g) || [])]
    .filter(t => !allowed.has(t) && !/^https?$/.test(t));
  if (latin.length) errors.push(`${rel}: avoidable Latin terms: ${latin.slice(0,40).join(', ')}`);

  const badGrammar = [
    /\bпо риск постоянного представительства\b/i,
    /\bс риск постоянного представительства\b/i,
    /\bчастью целевая\b/i,
    /\bналоговые вопросы-\w+/i,
    /\bрегуляторные вопросы-\w+/i,
    /\bкорпоративное управление-\w+/i,
    /\bи и\b/i,
    /\bв в\b/i,
    /\bдля для\b/i
  ];
  for (const re of badGrammar) if (re.test(text)) errors.push(`${rel}: suspicious grammar: ${re}`);

  const main = (html.match(/<main\b[\s\S]*?<\/main>/i) || [''])[0];
  for (const m of main.matchAll(/<(?:p|h1|h2|h3|h4|li)\b[^>]*>([\s\S]*?)<\/(?:p|h1|h2|h3|h4|li)>/gi)) {
    const block = m[1].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    if (/^[а-яё]/.test(block)) errors.push(`${rel}: lowercase block start: ${block.slice(0,90)}`);
  }
}

if (errors.length) {
  console.error(`[LEXONYX RU core editorial audit] FAILED — ${errors.length} issue(s):`);
  for (const e of errors.slice(0,160)) console.error(' - ' + e);
  process.exit(1);
}
console.log(`[LEXONYX RU core editorial audit] PASS — pages=${targets.length}`);
