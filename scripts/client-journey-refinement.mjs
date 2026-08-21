import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const CONFIG = {
  en: {
    file: 'en/index.html',
    label: 'START FROM YOUR SITUATION',
    heading: 'What changed — and what needs to be reviewed now?',
    subtitle: 'The right starting point depends on what triggered the need for structuring. Choose the situation closest to yours.',
    cards: [
      {
        id: 'international-expansion-group',
        title: 'Expanding internationally or building a group',
        body: 'A new country, company or layer of ownership is being added — or the existing group needs one coherent architecture across roles, functions, flows and governance.',
        href: '/en/expertise/group-structuring.html',
        link: 'Group Structuring →'
      },
      {
        id: 'founder-owner-relocation',
        title: 'Founder or owner relocation',
        body: 'The owner or a key decision-maker has moved while companies, teams, IP or capital remain across jurisdictions. Residence, CFC, management, PE and substance need to be aligned.',
        href: '/en/expertise/tax-residency-cfc.html',
        link: 'Tax Residence & CFC →'
      },
      {
        id: 'bank-psp-sof-scrutiny',
        title: 'Bank / PSP / Source of Funds scrutiny',
        body: 'A bank, payment provider or regulated counterparty is testing ownership, UBO, flows, Source of Funds / Source of Wealth and the economic logic of the structure.',
        href: '/en/expertise/banking-readiness.html',
        link: 'Banking Readiness →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Private capital or family office',
        body: 'Business interests, investments and family assets span jurisdictions and need coherent ownership, governance, succession and banking readiness.',
        href: '/en/expertise/private-capital-and-family-office.html',
        link: 'Private Capital & Family Office →'
      },
      {
        id: 'transaction-external-review',
        title: 'Existing structure before a transaction or external review',
        body: 'An investor, sale, financing, reorganisation or major change is approaching and the existing structure needs to be stress-tested before others do it.',
        href: '/en/work-formats/strategic-structural-audit.html',
        link: 'Strategic Structural Audit →'
      }
    ],
    specialist: {
      label: 'DEDICATED ROUTE',
      title: 'For Ukrainian Owners & Businesses in Europe',
      body: 'A specialist route for Ukrainian founders, owners and businesses operating or relocating in Europe, connecting cross-border ownership, residence, governance, banking and capital questions.',
      href: '/en/for-ukrainian-business.html',
      link: 'Explore the dedicated route →'
    },
    workHeading: 'From initial review to implementation and ongoing coordination',
    workSubtitle: 'The work format follows the stage of the matter: rapid diagnostic, full structural audit, implementation support or ongoing coordination after the initial project.',
    externalHref: '/en/work-formats/external-legal-function.html',
    externalBody: 'Ongoing coordination of cross-border legal matters after the initial project, without building a separate in-house international legal function.'
  },
  ru: {
    file: 'ru/index.html',
    label: 'НАЧНИТЕ С ВАШЕЙ СИТУАЦИИ',
    heading: 'Что изменилось — и что нужно проверить сейчас?',
    subtitle: 'Правильная точка входа зависит от события, которое создало потребность в структурном анализе. Выберите ситуацию, наиболее близкую к вашей.',
    cards: [
      {
        id: 'international-expansion-group',
        title: 'Выход в новую страну или построение группы',
        body: 'Появляется новая страна, компания или уровень владения — либо действующей группе нужна единая архитектура ролей, функций, потоков и управления.',
        href: '/ru/ekspertiza/strukturirovanie-gruppy.html',
        link: 'Структурирование группы →'
      },
      {
        id: 'founder-owner-relocation',
        title: 'Переезд собственника или основателя',
        body: 'Собственник или ключевой руководитель переехал, а компании, команда, интеллектуальная собственность или капитал остались в нескольких странах. Нужно согласовать резидентство, КИК, место управления, риск постоянного представительства и фактическое присутствие.',
        href: '/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
        link: 'Налоговое резидентство и КИК →'
      },
      {
        id: 'bank-psp-sof-scrutiny',
        title: 'Проверка банка / PSP / происхождения средств',
        body: 'Банк, платёжный провайдер или регулируемый контрагент проверяет структуру владения, бенефициара, потоки, происхождение средств и капитала и экономическую логику структуры.',
        href: '/ru/ekspertiza/bankovskaya-gotovnost.html',
        link: 'Банковская готовность →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Частный капитал или семейный офис',
        body: 'Бизнес, инвестиционные и семейные активы находятся в нескольких странах и требуют согласованной модели владения, управления, преемственности и банковской готовности.',
        href: '/ru/ekspertiza/chastnyy-kapital-i-family-office.html',
        link: 'Частный капитал и семейный офис →'
      },
      {
        id: 'transaction-external-review',
        title: 'Действующая структура перед сделкой или внешней проверкой',
        body: 'Предстоит инвестор, продажа, финансирование, реорганизация или существенное изменение бизнеса — существующую модель нужно проверить до того, как это сделает внешняя сторона.',
        href: '/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html',
        link: 'Стратегический структурный аудит →'
      }
    ],
    specialist: {
      label: 'ОТДЕЛЬНЫЙ МАРШРУТ',
      title: 'Для украинских собственников и бизнеса в Европе',
      body: 'Специализированный маршрут для украинских предпринимателей и собственников, работающих или переезжающих в Европу: структура владения, резидентство, управление, банки и капитал рассматриваются как единая система.',
      href: '/ru/dlya-ukrainskogo-biznesa.html',
      link: 'Перейти к специализированному маршруту →'
    },
    workHeading: 'От первичной проверки к внедрению и постоянной координации',
    workSubtitle: 'Формат зависит от стадии задачи: экспресс-диагностика, полный структурный аудит, сопровождение внедрения или постоянная координация после первоначального проекта.',
    externalHref: '/ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html',
    externalBody: 'Постоянная координация трансграничных юридических вопросов после первоначального проекта без создания отдельной внутренней международной юридической функции.'
  },
  uk: {
    file: 'uk/index.html',
    label: 'ПОЧНІТЬ ІЗ ВАШОЇ СИТУАЦІЇ',
    heading: 'Що змінилося — і що потрібно перевірити зараз?',
    subtitle: 'Правильна точка входу залежить від події, яка створила потребу у структурному аналізі. Оберіть ситуацію, найближчу до вашої.',
    cards: [
      {
        id: 'international-expansion-group',
        title: 'Вихід у нову країну або побудова групи',
        body: 'З’являється нова країна, компанія або рівень володіння — або чинній групі потрібна єдина архітектура ролей, функцій, потоків та управління.',
        href: '/uk/ekspertyza/strukturuvannya-grupy.html',
        link: 'Структурування групи →'
      },
      {
        id: 'founder-owner-relocation',
        title: 'Переїзд власника або засновника',
        body: 'Власник або ключовий керівник переїхав, а компанії, команда, інтелектуальна власність або капітал залишилися в кількох країнах. Потрібно узгодити резидентство, КІК, місце управління, ризик постійного представництва та фактичну присутність.',
        href: '/uk/ekspertyza/podatkove-rezydentstvo-i-kik.html',
        link: 'Податкове резидентство та КІК →'
      },
      {
        id: 'bank-psp-sof-scrutiny',
        title: 'Перевірка банку / PSP / походження коштів',
        body: 'Банк, платіжний провайдер або регульований контрагент перевіряє структуру володіння, бенефіціара, потоки, походження коштів і капіталу та економічну логіку структури.',
        href: '/uk/ekspertyza/bankivska-gotovnist.html',
        link: 'Банківська готовність →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Приватний капітал або сімейний офіс',
        body: 'Бізнес, інвестиційні та сімейні активи знаходяться в кількох країнах і потребують узгодженої моделі володіння, управління, спадкоємності та банківської готовності.',
        href: '/uk/ekspertyza/pryvatnyy-kapital-i-family-office.html',
        link: 'Приватний капітал і сімейний офіс →'
      },
      {
        id: 'transaction-external-review',
        title: 'Чинна структура перед угодою або зовнішньою перевіркою',
        body: 'Наближається інвестор, продаж, фінансування, реорганізація або суттєва зміна бізнесу — чинну модель потрібно перевірити до того, як це зробить зовнішня сторона.',
        href: '/uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html',
        link: 'Стратегічний структурний аудит →'
      }
    ],
    specialist: {
      label: 'ОКРЕМИЙ МАРШРУТ',
      title: 'Для українських власників і бізнесу в Європі',
      body: 'Спеціалізований маршрут для українських підприємців і власників, які працюють або переїжджають до Європи: структура володіння, резидентство, управління, банки та капітал розглядаються як єдина система.',
      href: '/uk/dlya-ukrainskogo-biznesu.html',
      link: 'Перейти до спеціалізованого маршруту →'
    },
    workHeading: 'Від первинної перевірки до впровадження та постійної координації',
    workSubtitle: 'Формат залежить від стадії завдання: експрес-діагностика, повний структурний аудит, супровід впровадження або постійна координація після початкового проєкту.',
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

function replaceInner(fragment, selectorClass, tag, content) {
  const rx = new RegExp(`(<${tag}\\b(?=[^>]*class=["'][^"']*\\b${selectorClass}\\b[^"']*["'])[^>]*>)[\\s\\S]*?(<\\/${tag}>)`, 'i');
  if (!rx.test(fragment)) throw new Error(`${tag}.${selectorClass} not found`);
  return fragment.replace(rx, `$1${content}$2`);
}

function buildCards(cards) {
  return cards.map(card => `
          <article class="audience-card client-journey-card">
            <h3>${escapeHtml(card.title)}</h3>
            <p>${escapeHtml(card.body)}</p>
            <a class="inline-link" href="${card.href}" data-funnel-journey="${card.id}">${escapeHtml(card.link)}</a>
          </article>`).join('');
}

function buildSpecialistRoute(cfg) {
  return `
        <article class="audience-card client-specialist-route" style="margin-top:24px; text-align:center;">
          <div class="section-label">${escapeHtml(cfg.label)}</div>
          <h3>${escapeHtml(cfg.title)}</h3>
          <p>${escapeHtml(cfg.body)}</p>
          <a class="inline-link" href="${cfg.href}" data-funnel-specialist-route="ukrainian-europe">${escapeHtml(cfg.link)}</a>
        </article>`;
}

function refineAudience(html, file, cfg) {
  const sectionStart = html.search(/<section\b[^>]*class=["'][^"']*\bhome-audience\b[^"']*["'][^>]*>/i);
  if (sectionStart < 0) throw new Error(`home-audience section not found: ${file}`);
  const sectionEnd = html.indexOf('</section>', sectionStart);
  if (sectionEnd < 0) throw new Error(`home-audience section end not found: ${file}`);
  let section = html.slice(sectionStart, sectionEnd + 10);

  section = replaceInner(section, 'section-label', 'div', escapeHtml(cfg.label));
  section = replaceInner(section, 'section-title-main', 'h2', escapeHtml(cfg.heading));
  section = replaceInner(section, 'section-subtitle', 'p', escapeHtml(cfg.subtitle));

  const gridStart = section.search(/<div\b[^>]*class=["'][^"']*\baudience-grid\b[^"']*["'][^>]*>/i);
  if (gridStart < 0) throw new Error(`audience-grid not found: ${file}`);
  const gridOpenEnd = section.indexOf('>', gridStart) + 1;
  const gridClose = section.indexOf('</div>', gridOpenEnd);
  if (gridClose < 0) throw new Error(`audience-grid close not found: ${file}`);
  const replacement = section.slice(gridStart, gridOpenEnd) + buildCards(cfg.cards) + '\n        </div>' + buildSpecialistRoute(cfg.specialist);
  section = section.slice(0, gridStart) + replacement + section.slice(gridClose + 6);

  return html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
}

function refineWorkFormats(html, file, cfg) {
  const sectionStart = html.search(/<section\b[^>]*class=["'][^"']*\bhome-formats\b[^"']*["'][^>]*>/i);
  if (sectionStart < 0) throw new Error(`home-formats section not found: ${file}`);
  const sectionEnd = html.indexOf('</section>', sectionStart);
  if (sectionEnd < 0) throw new Error(`home-formats section end not found: ${file}`);
  let section = html.slice(sectionStart, sectionEnd + 10);

  section = replaceInner(section, 'section-title-main', 'h2', escapeHtml(cfg.workHeading));
  section = replaceInner(section, 'section-subtitle', 'p', escapeHtml(cfg.workSubtitle));

  const hrefEscaped = cfg.externalHref.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const cardRx = new RegExp(`(<a\\b[^>]*href=["']${hrefEscaped}["'][^>]*>[\\s\\S]*?<p>)[\\s\\S]*?(<\\/p>[\\s\\S]*?<\\/a>)`, 'i');
  if (!cardRx.test(section)) throw new Error(`external legal function card not found: ${file}`);
  section = section.replace(cardRx, `$1${escapeHtml(cfg.externalBody)}$2`);

  return html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
}

function refine(file, cfg) {
  const abs = path.join(ROOT, file);
  let html = fs.readFileSync(abs, 'utf8');
  html = refineAudience(html, file, cfg);
  html = refineWorkFormats(html, file, cfg);
  fs.writeFileSync(abs, html, 'utf8');
}

let changed = 0;
for (const cfg of Object.values(CONFIG)) {
  refine(cfg.file, cfg);
  changed++;
}

console.log(`[LEXONYX client journeys] refined=${changed}; primary journeys=5; specialist routes=1; languages=3`);
