import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function escRe(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sectionRx(token) {
  return new RegExp(`<section\\b(?=[^>]*\\bclass=["'][^"']*\\b${escRe(token)}\\b[^"']*["'])[^>]*>[\\s\\S]*?<\\/section>`, 'i');
}

function replaceSection(html, token, transform) {
  const rx = sectionRx(token);
  const match = rx.exec(html);
  if (!match) throw new Error(`section .${token} not found`);
  return html.slice(0, match.index) + transform(match[0]) + html.slice(match.index + match[0].length);
}

function replaceNextSection(html, afterToken, transform) {
  const firstRx = sectionRx(afterToken);
  const first = firstRx.exec(html);
  if (!first) throw new Error(`section .${afterToken} not found`);
  const start = first.index + first[0].length;
  const tail = html.slice(start);
  const next = /<section\b[^>]*>[\s\S]*?<\/section>/i.exec(tail);
  if (!next) throw new Error(`next section after .${afterToken} not found`);
  const abs = start + next.index;
  return html.slice(0, abs) + transform(next[0]) + html.slice(abs + next[0].length);
}

function replaceNthByClass(fragment, tag, classToken, content, nth = 0) {
  const rx = new RegExp(`<${tag}\\b(?=[^>]*\\bclass=["'][^"']*\\b${escRe(classToken)}\\b[^"']*["'])[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  let seen = 0;
  let changed = false;
  const out = fragment.replace(rx, match => {
    if (seen++ !== nth) return match;
    changed = true;
    const innerRx = new RegExp(`(<${tag}\\b[^>]*>)[\\s\\S]*?(<\\/${tag}>)`, 'i');
    return match.replace(innerRx, (_m, open, close) => `${open}${content}${close}`);
  });
  if (!changed) throw new Error(`${tag}.${classToken}[${nth}] not found`);
  return out;
}

function replaceNthPlainTag(fragment, tag, content, nth = 0) {
  const rx = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>`, 'gi');
  let seen = 0;
  let changed = false;
  const out = fragment.replace(rx, match => {
    if (seen++ !== nth) return match;
    changed = true;
    const innerRx = new RegExp(`(<${tag}\\b[^>]*>)[\\s\\S]*?(<\\/${tag}>)`, 'i');
    return match.replace(innerRx, (_m, open, close) => `${open}${content}${close}`);
  });
  if (!changed) throw new Error(`${tag}[${nth}] not found`);
  return out;
}

function replaceCard(fragment, index, title, body) {
  const rx = /<article\b(?=[^>]*\bclass=["'][^"']*\bformat-card-home\b[^"']*["'])[^>]*>[\s\S]*?<\/article>/gi;
  let seen = 0;
  let changed = false;
  const out = fragment.replace(rx, card => {
    if (seen++ !== index) return card;
    changed = true;
    let next = replaceNthPlainTag(card, 'h3', title, 0);
    next = replaceNthPlainTag(next, 'p', body, 0);
    return next;
  });
  if (!changed) throw new Error(`format-card-home[${index}] not found`);
  return out;
}

const COPY = {
  en: {
    files: {
      home: 'en/index.html',
      group: 'en/expertise/group-structuring.html',
      banking: 'en/expertise/banking-readiness.html',
      tax: 'en/expertise/tax-residency-cfc.html',
      audit: 'en/work-formats/strategic-structural-audit.html',
      start: 'en/how-to-start.html',
      request: 'en/request-review.html'
    },
    home: [
      'We help founders and international businesses turn a fragmented cross-border setup into one coherent operating model — ownership, company roles, governance, banking and the evidence behind them.',
      'Start with the structure you have today. We identify the material gaps, show which workstreams need jurisdiction-specific specialist confirmation and set the order in which to address them.'
    ],
    group: {
      hero: 'Use this when companies, owners, teams or cash flows span more than one jurisdiction and the structure has to work as one system. We map entity roles, ownership, management and flows, then identify where the model creates banking, tax or regulatory questions.',
      heading: 'When group structuring is the right starting point',
      body: 'Typical triggers are a new HoldCo/OpCo model, a founder move, entry into a new market, an investment round or a structure that has grown through local fixes. The first output is a current-state map and a short list of structural gaps before detailed implementation.'
    },
    banking: {
      hero: 'Prepare the structure before a bank or payment provider asks the difficult questions. We review how ownership, the business model, source-of-funds evidence, governance, counterparties and real flows fit together, then identify inconsistencies likely to trigger additional review.',
      trigger: 'If onboarding has stalled, a bank or payment provider is asking for repeated clarification, or ownership and the origin of funds are difficult to explain in one narrative, we treat this as a structural-readiness issue. The first step is to map the gaps between the declared model, the evidence and actual operations.',
      heading: 'What banks and payment providers need to understand quickly',
      body: 'A reviewer should be able to trace ownership and control, understand how the business earns money, see where funds come from and reconcile that narrative with contracts, counterparties, governance and actual flows. Our review is built around those points of consistency.'
    },
    tax: {
      hero: 'Founder residence, management location and actual control can change how a company and its owner are treated for tax purposes. We map the facts that drive tax-residence and CFC questions, then coordinate jurisdiction-specific conclusions with qualified tax specialists.',
      trigger: 'Relevant when a founder or director moves country, management is split across jurisdictions, key decisions are made outside the incorporation state, or ownership and control have changed. We separate the factual map from the jurisdiction-specific tax conclusion so the structure can be reviewed consistently.',
      heading: 'Which facts change the tax-residence and CFC analysis',
      body: 'We map where directors and owners live, where strategic decisions are made, who controls accounts and contracts, how authority is exercised and how that picture is evidenced. A qualified tax specialist then applies the rules of the relevant jurisdiction to that factual map.'
    },
    audit: {
      hero: 'For an existing cross-border structure that needs a system-level review before scaling, financing, restructuring or a sensitive banking or tax event. We map the current model, identify the material cross-border gaps and turn them into a prioritised implementation plan.',
      heading: 'When a system-level audit is useful',
      body: 'Use the strategic audit when separate local decisions have accumulated and no single view shows how ownership, management, PE and VAT interfaces, CFC, banking and regulatory dependencies interact. The output is a current-state map, risk priorities and an implementation sequence, with jurisdiction-specific specialist conclusions integrated where required.'
    },
    start: {
      hero: 'You do not need to know which service you need. Send the current structure, jurisdictions and the question that triggered the review. We determine the smallest sensible starting point — focused diagnostic, strategic project or ongoing coordination — and tell you what information is actually needed next.',
      heading: 'Start with the smallest useful scope',
      body: 'The initial review does not commit you to a larger engagement. We first identify the decision that needs to be made, the facts needed for it and whether a qualified specialist in a particular jurisdiction needs to be involved.'
    },
    request: {
      hero: 'Tell us what the structure looks like today and what is forcing the question now. We use the form to identify the relevant workstream, the missing facts and the appropriate next step — not to produce an automated legal or tax conclusion.',
      heading: 'What happens after you submit',
      body: 'For the initial review, facts and a structure diagram are enough. Sensitive documents, if needed, are requested only after confidentiality terms or an NDA have been agreed.',
      cards: [
        ['1) Initial issue map', 'A high-level map of the areas that need attention: structure, PE/VAT, banking readiness, regulatory perimeter or other connected workstreams.'],
        ['2) Recommended scope', 'The most proportionate next step: a focused diagnostic, strategic audit, project or ongoing coordination — based on the facts provided.'],
        ['3) Next information request', 'Only the data and documents needed for the agreed next stage, rather than a broad document request at the outset.']
      ]
    }
  },
  ru: {
    files: {
      home: 'ru/index.html',
      group: 'ru/ekspertiza/strukturirovanie-gruppy.html',
      banking: 'ru/ekspertiza/bankovskaya-gotovnost.html',
      tax: 'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
      audit: 'ru/formaty-raboty/strategicheskiy-strukturnyy-audit.html',
      start: 'ru/formaty-raboty/kak-nachat.html',
      request: 'ru/zaprosit-razbor.html'
    },
    home: [
      'Помогаем собственникам и международному бизнесу собрать разрозненную трансграничную конструкцию в одну работающую модель — владение, роли компаний, управление, банковскую логику и подтверждающие документы.',
      'Начинаем с текущей структуры: показываем существенные разрывы, определяем, где требуется вывод профильного специалиста конкретной юрисдикции, и выстраиваем последовательность изменений.'
    ],
    group: {
      hero: 'Этот блок нужен, когда компании, собственники, команды или денежные потоки находятся в разных странах и структура должна работать как единая система. Мы определяем роли компаний, логику владения и потоков, фактическое управление и точки, где возникают банковские, налоговые или регуляторные вопросы.',
      heading: 'Когда структурирование группы — правильная точка входа',
      body: 'Типичная точка входа — новая холдинговая и операционная модель, переезд собственника, выход на новый рынок, инвестиционный раунд или структура, которая выросла из отдельных локальных решений. Первый результат — карта текущей модели и короткий перечень структурных разрывов до детальной реализации.'
    },
    banking: {
      hero: 'Готовим структуру до того, как банк или платёжный провайдер начнёт задавать сложные вопросы. Проверяем, как между собой связаны владение, бизнес-модель, происхождение средств и капитала, управление, контрагенты и реальные денежные потоки, и выявляем противоречия, которые могут вызвать дополнительные запросы.',
      trigger: 'Если проверка затянулась, банк или платёжный провайдер повторно запрашивает пояснения либо владение и происхождение средств сложно объяснить одной последовательной историей, мы рассматриваем это как вопрос структурной готовности. Первый шаг — сопоставить заявленную модель, подтверждающие документы и фактическую деятельность.',
      heading: 'Что банк или платёжный провайдер должен быстро понять',
      body: 'Проверяющий должен проследить владение и контроль, понять, как бизнес зарабатывает, откуда поступают средства, и сопоставить это объяснение с договорами, контрагентами, управлением и реальными потоками. Наш анализ строится вокруг этих точек согласованности.'
    },
    tax: {
      hero: 'Переезд собственника, место управления и фактический контроль могут менять налоговую оценку компании и её владельца. LEXONYX картирует факты, значимые для налогового резидентства и КИК, а выводы по конкретной юрисдикции предоставляет или подтверждает квалифицированный налоговый специалист.',
      trigger: 'Актуально, когда собственник или директор переехал, управление разделено между странами, ключевые решения принимаются не в стране регистрации либо изменилась структура владения и контроля. Мы отделяем фактическую карту от налогового вывода по конкретной юрисдикции, чтобы последующий анализ опирался на одну и ту же реальную модель.',
      heading: 'Какие факты меняют анализ налогового резидентства и КИК',
      body: 'Мы картируем, где живут директора и собственники, где принимаются стратегические решения, кто контролирует счета и договоры, как реализуются полномочия и чем это подтверждается. Затем квалифицированный налоговый специалист применяет к этой фактической карте правила соответствующей юрисдикции.'
    },
    audit: {
      hero: 'Формат для действующей международной структуры, которую нужно системно проверить перед масштабированием, финансированием, реструктуризацией или чувствительным банковским либо налоговым событием. Мы строим карту текущей модели, выделяем существенные трансграничные разрывы и превращаем их в приоритетный план действий.',
      heading: 'Когда нужен системный аудит структуры',
      body: 'Стратегический аудит нужен, когда отдельные локальные решения накопились, а единой картины уже нет: владение, управление, постоянное представительство, НДС, КИК, банковские и регуляторные вопросы начинают влиять друг на друга. Результат — карта «как есть», приоритеты и последовательность реализации; выводы по конкретным юрисдикциям интегрируются после подтверждения соответствующими специалистами.'
    },
    start: {
      hero: 'Не нужно заранее знать, какой формат вам нужен. Достаточно описать текущую структуру, юрисдикции и вопрос, который заставил заняться ею именно сейчас. Мы определим минимально достаточную точку входа — диагностику, стратегический проект или постоянную координацию — и скажем, какие данные действительно нужны дальше.',
      heading: 'Начинаем с минимально достаточного объёма',
      body: 'Первичный разбор не обязывает переходить к большому проекту. Сначала определяем, какое решение нужно принять, каких фактов для него не хватает и требуется ли подключение профильного специалиста конкретной юрисдикции.'
    },
    request: {
      hero: 'Опишите, как структура выглядит сейчас и что заставило заняться вопросом именно сейчас. Форма нужна, чтобы определить релевантный блок работы, недостающие факты и следующий шаг — а не для автоматического юридического или налогового заключения.',
      heading: 'Что произойдёт после отправки',
      body: 'Для первичной оценки достаточно фактов и схемы структуры. Чувствительные документы, если они понадобятся, запрашиваются только после согласования условий конфиденциальности или NDA.',
      cards: [
        ['1) Карта ключевых вопросов', 'Показываем, какие блоки требуют внимания: структура, постоянное представительство и НДС, банковская готовность, регуляторный периметр или другие взаимосвязанные вопросы.'],
        ['2) Рекомендуемый формат', 'Определяем, что разумно делать дальше: точечная диагностика, стратегический аудит, проект или постоянная координация — исходя из фактов.'],
        ['3) Следующий пакет данных', 'Запрашиваем только те сведения и документы, которые нужны для согласованного следующего этапа, без избыточного пакета на старте.']
      ]
    }
  },
  uk: {
    files: {
      home: 'uk/index.html',
      group: 'uk/ekspertyza/strukturuvannya-grupy.html',
      banking: 'uk/ekspertyza/bankivska-gotovnist.html',
      tax: 'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
      audit: 'uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html',
      start: 'uk/yak-pochaty.html',
      request: 'uk/zapytaty-rozbir.html'
    },
    home: [
      'Допомагаємо власникам та міжнародному бізнесу зібрати розрізнену транскордонну конструкцію в одну робочу модель — володіння, ролі компаній, управління, банківську логіку та підтвердні документи.',
      'Починаємо з поточної структури: показуємо суттєві розриви, визначаємо, де потрібен висновок профільного фахівця відповідної юрисдикції, і вибудовуємо послідовність змін.'
    ],
    group: {
      hero: 'Цей блок потрібен, коли компанії, власники, команди або грошові потоки перебувають у різних країнах і структура має працювати як єдина система. Ми визначаємо ролі компаній, логіку володіння та потоків, фактичне управління і точки, де виникають банківські, податкові або регуляторні питання.',
      heading: 'Коли структурування групи — правильна точка входу',
      body: 'Типова точка входу — нова холдингова та операційна модель, переїзд власника, вихід на новий ринок, інвестиційний раунд або структура, що виросла з окремих локальних рішень. Перший результат — карта поточної моделі та короткий перелік структурних розривів до детальної реалізації.'
    },
    banking: {
      hero: 'Готуємо структуру до того, як банк або платіжний провайдер почне ставити складні запитання. Перевіряємо, як між собою пов’язані володіння, бізнес-модель, походження коштів і капіталу, управління, контрагенти та реальні грошові потоки, і виявляємо суперечності, що можуть спричинити додаткові запити.',
      trigger: 'Якщо перевірка затягнулася, банк або платіжний провайдер повторно запитує пояснення чи володіння та походження коштів складно пояснити однією послідовною історією, ми розглядаємо це як питання структурної готовності. Перший крок — зіставити заявлену модель, підтвердні документи та фактичну діяльність.',
      heading: 'Що банк або платіжний провайдер має швидко зрозуміти',
      body: 'Перевіряльник має простежити володіння і контроль, зрозуміти, як бізнес заробляє, звідки надходять кошти, та зіставити це пояснення з договорами, контрагентами, управлінням і реальними потоками. Наш аналіз будується навколо цих точок узгодженості.'
    },
    tax: {
      hero: 'Переїзд власника, місце управління та фактичний контроль можуть змінювати податкову оцінку компанії та її власника. LEXONYX картує факти, значущі для податкового резидентства та КІК, а висновки щодо конкретної юрисдикції надає або підтверджує кваліфікований податковий фахівець.',
      trigger: 'Актуально, коли власник або директор переїхав, управління розділене між країнами, ключові рішення ухвалюються не в країні реєстрації або змінилася структура володіння та контролю. Ми відокремлюємо фактичну карту від податкового висновку щодо конкретної юрисдикції, щоб подальший аналіз спирався на одну й ту саму реальну модель.',
      heading: 'Які факти змінюють аналіз податкового резидентства та КІК',
      body: 'Ми картуємо, де живуть директори та власники, де ухвалюються стратегічні рішення, хто контролює рахунки й договори, як реалізуються повноваження та чим це підтверджується. Потім кваліфікований податковий фахівець застосовує до цієї фактичної карти правила відповідної юрисдикції.'
    },
    audit: {
      hero: 'Формат для чинної міжнародної структури, яку потрібно системно перевірити перед масштабуванням, фінансуванням, реструктуризацією або чутливою банківською чи податковою подією. Ми будуємо карту поточної моделі, виділяємо суттєві транскордонні розриви та перетворюємо їх на пріоритетний план дій.',
      heading: 'Коли потрібен системний аудит структури',
      body: 'Стратегічний аудит потрібен, коли окремі локальні рішення накопичилися, а єдиної картини вже немає: володіння, управління, постійне представництво, ПДВ, КІК, банківські та регуляторні питання починають впливати одне на одне. Результат — карта «як є», пріоритети та послідовність реалізації; висновки щодо конкретних юрисдикцій інтегруються після підтвердження відповідними фахівцями.'
    },
    start: {
      hero: 'Не потрібно заздалегідь знати, який формат вам потрібен. Достатньо описати поточну структуру, юрисдикції та питання, яке змусило зайнятися нею саме зараз. Ми визначимо мінімально достатню точку входу — діагностику, стратегічний проєкт або постійну координацію — і скажемо, які дані справді потрібні далі.',
      heading: 'Починаємо з мінімально достатнього обсягу',
      body: 'Первинний розбір не зобов’язує переходити до великого проєкту. Спочатку визначаємо, яке рішення потрібно ухвалити, яких фактів для нього бракує та чи потрібно залучати профільного фахівця відповідної юрисдикції.'
    },
    request: {
      hero: 'Опишіть, як структура виглядає зараз і що змусило зайнятися питанням саме зараз. Форма потрібна, щоб визначити релевантний блок роботи, відсутні факти та наступний крок — а не для автоматичного юридичного чи податкового висновку.',
      heading: 'Що відбудеться після надсилання',
      body: 'Для первинної оцінки достатньо фактів і схеми структури. Чутливі документи, якщо вони знадобляться, запитуються лише після погодження умов конфіденційності або NDA.',
      cards: [
        ['1) Карта ключових питань', 'Показуємо, які блоки потребують уваги: структура, постійне представництво і ПДВ, банківська готовність, регуляторний периметр або інші взаємопов’язані питання.'],
        ['2) Рекомендований формат', 'Визначаємо, що доцільно робити далі: точкова діагностика, стратегічний аудит, проєкт або постійна координація — виходячи з фактів.'],
        ['3) Наступний пакет даних', 'Запитуємо лише ті відомості та документи, які потрібні для погодженого наступного етапу, без надмірного пакета на старті.']
      ]
    }
  }
};

function applyHome(html, c) {
  return replaceSection(html, 'hero-home', section => {
    let next = replaceNthByClass(section, 'p', 'hero-subtitle', c[0], 0);
    next = replaceNthByClass(next, 'p', 'hero-subtitle', c[1], 1);
    return next;
  });
}

function applyGroup(html, c) {
  let out = replaceSection(html, 'group-hero', section => replaceNthByClass(section, 'p', 'page-subtitle', c.hero, 0));
  out = replaceNextSection(out, 'group-hero', section => {
    let next = replaceNthByClass(section, 'h2', 'section-title-main', c.heading, 0);
    next = replaceNthByClass(next, 'p', 'section-subtitle', c.body, 0);
    return next;
  });
  return out;
}

function applyBanking(html, c) {
  let out = replaceSection(html, 'banking-hero', section => replaceNthByClass(section, 'p', 'page-subtitle', c.hero, 0));
  out = replaceSection(out, 'expertise-trigger-band', section => replaceNthPlainTag(section, 'p', c.trigger, 0));
  out = replaceNextSection(out, 'expertise-trigger-band', section => {
    let next = replaceNthByClass(section, 'h2', 'section-title-main', c.heading, 0);
    next = replaceNthByClass(next, 'p', 'section-subtitle', c.body, 0);
    return next;
  });
  return out;
}

function applyTax(html, c) {
  let out = replaceSection(html, 'tax-hero', section => replaceNthByClass(section, 'p', 'page-subtitle', c.hero, 0));
  out = replaceSection(out, 'expertise-trigger-band', section => replaceNthPlainTag(section, 'p', c.trigger, 0));
  out = replaceNextSection(out, 'expertise-trigger-band', section => {
    let next = replaceNthByClass(section, 'h2', 'section-title-main', c.heading, 0);
    next = replaceNthByClass(next, 'p', 'section-subtitle', c.body, 0);
    return next;
  });
  return out;
}

function applyAudit(html, c) {
  let out = replaceSection(html, 'strategic-audit-hero', section => replaceNthByClass(section, 'p', 'page-subtitle', c.hero, 0));
  out = replaceSection(out, 'strategic-audit-problem', section => {
    let next = replaceNthByClass(section, 'h2', 'section-title-main', c.heading, 0);
    next = replaceNthByClass(next, 'p', 'section-subtitle', c.body, 0);
    return next;
  });
  return out;
}

function applyStart(html, c) {
  let out = replaceSection(html, 'start-hero', section => replaceNthByClass(section, 'p', 'hero-subtitle', c.hero, 0));
  out = replaceNextSection(out, 'start-hero', section => {
    let next = replaceNthByClass(section, 'h2', 'section-title-main', c.heading, 0);
    next = replaceNthByClass(next, 'p', 'section-subtitle', c.body, 0);
    return next;
  });
  return out;
}

function applyRequest(html, c) {
  let out = replaceSection(html, 'page-hero', section => replaceNthByClass(section, 'p', 'section-subtitle', c.hero, 0));
  out = replaceNextSection(out, 'page-hero', section => {
    let next = replaceNthByClass(section, 'h2', 'section-title-main', c.heading, 0);
    next = replaceNthByClass(next, 'p', 'section-subtitle', c.body, 0);
    for (let i = 0; i < c.cards.length; i++) next = replaceCard(next, i, c.cards[i][0], c.cards[i][1]);
    return next;
  });
  return out;
}

const appliers = { home: applyHome, group: applyGroup, banking: applyBanking, tax: applyTax, audit: applyAudit, start: applyStart, request: applyRequest };
let changed = 0;
const touched = [];

for (const [lang, cfg] of Object.entries(COPY)) {
  for (const [key, rel] of Object.entries(cfg.files)) {
    const file = path.join(ROOT, rel);
    if (!fs.existsSync(file)) throw new Error(`${rel}: target page missing`);
    const before = fs.readFileSync(file, 'utf8');
    const after = appliers[key](before, cfg[key]);
    if (after === before) throw new Error(`${rel}: refinement produced no change`);
    fs.writeFileSync(file, after, 'utf8');
    changed++;
    touched.push(`${lang}:${key}`);
  }
}

console.log(`[LEXONYX commercial entry refinement] changed=${changed}; targets=${touched.join(', ')}`);
