# LEXONYX Authority Source Rendering Standard v1

Applies to: high-authority Insights, Deep Dives, technical briefings and tools that contain legal, tax, regulatory, banking or treaty propositions.

## Objective

Show enough primary-source support to make the analysis auditable and authoritative without turning client-facing articles into academic footnote exercises.

## 1. Source hierarchy

Use, in order of preference:
1. statute / regulation / treaty text;
2. court or competent-authority decision;
3. regulator / ministry / tax authority official guidance;
4. OECD / EU / FATF / AMLA / EBA primary institutional material where relevant;
5. respected secondary material only for context, not as the sole support for a material legal proposition.

For treaty conclusions, the actual bilateral treaty and any operative protocol/MLI modification take precedence over the OECD Model or generic MLI text.

## 2. Public-page rendering

### A. Inline source links — selective, not every sentence

Use a short inline source marker/link immediately after propositions where the authority itself materially increases trust or where a reader may reasonably want to verify the rule.

FM-01 examples:
- German corporate residence: §1 KStG / §10 AO.
- BMF 18.06.2026 management/home-office distinction.
- OECD 2025 home-office PE framework.
- MLI Article 4 dual-residence consequence.
- ATAD corporate scope + German AStG individual-CFC illustration.
- OECD Model Articles 15/16 distinction if retained in public copy.
- Germany–UAE treaty status.
- CRS change-in-circumstances rule.

Do not attach citations to ordinary analytical transitions, commercial observations or clearly labelled LEXONYX methodology unless a legal proposition is embedded in them.

### B. Selected primary sources block

Every cornerstone Deep Dive should end with a compact section:

**Selected primary sources**

For each source show:
- issuing authority;
- document / provision;
- relevant article / paragraph / section where useful;
- publication/effective date where material;
- direct official link.

Do not reproduce long quotations.

### C. Technical note

Add a short note near the source block:

> **Technical note.** This analysis is general and is based on the sources identified below as reviewed on [DATE]. Domestic-law conclusions, treaty application, MLI modifications and dates of effect must be checked for the jurisdictions and facts involved in a particular matter.

This is a scope/precision statement, not a generic liability disclaimer.

## 3. Pinpoint policy

Internal dossier must contain pinpoints for every high-risk proposition even where the public page displays only the source document name/link.

Examples:
- BMF letter: Rn. 44–47, 143, 145.
- OECD 2025 Art. 5 Commentary: 44.8–44.11.
- MLI: Art. 4(1), Art. 12 where relevant.
- CRS: relevant change-in-circumstances / reasonableness paragraphs.

Do not cite an entire long document internally when a specific provision supports the claim.

## 4. Model-vs-law rule

When using OECD Model articles/commentary or generic MLI text, public language must make clear that:
- these are model/multilateral analytical sources;
- the actual treaty relationship must be checked;
- reservations, notifications, protocols and dates of effect may change the result.

Never write as if OECD Commentary itself were domestic legislation.

## 5. Administrative-guidance rule

Official administrative guidance may explain how an authority applies a statute, but should not replace the statute as the primary legal basis where legislation directly establishes the proposition.

FM-01 example:
- corporate tax residence in Germany: §1 KStG + §10 AO;
- BMF 18.06.2026: management/PE/home-office interpretive detail.

## 6. Source/date integrity

Before publication or material update:
- verify source is still current;
- verify document date and effective date where relevant;
- verify treaty status separately;
- avoid cached/search-result dates as legal effective dates;
- record `last reviewed` in the internal dossier.

For fast-moving regulatory material, re-check before every client use.

## 7. Multilingual parity

EN is the master legal text for current authority production unless a project specifies otherwise.

RU/UK adaptations must:
- preserve legal qualifications;
- use the same underlying source dossier;
- not strengthen claims during translation;
- maintain equivalent source links/pinpoints where source is language-neutral or authoritative in another language;
- clearly identify translation/adaptation where an official source is available only in another language.

## 8. Structured data / FAQ rule

FAQPage or Article JSON-LD must never contain broader legal propositions than the visible article.

Any FAQ answer involving residence, PE, CFC, treaty entitlement, AML/KYC, banking or regulatory status must be generated from the approved publication candidate and checked against the claim dossier.

A visible correction must also update structured data in the same build.

## 9. Update and supersession

Each authority asset must have internal fields:
- asset ID;
- version;
- status;
- last reviewed date;
- source dossier version;
- jurisdictions implicated;
- material update trigger.

Triggers include statutory amendment, treaty/protocol/MLI change, new official guidance, significant court decision, regulator change or discovery of a material wording issue.

## 10. FM-01 rendering decision

For `Founder Moves, Business Stays` use:
- approximately 8–10 selective inline official-source links across the article;
- one `Selected primary sources` section at the end;
- one technical note dated to the final review date;
- no academic footnote numbering in the body;
- no secondary-source citation for a proposition where a Tier-1 source is available.

This standard becomes the default template for the remaining cornerstone authority assets unless a specific subject requires a stricter source format.
