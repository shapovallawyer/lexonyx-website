import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const file = path.join(ROOT, 'en/insights/deep-dives/founder-moves-business-stays.html');
const errors = [];
const fail = (m) => errors.push(m);

if (!fs.existsSync(file)) {
  fail('generated FM-01 EN page missing');
} else {
  const html = fs.readFileSync(file, 'utf8');
  const text = html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');

  if (!html.includes('<title>Founder Relocation: Tax Residence, CFC, PE & Management | LEXONYX</title>')) fail('title mismatch');
  if (!html.includes('https://lexonyx.com/en/insights/deep-dives/founder-moves-business-stays')) fail('canonical/Article URL missing');
  if (/founder-moves-business-stays\.html/.test((html.match(/<link rel="canonical"[^>]*>/i) || [''])[0])) fail('canonical must be clean URL');
  if (!text.includes('Founder Moves, Business Stays: What Actually Changes in a Cross-Border Structure?')) fail('H1 missing');
  if (!text.includes('Founder relocation should therefore be treated as a cross-border structural event')) fail('master thesis missing');
  if (!text.includes('A founder working from home and a founder managing the company from home are not necessarily the same PE fact pattern.')) fail('home-office authority point missing');
  if (!text.includes('no automatic presumption of PE')) fail('OECD 50% qualification missing');
  if (!text.includes('Domestic-law residence and treaty residence are related')) fail('domestic/treaty residence distinction missing');
  if (!text.includes('CRS and AML/KYC are not the same legal regime')) fail('CRS/AML distinction missing');
  if (!text.includes('Directors’ fees') || !text.includes('Article 16')) fail('directors-fees distinction missing');
  if (!text.includes('31 December 2021')) fail('Germany–UAE treaty date missing');
  if (!text.includes('The Founder Mobility Impact Map')) fail('Impact Map missing');
  const cards = [...html.matchAll(/class="principle-card"/g)].length;
  if (cards !== 7) fail(`expected 7 Impact Map cards, found ${cards}`);
  if (!text.includes('Selected primary sources')) fail('selected sources block missing');
  if (!text.includes('Technical note.')) fail('technical note missing');
  const external = [...html.matchAll(/target="_blank" rel="noopener noreferrer" class="text-link"/g)].length;
  if (external < 10) fail(`expected at least 10 official source links, found ${external}`);
  for (const route of [
    '/en/founder-mobility-business-relocation',
    '/en/expertise/tax-residency-cfc',
    '/en/expertise/pe-risk-international-teams',
    '/en/expertise/banking-readiness',
    '/en/expertise/source-of-funds',
    '/en/expertise/substance-governance',
    '/en/work-formats/express-risk-check',
    '/en/work-formats/strategic-structural-audit',
    '/en/request-review'
  ]) if (!html.includes(`href="${route}"`)) fail(`internal route missing: ${route}`);
  if (/"@type"\s*:\s*"FAQPage"/.test(html)) fail('inherited FAQPage JSON-LD remains');
  if (/hreflang="ru"|hreflang="uk"/.test(html)) fail('unapproved RU/UK hreflang present on EN-only preview');
  if (!/hreflang="en"/.test(html) || !/hreflang="x-default"/.test(html)) fail('EN/x-default hreflang missing');
  if (html.includes('/sitemap.xml') && false) fail('noop');

  const sitemap = fs.existsSync(path.join(ROOT, 'sitemap.xml')) ? fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8') : '';
  if (sitemap.includes('/en/insights/deep-dives/founder-moves-business-stays')) fail('preview must not enter sitemap before multilingual publication gate');
}

if (errors.length) {
  console.error(`[FM-01 EN Deep Dive preview QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('[FM-01 EN Deep Dive preview QA] PASS — legal controls, sources, routes, EN-only preview isolation');
