import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EN = path.join(ROOT, 'en');

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
  'qualify your request',
  'qualify the request',
  'Initial Qualification Form',
  'initial qualification form',
  'initial request qualification',
  'right entry point',
  'the right format',
  'We design international structures that withstand tax, banking, investment and regulatory scrutiny.',
  'permissible operating perimeter',
  'the paper structure and the real operation',
  'whether the model appears explainable',
  'building a single narrative',
  'assemble explainable documentation',
  'ensure that the model reads coherently',
  'a defensible approach to the international structure',
  'Ukrainian and international law',
  'independent consulting company'
];

let files = 0;
let failures = 0;
for (const file of walk(EN)) {
  files++;
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const html = fs.readFileSync(file, 'utf8');
  const issues = [];

  for (const phrase of forbidden) if (html.includes(phrase)) issues.push(`copy:${phrase}`);

  if (/"inLanguage"\s*:\s*"ru"/.test(html)) issues.push('metadata:inLanguage=ru');

  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  const canonicalUrl = canonical?.[1] || '';
  if (canonicalUrl.includes('/en/')) {
    const x = html.match(/<link\b[^>]*hreflang=["']x-default["'][^>]*href=["']([^"']+)["'][^>]*>/i)
      || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*hreflang=["']x-default["'][^>]*>/i);
    if (x && x[1] !== canonicalUrl) issues.push(`metadata:x-default=${x[1]}`);
  }

  if (issues.length) {
    failures += issues.length;
    console.error(`FAIL ${rel}`);
    for (const issue of issues) console.error(`  ${issue}`);
  }
}

const runtime = fs.readFileSync(path.join(ROOT, 'scripts', 'compliance-runtime.js'), 'utf8');
const runtimeForbidden = [
  'LEXONYX performs structural and factual cross-border analysis.',
  'current-law workstreams rather than static background assumptions.',
  'We decompose the business model into activities'
];
for (const phrase of runtimeForbidden) {
  if (runtime.includes(phrase)) {
    failures++;
    console.error(`FAIL scripts/compliance-runtime.js\n  runtime-copy:${phrase}`);
  }
}

console.log(`[LEXONYX EN final copy QA] files=${files} failures=${failures}`);
if (failures) process.exit(1);
