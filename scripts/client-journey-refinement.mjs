import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const CONFIG = {
  en: {
    file: 'en/index.html',
    label: 'WHO WE WORK WITH',
    heading: 'Start from the situation you have now',
    subtitle: 'The same international structure can require a different first step depending on what triggered the review: expansion, banking questions, relocation, private capital or recurring cross-border work.',
    cards: [
      {
        id: 'ukrainian-owner-europe',
        title: 'Ukrainian owner or business in Europe',
        body: 'Relocation, EU expansion or cross-border ownership where personal residency, CFC, management and banking need to be read as one model.',
        href: '/en/for-ukrainian-business.html',
        link: 'Start here →'
      },
      {
        id: 'founder-international-group',
        title: 'Founder or international group',
        body: 'A first foreign company, a growing HoldCo/OpCo structure or an existing model that no longer matches how the business actually operates.',
        href: '/en/expertise/group-structuring.html',
        link: 'Group Structuring →'
      },
      {
        id: 'bank-psp-review',
        title: 'Bank / PSP / Source of Funds review',
        body: 'Onboarding, enhanced due diligence or recurring questions about ownership, flows, UBO, Source of Funds / Source of Wealth or business logic.',
        href: '/en/expertise/banking-readiness.html',
        link: 'Banking Readiness →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Private capital or family office',
        body: 'Assets, companies and family interests across jurisdictions need coherent ownership, governance, succession planning and banking readiness.',
        href: '/en/expertise/private-capital-and-family-office.html',
        link: 'Private Capital →'
      },
      {
        id: 'external-legal-function',
        title: 'Growing business without cross-border in-house capacity',
        body: 'Recurring matters across several jurisdictions need one coordinating international legal function rather than a collection of disconnected advisers.',
        href: '/en/work-formats/external-legal-function.html',
        link: 'External Legal Function →'
      }
    ]
  },
  ru: {
    file: 'ru/index.html',
    label: 'С КЕМ МЫ РАБОТАЕМ',
    heading: 'Начните с той ситуации, которая есть у вас сейчас',
    subtitle: 'Для одной и той же международной структуры первый шаг будет разным в зависимости от причины обращения: расширение бизнеса, вопросы банка, переезд собственника, частный капитал или постоянные трансграничные задачи.',
    cards: [
      {
        id: 'ukrainian-owner-europe',
        title: 'Украинский собственник или бизнес в Европе',
        body: 'Переезд, выход в ЕС или владение бизнесом в нескольких странах, где личное резидентство, КИК, управление и банковская логика должны рассматриваться как одна модель.',
        href: '/ru/dlya-ukrainskogo-biznesa.html',
        link: 'Начать отсюда →'
      },
      {
        id: 'founder-international-group',
        title: 'Основатель или международная группа',
        body: 'Первая иностранная компания, растущая HoldCo/OpCo-структура или действующая модель, которая уже не соответствует реальной работе бизнеса.',
        href: '/ru/ekspertiza/strukturirovanie-gruppy.html',
        link: 'Структурирование группы →'
      },
      {
        id: 'bank-psp-review',
        title: 'Проверка банка / PSP / Source of Funds',
        body: 'Онбординг, усиленная проверка или повторяющиеся вопросы об ownership, UBO, потоках, Source of Funds / Source of Wealth и бизнес-модели.',
        href: '/ru/ekspertiza/bankovskaya-gotovnost.html',
        link: 'Банковская готовность →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Частный капитал или Family Office',
        body: 'Активы, компании и семейные интересы в нескольких юрисдикциях требуют согласованной модели владения, управления, преемственности и банковской готовности.',
        href: '/ru/ekspertiza/chastnyy-kapital-i-family-office.html',
        link: 'Частный капитал →'
      },
      {
        id: 'external-legal-function',
        title: 'Растущий бизнес без внутренней международной юридической команды',
        body: 'Регулярные вопросы в нескольких юрисдикциях требуют единой координации, а не набора несвязанных консультантов.',
        href: '/ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html',
        link: 'Внешняя юридическая функция →'
      }
    ]
  },
  uk: {
    file: 'uk/index.html',
    label: 'З КИМ МИ ПРАЦЮЄМО',
    heading: 'Почніть із ситуації, яка є у вас зараз',
    subtitle: 'Для тієї самої міжнародної структури перший крок буде різним залежно від причини звернення: розширення бізнесу, питання банку, переїзд власника, приватний капітал або постійні транскордонні завдання.',
    cards: [
      {
        id: 'ukrainian-owner-europe',
        title: 'Український власник або бізнес у Європі',
        body: 'Переїзд, вихід до ЄС або володіння бізнесом у кількох країнах, де особисте резидентство, КІК, управління та банківська логіка мають розглядатися як одна модель.',
        href: '/uk/dlya-ukrainskogo-biznesu.html',
        link: 'Почати звідси →'
      },
      {
        id: 'founder-international-group',
        title: 'Засновник або міжнародна група',
        body: 'Перша іноземна компанія, зростаюча HoldCo/OpCo-структура або чинна модель, яка вже не відповідає тому, як бізнес реально працює.',
        href: '/uk/ekspertyza/strukturuvannya-grupy.html',
        link: 'Структурування групи →'
      },
      {
        id: 'bank-psp-review',
        title: 'Перевірка банку / PSP / Source of Funds',
        body: 'Онбординг, посилена перевірка або повторні запити щодо ownership, UBO, потоків, Source of Funds / Source of Wealth і бізнес-моделі.',
        href: '/uk/ekspertyza/bankivska-gotovnist.html',
        link: 'Банківська готовність →'
      },
      {
        id: 'private-capital-family-office',
        title: 'Приватний капітал або Family Office',
        body: 'Активи, компанії та сімейні інтереси в кількох юрисдикціях потребують узгодженої моделі володіння, управління, спадкоємності та банківської готовності.',
        href: '/uk/ekspertyza/pryvatnyy-kapital-i-family-office.html',
        link: 'Приватний капітал →'
      },
      {
        id: 'external-legal-function',
        title: 'Зростаючий бізнес без внутрішньої міжнародної юридичної команди',
        body: 'Регулярні питання в кількох юрисдикціях потребують єдиної координації, а не набору неузгоджених консультантів.',
        href: '/uk/formaty-roboty/zovnishnia-yurydychna-funktsiia.html',
        link: 'Зовнішня юридична функція →'
      }
    ]
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

function refine(file, cfg) {
  const abs = path.join(ROOT, file);
  let html = fs.readFileSync(abs, 'utf8');
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
  const replacement = section.slice(gridStart, gridOpenEnd) + buildCards(cfg.cards) + '\n        </div>';
  section = section.slice(0, gridStart) + replacement + section.slice(gridClose + 6);

  html = html.slice(0, sectionStart) + section + html.slice(sectionEnd + 10);
  fs.writeFileSync(abs, html, 'utf8');
}

let changed = 0;
for (const cfg of Object.values(CONFIG)) {
  refine(cfg.file, cfg);
  changed++;
}

console.log(`[LEXONYX client journeys] refined=${changed}; journeys=5; languages=3`);
