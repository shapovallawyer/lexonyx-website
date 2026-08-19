import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const targets = [
  'ru/insayty/index.html',
  'ru/insayty/brifingi/index.html',
  'ru/insayty/brifingi/playbook-group-architecture.html',
  'ru/insayty/razbory/index.html',
  'ru/insayty/razbory/deep-dives.html',
  'ru/insayty/razbory/deep-dive-banking-readiness.html',
  'ru/insayty/razbory/deep-dive-cfc-residency.html',
  'ru/insayty/razbory/deep-dive-holdco-opco.html',
  'ru/insayty/razbory/deep-dive-pe-remote.html',
  'ru/insayty/razbory/deep-dive-vat-architecture.html',
  'ru/insayty/instrumenty/index.html',
  'ru/insayty/instrumenty/checklists.html',
  'ru/insayty/instrumenty/checklist-substance.html'
];

const exact = [
  ['Source of Funds / Source of Wealth', 'Происхождение средств / происхождение капитала'],
  ['Source of Funds', 'Происхождение средств'],
  ['source of funds', 'происхождение средств'],
  ['Source of Wealth', 'Происхождение капитала'],
  ['source of wealth', 'происхождение капитала'],
  ['Source funds', 'Происхождение средств'],
  ['source funds', 'происхождение средств'],

  ['banking readiness', 'банковская готовность'],
  ['Banking Readiness', 'Банковская готовность'],
  ['BANKING READINESS', 'БАНКОВСКАЯ ГОТОВНОСТЬ'],
  ['Banking readiness', 'Банковская готовность'],
  ['banking perception', 'восприятие структуры банком'],
  ['Banking perception', 'Восприятие структуры банком'],
  ['Banking review', 'Банковская проверка'],
  ['banking review', 'банковская проверка'],
  ['banking-', 'банковский '],
  ['Banking', 'Банковская'],
  ['banking', 'банковская'],

  ['onboarding', 'банковская проверка при открытии счёта'],
  ['Onboarding', 'Банковская проверка при открытии счёта'],
  ['intake', 'первичный сбор информации'],
  ['Intake', 'Первичный сбор информации'],

  ['PE-risk', 'риск постоянного представительства'],
  ['PE-Risk', 'риск постоянного представительства'],
  ['PE Risk', 'риск постоянного представительства'],
  ['PE-', 'риск постоянного представительства: '],
  ['Permanent Establishment', 'Постоянное представительство'],
  ['permanent establishment', 'постоянное представительство'],
  ['Fixed place of business', 'Постоянное место ведения бизнеса'],
  ['fixed place of business', 'постоянное место ведения бизнеса'],
  ['Dependent Agent', 'Зависимый агент'],
  ['dependent agent', 'зависимый агент'],
  ['Dependent', 'Зависимый'],
  ['dependent', 'зависимый'],
  ['agent', 'агент'],
  ['people footprint', 'распределение персонала'],
  ['People footprint', 'Распределение персонала'],
  ['Footprint', 'Фактическое присутствие'],
  ['footprint', 'фактическое присутствие'],

  ['Fixed Establishment', 'Постоянное место ведения деятельности для целей НДС'],
  ['Fixed establishment', 'Постоянное место ведения деятельности для целей НДС'],
  ['fixed Establishment', 'постоянное место ведения деятельности для целей НДС'],
  ['fixed establishment', 'постоянное место ведения деятельности для целей НДС'],
  ['fixed-establishment', 'постоянное место ведения деятельности для целей НДС'],
  ['VAT architecture', 'архитектура НДС'],
  ['VAT Architecture', 'Архитектура НДС'],
  ['VAT-', 'НДС-'],
  ['VAT ', 'НДС '],
  ['VAT,', 'НДС,'],
  ['VAT/', 'НДС/'],
  ['VAT', 'НДС'],
  ['CIT', 'корпоративный налог'],
  ['nexus', 'налоговая связь'],
  ['FE ', 'постоянное место ведения деятельности '],
  ['FE,', 'постоянное место ведения деятельности,'],

  ['CFC rules', 'правила КИК'],
  ['CFC Rules', 'Правила КИК'],
  ['CFC-', 'КИК-'],
  ['CFC', 'КИК'],
  ['Controlled Foreign Company rules', 'правила контролируемых иностранных компаний (КИК)'],
  ['Controlled Foreign Company', 'контролируемая иностранная компания'],
  ['PERSONAL TAX', 'ЛИЧНОЕ НАЛОГООБЛОЖЕНИЕ'],
  ['Personal tax', 'Личное налогообложение'],
  ['personal tax', 'личное налогообложение'],
  ['Corporate architecture', 'Корпоративная архитектура'],
  ['corporate architecture', 'корпоративная архитектура'],
  ['Personal positioning', 'Личная налоговая позиция'],
  ['personal positioning', 'личная налоговая позиция'],
  ['corporate', 'корпоративный'],
  ['personal', 'личный'],
  ['positioning', 'позиционирование'],
  ['Residency', 'Резидентство'],
  ['residency-', 'резидентство: '],
  ['residency', 'резидентство'],

  ['FAR framework', 'анализ функций, активов и рисков'],
  ['FAR', 'анализ функций, активов и рисков'],
  ['HoldCo / OpCo', 'холдинговая / операционная компания'],
  ['HoldCo/OpCo', 'холдинговая / операционная компания'],
  ['HoldCo', 'холдинговая компания'],
  ['OpCo', 'операционная компания'],
  ['ServiceCo', 'сервисная компания'],
  ['Service entity', 'сервисная компания'],
  ['service entity', 'сервисная компания'],
  ['holding-', 'холдинговый '],
  ['IP-', 'интеллектуальная собственность: '],
  ['IP ', 'интеллектуальная собственность '],
  ['IP,', 'интеллектуальная собственность,'],
  ['IP/', 'интеллектуальная собственность/'],
  ['IP', 'интеллектуальная собственность'],

  ['Management & Control', 'Управление и контроль'],
  ['Management and Control', 'Управление и контроль'],
  ['management & control', 'управление и контроль'],
  ['management and control', 'управление и контроль'],
  ['management, control', 'управление, контроль'],
  ['Management', 'Управление'],
  ['management', 'управление'],
  ['Control', 'Контроль'],
  ['control', 'контроль'],
  ['governance-', 'корпоративное управление: '],
  ['Governance', 'Корпоративное управление'],
  ['governance', 'корпоративное управление'],
  ['substance readiness', 'готовность подтвердить фактическое экономическое присутствие'],
  ['Substance Readiness', 'Готовность подтвердить фактическое экономическое присутствие'],
  ['Substance', 'Фактическое экономическое присутствие'],
  ['substance', 'фактическое экономическое присутствие'],
  ['economic reality', 'экономическая реальность'],
  ['Economic reality', 'Экономическая реальность'],

  ['beneficial ownership', 'фактическое право на доход'],
  ['Beneficial ownership', 'Фактическое право на доход'],
  ['ownership-', 'структура владения: '],
  ['ownership', 'структура владения'],
  ['decision-making', 'принятие решений'],
  ['board minutes', 'протоколы заседаний совета директоров'],
  ['Board minutes', 'Протоколы заседаний совета директоров'],
  ['board', 'совет директоров'],

  ['treaty benefits', 'преимущества СИДН'],
  ['Treaty benefits', 'Преимущества СИДН'],
  ['treaty-risk', 'риски применения СИДН'],
  ['Treaty-risk', 'Риски применения СИДН'],
  ['Treaty-driven', 'Ориентированная на применение СИДН'],
  ['treaty-driven', 'ориентированная на применение СИДН'],
  ['Treaty', 'СИДН'],
  ['treaty', 'СИДН'],

  ['E-commerce', 'Электронная коммерция'],
  ['e-commerce', 'электронная коммерция'],
  ['Marketplace', 'Маркетплейс'],
  ['marketplace', 'маркетплейс'],
  ['fulfillment-', 'фулфилмент-'],
  ['Fulfillment', 'Фулфилмент'],
  ['fulfillment', 'фулфилмент'],
  ['Supply chain', 'Цепочка поставок'],
  ['supply chain', 'цепочка поставок'],

  ['website review', 'проверка сайта'],
  ['Website review', 'Проверка сайта'],
  ['review', 'проверка'],
  ['narrative', 'объяснение бизнес-модели'],
  ['Narrative', 'Объяснение бизнес-модели'],
  ['red flags', 'красные флаги'],
  ['Red flags', 'Красные флаги'],

  ['Deep Dive', 'Глубокий разбор'],
  ['DEEP DIVE', 'ГЛУБОКИЙ РАЗБОР'],
  ['Deep Dives', 'Глубокие разборы'],
  ['DEEP DIVES', 'ГЛУБОКИЕ РАЗБОРЫ'],
  ['Framework', 'Методика'],
  ['FRAMEWORK', 'МЕТОДИКА'],
  ['framework', 'методика'],
  ['Checklist', 'Чек-лист'],
  ['CHECKLIST', 'ЧЕК-ЛИСТ'],
  ['Checklists', 'Чек-листы'],
  ['checklist', 'чек-лист'],
  ['screening-', 'первичная проверка: '],
  ['Screening', 'Первичная проверка'],
  ['screening', 'первичная проверка'],
  ['Playbooks', 'Практические руководства'],
  ['playbooks', 'практические руководства'],
  ['Readiness', 'Готовность'],
  ['readiness', 'готовность'],
  ['exposure', 'риск'],
  ['Exposure', 'Риск'],
  ['jurisdiction mix', 'сочетание юрисдикций'],
  ['Jurisdiction mix', 'Сочетание юрисдикций'],

  ['Group Structure', 'Структура группы'],
  ['GROUP STRUCTURE', 'СТРУКТУРА ГРУППЫ'],
  ['group structure', 'структура группы'],
  ['Group', 'Группа'],
  ['group', 'группа'],
  ['Structure', 'Структура'],
  ['structure', 'структура'],
  ['INTELLECTUAL', 'АНАЛИТИЧЕСКАЯ'],
  ['STRUCTURING', 'СТРУКТУРИРОВАНИЕ'],
  ['Structuring', 'Структурирование'],

  ['Remote Teams', 'Удалённые команды'],
  ['People', 'Люди'],
  ['Remote model', 'Удалённая модель'],
  ['remote model', 'удалённая модель'],
  ['Remote developer', 'Удалённый разработчик'],
  ['remote developer', 'удалённый разработчик'],
  ['Remote-', 'Удалённый '],
  ['remote-', 'удалённый '],
  ['Digital-', 'Цифровой '],
  ['digital-', 'цифровой '],
  ['digital', 'цифровой'],
  ['Developer Poland', 'Разработчик в Польше'],
  ['Developer', 'Разработчик'],
  ['Poland', 'Польша'],

  ['Profit shifting', 'Перенос прибыли'],
  ['Strategy', 'Стратегия'],
  ['Capital Allocation', 'Распределение капитала'],
  ['Commercial Risk', 'Коммерческий риск'],
  ['Commercial', 'Коммерческий'],
  ['Risk', 'Риск'],
  ['RISK', 'РИСК'],
  ['Revenue', 'Выручка'],
  ['Clients', 'Клиенты'],
  ['Low Tax', 'Низкая налоговая нагрузка'],
  ['No Function', 'Нет самостоятельной функции'],
  ['No', 'Нет'],
  ['Function', 'Функция'],
  ['Real Activity', 'Реальная деятельность'],
  ['Real', 'Реальная'],
  ['Activity', 'Деятельность'],
  ['exit', 'выход'],
  ['perception', 'восприятие'],

  ['Estonian OÜ', 'эстонская компания'],
  ['Estonian O', 'эстонская компания'],
  ['Warehouse Germany', 'Склад в Германии'],
  ['Warehouse', 'Склад'],
  ['Germany', 'Германия'],

  ['Remote', 'Удалённый'],
  ['model', 'модель'],
  ['regulatory alignment', 'соответствие регуляторным требованиям'],
  ['Regulatory', 'Регуляторный'],
  ['regulatory', 'регуляторный'],
  ['alignment', 'согласование'],
  ['Cross-Border', 'Трансграничный'],
  ['cross-border', 'трансграничный'],

  ['EU', 'ЕС'],
  ['UK', 'Великобритания'],
  ['UAE', 'ОАЭ'],
  ['M&amp;A', 'слияния и поглощения'],
  ['M &amp; A', 'слияния и поглощения'],
  ['M&A', 'слияния и поглощения'],
  ['M & A', 'слияния и поглощения'],

  ['FinTech', 'финтех'],
  ['Website', 'Сайт'],
  ['website', 'сайт']
];

function cleanText(text) {
  let out = text;
  for (const [from, to] of exact) out = out.split(from).join(to);
  out = out
    .replace(/\bPE\b/g, 'постоянное представительство')
    .replace(/\bB2B\b/g, 'корпоративные клиенты')
    .replace(/\bB2C\b/g, 'частные клиенты')
    .replace(/(^|\s)s(?=\s|[.,;:!?)]|$)/g, '$1')
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
  return html.replace(/(<(?:p|h1|h2|h3|h4|li)\b[^>]*>)([\s\S]*?)(<\/(?:p|h1|h2|h3|h4|li)>)/gi, (all, open, body, close) => {
    const next = body.replace(/[а-яё]/, ch => ch.toUpperCase());
    return open + next + close;
  });
}

let changed = 0;
for (const rel of targets) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) throw new Error(`Missing target: ${rel}`);
  const original = fs.readFileSync(file, 'utf8');
  let html = original;

  const held = [];
  html = html.replace(/<(?:script|style)\b[\s\S]*?<\/(?:script|style)>/gi, block => {
    held.push(block);
    return `__LEXONYX_HELD_${held.length - 1}__`;
  });

  html = html.replace(/>([^<>]+)</g, (m, text) => `>${cleanText(text)}<`);
  html = html.replace(/(<meta\b[^>]*\bcontent=["'])([^"']*)(["'][^>]*>)/gi, (m, a, value, b) => a + cleanText(value) + b);
  html = html.replace(/__LEXONYX_HELD_(\d+)__/g, (_, i) => held[Number(i)]);
  html = cleanJsonLd(html);
  html = capitalizeBlocks(html);

  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU insights language curation] changed=${changed}/${targets.length}`);
