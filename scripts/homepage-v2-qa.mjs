import fs from 'node:fs';

const FILES = ['en/index.html', 'ru/index.html', 'uk/index.html'];
const REMOVED = ['home-directions', 'home-structure-types', 'home-situations', 'home-timing'];
const ORDER = ['hero-home', 'home-audience', 'home-flagship', 'home-deliverables', 'home-formats', 'home-founder', 'home-cases', 'home-insights', 'home-cta'];

function count(html, rx) { return [...html.matchAll(rx)].length; }
function textWordCount(html) {
  const text = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return text ? text.split(' ').length : 0;
}

const failures = [];
for (const file of FILES) {
  const html = fs.readFileSync(file, 'utf8');
  for (const token of REMOVED) {
    if (new RegExp(`class=["'][^"']*\\b${token}\\b`, 'i').test(html)) failures.push(`${file}: duplicate section ${token} still present`);
  }

  let last = -1;
  for (const token of ORDER) {
    const m = new RegExp(`class=["'][^"']*\\b${token}\\b`, 'i').exec(html);
    if (!m) { failures.push(`${file}: required section ${token} missing`); continue; }
    if (m.index <= last) failures.push(`${file}: section order invalid at ${token}`);
    last = m.index;
  }

  const journeyCards = count(html, /class=["'][^"']*\bclient-journey-card\b[^"']*["']/gi);
  if (journeyCards !== 5) failures.push(`${file}: expected 5 client journey cards, found ${journeyCards}`);
  const specialistRoutes = count(html, /class=["'][^"']*\bclient-specialist-route\b[^"']*["']/gi);
  if (specialistRoutes !== 1) failures.push(`${file}: expected 1 dedicated specialist route, found ${specialistRoutes}`);

  const heroMatch = /<section\b(?=[^>]*class=["'][^"']*\bhero-home\b[^"']*["'])[^>]*>[\s\S]*?<\/section>/i.exec(html)?.[0] || '';
  const heroSubtitles = count(heroMatch, /class=["'][^"']*\bhero-subtitle\b[^"']*["']/gi);
  if (heroSubtitles !== 1) failures.push(`${file}: expected 1 hero subtitle, found ${heroSubtitles}`);

  const flagshipMatch = /<section\b(?=[^>]*class=["'][^"']*\bhome-flagship\b[^"']*["'])[^>]*>[\s\S]*?<\/section>/i.exec(html)?.[0] || '';
  const schemaLines = count(flagshipMatch, /class=["'][^"']*\bschema-line\b[^"']*["']/gi);
  if (schemaLines !== 4) failures.push(`${file}: expected 4 homepage methodology lines, found ${schemaLines}`);

  const deliverablesMatch = /<section\b(?=[^>]*class=["'][^"']*\bhome-deliverables\b[^"']*["'])[^>]*>[\s\S]*?<\/section>/i.exec(html)?.[0] || '';
  const deliverableCards = count(deliverablesMatch, /class=["'][^"']*\baudience-card\b[^"']*["']/gi);
  if (deliverableCards !== 4) failures.push(`${file}: expected 4 deliverable cards, found ${deliverableCards}`);

  const words = textWordCount(html);
  if (words < 800 || words > 1700) failures.push(`${file}: homepage word count ${words} outside intended 800–1700 range`);
}

if (failures.length) {
  console.error('[LEXONYX homepage v2 QA] FAIL');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log('[LEXONYX homepage v2 QA] PASS — scenario-first hierarchy, duplicates removed, homepage depth controlled');
