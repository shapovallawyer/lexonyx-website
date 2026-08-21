import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const PAGES = {
  en: {
    file: 'en/index.html',
    heading: 'From initial review to implementation and ongoing coordination',
    subtitle: 'The work format follows the stage of the matter: rapid diagnostic, full structural audit, implementation support or ongoing coordination after the initial project.',
    externalHref: '/en/work-formats/external-legal-function.html',
    externalBody: 'Ongoing coordination of cross-border legal matters after the initial project, without building a separate in-house international legal function.'
  },
  ru: {
    file: 'ru/index.html',
    heading: 'От первичной проверки к внедрению и постоянной координации',
    subtitle: 'Формат зависит от стадии задачи: экспресс-диагностика, полный структурный аудит, сопровождение внедрения или постоянная координация после первоначального проекта.',
    externalHref: '/ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html',
    externalBody: 'Постоянная координация трансграничных юридических вопросов после первоначального проекта без создания отдельной внутренней международной юридической функции.'
  },
  uk: {
    file: 'uk/index.html',
    heading: 'Від первинної перевірки до впровадження та постійної координації',
    subtitle: 'Формат залежить від стадії завдання: експрес-діагностика, повний структурний аудит, супровід впровадження або постійна координація після початкового проєкту.',
    externalHref: '/uk/formaty-roboty/zovnishnia-yurydychna-funktsiia.html',
    externalBody: 'Постійна координація транскордонних юридичних питань після початкового проєкту без створення окремої внутрішньої міжнародної юридичної функції.'
  }
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function replaceClassInner(fragment, className, tag, value) {
  const rx = new RegExp(`(<${tag}\\b(?=[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'])[^>]*>)[\\s\\S]*?(<\\/${tag}>)`, 'i');
  if (!rx.test(fragment)) throw new Error(`${tag}.${className} not found`);
  return fragment.replace(rx, `$1${escapeHtml(value)}$2`);
}

for (const [lang, cfg] of Object.entries(PAGES)) {
  const abs = path.join(ROOT, cfg.file);
  let html = fs.readFileSync(abs, 'utf8');
  const start = html.search(/<section\b[^>]*class=["'][^"']*\bhome-formats\b[^"']*["'][^>]*>/i);
  if (start < 0) throw new Error(`${lang}: home-formats section missing`);
  const end = html.indexOf('</section>', start);
  if (end < 0) throw new Error(`${lang}: home-formats section end missing`);
  let section = html.slice(start, end + 10);

  section = replaceClassInner(section, 'section-title-main', 'h2', cfg.heading);
  section = replaceClassInner(section, 'section-subtitle', 'p', cfg.subtitle);

  const hrefEscaped = cfg.externalHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const cardRx = new RegExp(`(<a\\b[^>]*href=["']${hrefEscaped}["'][^>]*>[\\s\\S]*?<p>)[\\s\\S]*?(<\\/p>[\\s\\S]*?<\\/a>)`, 'i');
  if (!cardRx.test(section)) throw new Error(`${lang}: External International Legal Function card missing`);
  section = section.replace(cardRx, `$1${escapeHtml(cfg.externalBody)}$2`);

  html = html.slice(0, start) + section + html.slice(end + 10);
  fs.writeFileSync(abs, html, 'utf8');
}

console.log('[LEXONYX work-format positioning] PASS — External International Legal Function positioned as ongoing format after the initial project across EN/RU/UK');
