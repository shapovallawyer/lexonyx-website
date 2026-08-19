import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const files = [
  'ru/yurisdikcii/ukraina.html',
  'ru/yurisdikcii/germaniya.html',
  'ru/yurisdikcii/kipr.html',
  'ru/yurisdikcii/polsha.html',
  'ru/yurisdikcii/niderlandy.html',
  'ru/yurisdikcii/oae.html',
  'ru/yurisdikcii/estoniya.html',
  'ru/yurisdikcii/irlandiya.html',
  'ru/yurisdikcii/velikobritaniya.html',
  'ru/yurisdikcii/shveycariya.html'
];

const allowedLatin = new Set([
  'LEXONYX', 'KYC', 'SaaS', 'O', 'e-Residency', 'Rechtsanwalt', 'Steuerberater', 'Brexit'
]);

const errors = [];

function strip(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const rel of files) {
  const html = fs.readFileSync(path.join(ROOT, rel), 'utf8');
  const main = (html.match(/<main\b[\s\S]*?<\/main>/i) || [''])[0];
  if (!main) {
    errors.push(`${rel}: main missing`);
    continue;
  }

  const text = strip(main);
  const latin = [...new Set(text.match(/[A-Za-z][A-Za-z-]*/g) || [])]
    .filter(token => !allowedLatin.has(token));
  if (latin.length) errors.push(`${rel}: avoidable Latin terms: ${latin.join(', ')}`);

  for (const m of main.matchAll(/<(?:p|h1|h2|h3|h4)\b[^>]*>([\s\S]*?)<\/(?:p|h1|h2|h3|h4)>/gi)) {
    const block = strip(m[1]);
    if (/^[а-яё]/.test(block)) errors.push(`${rel}: lowercase block start: ${block.slice(0,80)}`);
  }

  if (/[.!?]\s+[а-яё]/.test(text)) errors.push(`${rel}: lowercase sentence start detected`);
  if (/\b(?:and|or|founder|ownership|management|company|entity|workstream|governance|substance|banking|specialist|investor|operating|workforce|development|architecture|review|Matter|HoldCo|OpCo|Target State|Current State|Business Purpose)\b/i.test(text)) {
    errors.push(`${rel}: banned mixed-language business terminology remains`);
  }
}

if (errors.length) {
  console.error(`[LEXONYX RU jurisdiction editorial audit] FAILED — ${errors.length} issue(s):`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}

console.log(`[LEXONYX RU jurisdiction editorial audit] PASS — curated pages=${files.length}`);
