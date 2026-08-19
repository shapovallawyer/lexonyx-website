import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const targets = [
  'ru/podhod/index.html',
  'ru/podhod/strukturnaya-model.html',
  'ru/podhod/principy-mezhdunarodnyh-struktur.html',
  'ru/podhod/karta-riskov.html',
  'ru/dlya-ukrainskogo-biznesa.html',
  'ru/kontakty.html',
  'ru/zaprosit-razbor.html',
  'ru/accessibility.html',
  'ru/cookie-policy.html',
  'ru/impressum.html',
  'ru/privacy-policy.html',
  'ru/terms-of-use.html',
  'ru/intake/intake.html',
  'ru/intake/intake_thankyou.html',
  'ru/intake/spasibo.html',
  'ru/intake/spasibo-newsletter.html'
];

const replacements = [
  ['Source of Funds / Source of Wealth', 'Происхождение средств / происхождение капитала'],
  ['Source of Funds', 'Происхождение средств'],
  ['source of funds', 'происхождение средств'],
  ['Source of Wealth', 'Происхождение капитала'],
  ['source of wealth', 'происхождение капитала'],
  ['family office', 'семейный офис'],
  ['Family Office', 'Семейный офис'],
  ['banking readiness', 'банковская готовность'],
  ['Banking Readiness', 'Банковская готовность'],
  ['banking review', 'банковская проверка'],
  ['Banking review', 'Банковская проверка'],
  ['onboarding', 'банковская проверка при открытии счёта'],
  ['Onboarding', 'Банковская проверка при открытии счёта'],
  ['governance', 'корпоративное управление'],
  ['Governance', 'Корпоративное управление'],
  ['substance', 'фактическое экономическое присутствие'],
  ['Substance', 'Фактическое экономическое присутствие'],
  ['ownership', 'структура владения'],
  ['Ownership', 'Структура владения'],
  ['Management & Control', 'Управление и контроль'],
  ['Management and Control', 'Управление и контроль'],
  ['management & control', 'управление и контроль'],
  ['management and control', 'управление и контроль'],
  ['beneficial ownership', 'фактическое право на доход'],
  ['Beneficial ownership', 'Фактическое право на доход'],
  ['decision-making', 'принятие решений'],
  ['board minutes', 'протоколы заседаний совета директоров'],
  ['treaty benefits', 'преимущества СИДН'],
  ['treaty-risk', 'риски применения СИДН'],
  ['Treaty risk', 'Риски применения СИДН'],
  ['cross-border', 'трансграничный'],
  ['Cross-Border', 'Трансграничный'],
  ['risk map', 'карта рисков'],
  ['Risk Map', 'Карта рисков'],
  ['framework', 'методика'],
  ['Framework', 'Методика'],
  ['checklist', 'чек-лист'],
  ['Checklist', 'Чек-лист'],
  ['review', 'проверка'],
  ['Review', 'Проверка'],
  ['advisory', 'консультационное сопровождение'],
  ['Advisory', 'Консультационное сопровождение'],
  ['screening', 'первичная проверка'],
  ['Screening', 'Первичная проверка'],
  ['narrative', 'объяснение бизнес-модели'],
  ['Narrative', 'Объяснение бизнес-модели'],
  ['red flags', 'красные флаги'],
  ['Red flags', 'Красные флаги'],
  ['people footprint', 'распределение персонала'],
  ['People footprint', 'Распределение персонала'],
  ['economic reality', 'экономическая реальность'],
  ['Economic reality', 'Экономическая реальность'],
  ['business model', 'бизнес-модель'],
  ['Business model', 'Бизнес-модель'],
  ['operating model', 'операционная модель'],
  ['Operating model', 'Операционная модель'],
  ['target state', 'целевая модель'],
  ['Target State', 'Целевая модель'],
  ['entity necessity', 'необходимость отдельной компании'],
  ['Entity Necessity', 'Необходимость отдельной компании'],
  ['holding company', 'холдинговая компания'],
  ['Holding Company', 'Холдинговая компания'],
  ['operating company', 'операционная компания'],
  ['Operating Company', 'Операционная компания'],
  ['service company', 'сервисная компания'],
  ['Service Company', 'Сервисная компания'],
  ['HoldCo', 'холдинговая компания'],
  ['OpCo', 'операционная компания'],
  ['ServiceCo', 'сервисная компания'],
  ['PE-risk', 'риск постоянного представительства'],
  ['PE Risk', 'риск постоянного представительства'],
  ['Permanent Establishment', 'Постоянное представительство'],
  ['permanent establishment', 'постоянное представительство'],
  ['Fixed Establishment', 'Постоянное место ведения деятельности для целей НДС'],
  ['fixed establishment', 'постоянное место ведения деятельности для целей НДС'],
  ['VAT', 'НДС'],
  ['CFC', 'КИК'],
  ['M&amp;A', 'слияния и поглощения'],
  ['M&A', 'слияния и поглощения'],
  ['e-commerce', 'электронная коммерция'],
  ['E-commerce', 'Электронная коммерция'],
  ['marketplace', 'маркетплейс'],
  ['Marketplace', 'Маркетплейс'],
  ['fulfillment', 'фулфилмент'],
  ['Fulfillment', 'Фулфилмент'],
  ['cookie settings', 'настройки файлов cookie'],
  ['Cookie Settings', 'Настройки файлов cookie'],
  ['privacy policy', 'политика конфиденциальности'],
  ['Privacy Policy', 'Политика конфиденциальности'],
  ['terms of use', 'условия использования'],
  ['Terms of Use', 'Условия использования'],
  ['legal notice', 'правовая информация'],
  ['Legal Notice', 'Правовая информация'],
  ['accessibility statement', 'заявление о доступности'],
  ['Accessibility Statement', 'Заявление о доступности'],
  ['data controller', 'оператор персональных данных'],
  ['Data Controller', 'Оператор персональных данных'],
  ['data processor', 'обработчик персональных данных'],
  ['Data Processor', 'Обработчик персональных данных'],
  ['third-party', 'сторонний'],
  ['Third-party', 'Сторонний'],
  ['analytics cookies', 'аналитические файлы cookie'],
  ['Analytics cookies', 'Аналитические файлы cookie'],
  ['consent', 'согласие'],
  ['Consent', 'Согласие'],
  ['retention period', 'срок хранения'],
  ['Retention period', 'Срок хранения'],
  ['newsletter', 'рассылка'],
  ['Newsletter', 'Рассылка'],
  ['request a review', 'запросить разбор'],
  ['Request a Review', 'Запросить разбор'],
  ['request review', 'запросить разбор'],
  ['Request Review', 'Запросить разбор']
];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceToken(text, from, to) {
  const escaped = escapeRe(from);
  const left = /^[A-Za-z0-9]/.test(from) ? '(?<![A-Za-z0-9])' : '';
  const right = /[A-Za-z0-9]$/.test(from) ? '(?![A-Za-z0-9])' : '';
  return text.replace(new RegExp(left + escaped + right, 'g'), to);
}

function cleanText(text) {
  let out = text;
  for (const [from, to] of replacements) out = replaceToken(out, from, to);
  out = out
    .replace(/(?<![A-Za-z])PE(?![A-Za-z])/g, 'постоянное представительство')
    .replace(/(?<![A-Za-z])B2B(?![A-Za-z])/g, 'корпоративные клиенты')
    .replace(/(?<![A-Za-z])B2C(?![A-Za-z])/g, 'частные клиенты')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1');
  return out;
}

function cleanJsonLd(html) {
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (all, open, body, close) => {
    try {
      const data = JSON.parse(body);
      const walk = value => {
        if (Array.isArray(value)) return value.map(walk);
        if (value && typeof value === 'object') {
          for (const key of Object.keys(value)) value[key] = walk(value[key]);
          return value;
        }
        if (typeof value === 'string' && !/^https?:\/\//i.test(value)) return cleanText(value);
        return value;
      };
      return open + JSON.stringify(walk(data), null, 2) + close;
    } catch {
      return all;
    }
  });
}

function capitalizeBlocks(html) {
  return html.replace(/(<(?:p|h1|h2|h3|h4|li|summary|label)\b[^>]*>)([\s\S]*?)(<\/(?:p|h1|h2|h3|h4|li|summary|label)>)/gi, (all, open, inner, close) => {
    let changed = false;
    const next = inner.replace(/[а-яё]/, ch => {
      changed = true;
      return ch.toUpperCase();
    });
    return changed ? open + next + close : all;
  });
}

let changed = 0;
for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  let html = before;

  const held = [];
  html = html.replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi, block => {
    held.push(block);
    return `__LEXONYX_REMAIN_HELD_${held.length - 1}__`;
  });

  html = html.replace(/>([^<>]+)</g, (all, text) => `>${cleanText(text)}<`);
  html = html.replace(/(<meta\b[^>]*\bcontent=["'])([^"']*)(["'][^>]*>)/gi, (all, a, value, b) => a + cleanText(value) + b);
  html = html.replace(/\b(placeholder|aria-label|title)=(['"])(.*?)\2/gi, (all, attr, q, value) => `${attr}=${q}${cleanText(value)}${q}`);
  html = html.replace(/__LEXONYX_REMAIN_HELD_(\d+)__/g, (_, i) => held[Number(i)]);
  html = cleanJsonLd(html);
  html = capitalizeBlocks(html);

  if (html !== before) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU remaining language curation] changed=${changed}/${targets.length}`);
