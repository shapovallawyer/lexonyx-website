import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];

const PAGES = {
  en: {
    file: 'en/index.html',
    heading: 'What changed — and what needs to be reviewed now?',
    routes: [
      '/en/expertise/group-structuring.html',
      '/en/expertise/tax-residency-cfc.html',
      '/en/expertise/banking-readiness.html',
      '/en/expertise/private-capital-and-family-office.html',
      '/en/work-formats/strategic-structural-audit.html'
    ],
    specialist: '/en/for-ukrainian-business.html',
    external: '/en/work-formats/external-legal-function.html'
  },
  ru: {
    file: 'ru/index.html',
    heading: 'Что изменилось — и что нужно проверить сейчас?',
    routes: [
      '/ru/ekspertiza/strukturirovanie-gruppy.html',
      '/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
      '/ru/ekspertiza/bankovskaya-gotovnost.html',
      '/ru/ekspertiza/chastnyy-kapital-i-family-office.html',
      '/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html'
    ],
    specialist: '/ru/dlya-ukrainskogo-biznesa.html',
    external: '/ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html'
  },
  uk: {
    file: 'uk/index.html',
    heading: 'Що змінилося — і що потрібно перевірити зараз?',
    routes: [
      '/uk/ekspertyza/strukturuvannya-grupy.html',
      '/uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
      '/uk/ekspertyza/bankivska-gotovnist.html',
      '/uk/ekspertyza/pryvatnyy-kapital-i-family-office.html',
      '/uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html'
    ],
    specialist: '/uk/dlya-ukrainskogo-biznesu.html',
    external: '/uk/formaty-roboty/zovnishnia-yurydychna-funktsiia.html'
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

  const journeyIds = [...html.matchAll(/data-funnel-journey=["']([^"']+)["']/g)].map(m => m[1]);
  if (journeyIds.length !== 5) errors.push(`${lang}: expected 5 primary journey links, found ${journeyIds.length}`);
  if (new Set(journeyIds).size !== 5) errors.push(`${lang}: duplicate journey ids`);

  for (const route of cfg.routes) {
    if (!html.includes(`href="${route}"`) && !html.includes(`href='${route}'`)) errors.push(`${lang}: primary route not linked from home: ${route}`);
    if (!existsRoute(route)) errors.push(`${lang}: primary journey route not publishable: ${route}`);
  }

  if (!html.includes(`href="${cfg.specialist}"`) && !html.includes(`href='${cfg.specialist}'`)) errors.push(`${lang}: dedicated Ukrainian route missing`);
  if (!html.includes('data-funnel-specialist-route="ukrainian-europe"')) errors.push(`${lang}: dedicated Ukrainian route is not marked separately`);
  if (!existsRoute(cfg.specialist)) errors.push(`${lang}: dedicated Ukrainian route not publishable`);

  const externalJourneyPattern = new RegExp(`<a\\b(?=[^>]*data-funnel-journey)(?=[^>]*href=["']${cfg.external.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["'])[^>]*>`, 'i');
  if (externalJourneyPattern.test(html)) errors.push(`${lang}: External International Legal Function still appears as a primary journey`);
  if (!html.includes(`href="${cfg.external}"`) && !html.includes(`href='${cfg.external}'`)) errors.push(`${lang}: External International Legal Function must remain available as a work format`);
}

if (errors.length) {
  console.error(`[LEXONYX client journey QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}

console.log('[LEXONYX client journey QA] PASS — 5 situational journeys × 3 languages; Ukrainian route separate; External Legal Function retained only as work format');
