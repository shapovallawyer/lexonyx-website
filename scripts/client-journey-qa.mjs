import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];

const PAGES = {
  en: {
    file: 'en/index.html',
    heading: 'Start with what is driving the review now',
    routes: [
      '/en/expertise/group-structuring.html',
      '/en/expertise/tax-residency-cfc.html',
      '/en/expertise/banking-readiness.html',
      '/en/expertise/private-capital-and-family-office.html',
      '/en/work-formats/strategic-structural-audit.html'
    ],
    specialistRoute: '/en/for-ukrainian-business.html'
  },
  ru: {
    file: 'ru/index.html',
    heading: 'Начните с того, что требует решения сейчас',
    routes: [
      '/ru/ekspertiza/strukturirovanie-gruppy.html',
      '/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
      '/ru/ekspertiza/bankovskaya-gotovnost.html',
      '/ru/ekspertiza/chastnyy-kapital-i-family-office.html',
      '/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html'
    ],
    specialistRoute: '/ru/dlya-ukrainskogo-biznesa.html'
  },
  uk: {
    file: 'uk/index.html',
    heading: 'Почніть із того, що потребує вирішення зараз',
    routes: [
      '/uk/ekspertyza/strukturuvannya-grupy.html',
      '/uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
      '/uk/ekspertyza/bankivska-gotovnist.html',
      '/uk/ekspertyza/pryvatnyy-kapital-i-family-office.html',
      '/uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html'
    ],
    specialistRoute: '/uk/dlya-ukrainskogo-biznesu.html'
  }
};

function existsRoute(route) {
  const rel = route.replace(/^\//, '');
  if (fs.existsSync(path.join(ROOT, rel))) return true;
  const redirects = fs.readFileSync(path.join(ROOT, '_redirects'), 'utf8');
  const escaped = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^${escaped}\\s+\\S+\\s+(?:200!?|301!?|302!?)$`, 'm').test(redirects);
}

for (const [lang, cfg] of Object.entries(PAGES)) {
  const html = fs.readFileSync(path.join(ROOT, cfg.file), 'utf8');
  if (!html.includes(cfg.heading)) errors.push(`${lang}: client-journey heading missing`);

  const journeyAttrs = [...html.matchAll(/data-funnel-journey=["']([^"']+)["']/g)].map(m => m[1]);
  if (journeyAttrs.length !== 5) errors.push(`${lang}: expected 5 universal journey links, found ${journeyAttrs.length}`);
  if (new Set(journeyAttrs).size !== 5) errors.push(`${lang}: duplicate journey ids`);
  if (journeyAttrs.includes('external-legal-function')) errors.push(`${lang}: external legal function must not be a top-level journey`);
  if (journeyAttrs.includes('ukrainian-owner-europe')) errors.push(`${lang}: Ukrainian route must sit outside universal journey set`);

  for (const route of cfg.routes) {
    if (!html.includes(`href="${route}"`) && !html.includes(`href='${route}'`)) errors.push(`${lang}: route not linked from home: ${route}`);
    if (!existsRoute(route)) errors.push(`${lang}: journey route not publishable: ${route}`);
  }

  if (!html.includes('data-funnel-specialist="ukrainian-business"') && !html.includes("data-funnel-specialist='ukrainian-business'")) {
    errors.push(`${lang}: dedicated Ukrainian specialist route marker missing`);
  }
  if (!html.includes(`href="${cfg.specialistRoute}"`) && !html.includes(`href='${cfg.specialistRoute}'`)) {
    errors.push(`${lang}: dedicated Ukrainian route not linked from home: ${cfg.specialistRoute}`);
  }
  if (!existsRoute(cfg.specialistRoute)) errors.push(`${lang}: dedicated Ukrainian route not publishable: ${cfg.specialistRoute}`);
}

if (errors.length) {
  console.error(`[LEXONYX client journey QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('[LEXONYX client journey QA] PASS — 5 situational journeys + 1 dedicated Ukrainian route × 3 languages; all routes publishable');
