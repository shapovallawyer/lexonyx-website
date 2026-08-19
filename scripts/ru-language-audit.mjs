import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const ruUrls = [...sitemap.matchAll(/<loc>https:\/\/lexonyx\.com\/(ru\/[^<]+)<\/loc>/g)].map(m => m[1]);
const errors = [];

function visibleText(html) {
  let s = html
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/gi, ' ');
  const meta = [...html.matchAll(/<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*content=(["'])([\s\S]*?)\1[^>]*>/gi)].map(m => m[2]).join(' ');
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
  s = s.replace(/<[^>]+>/g, ' ');
  return (s + ' ' + meta + ' ' + jsonStrings.join(' ')).replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ');
}

const banned = [
  'Business Purpose','Target State','Current State','Entity Necessity','operating reality','operational reality','operating footprint',
  'ownership','governance','substance','workstreams','workstream','specialist coordination','specialist confirmation','specialist layer',
  'cross-border','banking readiness','banking flows','KYC narrative','Source of Funds','Source of Wealth','family office','advisory',
  'tax residency','CFC','VAT','PE-risk','PE risk','transfer pricing','withholding tax','withholding-tax','DTT','WHT','beneficial ownership','anti-abuse',
  'regulatory architecture','regulatory scoping','regulatory perimeter','regulatory conclusions','regulatory requirements','current-law','re-authorisation',
  'Founder residence interface','founder taxation','founder relocation','founder','founders','Principal OpCo','Management centre','Management center','EU operating platform',
  'Foreign entity','foreign entity','foreign principal company','German nexus','German professionals','German professional','German specialist','German legal','German tax',
  'executive decisions','customer contracting','customers','employees','workforce','investment activity','operating company','operating companies',
  'Group Structuring','group structuring','group architecture','HoldCo','OpCo','ServiceCo','FinanceCo','IPCo','DevelopmentCo','UBO',
  'e-commerce','marketplace','marketplaces','fulfilment','fintech','crypto-assets','payment services','payment-service',
  'Professional perimeter','STRUCTURAL INTERFACES','WHEN NOT TO USE','OPERATING REALITY','CORE JURISDICTIONS','ADDITIONAL JURISDICTIONS','HOW WE WORK','TYPICAL ROLES',
  'review','Matter','conclusion','conclusions','interface','interfaces','scoping','implementation','decision trail','business narrative','use cases'
];

for (const rel of ruUrls) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) { errors.push(`${rel}: missing physical file`); continue; }
  const text = visibleText(fs.readFileSync(p, 'utf8'));
  for (const term of banned) {
    const re = new RegExp(`(^|[^A-Za-z])${term.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}([^A-Za-z]|$)`, 'i');
    if (re.test(text)) errors.push(`${rel}: residual English term "${term}"`);
  }
}

if (errors.length) {
  console.error(`[LEXONYX RU language audit] FAILED with ${errors.length} issue(s):`);
  for (const e of errors.slice(0, 120)) console.error(' - ' + e);
  process.exit(1);
}
console.log(`[LEXONYX RU language audit] PASS — Russian sitemap pages=${ruUrls.length}, banned mixed-language terms=0`);
