import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const targets = [
  'ru/index.html',
  'ru/ekspertiza/index.html',
  'ru/ekspertiza/strukturirovanie-gruppy.html',
  'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
  'ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html',
  'ru/ekspertiza/bankovskaya-gotovnost.html',
  'ru/ekspertiza/substance-i-governance.html',
  'ru/ekspertiza/vat-i-transgranichnye-modeli.html',
  'ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html',
  'ru/ekspertiza/source-of-funds.html',
  'ru/ekspertiza/chastnyy-kapital-i-family-office.html',
  'ru/formaty-raboty/index.html',
  'ru/formaty-raboty/kak-nachat.html',
  'ru/formaty-raboty/ekspress-proverka-riskov.html',
  'ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html',
  'ru/formaty-raboty/soprovozhdenie-i-advisory.html',
  'ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html',
  'ru/o-praktike/index.html',
  'ru/o-praktike/kto-my.html',
  'ru/o-praktike/kak-my-rabotaem.html'
];

// Exact phrase-level replacements only. Never replace arbitrary substrings inside words.
const exact = [
  ['EU, UK и UAE', 'ЕС, Великобритании и ОАЭ'],
  ['EU, UK, UAE', 'ЕС, Великобритания, ОАЭ'],
  ['EU / UK / UAE', 'ЕС / Великобритания / ОАЭ'],
  ['EU / UK / ОАЭ', 'ЕС / Великобритания / ОАЭ'],
  ['EU, UK и ОАЭ', 'ЕС, Великобритании и ОАЭ'],
  ['ЕС / UK / ОАЭ', 'ЕС / Великобритания / ОАЭ'],
  ['EU / UK', 'ЕС / Великобритания'],
  ['EU/UK', 'ЕС/Великобритания'],
  ['в EU, UK и UAE', 'в ЕС, Великобритании и ОАЭ'],
  ['в EU, UK и ОАЭ', 'в ЕС, Великобритании и ОАЭ'],
  ['в ЕС, UK и UAE', 'в ЕС, Великобритании и ОАЭ'],
  ['EU-клиентами', 'клиентами из ЕС'],
  ['EU-клиенты', 'клиенты из ЕС'],

  ['Source of Funds / Source of Wealth', 'Происхождение средств / происхождение капитала'],
  ['Source of Funds / SoW', 'Происхождение средств / происхождение капитала'],
  ['Source of Funds', 'Происхождение средств'],
  ['Source of Wealth', 'Происхождение капитала'],
  ['SOF / SOW', 'происхождение средств и капитала'],
  ['SOF/SOW', 'происхождение средств и капитала'],
  ['SoF/SoW', 'происхождение средств и капитала'],
  ['SoF / SoW', 'происхождение средств и капитала'],
  ['SOF/SOW-доказательств', 'доказательств происхождения средств и капитала'],
  ['SOF/SOW-документацию', 'документы о происхождении средств и капитала'],

  ['ownership-and-flow map', 'карта владения и денежных потоков'],
  ['ownership-логику', 'логику структуры владения'],
  ['ownership-логика', 'логика структуры владения'],
  ['ownership и', 'структура владения и'],
  ['ownership,', 'структура владения,'],
  ['по ownership', 'по структуре владения'],
  ['ownership', 'структура владения'],

  ['corporate governance', 'корпоративное управление'],
  ['formal governance', 'формальная система управления'],
  ['governance-модель', 'модель корпоративного управления'],
  ['governance-риски', 'риски корпоративного управления'],
  ['governance и', 'корпоративное управление и'],
  ['governance,', 'корпоративное управление,'],
  ['governance', 'корпоративное управление'],

  ['substance-риски', 'риски недостаточного фактического присутствия'],
  ['substance и', 'фактическое экономическое присутствие и'],
  ['substance,', 'фактическое экономическое присутствие,'],
  ['substance', 'фактическое экономическое присутствие'],

  ['VAT-roadmap', 'план по НДС'],
  ['VAT-контур', 'контур НДС'],
  ['VAT-логика', 'логика НДС'],
  ['VAT-модель', 'модель НДС'],
  ['VAT transaction mapping', 'картирование операций для целей НДС'],
  ['VAT и', 'НДС и'],
  ['VAT,', 'НДС,'],
  ['VAT', 'НДС'],

  ['PE-risk map', 'карта риска постоянного представительства'],
  ['по PE-risk', 'по риску постоянного представительства'],
  ['PE-risk и', 'риск постоянного представительства и'],
  ['PE-risk,', 'риск постоянного представительства,'],
  ['PE-risk', 'риск постоянного представительства'],
  ['PE interface', 'связь с риском постоянного представительства'],
  ['PE,', 'постоянное представительство,'],

  ['transfer-pricing workstream coordination', 'координация вопросов трансфертного ценообразования'],
  ['transfer-pricing', 'трансфертное ценообразование'],
  ['transfer pricing', 'трансфертное ценообразование'],
  ['TP conclusions', 'выводы по трансфертному ценообразованию'],
  ['TP interfaces', 'вопросы трансфертного ценообразования'],
  ['TP или', 'трансфертное ценообразование или'],
  ['TP,', 'трансфертное ценообразование,'],
  ['TP ', 'трансфертное ценообразование '],

  ['DTT/WHT', 'СИДН и налог у источника'],
  ['DTT / WHT', 'СИДН и налог у источника'],
  ['DTT, WHT', 'СИДН и налог у источника'],
  ['DTT', 'СИДН'],
  ['WHT', 'налог у источника'],
  ['treaty-benefits', 'преимущества СИДН'],
  ['treaty benefits', 'преимущества СИДН'],
  ['Treaty', 'СИДН'],
  ['beneficial-ownership анализа', 'анализа фактического права на доход'],
  ['beneficial ownership', 'фактическое право на доход'],
  ['anti-abuse', 'правила противодействия злоупотреблениям'],
  ['антиабузные правила', 'правила противодействия злоупотреблениям'],
  ['антиабузных правил', 'правил противодействия злоупотреблениям'],
  ['business purpose', 'деловая цель'],

  ['HoldCo/OpCo', 'холдинговая и операционная компании'],
  ['HoldCo и операционные компании', 'холдинговая и операционные компании'],
  ['HoldCo', 'холдинговая компания'],
  ['OpCo', 'операционная компания'],
  ['ServiceCo', 'сервисная компания'],
  ['FinanceCo', 'финансовая компания'],
  ['IPCo', 'компания — владелец интеллектуальной собственности'],
  ['IP-компания', 'компания — владелец интеллектуальной собственности'],
  ['IP-компании', 'компании — владельца интеллектуальной собственности'],
  ['IP-структура', 'структура владения интеллектуальной собственностью'],
  ['IP-центр', 'центр управления интеллектуальной собственностью'],
  ['IP rights', 'права на интеллектуальную собственность'],
  ['IP или', 'интеллектуальная собственность или'],
  ['IP,', 'интеллектуальная собственность,'],
  ['IP ', 'интеллектуальная собственность '],

  ['family office', 'семейный офис'],
  ['advisory-практика', 'консультационная практика'],
  ['advisory', 'консультационное сопровождение'],
  ['local counsel', 'местных профильных специалистов'],
  ['local professional', 'профильного специалиста соответствующей юрисдикции'],
  ['local professionals', 'профильных специалистов соответствующих юрисдикций'],
  ['local specialist', 'профильного специалиста соответствующей юрисдикции'],
  ['specialist sign-off', 'подтверждение профильного специалиста'],
  ['specialist-confirmed', 'подтверждённый профильным специалистом'],
  ['specialist coordination', 'координация профильных специалистов'],
  ['specialist layer', 'уровень профильных специалистов'],
  ['specialist workstreams', 'направления работы профильных специалистов'],
  ['workstreams', 'направления работы'],
  ['workstream', 'направление работы'],

  ['Structure Map', 'карта структуры'],
  ['Structure map', 'карта структуры'],
  ['Risk matrix', 'матрица рисков'],
  ['risk matrix', 'матрица рисков'],
  ['Risk Map', 'карта рисков'],
  ['Implementation roadmap', 'план внедрения'],
  ['implementation roadmap', 'план внедрения'],
  ['implementation', 'внедрение'],
  ['decision trail', 'документированный процесс принятия решений'],
  ['business narrative', 'описание бизнес-модели'],
  ['business story', 'описание бизнес-модели'],
  ['trade-offs', 'компромиссы'],
  ['in-house', 'внутренней'],
  ['due diligence', 'комплексная юридическая проверка'],
  ['onboarding-объяснение', 'объяснение для банковской проверки'],
  ['Банковский onboarding', 'Банковская проверка при открытии счёта'],
  ['onboarding', 'банковская проверка'],

  ['decision-makers', 'лица, принимающие решения'],
  ['approvals', 'согласования'],
  ['payroll-вопросов', 'вопросов расчёта заработной платы'],
  ['payroll', 'расчёт заработной платы'],
  ['EOR-модели', 'модели найма через внешнего работодателя (EOR)'],
  ['EOR-модель', 'модель найма через внешнего работодателя (EOR)'],
  ['co-working', 'коворкинг'],
  ['back-office или support-функции', 'административные или поддерживающие функции'],
  ['support-функции', 'поддерживающие функции'],
  ['sales-команда', 'команда продаж'],

  ['Current State', 'текущая модель'],
  ['Target State', 'целевая модель'],
  ['Entity Necessity', 'необходимость отдельной компании'],
  ['Business Purpose', 'деловая цель'],
  ['Operational Reality', 'фактическая операционная модель'],
  ['operational reality', 'фактическая операционная модель'],
  ['operating reality', 'фактическая операционная модель'],
  ['operating model', 'операционная модель'],
  ['cross-border business', 'трансграничный бизнес'],
  ['cross-border', 'трансграничный'],

  ['founder relocation', 'переезд собственника'],
  ['Founder', 'Основатель'],
  ['founder', 'основатель'],
  ['Lead Advisor', 'ведущий консультант'],

  ['regulatory perimeter', 'регуляторный периметр'],
  ['licensing perimeter', 'периметр лицензируемой деятельности'],
  ['regulatory fit', 'соответствие регуляторным требованиям'],
  ['regulatory risks', 'регуляторные риски'],
  ['regulatory conclusions', 'регуляторные выводы'],
  ['regulatory workstreams', 'регуляторные направления работы'],
  ['regulatory', 'регуляторные вопросы'],

  ['banking pack', 'пакет для банковской проверки'],
  ['banking readiness', 'банковская готовность'],
  ['banking flows', 'банковские потоки'],
  ['banking', 'банковская модель'],

  ['tax residency', 'налоговое резидентство'],
  ['tax/VAT/PE', 'налоги / НДС / постоянное представительство'],
  ['tax, VAT, PE', 'налоги, НДС и постоянное представительство'],
  ['tax/VAT', 'налоги / НДС'],
  ['tax', 'налоговые вопросы'],

  ['use case', 'самостоятельная функция'],
  ['use cases', 'сценарии применения'],
  ['defendable', 'обоснованный'],
  ['compliance-first', 'с приоритетом соблюдения требований'],
  ['compliance needs', 'требования к соблюдению законодательства'],
  ['compliance', 'комплаенс'],

  ['mini-tests', 'мини-тесты'],
  ['roadmap', 'план действий'],
  ['scoping', 'определение периметра'],
  ['review', 'проверка'],
  ['Matter', 'проект']
];

const regexPairs = [
  [/\bEU\b/g, 'ЕС'],
  [/\bUK\b/g, 'Великобритания'],
  [/\bUAE\b/g, 'ОАЭ'],
  [/\bVAT\b/g, 'НДС']
];

function cleanText(text) {
  let out = text;
  for (const [from, to] of exact) out = out.split(from).join(to);
  for (const [re, to] of regexPairs) out = out.replace(re, to);

  // Human-language polish for recurring Russian jargon/calques.
  out = out
    .replace(/КИК-экспозици(?:я|и|ю)/g, m => ({'КИК-экспозиция':'риск по правилам КИК','КИК-экспозиции':'риска по правилам КИК','КИК-экспозицию':'риск по правилам КИК'}[m] || m))
    .replace(/корпоративное управление-логик/gi, 'логик корпоративного управления')
    .replace(/по риск постоянного представительства/gi, 'по риску постоянного представительства')
    .replace(/с риск постоянного представительства/gi, 'с риском постоянного представительства')
    .replace(/и риск постоянного представительства риски/gi, 'и риски постоянного представительства')
    .replace(/налоговые вопросы-риски/gi, 'налоговые риски')
    .replace(/регуляторные вопросы-риски/gi, 'регуляторные риски')
    .replace(/комплаенс-совместим/gi, 'соответствующ')
    .replace(/\s{2,}/g, ' ');
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

function cleanHtml(html) {
  // Visible text nodes, excluding style/script blocks.
  const held = [];
  html = html.replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi, block => {
    held.push(block);
    return `__LEXONYX_HELD_${held.length - 1}__`;
  });

  html = html.replace(/>([^<>]+)</g, (m, text) => `>${cleanText(text)}<`);
  html = html.replace(/(<meta\b[^>]*\bcontent=["'])([^"']*)(["'][^>]*>)/gi, (m, a, value, b) => a + cleanText(value) + b);

  html = html.replace(/__LEXONYX_HELD_(\d+)__/g, (_, i) => held[Number(i)]);
  html = cleanJsonLd(html);
  return html;
}

let changed = 0;
for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing target: ${rel}`);
  const original = fs.readFileSync(file, 'utf8');
  const html = cleanHtml(original);
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU core language curation] changed=${changed}/${targets.length}`);
