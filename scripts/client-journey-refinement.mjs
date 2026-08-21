import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const CONFIG = {
  en: {
    file: 'en/index.html',
    label: 'START FROM YOUR SITUATION',
    heading: 'Start with what is driving the review now',
    subtitle: 'The first step should follow the trigger: international expansion, owner relocation, banking scrutiny, private capital needs, or a major transaction or structural change.',
    cards: [
      {
        id: 'international-expansion-group-architecture',
        title: 'International expansion or group architecture',
        body: 'The business is entering a new country, adding a foreign entity or reaching the point where an existing group needs one coherent ownership, governance and operating model.',
        href: '/en/expertise/group-structuring.html',
        link: 'Group Structuring →'
      },
      {
        id: 'founder-owner-relocation',
        title: 'Founder or owner relocation',
        body: 'A founder, owner or director has moved while companies, teams, IP, management or capital remain spread across jurisdictions.',
        href: '/en/expertise/tax-residency-cfc.html',
        link: 'Tax Residence & CFC →'
      },
      {
        id: 'bank-psp-source-of-funds-scrutiny',
        title: 'Bank / PSP / Source of Funds scrutiny',
        body: 'A bank or payment provider needs a clear explanation of ownership, UBO, business model, flows, Source of Funds / Source of Wealth and the evidence behind them.',
        href: '/en/expertise/banking-readiness.html',
        link: 'Banking Readiness →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Private capital or family office',
        body: 'Operating businesses, investment assets and family interests across jurisdictions need coherent ownership, governance, succession and wealth-provenance planning.',
        href: '/en/expertise/private-capital-and-family-office.html',
        link: 'Private Capital →'
      },
      {
        id: 'transaction-investor-major-change',
        title: 'Transaction, investor or major structural change',
        body: 'An existing structure needs to be tested before a sale, investment, financing, restructuring, due diligence process or a material change in operations.',
        href: '/en/work-formats/strategic-structural-audit.html',
        link: 'Strategic Structural Audit →'
      }
    ],
    specialist: {
      label: 'DEDICATED ROUTE',
      title: 'For Ukrainian owners & businesses in Europe',
      body: 'A specialist route for Ukrainian founders, owners and businesses dealing with EU expansion, owner mobility, banking, capital and cross-border structure questions.',
      href: '/en/for-ukrainian-business.html',
      link: 'Explore the dedicated route →'
    }
  },
  ru: {
    file: 'ru/index.html',
    label: 'НАЧНИТЕ С ВАШЕЙ СИТУАЦИИ',
    heading: 'Начните с того, что требует решения сейчас',
    subtitle: 'Первый шаг зависит от причины обращения: международное расширение, переезд собственника, банковская проверка, частный капитал или крупная сделка и изменение структуры.',
    cards: [
      {
        id: 'international-expansion-group-architecture',
        title: 'Международное расширение или структура группы',
        body: 'Бизнес выходит в новую страну, появляется иностранная компания или действующая группа уже требует единой архитектуры владения, управления, функций и потоков.',
        href: '/ru/ekspertiza/strukturirovanie-gruppy.html',
        link: 'Структурирование группы →'
      },
      {
        id: 'founder-owner-relocation',
        title: 'Переезд собственника или основателя',
        body: 'Собственник, основатель или директор переехал, а компании, команда, интеллектуальная собственность, управление или капитал остаются распределёнными между странами.',
        href: '/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
        link: 'Налоговое резидентство и КИК →'
      },
      {
        id: 'bank-psp-source-of-funds-scrutiny',
        title: 'Проверка банка / PSP / происхождения средств',
        body: 'Банк или платёжный провайдер требует объяснить структуру владения, бенефициара, бизнес-модель, денежные потоки, происхождение средств и капитала и подтверждающие документы.',
        href: '/ru/ekspertiza/bankovskaya-gotovnost.html',
        link: 'Банковская готовность →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Частный капитал или семейный офис',
        body: 'Операционный бизнес, инвестиционные активы и семейные интересы в нескольких странах требуют согласованной модели владения, управления, преемственности и происхождения капитала.',
        href: '/ru/ekspertiza/chastnyy-kapital-i-family-office.html',
        link: 'Частный капитал →'
      },
      {
        id: 'transaction-investor-major-change',
        title: 'Сделка, инвестор или крупное изменение структуры',
        body: 'Действующую структуру нужно проверить перед продажей, инвестициями, финансированием, реорганизацией, due diligence или существенным изменением бизнеса.',
        href: '/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html',
        link: 'Стратегический структурный аудит →'
      }
    ],
    specialist: {
      label: 'ОТДЕЛЬНЫЙ МАРШРУТ',
      title: 'Для украинских собственников и бизнеса в Европе',
      body: 'Специализированный маршрут для украинских собственников, основателей и компаний, которым нужно связать выход в ЕС, переезд, банковские вопросы, капитал и международную структуру.',
      href: '/ru/dlya-ukrainskogo-biznesa.html',
      link: 'Перейти к специальному маршруту →'
    }
  },
  uk: {
    file: 'uk/index.html',
    label: 'ПОЧНІТЬ ІЗ ВАШОЇ СИТУАЦІЇ',
    heading: 'Почніть із того, що потребує вирішення зараз',
    subtitle: 'Перший крок залежить від причини звернення: міжнародне розширення, переїзд власника, банківська перевірка, приватний капітал або велика угода чи зміна структури.',
    cards: [
      {
        id: 'international-expansion-group-architecture',
        title: 'Міжнародне розширення або структура групи',
        body: 'Бізнес виходить у нову країну, з’являється іноземна компанія або чинна група вже потребує єдиної архітектури володіння, управління, функцій і потоків.',
        href: '/uk/ekspertyza/strukturuvannya-grupy.html',
        link: 'Структурування групи →'
      },
      {
        id: 'founder-owner-relocation',
        title: 'Переїзд власника або засновника',
        body: 'Власник, засновник або директор переїхав, а компанії, команда, інтелектуальна власність, управління чи капітал залишаються розподіленими між країнами.',
        href: '/uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
        link: 'Податкове резидентство і КІК →'
      },
      {
        id: 'bank-psp-source-of-funds-scrutiny',
        title: 'Перевірка банку / PSP / походження коштів',
        body: 'Банк або платіжний провайдер вимагає пояснити структуру володіння, бенефіціара, бізнес-модель, грошові потоки, походження коштів і капіталу та підтвердні документи.',
        href: '/uk/ekspertyza/bankivska-gotovnist.html',
        link: 'Банківська готовність →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Приватний капітал або сімейний офіс',
        body: 'Операційний бізнес, інвестиційні активи та сімейні інтереси в кількох країнах потребують узгодженої моделі володіння, управління, спадкоємності та походження капіталу.',
        href: '/uk/ekspertyza/pryvatnyy-kapital-i-family-office.html',
        link: 'Приватний капітал →'
      },
      {
        id: 'transaction-investor-major-change',
        title: 'Угода, інвестор або суттєва зміна структури',
        body: 'Чинну структуру потрібно перевірити перед продажем, інвестицією, фінансуванням, реорганізацією, due diligence або суттєвою зміною бізнесу.',
        href: '/uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html',
        link: 'Стратегічний структурний аудит →'
      }
    ],
    specialist: {
      label: 'ОКРЕМИЙ МАРШРУТ',
      title: 'Для українських власників і бізнесу в Європі',
      body: 'Спеціалізований маршрут для українських власників, засновників і компаній, яким потрібно поєднати вихід до ЄС, переїзд, банківські питання, капітал і міжнародну структуру.',
      href: '/uk/dlya-ukrainskogo-biznesu.html',
      link: 'Перейти до спеціального маршруту →'
    }
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

function buildSpecialistRoute(route) {
  return `
        <div class="client-specialist-route" style="margin-top:32px; text-align:center;">
          <div class="section-label" style="margin-bottom:10px;">${escapeHtml(route.label)}</div>
          <h3 style="margin-bottom:10px;">${escapeHtml(route.title)}</h3>
          <p class="section-subtitle" style="max-width:780px; margin:0 auto 20px;">${escapeHtml(route.body)}</p>
          <a class="btn btn-outline" href="${route.href}" data-funnel-specialist="ukrainian-business">${escapeHtml(route.link)}</a>
        </div>`;
}

function refine(file, cfg) {
  const abs = path.join(ROOT, file);
  let html = fs.readFileSync(abs, 'utf8');
  const sectionStart = html.search(/<section\\b[^>]*class=["'][^"']*\\bhome-audience\\b[^"']*["'][^>]*>/i);
  if (sectionStart < 0) throw new Error(`home-audience section not found: ${file}`);
  const sectionEnd = html.indexOf('</section>', sectionStart);
  if (sectionEnd < 0) throw new Error(`home-audience section end not found: ${file}`);
  let section = html.slice(sectionStart, sectionEnd + 10);

  section = replaceInner(section, 'section-label', 'div', escapeHtml(cfg.label));
  section = replaceInner(section, 'section-title-main', 'h2', escapeHtml(cfg.heading));
  section = replaceInner(section, 'section-subtitle', 'p', escapeHtml(cfg.subtitle));

  const gridStart = section.search(/<div\\b[^>]*class=["'][^"']*\\baudience-grid\\b[^"']*["'][^>]*>/i);
  if (gridStart < 0) throw new Error(`audience-grid not found: ${file}`);
  const gridOpenEnd = section.indexOf('>', gridStart) + 1;
  const gridClose = section.indexOf('</div>', gridOpenEnd);
  if (gridClose < 0) throw new Error(`audience-grid close not found: ${file}`);
  const replacement = section.slice(gridStart, gridOpenEnd) + buildCards(cfg.cards) + '\n        </div>' + buildSpecialistRoute(cfg.specialist);
  section = section.slice(0, gridStart) + replacement + section.slice(gridClose + 6);

  html = html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
  fs.writeFileSync(abs, html, 'utf8');
}

let changed = 0;
for (const cfg of Object.values(CONFIG)) {
  refine(cfg.file, cfg);
  changed++;
}

console.log(`[LEXONYX client journeys] refined=${changed}; universal journeys=5; specialist routes=1; languages=3`);
