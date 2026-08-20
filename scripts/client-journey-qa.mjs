import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const errors = [];

const PAGES = {
  en: {
    file: 'en/index.html',
    heading: 'Start from the situation you have now',
    routes: [
      '/en/for-ukrainian-business.html',
      '/en/expertise/group-structuring.html',
      '/en/expertise/banking-readiness.html',
      '/en/expertise/private-capital-and-family-office.html',
      '/en/work-formats/external-legal-function.html'
    ]
  },
  ru: {
    file: 'ru/index.html',
    heading: 'Начните с той ситуации, которая есть у вас сейчас',
    routes: [
      '/ru/dlya-ukrainskogo-biznesa.html',
      '/ru/ekspertiza/strukturirovanie-gruppy.html',
      '/ru/ekspertiza/bankovskaya-gotovnost.html',
      '/ru/ekspertiza/chastnyy-kapital-i-family-office.html',
      '/ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html'
    ]
  },
  uk: {
    file: 'uk/index.html',
    heading: 'Почніть із ситуації, яка є у вас зараз',
    routes: [
      '/uk/dlya-ukrainskogo-biznesu.html',
      '/uk/ekspertyza/strukturuvannya-grupy.html',
      '/uk/ekspertyza/bankivska-gotovnist.html',
      '/uk/ekspertyza/pryvatnyy-kapital-i-family-office.html',
      '/uk/formaty-roboty/zovnishnia-yurydychna-funktsiia.html'
    ]
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
  if (journeyAttrs.length !== 5) errors.push(`${lang}: expected 5 journey links, found ${journeyAttrs.length}`);
  if (new Set(journeyAttrs).size !== 5) errors.push(`${lang}: duplicate journey ids`);
  for (const route of cfg.routes) {
    if (!html.includes(`href="${route}"`) && !html.includes(`href='${route}'`)) errors.push(`${lang}: route not linked from home: ${route}`);
    if (!existsRoute(route)) errors.push(`${lang}: journey route not publishable: ${route}`);
  }
}

if (errors.length) {
  console.error(`[LEXONYX client journey QA] FAILED — ${errors.length} issue(s)`);
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
}
console.log('[LEXONYX client journey QA] PASS — 5 client journeys × 3 languages; all routes publishable');
