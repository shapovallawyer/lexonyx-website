import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BASE = 'https://lexonyx.com';

const ROUTES = {
  en: {
    base: 'en/expertise/tax-residency-cfc.html',
    out: 'en/founder-mobility-business-relocation.html',
    clean: '/en/founder-mobility-business-relocation',
    title: 'Founder Mobility & Business Relocation — LEXONYX',
    description: 'Cross-border relocation review for founders and business owners: personal and corporate residence, management, CFC/PE interfaces, banking, governance and restructuring coordinated as one transition.',
    label: 'FOUNDER MOBILITY',
    h1: 'Founder Mobility & Business Relocation',
    hero: 'When a founder, owner or director moves country, the business can move with them in ways that are not visible in the corporate documents. We review the personal and corporate consequences as one cross-border transition — before the move, during restructuring or after issues have already appeared.',
    primary: 'Request a relocation review',
    secondary: 'What we review',
    whyLabel: 'WHY THIS BECOMES A BUSINESS ISSUE',
    whyTitle: 'A personal move can change the operating reality of the group',
    whyIntro: 'Relocation is not only a personal tax-residence question. The same move can change where decisions are made, how companies are managed, what banks see and which parts of the structure need to be reconsidered.',
    whyCards: [
      ['The owner-side analysis changes', 'Personal tax residence, CFC exposure, remuneration and distributions may need to be reassessed against the new facts.'],
      ['Management may move with the founder', 'If strategic decisions, authority or control follow the owner, company-residence and permanent-establishment questions may also change.'],
      ['Banks and counterparties see the new reality', 'KYC, CRS, Source of Funds / Source of Wealth, governance and the explanation of control must remain consistent with how the business actually operates.']
    ],
    reviewLabel: 'WHAT WE REVIEW',
    reviewTitle: 'One relocation map across the connected workstreams',
    reviewIntro: 'The purpose is to understand the transition as a system before separate local conclusions are applied.',
    reviewCards: [
      ['Personal residence & CFC facts', 'Where the owner lives, what they control, how ownership is exercised and which facts require jurisdiction-specific tax analysis.'],
      ['Management & company residence', 'Where strategic decisions are made, who controls accounts and contracts, and whether the management model still matches the corporate structure.'],
      ['PE & international team', 'Where directors, employees and contractors work, what authority they have and whether the move changes presence-related risk.'],
      ['Dividends, remuneration & treaty interfaces', 'How owner payments and cross-border flows connect with treaty, withholding-tax and beneficial-ownership questions for specialist review.'],
      ['Banking, CRS & source of wealth', 'How the new residence affects KYC narratives, account structures, ownership explanations and evidence of funds and wealth.'],
      ['Governance, substance & restructuring', 'Whether authority, decision trails, company functions and the legal structure need to be aligned or reorganised after the move.']
    ],
    formatLabel: 'HOW TO START',
    formatTitle: 'Use the smallest format that matches the stage of the move',
    formats: [
      ['Before the move — relocation diagnostic', 'Use an Express Risk Review to map the facts, identify the connected workstreams and decide what must be confirmed before residence or management changes.', '/en/work-formats/express-risk-check'],
      ['Complex or post-relocation — structural audit', 'Use a Strategic Structural Audit when the move has already affected management, banking, ownership or several entities and the model needs a coordinated remediation plan.', '/en/work-formats/strategic-structural-audit']
    ],
    outputLabel: 'WHAT YOU RECEIVE',
    outputTitle: 'A decision map for the transition',
    outputs: [
      ['Relocation fact map', 'Residence, ownership, control, management, team locations and relevant cash-flow facts in one current-state picture.'],
      ['Cross-border dependency map', 'The interfaces that require attention across CFC, PE, banking, governance, distributions and restructuring.'],
      ['Structural options and sequence', 'A prioritised order for decisions and implementation rather than separate local fixes.'],
      ['Specialist coordination brief', 'A focused set of facts and questions for appropriately qualified tax and legal specialists in the relevant jurisdictions.']
    ],
    relatedLabel: 'RELATED EXPERTISE',
    relatedTitle: 'The technical pages behind the relocation route',
    related: [
      ['Tax Residence & CFC', '/en/expertise/tax-residency-cfc'],
      ['Group Structuring', '/en/expertise/group-structuring'],
      ['PE-risk & International Teams', '/en/expertise/pe-risk-international-teams'],
      ['Banking Readiness', '/en/expertise/banking-readiness'],
      ['Substance & Governance', '/en/expertise/substance-governance'],
      ['Strategic Structural Audit', '/en/work-formats/strategic-structural-audit']
    ],
    perimeter: 'LEXONYX maps the facts, structure and dependencies of the relocation. Jurisdiction-specific legal and tax conclusions are provided or confirmed by appropriately qualified specialists in the relevant jurisdictions.',
    ctaLabel: 'PLANNING A MOVE OR ALREADY LIVING IN A NEW JURISDICTION?',
    ctaTitle: 'Review the structure before separate issues become separate fixes',
    ctaBody: 'Send the current ownership structure, countries involved, where the owner and directors live, where decisions are made and what has triggered the review. We will identify the smallest sensible starting point.',
    langLinks: {
      ru: '/ru/pereezd-sobstvennika-i-biznesa',
      en: '/en/founder-mobility-business-relocation',
      uk: '/uk/pereyizd-vlasnyka-i-biznesu'
    },
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Founder Mobility & Business Relocation'
  },
  ru: {
    base: 'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
    out: 'ru/pereezd-sobstvennika-i-biznesa.html',
    clean: '/ru/pereezd-sobstvennika-i-biznesa',
    title: 'Переезд собственника и бизнеса — LEXONYX',
    description: 'Комплексный разбор переезда собственника: личное и корпоративное резидентство, управление, КИК, постоянное представительство, банки, капитал, корпоративное управление и реструктуризация.',
    label: 'ПЕРЕЕЗД СОБСТВЕННИКА',
    h1: 'Переезд собственника и бизнеса',
    hero: 'Когда собственник, основатель или директор переезжает в другую страну, вместе с ним может измениться и фактическая модель управления бизнесом. Мы рассматриваем личные и корпоративные последствия как один трансграничный переход — до переезда, во время реструктуризации или после того, как вопросы уже возникли.',
    primary: 'Запросить разбор переезда',
    secondary: 'Что мы проверяем',
    whyLabel: 'ПОЧЕМУ ЭТО ВОПРОС БИЗНЕСА',
    whyTitle: 'Личный переезд может изменить фактическую модель всей группы',
    whyIntro: 'Переезд не сводится к личному налоговому резидентству. Одновременно могут измениться место принятия решений, управление компаниями, банковская картина и сама логика структуры.',
    whyCards: [
      ['Меняется положение собственника', 'Налоговое резидентство, КИК, вознаграждение и распределение прибыли нужно сопоставить с новыми фактическими обстоятельствами.'],
      ['Управление может переехать вместе с собственником', 'Если стратегические решения, полномочия и контроль фактически перемещаются в другую страну, возникают вопросы резидентства компаний и постоянного представительства.'],
      ['Банки видят новую фактическую картину', 'Банковские проверки, автоматический обмен информацией, происхождение средств и капитала, управление и документы должны соответствовать реальной работе бизнеса.']
    ],
    reviewLabel: 'ЧТО МЫ ПРОВЕРЯЕМ',
    reviewTitle: 'Единая карта переезда по связанным направлениям',
    reviewIntro: 'Сначала собираем общую фактическую модель перехода, а затем определяем, какие выводы должны быть подтверждены профильными специалистами конкретных юрисдикций.',
    reviewCards: [
      ['Личное резидентство и КИК', 'Где живёт собственник, что он контролирует, как реализуется владение и какие факты требуют налогового анализа в соответствующих странах.'],
      ['Управление и резидентство компаний', 'Где принимаются стратегические решения, кто контролирует счета и договоры и соответствует ли фактическое управление корпоративной структуре.'],
      ['Постоянное представительство и команда', 'Где работают директора, сотрудники и подрядчики, какими полномочиями они обладают и меняет ли переезд риски присутствия.'],
      ['Дивиденды, вознаграждение и налоговые соглашения', 'Как выплаты собственнику и трансграничные потоки связаны с соглашениями об избежании двойного налогообложения, налогом у источника и вопросами фактического получателя дохода.'],
      ['Банки и происхождение капитала', 'Как новое место проживания влияет на банковские объяснения, счета, владение и подтверждение происхождения средств и капитала.'],
      ['Корпоративное управление и реструктуризация', 'Нужно ли менять полномочия, историю решений, функции компаний или юридическую структуру после переезда.']
    ],
    formatLabel: 'КАК НАЧАТЬ',
    formatTitle: 'Формат зависит от стадии переезда',
    formats: [
      ['До переезда — диагностический разбор', 'Экспресс-проверка помогает собрать факты, увидеть связанные направления и определить, что необходимо подтвердить до изменения резидентства или управления.', '/ru/formaty-raboty/ekspress-proverka-riskov'],
      ['Сложная или уже изменившаяся структура — системный аудит', 'Стратегический структурный аудит нужен, если переезд уже повлиял на управление, банки, владение или несколько компаний и требуется согласованный план исправлений.', '/ru/formaty-raboty/strategicheskiy-strukturnyy-audit']
    ],
    outputLabel: 'ЧТО ВЫ ПОЛУЧАЕТЕ',
    outputTitle: 'Карту решений для перехода',
    outputs: [
      ['Карта фактов переезда', 'Резидентство, владение, контроль, управление, местонахождение команды и существенные денежные потоки в одной текущей картине.'],
      ['Карта взаимосвязей и рисков', 'Вопросы КИК, постоянного представительства, банков, корпоративного управления, выплат собственнику и возможной реструктуризации.'],
      ['Варианты структуры и последовательность', 'Приоритетный порядок решений и внедрения вместо набора несвязанных локальных исправлений.'],
      ['Задание профильным специалистам', 'Собранные факты и конкретные вопросы для квалифицированных налоговых и юридических специалистов соответствующих юрисдикций.']
    ],
    relatedLabel: 'СВЯЗАННАЯ ЭКСПЕРТИЗА',
    relatedTitle: 'Технические направления, которые стоят за маршрутом переезда',
    related: [
      ['Налоговое резидентство и КИК', '/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik'],
      ['Структурирование группы', '/ru/ekspertiza/strukturirovanie-gruppy'],
      ['Постоянное представительство и международные команды', '/ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy'],
      ['Банковская готовность', '/ru/ekspertiza/bankovskaya-gotovnost'],
      ['Корпоративное присутствие и управление', '/ru/ekspertiza/substance-i-governance'],
      ['Стратегический структурный аудит', '/ru/formaty-raboty/strategicheskiy-strukturnyy-audit']
    ],
    perimeter: 'LEXONYX собирает и анализирует факты, структуру и взаимосвязи, связанные с переездом. Правовые и налоговые выводы по конкретной иностранной юрисдикции предоставляет или подтверждает квалифицированный профильный специалист соответствующей страны.',
    ctaLabel: 'ПЛАНИРУЕТЕ ПЕРЕЕЗД ИЛИ УЖЕ ЖИВЁТЕ В НОВОЙ СТРАНЕ?',
    ctaTitle: 'Проверьте структуру до того, как отдельные вопросы превратятся в отдельные исправления',
    ctaBody: 'Опишите текущую структуру владения, страны, где живут собственник и директора, где принимаются решения и что стало причиной проверки. Мы определим минимально необходимую точку входа.',
    langLinks: {
      ru: '/ru/pereezd-sobstvennika-i-biznesa',
      en: '/en/founder-mobility-business-relocation',
      uk: '/uk/pereyizd-vlasnyka-i-biznesu'
    },
    breadcrumbHome: 'Главная',
    breadcrumbCurrent: 'Переезд собственника и бизнеса'
  },
  uk: {
    base: 'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
    out: 'uk/pereyizd-vlasnyka-i-biznesu.html',
    clean: '/uk/pereyizd-vlasnyka-i-biznesu',
    title: 'Переїзд власника та бізнесу — LEXONYX',
    description: 'Комплексний аналіз переїзду власника: особисте й корпоративне резидентство, управління, КІК, постійне представництво, банки, капітал, корпоративне управління та реструктуризація.',
    label: 'ПЕРЕЇЗД ВЛАСНИКА',
    h1: 'Переїзд власника та бізнесу',
    hero: 'Коли власник, засновник або директор переїжджає до іншої країни, разом із ним може змінитися і фактична модель управління бізнесом. Ми розглядаємо особисті та корпоративні наслідки як один транскордонний перехід — до переїзду, під час реструктуризації або після того, як питання вже виникли.',
    primary: 'Запросити розбір переїзду',
    secondary: 'Що ми перевіряємо',
    whyLabel: 'ЧОМУ ЦЕ ПИТАННЯ БІЗНЕСУ',
    whyTitle: 'Особистий переїзд може змінити фактичну модель усієї групи',
    whyIntro: 'Переїзд не зводиться до особистого податкового резидентства. Одночасно можуть змінитися місце ухвалення рішень, управління компаніями, банківська картина та сама логіка структури.',
    whyCards: [
      ['Змінюється становище власника', 'Податкове резидентство, КІК, винагороду та розподіл прибутку потрібно зіставити з новими фактичними обставинами.'],
      ['Управління може переїхати разом із власником', 'Якщо стратегічні рішення, повноваження та контроль фактично переміщуються до іншої країни, виникають питання резидентства компаній і постійного представництва.'],
      ['Банки бачать нову фактичну картину', 'Банківські перевірки, автоматичний обмін інформацією, походження коштів і капіталу, управління та документи мають відповідати реальній роботі бізнесу.']
    ],
    reviewLabel: 'ЩО МИ ПЕРЕВІРЯЄМО',
    reviewTitle: 'Єдина карта переїзду за пов’язаними напрямами',
    reviewIntro: 'Спочатку збираємо спільну фактичну модель переходу, а потім визначаємо, які висновки мають бути підтверджені профільними фахівцями конкретних юрисдикцій.',
    reviewCards: [
      ['Особисте резидентство та КІК', 'Де живе власник, що він контролює, як реалізується володіння та які факти потребують податкового аналізу у відповідних країнах.'],
      ['Управління та резидентство компаній', 'Де ухвалюються стратегічні рішення, хто контролює рахунки й договори та чи відповідає фактичне управління корпоративній структурі.'],
      ['Постійне представництво та команда', 'Де працюють директори, працівники й підрядники, які повноваження вони мають і чи змінює переїзд ризики присутності.'],
      ['Дивіденди, винагорода та податкові угоди', 'Як виплати власнику й транскордонні потоки пов’язані з угодами про уникнення подвійного оподаткування, податком у джерела та питаннями фактичного отримувача доходу.'],
      ['Банки та походження капіталу', 'Як нове місце проживання впливає на банківські пояснення, рахунки, володіння та підтвердження походження коштів і капіталу.'],
      ['Корпоративне управління та реструктуризація', 'Чи потрібно змінювати повноваження, історію рішень, функції компаній або юридичну структуру після переїзду.']
    ],
    formatLabel: 'ЯК ПОЧАТИ',
    formatTitle: 'Формат залежить від стадії переїзду',
    formats: [
      ['До переїзду — діагностичний розбір', 'Експрес-перевірка допомагає зібрати факти, побачити пов’язані напрями та визначити, що необхідно підтвердити до зміни резидентства або управління.', '/uk/formaty-roboty/ekspres-perevirka-ryzykiv'],
      ['Складна або вже змінена структура — системний аудит', 'Стратегічний структурний аудит потрібен, якщо переїзд уже вплинув на управління, банки, володіння або кілька компаній і потрібен узгоджений план виправлень.', '/uk/formaty-roboty/strategichnyy-strukturnyy-audyt']
    ],
    outputLabel: 'ЩО ВИ ОТРИМУЄТЕ',
    outputTitle: 'Карту рішень для переходу',
    outputs: [
      ['Карта фактів переїзду', 'Резидентство, володіння, контроль, управління, місцезнаходження команди та істотні грошові потоки в одній поточній картині.'],
      ['Карта взаємозв’язків і ризиків', 'Питання КІК, постійного представництва, банків, корпоративного управління, виплат власнику та можливої реструктуризації.'],
      ['Варіанти структури та послідовність', 'Пріоритетний порядок рішень і впровадження замість набору неузгоджених локальних виправлень.'],
      ['Завдання профільним фахівцям', 'Зібрані факти та конкретні питання для кваліфікованих податкових і юридичних фахівців відповідних юрисдикцій.']
    ],
    relatedLabel: 'ПОВ’ЯЗАНА ЕКСПЕРТИЗА',
    relatedTitle: 'Технічні напрями, що стоять за маршрутом переїзду',
    related: [
      ['Податкове резидентство та КІК', '/uk/ekspertyza/podatkove-rezydentstvo-ta-kik'],
      ['Структурування групи', '/uk/ekspertyza/strukturuvannya-grupy'],
      ['Постійне представництво та міжнародні команди', '/uk/ekspertyza/pe-ryzyk-ta-mizhnarodni-komandy'],
      ['Банківська готовність', '/uk/ekspertyza/bankivska-gotovnist'],
      ['Корпоративна присутність та управління', '/uk/ekspertyza/substance-ta-governance'],
      ['Стратегічний структурний аудит', '/uk/formaty-roboty/strategichnyy-strukturnyy-audyt']
    ],
    perimeter: 'LEXONYX збирає й аналізує факти, структуру та взаємозв’язки, пов’язані з переїздом. Правові та податкові висновки щодо конкретної іноземної юрисдикції надає або підтверджує кваліфікований профільний фахівець відповідної країни.',
    ctaLabel: 'ПЛАНУЄТЕ ПЕРЕЇЗД АБО ВЖЕ ЖИВЕТЕ В НОВІЙ КРАЇНІ?',
    ctaTitle: 'Перевірте структуру до того, як окремі питання перетворяться на окремі виправлення',
    ctaBody: 'Опишіть поточну структуру володіння, країни, де живуть власник і директори, де ухвалюються рішення та що стало причиною перевірки. Ми визначимо мінімально необхідну точку входу.',
    langLinks: {
      ru: '/ru/pereezd-sobstvennika-i-biznesa',
      en: '/en/founder-mobility-business-relocation',
      uk: '/uk/pereyizd-vlasnyka-i-biznesu'
    },
    breadcrumbHome: 'Головна',
    breadcrumbCurrent: 'Переїзд власника та бізнесу'
  }
};

function esc(v) { return String(v).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function replaceMeta(html, name, value) {
  const rx = new RegExp(`<meta\\b(?=[^>]*name=["']${name}["'])[^>]*>`, 'i');
  return html.replace(rx, `<meta name="${name}" content="${esc(value)}">`);
}
function replaceProperty(html, prop, value) {
  const rx = new RegExp(`<meta\\b(?=[^>]*property=["']${prop.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}["'])[^>]*>`, 'i');
  return rx.test(html) ? html.replace(rx, `<meta property="${prop}" content="${esc(value)}">`) : html;
}
function cardGrid(cards) {
  return cards.map(([h,b]) => `          <article class="audience-card"><h3>${esc(h)}</h3><p>${esc(b)}</p></article>`).join('\n');
}
function relatedGrid(items) {
  return items.map(([h,href]) => `          <a class="related-link-card" href="${href}"><h3>${esc(h)}</h3><span class="insight-link">→</span></a>`).join('\n');
}
function formatGrid(items) {
  return items.map(([h,b,href]) => `          <a class="format-card-home" href="${href}"><h3>${esc(h)}</h3><p>${esc(b)}</p></a>`).join('\n');
}
function mainHtml(c) {
  return `<main id="main-content">
    <section class="hero-base hero-home hero-bg-dark--index">
      <div class="hero-background"><div class="hero-glow"></div><div class="ambient-light ambient-light-1"></div><div class="ambient-light ambient-light-2"></div></div>
      <div class="container hero-container"><div class="hero-content-wrapper">
        <div class="hero-label">${esc(c.label)}</div>
        <h1 class="hero-title">${esc(c.h1)}</h1>
        <p class="hero-subtitle">${esc(c.hero)}</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="${c.langLinks.en.startsWith('/en/') ? '/en/request-review' : c.langLinks.ru.startsWith('/ru/') ? '/ru/zaprosit-razbor' : '/uk/zapytaty-rozbir'}">${esc(c.primary)}</a>
          <a class="btn btn-secondary btn-lg" href="#what-we-review">${esc(c.secondary)}</a>
        </div>
      </div></div>
    </section>

    <section class="section section-light" data-reveal>
      <div class="container">
        <div class="section-header-centered"><div class="section-label">${esc(c.whyLabel)}</div><h2 class="section-title-main">${esc(c.whyTitle)}</h2><p class="section-subtitle">${esc(c.whyIntro)}</p></div>
        <div class="situation-grid" data-reveal-stagger>${cardGrid(c.whyCards)}</div>
      </div>
    </section>

    <section class="section section-dark" id="what-we-review" data-reveal>
      <div class="container">
        <div class="section-header-centered"><div class="section-label">${esc(c.reviewLabel)}</div><h2 class="section-title-main">${esc(c.reviewTitle)}</h2><p class="section-subtitle">${esc(c.reviewIntro)}</p></div>
        <div class="situation-grid" data-reveal-stagger>${cardGrid(c.reviewCards)}</div>
      </div>
    </section>

    <section class="section section-light" data-reveal>
      <div class="container">
        <div class="section-header-centered"><div class="section-label">${esc(c.formatLabel)}</div><h2 class="section-title-main">${esc(c.formatTitle)}</h2></div>
        <div class="formats-grid-home" data-reveal-stagger>${formatGrid(c.formats)}</div>
      </div>
    </section>

    <section class="section section-dark" data-reveal>
      <div class="container">
        <div class="section-header-centered"><div class="section-label">${esc(c.outputLabel)}</div><h2 class="section-title-main">${esc(c.outputTitle)}</h2></div>
        <div class="situation-grid" data-reveal-stagger>${cardGrid(c.outputs)}</div>
        <p class="lx-cases-disclaimer" style="margin-top:28px">${esc(c.perimeter)}</p>
      </div>
    </section>

    <section class="section section-light" data-reveal>
      <div class="container">
        <div class="section-header-centered"><div class="section-label">${esc(c.relatedLabel)}</div><h2 class="section-title-main">${esc(c.relatedTitle)}</h2></div>
        <div class="related-links-grid" data-reveal-stagger>${relatedGrid(c.related)}</div>
      </div>
    </section>

    <section class="section home-cta">
      <div class="container container-narrow"><div class="home-cta-inner" data-reveal>
        <div class="section-label">${esc(c.ctaLabel)}</div><h2 class="section-title-main">${esc(c.ctaTitle)}</h2><p class="section-subtitle">${esc(c.ctaBody)}</p>
        <div class="hero-actions" style="justify-content:center; margin-bottom:0"><a class="btn btn-primary btn-lg" href="${c.langLinks.en.startsWith('/en/') ? '/en/request-review' : c.langLinks.ru.startsWith('/ru/') ? '/ru/zaprosit-razbor' : '/uk/zapytaty-rozbir'}">${esc(c.primary)}</a></div>
      </div></div>
    </section>
  </main>`;
}

function requestPath(lang) {
  return lang === 'en' ? '/en/request-review' : lang === 'ru' ? '/ru/zaprosit-razbor' : '/uk/zapytaty-rozbir';
}

function buildPage(lang, c) {
  const basePath = path.join(ROOT, c.base);
  let html = fs.readFileSync(basePath, 'utf8');
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(c.title)}</title>`);
  html = replaceMeta(html, 'description', c.description);
  html = replaceProperty(html, 'og:url', BASE + c.clean);
  html = replaceProperty(html, 'og:title', c.title);
  html = replaceProperty(html, 'og:description', c.description);
  html = replaceMeta(html, 'twitter:title', c.title);
  html = replaceMeta(html, 'twitter:description', c.description);
  html = html.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${BASE}${c.clean}">`);
  html = html.replace(/^\s*<link\b[^>]*rel=["']alternate["'][^>]*>\s*$/gmi, '');
  html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>\s*/gi, '');

  const alternates = `\n  <link rel="alternate" hreflang="ru" href="${BASE}${c.langLinks.ru}" />\n  <link rel="alternate" hreflang="en" href="${BASE}${c.langLinks.en}" />\n  <link rel="alternate" hreflang="uk" href="${BASE}${c.langLinks.uk}" />\n  <link rel="alternate" hreflang="x-default" href="${BASE}${c.langLinks.en}" />`;
  const ld = `\n  <script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org','@type':'WebPage',name:c.h1,url:BASE+c.clean,inLanguage:lang,
    description:c.description,isPartOf:{'@type':'WebSite',url:BASE}
  })}</script>\n  <script type="application/ld+json">${JSON.stringify({
    '@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[
      {'@type':'ListItem',position:1,name:c.breadcrumbHome,item:BASE + (lang === 'en' ? '/en/' : lang === 'ru' ? '/ru/' : '/uk/')},
      {'@type':'ListItem',position:2,name:c.breadcrumbCurrent,item:BASE+c.clean}
    ]
  })}</script>${alternates}`;
  html = html.replace('</head>', `${ld}\n</head>`);

  html = html.replace(/<a\b[^>]*class=["'][^"']*lang-option[^"']*["'][^>]*>/gi, tag => {
    const m = tag.match(/lang=["'](ru|en|uk)["']/i);
    if (!m) return tag;
    const href = c.langLinks[m[1].toLowerCase()];
    return /href=/i.test(tag) ? tag.replace(/href=["'][^"']*["']/i, `href="${href}"`) : tag.replace(/>$/, ` href="${href}">`);
  });
  html = html.replace(/\saria-current=["']page["']/gi, '');

  let main = mainHtml(c);
  main = main.replaceAll(c.langLinks.en.startsWith('/en/') ? '/en/request-review' : c.langLinks.ru.startsWith('/ru/') ? '/ru/zaprosit-razbor' : '/uk/zapytaty-rozbir', requestPath(lang));
  html = html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, main);
  fs.writeFileSync(path.join(ROOT, c.out), html, 'utf8');
}

function patchJourney(lang, c) {
  const file = path.join(ROOT, `${lang}/index.html`);
  let html = fs.readFileSync(file, 'utf8');
  const marker = 'data-funnel-journey="founder-owner-relocation"';
  const pos = html.indexOf(marker);
  if (pos < 0) throw new Error(`${lang}: founder-owner-relocation journey marker missing`);
  const start = html.lastIndexOf('<article', pos);
  const end = html.indexOf('</article>', pos);
  if (start < 0 || end < 0) throw new Error(`${lang}: founder journey card bounds missing`);
  const card = html.slice(start, end + 10);
  const copy = lang === 'en'
    ? {title:'Founder Mobility & Business Relocation', body:'A founder, owner or director is moving country and the consequences extend beyond personal residence to management, company residence, CFC/PE exposure, banking, governance and restructuring.', link:'Explore the relocation route →'}
    : lang === 'ru'
      ? {title:'Переезд собственника и бизнеса', body:'Собственник, основатель или директор переезжает в другую страну, а вместе с этим меняются вопросы управления группой, налогового резидентства, КИК, постоянного представительства, банковской логики и возможной реструктуризации.', link:'Переезд собственника и бизнеса →'}
      : {title:'Переїзд власника та бізнесу', body:'Власник, засновник або директор переїжджає до іншої країни, а разом із цим змінюються питання управління групою, податкового резидентства, КІК, постійного представництва, банківської логіки та можливої реструктуризації.', link:'Переїзд власника та бізнесу →'};
  let next = card.replace(/<h3>[\s\S]*?<\/h3>/i, `<h3>${esc(copy.title)}</h3>`);
  next = next.replace(/<p>[\s\S]*?<\/p>/i, `<p>${esc(copy.body)}</p>`);
  next = next.replace(/<a\b([^>]*)href=["'][^"']+["']([^>]*)>[\s\S]*?<\/a>/i, `<a$1href="${c.clean}"$2>${esc(copy.link)}</a>`);
  html = html.slice(0, start) + next + html.slice(end + 10);
  fs.writeFileSync(file, html, 'utf8');
}

function patchSearch(lang, c) {
  const files = {en:'en/scripts/search-index-en.js',ru:'ru/scripts/search-index-ru.js',uk:'uk/scripts/search-index-uk.js'};
  const titles = {en:'Founder Mobility & Business Relocation',ru:'Переезд собственника и бизнеса',uk:'Переїзд власника та бізнесу'};
  const cats = {en:'Client Routes',ru:'Клиентские ситуации',uk:'Клієнтські ситуації'};
  const p = path.join(ROOT, files[lang]);
  let js = fs.readFileSync(p, 'utf8');
  if (!js.includes(c.clean)) {
    const entry = `  ${JSON.stringify({title:titles[lang],url:c.clean,category:cats[lang]})},\n`;
    js = js.replace(/\n\];\s*$/, `\n${entry}];\n`);
    fs.writeFileSync(p, js, 'utf8');
  }
}

for (const [lang,c] of Object.entries(ROUTES)) {
  buildPage(lang,c);
  patchJourney(lang,c);
  patchSearch(lang,c);
}

const sitemapPath = path.join(ROOT, 'sitemap.xml');
let sitemap = fs.readFileSync(sitemapPath, 'utf8');
for (const c of Object.values(ROUTES)) {
  const loc = `  <url><loc>${BASE}${c.clean}</loc></url>`;
  if (!sitemap.includes(loc)) sitemap = sitemap.replace('</urlset>', `${loc}\n</urlset>`);
}
fs.writeFileSync(sitemapPath, sitemap, 'utf8');

const redirectsPath = path.join(ROOT, '_redirects');
let redirects = fs.readFileSync(redirectsPath, 'utf8');
redirects = redirects.replace(/# BEGIN FOUNDER RELOCATION ROUTE[\s\S]*?# END FOUNDER RELOCATION ROUTE\n?/g, '');
const block = ['# BEGIN FOUNDER RELOCATION ROUTE'];
for (const c of Object.values(ROUTES)) block.push(`/${c.out}  ${c.clean}  301!`);
block.push('# END FOUNDER RELOCATION ROUTE','');
redirects += `\n${block.join('\n')}`;
fs.writeFileSync(redirectsPath, redirects, 'utf8');

console.log('[LEXONYX relocation route] PASS — 3 commercial route pages, homepage journeys, search indexes, sitemap and redirects updated');
