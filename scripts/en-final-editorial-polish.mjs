import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EN = path.join(ROOT, 'en');

const common = [
  ['preliminary qualification', 'preliminary review'],
  ['Preliminary Qualification', 'Preliminary Review'],
  ['qualification stage', 'initial review stage'],
  ['Qualification stage', 'Initial review stage'],
  ['one-off diagnostic', 'one-off review'],
  ['One-off diagnostic', 'One-off review'],
  ['independent advisory company', 'independent professional practice'],
  ['Independent advisory company', 'Independent professional practice'],
  ['Entry Products', 'Starting Formats'],
  ['entry products', 'starting formats'],
  ['Entry Product', 'Starting Format'],
  ['entry product', 'starting format']
];

const specific = {
  'en/request-review.html': [
    ['IF YOU NEED A FAST ENTRY POINT', 'IF YOU WANT A FOCUSED START'],
    ['You Can Start With One of the Starting Formats', 'You Can Start With a Focused Review'],
    ['If the task is clear, start directly with the appropriate format — we will still collect the inputs and clarify the scope.', 'If the issue is already clear, you can start with a focused format. We will still collect the key facts and confirm the scope before substantive work begins.']
  ],
  'en/insights/deep-dives/deep-dive-banking-readiness.html': [
    ['For a bank, the structure is not a tax model. It is a risk map.', 'A bank does not look at the structure only through a tax lens. It also assesses ownership, control, activity, flows and supporting evidence.'],
    ['A bank assesses not the tax rate, but the consistency of the narrative.', 'A bank typically looks beyond the tax rate to whether ownership, activity, flows and supporting evidence are consistent.'],
    ['Inconsistency between these elements is the main source of issues.', 'Inconsistency between these elements is a common source of further questions.'],
    ['An empty holding company with no management function', 'A holding company whose stated role is not supported by management activity'],
    ['A warehouse in the EU without VAT registration', 'EU warehousing or inventory not reflected in the VAT analysis or registration position'],
    ['A mismatch between the website ↔ structure', 'A mismatch between the public-facing business description and the documented structure'],
    ['If 90% of the team is in one country, while the company is incorporated in another, the question arises as to the real centre of management.', 'If most of the team is in one country while the company is incorporated in another, this can raise questions about where management and core functions are actually carried out.'],
    ['Banking review often identifies PE risk and tax residency risks', 'Banking review may surface facts relevant to PE or tax-residency analysis'],
    ['We will conduct a structural audit before submission to the bank, to minimise the risk of refusal.', 'We can review the structure before submission to identify inconsistencies and prepare the supporting explanation and evidence.'],
    ['REQUEST A BANKING AUDIT', 'REQUEST A BANKING READINESS REVIEW'],
    ['PE risk and Management & Control', 'PE Risk and Management and Control'],
    ['PE risk and Management &amp; Control', 'PE Risk and Management and Control']
  ]
};

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(file));
    else if (e.isFile() && e.name.endsWith('.html')) out.push(file);
  }
  return out;
}

let scanned = 0;
let changed = 0;
for (const file of walk(EN)) {
  const rel = path.relative(ROOT, file).replaceAll('\\', '/');
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [from, to] of common) after = after.split(from).join(to);
  for (const [from, to] of (specific[rel] || [])) after = after.split(from).join(to);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed++;
  }
  scanned++;
}

console.log(`[LEXONYX EN final editorial polish] scanned=${scanned} changed=${changed}`);
