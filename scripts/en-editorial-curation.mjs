import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EN = path.join(ROOT, 'en');

const replacements = [
  ['qualify your request', 'understand your request'],
  ['qualify the request', 'assess the request'],
  ['qualify a request', 'assess a request'],
  ['Initial request qualification', 'Initial review of the request'],
  ['initial request qualification', 'initial review of the request'],
  ['Initial Qualification Form', 'Initial Request Form'],
  ['initial qualification form', 'initial request form'],
  ['Initial qualification form', 'Initial request form'],
  ['the right entry point', 'the appropriate work format'],
  ['right entry point', 'appropriate work format'],
  ['the right format', 'the appropriate work format'],
  ['choose the work format', 'choose the appropriate work format'],
  ['bank/PSP readiness', 'banking and PSP readiness'],
  ['Bank/PSP readiness', 'Banking and PSP readiness'],
  ['bank/PSP', 'banking / PSP'],
  ['Bank/PSP', 'Banking / PSP'],
  ['PE-risk', 'PE risk'],
  ['transfer-pricing', 'transfer pricing'],
  ['not a document pack, but the coherence of the whole model', 'not only the document pack, but the coherence of the whole model'],
  ['the paper structure and the real operation', 'the documented structure and actual operations'],
  ['the paper structure and real activity', 'the documented structure and actual activity'],
  ['whether the model appears explainable', 'whether the model can be explained coherently'],
  ['building a single narrative', 'building a coherent explanation'],
  ['assemble explainable documentation', 'assemble documentation that supports the explanation'],
  ['ensure that the model reads coherently', 'ensure that the model is internally coherent'],
  ['This is not cosmetic work for submission', 'This is not a cosmetic exercise for an application'],
  ['banking readability', 'banking clarity'],
  ['a defensible approach to the international structure', 'an evidence-based approach to the international structure'],
  ['so that it is defensible', 'so that it is coherent, supportable and review-ready'],
  ['Response after initial review of the request', 'Response after an initial review of the request'],
  ['Cross-border structuring intake & qualification', 'Cross-border structuring intake & initial review'],
  ['Cross-border structuring intake &amp; qualification', 'Cross-border structuring intake &amp; initial review']
];

const pageSpecific = {
  'en/index.html': [
    ['We design international structures that withstand tax, banking, investment and regulatory scrutiny.', 'We design international structures for tax, banking, investment and regulatory review.'],
    ['We connect ownership, company roles and functions, international tax, VAT and PE risk, governance,\n            banking flows and regulatory requirements into a single model — from a first foreign company to a\n            complex group.', 'We align ownership, company roles and functions, cross-border tax interfaces, VAT and PE risk, governance,\n            banking flows and regulatory requirements within a single operating model — from a first cross-border company to a\n            complex group.'],
    ['<span>International tax &amp; VAT</span>', '<span>Tax, VAT &amp; PE interfaces</span>'],
    ['<h3>International tax model</h3>', '<h3>Cross-border tax interfaces</h3>'],
    ['<p>Tax residency and CFC, DTT and WHT, beneficial ownership, PPT, transfer pricing, PE risk and\n              profit allocation.</p>', '<p>Tax-residency and CFC facts, DTT and WHT, beneficial ownership, PPT, transfer pricing, PE risk and\n              profit-allocation questions mapped for specialist confirmation where required.</p>'],
    ['<p>VAT/OSS/IOSS, e-commerce and marketplace models, international teams, PSPs, licensing and the\n              permissible operating perimeter.</p>', '<p>VAT/OSS/IOSS transaction mapping, e-commerce and marketplace models, international teams, PSPs, licensing and\n              regulatory-perimeter questions, with jurisdiction-specific conclusions confirmed by relevant specialists where required.</p>']
  ],
  'en/request-review.html': [
    ['A short form to understand your request and choose the appropriate work format:', 'A short form to understand your request and identify the appropriate work format:'],
    ['<strong>support</strong>.', '<strong>ongoing support</strong>.'],
    ['"name": "Request a Structure Review (initial qualification)"', '"name": "Request a Structure Review (initial review)"'],
    ['"description": "Initial review of the request form for an international structure:', '"description": "Initial request form for an international structure:'],
    ['<h2 class="section-title-main">Initial Request Form</h2>', '<h2 class="section-title-main">Initial Request Form</h2>']
  ],
  'en/insights/deep-dives/deep-dive-banking-readiness.html': [
    ['<meta property="og:title" content="Deep Dives — LEXONYX">', '<meta property="og:title" content="Banking Readiness as a Structural Stress Test — LEXONYX">'],
    ['<meta name="twitter:title" content="Deep Dives — LEXONYX">', '<meta name="twitter:title" content="Banking Readiness as a Structural Stress Test — LEXONYX">'],
    ['A divergence between the documented structure and actual operations is the main trigger for questions.', 'A divergence between the documented structure and actual operations is a common trigger for further questions.'],
    ['If these elements tell different stories, the structure does not pass review.', 'If these elements point in different directions, the bank is likely to ask further questions or require additional evidence.'],
    ['Banking readiness tests the model for coherence in the same way as any external observer would.', 'Banking readiness therefore functions as a practical test of whether the structure can be explained consistently to an external reviewer.']
  ],
  'en/approach/index.html': [
    ['"inLanguage":"ru"', '"inLanguage":"en"'],
    ['"inLanguage": "ru"', '"inLanguage": "en"'],
    ['the robustness of the model', 'the coherence and evidential support of the model'],
    ['what a robust international structure is built from', 'what a coherent international structure is built from']
  ]
};

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(file));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(file);
  }
  return out;
}

function canonicalFrom(html) {
  const m = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)
    || html.match(/<link\b[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  return m ? m[1] : null;
}

function normaliseHead(html) {
  let out = html;

  // English pages should identify themselves as English in structured data.
  out = out.replace(/"inLanguage"\s*:\s*"ru"/g, '"inLanguage":"en"');

  // x-default should use the English canonical route, not the Russian equivalent.
  const canonical = canonicalFrom(out);
  if (canonical && canonical.includes('/en/')) {
    out = out.replace(/<link\b[^>]*rel=["']alternate["'][^>]*hreflang=["']x-default["'][^>]*>/gi,
      `<link rel="alternate" hreflang="x-default" href="${canonical}" />`);
    out = out.replace(/<link\b[^>]*hreflang=["']x-default["'][^>]*rel=["']alternate["'][^>]*>/gi,
      `<link rel="alternate" hreflang="x-default" href="${canonical}" />`);
  }

  // The English home page has no standalone /en/search.html. Remove stale structured search markup pointing to RU.
  if (canonical === 'https://lexonyx.com/en/index.html') {
    out = out.replace(/\n\s*<script type=["']application\/ld\+json["']>\s*\{[\s\S]*?"@type"\s*:\s*"WebSite"[\s\S]*?"SearchAction"[\s\S]*?<\/script>/i, '');
  }

  return out;
}

let scanned = 0;
let changed = 0;
for (const file of walk(EN)) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [from, to] of replacements) after = after.split(from).join(to);
  for (const [from, to] of (pageSpecific[rel] || [])) after = after.split(from).join(to);
  after = normaliseHead(after);

  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed++;
  }
  scanned++;
}

console.log(`[LEXONYX EN editorial curation] scanned=${scanned} changed=${changed}`);
