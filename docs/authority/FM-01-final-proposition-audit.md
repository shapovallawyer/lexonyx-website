# FM-01 — Final Proposition Audit

Date: 22 August 2026  
Document reviewed: `FM-01-EN-publication-candidate-v0.3.md`  
Result: **PASS — LEGAL RED-TEAM PASSED AT PUBLICATION-CANDIDATE LEVEL**  
Publication status: not yet live; source rendering and final HTML QA remain required.

## Audit method

Each high-risk legal/factual proposition was checked against the approved claim dossier v1.1 and the relevant primary authority. The audit tested: source hierarchy, legal scope, jurisdictional qualification, treaty applicability controls, dates/effective status, and whether the public wording overstates the underlying authority.

## Results

| Area | Result | Publication control |
|---|---|---|
| Personal residence / treaty residence | PASS | Keep domestic-law residence and treaty residence distinct; no universal 183-day rule. |
| German corporate residence | PASS | Primary authority remains §1 KStG + §10 AO. |
| German management / Tagesgeschäft | PASS | BMF 18.06.2026 used as administrative guidance, not substitute for statutory residence basis. |
| OECD 2025 home-office PE | PASS | Less-than-50% wording is qualified; 50%+ expressly does not create an automatic PE presumption. |
| Management functions from home | PASS | Separate management-location / Geschäftsleitungsbetriebsstätte analysis from ordinary treaty home-office analysis. |
| Dual corporate residence / MLI Art. 4 | PASS | CTA, both MLI positions, reservations, notifications and dates of effect must be checked. |
| Dependent-agent PE | PASS | Post-BEPS principal-role wording presented only where actual treaty/MLI wording applies; negotiations alone are not treated as sufficient. |
| CFC / ATAD | PASS | ATAD described as corporate-taxpayer framework; founder personal CFC exposure tied to domestic individual rules. |
| German CFC example | PASS | §7–8 AStG used conditionally; foreign company must fall within statutory regime and further conditions must be met. |
| Owner payments | PASS | Dividends, employment, directors' fees, interest and related-party fees remain separate categories. |
| Employment vs directors' fees | PASS | OECD Model Arts. 15 and 16 kept separate; no work-location rule is attributed universally to directors' fees. |
| Social security | PASS | EU Regulation 883/2004 stated separately; EEA/Swiss cases require their applicable coordination arrangements. |
| Germany–UAE treaty status | PASS | Income-tax treaty cessation after 31 Dec 2021 accurately stated; information-exchange arrangements not confused with an income-tax DTT. |
| CRS / AML-KYC interface | PASS | Operational interface explained while preserving legal separation. |
| Governance / evidence | PASS | Evidence inconsistency is not converted into an automatic residence/PE conclusion; no artificial-substance recommendation. |
| Pre- vs post-relocation | PASS | Pre-move sequencing described conditionally; post-move work begins with factual reconstruction. |

## Pinpoint confirmations retained in dossier

- §1(1) KStG: German unlimited corporate tax liability where relevant entity has Geschäftsleitung or Sitz in Germany.
- §10 AO: Geschäftsleitung is the Mittelpunkt der geschäftlichen Oberleitung.
- BMF 18.06.2026: working pinpoints Rn. 44–47 for Tagesgeschäft vs extraordinary decisions; Rn. 143 for management functions from home office / Geschäftsleitungsbetriebsstätte; Rn. 145 for treaty home-office analysis.
- OECD 2025 Commentary Art. 5: working pinpoints 44.8–44.11 for home-office working-time analysis and commercial reason.
- MLI Art. 4(1): competent-authority determination and no-agreement consequence; applicability controls remain mandatory.
- MLI Art. 12: principal-role DAPE language only where it validly modifies the treaty.
- ATAD Art. 1 and Arts. 7–8: corporate-taxpayer scope and CFC framework.
- §§7–8 AStG: German CFC illustration; §6 AStG only as conditional departure-tax illustration.
- OECD Model Arts. 15 and 16: employment remuneration and directors' fees treated separately.
- Consolidated CRS 2025: change-in-circumstances / self-certification rules and AML/KYC reasonableness interface.
- Regulation (EC) No 883/2004: EU social-security conflict rules, including Art. 13 where relevant.
- BMF Germany–UAE treaty-status page: income-tax DTT ceased to apply after 31 Dec 2021.

## Final wording controls

The following expressions are prohibited in the final page unless tied to a specific jurisdiction and source:

- “183 days determines tax residence”
- “the company becomes resident where the founder lives”
- “strategic decisions determine corporate residence”
- “50% home-office threshold is a safe harbour”
- “50%+ home working creates a PE”
- “ATAD makes the founder subject to CFC taxation”
- “the MLI Article 4 rule applies” without treaty/position matching
- “negotiations create a DAPE”
- “board meetings/minutes create substance”
- “CRS and AML/KYC are the same regime”

## Status after audit

**EN TEXT — PUBLICATION CANDIDATE / LEGAL RED-TEAM PASSED**

Remaining gates:
1. apply the LEXONYX source-rendering standard;
2. final title/meta/search-intent check;
3. build EN HTML page and run CI + visual preview;
4. only after EN approval, adapt RU and UK versions;
5. publish multilingual family only after parity, canonical and hreflang QA.
