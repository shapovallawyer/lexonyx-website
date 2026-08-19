import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const pages = {
  en: {
    tax: 'en/expertise/tax-residency-cfc.html',
    vat: 'en/expertise/vat-cross-border.html',
    pe: 'en/expertise/pe-risk-international-teams.html',
    reg: 'en/expertise/regulatory-licensing.html'
  },
  ru: {
    tax: 'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
    vat: 'ru/ekspertiza/vat-i-transgranichnye-modeli.html',
    pe: 'ru/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html',
    reg: 'ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html'
  },
  uk: {
    tax: 'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
    vat: 'uk/ekspertyza/vat-ta-transkordonni-modeli.html',
    pe: 'uk/ekspertyza/pe-ryzyk-ta-mizhnarodni-komandy.html',
    reg: 'uk/ekspertyza/regulyatorna-arhitektura-ta-litsenzuvannya.html'
  }
};

const copy = {
  en: {
    taxHero: 'Tax-residency and CFC analysis begins with incorporation, management, control and ownership facts. Jurisdiction-specific residence, CFC and personal-tax conclusions are confirmed by appropriately qualified tax professionals.',
    cfcTitle: 'CFC fact and control map',
    cfcBody: 'Ownership, control, entity and income facts are mapped to identify CFC issues requiring jurisdiction-specific tax confirmation.',
    treatyTitle: 'Treaty and anti-abuse interfaces',
    treatyBody: 'Flows, ownership, purpose and factual indicators relevant to DTT, WHT, beneficial-ownership and anti-abuse analysis are mapped for jurisdiction-specific specialist confirmation.',
    cfcResult: 'A map of CFC indicators, ownership and control facts, and questions requiring jurisdiction-specific tax confirmation.',
    taxNote: 'The purpose is to align the factual and governance model so that the relevant tax position can be confirmed under the applicable current rules.',
    vatPlace: 'Transaction facts relevant to place-of-supply analysis, prepared for jurisdiction-specific VAT confirmation.',
    vatOss: 'A transaction map and regime indicators prepared for specialist confirmation of OSS / IOSS applicability and exceptions.',
    vatResultOss: 'A transaction map and list of OSS / IOSS questions requiring specialist confirmation.',
    vatResultPresence: 'A map of VAT-presence indicators and questions requiring jurisdiction-specific confirmation.',
    vatResultAligned: 'An operating model in which sales and money movement are mapped against specialist-confirmed VAT requirements.',
    vatWarehouse: 'Potentially. A warehouse, inventory or fulfilment centre in another country can create facts relevant to VAT registration or fixed-establishment analysis. The jurisdiction-specific result depends on the applicable VAT rules and should be confirmed before implementation.',
    peMgmtTitle: 'Management / residence interface',
    peMgmtBody: 'Strategic and management decisions taken in another jurisdiction may be relevant to corporate residence, PE or other tax analysis; the jurisdiction-specific conclusion depends on applicable domestic and treaty rules.',
    peTax: 'Potential corporate-tax exposure in the country of actual presence, subject to jurisdiction-specific confirmation.',
    pePenalty: 'Potential interest, penalties or reassessment if local filing or tax obligations are confirmed and were not met.',
    peFaq: 'Potentially. A single person can create facts relevant to PE analysis depending on functions, authority, negotiation and contracting activity, governance and the applicable domestic and treaty rules. The jurisdiction-specific conclusion requires specialist confirmation.',
    regHero: 'Licensing architecture depends on the business model, regulated activities, jurisdiction, capital, governance and rules current at the time of the project.',
    regContextTitle: 'Current regulatory context',
    regContextIntro: 'MiCA, the EU payment-services reform and the AML package are treated as current-law workstreams and verified for the project at the time of analysis.',
    mica: 'MiCA establishes an EU authorisation framework for crypto-asset service providers. Activity classification, prudential requirements, transitional position and supervisory expectations are verified for the project and jurisdiction.',
    psd: 'The EU payment-services reform remains a current-law workstream. Final text, adoption status, transition and any re-authorisation consequences are verified against authoritative materials current at the time of the project.',
    amlr: 'The EU AML package has been adopted, while major AMLR provisions apply from July 2027 subject to specific transitional timing. Current and future requirements are separated explicitly in each project.',
    emi: 'Electronic-money and payment-service models may require authorisation and prudential safeguards. The applicable regime, capital and governance requirements depend on the exact activities and current local implementation.',
    pi: 'Payment-service models may fall within an authorisation, exemption or other regulated perimeter. Capital, safeguarding and governance requirements are confirmed for the specific model and jurisdiction.',
    casp: 'Crypto-asset activities may fall within MiCA CASP authorisation. The relevant service class, prudential safeguards and supervisory requirements are confirmed for the specific activities.',
    regStep1: 'We decompose the business model into activities and map licensing, exemption and regulatory-perimeter questions for confirmation by appropriately qualified regulatory counsel.',
    regStep2: 'We compare structural and operational factors across candidate jurisdictions. Local legal feasibility, licensing status, timing and regulatory conclusions are confirmed by appropriately qualified local professionals.',
    regCompare: 'EU, UK and UAE routes differ in passporting, supervisory practice, local substance, banking, timing and implementation. No jurisdiction is selected solely on perceived speed or market reputation.',
    regEu: 'EU jurisdictions are compared on the same factual model: activity perimeter, target markets, governance, substance, banking and implementation. Regulatory feasibility and timing are confirmed with local specialists.',
    regFaqLicences: 'EMI, PI and CASP are different regulatory categories. The applicable category, authorisation route, prudential requirements and capital depend on the exact services, jurisdiction and current rules, and are confirmed by the relevant regulatory specialist.',
    regFaqChanges: 'MiCA, EU payment-services reform and the AML package affect different parts of the regulatory model. Their current status, transitional rules and implementation consequences are verified from authoritative sources for each project.'
  },
  ru: {
    taxHero: 'Анализ налогового резидентства и КИК начинается с фактов об инкорпорации, управлении, контроле и ownership. Юрисдикционно-специфические выводы о резидентстве, КИК и личном налогообложении подтверждаются квалифицированными налоговыми специалистами.',
    cfcTitle: 'Карта фактов и контроля для КИК',
    cfcBody: 'Мы картируем ownership, контроль, компании и доходы, чтобы выделить вопросы КИК, требующие юрисдикционно-специфического налогового подтверждения.',
    treatyTitle: 'Treaty и anti-abuse интерфейсы',
    treatyBody: 'Потоки, ownership, цели и факты, релевантные для DTT, WHT, beneficial ownership и anti-abuse анализа, структурируются для подтверждения соответствующим налоговым специалистом.',
    cfcResult: 'Карта индикаторов КИК, фактов об ownership и контроле и перечень вопросов, требующих юрисдикционно-специфического налогового подтверждения.',
    taxNote: 'Цель — согласовать фактическую и governance-модель так, чтобы соответствующая налоговая позиция могла быть подтверждена по действующим применимым правилам.',
    vatPlace: 'Факты сделки, релевантные для анализа места поставки, подготовленные для юрисдикционно-специфического VAT-подтверждения.',
    vatOss: 'Карта транзакций и индикаторов режима, подготовленная для подтверждения применимости OSS / IOSS и исключений профильным специалистом.',
    vatResultOss: 'Карта транзакций и перечень вопросов по OSS / IOSS, требующих подтверждения профильным специалистом.',
    vatResultPresence: 'Карта индикаторов VAT presence и вопросов, требующих юрисдикционно-специфического подтверждения.',
    vatResultAligned: 'Операционная модель, в которой продажи и движение денег сопоставлены с подтверждёнными специалистом VAT-требованиями.',
    vatWarehouse: 'Потенциально. Склад, товарные остатки или fulfilment-центр в другой стране могут создавать факты, релевантные для VAT-регистрации или анализа fixed establishment. Конкретный вывод зависит от применимых правил и требует подтверждения до внедрения.',
    peMgmtTitle: 'Интерфейс управления / резидентства',
    peMgmtBody: 'Стратегические и управленческие решения в другой юрисдикции могут быть релевантны для анализа корпоративного резидентства, PE или иных налоговых вопросов; конкретный вывод зависит от внутреннего права и применимого договора.',
    peTax: 'Потенциальная корпоративная налоговая экспозиция в стране фактического присутствия — при условии юрисдикционно-специфического подтверждения.',
    pePenalty: 'Потенциальные проценты, штрафы или перерасчёт, если локальные обязанности будут подтверждены и ранее не выполнялись.',
    peFaq: 'Потенциально. Один человек может создавать факты, релевантные для PE-анализа, в зависимости от функций, полномочий, переговоров и заключения договоров, governance и применимых внутренних и treaty-правил. Юрисдикционно-специфический вывод требует подтверждения специалистом.',
    regHero: 'Регуляторная и лицензионная архитектура зависит от бизнес-модели, регулируемых видов деятельности, юрисдикции, капитала, governance и правил, действующих на момент проекта.',
    regContextTitle: 'Актуальный регуляторный контекст',
    regContextIntro: 'MiCA, реформа платёжных услуг ЕС и AML-пакет рассматриваются как отдельные current-law workstreams и проверяются на дату конкретного проекта.',
    mica: 'MiCA устанавливает общеевропейскую рамку авторизации провайдеров услуг с криптоактивами. Точная квалификация деятельности, prudential requirements, переходный режим и ожидания надзора проверяются для конкретного проекта и юрисдикции.',
    psd: 'Реформа платёжных услуг ЕС остаётся current-law workstream. Финальный текст, статус принятия, переходные положения и возможные последствия для re-authorisation проверяются по авторитетным материалам на дату проекта.',
    amlr: 'AML-пакет ЕС принят, при этом основные положения AMLR применяются с июля 2027 года с учётом отдельных переходных сроков. В каждом проекте чётко разделяются действующие и будущие требования.',
    emi: 'Модели электронных денег и платёжных услуг могут требовать авторизации и prudential safeguards. Применимый режим, капитал и governance зависят от точных видов деятельности и актуального локального регулирования.',
    pi: 'Платёжная модель может попадать в лицензируемый, исключённый или иной регулируемый периметр. Требования к капиталу, safeguarding и governance подтверждаются для конкретной модели и юрисдикции.',
    casp: 'Деятельность с криптоактивами может попадать под MiCA CASP authorisation. Класс услуг, prudential safeguards и supervisory requirements подтверждаются для конкретных видов деятельности.',
    regStep1: 'Мы раскладываем бизнес-модель на виды деятельности и картируем вопросы лицензирования, исключений и regulatory perimeter для подтверждения квалифицированным регуляторным специалистом.',
    regStep2: 'Мы сравниваем структурные и операционные факторы в кандидатных юрисдикциях. Локальная юридическая реализуемость, лицензионный статус, сроки и регуляторные выводы подтверждаются надлежащим образом квалифицированными местными специалистами.',
    regCompare: 'Маршруты в ЕС, Великобритании и ОАЭ различаются по passporting, надзорной практике, local substance, банкингу, срокам и внедрению. Юрисдикция не выбирается только по предполагаемой скорости или рыночной репутации.',
    regEu: 'Юрисдикции ЕС сравниваются на одной фактической модели: regulatory perimeter, целевые рынки, governance, substance, banking и implementation. Регуляторная реализуемость и сроки подтверждаются местными специалистами.',
    regFaqLicences: 'EMI, PI и CASP — разные регуляторные категории. Применимая категория, маршрут авторизации, prudential requirements и капитал зависят от точных услуг, юрисдикции и действующих правил и подтверждаются профильным регуляторным специалистом.',
    regFaqChanges: 'MiCA, реформа платёжных услуг ЕС и AML-пакет затрагивают разные части регуляторной модели. Их текущий статус, переходные правила и последствия для внедрения проверяются по авторитетным источникам для каждого проекта.'
  },
  uk: {
    taxHero: 'Аналіз податкового резидентства та КІК починається з фактів про інкорпорацію, управління, контроль і ownership. Юрисдикційно-специфічні висновки щодо резидентства, КІК та особистого оподаткування підтверджуються кваліфікованими податковими фахівцями.',
    cfcTitle: 'Карта фактів і контролю для КІК',
    cfcBody: 'Ми картуємо ownership, контроль, компанії та доходи, щоб виділити питання КІК, які потребують юрисдикційно-специфічного податкового підтвердження.',
    treatyTitle: 'Treaty та anti-abuse інтерфейси',
    treatyBody: 'Потоки, ownership, цілі та факти, релевантні для DTT, WHT, beneficial ownership та anti-abuse аналізу, структуруються для підтвердження відповідним податковим фахівцем.',
    cfcResult: 'Карта індикаторів КІК, фактів про ownership і контроль та перелік питань, що потребують юрисдикційно-специфічного податкового підтвердження.',
    taxNote: 'Мета — узгодити фактичну та governance-модель так, щоб відповідна податкова позиція могла бути підтверджена за чинними застосовними правилами.',
    vatPlace: 'Факти операції, релевантні для аналізу місця постачання, підготовлені для юрисдикційно-специфічного VAT-підтвердження.',
    vatOss: 'Карта транзакцій та індикаторів режиму, підготовлена для підтвердження застосовності OSS / IOSS і винятків профільним фахівцем.',
    vatResultOss: 'Карта транзакцій і перелік питань щодо OSS / IOSS, які потребують підтвердження профільним фахівцем.',
    vatResultPresence: 'Карта індикаторів VAT presence і питань, що потребують юрисдикційно-специфічного підтвердження.',
    vatResultAligned: 'Операційна модель, у якій продажі та рух коштів зіставлені з підтвердженими фахівцем VAT-вимогами.',
    vatWarehouse: 'Потенційно. Склад, товарні залишки або fulfilment-центр в іншій країні можуть створювати факти, релевантні для VAT-реєстрації чи аналізу fixed establishment. Конкретний висновок залежить від застосовних правил і потребує підтвердження до впровадження.',
    peMgmtTitle: 'Інтерфейс управління / резидентства',
    peMgmtBody: 'Стратегічні та управлінські рішення в іншій юрисдикції можуть бути релевантні для аналізу корпоративного резидентства, PE чи інших податкових питань; конкретний висновок залежить від внутрішнього права та застосовного договору.',
    peTax: 'Потенційна корпоративна податкова експозиція в країні фактичної присутності — за умови юрисдикційно-специфічного підтвердження.',
    pePenalty: 'Потенційні проценти, штрафи або перерахунок, якщо локальні обов’язки будуть підтверджені та раніше не виконувалися.',
    peFaq: 'Потенційно. Одна особа може створювати факти, релевантні для PE-аналізу, залежно від функцій, повноважень, переговорів і укладення договорів, governance та застосовних внутрішніх і treaty-правил. Юрисдикційно-специфічний висновок потребує підтвердження фахівцем.',
    regHero: 'Регуляторна та ліцензійна архітектура залежить від бізнес-моделі, регульованих видів діяльності, юрисдикції, капіталу, governance і правил, чинних на момент проєкту.',
    regContextTitle: 'Актуальний регуляторний контекст',
    regContextIntro: 'MiCA, реформа платіжних послуг ЄС та AML-пакет розглядаються як окремі current-law workstreams і перевіряються на дату конкретного проєкту.',
    mica: 'MiCA встановлює загальноєвропейську рамку авторизації провайдерів послуг з криптоактивами. Точна кваліфікація діяльності, prudential requirements, перехідний режим та очікування нагляду перевіряються для конкретного проєкту й юрисдикції.',
    psd: 'Реформа платіжних послуг ЄС залишається current-law workstream. Фінальний текст, статус прийняття, перехідні положення та можливі наслідки для re-authorisation перевіряються за авторитетними матеріалами на дату проєкту.',
    amlr: 'AML-пакет ЄС ухвалено, при цьому основні положення AMLR застосовуються з липня 2027 року з урахуванням окремих перехідних строків. У кожному проєкті чітко розділяються чинні та майбутні вимоги.',
    emi: 'Моделі електронних грошей і платіжних послуг можуть потребувати авторизації та prudential safeguards. Застосовний режим, капітал і governance залежать від точних видів діяльності та актуального локального регулювання.',
    pi: 'Платіжна модель може потрапляти до ліцензованого, виключеного чи іншого регульованого периметра. Вимоги до капіталу, safeguarding і governance підтверджуються для конкретної моделі та юрисдикції.',
    casp: 'Діяльність з криптоактивами може підпадати під MiCA CASP authorisation. Клас послуг, prudential safeguards і supervisory requirements підтверджуються для конкретних видів діяльності.',
    regStep1: 'Ми розкладаємо бізнес-модель на види діяльності та картуємо питання ліцензування, винятків і regulatory perimeter для підтвердження кваліфікованим регуляторним фахівцем.',
    regStep2: 'Ми порівнюємо структурні та операційні фактори в кандидатних юрисдикціях. Локальна юридична реалізованість, ліцензійний статус, строки та регуляторні висновки підтверджуються належно кваліфікованими місцевими фахівцями.',
    regCompare: 'Маршрути в ЄС, Великій Британії та ОАЕ відрізняються за passporting, наглядовою практикою, local substance, банкінгом, строками та впровадженням. Юрисдикція не обирається лише за передбачуваною швидкістю чи ринковою репутацією.',
    regEu: 'Юрисдикції ЄС порівнюються на одній фактичній моделі: regulatory perimeter, цільові ринки, governance, substance, banking та implementation. Регуляторна реалізованість і строки підтверджуються місцевими фахівцями.',
    regFaqLicences: 'EMI, PI та CASP — різні регуляторні категорії. Застосовна категорія, маршрут авторизації, prudential requirements і капітал залежать від точних послуг, юрисдикції та чинних правил і підтверджуються профільним регуляторним фахівцем.',
    regFaqChanges: 'MiCA, реформа платіжних послуг ЄС та AML-пакет зачіпають різні частини регуляторної моделі. Їх поточний статус, перехідні правила та наслідки для впровадження перевіряються за авторитетними джерелами для кожного проєкту.'
  }
};

function read(rel) {
  const file = path.join(ROOT, rel);
  return { file, html: fs.readFileSync(file, 'utf8') };
}
function write(file, before, after) {
  if (before !== after) fs.writeFileSync(file, after, 'utf8');
  return before !== after;
}
function esc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function replaceTextInNthCard(html, containerClass, index, tag, text) {
  const re = new RegExp(`(<div\\b[^>]*class="[^"]*${esc(containerClass)}[^"]*"[^>]*>)([\\s\\S]*?)(<\\/div>)`, 'i');
  return html.replace(re, (full, open, body, close) => {
    const cards = [...body.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/gi)];
    if (!cards[index]) return full;
    const target = cards[index][0];
    const changed = target.replace(new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'i'), `<${tag}>${text}</${tag}>`);
    return open + body.slice(0, cards[index].index) + changed + body.slice(cards[index].index + target.length) + close;
  });
}
function replaceNthResult(html, index, text) {
  const re = /(<div\b[^>]*class="[^"]*result-checklist[^"]*"[^>]*>)([\s\S]*?)(<\/div>)/i;
  return html.replace(re, (full, open, body, close) => {
    const items = [...body.matchAll(/<div\b[^>]*class="[^"]*result-item[^"]*"[^>]*>[\s\S]*?<\/div>/gi)];
    if (!items[index]) return full;
    const t = items[index][0];
    const changed = t.replace(/>[^<>]*(?:<[^>]+>[^<>]*<\/[^>]+>[^<>]*)*<\/div>$/i, `>${text}</div>`);
    return open + body.slice(0, items[index].index) + changed + body.slice(items[index].index + t.length) + close;
  });
}
function trimContainer(html, className, itemTag, max) {
  const re = new RegExp(`(<div\\b[^>]*class="[^"]*${esc(className)}[^"]*"[^>]*>)([\\s\\S]*?)(<\\/div>)`, 'i');
  return html.replace(re, (full, open, body, close) => {
    const itemRe = new RegExp(`<${itemTag}\\b[^>]*>[\\s\\S]*?<\\/${itemTag}>`, 'gi');
    const items = [...body.matchAll(itemRe)];
    if (items.length <= max) return full;
    let out = body;
    for (let i = items.length - 1; i >= max; i--) out = out.slice(0, items[i].index) + out.slice(items[i].index + items[i][0].length);
    return open + out + close;
  });
}
function trimFaq(html, sectionClass, max) {
  const re = new RegExp(`(<section\\b[^>]*class="[^"]*${esc(sectionClass)}[^"]*"[^>]*>)([\\s\\S]*?)(<\\/section>)`, 'i');
  return html.replace(re, (full, open, body, close) => {
    const details = [...body.matchAll(/<details\b[^>]*class="[^"]*lx-faq-item[^"]*"[^>]*>[\s\S]*?<\/details>/gi)];
    if (details.length <= max) return full;
    let out = body;
    for (let i = details.length - 1; i >= max; i--) out = out.slice(0, details[i].index) + out.slice(details[i].index + details[i][0].length);
    return open + out + close;
  });
}
function removeSectionContaining(html, className) {
  return html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/gi, block => block.includes(className) ? '' : block);
}
function replaceSectionTitle(html, sectionContainsClass, title) {
  return html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/gi, block => {
    if (!block.includes(sectionContainsClass)) return block;
    return block.replace(/<h2\b[^>]*class="[^"]*section-title-main[^"]*"[^>]*>[\s\S]*?<\/h2>/i, `<h2 class="section-title-main">${title}</h2>`);
  });
}
function replaceSectionSubtitle(html, sectionContainsClass, text) {
  return html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/gi, block => {
    if (!block.includes(sectionContainsClass)) return block;
    return block.replace(/<p\b[^>]*class="[^"]*section-subtitle[^"]*"[^>]*>[\s\S]*?<\/p>/i, `<p class="section-subtitle">${text}</p>`);
  });
}
function replaceFaqAnswerContaining(html, sectionClass, needle, text) {
  const re = new RegExp(`(<section\\b[^>]*class="[^"]*${esc(sectionClass)}[^"]*"[^>]*>)([\\s\\S]*?)(<\\/section>)`, 'i');
  return html.replace(re, (full, open, body, close) => {
    const details = body.replace(/<details\b[^>]*class="[^"]*lx-faq-item[^"]*"[^>]*>[\s\S]*?<\/details>/gi, item => {
      if (!item.includes(needle)) return item;
      return item.replace(/<div\b[^>]*class="[^"]*lx-faq-answer[^"]*"[^>]*>\s*<p>[\s\S]*?<\/p>\s*<\/div>/i, `<div class="lx-faq-answer"><p>${text}</p></div>`);
    });
    return open + details + close;
  });
}
function replaceFirstFaqAnswer(html, sectionClass, text) {
  const re = new RegExp(`(<section\\b[^>]*class="[^"]*${esc(sectionClass)}[^"]*"[^>]*>)([\\s\\S]*?)(<\\/section>)`, 'i');
  return html.replace(re, (full, open, body, close) => {
    let done = false;
    const out = body.replace(/<div\b[^>]*class="[^"]*lx-faq-answer[^"]*"[^>]*>\s*<p>[\s\S]*?<\/p>\s*<\/div>/i, m => {
      if (done) return m;
      done = true;
      return `<div class="lx-faq-answer"><p>${text}</p></div>`;
    });
    return open + out + close;
  });
}
function replaceParagraphInCardByIndex(html, containerClass, index, text) {
  return replaceTextInNthCard(html, containerClass, index, 'p', text);
}
function replaceHeadingInCardByIndex(html, containerClass, index, text) {
  return replaceTextInNthCard(html, containerClass, index, 'h3', text);
}

function editTax(html, c) {
  html = html.replace(/(<section\b[^>]*class="[^"]*tax-hero[^"]*"[^>]*>[\s\S]*?<p\b[^>]*class="[^"]*page-subtitle[^"]*"[^>]*>)[\s\S]*?(<\/p>)/i, `$1${c.taxHero}$2`);
  html = replaceHeadingInCardByIndex(html, 'tax-analysis-grid', 1, c.cfcTitle);
  html = replaceParagraphInCardByIndex(html, 'tax-analysis-grid', 1, c.cfcBody);
  html = replaceHeadingInCardByIndex(html, 'tax-analysis-grid', 2, c.treatyTitle);
  html = replaceParagraphInCardByIndex(html, 'tax-analysis-grid', 2, c.treatyBody);
  html = removeSectionContaining(html, 'integration-list');
  html = trimContainer(html, 'red-flags-grid', 'article', 4);
  html = replaceNthResult(html, 1, c.cfcResult);
  html = trimContainer(html, 'result-checklist', 'div', 4);
  html = html.replace(/<p\b[^>]*class="[^"]*section-note[^"]*"[^>]*>[\s\S]*?<\/p>/i, `<p class="section-note">${c.taxNote}</p>`);
  html = trimFaq(html, 'tax-faq', 4);
  return html;
}

function editVat(html, c) {
  html = replaceParagraphInCardByIndex(html, 'vat-analysis-grid', 1, c.vatPlace);
  html = replaceParagraphInCardByIndex(html, 'vat-analysis-grid', 2, c.vatOss);
  html = removeSectionContaining(html, 'integration-list-dark');
  html = trimContainer(html, 'vat-scenarios-grid', 'article', 4);
  html = trimContainer(html, 'red-flags-grid', 'article', 4);
  html = replaceNthResult(html, 1, c.vatResultOss);
  html = replaceNthResult(html, 2, c.vatResultPresence);
  html = replaceNthResult(html, 3, c.vatResultAligned);
  html = trimContainer(html, 'result-checklist', 'div', 4);
  html = trimFaq(html, 'vat-faq', 4);
  html = replaceFaqAnswerContaining(html, 'vat-faq', 'warehouse', c.vatWarehouse);
  html = replaceFaqAnswerContaining(html, 'vat-faq', 'склад', c.vatWarehouse);
  html = replaceFaqAnswerContaining(html, 'vat-faq', 'склад', c.vatWarehouse);
  return html;
}

function editPe(html, c) {
  html = replaceHeadingInCardByIndex(html, 'types-grid', 2, c.peMgmtTitle);
  html = replaceParagraphInCardByIndex(html, 'types-grid', 2, c.peMgmtBody);
  html = trimContainer(html, 'trigger-grid', 'article', 4);
  html = removeSectionContaining(html, 'TYPICAL RISKS');
  html = removeSectionContaining(html, 'ТИПИЧНЫЕ РИСКИ');
  html = removeSectionContaining(html, 'ТИПОВІ РИЗИКИ');
  html = html.replace(/(<section\b[^>]*class="[^"]*pe-consequences[^"]*"[^>]*>[\s\S]*?<div\b[^>]*class="[^"]*prep-checklist[^"]*"[^>]*>)([\s\S]*?)(<\/div>)/i, (full, open, body, close) => {
    const items = [...body.matchAll(/<div\b[^>]*class="[^"]*prep-item[^"]*"[^>]*>[\s\S]*?<\/div>/gi)];
    let out = body;
    if (items[0]) out = out.replace(items[0][0], items[0][0].replace(/>[^<]*<\/div>$/, `>${c.peTax}</div>`));
    if (items[1]) out = out.replace(items[1][0], items[1][0].replace(/>[^<]*<\/div>$/, `>${c.pePenalty}</div>`));
    const updated = [...out.matchAll(/<div\b[^>]*class="[^"]*prep-item[^"]*"[^>]*>[\s\S]*?<\/div>/gi)];
    for (let i = updated.length - 1; i >= 4; i--) out = out.slice(0, updated[i].index) + out.slice(updated[i].index + updated[i][0].length);
    return open + out + close;
  });
  html = replaceFirstFaqAnswer(html, 'pe-faq', c.peFaq);
  return html;
}

function editReg(html, c) {
  html = html.replace(/(<section\b[^>]*class="[^"]*licensing-hero[^"]*"[^>]*>[\s\S]*?<p\b[^>]*class="[^"]*page-subtitle[^"]*"[^>]*>)[\s\S]*?(<\/p>)/i, `$1${c.regHero}$2`);
  html = replaceSectionTitle(html, 'regulatory-context-grid', c.regContextTitle);
  html = replaceSectionSubtitle(html, 'regulatory-context-grid', c.regContextIntro);
  html = replaceParagraphInCardByIndex(html, 'regulatory-context-grid', 0, c.mica);
  html = replaceParagraphInCardByIndex(html, 'regulatory-context-grid', 1, c.psd);
  html = replaceParagraphInCardByIndex(html, 'regulatory-context-grid', 2, c.amlr);
  html = replaceParagraphInCardByIndex(html, 'license-types-grid', 0, c.emi);
  html = replaceParagraphInCardByIndex(html, 'license-types-grid', 1, c.pi);
  html = replaceParagraphInCardByIndex(html, 'license-types-grid', 2, c.casp);
  html = replaceParagraphInCardByIndex(html, 'method-grid', 0, c.regStep1);
  html = replaceParagraphInCardByIndex(html, 'method-grid', 1, c.regStep2);
  html = removeSectionContaining(html, 'schema-panel');
  html = replaceSectionSubtitle(html, 'jurisdiction-comparison-grid', c.regCompare);
  html = replaceParagraphInCardByIndex(html, 'jurisdiction-comparison-grid', 0, c.regEu);
  html = trimFaq(html, 'licensing-faq', 4);
  html = replaceFaqAnswerContaining(html, 'licensing-faq', 'EMI', c.regFaqLicences);
  html = replaceFaqAnswerContaining(html, 'licensing-faq', 'MiCA', c.regFaqChanges);
  return html;
}

let changed = 0;
for (const [lang, set] of Object.entries(pages)) {
  const c = copy[lang];
  for (const [kind, rel] of Object.entries(set)) {
    const { file, html: before } = read(rel);
    let after = before;
    if (kind === 'tax') after = editTax(after, c);
    if (kind === 'vat') after = editVat(after, c);
    if (kind === 'pe') after = editPe(after, c);
    if (kind === 'reg') after = editReg(after, c);
    if (write(file, before, after)) changed++;
  }
}

console.log(`[LEXONYX editorial cleanup] changed=${changed}/12 target pages`);
