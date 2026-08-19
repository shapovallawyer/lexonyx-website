import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const map = JSON.parse(fs.readFileSync(path.join(ROOT, '_url-map-i18n.json'), 'utf8'));
const redirects = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8');
const sitemap = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
const errors = [];

function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }
function routeBacked(rel) {
  const route = '/' + rel;
  return redirects.split(/\r?\n/).some(line => {
    const parts = line.trim().split(/\s+/);
    return parts.length >= 3 && parts[0] === route && /^(?:200|301|302)!?$/.test(parts[2]);
  });
}
function publicExists(rel) { return exists(rel) || routeBacked(rel); }
function read(rel) { return exists(rel) ? fs.readFileSync(path.join(ROOT, rel), 'utf8') : ''; }
function sitemapHas(rel) { return sitemap.includes(`<loc>https://lexonyx.com/${rel}</loc>`); }
function count(haystack, needle) { return haystack.split(needle).length - 1; }

const families = [];
for (const [ru, en] of Object.entries(map.en || {})) {
  if (!ru.startsWith('ru/')) continue;
  const uk = map.uk?.[ru];
  if (!uk) { errors.push(`missing UK map entry for ${ru}`); continue; }
  families.push({ ru, en, uk });
}

for (const family of families) {
  for (const lang of ['ru','en','uk']) {
    const rel = family[lang];
    if (!publicExists(rel)) errors.push(`missing ${lang.toUpperCase()} page/route: ${rel}`);
  }

  const inSitemap = ['ru','en','uk'].map(lang => sitemapHas(family[lang]));
  if (inSitemap.some(Boolean) && !inSitemap.every(Boolean)) {
    errors.push(`sitemap language-family mismatch: ${family.ru} | ${family.en} | ${family.uk}`);
  }

  // Physical mapped pages must declare all three alternates after the build normalizers run.
  for (const lang of ['ru','en','uk']) {
    const rel = family[lang];
    if (!exists(rel)) continue;
    const html = read(rel);
    for (const alt of ['ru','en','uk']) {
      const target = `https://lexonyx.com/${family[alt]}`;
      const reA = new RegExp(`<link\\b[^>]*hreflang=["']${alt}["'][^>]*href=["']${target.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["']`, 'i');
      const reB = new RegExp(`<link\\b[^>]*href=["']${target.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["'][^>]*hreflang=["']${alt}["']`, 'i');
      if (!reA.test(html) && !reB.test(html)) errors.push(`hreflang ${alt} missing/mismatched: ${rel}`);
    }
  }
}

const expectedNav = {
  ru: [
    '/ru/ekspertiza/strukturirovanie-gruppy.html','/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html','/ru/ekspertiza/substance-i-governance.html','/ru/ekspertiza/vat-i-transgranichnye-modeli.html','/ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html','/ru/ekspertiza/bankovskaya-gotovnost.html','/ru/ekspertiza/source-of-funds.html','/ru/ekspertiza/chastnyy-kapital-i-family-office.html','/ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html','/ru/dlya-ukrainskogo-biznesa.html',
    '/ru/formaty-raboty/kak-nachat.html','/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html','/ru/formaty-raboty/ekspress-proverka-riskov.html','/ru/formaty-raboty/soprovozhdenie-i-advisory.html','/ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html'
  ],
  en: [
    '/en/expertise/group-structuring.html','/en/expertise/tax-residency-cfc.html','/en/expertise/substance-governance.html','/en/expertise/vat-cross-border.html','/en/expertise/pe-risk-international-teams.html','/en/expertise/banking-readiness.html','/en/expertise/source-of-funds.html','/en/expertise/private-capital-and-family-office.html','/en/expertise/regulatory-licensing.html','/en/for-ukrainian-business.html',
    '/en/how-to-start.html','/en/work-formats/strategic-structural-audit.html','/en/work-formats/express-risk-check.html','/en/work-formats/ongoing-advisory.html','/en/work-formats/external-legal-function.html'
  ],
  uk: [
    '/uk/ekspertyza/strukturuvannya-grupy.html','/uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html','/uk/ekspertyza/substance-ta-governance.html','/uk/ekspertyza/vat-ta-transkordonni-modeli.html','/uk/ekspertyza/pe-ryzyk-ta-mizhnarodni-komandy.html','/uk/ekspertyza/bankivska-gotovnist.html','/uk/ekspertyza/source-of-funds.html','/uk/ekspertyza/pryvatnyy-kapital-i-family-office.html','/uk/ekspertyza/regulyatorna-arhitektura-ta-litsenzuvannya.html','/uk/dlya-ukrainskogo-biznesu.html',
    '/uk/yak-pochaty.html','/uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html','/uk/formaty-roboty/ekspres-perevirka-ryzykiv.html','/uk/formaty-roboty/suprovid-ta-advisory.html','/uk/formaty-roboty/zovnishnia-yurydychna-funktsiia.html'
  ]
};

for (const lang of ['ru','en','uk']) {
  const home = read(`${lang}/index.html`);
  for (const href of expectedNav[lang]) {
    if (count(home, `href="${href}"`) < 2 && count(home, `href='${href}'`) < 2) {
      errors.push(`desktop/mobile navigation parity missing in ${lang.toUpperCase()}: ${href}`);
    }
  }
}

const newsletterRoutes = [
  'ru/spasibo-newsletter.html',
  'en/thank-you-newsletter.html',
  'uk/dyakuyemo-newsletter.html'
];
for (const rel of newsletterRoutes) if (!publicExists(rel)) errors.push(`newsletter success route missing: ${rel}`);

// The two RU-only historical duplicates are not independent language families.
// They must not survive in the publish output as active pages.
for (const rel of ['ru/ekspertiza/dlya-ukrainskogo-biznesa.html','ru/source-of-funds2.html']) {
  if (exists(rel)) errors.push(`legacy RU duplicate still published: ${rel}`);
}

if (errors.length) {
  console.error(`[LEXONYX i18n parity audit] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}

console.log(`[LEXONYX i18n parity audit] PASS — canonical families=${families.length}, sitemap families aligned, navigation parity=RU/EN/UK, newsletter routes=3`);
