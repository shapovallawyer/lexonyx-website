import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const RU = path.join(ROOT, 'ru');

function htmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) htmlFiles(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Long phrases first. The goal is idiomatic Russian, not literal word-for-word substitution.
const replacements = [
  ['International Structure Architecture', 'Архитектура международных структур'],
  ['International Structuring Advisory', 'Консультации по международному структурированию'],
  ['International business structure architecture', 'Архитектура международной структуры бизнеса'],
  ['international business structure architecture', 'архитектура международной структуры бизнеса'],
  ['international business structures', 'международные структуры бизнеса'],
  ['international business structure', 'международная структура бизнеса'],
  ['international business', 'международный бизнес'],
  ['cross-border architecture', 'трансграничная архитектура'],
  ['cross-border design', 'трансграничная архитектура'],
  ['cross-border analysis', 'трансграничный анализ'],
  ['cross-border specialist coordination', 'координация с профильными специалистами по трансграничным вопросам'],
  ['cross-border teams', 'международные команды'],
  ['cross-border models', 'трансграничные модели'],
  ['cross-border', 'трансграничный'],

  ['German legal and tax workstreams', 'направления работы по немецкому праву и налогообложению'],
  ['German specialist workstreams', 'направления работы с немецкими профильными специалистами'],
  ['specialist workstreams', 'направления работы с профильными специалистами'],
  ['regulatory workstreams', 'регуляторные направления работы'],
  ['tax workstreams', 'налоговые направления работы'],
  ['workstream coordination', 'координация профильных направлений работы'],
  ['workstreams', 'направления работы'],

  ['appropriately qualified professionals', 'специалисты с необходимой профессиональной квалификацией'],
  ['appropriately qualified local professionals', 'местные специалисты с необходимой профессиональной квалификацией'],
  ['qualified local professionals', 'квалифицированные местные специалисты'],
  ['qualified German professionals', 'квалифицированные немецкие специалисты'],
  ['German professionals', 'немецкие специалисты'],
  ['local professionals', 'местные специалисты'],
  ['local specialists', 'местные специалисты'],
  ['specialist confirmation', 'подтверждение профильным специалистом'],
  ['specialist coordination', 'координация с профильными специалистами'],
  ['specialist layer', 'уровень профильных специалистов'],

  ['Business Purpose', 'деловая цель'],
  ['business purpose', 'деловая цель'],
  ['Target State', 'целевая модель'],
  ['Current State', 'текущая модель'],
  ['Entity Necessity', 'необходимость отдельной компании'],
  ['operating reality', 'фактическая операционная модель'],
  ['operational reality', 'фактическая операционная модель'],
  ['operating footprint', 'фактическое операционное присутствие'],
  ['operating platform', 'операционная платформа'],
  ['operating company', 'операционная компания'],
  ['operating companies', 'операционные компании'],
  ['operating model', 'операционная модель'],
  ['business model', 'бизнес-модель'],

  ['ownership and control', 'владение и контроль'],
  ['ownership/control', 'владение и контроль'],
  ['ownership', 'структура владения'],
  ['governance model', 'модель корпоративного управления'],
  ['governance', 'корпоративное управление'],
  ['substance and governance', 'фактическое присутствие и корпоративное управление'],
  ['substance', 'фактическое присутствие'],
  ['management map', 'карта управления'],
  ['management centre', 'центр управления'],
  ['management center', 'центр управления'],
  ['effective management', 'фактическое управление'],
  ['management', 'управление'],
  ['executive decisions', 'управленческие решения'],

  ['Banking Readiness', 'Банковская готовность'],
  ['banking readiness', 'банковская готовность'],
  ['banking flows', 'банковские потоки'],
  ['banking architecture', 'банковская архитектура'],
  ['banking/KYC', 'банковские требования и KYC'],
  ['banking', 'банковская инфраструктура'],
  ['KYC narrative', 'обоснование для KYC'],

  ['Source of Funds / Source of Wealth', 'Источник средств / источник благосостояния'],
  ['Source of Funds / SoW', 'Источник средств / источник благосостояния'],
  ['Source of Funds', 'Источник средств'],
  ['Source of Wealth', 'Источник благосостояния'],
  ['source of funds', 'источник средств'],
  ['source of wealth', 'источник благосостояния'],
  ['SoF / SoW', 'источник средств / источник благосостояния'],
  ['SOF/SOW', 'источник средств / источник благосостояния'],
  ['SOF / SOW', 'источник средств / источник благосостояния'],

  ['Tax Residency and CFC', 'Налоговое резидентство и КИК'],
  ['tax residency and CFC', 'налоговое резидентство и КИК'],
  ['tax residency', 'налоговое резидентство'],
  ['CFC fact and control map', 'карта фактов и контроля для КИК'],
  ['CFC fact mapping', 'карта фактов для КИК'],
  ['CFC indicators', 'индикаторы КИК'],
  ['CFC exposure', 'риски по правилам КИК'],
  ['CFC', 'КИК'],
  ['Residence', 'Резидентство'],
  ['residence', 'резидентство'],

  ['VAT and Cross-Border Models', 'НДС и трансграничные модели'],
  ['VAT transaction mapping', 'карта операций для целей НДС'],
  ['VAT presence', 'присутствие для целей НДС'],
  ['VAT requirements', 'требования по НДС'],
  ['VAT registration', 'регистрация по НДС'],
  ['VAT', 'НДС'],
  ['OSS / IOSS', 'OSS / IOSS'],

  ['PE-risk and International Teams', 'Риск постоянного представительства и международные команды'],
  ['PE-risk', 'риск постоянного представительства'],
  ['PE risk', 'риск постоянного представительства'],
  ['PE indicators', 'индикаторы постоянного представительства'],
  ['PE analysis', 'анализ риска постоянного представительства'],
  ['PE', 'постоянное представительство'],

  ['transfer-pricing', 'трансфертного ценообразования'],
  ['transfer pricing', 'трансфертное ценообразование'],
  ['Transfer Pricing', 'Трансфертное ценообразование'],
  ['TP', 'трансфертное ценообразование'],
  ['FAR analysis', 'анализ функций, активов и рисков'],
  ['FAR', 'анализ функций, активов и рисков'],

  ['DTT and WHT', 'СИДН и налог у источника'],
  ['DTT', 'СИДН'],
  ['withholding-tax analysis', 'анализ налога у источника'],
  ['withholding tax', 'налог у источника'],
  ['withholding-tax', 'налог у источника'],
  ['WHT', 'налог у источника'],
  ['Treaty and anti-abuse interfaces', 'СИДН и правила против злоупотреблений'],
  ['Treaty access', 'доступ к преимуществам СИДН'],
  ['treaty benefits', 'преимущества СИДН'],
  ['treaty position', 'позиция по СИДН'],
  ['treaty rules', 'правила СИДН'],
  ['treaty', 'СИДН'],
  ['anti-abuse rules', 'правила против злоупотреблений'],
  ['anti-abuse', 'противодействие злоупотреблениям'],
  ['beneficial ownership', 'фактическое право на доход'],
  ['beneficial-ownership', 'фактическое право на доход'],
  ['profit allocation', 'распределение прибыли'],
  ['cash flows', 'денежные потоки'],
  ['cash flow', 'денежный поток'],

  ['Regulatory Architecture and Licensing', 'Регуляторная архитектура и лицензирование'],
  ['Regulatory Architecture', 'Регуляторная архитектура'],
  ['regulatory architecture', 'регуляторная архитектура'],
  ['regulatory scoping', 'определение регуляторного периметра'],
  ['regulatory perimeter', 'периметр регулирования'],
  ['regulatory fit', 'соответствие регуляторным требованиям'],
  ['regulatory conclusions', 'регуляторные выводы'],
  ['regulatory requirements', 'регуляторные требования'],
  ['regulatory counsel', 'профильный юрист по регуляторным вопросам'],
  ['regulatory', 'регуляторный'],
  ['licensing perimeter', 'границы лицензируемой деятельности'],
  ['licensing status', 'статус лицензирования'],
  ['re-authorisation', 'повторное лицензирование'],
  ['prudential requirements', 'пруденциальные требования'],
  ['prudential safeguards', 'пруденциальные меры защиты'],
  ['safeguarding', 'защита клиентских средств'],
  ['supervisory expectations', 'ожидания надзорного органа'],
  ['supervisory requirements', 'надзорные требования'],
  ['current-law', 'действующее регулирование'],

  ['Professional perimeter', 'Профессиональные рамки'],
  ['professional perimeter', 'профессиональные рамки'],
  ['factual and structural map', 'карта фактов и структуры'],
  ['factual map', 'карта фактов'],
  ['fact mapping', 'картирование фактов'],
  ['risk indicators', 'индикаторы риска'],
  ['risk map', 'карта рисков'],
  ['Risk Map', 'Карта рисков'],
  ['Issue Map', 'Карта вопросов'],
  ['Preliminary Issue Map', 'Предварительная карта вопросов'],
  ['review', 'проверка'],

  ['Founder residence interface', 'Связь с резидентством основателя'],
  ['founder residence interface', 'связь с резидентством основателя'],
  ['founder taxation interfaces', 'вопросы налогообложения основателя'],
  ['founder relocation', 'переезд основателя'],
  ['founder', 'основатель'],
  ['founders', 'основатели'],
  ['investor rights', 'права инвесторов'],
  ['investor architecture', 'архитектура отношений с инвесторами'],
  ['investment activity', 'инвестиционная деятельность'],
  ['investment', 'инвестиции'],
  ['workforce and payroll', 'персонал и расчёт заработной платы'],
  ['workforce', 'персонал'],
  ['employees', 'сотрудники'],
  ['customers', 'клиенты'],
  ['customer contracting', 'договоры с клиентами'],
  ['contracting', 'договорная деятельность'],
  ['sales', 'продажи'],
  ['people', 'команда'],
  ['operations', 'операционная деятельность'],

  ['Principal OpCo', 'Основная операционная компания'],
  ['EU operating platform', 'Операционная платформа в ЕС'],
  ['Foreign entity', 'Иностранная компания'],
  ['foreign entity', 'иностранная компания'],
  ['foreign principal company', 'иностранная основная компания'],
  ['German OpCo', 'немецкая операционная компания'],
  ['German nexus', 'связь с Германией'],
  ['German operational reality', 'фактическая деятельность в Германии'],
  ['German corporate', 'немецкое корпоративное право'],
  ['German tax', 'немецкое налоговое право'],
  ['German employment', 'немецкое трудовое право'],
  ['German regulatory', 'немецкое регуляторное право'],
  ['German legal', 'немецкое право'],
  ['Germany', 'Германия'],
  ['German', 'немецкий'],

  ['STRUCTURAL INTERFACES', 'СТРУКТУРНЫЕ СВЯЗИ'],
  ['WHEN NOT TO USE', 'КОГДА НЕ СЛЕДУЕТ ИСПОЛЬЗОВАТЬ'],
  ['OPERATING REALITY', 'ФАКТИЧЕСКАЯ ОПЕРАЦИОННАЯ МОДЕЛЬ'],
  ['CORE JURISDICTIONS', 'КЛЮЧЕВЫЕ ЮРИСДИКЦИИ'],
  ['ADDITIONAL JURISDICTIONS', 'ДОПОЛНИТЕЛЬНЫЕ ЮРИСДИКЦИИ'],
  ['HOW WE WORK', 'КАК МЫ РАБОТАЕМ'],
  ['PRINCIPLE', 'ПРИНЦИП'],
  ['TYPICAL ROLES', 'ТИПИЧНЫЕ РОЛИ'],

  ['Group Structuring', 'Структурирование группы'],
  ['group structuring', 'структурирование группы'],
  ['group architecture', 'архитектура группы'],
  ['Group architecture', 'Архитектура группы'],
  ['holding structure', 'холдинговая структура'],
  ['Holding structure', 'Холдинговая структура'],
  ['HoldCo', 'холдинговая компания'],
  ['OpCo', 'операционная компания'],
  ['ServiceCo', 'сервисная компания'],
  ['FinanceCo', 'финансовая компания'],
  ['IPCo', 'компания — владелец интеллектуальной собственности'],
  ['DevelopmentCo', 'компания-разработчик'],
  ['UBO', 'КБВ'],
  ['IP-income', 'доход от интеллектуальной собственности'],
  ['IP and intangibles', 'интеллектуальная собственность и нематериальные активы'],
  ['R&D', 'НИОКР'],
  ['HQ', 'головной офис'],
  ['family office', 'семейный офис'],
  ['Family Office', 'Семейный офис'],
  ['advisory', 'консультационное сопровождение'],

  ['e-commerce', 'электронная коммерция'],
  ['E-commerce', 'Электронная коммерция'],
  ['marketplace', 'маркетплейс'],
  ['marketplaces', 'маркетплейсы'],
  ['fulfilment', 'фулфилмент'],
  ['fintech', 'финтех'],
  ['crypto-assets', 'криптоактивы'],
  ['crypto-asset', 'криптоактив'],
  ['payment services', 'платёжные услуги'],
  ['payment-service', 'платёжный'],
  ['payment model', 'платёжная модель'],
  ['payment-services', 'платёжных услуг'],

  ['EU', 'ЕС'],
  ['United Kingdom', 'Великобритания'],
  ['UK', 'Великобритания'],
  ['United Arab Emirates', 'Объединённые Арабские Эмираты'],
  ['UAE', 'ОАЭ'],
  ['European Union', 'Европейский союз'],
  ['EEA', 'ЕЭЗ'],

  ['email', 'электронная почта'],
  ['Email', 'Электронная почта'],
  ['Cookie Policy', 'Политика файлов cookie'],
  ['Cookie Settings', 'Настройки файлов cookie'],
  ['cookies', 'файлы cookie'],
  ['Cookies', 'Файлы cookie'],
  ['cookie', 'файл cookie'],

  ['compliance-compatible', 'соответствующие требованиям комплаенса'],
  ['compliance', 'комплаенс'],
  ['Compliance', 'Комплаенс'],
  ['adviser — client', 'консультант — клиент'],
  ['adviser-client', 'консультант — клиент'],
  ['legal notice', 'правовая информация'],
  ['Legal Notice', 'Правовая информация'],
  ['Privacy Policy', 'Политика конфиденциальности'],
  ['Terms of Use', 'Условия использования'],
  ['Accessibility', 'Доступность'],

  ['Matter', 'проект'],
  ['matter', 'проект'],
  ['conclusion', 'вывод'],
  ['conclusions', 'выводы'],
  ['coordination', 'координация'],
  ['interface', 'взаимосвязь'],
  ['interfaces', 'взаимосвязи'],
  ['architecture', 'архитектура'],
  ['Architecture', 'Архитектура'],
  ['model', 'модель'],
  ['framework', 'система'],
  ['scoping', 'определение объёма анализа'],
  ['implementation', 'реализация'],
  ['evidence', 'доказательная база'],
  ['evidence-based', 'подтверждённый доказательствами'],
  ['decision trail', 'документированный процесс принятия решений'],
  ['business narrative', 'описание бизнес-логики'],
  ['red flags', 'красные флаги'],
  ['Red Flags', 'Красные флаги'],
  ['use cases', 'сценарии использования'],
  ['Use Cases', 'Сценарии использования']
];

const compiled = replacements
  .sort((a,b) => b[0].length - a[0].length)
  .map(([from,to]) => [new RegExp(esc(from), 'gi'), to]);

function localizeText(s) {
  let out = s;
  for (const [re,to] of compiled) out = out.replace(re, to);
  // Clean common mixed-language artefacts after the phrase pass.
  out = out
    .replace(/\bGerman\b/gi, 'немецкий')
    .replace(/\bforeign\b/gi, 'иностранный')
    .replace(/\bmaterial jurisdiction\b/gi, 'существенной юрисдикцией')
    .replace(/\bmaterial\b/gi, 'существенный')
    .replace(/\bcorporate residence\b/gi, 'корпоративное резидентство')
    .replace(/\bcorporate\b/gi, 'корпоративный')
    .replace(/\bpersonal residence\b/gi, 'личное резидентство')
    .replace(/\bpersonal\b/gi, 'личный')
    .replace(/\bdistributions\b/gi, 'распределения прибыли')
    .replace(/\bactivity\b/gi, 'деятельность')
    .replace(/\bactivities\b/gi, 'виды деятельности')
    .replace(/\brequirements\b/gi, 'требования')
    .replace(/\brules\b/gi, 'правила')
    .replace(/\bcapital\b/gi, 'капитал')
    .replace(/\btiming\b/gi, 'сроки')
    .replace(/\bpassporting\b/gi, 'паспортирование')
    .replace(/\bsubstantive\b/gi, 'содержательный')
    .replace(/\bfactual\b/gi, 'фактический')
    .replace(/\bstructural\b/gi, 'структурный')
    .replace(/\binternational\b/gi, 'международный')
    .replace(/\bpublic international law\b/gi, 'международное публичное право')
    .replace(/\bUkrainian-law\b/gi, 'украинское право')
    .replace(/\bUkrainian law\b/gi, 'украинское право')
    .replace(/\bUkraine\b/gi, 'Украина')
    .replace(/\bAdvokat\b/gi, 'адвокат')
    .replace(/\s{2,}/g, ' ');
  return out;
}

function transformVisibleText(html) {
  const tagRe = /<[^>]+>/g;
  let out = '', pos = 0, skip = null, m;
  while ((m = tagRe.exec(html))) {
    const text = html.slice(pos, m.index);
    out += skip ? text : localizeText(text);
    const tag = m[0];
    out += tag;
    const open = tag.match(/^<\s*(script|style|svg)\b/i);
    const close = tag.match(/^<\s*\/\s*(script|style|svg)\b/i);
    if (open && !/\/\s*>$/.test(tag)) skip = open[1].toLowerCase();
    if (close && skip === close[1].toLowerCase()) skip = null;
    pos = tagRe.lastIndex;
  }
  out += skip ? html.slice(pos) : localizeText(html.slice(pos));
  return out;
}

function localizeMeta(html) {
  return html.replace(/<meta\b[^>]*(?:name|property)=["'](?:description|og:title|og:description|twitter:title|twitter:description)["'][^>]*>/gi, tag => {
    return tag.replace(/content=(["'])([\s\S]*?)\1/i, (_, q, value) => `content=${q}${localizeText(value)}${q}`);
  });
}

function localizeJsonLd(html) {
  return html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi, (block, raw) => {
    try {
      const data = JSON.parse(raw);
      const walk = (v, key = '') => {
        if (Array.isArray(v)) return v.map(x => walk(x, key));
        if (v && typeof v === 'object') {
          for (const k of Object.keys(v)) v[k] = walk(v[k], k);
          return v;
        }
        if (typeof v !== 'string') return v;
        if (/^https?:\/\//i.test(v) || key.startsWith('@') || ['url','logo','item'].includes(key)) return v;
        return localizeText(v);
      };
      const updated = JSON.stringify(walk(data));
      return block.replace(raw, updated);
    } catch {
      return block;
    }
  });
}

let changed = 0;
let scanned = 0;
for (const file of htmlFiles(RU)) {
  scanned++;
  const original = fs.readFileSync(file, 'utf8');
  let html = localizeMeta(original);
  html = localizeJsonLd(html);
  html = transformVisibleText(html);
  if (html !== original) {
    fs.writeFileSync(file, html, 'utf8');
    changed++;
  }
}

console.log(`[LEXONYX RU localization] scanned=${scanned}, changed=${changed}`);
