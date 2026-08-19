import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function meta(html, selector, value) {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(<meta\\b[^>]*${esc}[^>]*\\bcontent=["'])([^"']*)(["'][^>]*>)`, 'i');
  return html.replace(re, `$1${value}$3`);
}

function setTitle(html, value) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${value}</title>`);
}

function setMain(html, value) {
  if (!/<main\b[\s\S]*?<\/main>/i.test(html)) throw new Error('main element not found');
  return html.replace(/<main\b[\s\S]*?<\/main>/i, value);
}

function restoreUkLabel(html) {
  return html.replace(/(<a\b[^>]*\blang=["']uk["'][^>]*>)[^<]*(<\/a>)/gi, '$1UK$2');
}

const pages = {
  'ru/index.html': {
    title: 'LEXONYX — Стратегическое структурирование международного бизнеса',
    description: 'LEXONYX проектирует международные структуры бизнеса: архитектура группы, налоговая модель, НДС, риск постоянного представительства, корпоративное управление, банковская и регуляторная готовность.',
    ogTitle: 'LEXONYX — Стратегическое структурирование международного бизнеса',
    ogDescription: 'Архитектура международной группы, налоговая модель, корпоративное управление, банковская и регуляторная готовность — как единая система.',
    twitterTitle: 'LEXONYX — Стратегическое структурирование международного бизнеса',
    twitterDescription: 'Проектируем международные структуры с учётом налоговой, банковской, инвестиционной и регуляторной проверки.',
    main: `<main id="main-content">

    <section class="hero-base hero-home hero-bg-dark--index">
      <div class="hero-background"><div class="hero-glow"></div><div class="ambient-light ambient-light-1"></div><div class="ambient-light ambient-light-2"></div></div>
      <div class="container hero-container"><div class="hero-content-wrapper">
        <div class="hero-label">LEXONYX</div>
        <h1 class="hero-title">Стратегическое структурирование международного бизнеса</h1>
        <p class="hero-subtitle">Проектируем международные структуры с учётом налоговой, банковской, инвестиционной и регуляторной проверки.</p>
        <p class="hero-subtitle">Связываем в одной модели структуру владения, роли и функции компаний, международные налоговые вопросы, НДС, риск постоянного представительства, корпоративное управление, банковские потоки и регуляторные требования — от первой зарубежной компании до сложной группы.</p>
        <div class="hero-actions"><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить разбор</a><a href="/ru/ekspertiza/index.html" class="btn btn-secondary btn-lg">Смотреть экспертизу</a></div>
        <div class="hero-meta-line"><span>Архитектура группы</span><span>·</span><span>Международное налогообложение и НДС</span><span>·</span><span>Риск постоянного представительства и международные команды</span><span>·</span><span>Банковская и регуляторная готовность</span></div>
      </div></div>
    </section>

    <section class="section section-light home-directions" data-reveal><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ЧЕТЫРЕ НАПРАВЛЕНИЯ</div><h2 class="section-title-main">Что мы проектируем</h2><p class="section-subtitle">Не отдельную компанию или юрисдикцию, а согласованную международную модель: роли компаний, распределение прибыли, управление, денежные потоки и готовность к внешней проверке.</p></div>
      <div class="home-definition-grid" data-reveal-stagger>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="definition-card" style="text-decoration:none"><h3>Архитектура международной группы</h3><p>Холдинговые, операционные, сервисные и финансовые компании: структура владения, роли, функции, активы, риски и внутригрупповые потоки.</p></a>
        <a href="/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html" class="definition-card" style="text-decoration:none"><h3>Международная налоговая модель</h3><p>Налоговое резидентство и КИК, соглашения об избежании двойного налогообложения, налог у источника, фактическое право на доход, трансфертное ценообразование и риск постоянного представительства.</p></a>
        <a href="/ru/ekspertiza/vat-i-transgranichnye-modeli.html" class="definition-card" style="text-decoration:none"><h3>НДС, трансграничные операции и регулирование</h3><p>НДС, электронная торговля и маркетплейсы, международные команды, платёжная инфраструктура, лицензирование и допустимый операционный контур.</p></a>
        <a href="/ru/ekspertiza/substance-i-governance.html" class="definition-card" style="text-decoration:none"><h3>Фактическое присутствие, управление и банковская готовность</h3><p>Где принимаются решения, кто выполняет ключевые функции, как распределены полномочия и насколько структура понятна банку, инвестору и налоговому органу.</p></a>
      </div>
    </div></section>

    <section class="section section-dark home-flagship"><div class="container container-narrow">
      <div class="section-label">СИСТЕМА ЭКСПЕРТИЗЫ</div><h2 class="section-title-main">Структурирование группы — центр всей архитектуры</h2>
      <p class="section-subtitle">Налоги, трансфертное ценообразование, НДС, риск постоянного представительства, банки и регулирование нельзя анализировать изолированно. Каждый элемент должен соответствовать реальному бизнесу, людям, функциям и денежным потокам.</p>
      <div class="schema-panel" data-reveal-stagger>
        <div class="schema-line">Структура группы → владение, роли компаний, функции и денежные потоки</div>
        <div class="schema-line">Налоговое резидентство и КИК → контроль, управление и налоговая позиция собственника</div>
        <div class="schema-line">СИДН и налог у источника → право на льготы, фактическое право на доход и правила противодействия злоупотреблениям</div>
        <div class="schema-line">Трансфертное ценообразование → распределение прибыли между функциями, активами и рисками</div>
        <div class="schema-line">НДС → продажи, услуги, маркетплейсы, склады и исполнение операций</div>
        <div class="schema-line">Риск постоянного представительства → люди, полномочия, договоры и фактическое присутствие</div>
        <div class="schema-line">Банковская готовность → логика KYC/AML, происхождение средств и описание бизнес-модели</div>
        <div class="schema-line">Регуляторные требования → допустимость модели и необходимость лицензирования</div>
        <div class="schema-line">Фактическое присутствие и корпоративное управление → соответствие юридической структуры реальному управлению</div>
      </div>
      <div class="lx-manifesto-wrap" data-reveal><span class="lx-rule"></span><p class="lx-manifesto">Мы не продаём юрисдикции — мы выстраиваем систему.</p></div>
      <div class="hero-actions home-flagship-actions"><a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="btn btn-primary btn-lg">Изучить ключевую экспертизу</a></div>
    </div></section>

    <section class="section section-light home-structure-types" data-reveal><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ТИПЫ СТРУКТУР</div><h2 class="section-title-main">Модели, с которыми мы работаем</h2><p class="section-subtitle">Выбор модели начинается с бизнеса, функций и потоков — а не с готовой «схемы по юрисдикции».</p></div>
      <div class="home-definition-grid" data-reveal-stagger>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="definition-card" style="text-decoration:none"><h3>Холдинговая структура</h3><p>Собственник, холдинговая компания и операционные компании: владение, инвестиции, дивиденды, сделки и управление группой.</p></a>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="definition-card" style="text-decoration:none"><h3>Сервисный или сбытовой центр</h3><p>Распределение функций между основной, сервисной и сбытовой компаниями: договоры, ценообразование и риск постоянного представительства.</p></a>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="definition-card" style="text-decoration:none"><h3>Финансовая компания и казначейство</h3><p>Внутригрупповые займы, управление денежными средствами, процентные потоки, налог у источника и контроль финансовых рисков.</p></a>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="definition-card" style="text-decoration:none"><h3>Интеллектуальная собственность и нематериальные активы</h3><p>Разработка, владение правами, лицензирование и распределение дохода с учётом функций DEMPE и фактической роли компаний.</p></a>
        <a href="/ru/ekspertiza/vat-i-transgranichnye-modeli.html" class="definition-card" style="text-decoration:none"><h3>НДС и электронная торговля</h3><p>Продажи, OSS/IOSS, маркетплейсы, склады, фулфилмент, выставление счетов и риск постоянного учреждения для целей НДС.</p></a>
        <a href="/ru/ekspertiza/chastnyy-kapital-i-family-office.html" class="definition-card" style="text-decoration:none"><h3>Структура частного капитала</h3><p>Владение активами, инвестиционная архитектура, корпоративное управление и преемственность семейного капитала.</p></a>
      </div>
    </div></section>

    <section class="section section-dark home-situations" data-reveal><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">С ЧЕМ ОБРАЩАЮТСЯ</div><h2 class="section-title-main">Когда нужна архитектура, а не отдельная консультация</h2><p class="section-subtitle">Работа начинается как при проектировании новой модели, так и при проверке существующей структуры — до запуска потоков, сделки, роста или внешней проверки.</p></div>
      <div class="situation-grid" data-reveal-stagger>
        <div class="audience-card"><h3>Выход в новую страну</h3><p>Нужно определить роль новой компании, налоговые последствия, НДС, команду, договорную модель и банковские потоки до начала операций.</p></div>
        <div class="audience-card"><h3>Создание холдинговой группы</h3><p>Нужно связать холдинговую и операционные компании с инвестиционной логикой, СИДН, налогом у источника, фактическим присутствием и корпоративным управлением.</p></div>
        <div class="audience-card"><h3>Переезд собственника</h3><p>Меняется личное налоговое резидентство, а управление бизнесом, команда, интеллектуальная собственность или активы остаются в других странах.</p></div>
        <div class="audience-card"><h3>Международная команда</h3><p>Сотрудники, директора или команда продаж работают из разных стран и могут создавать налоговые, кадровые и управленческие риски.</p></div>
        <div class="audience-card"><h3>Банк требует объяснений</h3><p>Запросы по структуре владения, UBO, происхождению средств, контрагентам или бизнес-модели невозможно закрыть одним документом.</p></div>
        <div class="audience-card"><h3>Структура без единой логики</h3><p>Несколько компаний, счетов, договоров и консультантов существуют отдельно, но не складываются в объяснимую модель.</p></div>
        <div class="audience-card"><h3>Инвестор, сделка или комплексная проверка</h3><p>Нужно заранее проверить владение, интеллектуальную собственность, внутригрупповые операции, налоги, фактическое присутствие и документы.</p></div>
        <div class="audience-card"><h3>Интеллектуальная собственность или внутригрупповое финансирование</h3><p>Появляются роялти, займы, управленческие вознаграждения или иные потоки, которые требуют анализа ценообразования, налога у источника и фактического права на доход.</p></div>
      </div>
    </div></section>

    <section class="section section-light home-audience"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">С КЕМ МЫ РАБОТАЕМ</div><h2 class="section-title-main">От первого выхода на международный рынок до сложных групп</h2><p class="section-subtitle">Архитектура нужна до того, как рост создаст конфликт между налогами, НДС, фактическим присутствием, банками и регулированием.</p></div>
      <div class="audience-grid" data-reveal-stagger>
        <article class="audience-card"><h3>Первая международная компания</h3><p>Когда нужен первый системный шаг, а не набор случайных регистраций.</p></article>
        <article class="audience-card"><h3>Растущий трансграничный бизнес</h3><p>Когда появляются новые рынки, платёжные потоки и первые структурные риски.</p></article>
        <article class="audience-card"><h3>Группы в нескольких юрисдикциях</h3><p>Когда уже есть холдинговые, операционные и сервисные компании, но нужна единая логика модели.</p></article>
        <article class="audience-card"><h3>Проекты под банк, инвестора или лицензию</h3><p>Когда структура должна выдерживать внешнюю проверку и быть понятной третьим сторонам.</p></article>
      </div>
    </div></section>

    <section class="section section-dark home-deliverables" data-reveal><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">РЕЗУЛЬТАТ РАБОТЫ</div><h2 class="section-title-main">Не общие рекомендации, а рабочая карта структуры</h2><p class="section-subtitle">Состав результата зависит от задачи, но каждый проект переводится в понятную модель, документы и последовательность внедрения.</p></div>
      <div class="situation-grid" data-reveal-stagger>
        <div class="audience-card"><h3>Карта структуры</h3><p>Структура владения, роли компаний, функции, активы, риски и взаимосвязи внутри группы.</p></div>
        <div class="audience-card"><h3>Карта денежных потоков</h3><p>Выручка, услуги, дивиденды, проценты, роялти и другие внутригрупповые платежи.</p></div>
        <div class="audience-card"><h3>Матрица рисков</h3><p>Налоговое резидентство, КИК, СИДН, налог у источника, трансфертное ценообразование, НДС, фактическое присутствие, банковские и регуляторные риски.</p></div>
        <div class="audience-card"><h3>Варианты целевой модели</h3><p>Консервативный и сбалансированный варианты с условиями, ограничениями и ключевыми компромиссами.</p></div>
        <div class="audience-card"><h3>Пакет по управлению и банковской готовности</h3><p>Матрица полномочий, документирование решений, описание бизнес-модели и перечень доказательств происхождения средств и капитала.</p></div>
        <div class="audience-card"><h3>План внедрения</h3><p>Последовательность шагов, роли профильных специалистов и пакет документов для реализации модели.</p></div>
      </div>
    </div></section>

    <section class="section section-light home-timing" data-reveal><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">КОГДА ПЕРЕСМАТРИВАТЬ СТРУКТУРУ</div><h2 class="section-title-main">Бизнес меняется быстрее, чем его юридическая архитектура</h2><p class="section-subtitle">Даже изначально корректная структура становится уязвимой, когда меняются собственники, команда, рынки, функции компаний или движение денег.</p></div>
      <div class="situation-grid" data-reveal-stagger>
        <div class="audience-card"><h3>Изменилось налоговое резидентство</h3><p>Собственник, директор или ключевой руководитель переехал и продолжает управлять группой из новой страны.</p></div>
        <div class="audience-card"><h3>Появилась новая страна операций</h3><p>Добавились клиенты, сотрудники, склад, подрядчики, платёжный провайдер или локальная компания.</p></div>
        <div class="audience-card"><h3>Изменились функции компаний</h3><p>Компания, созданная как сервисная, фактически управляет продажами, интеллектуальной собственностью, финансированием или ключевыми рисками.</p></div>
        <div class="audience-card"><h3>Появились внутригрупповые платежи</h3><p>Дивиденды, проценты, роялти и управленческие вознаграждения требуют анализа СИДН, налога у источника и трансфертного ценообразования.</p></div>
        <div class="audience-card"><h3>Планируется инвестиция или продажа</h3><p>Инвестор или покупатель будет проверять структуру владения, интеллектуальную собственность, договоры, налоги и историю управленческих решений.</p></div>
        <div class="audience-card"><h3>Бизнес приближается к регулированию</h3><p>Новая услуга, продукт или платёжная модель может изменить требования к лицензированию и фактическому присутствию.</p></div>
      </div>
    </div></section>

    <section class="section section-dark home-formats"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ФОРМАТЫ РАБОТЫ</div><h2 class="section-title-main">От первичной диагностики до внешней международной юридической функции</h2><p class="section-subtitle">Формат определяется глубиной задачи, стадией проекта и тем, требуется ли разовый анализ, внедрение или постоянная координация международной структуры.</p></div>
      <div class="formats-grid-home" data-reveal-stagger>
        <a href="/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html" class="format-card-home"><h3>Стратегический структурный аудит</h3><p>Полный разбор модели, карта структуры, матрица рисков и варианты целевой архитектуры.</p></a>
        <a href="/ru/formaty-raboty/ekspress-proverka-riskov.html" class="format-card-home"><h3>Экспресс-проверка рисков</h3><p>Быстрая диагностика критичных расхождений по структуре, налогам, НДС, команде и банковской логике.</p></a>
        <a href="/ru/formaty-raboty/soprovozhdenie-i-advisory.html" class="format-card-home"><h3>Внедрение и сопровождение</h3><p>Координация местных юристов, налоговых специалистов и корпоративных провайдеров при реализации модели.</p></a>
        <a href="/ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html" class="format-card-home"><h3>Внешняя международная юридическая функция</h3><p>Постоянное сопровождение структуры и трансграничных вопросов без создания отдельной внутренней юридической функции.</p></a>
      </div>
    </div></section>

    <section class="section section-light home-founder" data-reveal><div class="container"><div class="founder-wrap">
      <div><img src="/images/founder-liudmyla.jpg" alt="Liudmyla Miroshnychenko, LEXONYX" class="founder-portrait" width="200" height="240"></div>
      <div class="founder-body"><div class="section-label">ПРАКТИКА ПОД РУКОВОДСТВОМ</div><h2 class="founder-name" style="margin-bottom:6px">Liudmyla Miroshnychenko</h2><p class="founder-role">Основатель · ведущий консультант</p><p>Адвокат Украины с 2004 года, член Адвокатской палаты Мюнхена (§ 206 BRAO). Основные направления практики — международное структурирование, банковская готовность и подтверждение происхождения средств и капитала для бизнеса и собственников в ЕС, Великобритании и ОАЭ.</p><p>Вопросы права и налогообложения других юрисдикций ведём совместно с квалифицированными профильными специалистами соответствующих стран под единой координацией LEXONYX.</p><a href="/ru/o-praktike/kto-my.html" class="btn btn-secondary" style="margin-top:24px">О практике подробнее</a></div>
    </div></div></section>

    <section class="section section-dark home-cases"><div class="container">
      <div class="section-header-centered" data-reveal><span class="lx-rule"></span><div class="section-label">ТИПОВЫЕ СИТУАЦИИ</div><h2 class="section-title-main">Как выглядит работа со структурой на практике</h2></div>
      <div class="lx-cases-grid" data-reveal-stagger>
        <article class="lx-case-card"><div class="lx-case-tag">Банковская проверка</div><div class="lx-case-block"><span class="lx-case-label">Проблема</span><p>Группа из нескольких юрисдикций получала отказы при открытии счетов: банк не мог проследить логику владения и происхождение средств.</p></div><div class="lx-case-block"><span class="lx-case-label">Решение</span><p>Согласовали описание бизнес-модели, роли компаний, денежные потоки и доказательства происхождения средств и капитала.</p></div><div class="lx-case-block is-result"><span class="lx-case-label">Результат</span><p>Подготовлены карта владения и потоков, согласованное описание бизнеса и комплект документов для банковской проверки.</p></div></article>
        <article class="lx-case-card"><div class="lx-case-tag">Команда и риск постоянного представительства</div><div class="lx-case-block"><span class="lx-case-label">Проблема</span><p>Рост команды в нескольких странах создал риск постоянного представительства и вопросы по налоговому резидентству собственника.</p></div><div class="lx-case-block"><span class="lx-case-label">Решение</span><p>Сопоставили функции, полномочия и фактическое присутствие людей с корпоративной архитектурой и реальным управлением.</p></div><div class="lx-case-block is-result"><span class="lx-case-label">Результат</span><p>Подготовлены карта риска постоянного представительства, матрица полномочий и модель корпоративного управления, согласованная с фактической деятельностью.</p></div></article>
        <article class="lx-case-card"><div class="lx-case-tag">Выход на новый рынок</div><div class="lx-case-block"><span class="lx-case-label">Проблема</span><p>При выходе в ЕС типовая «схема по стране» не учитывала НДС, регуляторные требования и необходимый уровень присутствия.</p></div><div class="lx-case-block"><span class="lx-case-label">Решение</span><p>Спроектировали структуру под конкретную операционную модель: роли компаний, НДС, фактическое присутствие и допустимость операций.</p></div><div class="lx-case-block is-result"><span class="lx-case-label">Результат</span><p>Сформированы целевая карта структуры, план по НДС, регуляторный периметр и перечень вопросов для профильных налоговых и юридических специалистов.</p></div></article>
      </div>
      <p class="lx-cases-disclaimer">Реальные проекты и детали конфиденциальны. Сценарии обобщены и анонимизированы, иллюстрируют характер задач и не являются обещанием конкретного результата. Решения принимаются банками, регуляторами и налоговыми органами самостоятельно.</p>
    </div></section>

    <section class="section section-light home-insights"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ИНСАЙТЫ</div><h2 class="section-title-main">Аналитика международной структуры</h2><p class="section-subtitle">Короткие сигналы, разборы и практические инструменты для предварительной оценки модели.</p></div>
      <div class="related-links-grid" data-reveal-stagger>
        <a href="/ru/insayty/brifingi/index.html" class="related-link-card"><h3>Брифинги</h3><p>Прикладные сигналы об изменениях в налогах, НДС, банковских и регуляторных требованиях.</p><span class="insight-link">Смотреть материалы →</span></a>
        <a href="/ru/insayty/razbory/index.html" class="related-link-card"><h3>Разборы</h3><p>Подробные пояснения по архитектуре, рискам и международным моделям.</p><span class="insight-link">Изучить разборы →</span></a>
        <a href="/ru/insayty/instrumenty/index.html" class="related-link-card"><h3>Инструменты</h3><p>Чек-листы и короткие тесты для предварительной самооценки структуры.</p><span class="insight-link">Перейти к инструментам →</span></a>
        <a href="/ru/podhod/strukturnaya-model.html" class="related-link-card"><h3>Структурная модель</h3><p>Методологическая основа: как мы проектируем структуру как единую систему.</p><span class="insight-link">Изучить модель →</span></a>
      </div>
    </div></section>

    <section class="section home-cta"><div class="container container-narrow"><div class="home-cta-inner" data-reveal>
      <div class="section-label">ЧАСТНЫЙ СТРУКТУРНЫЙ РАЗБОР</div><h2 class="section-title-main">Понять, какой должна быть структура до регистрации, роста или проверки</h2><p class="section-subtitle">Опишите бизнес-модель, юрисдикции, собственников, команду и денежные потоки. Мы определим ключевые структурные вопросы, риски и подходящий формат работы.</p><div class="hero-actions" style="justify-content:center; margin-bottom:0;"><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить структурный разбор</a></div><p class="cta-meta-note">Конфиденциально · первичная квалификация запроса · формат и объём после анализа</p>
    </div></div></section>

    <section class="section section-light lexonyx-scope-note"><div class="container container-narrow"><div class="section-header-centered" data-reveal>
      <div class="section-label">КАК МЫ РАБОТАЕМ С МЕЖДУНАРОДНЫМИ ВОПРОСАМИ</div><h2 class="section-title-main">Структурный анализ, координация и подтверждение профильных специалистов</h2><p class="section-subtitle">LEXONYX проводит структурный и фактический анализ международных проектов: структуру владения, функции компаний, корпоративное управление, реальную операционную модель, банковскую готовность и внедрение. Консультации по украинскому праву оказываются непосредственно адвокатом Украины. Если проект требует заключения по праву, налогообложению или регулируемым вопросам другой юрисдикции, соответствующий вывод предоставляется или подтверждается квалифицированным специалистом этой юрисдикции и интегрируется LEXONYX в общую архитектуру проекта.</p>
    </div></div></section>

  </main>`
  },

  'ru/ekspertiza/substance-i-governance.html': {
    title: 'Фактическое присутствие и корпоративное управление — LEXONYX',
    description: 'Фактическое присутствие и корпоративное управление в международной структуре: место принятия решений, функции, риски, доказательная база и соответствие юридической модели реальной деятельности.',
    ogTitle: 'Фактическое присутствие и корпоративное управление — LEXONYX',
    ogDescription: 'Как согласовать юридическую структуру, реальное управление, функции, риски и доказательную базу международной группы.',
    twitterTitle: 'Фактическое присутствие и корпоративное управление — LEXONYX',
    twitterDescription: 'Юридическая структура должна соответствовать реальному управлению, функциям и экономической деятельности.',
    main: `<main id="main-content" class="substance-governance-page">

    <section class="section section-dark substance-hero-minimal hero-bg-dark--ekspertiza-substance-i-governance"><div class="container container-narrow">
      <nav class="breadcrumbs breadcrumbs-on-dark" aria-label="Хлебные крошки"><a href="/ru/index.html">Главная</a><span class="separator">›</span><a href="/ru/ekspertiza/index.html">Экспертиза</a><span class="separator">›</span><span class="current">Фактическое присутствие и корпоративное управление</span></nav>
      <div class="section-label">ФАКТИЧЕСКОЕ ПРИСУТСТВИЕ · КОРПОРАТИВНОЕ УПРАВЛЕНИЕ</div>
      <h1 class="page-title page-title-wide">Формальная структура должна соответствовать реальному управлению</h1>
      <p class="page-subtitle page-subtitle-wide">Где принимаются решения, кто выполняет ключевые функции и несёт риски, должно быть согласовано с юридической структурой и налоговой позицией компании.</p>
      <div class="hero-actions"><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить разбор</a><a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="btn btn-secondary btn-lg">Связь со структурой</a></div>
      <div class="hero-meta-line"><span>Управление и контроль</span><span>·</span><span>Экономическая реальность</span><span>·</span><span>Защищаемость налоговой позиции</span><span>·</span><span>Банковская готовность</span></div>
    </div></section>

    <section class="section section-light substance-core-model"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ТРИ УРОВНЯ</div><h2 class="section-title-main">Три уровня устойчивого присутствия</h2><p class="section-subtitle">Регистрация, корпоративное управление и экономическая реальность должны подтверждать друг друга. Если они расходятся, структура становится уязвимой при внешней проверке.</p></div>
      <div class="architecture-layers-grid" data-reveal-stagger>
        <article class="architecture-layer-card"><div class="layer-number">01</div><h3>Регистрация</h3><p>Юридическая оболочка и формальные корпоративные атрибуты. Сами по себе они не подтверждают место реальной деятельности и управления.</p></article>
        <article class="architecture-layer-card"><div class="layer-number">02</div><h3>Корпоративное управление</h3><p>Где и кем принимаются решения, как распределены полномочия и как управленческий процесс отражён в документах.</p></article>
        <article class="architecture-layer-card"><div class="layer-number">03</div><h3>Экономическая реальность</h3><p>Где создаётся ценность, кто выполняет ключевые функции и кто фактически принимает на себя предпринимательские риски.</p></article>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container container-narrow">
      <div class="section-label">О ЧЁМ ЭТО</div><h2 class="section-title-main">Фактическое присутствие — это не офис и не номинальный директор</h2>
      <p class="section-lead-dark">Для устойчивой международной структуры важно соответствие между местом принятия решений, реальными функциями, распределением рисков и налоговой позицией. Если документы описывают одну модель, а бизнес работает иначе, это создаёт вопросы у банков, налоговых органов и инвесторов.</p>
      <p class="section-lead-dark muted">Проверяется не количество формальных атрибутов, а то, где действительно находится управление, кто выполняет существенные функции, какие риски несёт компания и подтверждаются ли заявленные роли фактической деятельностью.</p>
      <div class="substance-trigger-grid" data-reveal-stagger>
        <article class="trigger-card-dark"><h3>Управление находится в другой юрисдикции</h3><p>Нужно сопоставить фактическое место принятия решений, корпоративное управление и налоговое резидентство с юридической структурой.</p></article>
        <article class="trigger-card-dark"><h3>Банк запрашивает подтверждение реальной деятельности</h3><p>Нужна доказательная база: решения, протоколы, сотрудники, операционный след и согласованность корпоративных документов.</p></article>
        <article class="trigger-card-dark"><h3>Налоговые льготы требуют фактического обоснования</h3><p>Деловая цель, функции и реальная экономическая роль компаний должны подтверждать заявленную налоговую позицию и право на применение СИДН.</p></article>
      </div>
    </div></section>

    <section class="section section-light"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ПЯТЬ ЭЛЕМЕНТОВ</div><h2 class="section-title-main">Пять элементов устойчивого фактического присутствия</h2><p class="section-subtitle">Каждый элемент должен быть согласован с ролью компании внутри группы и подтверждаться реальными фактами.</p></div>
      <div class="substance-elements-grid" data-reveal-stagger>
        <article class="substance-element-card"><div class="element-number">01</div><h3>Место принятия решений</h3><p>Где принимаются ключевые управленческие решения и находится реальный центр управления. Это важнее одного только адреса регистрации.</p></article>
        <article class="substance-element-card"><div class="element-number">02</div><h3>Функциональное присутствие</h3><p>Где работают люди, выполняются ключевые функции и протекают реальные операционные процессы.</p></article>
        <article class="substance-element-card"><div class="element-number">03</div><h3>Распределение рисков</h3><p>Кто фактически контролирует и несёт предпринимательские риски, соответствует ли это договорной модели, деловой цели операций и роли получателя дохода.</p></article>
        <article class="substance-element-card"><div class="element-number">04</div><h3>Корпоративное управление</h3><p>Полномочия органов управления, процедуры принятия решений и распределение ответственности по компаниям группы.</p></article>
        <article class="substance-element-card"><div class="element-number">05</div><h3>Доказательная база</h3><p>Протоколы, решения и другие документы, которые подтверждают фактическое управление и согласуются с налоговой и банковской позицией.</p></article>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">КАК МЫ РАБОТАЕМ</div><h2 class="section-title-main">От формальной схемы к подтверждаемой фактической модели</h2><p class="section-subtitle light-subtitle">Цель — не создать видимость присутствия, а согласовать структуру с реальными функциями, управлением и доказательной базой.</p></div>
      <div class="method-grid" data-reveal-stagger>
        <article class="method-step-card-dark"><span class="method-step-number">01</span><h3>Фактическая карта управления</h3><p>Определяем, где находятся ключевые лица, кто реально принимает решения и как распределены полномочия внутри группы.</p></article>
        <article class="method-step-card-dark"><span class="method-step-number">02</span><h3>Функции и операционная реальность</h3><p>Смотрим, где создаётся ценность, кто выполняет стратегические и операционные функции и где сосредоточена команда.</p></article>
        <article class="method-step-card-dark"><span class="method-step-number">03</span><h3>Корпоративное управление и доказательная база</h3><p>Проверяем процедуры принятия решений, делегированные полномочия, протоколы и согласованность документов с налоговой и банковской позицией.</p></article>
        <article class="method-step-card-dark"><span class="method-step-number">04</span><h3>Согласование со структурой группы</h3><p>Соотносим фактическую модель с налоговым резидентством, риском постоянного представительства, банковской готовностью и договорной архитектурой.</p></article>
      </div>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ТИПОВЫЕ РИСКИ</div><h2 class="section-title-main">Что обычно делает структуру уязвимой</h2></div>
      <div class="prep-checklist" data-reveal-stagger>
        <div class="prep-item">Ключевые решения фактически принимаются не там, где заявлено место управления компании</div>
        <div class="prep-item">Корпоративные решения и протоколы не подтверждают реальный управленческий процесс</div>
        <div class="prep-item">Команда и фактические функции не соответствуют роли компании на бумаге</div>
        <div class="prep-item">Объяснение для банка расходится с налоговой или договорной моделью</div>
        <div class="prep-item">Право на льготы по СИДН не подтверждается деловой целью и фактической ролью компании</div>
        <div class="prep-item">Фактическое присутствие подменяется формальными атрибутами без реальных функций</div>
      </div>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ЧТО ПОДГОТОВИТЬ</div><h2 class="section-title-main">Что обычно нужно для первичной оценки</h2></div>
      <div class="prep-checklist" data-reveal-stagger>
        <div class="prep-item">Схема компаний и структура владения</div>
        <div class="prep-item">Где находятся директора, собственники и ключевые лица, принимающие решения</div>
        <div class="prep-item">Кто выполняет основные функции: продажи, операционная деятельность, казначейство, интеллектуальная собственность и финансы</div>
        <div class="prep-item">Как документируются решения и как устроены процедуры корпоративного управления</div>
        <div class="prep-item">Какие вопросы уже возникали у банка, налогового консультанта, инвестора или контрагента</div>
        <div class="prep-item">Какие вопросы по СИДН, налоговому резидентству, постоянному представительству или банковской проверке уже проявились</div>
      </div>
      <p class="section-note">На первом этапе важнее точная карта фактов, функций и управления, чем идеально собранный комплект документов.</p>
    </div></section>

    <section class="section section-light system-link-section"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">СВЯЗЬ С СИСТЕМОЙ</div><h2 class="section-title-main">Фактическое присутствие как часть общей архитектуры</h2><p class="section-subtitle">Фактическое присутствие и корпоративное управление нельзя рассматривать отдельно от налогового резидентства, банковской готовности и операционной модели.</p></div>
      <p class="system-link-text">Мы проверяем, соответствует ли юридическая конструкция реальным функциям, управлению и движению денег. Если эти элементы расходятся, проблема обычно затрагивает сразу несколько уровней структуры.</p>
      <div class="related-inline-links"><a href="/ru/ekspertiza/strukturirovanie-gruppy.html">Структурирование группы →</a><a href="/ru/ekspertiza/bankovskaya-gotovnost.html">Банковская готовность →</a><a href="/ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html">Риск постоянного представительства и команды →</a><a href="/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html">Налоговое резидентство и КИК →</a></div>
    </div></section>

    <section class="section section-dark"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">КАК ЭТО СВЯЗАНО</div><h2 class="section-title-main">Связь с другими элементами структуры</h2></div>
      <div class="related-links-grid" data-reveal-stagger>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="related-link-card"><h3>Структурирование группы</h3><p>Фактическая деятельность должна подтверждать роли компаний и логику структуры владения, а не противоречить им.</p></a>
        <a href="/ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html" class="related-link-card"><h3>Налоговое резидентство и КИК</h3><p>Место управления и право на применение СИДН невозможно надёжно обосновать без согласования с реальными фактами.</p></a>
        <a href="/ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html" class="related-link-card"><h3>Риск постоянного представительства и международные команды</h3><p>География команды и реальные функции одновременно влияют на риск постоянного представительства и фактическую модель группы.</p></a>
        <a href="/ru/ekspertiza/bankovskaya-gotovnost.html" class="related-link-card"><h3>Банковская готовность</h3><p>Банк проверяет не только документы, но и то, насколько структура соответствует реальной деятельности и может быть понятно объяснена.</p></a>
      </div>
    </div></section>

    <section class="section section-light substance-faq"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><span class="lx-rule"></span><div class="section-label">ЧАСТЫЕ ВОПРОСЫ</div><h2 class="section-title-main">Коротко по сути</h2></div>
      <div class="lx-faq" data-reveal>
        <details class="lx-faq-item"><summary>Что означает фактическое присутствие в международной структуре?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Это соответствие между местом принятия решений, реальными функциями, распределением рисков и юридической ролью компании. Одного адреса регистрации, офиса или директора недостаточно, если фактическая деятельность устроена иначе.</p></div></details>
        <details class="lx-faq-item"><summary>Почему формальный офис сам по себе не решает проблему?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Банки, налоговые органы и инвесторы смотрят на факты: кто принимает решения, кто выполняет ключевые функции, кто несёт риски и соответствует ли движение денег заявленной бизнес-модели.</p></div></details>
        <details class="lx-faq-item"><summary>Какие три уровня должны совпадать?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Регистрация, корпоративное управление и экономическая реальность. Если юридическая оболочка, управленческий процесс и фактическая деятельность находятся в разных местах и не связаны понятной логикой, структура становится уязвимой.</p></div></details>
        <details class="lx-faq-item"><summary>Из каких элементов складывается устойчивая модель?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Из места принятия решений, функционального присутствия, реального распределения рисков, корпоративного управления и доказательной базы. Все пять элементов должны быть согласованы между собой и со структурой группы.</p></div></details>
        <details class="lx-faq-item"><summary>Что чаще всего создаёт риск?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Расхождение между документами и реальностью: решения принимаются в другой стране, команда выполняет функции не той компании, которая указана в договорах, а банковское объяснение не совпадает с налоговой и корпоративной моделью.</p></div></details>
        <details class="lx-faq-item"><summary>Что нужно для первичной оценки?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Достаточно схемы компаний и владения, географии директоров и ключевых лиц, описания основных функций, порядка принятия решений и перечня уже возникших вопросов со стороны банка, налогового консультанта или инвестора.</p></div></details>
      </div>
    </div></section>

    <section class="section section-dark expertise-cta substance-final-cta"><div class="container container-narrow"><div class="cta-centered">
      <div class="section-label">СЛЕДУЮЩИЙ ШАГ</div><h2 class="cta-title">Если формальная структура уже есть, но её устойчивость вызывает вопросы</h2><p class="cta-subtitle">Мы определим, где реальное управление, функции, команда и доказательная база расходятся с юридической моделью и какие точки требуют исправления.</p><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить анализ</a><div class="cta-meta">Первичная квалификация · объём работы после анализа запроса · без гарантий налогового или банковского результата</div>
    </div></div></section>

    <nav class="section-nav" aria-label="Навигация по разделу"><div class="container"><a href="/ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html" class="section-nav-link section-nav-prev"><span class="section-nav-label">Назад</span><strong>Регуляторная архитектура и лицензирование</strong></a><a href="/ru/formaty-raboty/index.html" class="section-nav-link section-nav-next"><span class="section-nav-label">Далее</span><strong>Форматы работы</strong></a></div></nav>

  </main>`
  },

  'ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html': {
    title: 'Регуляторная архитектура и лицензирование — LEXONYX',
    description: 'Регуляторная архитектура международного бизнеса: первичная оценка требований, выбор модели лицензирования и юрисдикции, система соблюдения требований и координация профильных специалистов.',
    ogTitle: 'Регуляторная архитектура и лицензирование — LEXONYX',
    ogDescription: 'Как определить, нужна ли лицензия, выбрать подходящую модель и юрисдикцию и встроить регуляторные требования в операционную структуру бизнеса.',
    twitterTitle: 'Регуляторная архитектура и лицензирование — LEXONYX',
    twitterDescription: 'Первичная оценка регуляторных требований, выбор юрисдикции, модель лицензирования и сопровождение реализации.',
    main: `<main id="main-content" class="regulatory-architecture-page">

    <section class="section section-dark licensing-hero hero-bg-dark--ekspertiza-regulyatornaya-arhitektura-i-licenzirovanie"><div class="container container-narrow">
      <nav class="breadcrumbs breadcrumbs-on-dark" aria-label="Хлебные крошки"><a href="/ru/index.html">Главная</a><span class="separator">›</span><a href="/ru/ekspertiza/index.html">Экспертиза</a><span class="separator">›</span><span class="current">Регуляторная архитектура и лицензирование</span></nav>
      <div class="section-label">РЕГУЛЯТОРНАЯ АРХИТЕКТУРА</div><h1 class="page-title page-title-wide">Регуляторная архитектура и лицензирование</h1><p class="page-subtitle page-subtitle-wide">Лицензирование — часть бизнес-модели, а не отдельная административная процедура. Требования зависят от фактических услуг, юрисдикции, капитала и применимого регулирования, включая MiCA, PSD3 и AMLR.</p>
      <div class="hero-actions"><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить регуляторный разбор</a><a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="btn btn-secondary btn-lg">Вернуться к структурированию группы</a></div>
      <div class="hero-meta-line"><span>EMI / PI / CASP</span><span>·</span><span>Первичная оценка требований</span><span>·</span><span>Выбор юрисдикции</span><span>·</span><span>Система соблюдения требований</span></div>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ПОЧЕМУ ЭТО ВАЖНО</div><h2 class="section-title-main">Неверно выбранная модель лицензирования может ограничить бизнес ещё до масштабирования</h2><p class="section-subtitle">Риск возникает не только при отсутствии необходимой лицензии. Ошибки появляются, когда бизнес неверно классифицирует свои услуги, выбирает неподходящую юрисдикцию или строит операционную модель без учёта регуляторных требований.</p></div>
      <div class="regulatory-risk-grid" data-reveal-stagger>
        <article class="system-note-card"><h3>Лицензия влияет на всю модель</h3><p>Она определяет требования к капиталу, доступ к банкам, возможности работы в других странах, операционные процессы и инвестиционную привлекательность проекта.</p></article>
        <article class="system-note-card"><h3>Полная лицензия нужна не всегда</h3><p>Иногда правильный путь начинается с первичной оценки: возможно исключение, работа через агента или дистрибьютора либо поэтапный выход на регулируемый рынок.</p></article>
        <article class="system-note-card"><h3>Регулирование меняется</h3><p>MiCA, PSD3 и AMLR влияют на требования к новым и существующим моделям, переходные периоды и дальнейшее масштабирование.</p></article>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">РЕГУЛЯТОРНЫЙ КОНТЕКСТ</div><h2 class="section-title-main">Регуляторный ландшафт 2026–2028</h2><p class="section-subtitle">Новые требования уже нужно учитывать при проектировании структуры, а не после запуска продукта.</p></div>
      <div class="regulatory-context-grid" data-reveal-stagger>
        <article class="regulatory-context-card"><h3>MiCA</h3><p>Для криптоактивов MiCA формирует единый европейский режим авторизации CASP и возможность работы в других странах ЕС на основании одной авторизации с учётом применимых переходных правил.</p></article>
        <article class="regulatory-context-card"><h3>PSD3</h3><p>Будущая платёжная архитектура ЕС влияет на требования к платёжным организациям, процедурам повторной авторизации и операционной модели существующих участников рынка.</p></article>
        <article class="regulatory-context-card"><h3>AMLR</h3><p>AMLR усиливает единые требования AML/KYC и делает систему внутреннего контроля и комплаенса центральной частью регулируемой модели.</p></article>
      </div>
      <div class="regulatory-conclusion-panel"><p>Лицензирование нельзя рассматривать как локальную задачу. Оно должно быть согласовано с целевыми рынками, структурой группы, банковской инфраструктурой, управлением и планами масштабирования.</p></div>
    </div></section>

    <section class="section section-light"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ТИПЫ РЕЖИМОВ</div><h2 class="section-title-main">Какие варианты обычно рассматриваются</h2><p class="section-subtitle">EMI, PI, CASP и более лёгкие варианты входа — это элементы регуляторной архитектуры, а не каталог готовых решений.</p></div>
      <div class="license-types-grid" data-reveal-stagger>
        <article class="license-type-card"><h3>EMI</h3><p>Организация электронных денег: выпуск электронных денег и платёжные услуги. В исходной модели страницы предусмотрен минимальный капитал от 350 000 евро и более широкий объём регулируемых операций.</p></article>
        <article class="license-type-card"><h3>PI</h3><p>Платёжная организация: платёжные услуги без выпуска электронных денег. В исходной модели страницы указаны требования к капиталу от 20 000 до 125 000 евро в зависимости от вида услуг.</p></article>
        <article class="license-type-card"><h3>CASP / MiCA</h3><p>Поставщик услуг, связанных с криптоактивами: обмен, хранение и другие виды деятельности. Размер капитала зависит от класса оказываемых услуг.</p></article>
        <article class="license-type-card"><h3>Исключения и поэтапный выход</h3><p>Для части моделей возможны ограниченные режимы, агентская или дистрибьюторская модель либо поэтапный переход к полной авторизации.</p></article>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ГДЕ ОБЫЧНО ОШИБАЮТСЯ</div><h2 class="section-title-main">Типовые риски неправильного лицензирования</h2></div>
      <div class="schema-panel" data-reveal-stagger>
        <div class="schema-line">Модель называют технологической, хотя фактически она включает регулируемые услуги</div>
        <div class="schema-line">Выбранная юрисдикция плохо сочетается с банковскими потребностями или требованиями к фактическому присутствию</div>
        <div class="schema-line">Система соблюдения требований собрана как шаблон и не соответствует реальной операционной модели</div>
        <div class="schema-line">Проект не учитывает MiCA, PSD3 или AMLR и требует существенной перестройки после запуска</div>
        <div class="schema-line">Возможности работы в других странах ЕС, требования к капиталу и корпоративному управлению недооценены на старте</div>
        <div class="schema-line">Модель лицензирования не согласована со структурой группы, владением и коммерческой моделью</div>
      </div>
    </div></section>

    <section class="section section-light"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">КАК МЫ РАБОТАЕМ</div><h2 class="section-title-main">От бизнес-модели к плану лицензирования</h2><p class="section-subtitle">Сначала определяем фактические регулируемые виды деятельности, затем сравниваем юрисдикции и варианты лицензирования, после чего формируем требования к структуре, управлению и реализации.</p></div>
      <div class="method-grid" data-reveal-stagger>
        <article class="method-step-card"><span class="method-step-number">01</span><h3>Первичная оценка регуляторных требований</h3><p>Определяем, возникает ли регулируемая деятельность, нужна ли лицензия и какие режимы потенциально применимы.</p></article>
        <article class="method-step-card"><span class="method-step-number">02</span><h3>Выбор юрисдикции</h3><p>Сравниваем реалистичность вариантов с учётом банковской инфраструктуры, капитала, сроков и целевых рынков.</p></article>
        <article class="method-step-card"><span class="method-step-number">03</span><h3>Система соблюдения требований</h3><p>Формируем базовую архитектуру комплаенса, корпоративного управления, операционных процессов и необходимой документации.</p></article>
        <article class="method-step-card"><span class="method-step-number">04</span><h3>План действий и сопровождение</h3><p>Определяем последовательность шагов и координируем дальнейшую работу с профильными специалистами соответствующей юрисдикции.</p></article>
      </div>
    </div></section>

    <section class="section section-light"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ЮРИСДИКЦИОННАЯ ЛОГИКА</div><h2 class="section-title-main">Как сравнивают юрисдикции</h2><p class="section-subtitle">Сравнение строится вокруг конкретной бизнес-модели, а не общего рейтинга стран: важны целевые рынки, банковская инфраструктура, требования к капиталу, сроки и фактическое присутствие.</p></div>
      <div class="jurisdiction-comparison-grid" data-reveal-stagger>
        <article class="comparison-card"><h3>ЕС</h3><p>Ключевое преимущество — возможность оказывать услуги в других странах ЕС на основании разрешения, полученного в одной стране, если соответствующий режим это допускает. Конкретная страна выбирается под модель и регуляторные требования.</p></article>
        <article class="comparison-card"><h3>Великобритания</h3><p>После Брексита британская авторизация существует отдельно от режимов ЕС, поэтому Великобритания рассматривается как самостоятельная юрисдикция с собственными требованиями.</p></article>
        <article class="comparison-card"><h3>ОАЭ</h3><p>ОАЭ имеют собственные регулируемые режимы и не дают доступа к рынку ЕС на основании одной авторизации. Выбор зависит от вида деятельности, целевых рынков и операционной модели.</p></article>
      </div>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ЧТО ПОДГОТОВИТЬ</div><h2 class="section-title-main">Что нужно для первичной оценки</h2></div>
      <div class="prep-checklist" data-reveal-stagger>
        <div class="prep-item">Краткое описание продукта и бизнес-модели</div>
        <div class="prep-item">Перечень планируемых услуг: платежи, электронные деньги, хранение активов, обмен, кошельки, карты и другие функции</div>
        <div class="prep-item">Целевые рынки и страны, в которых планируется работа</div>
        <div class="prep-item">Существующая структура группы, банковская инфраструктура и предполагаемая модель капитала</div>
        <div class="prep-item">Собственники, ключевые руководители и их география</div>
        <div class="prep-item">Критичные сроки, бюджетные ограничения и иные условия проекта</div>
      </div>
      <p class="section-note">На первом этапе нужен не готовый пакет для регулятора, а точная карта продукта, услуг, структуры и целевых рынков.</p>
    </div></section>

    <section class="section section-dark"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">КАК ЭТО СВЯЗАНО</div><h2 class="section-title-main">Связь с другими элементами системы</h2></div>
      <div class="related-links-grid" data-reveal-stagger>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="related-link-card"><h3>Структурирование группы</h3><p>Модель лицензирования должна быть совместима со структурой владения, ролями компаний и общей архитектурой бизнеса.</p></a>
        <a href="/ru/ekspertiza/bankovskaya-gotovnost.html" class="related-link-card"><h3>Банковская готовность</h3><p>Для регулируемого бизнеса лицензирование и банковская готовность тесно связаны через KYC, капитал и объяснение бизнес-модели.</p></a>
        <a href="/ru/ekspertiza/substance-i-governance.html" class="related-link-card"><h3>Фактическое присутствие и корпоративное управление</h3><p>Регулируемая модель требует реального управления, распределения ответственности и работающей системы внутреннего контроля.</p></a>
        <a href="/ru/yurisdikcii/index.html" class="related-link-card"><h3>Юрисдикции</h3><p>Выбор страны влияет на сроки, требования к капиталу, надзор и возможности дальнейшего масштабирования.</p></a>
      </div>
    </div></section>

    <section class="section section-light licensing-faq"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><span class="lx-rule"></span><div class="section-label">ЧАСТЫЕ ВОПРОСЫ</div><h2 class="section-title-main">Лицензирование — коротко по сути</h2></div>
      <div class="lx-faq" data-reveal>
        <details class="lx-faq-item"><summary>Что такое регуляторная архитектура?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Это согласование фактической бизнес-модели с применимым регулированием: какие виды деятельности регулируются, нужна ли лицензия, какой режим подходит и в какой юрисдикции его целесообразно реализовывать.</p></div></details>
        <details class="lx-faq-item"><summary>Всегда ли бизнесу нужна полная лицензия?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Нет. Для части моделей возможны исключения, ограниченные режимы, агентская или дистрибьюторская модель либо поэтапный выход. Это определяется после анализа фактических услуг и применимого права.</p></div></details>
        <details class="lx-faq-item"><summary>Чем отличаются EMI, PI и CASP?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Это разные регулируемые режимы: EMI относится к электронным деньгам и платёжным услугам, PI — к платёжным услугам, CASP по MiCA — к услугам, связанным с криптоактивами. Точный объём разрешённых операций и требования зависят от конкретного режима и юрисдикции.</p></div></details>
        <details class="lx-faq-item"><summary>Как MiCA, PSD3 и AMLR влияют на проект?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Они меняют требования к авторизации, внутреннему контролю, AML/KYC, переходным периодам и дальнейшему масштабированию. Поэтому их необходимо учитывать уже при проектировании структуры и операционной модели.</p></div></details>
        <details class="lx-faq-item"><summary>Как выбирают юрисдикцию для лицензирования?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Сравнивают целевые рынки, банковскую инфраструктуру, требования к капиталу, сроки, фактическое присутствие и надзорную практику. Выбор страны должен быть обоснован конкретной бизнес-моделью.</p></div></details>
        <details class="lx-faq-item"><summary>Что подготовить для первичной оценки?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Краткое описание продукта, перечень услуг, целевые рынки, существующую структуру группы, банковскую инфраструктуру, предполагаемый капитал и информацию о собственниках и ключевых руководителях.</p></div></details>
      </div>
    </div></section>

    <section class="section section-dark expertise-cta licensing-final-cta"><div class="container container-narrow"><div class="cta-centered">
      <div class="section-label">СЛЕДУЮЩИЙ ШАГ</div><h2 class="cta-title">Если нужен не «любой вид лицензии», а реалистичная модель регулирования</h2><p class="cta-subtitle">Мы поможем определить, какие регулируемые виды деятельности действительно возникают, какие варианты лицензирования возможны, где модель жизнеспособна и какие требования нужно учитывать уже на старте.</p><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить первичную оценку</a><div class="cta-meta">Первичная квалификация · объём работы после анализа запроса · без гарантий получения лицензии</div>
    </div></div></section>

    <nav class="section-nav" aria-label="Навигация по разделу"><div class="container"><a href="/ru/ekspertiza/bankovskaya-gotovnost.html" class="section-nav-link section-nav-prev"><span class="section-nav-label">Назад</span><strong>Банковская готовность</strong></a><a href="/ru/ekspertiza/substance-i-governance.html" class="section-nav-link section-nav-next"><span class="section-nav-label">Далее</span><strong>Фактическое присутствие и корпоративное управление</strong></a></div></nav>

    <section class="section section-light lexonyx-scope-note"><div class="container container-narrow"><div class="section-header-centered" data-reveal><div class="section-label">КАК МЫ РАБОТАЕМ С МЕЖДУНАРОДНЫМИ ВОПРОСАМИ</div><h2 class="section-title-main">Структурный анализ, координация и подтверждение профильных специалистов</h2><p class="section-subtitle">LEXONYX проводит структурный и фактический анализ международных проектов и координирует регуляторные направления работы. Если проект требует официального заключения по праву, налогообложению или регулируемым вопросам конкретной юрисдикции, соответствующий вывод предоставляется или подтверждается квалифицированным специалистом этой юрисдикции.</p></div></div></section>

  </main>`
  },

  'ru/formaty-raboty/ekspress-proverka-riskov.html': {
    title: 'Экспресс-проверка рисков — LEXONYX',
    description: 'Экспресс-проверка рисков LEXONYX: быстрая диагностика международной структуры за 48–72 часа, чтобы определить существенные зоны риска и выбрать следующий формат работы.',
    ogTitle: 'Экспресс-проверка рисков — LEXONYX',
    ogDescription: 'Быстрая диагностика международной структуры за 48–72 часа: где уже есть существенный риск и нужен ли углублённый структурный анализ.',
    twitterTitle: 'Экспресс-проверка рисков — LEXONYX',
    twitterDescription: 'Первичная диагностика структуры перед полным аудитом: активные риски, срочность и следующий шаг.',
    main: `<main id="main-content" class="express-risk-page">

    <section class="section section-dark express-risk-hero hero-bg-dark--formaty-raboty-ekspress-proverka-riskov"><div class="container container-narrow">
      <nav class="breadcrumbs breadcrumbs-on-dark" aria-label="Хлебные крошки"><a href="/ru/index.html">Главная</a><span class="separator">›</span><a href="/ru/formaty-raboty/index.html">Форматы работы</a><span class="separator">›</span><span class="current">Экспресс-проверка рисков</span></nav>
      <div class="section-label">ФОРМАТЫ · ЭКСПРЕСС-ПРОВЕРКА</div><h1 class="page-title page-title-wide">Экспресс-проверка рисков</h1><p class="page-subtitle page-subtitle-wide">Быстрая диагностика международной структуры: определяем, какие зоны риска уже имеют практическое значение и нужен ли полноценный стратегический аудит.</p>
      <div class="hero-meta-line"><span>48–72 часа</span><span>·</span><span>Первичная диагностика без полного аудита</span><span>·</span><span>Продолжить / исправить / углубить анализ</span></div>
      <div class="hero-actions"><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить экспресс-оценку</a><a href="/ru/podhod/karta-riskov.html" class="btn btn-secondary btn-lg">Карта рисков</a></div>
      <p class="section-subtitle" style="margin-top: 14px;">Это не замена полноценного аудита и не гарантия результата. Формат помогает быстро определить, где риск уже существенен и какой следующий шаг обоснован фактами.</p>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">КОГДА ИСПОЛЬЗОВАТЬ</div><h2 class="section-title-main">Когда нужна именно экспресс-проверка</h2><p class="section-subtitle">Не каждая ситуация требует полного структурного аудита. Иногда сначала нужно быстро понять, где есть реальный риск, насколько он существенен и что делать дальше.</p></div>
      <div class="express-when-grid" data-reveal-stagger>
        <article class="express-when-card"><h3>Открытие счёта или банковская проверка</h3><p>Нужно быстро понять, какие элементы структуры могут вызвать дополнительные вопросы у банка или платёжного провайдера.</p></article>
        <article class="express-when-card"><h3>Смена резидентства или найм в новой стране</h3><p>Фактическая модель меняется, и нужно оценить последствия до принятия решения.</p></article>
        <article class="express-when-card"><h3>Инвестор, сделка или комплексная проверка</h3><p>Нужно заранее увидеть точки, которые с высокой вероятностью попадут в фокус инвестора или покупателя.</p></article>
        <article class="express-when-card"><h3>Есть сомнения в текущей структуре</h3><p>Структура работает, но непонятно, где именно слабое место и требует ли оно системной перестройки.</p></article>
      </div>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ПЕРВИЧНАЯ ПРОВЕРКА</div><h2 class="section-title-main">Быстрый тест: это про вашу ситуацию?</h2><p class="section-subtitle">Если на несколько вопросов ответ «да», экспресс-формат может быть подходящим первым шагом.</p></div>
      <div class="result-list">
        <article class="result-item"><div class="r-icon">01</div><div class="r-text"><strong>Банк или платёжный провайдер задаёт вопросы</strong><span>По структуре владения, потокам, происхождению средств, договорам или логике бизнес-модели.</span></div></article>
        <article class="result-item"><div class="r-icon">02</div><div class="r-text"><strong>Команда работает в разных странах</strong><span>Сотрудники, подрядчики или агенты фактически выполняют ключевые функции в нескольких юрисдикциях.</span></div></article>
        <article class="result-item"><div class="r-icon">03</div><div class="r-text"><strong>Продажи в ЕС, склады или маркетплейсы</strong><span>Возникают вопросы по OSS/IOSS, фулфилменту, складам и НДС.</span></div></article>
        <article class="result-item"><div class="r-icon">04</div><div class="r-text"><strong>В группе несколько компаний с разными ролями</strong><span>Нет уверенности, что договоры, функции и денежные потоки соответствуют реальной деятельности.</span></div></article>
        <article class="result-item"><div class="r-icon">05</div><div class="r-text"><strong>Изменился контекст</strong><span>Переезд собственника, найм в новой стране, новый рынок, новый продукт или новая модель продаж.</span></div></article>
        <article class="result-item"><div class="r-icon">06</div><div class="r-text"><strong>Готовитесь к инвестору или комплексной проверке</strong><span>Хотите заранее увидеть критичные вопросы и потенциальные красные флаги.</span></div></article>
        <article class="result-item"><div class="r-icon">07</div><div class="r-text"><strong>Есть внутригрупповые потоки</strong><span>Услуги, роялти, займы, проценты или дивиденды требуют понятного экономического и налогового обоснования.</span></div></article>
        <article class="result-item"><div class="r-icon">08</div><div class="r-text"><strong>Возможна регулируемая деятельность</strong><span>Платежи, криптоактивы или иные услуги требуют первичной оценки регуляторного периметра.</span></div></article>
        <article class="result-item"><div class="r-icon">09</div><div class="r-text"><strong>Фактическое присутствие и управление вызывают вопросы</strong><span>Неочевидно, где принимаются решения, кто выполняет ключевые функции и как это документируется.</span></div></article>
        <article class="result-item"><div class="r-icon">10</div><div class="r-text"><strong>Нужно быстро решить, идти ли глубже</strong><span>Продолжить текущую модель, внести точечные исправления или переходить к стратегическому аудиту.</span></div></article>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ЧТО ПОДГОТОВИТЬ</div><h2 class="section-title-main">Что нужно для экспресс-оценки</h2><p class="section-subtitle">На старте достаточно фактов и схемы. Чувствительные документы запрашиваются только при необходимости и в рамках согласованного режима конфиденциальности.</p></div>
      <div class="schema-panel" data-reveal-stagger>
        <div class="schema-line">1) Список компаний и их фактические роли в группе</div>
        <div class="schema-line">2) География собственников, директоров, сотрудников и ключевых подрядчиков</div>
        <div class="schema-line">3) Рынки продаж и описание коммерческой модели</div>
        <div class="schema-line">4) Наличие складов, фулфилмента и маркетплейсов, если они используются</div>
        <div class="schema-line">5) Основные внутригрупповые платежи, если они есть</div>
        <div class="schema-line">6) Краткое описание вопросов банка или платёжного провайдера, если они уже возникли</div>
      </div>
      <div class="hero-actions" style="margin-top: 18px;"><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить экспресс-оценку</a><a href="/ru/kontakty.html" class="btn btn-secondary btn-lg">Связаться напрямую</a></div>
    </div></section>

    <section class="section section-light"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">ОБЪЁМ ПРОВЕРКИ</div><h2 class="section-title-main">Что проверяется в экспресс-формате</h2><p class="section-subtitle">Фокус — на зонах, где структурный риск чаще всего уже проявляется на практике, а не на полном перепроектировании модели.</p></div>
      <div class="express-scope-grid">
        <article class="scope-card"><div class="scope-num">ПОСТОЯННОЕ ПРЕДСТАВИТЕЛЬСТВО</div><h3>Риск постоянного представительства</h3><p>Есть ли роли, полномочия и функции, которые могут создавать налогооблагаемое присутствие в другой стране.</p></article>
        <article class="scope-card"><div class="scope-num">НАЛОГОВОЕ РЕЗИДЕНТСТВО</div><h3>Место фактического управления</h3><p>Где реально принимаются решения и соответствует ли это заявленной корпоративной логике.</p></article>
        <article class="scope-card"><div class="scope-num">БАНКОВСКИЕ ВОПРОСЫ</div><h3>Банковская готовность</h3><p>Насколько понятно объясняются структура владения, денежные потоки и происхождение средств и капитала.</p></article>
        <article class="scope-card"><div class="scope-num">НДС</div><h3>Триггеры по НДС</h3><p>Склады, маркетплейсы, фулфилмент, постоянное учреждение для целей НДС и связь с моделью продаж.</p></article>
        <article class="scope-card"><div class="scope-num">СОБСТВЕННИК И КИК</div><h3>Личный налоговый риск</h3><p>Резидентство собственника, КИК и возможный конфликт между логикой владения и фактическим управлением.</p></article>
        <article class="scope-card"><div class="scope-num">ФАКТИЧЕСКОЕ ПРИСУТСТВИЕ</div><h3>Проверка фактической модели</h3><p>Соответствуют ли управление, функции и экономическая реальность заявленной структуре.</p></article>
      </div>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ГРАНИЦЫ ФОРМАТА</div><h2 class="section-title-main">Чем экспресс-проверка отличается от стратегического аудита</h2></div>
      <div class="schema-panel schema-panel-light">
        <div class="schema-line schema-line-light">Экспресс-проверка показывает, где существенный риск уже виден сейчас</div>
        <div class="schema-line schema-line-light">Стратегический аудит нужен, когда проблема затрагивает несколько уровней структуры одновременно</div>
        <div class="schema-line schema-line-light">Экспресс-проверка помогает выбрать следующий шаг: продолжить, точечно исправить или перейти к углублённому анализу</div>
        <div class="schema-line schema-line-light">Если требуется перепроектирование модели, это уже формат стратегического аудита</div>
      </div>
      <div class="section-header-centered" style="margin-top: 26px;"><div class="section-label">НЕ ПОДХОДИТ</div><p class="section-subtitle">Формат не подходит, если ожидается гарантированное открытие счёта, получение лицензии или конкретный налоговый результат, а также если запрос связан с обходом санкций, требований AML/KYC или уклонением от закона.</p></div>
    </div></section>

    <section class="section section-dark"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">ПРОЦЕСС</div><h2 class="section-title-main">Как работает формат</h2><p class="section-subtitle">Типовой цикл — 48–72 часа после подтверждения исходных данных.</p></div>
      <div class="timeline-list">
        <article class="timeline-step"><div class="t-num">01</div><div class="t-body"><h3>Структурированный запрос</h3><p>Юрисдикции, роли компаний, команда, потоки и контекст вопроса. Полный пакет документов на этом этапе не требуется.</p><div class="t-time">День 1</div></div></article>
        <article class="timeline-step"><div class="t-num">02</div><div class="t-body"><h3>Уточнение фактов</h3><p>Коротко уточняем несколько фактов, без которых риск нельзя интерпретировать корректно.</p><div class="t-time">День 1–2</div></div></article>
        <article class="timeline-step"><div class="t-num">03</div><div class="t-body"><h3>Экспресс-анализ</h3><p>Проверяем наиболее релевантные направления: налоги, НДС, постоянное представительство, банковскую готовность и фактическое присутствие.</p><div class="t-time">День 2–3</div></div></article>
        <article class="timeline-step"><div class="t-num">04</div><div class="t-body"><h3>Краткое письменное резюме</h3><p>Фиксируем, где риск существенен, насколько он срочен и какой следующий формат работы обоснован фактами.</p><div class="t-time">День 3–4</div></div></article>
      </div>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><div class="section-label">РЕЗУЛЬТАТ</div><h2 class="section-title-main">Что вы получите</h2><p class="section-subtitle">Короткий прикладной результат, который позволяет принять решение о следующих действиях.</p></div>
      <div class="result-list">
        <article class="result-item"><div class="r-icon">01</div><div class="r-text"><strong>Карта активных рисков</strong><span>Какие точки являются существенными и почему.</span></div></article>
        <article class="result-item"><div class="r-icon">02</div><div class="r-text"><strong>Оценка срочности</strong><span>Что требует быстрых действий, что можно решать поэтапно и что сейчас не критично.</span></div></article>
        <article class="result-item"><div class="r-icon">03</div><div class="r-text"><strong>Рекомендация по следующему шагу</strong><span>Продолжить текущую модель, внести точечные изменения, провести стратегический аудит или перейти к сопровождению.</span></div></article>
        <article class="result-item"><div class="r-icon">04</div><div class="r-text"><strong>Список необходимых данных и документов</strong><span>Что действительно нужно запросить дальше, без избыточного сбора информации.</span></div></article>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container">
      <div class="section-header-centered" data-reveal><div class="section-label">СВЯЗАННЫЕ ЭЛЕМЕНТЫ СИСТЕМЫ</div><h2 class="section-title-main">Куда это ведёт дальше</h2><p class="section-subtitle">Экспресс-проверка — входной формат. Дальше объём работы определяется по фактическим результатам диагностики.</p></div>
      <div class="related-links-grid" data-reveal-stagger>
        <a href="/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html" class="related-link-card"><h3>Стратегический структурный аудит</h3><p>Если диагностика показывает, что модель требует полного архитектурного анализа и вариантов целевой структуры.</p></a>
        <a href="/ru/formaty-raboty/soprovozhdenie-i-advisory.html" class="related-link-card"><h3>Сопровождение и консультирование</h3><p>Если риск уже понятен и нужен управляемый план внедрения с постоянной координацией.</p></a>
        <a href="/ru/podhod/karta-riskov.html" class="related-link-card"><h3>Карта рисков</h3><p>Контекст: где обычно возникают налоговые, НДС, банковские и управленческие риски и как они связаны.</p></a>
        <a href="/ru/ekspertiza/strukturirovanie-gruppy.html" class="related-link-card"><h3>Структурирование группы</h3><p>Если проблема системная, решение обычно лежит в архитектуре группы, а не в отдельной точечной правке.</p></a>
      </div>
    </div></section>

    <section class="section section-light formats-faq"><div class="container container-narrow">
      <div class="section-header-centered" data-reveal><span class="lx-rule"></span><div class="section-label">ЧАСТЫЕ ВОПРОСЫ</div><h2 class="section-title-main">Коротко по сути</h2></div>
      <div class="lx-faq" data-reveal>
        <details class="lx-faq-item"><summary>Что такое экспресс-проверка рисков?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Это быстрая диагностика международной структуры, которая показывает, какие зоны риска уже существенны и требуется ли полноценный стратегический аудит.</p></div></details>
        <details class="lx-faq-item"><summary>Когда она нужна?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Перед сделкой, ростом, выходом на новый рынок, при смене резидентства собственника или когда банк уже задаёт вопросы, а масштаб проблемы пока неясен.</p></div></details>
        <details class="lx-faq-item"><summary>Чем экспресс-проверка отличается от стратегического аудита?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>Экспресс-проверка отвечает на вопрос, где есть существенный риск и нужно ли идти глубже. Стратегический аудит анализирует всю модель как систему и формирует варианты её перестройки.</p></div></details>
        <details class="lx-faq-item"><summary>Что нужно подготовить и что я получу?<span class="lx-faq-icon" aria-hidden="true"></span></summary><div class="lx-faq-answer"><p>На старте достаточно схемы компаний, юрисдикций, структуры владения, ключевых операций и текущих вопросов. На выходе — карта активных рисков, оценка срочности и рекомендация по следующему шагу.</p></div></details>
      </div>
    </div></section>

    <section class="section section-dark express-risk-cta"><div class="container container-narrow"><div class="cta-centered">
      <div class="section-label">ЭКСПРЕСС-ПРОВЕРКА РИСКОВ</div><h2 class="cta-title">Нужна быстрая оценка ситуации?</h2><p class="cta-subtitle">Опишите структуру, юрисдикции и контекст вопроса. Мы определим существенные зоны риска и предложим следующий обоснованный формат работы.</p><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить экспресс-оценку</a><div class="cta-meta">48–72 часа после подтверждения исходных данных · без гарантий конкретного результата · только законные и соответствующие требованиям комплаенса модели</div>
    </div></div></section>

    <nav class="section-nav" aria-label="Навигация по разделу"><div class="container"><a href="/ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html" class="section-nav-link section-nav-prev"><span class="section-nav-label">Назад</span><strong>Стратегический структурный аудит</strong></a><a href="/ru/formaty-raboty/soprovozhdenie-i-advisory.html" class="section-nav-link section-nav-next"><span class="section-nav-label">Далее</span><strong>Сопровождение и консультирование</strong></a></div></nav>

  </main>`
  }
};

let changed = 0;
for (const [rel, cfg] of Object.entries(pages)) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing target: ${rel}`);
  const original = fs.readFileSync(file, 'utf8');
  let html = original;
  html = setTitle(html, cfg.title);
  html = meta(html, 'name=["\']description["\']', cfg.description);
  html = meta(html, 'property=["\']og:title["\']', cfg.ogTitle);
  html = meta(html, 'property=["\']og:description["\']', cfg.ogDescription);
  html = meta(html, 'name=["\']twitter:title["\']', cfg.twitterTitle);
  html = meta(html, 'name=["\']twitter:description["\']', cfg.twitterDescription);
  html = setMain(html, cfg.main);
  html = restoreUkLabel(html);
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU four-page manual editorial pass] changed=${changed}`);
