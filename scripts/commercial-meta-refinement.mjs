import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const descriptions = {
  'en/index.html': 'International business structuring: group architecture, governance, substance and banking readiness, with specialist-coordinated tax and regulatory workstreams.',
  'en/expertise/group-structuring.html': 'Design of ownership, entity roles, governance and operational logic for international groups, aligned with banking, tax and regulatory workstreams.',
  'en/expertise/tax-residency-cfc.html': 'Fact mapping for tax residence and CFC risk: ownership, control, management and flows, with tax conclusions confirmed by qualified specialists.',
  'en/expertise/banking-readiness.html': 'Banking readiness for international structures: business model, ownership, substance, KYC/KYB and Source of Funds evidence prepared before onboarding.',
  'en/expertise/substance-governance.html': 'Substance and governance analysis for international structures: management, people, functions, evidence and decision-making aligned with operational reality.',
  'en/expertise/regulatory-licensing.html': 'Regulatory architecture for payments, crypto and other regulated models: activity mapping, licensing perimeter and specialist-confirmed local requirements.',
  'en/expertise/private-capital-and-family-office.html': 'Structuring support for private capital and family office matters: ownership, governance, banking, succession interfaces and specialist coordination.',
  'en/work-formats/strategic-structural-audit.html': 'A structured review of an international business model: ownership, tax interfaces, substance, banking, governance and regulatory dependencies.',
  'en/request-review.html': 'Submit your structure for initial qualification. We identify the relevant risks, suitable work format and next step before detailed engagement begins.',
  'en/contact.html': 'Contact LEXONYX to discuss an international structuring matter or submit a structured request for initial qualification and the appropriate next step.',

  'ru/index.html': 'Структурирование бизнеса: архитектура группы, управление, фактическое присутствие и банковская готовность с координацией налоговых и регуляторных выводов.',
  'ru/ekspertiza/strukturirovanie-gruppy.html': 'Архитектура международной группы: структура владения, роли компаний, управление и операционная логика с учётом банковских, налоговых и регуляторных вопросов.',
  'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html': 'Карта фактов для анализа налогового резидентства и КИК: владение, контроль, управление и потоки; налоговые выводы подтверждают профильные специалисты.',
  'ru/ekspertiza/bankovskaya-gotovnost.html': 'Подготовка международной структуры к банковскому обслуживанию: бизнес-модель, структура владения, фактическое присутствие, KYC и подтверждение происхождения средств.',
  'ru/ekspertiza/substance-i-governance.html': 'Анализ фактического присутствия и корпоративного управления: решения, люди, функции, документы и их соответствие реальной операционной модели.',
  'ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html': 'Регуляторная архитектура для платёжных, крипто- и иных регулируемых моделей: карта деятельности, лицензионный периметр и подтверждение локальных требований.',
  'ru/ekspertiza/chastnyy-kapital-i-family-office.html': 'Структурирование частного капитала и семейного офиса: владение, корпоративное управление, банковские вопросы, преемственность и координация специалистов.',
  'ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html': 'Системный аудит международной структуры: владение, налоговые интерфейсы, фактическое присутствие, банковская готовность, управление и регуляторные зависимости.',
  'ru/zaprosit-razbor.html': 'Отправьте структуру на первичную квалификацию. Мы определим ключевые риски, подходящий формат работы и следующий шаг до детального сопровождения.',
  'ru/kontakty.html': 'Свяжитесь с LEXONYX по международному структурированию или отправьте структурированный запрос для первичной квалификации и определения следующего шага.',

  'uk/index.html': 'Структурування міжнародного бізнесу: архітектура групи, управління, substance і банківська готовність з координацією податкових та регуляторних висновків.',
  'uk/ekspertyza/strukturuvannya-grupy.html': 'Архітектура міжнародної групи: структура володіння, ролі компаній, управління й операційна логіка з урахуванням банківських, податкових і регуляторних питань.',
  'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html': 'Карта фактів для аналізу податкового резидентства та КІК: володіння, контроль, управління і потоки; податкові висновки підтверджують профільні фахівці.',
  'uk/ekspertyza/bankivska-gotovnist.html': 'Підготовка міжнародної структури до банківського onboarding: бізнес-модель, ownership, substance, KYC/KYB та докази Source of Funds / Source of Wealth.',
  'uk/ekspertyza/substance-ta-governance.html': 'Аналіз фактичної присутності та корпоративного управління: рішення, люди, функції, документи та їх відповідність реальній операційній моделі.',
  'uk/ekspertyza/regulyatorna-arhitektura-ta-litsenzuvannya.html': 'Регуляторна архітектура для платіжних, crypto та інших регульованих моделей: карта діяльності, ліцензійний периметр і підтвердження локальних вимог.',
  'uk/ekspertyza/pryvatnyy-kapital-i-family-office.html': 'Структурування приватного капіталу та family office: володіння, governance, банківські питання, наступництво й координація профільних фахівців.',
  'uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html': 'Системний аудит міжнародної структури: ownership, податкові інтерфейси, substance, банківська готовність, governance і регуляторні залежності.',
  'uk/zapytaty-rozbir.html': 'Надішліть структуру на первинну кваліфікацію. Ми визначимо ключові ризики, відповідний формат роботи і наступний крок до детального супроводу.',
  'uk/kontakty.html': 'Зв’яжіться з LEXONYX щодо міжнародного структурування або надішліть структурований запит для первинної кваліфікації та визначення наступного кроку.'
};

const titles = {
  'en/expertise/group-structuring.html': 'International Group Structuring — LEXONYX',
  'en/expertise/banking-readiness.html': 'Banking Readiness for International Structures — LEXONYX'
};

function esc(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function setDescription(html, description) {
  const tag = `<meta name="description" content="${esc(description)}" />`;
  const rx = /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/i;
  return rx.test(html) ? html.replace(rx, tag) : html.replace(/<\/title>/i, `</title>\n  ${tag}`);
}

function setTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
}

let changed = 0;
for (const [rel, description] of Object.entries(descriptions)) {
  if (description.length > 165) throw new Error(`${rel}: meta description too long (${description.length})`);
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`${rel}: commercial page missing`);
  const before = fs.readFileSync(file, 'utf8');
  let after = setDescription(before, description);
  if (titles[rel]) after = setTitle(after, titles[rel]);
  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX commercial meta] curated=${changed}/${Object.keys(descriptions).length}`);
