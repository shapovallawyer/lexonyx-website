import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const rel = 'ru/yurisdikcii/germaniya.html';
const file = path.join(ROOT, rel);
let html = fs.readFileSync(file, 'utf8');

const main = `<main id="main-content">
    <section class="section section-dark"><div class="container container-narrow">
      <nav class="breadcrumbs breadcrumbs-on-dark" aria-label="Хлебные крошки"><a href="/ru/index.html">Главная</a><span class="separator">›</span><a href="/ru/yurisdikcii/">Юрисдикции</a><span class="separator">›</span><span class="current">Германия</span></nav>
      <div class="section-label">ГЕРМАНИЯ · ФАКТИЧЕСКАЯ ОПЕРАЦИОННАЯ МОДЕЛЬ</div>
      <h1 class="page-title page-title-wide">Германия в международной структуре бизнеса</h1>
      <p class="page-subtitle page-subtitle-wide">Германия часто становится значимой юрисдикцией не потому, что её выбрали заранее, а потому, что фактическое управление, команда, клиенты, операционная деятельность или инвестиционная активность находятся здесь. LEXONYX восстанавливает фактическую модель бизнеса и координирует необходимые направления работы с немецкими профильными специалистами.</p>
      <div class="hero-actions"><a href="/ru/zaprosit-razbor.html" class="btn btn-primary btn-lg">Запросить разбор</a><a href="/ru/yurisdikcii/" class="btn btn-secondary btn-lg">Все юрисдикции</a></div>
    </div></section>

    <section class="section section-light"><div class="container">
      <div class="section-header-centered"><div class="section-label">ТИПИЧНЫЕ РОЛИ</div><h2 class="section-title-main">Когда Германия становится частью целевой модели</h2></div>
      <div class="jur-relevance-grid">
        <div class="jur-relevance-card"><h4>Основная операционная компания</h4><p>Управление, договоры с клиентами и ключевые предпринимательские функции фактически сосредоточены в Германии.</p></div>
        <div class="jur-relevance-card"><h4>Центр управления</h4><p>Иностранная компания может иметь существенную связь с Германией, если ключевые управленческие решения принимаются здесь.</p></div>
        <div class="jur-relevance-card"><h4>Операционная платформа в ЕС</h4><p>Сотрудники, продажи, клиенты, договорная деятельность и банковская инфраструктура формируют реальное операционное присутствие в Германии.</p></div>
        <div class="jur-relevance-card"><h4>Связь с резидентством основателя</h4><p>Личное налоговое резидентство основателя, структура владения и распределение прибыли должны анализироваться вместе с корпоративной архитектурой.</p></div>
      </div>
    </div></section>

    <section class="section section-dark"><div class="container container-narrow">
      <div class="section-label">СТРУКТУРНЫЕ СВЯЗИ</div><h2 class="section-title-main">Что проверяем до реализации</h2>
      <p>Управление и налоговое резидентство компании · индикаторы постоянного представительства · вопросы налогообложения основателя · КИК · персонал и расчёт заработной платы · НДС · права инвесторов · банковские требования и KYC. LEXONYX формирует фактическую и структурную карту; конкретные выводы по немецкому праву и налогообложению предоставляются или подтверждаются квалифицированными немецкими специалистами.</p>
    </div></section>

    <section class="section section-light"><div class="container container-narrow">
      <div class="section-label">КОГДА НЕ СЛЕДУЕТ ИСПОЛЬЗОВАТЬ</div><h2 class="section-title-main">Германию нельзя просто «убрать» из структуры</h2>
      <p>Если основатель продолжает управлять бизнесом из Германии, ключевые сотрудники находятся здесь, а существенные решения принимаются здесь, номинальное использование иностранной головной компании само по себе не устраняет фактическую деятельность в Германии. Юридическая структура должна соответствовать реальному поведению бизнеса.</p>
    </div></section>

    <section class="section section-dark"><div class="container container-narrow">
      <div class="section-label">КАК РАБОТАЕТ LEXONYX</div><h2 class="section-title-main">Архитектура + немецкие профильные специалисты</h2>
      <p>LEXONYX анализирует текущую модель, необходимость каждой компании, карту управления, владение и контроль, фактическую операционную деятельность, банковскую архитектуру и отношения с инвесторами, а затем формирует целевую модель. Когда проект требует конкретного вывода по немецкому корпоративному, налоговому, трудовому, регуляторному или иному праву, такой вывод предоставляет или подтверждает квалифицированный Rechtsanwalt, Steuerberater либо иной профильный специалист в Германии. LEXONYX интегрирует подтверждённые выводы в общую трансграничную архитектуру.</p>
    </div></section>
  </main>`;

html = html.replace(/<main id="main-content">[\s\S]*?<\/main>/, main);
html = html.replace(/<meta name="description"[^>]*>/i, '<meta name="description" content="Германия в международной структуре бизнеса: фактическое управление, команда, постоянное представительство, КИК, НДС, банковские вопросы и координация немецких юридических и налоговых специалистов.">');
html = html.replace(/<meta property="og:description"[^>]*>/i, '<meta property="og:description" content="Фактическая операционная модель в Германии, управление, команда и координация немецких юридических и налоговых специалистов.">');
html = html.replace(/(<script type="application\/ld\+json">\{[^<]*"@type":"WebPage"[^<]*"description":")[^"]*("[^<]*<\/script>)/i, '$1Структурный анализ бизнеса, фактически связанного с Германией, и координация немецких юридических и налоговых специалистов.$2');

fs.writeFileSync(file, html);
console.log('[LEXONYX RU editorial curation] Germany page rewritten with curated Russian copy');
