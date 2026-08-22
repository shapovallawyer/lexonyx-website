import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const CFG = {
  en: {
    file: 'en/insights/index.html',
    oldHeading: 'Insights are based on the same system as the expertise section',
    label: 'FIVE AUTHORITY THEMES',
    heading: 'Explore the issues through the five situations that bring clients to LEXONYX',
    intro: 'The formats stay the same — briefings, analyses and tools. The authority layer is organised around the business situations in which structural questions become urgent.',
    clusters: [
      ['International Expansion & Group Architecture', '/en/expertise/group-structuring', 'Entity roles, ownership, management, flows and the point at which a cross-border group stops working as one coherent model.'],
      ['Founder Mobility & Business Relocation', '/en/founder-mobility-business-relocation', 'What changes when a founder, owner or director moves: residence, management, CFC/PE interfaces, banking, governance and restructuring.'],
      ['Banking Readiness & Source of Funds', '/en/expertise/banking-readiness', 'How ownership, business model, KYC/KYB, Source of Funds / Source of Wealth and real cash flows must reconcile under scrutiny.'],
      ['Private Capital & Family Office', '/en/expertise/private-capital-and-family-office', 'Ownership, governance, banking and succession interfaces for private capital held or managed across jurisdictions.'],
      ['Structural Audit & Transaction Readiness', '/en/work-formats/strategic-structural-audit', 'How to test an existing structure before an investor, financing, sale, restructuring or independent external review.']
    ],
    faqNeedle: 'What are the insights based on?',
    faqAnswer: 'Insights use the same cross-border structural logic as the advisory practice, but the content is organised around five recurring client situations: international expansion, founder mobility, banking and source-of-funds scrutiny, private capital, and review of an existing structure before a transaction or other external scrutiny. Technical subjects such as tax residence, CFC, PE, VAT, substance, governance and regulatory issues are analysed inside those situations rather than treated as isolated topics.'
  },
  ru: {
    file: 'ru/insayty/index.html',
    oldHeading: 'Инсайты опираются на ту же систему, что и экспертиза',
    label: 'ПЯТЬ КЛЮЧЕВЫХ ТЕМ',
    heading: 'Пять ситуаций, через которые мы выстраиваем аналитику LEXONYX',
    intro: 'Форматы остаются прежними — брифинги, разборы и инструменты. Аналитика организована вокруг бизнес-ситуаций, в которых структурные вопросы становятся практическими и срочными.',
    clusters: [
      ['Международное расширение и архитектура группы', '/ru/ekspertiza/strukturirovanie-gruppy', 'Роли компаний, владение, управление, потоки и момент, когда международная группа перестаёт работать как единая согласованная модель.'],
      ['Переезд собственника и бизнеса', '/ru/pereezd-sobstvennika-i-biznesa', 'Что меняется при переезде собственника или директора: резидентство, управление, КИК, постоянное представительство, банки и реструктуризация.'],
      ['Банковская готовность и происхождение средств', '/ru/ekspertiza/bankovskaya-gotovnost', 'Как владение, бизнес-модель, банковские проверки, происхождение средств и капитала и реальные денежные потоки должны складываться в одну объяснимую картину.'],
      ['Частный капитал и семейный офис', '/ru/ekspertiza/chastnyy-kapital-i-family-office', 'Владение, корпоративное управление, банковские вопросы и преемственность для частного капитала в нескольких юрисдикциях.'],
      ['Структурный аудит и готовность к сделке', '/ru/formaty-raboty/strategicheskiy-strukturnyy-audit', 'Как проверить действующую структуру перед инвестором, финансированием, продажей, реструктуризацией или независимой внешней проверкой.']
    ],
    faqNeedle: 'На чём основаны инсайты?',
    faqAnswer: 'Инсайты используют ту же логику анализа международной структуры, что и консультационная практика, но контент организован вокруг пяти повторяющихся клиентских ситуаций: международного расширения, переезда собственника, банковской проверки и происхождения средств, частного капитала и проверки действующей структуры перед сделкой или иной внешней оценкой. Налоговое резидентство, КИК, постоянное представительство, НДС, фактическое присутствие, корпоративное управление и регуляторные вопросы рассматриваются внутри этих ситуаций, а не как изолированные темы.'
  },
  uk: {
    file: 'uk/insaity/index.html',
    oldHeading: 'Інсайти спираються на ту саму систему, що й експертиза',
    label: 'П’ЯТЬ КЛЮЧОВИХ ТЕМ',
    heading: 'П’ять ситуацій, навколо яких ми вибудовуємо аналітику LEXONYX',
    intro: 'Формати залишаються тими самими — брифінги, розбори та інструменти. Аналітика організована навколо бізнес-ситуацій, у яких структурні питання стають практичними й терміновими.',
    clusters: [
      ['Міжнародне розширення та архітектура групи', '/uk/ekspertyza/strukturuvannya-grupy', 'Ролі компаній, володіння, управління, потоки та момент, коли міжнародна група перестає працювати як єдина узгоджена модель.'],
      ['Переїзд власника та бізнесу', '/uk/pereyizd-vlasnyka-i-biznesu', 'Що змінюється під час переїзду власника чи директора: резидентство, управління, КІК, постійне представництво, банки та реструктуризація.'],
      ['Банківська готовність і походження коштів', '/uk/ekspertyza/bankivska-gotovnist', 'Як володіння, бізнес-модель, банківські перевірки, походження коштів і капіталу та реальні грошові потоки мають складатися в одну пояснювану картину.'],
      ['Приватний капітал і сімейний офіс', '/uk/ekspertyza/pryvatnyy-kapital-i-family-office', 'Володіння, корпоративне управління, банківські питання та наступництво для приватного капіталу в кількох юрисдикціях.'],
      ['Структурний аудит і готовність до угоди', '/uk/formaty-roboty/strategichnyy-strukturnyy-audyt', 'Як перевірити чинну структуру перед інвестором, фінансуванням, продажем, реструктуризацією або незалежною зовнішньою перевіркою.']
    ],
    faqNeedle: 'На чому базуються інсайти?',
    faqAnswer: 'Інсайти використовують ту саму логіку аналізу міжнародної структури, що й консультаційна практика, але контент організовано навколо п’яти повторюваних клієнтських ситуацій: міжнародного розширення, переїзду власника, банківської перевірки та походження коштів, приватного капіталу і перевірки чинної структури перед угодою чи іншою зовнішньою оцінкою. Податкове резидентство, КІК, постійне представництво, ПДВ, фактична присутність, корпоративне управління та регуляторні питання розглядаються всередині цих ситуацій, а не як ізольовані теми.'
  }
};

function esc(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function authoritySection(cfg) {
  const cards = cfg.clusters.map(([title, href, body], i) => `      <a href="${href}" class="related-link-card" data-authority-cluster="${i + 1}">\n        <h3>${esc(title)}</h3>\n        <p>${esc(body)}</p>\n      </a>`).join('\n');
  return `<section class="section section-light authority-clusters" data-authority-architecture="v1">\n  <div class="container">\n    <div class="section-header-centered" data-reveal>\n      <div class="section-label">${esc(cfg.label)}</div>\n      <h2 class="section-title-main">${esc(cfg.heading)}</h2>\n      <p class="section-subtitle">${esc(cfg.intro)}</p>\n    </div>\n    <div class="related-links-grid" data-reveal-stagger>\n${cards}\n    </div>\n  </div>\n</section>`;
}

function replaceSectionContaining(html, needle, replacement) {
  const sections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/gi)];
  const target = sections.find(m => m[0].includes(needle));
  if (!target) throw new Error(`section containing "${needle}" not found`);
  return html.slice(0, target.index) + replacement + html.slice(target.index + target[0].length);
}

function replaceFaqAnswer(html, needle, answer) {
  const details = [...html.matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/gi)];
  const target = details.find(m => m[0].includes(needle));
  if (!target) throw new Error(`FAQ item "${needle}" not found`);
  const updated = target[0].replace(/(<div\b[^>]*class=["'][^"']*lx-faq-answer[^"']*["'][^>]*>\s*<p>)[\s\S]*?(<\/p>\s*<\/div>)/i, `$1${esc(answer)}$2`);
  if (updated === target[0]) throw new Error(`FAQ answer for "${needle}" not replaced`);
  return html.slice(0, target.index) + updated + html.slice(target.index + target[0].length);
}

function replaceStructuredFaqAnswer(html, needle, answer) {
  let changed = false;
  const updated = html.replace(/<script\b([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    let data;
    try {
      data = JSON.parse(body.trim());
    } catch {
      return full;
    }
    if (!data || data['@type'] !== 'FAQPage' || !Array.isArray(data.mainEntity)) return full;
    let localChanged = false;
    for (const item of data.mainEntity) {
      if (item?.['@type'] === 'Question' && String(item.name || '').includes(needle) && item.acceptedAnswer) {
        item.acceptedAnswer.text = answer;
        localChanged = true;
      }
    }
    if (!localChanged) return full;
    changed = true;
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>`;
  });
  if (!changed) throw new Error(`JSON-LD FAQ item "${needle}" not found`);
  return updated;
}

for (const [lang, cfg] of Object.entries(CFG)) {
  const file = path.join(ROOT, cfg.file);
  let html = fs.readFileSync(file, 'utf8');
  html = replaceSectionContaining(html, cfg.oldHeading, authoritySection(cfg));
  html = replaceFaqAnswer(html, cfg.faqNeedle, cfg.faqAnswer);
  html = replaceStructuredFaqAnswer(html, cfg.faqNeedle, cfg.faqAnswer);
  if (lang === 'ru') html = html.replace('<span>Framework</span>', '<span>Методология</span>');
  if (lang === 'uk') html = html.replace('<span>Framework</span>', '<span>Методологія</span>');
  fs.writeFileSync(file, html, 'utf8');
}

console.log('[LEXONYX authority architecture] PASS — five authority themes added to EN/RU/UK Insights hubs; visible and structured FAQ aligned');
