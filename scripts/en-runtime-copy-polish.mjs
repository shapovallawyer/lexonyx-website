import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'scripts', 'compliance-runtime.js');
const before = fs.readFileSync(file, 'utf8');
let after = before;

const replacements = [
  [
    "perimeter: 'LEXONYX performs structural and factual cross-border analysis. Ukrainian-law advice is provided directly within the professional scope of Advokat (Ukraine). Jurisdiction-specific legal, tax and regulatory conclusions in other jurisdictions are provided or confirmed by appropriately qualified professionals.'",
    "perimeter: 'LEXONYX provides structural and factual analysis for cross-border matters. Advice on Ukrainian law is provided directly within the professional scope of an Advokat (Ukraine). Jurisdiction-specific legal, tax and regulatory conclusions in other jurisdictions are provided or confirmed by appropriately qualified professionals.'"
  ],
  [
    "cyprusTax: 'Cyprus corporate taxation is treated as one interface of the structure, not as its Business Purpose. The applicable tax treatment must be verified for the specific income, functions, residence, substance, treaty position and anti-abuse rules current at the time of the Matter.'",
    "cyprusTax: 'Cyprus corporate tax is treated as one interface of the structure rather than as its business purpose. The applicable treatment must be confirmed for the specific income, functions, residence, substance, treaty position and anti-abuse rules current at the time of the matter.'"
  ],
  [
    "estoniaTax: 'Estonia uses a distribution-based corporate taxation model. The applicable treatment must be verified for the specific distribution, management, residence, PE, shareholder taxation and operating facts current at the time of the Matter.'",
    "estoniaTax: 'Estonia uses a distribution-based corporate tax model. The applicable treatment must be confirmed for the specific distribution, management, residence, PE, shareholder taxation and operating facts current at the time of the matter.'"
  ],
  [
    "taxHero: 'Tax-residency and CFC analysis begins with incorporation, management, control and ownership facts. Jurisdiction-specific residence, CFC and personal-tax conclusions are confirmed by appropriately qualified tax professionals.'",
    "taxHero: 'Tax-residency and CFC analysis begins with the facts: incorporation, management, control and ownership. Jurisdiction-specific conclusions on residence, CFC rules and personal taxation are confirmed by appropriately qualified tax professionals.'"
  ],
  [
    "cfcBody: 'Ownership, control, entity and income facts are mapped to identify CFC issues requiring jurisdiction-specific tax confirmation.'",
    "cfcBody: 'Ownership, control, entity and income facts are mapped to identify CFC questions that require jurisdiction-specific tax confirmation.'"
  ],
  [
    "treatyBody: 'Flows, ownership, purpose and factual indicators relevant to DTT, WHT, beneficial-ownership and anti-abuse analysis are mapped for jurisdiction-specific specialist confirmation.'",
    "treatyBody: 'Flows, ownership, purpose and factual indicators relevant to DTT, WHT, beneficial ownership and anti-abuse analysis are mapped for jurisdiction-specific specialist confirmation.'"
  ],
  [
    "taxNote: 'The purpose is not to “adjust the documents”, but to align the factual and governance model so that the relevant tax position can be confirmed under the applicable current rules.'",
    "taxNote: 'The objective is not to adjust documents to fit a preferred outcome, but to align the factual and governance model so that the relevant tax position can be confirmed under the rules applicable at the time.'"
  ],
  [
    "vatResultAligned: 'An aligned operating model in which sales and money movement are mapped against specialist-confirmed VAT requirements.'",
    "vatResultAligned: 'An aligned operating model in which sales and payment flows are mapped against VAT requirements confirmed by the relevant specialist.'"
  ],
  [
    "peOnePerson: 'Potentially. A single person can create facts relevant to PE analysis depending on functions, authority, negotiation and contracting activity, governance and the applicable domestic and treaty rules. The jurisdiction-specific conclusion requires specialist confirmation.'",
    "peOnePerson: 'Potentially. A single person can create facts relevant to PE analysis depending on functions, authority, negotiation and contracting activity, governance and the applicable domestic and treaty rules. The jurisdiction-specific conclusion should be confirmed by an appropriately qualified specialist.'"
  ],
  [
    "regContextIntro: 'MiCA, the EU payment-services reform and the AML package must be treated as current-law workstreams rather than static background assumptions.'",
    "regContextIntro: 'MiCA, the EU payment-services reform and the AML package are treated as current-law workstreams whose status and transitional rules must be checked for the project, rather than as static background assumptions.'"
  ],
  [
    "regStep1: 'We decompose the business model into activities and map licensing, exemption and regulatory-perimeter questions for confirmation by appropriately qualified regulatory counsel.'",
    "regStep1: 'We break the business model down into activities and map licensing, exemption and regulatory-perimeter questions for confirmation by appropriately qualified regulatory counsel.'"
  ],
  [
    "regStep2: 'We compare structural and operational factors across candidate jurisdictions. Local legal feasibility, licensing status, timing and regulatory conclusions are confirmed by appropriately qualified local professionals.'",
    "regStep2: 'We compare structural and operational factors across candidate jurisdictions. Local legal feasibility, licensing status, timing and regulatory conclusions are confirmed by appropriately qualified professionals in the relevant jurisdiction.'"
  ],
  [
    "regCompareIntro: 'EU, UK and UAE routes differ in passporting, supervisory practice, local substance, banking, timing and implementation. No jurisdiction is selected solely on perceived speed or market reputation.'",
    "regCompareIntro: 'EU, UK and UAE routes differ in passporting, supervisory practice, local substance, banking, timing and implementation. Jurisdiction selection is therefore based on the operating model and regulatory fit, not on perceived speed or market reputation alone.'"
  ]
];

for (const [from, to] of replacements) after = after.split(from).join(to);

if (after === before) {
  console.log('[LEXONYX EN runtime copy polish] no changes');
} else {
  fs.writeFileSync(file, after, 'utf8');
  console.log('[LEXONYX EN runtime copy polish] updated compliance-runtime.js');
}
