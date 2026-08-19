import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const rel = 'uk/yurysdyktsiyi/index.html';
const file = path.join(ROOT, rel);
if (!fs.existsSync(file)) process.exit(0);

let html = fs.readFileSync(file, 'utf8');
const title = 'Юрисдикції та структурні сценарії — LEXONYX';
const description = 'Юрисдикції для міжнародного бізнесу: спочатку бізнес-мета, функція компанії та операційна реальність, потім вибір країни і координація місцевих фахівців.';

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function setMeta(key, value, property = false) {
  const attr = property ? 'property' : 'name';
  const re = new RegExp(`(<meta\\b[^>]*${attr}=["']${esc(key)}["'][^>]*content=["'])([^"']*)(["'][^>]*>)`, 'i');
  html = html.replace(re, `$1${value}$3`);
}

html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
setMeta('description', description);
setMeta('og:title', title, true);
setMeta('og:description', 'Країна — не стратегія. Спочатку визначаємо функцію, роль компанії та фактичну операційну модель; лише потім обираємо юрисдикцію.', true);

const main = `<main id="main-content">
  <section class="section section-dark"><div class="container container-narrow">
    <nav class="breadcrumbs breadcrumbs-on-dark" aria-label="Навігаційний шлях"><a href="/uk/index.html">Головна</a><span class="separator">›</span><span class="current">Юрисдикції</span></nav>
    <div class="section-label">ВИБІР ЮРИСДИКЦІЇ</div>
    <h1 class="page-title page-title-wide">Юрисдикції та структурні сценарії</h1>
    <p class="page-subtitle page-subtitle-wide"><strong>Країна — не стратегія.</strong> Спочатку визначаємо бізнес-мету, функцію, роль компанії, місце управління, людей, банківську модель та регуляторні обмеження. Лише після цього порівнюємо юрисдикції, здатні підтримати цільову модель.</p>
  </div></section>

  <section class="section section-light"><div class="container">
    <div class="section-header-centered"><div class="section-label">КЛЮЧОВІ ЮРИСДИКЦІЇ</div><h2 class="section-title-main">Основні сценарії використання</h2></div>
    <div class="jur-relevance-grid">
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/ukrayina.html"><h4>Україна</h4><p>Українське право, корпоративні права, походження капіталу та транскордонна взаємодія.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/nimechchyna.html"><h4>Німеччина</h4><p>Фактичне управління, персонал, операційна присутність та координація німецьких фахівців.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/kipr.html"><h4>Кіпр</h4><p>Холдингова та інвестиційна функція, управління, економічна присутність і банківська логіка.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/polshcha.html"><h4>Польща</h4><p>Команди, розробка, операційна компанія, працевлаштування та внутрішньогрупові відносини.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/niderlandy.html"><h4>Нідерланди</h4><p>Інвесторська й холдингова архітектура, права інвесторів та придбання.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/oae.html"><h4>ОАЕ</h4><p>Регіональна операційна присутність, управління, релокація засновника й регуляторний контур.</p></a>
    </div>
  </div></section>

  <section class="section section-dark"><div class="container">
    <div class="section-header-centered"><div class="section-label">ДОДАТКОВІ ЮРИСДИКЦІЇ</div><h2 class="section-title-main">Спеціалізовані сценарії</h2></div>
    <div class="jur-relevance-grid">
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/estoniya.html"><h4>Естонія</h4><p>Цифрові та дистанційні моделі, розподілені команди й місце фактичного управління.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/irlandiya.html"><h4>Ірландія</h4><p>Технологічні групи, міжнародні операції, інтелектуальна власність і функціональна модель.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/velykobrytaniya.html"><h4>Велика Британія</h4><p>Операційна компанія, вихід на ринок, інвестори та транзакційна архітектура.</p></a>
      <a class="jur-relevance-card" href="/uk/yurysdyktsiyi/shveytsariya.html"><h4>Швейцарія</h4><p>Приватний капітал, штаб-квартира, сімейний бізнес і релокація засновника.</p></a>
    </div>
  </div></section>

  <section class="section section-light"><div class="container container-narrow">
    <div class="section-label">ЯК МИ ПРАЦЮЄМО</div><h2 class="section-title-main">Спочатку функція — потім юрисдикція</h2>
    <p>LEXONYX оцінює країну як частину загальної бізнес-архітектури: структуру володіння, роль компанії, місце управління, функції, персонал, операційну реальність і банківську модель. Консультації з українського права надаються безпосередньо в межах професійної компетенції адвоката України. Висновки щодо права, податків і регуляторних вимог інших держав надають або підтверджують належно кваліфіковані місцеві фахівці; LEXONYX інтегрує їх у єдину цільову модель.</p>
  </div></section>

  <section class="section section-dark"><div class="container container-narrow">
    <div class="section-label">ПРИНЦИП</div><h2 class="section-title-main">Коли нова юрисдикція не потрібна</h2>
    <p>Міжнародні клієнти, привабливий податковий режим або популярність країни самі по собі не обґрунтовують створення нової компанії. Нова ланка має вирішувати конкретне бізнес-завдання, мати зрозумілу ділову мету та відповідати реальному місцю управління, людям, банківській моделі й очікуваним інвестиційним або операційним функціям.</p>
  </div></section>
</main>`;

html = html.replace(/<main\b[\s\S]*?<\/main>/i, main);
html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i, match => {
  try {
    const body = match.match(/>([\s\S]*?)<\/script>/i)[1];
    const data = JSON.parse(body);
    if (data['@type'] === 'CollectionPage') {
      data.name = title;
      data.description = 'Довідник LEXONYX щодо ролі юрисдикцій у міжнародній бізнес-архітектурі.';
      data.inLanguage = 'uk';
    }
    return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
  } catch { return match; }
});

fs.writeFileSync(file, html, 'utf8');
console.log('[LEXONYX UK jurisdiction hub curation] PASS');
