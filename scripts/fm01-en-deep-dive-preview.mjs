import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const templatePath = path.join(ROOT, 'en/insights/deep-dives/deep-dive-cfc-residency.html');
const outPath = path.join(ROOT, 'en/insights/deep-dives/founder-moves-business-stays.html');
const cleanUrl = 'https://lexonyx.com/en/insights/deep-dives/founder-moves-business-stays';

let html = fs.readFileSync(templatePath, 'utf8');

const title = 'Founder Relocation: Tax Residence, CFC, PE & Management | LEXONYX';
const description = 'A founder’s move can affect tax residence, company management, CFC, PE, banking and governance. See how LEXONYX maps the structure before conclusions.';
const h1 = 'Founder Moves, Business Stays: What Actually Changes in a Cross-Border Structure?';

html = html
  .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
  .replace(/<meta name="description"[\s\S]*?>/i, `<meta name="description" content="${description}">`)
  .replace(/<link rel="canonical"[^>]*>/i, `<link rel="canonical" href="${cleanUrl}">`)
  .replace(/<meta property="og:url"[^>]*>/i, `<meta property="og:url" content="${cleanUrl}">`)
  .replace(/<meta property="og:title"[^>]*>/i, `<meta property="og:title" content="${h1}">`)
  .replace(/<meta property="og:description"[\s\S]*?>/i, `<meta property="og:description" content="${description}">`)
  .replace(/<meta name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${h1}">`)
  .replace(/<meta name="twitter:description"[\s\S]*?>/i, `<meta name="twitter:description" content="${description}">`);

// Replace Article JSON-LD and remove inherited FAQ JSON-LD.
html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "${h1}",
  "description": "${description}",
  "author": { "@type": "Organization", "name": "LEXONYX" },
  "publisher": { "@type": "Organization", "name": "LEXONYX" },
  "dateModified": "2026-08-22",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "${cleanUrl}" }
}
</script>`);
html = html.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context"\s*:\s*"https:\/\/schema\.org"\s*,\s*"@type"\s*:\s*"FAQPage"[\s\S]*?<\/script>/i, '');

// EN-only preview: no fake multilingual alternates before the translated family exists.
html = html.replace(/\s*<link rel="alternate" hreflang="ru"[^>]*>/gi, '');
html = html.replace(/\s*<link rel="alternate" hreflang="uk"[^>]*>/gi, '');
html = html.replace(/<link rel="alternate" hreflang="en"[^>]*>/i, `<link rel="alternate" hreflang="en" href="${cleanUrl}">`);
html = html.replace(/<link rel="alternate" hreflang="x-default"[^>]*>/i, `<link rel="alternate" hreflang="x-default" href="${cleanUrl}">`);

// Language switches fall back to the Deep Dives hubs while translations are not yet approved.
html = html.replace(/href="\/ru\/insayty\/razbory\/deep-dive-cfc-residency\.html"/g, 'href="/ru/insayty/razbory/"');
html = html.replace(/href="\/uk\/insaity\/rozbory\/deep-dive-cfc-residency\.html"/g, 'href="/uk/insaity/rozbory/"');
html = html.replace(/href="\/en\/insights\/deep-dives\/deep-dive-cfc-residency\.html"/g, 'href="/en/insights/deep-dives/founder-moves-business-stays"');
html = html.replace(/CFC and Residency/g, 'Founder Mobility');

const toc = `<aside class="pillar-toc">
  <div class="pillar-toc-inner">
    <span class="pillar-toc-label">ON THIS PAGE</span>
    <a href="#context">Context</a>
    <a href="#personal-residence">Personal residence</a>
    <a href="#company-management">Company management</a>
    <a href="#dual-residence">Dual residence</a>
    <a href="#pe">PE & home office</a>
    <a href="#cfc">CFC exposure</a>
    <a href="#payments">Owner payments</a>
    <a href="#treaty-check">Treaty availability</a>
    <a href="#banking">Banking & CRS</a>
    <a href="#governance">Governance & evidence</a>
    <a href="#planning">Before vs after relocation</a>
    <a href="#impact-map">Impact Map</a>
    <a href="#sources">Primary sources</a>
  </div>
</aside>`;

const source = (label, href) => `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-link">${label}</a>`;

const article = `<div class="pillar-content">
<section id="context" class="pillar-hero pillar-section">
  <div class="container container-narrow">
    <div class="section-label">FOUNDER MOBILITY · DEEP DIVE</div>
    <h1>${h1}</h1>
    <p class="pillar-lead">A founder can change country without changing a single corporate document. The legal chart may stay the same while the facts behind tax residence, management, PE, CFC, banking and governance begin to change.</p>
    <p class="text-muted">Reviewed 22 August 2026 · Analytical material, not individual legal or tax advice.</p>
  </div>
</section>

<section class="pillar-section">
  <div class="container container-narrow">
    <p>A founder relocates. The companies remain incorporated where they were. Shareholders do not change. Contracts remain in place. Bank accounts stay open. On paper, the corporate chart may look exactly the same.</p>
    <p>But the facts behind that chart may have changed. The founder may now approve payments, direct staff, negotiate contracts or exercise banking authority from another country while becoming connected to a new tax jurisdiction.</p>
    <p>None of this automatically relocates the company, creates a permanent establishment or triggers CFC taxation. It does mean that several parts of the structure may need to be tested again.</p>
    <div class="insight-box"><strong>LEXONYX view</strong><p>Founder relocation should therefore be treated as a cross-border structural event, not merely as a personal tax-residence question.</p></div>
    <h2>Relocation changes facts before it changes tax</h2>
    <p>The first mistake in a relocation review is to begin with a conclusion. “Am I now tax resident in Germany?”, “Is my UAE company still a UAE company?”, “Do CFC rules now apply?” and “Can I keep receiving dividends in the same way?” are legitimate questions. They are downstream questions.</p>
    <blockquote><p><strong>What actually changed when the founder moved?</strong></p></blockquote>
    <p>A factual map normally asks where the founder and directors live, where ongoing management is carried out, who controls bank accounts and contracts, where staff perform their functions, what foreign entities the founder owns or controls, how owner payments are made and whether governance records still reflect the operating reality.</p>
    <p>Only then should domestic law, treaty rules and the relevant banking or reporting regimes be applied.</p>
  </div>
</section>

<section id="personal-residence" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">01 · PERSONAL RESIDENCE</div>
    <h2>Start with personal residence — but do not stop there</h2>
    <p>Personal residence is usually the most visible issue. But a simple “183-day rule” is not an adequate cross-border analysis.</p>
    <p>Each jurisdiction first applies its own domestic residence rules. If two states both treat the individual as resident, an applicable double-tax treaty may then contain tie-breaker rules. The ${source('OECD Model, Article 4', 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2019/04/model-tax-convention-on-income-and-on-capital-2017-full-version_g1g972ee/g2g972ee-en.pdf')} moves through factors including permanent home, centre of vital interests, habitual abode and nationality before, if necessary, competent-authority agreement.</p>
    <div class="insight-box"><strong>Important distinction</strong><p>Domestic-law residence and treaty residence are related, but they are not necessarily the same legal question. A treaty tie-breaker determines residence for purposes of that treaty; it should not be described as automatically extinguishing every domestic-law consequence in the other state.</p></div>
    <p>If the move is still being planned, departure-related rules may also need review. Germany, for example, contains deemed-disposal rules for specified shareholdings and events in ${source('§6 AStG', 'https://www.gesetze-im-internet.de/astg/BJNR117130972.html')}, subject to statutory conditions.</p>
  </div>
</section>

<section id="company-management" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">02 · COMPANY MANAGEMENT</div>
    <h2>Did the company move? Not automatically. Did its management facts change? Possibly.</h2>
    <p>Corporate-residence systems are not uniform. Depending on the jurisdiction, relevant connecting factors may include incorporation, statutory seat, place of management, central management and control, effective management or other domestic-law tests. That is why “the company is resident where strategic decisions are made” is unsafe as a universal statement.</p>
    <p>Germany provides a useful illustration. ${source('§1 KStG', 'https://www.gesetze-im-internet.de/kstg_1977/__1.html')} links unlimited German corporate tax liability, among other cases, to Geschäftsleitung or Sitz in Germany. ${source('§10 AO', 'https://www.gesetze-im-internet.de/ao_1977/__10.html')} defines Geschäftsleitung as the Mittelpunkt der geschäftlichen Oberleitung.</p>
    <p>The ${source('BMF guidance of 18 June 2026', 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Internationales_Steuerrecht/Allgemeine_Informationen/2026-06-18-grunds-verwal-betriebsstaettenbegriff.pdf')} distinguishes ongoing management — laufende Geschäftsführung / Tagesgeschäft — from extraordinary decisions concerning the fundamental direction of the business. Relevant facts can therefore include where recurring management acts forming part of the ordinary conduct of the particular business are actually performed.</p>
    <blockquote><p><strong>A founder’s move does not automatically move the company, but it may move parts of the factual management process on which corporate-residence analysis depends.</strong></p></blockquote>
  </div>
</section>

<section id="dual-residence" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">03 · DUAL RESIDENCE</div>
    <h2>Dual residence can become more than a theoretical problem</h2>
    <p>Two jurisdictions may both regard the same company as resident under their domestic rules.</p>
    <p>Where ${source('Article 4 of the MLI', 'https://legalinstruments.oecd.org/public/doc/358/body-text.en.html')} validly modifies a Covered Tax Agreement, treaty residence of a dual-resident person other than an individual may become a competent-authority question. Under the baseline Article 4(1) wording, failure to reach agreement can leave treaty relief or exemption unavailable except to the extent and in the manner the authorities agree.</p>
    <p>This is not a rule to apply from the MLI in isolation. The bilateral treaty, Covered Tax Agreement status, both states’ reservations and notifications and the relevant dates of effect must first be checked.</p>
  </div>
</section>

<section id="pe" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">04 · PE & HOME OFFICE</div>
    <h2>Did business activity move with the founder?</h2>
    <p>Corporate residence and permanent establishment are different questions. A company can remain resident in one jurisdiction while creating a taxable presence in another.</p>
    <h3>Home office does not automatically mean PE</h3>
    <p>The ${source('OECD 2025 Update to the Model Tax Convention', 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/the-2025-update-to-the-oecd-model-tax-convention_c7031e1b/5798080f-en.pdf')} added detailed Commentary on cross-border remote work. Under that framework, use of a home for less than 50% of total working time for the enterprise would generally not, on that fact alone, make the home a place of business of the enterprise. At 50% or more there is <strong>no automatic presumption of PE</strong>; the analysis continues on the facts and circumstances, with commercial reason a prominent consideration.</p>
    <p>This is not a statutory safe harbour or a universally binding rule. Actual treaty wording, domestic practice and relevant country positions still need to be checked.</p>
    <div class="insight-box"><strong>Authority point</strong><p>A founder working from home and a founder managing the company from home are not necessarily the same PE fact pattern.</p></div>
    <p>The June 2026 BMF guidance separately recognises that management functions carried out from a private home may create a Geschäftsleitungsbetriebsstätte where relevant ongoing management acts are actually performed there.</p>
    <h3>Agency PE can arise without a classic office</h3>
    <p>Some treaties contain dependent-agent provisions. Post-BEPS wording, where it actually applies, may extend beyond formally concluding contracts to a person who habitually plays the principal role leading to contracts routinely concluded without material modification by the enterprise. ${source('MLI Article 12', 'https://legalinstruments.oecd.org/public/doc/358/body-text.en.html')} is one source of that expanded wording, but the actual treaty and valid modification must be checked.</p>
    <p>Participation in negotiations alone does not automatically create a dependent-agent PE. Frequency, actual role, authority and the applicable treaty test remain relevant.</p>
    <p class="related-inline">Related: <a href="/en/expertise/pe-risk-international-teams">PE-risk & International Teams</a></p>
  </div>
</section>

<section id="cfc" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">05 · CFC EXPOSURE</div>
    <h2>What foreign companies does the founder now own or control?</h2>
    <p>A foreign company may have existed for years without being relevant to the founder’s previous CFC position. A move can bring the founder within a different domestic CFC regime.</p>
    <p>At EU level, ${source('ATAD Articles 1 and 7', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016L1164')} establish a minimum CFC framework within the Directive’s corporate-tax scope. A founder’s personal CFC exposure must instead be tested under the domestic rules applicable to individuals in the relevant jurisdiction.</p>
    <p>Germany illustrates the distinction. Under ${source('§§7–8 AStG', 'https://www.gesetze-im-internet.de/astg/BJNR117130972.html')}, Hinzurechnungsbesteuerung can apply where the statutory control and further conditions are met for an ausländische Gesellschaft.</p>
    <blockquote><p><strong>Relocation can make an already-existing foreign company relevant to a CFC regime that previously did not affect the founder.</strong></p></blockquote>
    <p class="related-inline">Related: <a href="/en/expertise/tax-residency-cfc">Tax Residency & CFC</a></p>
  </div>
</section>

<section id="payments" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">06 · OWNER PAYMENTS</div>
    <h2>Owner payments need to be re-tested separately</h2>
    <p>There is no single “owner payment” analysis. Different payment streams can engage different domestic and treaty rules.</p>
    <ul>
      <li><strong>Dividends:</strong> residence-state taxation, source-state withholding, treaty relief where available, beneficial ownership where relevant and domestic reporting.</li>
      <li><strong>Employment remuneration:</strong> place where employment is exercised, domestic source rules, payroll, treaty treatment and social security. The OECD Model addresses employment income in Article 15.</li>
      <li><strong>Directors’ fees / board remuneration:</strong> legal capacity, company residence, domestic source/payroll rules and any specific treaty provision. The OECD Model addresses directors’ fees separately in Article 16.</li>
      <li><strong>Interest:</strong> domestic source and withholding rules, treaty entitlement, beneficial ownership and related-party conditions.</li>
      <li><strong>Related-party fees:</strong> potentially transfer pricing, PE, source, deductibility and VAT.</li>
    </ul>
    <p>For cross-border work within the EU, ${source('Regulation (EC) No 883/2004', 'https://eur-lex.europa.eu/eli/reg/2004/883/2019-07-31/eng')} contains separate social-security conflict rules. EEA and Swiss cases require the applicable coordination arrangements to be checked separately.</p>
  </div>
</section>

<section id="treaty-check" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">07 · TREATY CHECK</div>
    <h2>Before applying a treaty, verify that the treaty exists</h2>
    <p>Consider a founder living in Germany with a UAE company. It would be unsafe to begin with an assumed Germany–UAE treaty tie-breaker or dividend article.</p>
    <p>The ${source('German Federal Ministry of Finance treaty record for the UAE', 'https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Internationales_Steuerrecht/Staatenbezogene_Informationen/Laender_A_Z/Vereinigte_Arab_Emirate/1996-04-29-Vereinigte-Arabische-Emirate-Abkommen-DBA.html')} records that the Germany–UAE income-tax treaty ceased to be in force on 31 December 2021. Separate tax-information arrangements remain, but they do not recreate an income-tax treaty.</p>
    <div class="insight-box"><strong>LEXONYX treaty sequence</strong><p>Does an income-tax treaty exist and apply? → What does it provide? → Has it been modified by a protocol or the MLI? → Does the relevant taxpayer, entity or transaction meet the applicable conditions?</p></div>
  </div>
</section>

<section id="banking" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">08 · BANKING & CRS</div>
    <h2>Does the bank’s profile still match the facts?</h2>
    <p>Under the ${source('Consolidated Common Reporting Standard 2025', 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/04/consolidated-text-of-the-common-reporting-standard-2025_e478bc04/055664b1-en.pdf')}, a relevant change in circumstances can make an existing tax-residency self-certification unreliable or invalid and require updated or confirmed information under the applicable due-diligence procedures.</p>
    <p>CRS and AML/KYC are not the same legal regime. They do, however, interact operationally: CRS reasonableness checks can use information collected under AML/KYC procedures.</p>
    <p>A bank may hold a residential address, tax-residency self-certifications, ownership/control data, a business profile, expected transaction patterns and Source of Funds or Source of Wealth information. If the founder has materially relocated while that picture still reflects the previous position, further questions may follow.</p>
    <p class="related-inline">Related: <a href="/en/expertise/banking-readiness">Banking Readiness</a> · <a href="/en/expertise/source-of-funds">Source of Funds / Source of Wealth</a></p>
  </div>
</section>

<section id="governance" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">09 · GOVERNANCE & EVIDENCE</div>
    <h2>Do governance records still describe reality?</h2>
    <p>Imagine a company that remains incorporated in Cyprus with a local director formally in office. The founder relocates to Munich and then begins approving payments, setting pricing, directing staff and negotiating important customer arrangements from Germany.</p>
    <p>That does not, by itself, prove German corporate residence or PE. Those conclusions require the relevant legal analysis. But it creates an immediate factual question: <strong>does the formal governance picture still match the operational picture?</strong></p>
    <p>Corporate documents are evidence of governance. They do not substitute for governance.</p>
    <ol>
      <li>Establish how management and decisions actually operate.</li>
      <li>Determine which operating and governance model is legally and commercially appropriate.</li>
      <li>Where justified, change real powers, processes and responsibilities.</li>
      <li>Document the model that is actually implemented.</li>
    </ol>
    <blockquote><p><strong>Board minutes cannot, by themselves, cure a management model that operates differently in practice.</strong></p></blockquote>
    <p class="related-inline">Related: <a href="/en/expertise/substance-governance">Substance & Governance</a></p>
  </div>
</section>

<section id="planning" class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">10 · TIMING</div>
    <h2>Pre-relocation and post-relocation are different projects</h2>
    <div class="two-col-grid">
      <div><h3>Before relocation</h3><p>There may be more scope to sequence decisions, obtain necessary valuations, review distributions or transactions, assess departure-related issues, review management responsibilities, prepare banking and tax-residency updates and obtain jurisdiction-specific advice before the relevant facts change.</p><p><a href="/en/work-formats/express-risk-check">Express Risk Review →</a></p></div>
      <div><h3>After relocation</h3><p>The first task is factual reconstruction: when the founder moved; when ongoing management, banking or contractual authority changed; what payments occurred after that point; and what corporate, banking and tax records showed during the same period.</p><p><a href="/en/work-formats/strategic-structural-audit">Strategic Structure Audit →</a></p></div>
    </div>
    <p><strong>Pre-relocation work is planning. Post-relocation work begins with factual reconstruction.</strong></p>
  </div>
</section>

<section id="impact-map" class="pillar-section section-light">
  <div class="container container-narrow">
    <div class="section-label">LEXONYX METHOD</div>
    <h2>The Founder Mobility Impact Map</h2>
    <p>A relocation review should not be reduced to one residence test. LEXONYX maps seven connected workstreams.</p>
    <div class="principles-grid">
      <div class="principle-card"><span>01</span><h3>Personal Residence & Departure Issues</h3><p>Domestic residence, possible dual residence, treaty analysis and conditional departure-tax questions.</p></div>
      <div class="principle-card"><span>02</span><h3>Ownership & CFC Exposure</h3><p>Foreign companies or entities owned or controlled and the domestic CFC regimes those facts may engage.</p></div>
      <div class="principle-card"><span>03</span><h3>Company Management & Residence</h3><p>Where the company is actually managed and which domestic residence or management tests those facts may engage.</p></div>
      <div class="principle-card"><span>04</span><h3>PE & Operational Presence</h3><p>Functions performed in the new jurisdiction, through which people, places and forms of authority.</p></div>
      <div class="principle-card"><span>05</span><h3>Owner Payments & Cross-Border Flows</h3><p>Dividends, employment remuneration, directors’ fees, interest and related-party flows under domestic law and any applicable treaty.</p></div>
      <div class="principle-card"><span>06</span><h3>Banking, Tax Reporting & Financial Profile</h3><p>Whether tax-residency declarations, customer records, ownership information and expected flows still match current facts.</p></div>
      <div class="principle-card"><span>07</span><h3>Governance & Evidence</h3><p>Whether responsibilities, management processes, authority and corporate records describe how the business actually operates.</p></div>
    </div>
    <p>The map does not produce seven automatic conclusions. Its purpose is to identify <strong>which parts of the architecture changed and which jurisdictions need to answer which questions</strong>.</p>
  </div>
</section>

<section class="pillar-section">
  <div class="container container-narrow">
    <h2>The right question after a founder moves</h2>
    <p>The most useful question is usually not “Which tax applies now?” It is:</p>
    <blockquote><p><strong>Which parts of the structure changed when the founder moved?</strong></p></blockquote>
    <p>A founder’s relocation does not automatically relocate the company. But it can change facts on which legal, tax, treaty, banking and governance analyses depend.</p>
    <p>The correct process starts with the factual change and then applies the relevant domestic and treaty rules to each issue separately.</p>
    <p><strong>Founder relocation should therefore be treated as a cross-border structural event, not merely as a personal tax-residence question.</strong></p>
  </div>
</section>

<section id="sources" class="pillar-section section-light">
  <div class="container container-narrow">
    <div class="section-label">SOURCES</div>
    <h2>Selected primary sources</h2>
    <ul class="source-list">
      <li>OECD — Model Tax Convention on Income and on Capital 2017, Article 4 and Articles 15–16. ${source('Official text', 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2019/04/model-tax-convention-on-income-and-on-capital-2017-full-version_g1g972ee/g2g972ee-en.pdf')}</li>
      <li>Germany — Körperschaftsteuergesetz §1 and Abgabenordnung §10. ${source('§1 KStG', 'https://www.gesetze-im-internet.de/kstg_1977/__1.html')} · ${source('§10 AO', 'https://www.gesetze-im-internet.de/ao_1977/__10.html')}</li>
      <li>German Federal Ministry of Finance — Betriebsstättenbegriff, letter of 18 June 2026, particularly Rn. 44–47, 143, 145. ${source('Official guidance', 'https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Internationales_Steuerrecht/Allgemeine_Informationen/2026-06-18-grunds-verwal-betriebsstaettenbegriff.pdf')}</li>
      <li>OECD — 2025 Update to the Model Tax Convention, Article 5 Commentary on cross-border remote work, particularly paras. 44.8–44.11. ${source('Official update', 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/11/the-2025-update-to-the-oecd-model-tax-convention_c7031e1b/5798080f-en.pdf')}</li>
      <li>OECD — Multilateral Instrument, Articles 4 and 12. ${source('Official text', 'https://legalinstruments.oecd.org/public/doc/358/body-text.en.html')}</li>
      <li>EU — Anti-Tax Avoidance Directive (EU) 2016/1164, Articles 1 and 7–8. ${source('EUR-Lex', 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32016L1164')}</li>
      <li>Germany — Außensteuergesetz §§6–8. ${source('Official text', 'https://www.gesetze-im-internet.de/astg/BJNR117130972.html')}</li>
      <li>EU — Regulation (EC) No 883/2004 on social-security coordination. ${source('EUR-Lex', 'https://eur-lex.europa.eu/eli/reg/2004/883/2019-07-31/eng')}</li>
      <li>German Federal Ministry of Finance — Germany–UAE income-tax treaty status. ${source('Official treaty record', 'https://www.bundesfinanzministerium.de/Content/DE/Standardartikel/Themen/Steuern/Internationales_Steuerrecht/Staatenbezogene_Informationen/Laender_A_Z/Vereinigte_Arab_Emirate/1996-04-29-Vereinigte-Arabische-Emirate-Abkommen-DBA.html')}</li>
      <li>OECD — Consolidated Common Reporting Standard 2025. ${source('Official text', 'https://www.oecd.org/content/dam/oecd/en/publications/reports/2025/04/consolidated-text-of-the-common-reporting-standard-2025_e478bc04/055664b1-en.pdf')}</li>
    </ul>
    <div class="technical-note"><p><strong>Technical note.</strong> This analysis is general and is based on the primary sources identified above as reviewed on 22 August 2026. Domestic-law conclusions, treaty application, MLI modifications, reservations and dates of effect must be checked for the jurisdictions and facts involved in a particular matter.</p></div>
  </div>
</section>

<section class="pillar-section">
  <div class="container container-narrow">
    <div class="section-label">NEXT STEP</div>
    <h2>Planning a move — or already operating from a new country?</h2>
    <p>Map the structure before the relevant facts change, or reconstruct what changed before deciding what needs to be remediated.</p>
    <div class="cta-row"><a href="/en/founder-mobility-business-relocation" class="btn btn-secondary">Founder Mobility route</a> <a href="/en/request-review" class="btn btn-primary">Request a Review</a></div>
    <p class="text-muted">Share the countries involved, the ownership structure, the current residence of the owner/directors and whether the move has already taken place.</p>
    <p class="text-muted">LEXONYX maps the facts, structure and cross-border dependencies. Jurisdiction-specific legal and tax conclusions are provided or confirmed by appropriately qualified specialists where required.</p>
  </div>
</section>
</div>`;

html = html.replace(/<aside class="pillar-toc">[\s\S]*?<\/aside>/i, toc);
html = html.replace(/<div class="pillar-content">[\s\S]*?<\/div><!-- \/pillar-content -->/i, `${article}\n<!-- /pillar-content -->`);

fs.writeFileSync(outPath, html, 'utf8');
console.log('[FM-01 EN Deep Dive preview] generated', path.relative(ROOT, outPath));
