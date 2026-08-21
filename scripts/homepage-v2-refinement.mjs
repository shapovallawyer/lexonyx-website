import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const CFG = {
  en: {
    file: 'en/index.html',
    hero: 'We help founders and international businesses align ownership, company roles, governance, banking and cross-border risk into one coherent operating model.',
    flagship: {
      label: 'HOW WE READ THE STRUCTURE',
      title: 'One structure. Several connected workstreams.',
      subtitle: 'We read ownership, management, tax interfaces, banking, governance and evidence as one system. Jurisdiction-specific legal and tax conclusions are coordinated with appropriately qualified specialists where required.',
      lines: [
        'Business architecture → ownership, company roles, management and real flows',
        'Cross-border risk → tax residence, CFC, PE, VAT and treaty interfaces',
        'Banking & capital → KYC/AML logic, Source of Funds / Source of Wealth and explainable flows',
        'Governance & evidence → authority, decisions, substance and a verifiable document trail'
      ],
      manifesto: 'We do not sell jurisdictions — we build a coherent operating model.',
      cta: 'Explore expertise'
    },
    deliverables: {
      label: 'WHAT YOU RECEIVE',
      title: 'A working map of the structure — not a list of disconnected recommendations',
      subtitle: 'The exact scope depends on the task. The core output is a clear picture of the current model, its material gaps and the sequence for addressing them.',
      cards: [
        ['Structure & ownership map', 'Entities, ownership, company roles, management, functions and material relationships.'],
        ['Risk & dependency map', 'The cross-border interfaces that need attention, including tax, PE/VAT, banking, governance or regulatory dependencies.'],
        ['Governance & evidence pack', 'Authority, decision trail, banking narrative and the evidence needed to support how the model actually operates.'],
        ['Implementation roadmap', 'A prioritised sequence of changes, specialist workstreams and documents required for implementation.']
      ]
    }
  },
  ru: {
    file: 'ru/index.html',
    hero: 'Помогаем собственникам и международному бизнесу связать владение, роли компаний, управление, банковскую логику и трансграничные риски в одну согласованную операционную модель.',
    flagship: {
      label: 'КАК МЫ ЧИТАЕМ СТРУКТУРУ',
      title: 'Одна структура. Несколько взаимосвязанных направлений.',
      subtitle: 'Мы рассматриваем владение, управление, налоговые вопросы, банковскую логику, корпоративное управление и доказательную базу как одну систему. Выводы по праву и налогам конкретной юрисдикции при необходимости координируются с квалифицированными профильными специалистами.',
      lines: [
        'Архитектура бизнеса → владение, роли компаний, управление и реальные потоки',
        'Трансграничные риски → налоговое резидентство, КИК, постоянное представительство, НДС и международные налоговые соглашения',
        'Банки и капитал → банковские проверки, происхождение средств и капитала и объяснимость потоков',
        'Корпоративное управление и доказательства → полномочия, решения, фактическое присутствие и подтверждающие документы'
      ],
      manifesto: 'Мы не продаём юрисдикции — мы выстраиваем согласованную операционную модель.',
      cta: 'Смотреть экспертизу'
    },
    deliverables: {
      label: 'ЧТО ВЫ ПОЛУЧАЕТЕ',
      title: 'Рабочую карту структуры — а не набор разрозненных рекомендаций',
      subtitle: 'Точный состав результата зависит от задачи. Основа — понятная картина текущей модели, существенных разрывов и последовательности их устранения.',
      cards: [
        ['Карта структуры и владения', 'Компании, владение, роли, управление, функции и существенные связи внутри модели.'],
        ['Карта рисков и зависимостей', 'Трансграничные вопросы, требующие внимания: налоговые, вопросы постоянного представительства и НДС, банковские, управленческие или регуляторные.'],
        ['Корпоративное управление и доказательная база', 'Полномочия, история решений, банковская логика и документы, подтверждающие фактическую работу модели.'],
        ['План реализации', 'Приоритетная последовательность изменений, профильных направлений работы и документов для внедрения.']
      ]
    }
  },
  uk: {
    file: 'uk/index.html',
    hero: 'Допомагаємо власникам і міжнародному бізнесу поєднати володіння, ролі компаній, управління, банківську логіку та транскордонні ризики в одну узгоджену операційну модель.',
    flagship: {
      label: 'ЯК МИ ЧИТАЄМО СТРУКТУРУ',
      title: 'Одна структура. Кілька взаємопов’язаних напрямів.',
      subtitle: 'Ми розглядаємо володіння, управління, податкові питання, банківську логіку, корпоративне управління та доказову базу як одну систему. Висновки щодо права та оподаткування конкретної юрисдикції за потреби координуються з кваліфікованими профільними фахівцями.',
      lines: [
        'Архітектура бізнесу → володіння, ролі компаній, управління та реальні потоки',
        'Транскордонні ризики → податкове резидентство, КІК, постійне представництво, ПДВ і міжнародні податкові угоди',
        'Банки й капітал → банківські перевірки, походження коштів і капіталу та пояснюваність потоків',
        'Корпоративне управління та докази → повноваження, рішення, фактична присутність і підтвердні документи'
      ],
      manifesto: 'Ми не продаємо юрисдикції — ми вибудовуємо узгоджену операційну модель.',
      cta: 'Переглянути експертизу'
    },
    deliverables: {
      label: 'ЩО ВИ ОТРИМУЄТЕ',
      title: 'Робочу карту структури — а не набір розрізнених рекомендацій',
      subtitle: 'Точний склад результату залежить від завдання. Основа — зрозуміла картина поточної моделі, істотних розривів і послідовності їх усунення.',
      cards: [
        ['Карта структури та володіння', 'Компанії, володіння, ролі, управління, функції та істотні зв’язки всередині моделі.'],
        ['Карта ризиків і залежностей', 'Транскордонні питання, що потребують уваги: податкові, питання постійного представництва та ПДВ, банківські, управлінські або регуляторні.'],
        ['Корпоративне управління та доказова база', 'Повноваження, історія рішень, банківська логіка та документи, що підтверджують фактичну роботу моделі.'],
        ['План реалізації', 'Пріоритетна послідовність змін, профільних напрямів роботи та документів для впровадження.']
      ]
    }
  }
};

function escRe(v) { return String(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function sectionRx(token) {
  return new RegExp(`<section\\b(?=[^>]*class=["'][^"']*\\b${escRe(token)}\\b[^"']*["'])[^>]*>[\\s\\S]*?<\\/section>`, 'i');
}
function extractSection(html, token) {
  const m = sectionRx(token).exec(html);
  if (!m) throw new Error(`section .${token} not found`);
  return { text: m[0], index: m.index };
}
function removeSection(html, token) {
  const m = extractSection(html, token);
  return html.slice(0, m.index) + html.slice(m.index + m.text.length);
}
function replaceSection(html, token, replacement) {
  const m = extractSection(html, token);
  return html.slice(0, m.index) + replacement + html.slice(m.index + m.text.length);
}
function escapeHtml(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function flagshipHtml(c, expertiseHref) {
  const lines = c.lines.map(x => `          <div class="schema-line">${escapeHtml(x)}</div>`).join('\n');
  return `    <section class="section section-dark home-flagship">\n      <div class="container container-narrow">\n        <div class="section-label">${escapeHtml(c.label)}</div>\n        <h2 class="section-title-main">${escapeHtml(c.title)}</h2>\n        <p class="section-subtitle">${escapeHtml(c.subtitle)}</p>\n        <div class="schema-panel" data-reveal-stagger>\n${lines}\n        </div>\n        <div class="lx-manifesto-wrap" data-reveal>\n          <span class="lx-rule"></span>\n          <p class="lx-manifesto">${escapeHtml(c.manifesto)}</p>\n        </div>\n        <div class="hero-actions home-flagship-actions">\n          <a href="${expertiseHref}" class="btn btn-primary btn-lg">${escapeHtml(c.cta)}</a>\n        </div>\n      </div>\n    </section>`;
}
function deliverablesHtml(c) {
  const cards = c.cards.map(([h,b]) => `          <div class="audience-card">\n            <h3>${escapeHtml(h)}</h3>\n            <p>${escapeHtml(b)}</p>\n          </div>`).join('\n\n');
  return `    <section class="section section-dark home-deliverables" data-reveal>\n      <div class="container">\n        <div class="section-header-centered" data-reveal>\n          <div class="section-label">${escapeHtml(c.label)}</div>\n          <h2 class="section-title-main">${escapeHtml(c.title)}</h2>\n          <p class="section-subtitle">${escapeHtml(c.subtitle)}</p>\n        </div>\n        <div class="situation-grid" data-reveal-stagger>\n${cards}\n        </div>\n      </div>\n    </section>`;
}

for (const [lang, cfg] of Object.entries(CFG)) {
  const file = path.join(ROOT, cfg.file);
  let html = fs.readFileSync(file, 'utf8');

  let hero = extractSection(html, 'hero-home').text;
  const subtitleRx = /<p\b(?=[^>]*class=["'][^"']*\bhero-subtitle\b[^"']*["'])[^>]*>[\s\S]*?<\/p>/gi;
  let seen = 0;
  hero = hero.replace(subtitleRx, m => {
    seen++;
    if (seen === 1) return m.replace(/(<p\b[^>]*>)[\s\S]*?(<\/p>)/i, `$1\n            ${escapeHtml(cfg.hero)}\n          $2`);
    return '';
  });
  if (seen < 1) throw new Error(`${lang}: hero subtitle not found`);
  html = replaceSection(html, 'hero-home', hero);

  for (const token of ['home-directions', 'home-structure-types', 'home-situations', 'home-timing']) {
    html = removeSection(html, token);
  }

  const audience = extractSection(html, 'home-audience');
  html = html.slice(0, audience.index) + html.slice(audience.index + audience.text.length);
  const heroNow = extractSection(html, 'hero-home');
  const heroEnd = heroNow.index + heroNow.text.length;
  html = html.slice(0, heroEnd) + '\n\n' + audience.text + html.slice(heroEnd);

  const expertiseHref = lang === 'en' ? '/en/expertise/index.html' : lang === 'ru' ? '/ru/ekspertiza/index.html' : '/uk/ekspertyza/index.html';
  html = replaceSection(html, 'home-flagship', flagshipHtml(cfg.flagship, expertiseHref));
  html = replaceSection(html, 'home-deliverables', deliverablesHtml(cfg.deliverables));

  fs.writeFileSync(file, html, 'utf8');
}

console.log('[LEXONYX homepage v2] PASS — scenario-first layout, duplicate blocks removed, expertise and deliverables compressed');
