import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const failures = [];

function read(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) { failures.push(`${rel}: missing`); return ''; }
  return fs.readFileSync(file, 'utf8');
}

function metaDescription(html) {
  const tag = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i)?.[0] || '';
  return tag.match(/content=["']([^"']*)["']/i)?.[1] || '';
}

const commercial = [
  'en/index.html','en/expertise/group-structuring.html','en/expertise/tax-residency-cfc.html','en/expertise/banking-readiness.html','en/expertise/substance-governance.html','en/expertise/regulatory-licensing.html','en/expertise/private-capital-and-family-office.html','en/work-formats/strategic-structural-audit.html','en/request-review.html','en/contact.html',
  'ru/index.html','ru/ekspertiza/strukturirovanie-gruppy.html','ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html','ru/ekspertiza/bankovskaya-gotovnost.html','ru/ekspertiza/substance-i-governance.html','ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html','ru/ekspertiza/chastnyy-kapital-i-family-office.html','ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html','ru/zaprosit-razbor.html','ru/kontakty.html',
  'uk/index.html','uk/ekspertyza/strukturuvannya-grupy.html','uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html','uk/ekspertyza/bankivska-gotovnist.html','uk/ekspertyza/substance-ta-governance.html','uk/ekspertyza/regulyatorna-arhitektura-ta-litsenzuvannya.html','uk/ekspertyza/pryvatnyy-kapital-i-family-office.html','uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html','uk/zapytaty-rozbir.html','uk/kontakty.html'
];

for (const rel of commercial) {
  const html = read(rel);
  const d = metaDescription(html);
  if (!d) failures.push(`${rel}: meta description missing`);
  if (d.length > 165) failures.push(`${rel}: meta description ${d.length} chars`);
  const runtimeCount = (html.match(/\/scripts\/analytics-runtime\.js/g) || []).length;
  if (runtimeCount !== 1) failures.push(`${rel}: analytics runtime count=${runtimeCount}`);
}

const contactTargets = {
  'en/contact.html': '/en/intake/thank-you.html',
  'ru/kontakty.html': '/ru/spasibo.html',
  'uk/kontakty.html': '/uk/intake/dyakuyemo.html'
};
for (const [rel, target] of Object.entries(contactTargets)) {
  const html = read(rel);
  const form = html.match(/<form\b[^>]*\bname=["']contact["'][^>]*>/i)?.[0] || '';
  const action = form.match(/action=["']([^"']+)["']/i)?.[1] || '';
  if (action !== target) failures.push(`${rel}: contact action=${action || 'missing'} expected=${target}`);
}

const utilityPaths = [
  'en/intake/thank-you.html','en/thank-you-newsletter.html',
  'ru/intake/spasibo.html','ru/intake/spasibo-newsletter.html',
  'uk/intake/dyakuyemo.html','uk/dyakuyemo-newsletter.html'
];
for (const rel of utilityPaths) {
  const html = read(rel);
  if (html && !/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*content=["'][^"']*noindex/i.test(html)) failures.push(`${rel}: expected noindex`);
}

const runtime = read('scripts/analytics-runtime.js');
for (const forbidden of ['email:', 'user_email', 'message_text', 'form_value']) {
  if (runtime.includes(forbidden)) failures.push(`analytics runtime: forbidden PII field token ${forbidden}`);
}

if (failures.length) {
  console.error('[LEXONYX conversion/SEO QA] FAIL');
  for (const f of failures) console.error(' - ' + f);
  process.exit(1);
}
console.log(`[LEXONYX conversion/SEO QA] PASS — commercial pages=${commercial.length}; contact routes=3; utility noindex=${utilityPaths.length}`);
