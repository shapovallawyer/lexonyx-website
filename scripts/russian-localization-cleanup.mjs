import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function htmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) htmlFiles(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

// Longest / most specific phrases first. These replacements intentionally target
// visible Russian-language copy and Russian metadata; URL paths/classes are lowercase
// and are therefore not affected by the capitalised business terminology below.
const replacements = [
  ['International Structure Architecture', 'Архитектура международных структур'],
  ['International Structuring Advisory', 'Консультирование по международному структурированию'],
  ['Source of Funds / Source of Wealth', 'Происхождение средств / происхождение капитала'],
  ['Source of Funds / SoW', 'Происхождение средств / капитала'],
  ['Source of Funds', 'происхождение средств'],
  ['Source of Wealth', 'происхождение капитала'],
  ['Strategic Structure Audit', 'Стратегический структурный аудит'],
  ['Express Risk Review', 'Экспресс-проверка рисков'],
  ['Ongoing Advisory', 'Постоянное сопровождение'],
  ['Tax Residency and CFC', 'Налоговое резидентство и КИК'],
  ['VAT and Cross-Border Models', 'НДС и трансграничные модели'],
  ['PE-risk and International Teams', 'Риск постоянного представительства и международные команды'],
  ['Banking Readiness', 'Банковская готовность'],
  ['Substance and Governance', 'Фактическое присутствие и корпоративное управление'],
  ['Regulatory Architecture and Licensing', 'Регуляторная архитектура и лицензирование'],
  ['Regulatory Architecture', 'Регуляторная архитектура'],
  ['Group Structuring', 'Структурирование группы'],
  ['Current State', 'текущая модель'],
  ['Target State', 'целевая модель'],
  ['Entity Necessity test', 'проверку необходимости отдельной компании'],
  ['Entity Necessity', 'необходимость отдельной компании'],
  ['Business Purpose', 'деловая цель'],
  ['Operational Reality', 'фактическая операционная модель'],
  ['operational reality', 'фактическая операционная модель'],
  ['German operational reality', 'фактическую операционную модель в Германии'],
  ['cross-border architecture', 'трансграничную архитектуру'],
  ['cross-border design', 'трансграничную модель'],
  ['cross-border specialist coordination', 'координация профильных специалистов по трансграничным вопросам'],
  ['cross-border architecture with coordinated German legal and tax workstreams', 'трансграничная архитектура с координацией немецких юридических и налоговых специалистов'],
  ['coordination of German legal and tax workstreams', 'координация немецких юридических и налоговых направлений'],
  ['German specialist workstreams', 'немецкие юридические и налоговые направления'],
  ['specialist workstreams', 'направления работы профильных специалистов'],
  ['regulatory workstreams', 'регуляторные направления работы'],
  ['tax workstreams', 'налоговые направления работы'],
  ['current-law workstreams', 'направления анализа по действующему праву'],
  ['specialist coordination', 'координация профильных специалистов'],
  ['local professional', 'местный профильный специалист'],
  ['German professionals', 'немецкими профильными специалистами'],
  ['German professional', 'немецкий профильный специалист'],
  ['qualified professionals', 'квалифицированными специалистами'],
  ['qualified local professionals', 'квалифицированными местными специалистами'],
  ['appropriately qualified local professionals', 'надлежащим образом квалифицированными местными специалистами'],
  ['appropriately qualified professionals', 'надлежащим образом квалифицированными специалистами'],
  ['specialist layer', 'уровень профильных специалистов'],
  ['German specialist layer', 'уровень немецких профильных специалистов'],
  ['German nexus', 'связь с Германией'],
  ['German OpCo', 'немецкая операционная компания'],
  ['German corporate', 'немецкому корпоративному праву'],
  ['German legal', 'немецким юридическим'],
  ['German tax', 'немецким налоговым'],
  ['German law', 'немецкому праву'],
  ['Cyprus-specific', 'кипрские'],
  ['Cyprus entity', 'кипрская компания'],
  ['Cyprus HoldCo', 'кипрская холдинговая компания'],
  ['Cyprus law', 'кипрское право'],
  ['Cyprus corporate', 'кипрскому корпоративному праву'],
  ['Cyprus', 'Кипр'],
  ['Germany', 'Германия'],
  ['material jurisdiction', 'значимой юрисдикцией'],
  ['investment activity', 'инвестиционная деятельность'],
  ['operating footprint', 'операционное присутствие'],
  ['operating platform', 'операционная платформа'],
  ['operating entities', 'операционные компании'],
  ['operating company', 'операционная компания'],
  ['foreign principal company', 'иностранная головная компания'],
  ['foreign entity', 'иностранная компания'],
  ['principal company', 'головная компания'],
  ['Principal OpCo', 'Основная операционная компания'],
  ['Management centre', 'Центр управления'],
  ['EU operating platform', 'Операционная платформа в ЕС'],
  ['Founder residence interface', 'Связь с резидентством основателя'],
  ['Investor / Founder HoldCo', 'Холдинговая компания инвестора / основателя'],
  ['International ownership', 'Международная структура владения'],
  ['IP workstream', 'Направление по интеллектуальной собственности'],
  ['Regional business platform', 'Региональная бизнес-платформа'],
  ['ownership layer', 'уровень владения'],
  ['ownership/control', 'владение и контроль'],
  ['ownership', 'структура владения'],
  ['governance', 'корпоративное управление'],
  ['substance', 'фактическое экономическое присутствие'],
  ['banking readiness', 'банковская готовность'],
  ['banking/KYC', 'банковские вопросы и KYC'],
  ['banking', 'банковская инфраструктура'],
  ['management map', 'карта управления'],
  ['management', 'управление'],
  ['decision-making', 'принятие решений'],
  ['executive decisions', 'управленческие решения'],
  ['people', 'персонал'],
  ['customers', 'клиенты'],
  ['employees', 'сотрудники'],
  ['workforce', 'персонал'],
  ['sales', 'продажи'],
  ['contracting', 'заключение договоров'],
  ['contracts', 'договоры'],
  ['premises', 'помещения'],
  ['development control', 'контроль разработки'],
  ['operations', 'операционная деятельность'],
  ['functions', 'функции'],
  ['function', 'функция'],
  ['investor rights', 'права инвесторов'],
  ['investor architecture', 'архитектура отношений с инвесторами'],
  ['investor logic', 'логика для инвесторов'],
  ['founder taxation interfaces', 'налоговые вопросы основателя'],
  ['founder', 'основатель'],
  ['personal residence', 'личное налоговое резидентство'],
  ['distributions', 'распределение прибыли'],
  ['corporate residence', 'налоговое резидентство компании'],
  ['PE indicators', 'индикаторы постоянного представительства'],
  ['PE-risk', 'риск постоянного представительства'],
  ['PE risk', 'риск постоянного представительства'],
  ['CFC', 'КИК'],
  ['VAT', 'НДС'],
  ['transfer pricing', 'трансфертное ценообразование'],
  ['withholding-tax', 'налог у источника'],
  ['withholding tax', 'налог у источника'],
  ['tax exposure', 'налоговый риск'],
  ['tax outcome', 'налоговый результат'],
  ['headline tax outcome', 'формально привлекательного налогового результата'],
  ['tax', 'налоговые'],
  ['regulatory conclusions', 'регуляторные выводы'],
  ['regulatory fit', 'соответствие регуляторным требованиям'],
  ['regulatory perimeter', 'регуляторный периметр'],
  ['regulatory scoping', 'определение регуляторного периметра'],
  ['regulatory', 'регуляторные'],
  ['workstreams', 'направления работы'],
  ['workstream', 'направление работы'],
  ['specialist-confirmed', 'подтверждёнными профильным специалистом'],
  ['specialist confirmation', 'подтверждение профильным специалистом'],
  ['specialist', 'профильный специалист'],
  ['analysis', 'анализ'],
  ['coordination', 'координация'],
  ['architecture', 'архитектура'],
  ['Matter', 'проект'],
  ['entity', 'компания'],
  ['company', 'компания'],
  ['parent level', 'уровень материнской компании'],
  ['board minutes', 'протоколы совета директоров'],
  ['IP title', 'юридическое право на интеллектуальную собственность'],
  ['business purpose', 'деловая цель'],
  ['risk control', 'контроль рисков'],
  ['FAR', 'функции, активы и риски (FAR)'],
  ['HoldCo', 'холдинговая компания'],
  ['OpCo', 'операционная компания'],
  ['ServiceCo', 'сервисная компания'],
  ['FinanceCo', 'финансовая компания'],
  ['IPCo', 'компания — владелец интеллектуальной собственности'],
  ['family office', 'семейный офис'],
  ['advisory', 'консультационное сопровождение'],
  ['interfaces', 'взаимосвязи'],
  ['interface', 'взаимосвязь'],
  ['fact mapping', 'картирование фактов'],
  ['specialist coordination', 'координация профильных специалистов'],
  ['specialist-confirmed', 'подтверждённый профильным специалистом'],
  ['business narrative', 'описание бизнес-модели'],
  ['operating model', 'операционная модель'],
  ['decision trail', 'документированный процесс принятия решений'],
  ['International tax model', 'Международная налоговая модель'],
  ['Group architecture', 'Архитектура группы'],
  ['Tax, VAT & PE interfaces', 'Налоги, НДС и риск постоянного представительства'],
  ['International tax & VAT', 'Международные налоги и НДС'],
  ['Banking & regulatory readiness', 'Банковская и регуляторная готовность'],
  ['Structure types', 'Типы структур'],
  ['Models we work with', 'Модели, с которыми мы работаем'],
  ['holding structure', 'холдинговая структура'],
  ['Service or sales hub', 'Сервисный или сбытовой центр'],
  ['FinanceCo and treasury', 'Финансовая компания и казначейство'],
  ['IP and intangibles', 'Интеллектуальная собственность и нематериальные активы'],
  ['VAT and e-commerce chain', 'НДС и цепочка электронной торговли'],
  ['Private capital structure', 'Структура частного капитала'],
  ['EU · UK · UAE', 'ЕС · Великобритания · ОАЭ'],
  ['EU, UK and UAE', 'ЕС, Великобритании и ОАЭ'],
  ['EU, UK, UAE', 'ЕС, Великобритания, ОАЭ']
];

function localize(html) {
  let out = html;
  for (const [from, to] of replacements) out = out.split(from).join(to);
  // Russian metadata should not advertise an English-only non-existent site search action.
  out = out.replace(/\s*<script type="application\/ld\+json">\s*\{\s*"@context":"https:\/\/schema\.org",\s*"@type":"WebSite",[\s\S]*?"SearchAction"[\s\S]*?<\/script>/gi, '');
  // Ensure Ukrainian alternate is present on the Russian homepage when the map provides it at build time elsewhere.
  return out;
}

let changed = 0;
for (const file of htmlFiles(path.join(ROOT, 'ru'))) {
  const original = fs.readFileSync(file, 'utf8');
  const html = localize(original);
  if (html !== original) { fs.writeFileSync(file, html, 'utf8'); changed++; }
}

// The compliance runtime can otherwise re-introduce mixed English/Russian wording after DOM load.
const runtime = path.join(ROOT, 'scripts', 'compliance-runtime.js');
if (fs.existsSync(runtime)) {
  const original = fs.readFileSync(runtime, 'utf8');
  let patched = original;
  const runtimeReplacements = [
    ['current-law workstreams', 'направления анализа по действующему праву'],
    ['ownership', 'структура владения'],
    ['governance', 'корпоративное управление'],
    ['specialist coordination', 'координация профильных специалистов'],
    ['specialist confirmation', 'подтверждение профильным специалистом'],
    ['specialist-confirmed', 'подтверждёнными профильным специалистом'],
    ['specialist', 'профильный специалист'],
    ['Target State', 'целевая модель'],
    ['Current State', 'текущая модель'],
    ['Entity Necessity', 'необходимость отдельной компании'],
    ['Business Purpose', 'деловая цель'],
    ['Matter', 'проект'],
    ['workstreams', 'направления работы'],
    ['workstream', 'направление работы'],
    ['regulatory perimeter', 'регуляторный периметр'],
    ['regulatory conclusions', 'регуляторные выводы'],
    ['regulatory', 'регуляторные'],
    ['banking', 'банковская инфраструктура'],
    ['management', 'управление'],
    ['VAT', 'НДС'],
    ['PE-risk', 'риск постоянного представительства'],
    ['PE risk', 'риск постоянного представительства'],
    ['CFC', 'КИК'],
    ['tax', 'налоговые'],
    ['cross-border', 'трансграничный'],
    ['local professional', 'местный профильный специалист'],
    ['qualified local professionals', 'квалифицированными местными специалистами']
  ];
  // Limit these runtime replacements to the Russian copy object only.
  const ruStart = patched.indexOf('      ru: {');
  const ukStart = patched.indexOf('      uk: {', ruStart + 1);
  if (ruStart >= 0 && ukStart > ruStart) {
    let ruBlock = patched.slice(ruStart, ukStart);
    for (const [from,to] of runtimeReplacements) ruBlock = ruBlock.split(from).join(to);
    patched = patched.slice(0, ruStart) + ruBlock + patched.slice(ukStart);
  }
  if (patched !== original) fs.writeFileSync(runtime, patched, 'utf8');
}

console.log(`[LEXONYX RU localization] changed HTML=${changed}`);
