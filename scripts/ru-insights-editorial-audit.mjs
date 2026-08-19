import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const targets = [
  'ru/insayty/index.html',
  'ru/insayty/brifingi/index.html',
  'ru/insayty/brifingi/playbook-group-architecture.html',
  'ru/insayty/razbory/index.html',
  'ru/insayty/razbory/deep-dives.html',
  'ru/insayty/razbory/deep-dive-banking-readiness.html',
  'ru/insayty/razbory/deep-dive-cfc-residency.html',
  'ru/insayty/razbory/deep-dive-holdco-opco.html',
  'ru/insayty/razbory/deep-dive-pe-remote.html',
  'ru/insayty/razbory/deep-dive-vat-architecture.html',
  'ru/insayty/instrumenty/index.html',
  'ru/insayty/instrumenty/checklists.html',
  'ru/insayty/instrumenty/checklist-substance.html'
];

const allowed = new Set([
  'LEXONYX','KYC','AML','FATF','MLI','PPT','GAAR','DEMPE','MiCA','SaaS','OSS','IOSS','EOR','PSP','EMI','UBO','GDPR',
  'UA','DE','CY','PL','NL','AE','EE','IE','CH','RU','EN'
]);

const errors = [];

function strip(fragment) {
  return fragment
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function relevantSeo(html) {
  const values = [];
  const patterns = [
    /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/gi,
    /<meta\b[^>]*property=["']og:(?:title|description)["'][^>]*content=["']([^"']*)["'][^>]*>/gi,
    /<meta\b[^>]*name=["']twitter:(?:title|description)["'][^>]*content=["']([^"']*)["'][^>]*>/gi
  ];
  for (const re of patterns) for (const m of html.matchAll(re)) values.push(m[1]);

  for (const m of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(m[1]);
      const walk = v => {
        if (Array.isArray(v)) return v.forEach(walk);
        if (!v || typeof v !== 'object') return;
        for (const [k,val] of Object.entries(v)) {
          if (['name','description','text','headline'].includes(k) && typeof val === 'string') values.push(val);
          else if (val && typeof val === 'object') walk(val);
        }
      };
      walk(data);
    } catch {}
  }
  return values.join(' ');
}

for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { errors.push(`${rel}: missing`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const main = (html.match(/<main\b[\s\S]*?<\/main>/i) || html.match(/<body\b[\s\S]*?<\/body>/i) || [''])[0];
  if (!main) { errors.push(`${rel}: content container missing`); continue; }

  const text = `${strip(main)} ${relevantSeo(html)}`.replace(/\s+/g,' ').trim();
  const latin = [...new Set(text.match(/[A-Za-z][A-Za-z-]*/g) || [])]
    .filter(t => !allowed.has(t));
  if (latin.length) errors.push(`${rel}: avoidable Latin terms: ${latin.slice(0,80).join(', ')}`);

  for (const m of main.matchAll(/<(?:p|h1|h2|h3|h4|li)\b[^>]*>([\s\S]*?)<\/(?:p|h1|h2|h3|h4|li)>/gi)) {
    const block = strip(m[1]);
    if (/^[а-яё]/.test(block)) errors.push(`${rel}: lowercase block start: ${block.slice(0,100)}`);
  }

  const badGrammar = [
    /\bпо риск\b/i,
    /\bс риск\b/i,
    /\bчастью целевая\b/i,
    /\bи и\b/i,
    /\bв в\b/i,
    /\bдля для\b/i,
    /\bструктура структура\b/i,
    /\bуправление управление\b/i
  ];
  for (const re of badGrammar) if (re.test(text)) errors.push(`${rel}: suspicious grammar: ${re}`);
}

if (errors.length) {
  console.error(`[LEXONYX RU insights editorial audit] FAILED — ${errors.length} issue(s):`);
  for (const e of errors.slice(0,220)) console.error(' - ' + e);
  process.exit(1);
}

console.log(`[LEXONYX RU insights editorial audit] PASS — pages=${targets.length}`);
