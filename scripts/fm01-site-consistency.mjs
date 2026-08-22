import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8');
}
function write(rel, html) {
  fs.writeFileSync(path.join(ROOT, rel), html, 'utf8');
}
function replaceExact(html, from, to, label) {
  if (!html.includes(from)) {
    console.log(`[FM-01 consistency] upstream copy already differs; exact replacement skipped: ${label}`);
    return html;
  }
  return html.replace(from, to);
}
function replaceAllExact(html, from, to) {
  return html.split(from).join(to);
}
function replaceFaq(html, question, answer) {
  const details = [...html.matchAll(/<details\b[^>]*>[\s\S]*?<\/details>/gi)];
  const target = details.find(m => m[0].includes(`<summary>${question}`));
  if (!target) throw new Error(`FM-01 consistency: visible FAQ not found: ${question}`);
  const updated = target[0].replace(/(<div\b[^>]*class=["'][^"']*lx-faq-answer[^"']*["'][^>]*>\s*<p>)[\s\S]*?(<\/p>\s*<\/div>)/i, `$1${answer}$2`);
  html = html.slice(0, target.index) + updated + html.slice(target.index + target[0].length);

  let changed = false;
  html = html.replace(/<script\b([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    let data;
    try { data = JSON.parse(body.trim()); } catch { return full; }
    if (!data || data['@type'] !== 'FAQPage' || !Array.isArray(data.mainEntity)) return full;
    let local = false;
    for (const item of data.mainEntity) {
      if (item?.['@type'] === 'Question' && item.name === question && item.acceptedAnswer) {
        item.acceptedAnswer.text = answer.replace(/&amp;/g, '&');
        local = true;
      }
    }
    if (!local) return full;
    changed = true;
    return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>`;
  });
  if (!changed) throw new Error(`FM-01 consistency: structured FAQ not found: ${question}`);
  return html;
}

// 1) Canonical English work-format naming across all EN pages.
function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else if (entry.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}
for (const file of walk(path.join(ROOT, 'en'))) {
  let html = fs.readFileSync(file, 'utf8');
  html = replaceAllExact(html, 'Strategic Structural Audit', 'Strategic Structure Audit');
  html = replaceAllExact(html, 'strategic structural audit', 'Strategic Structure Audit');
  html = replaceAllExact(html, 'Rapid Risk Review', 'Express Risk Review');
  html = replaceAllExact(html, 'rapid risk review', 'Express Risk Review');
  html = replaceAllExact(html, 'A rapid review', 'An Express Risk Review');
  html = replaceAllExact(html, 'a rapid review', 'an Express Risk Review');
  html = replaceAllExact(html, 'rapid review', 'Express Risk Review');
  fs.writeFileSync(file, html, 'utf8');
}

// 2) Tax Residency & CFC family: jurisdiction-neutral wording before FM-01 publication.
const cfg = {
  en: {
    file: 'en/expertise/tax-residency-cfc.html',
    replacements: [
      ['Residency is determined not by incorporation, but by effective management and control. CFC exposure and the owner’s personal tax exposure depend on them.', 'Corporate tax residence does not follow one universal test. Depending on the jurisdiction, relevant connecting factors may include incorporation, statutory seat, place of management or other domestic-law criteria. LEXONYX maps the underlying facts and coordinates the jurisdiction-specific analysis.', 'EN hero'],
      ['A founder relocates — and it seems like a personal tax question. In reality the place of effective management has shifted, and with it the residency of the companies, CFC exposure and how both tax authorities will read the structure.', 'A founder relocates — and it may look like a personal tax question. In practice, the move can change facts relevant to company management, CFC exposure, PE-risk and banking. Whether legal or tax consequences follow depends on the rules of the jurisdictions involved and any applicable treaty.', 'EN trigger'],
      ['Not a nominal title, but the actual decision-making centre determines the tax vulnerability of the structure.', 'There is no single international management or residence test. The facts about who actually manages the company, where relevant acts are performed and how authority is exercised must be tested against the law of each relevant jurisdiction.', 'EN management card'],
      ['If income and key decisions are controlled from elsewhere, the company’s formal jurisdiction no longer explains its status.', 'If income, authority or management functions are exercised from another country, the structure may require a fresh residence, CFC and governance analysis. Incorporation remains relevant where the applicable law makes it relevant.', 'EN control card'],
      ['In a review, residency and CFC are assessed by reference to the reality of management, not a set of incorporation documents.', 'A tax authority applies its domestic rules and, where relevant, an applicable treaty to the actual facts. Corporate records are evidence of the structure, but they do not replace the underlying management reality.', 'EN authority card'],
      ['Where strategic decisions are made, who controls them and how far this is evidenced at process and document level.', 'Where the company is actually managed, which functions and decisions are carried out in each country, who exercises authority and how those facts are evidenced at process and document level.', 'EN analysis card'],
      ['A company’s tax residency is determined by the allocation of functions, control and the management centre.\n            The owner’s CFC exposure depends on ownership logic and real control over the foreign company.\n            Even a formally correct structure can therefore create risk if it is not aligned with the overall group model.', 'A company’s tax residence depends on the connecting factors used by the relevant jurisdiction; incorporation, statutory seat, management and control may carry different weight under different systems.\n            The owner’s CFC exposure is likewise governed by the domestic rules applicable to that owner.\n            These questions therefore need to be tested against the whole group model rather than assumed from one factor.', 'EN integration'],
      ['Residency becomes vulnerable if the real decision-makers and control process are in another country.', 'A change in where decisions or ongoing management are carried out may engage a residence or management test in another jurisdiction. The consequence depends on that jurisdiction’s law and any applicable treaty.', 'EN red flag']
    ],
    faqs: [
      ['What determines a company’s tax residency?', 'There is no single universal test for corporate tax residence. Depending on the jurisdiction, relevant connecting factors may include incorporation, statutory seat, place of management or other domestic-law criteria. LEXONYX maps the underlying facts; the applicable jurisdiction-specific test is then applied or confirmed by the relevant tax specialist.'],
      ['What are CFC rules and who do they affect?', 'CFC rules are domestic anti-deferral regimes. Whether they affect an owner depends on the law applicable to that owner, including the statutory control, entity, income and exemption tests. LEXONYX maps ownership and control facts; jurisdiction-specific CFC conclusions are provided or confirmed by the relevant tax specialist.'],
      ['How does formal management differ from actual management?', 'Corporate documents describe formal roles and authority. Actual management concerns what is done in practice, but the legal significance of those facts depends on the residence or management test used by the relevant jurisdiction. The analysis therefore starts with the real decision and management process and then applies the correct domestic or treaty test.'],
      ['Where do tax residency risks most often arise?', 'Risk may arise where the facts of management, authority, functions or control do not match the assumptions on which the structure was designed, or where a change of location engages a residence or management test in another jurisdiction. The legal consequence must be determined under the relevant domestic law and any applicable treaty.']
    ]
  },
  ru: {
    file: 'ru/ekspertiza/nalogovoe-rezidentstvo-i-kik.html',
    replacements: [
      ['Основатель переехал — и кажется, что это личный налоговый вопрос. На самом деле сместилось место фактического управления, а вместе с ним — резидентство компаний, КИК и то, как структуру прочитает налоговая обеих стран.', 'Основатель переехал — и кажется, что это личный налоговый вопрос. На практике переезд может изменить факты, имеющие значение для управления компанией, её налогового резидентства, КИК, постоянного представительства и банковской картины. Возникнут ли правовые или налоговые последствия, зависит от правил соответствующих юрисдикций и применимого соглашения, если оно есть.', 'RU trigger'],
      ['Не номинальная должность, а фактический центр принятия решений определяет налоговую уязвимость структуры.', 'Для разных юрисдикций применяются разные тесты управления и резидентства. Поэтому факты о том, кто и где реально управляет компанией, нужно сопоставлять с конкретным применимым правом.', 'RU management card'],
      ['Если доходы и ключевые решения контролируются извне, формальная страна компании перестаёт объяснять её статус.', 'Если доход, полномочия или управленческие функции фактически сосредоточены в другой стране, структуру может потребоваться заново проверить на резидентство, КИК и систему управления. Значение регистрации зависит от применимого права.', 'RU control card'],
      ['При проверке резидентство и КИК оцениваются через реальность управления, а не через набор регистрационных документов.', 'Налоговый орган применяет нормы своей юрисдикции и, при наличии, соответствующее налоговое соглашение к фактическим обстоятельствам. Корпоративные документы служат доказательством, но не заменяют реальную модель управления.', 'RU authority card'],
      ['Где принимаются стратегические решения, кто ими управляет и насколько это подтверждается на уровне процессов и документов.', 'Где и как фактически управляется компания, какие функции и решения выполняются в каждой стране, кто осуществляет полномочия и как это подтверждается процессами и документами.', 'RU analysis card'],
      ['Налоговое резидентство компании определяется распределением функций, контроля и управленческого центра.\n            КИК-экспозиция собственника зависит от ownership-логики и реального контроля над иностранной компанией.\n            Поэтому даже формально корректная структура может создавать риск, если она не согласована с общей моделью группы.', 'Налоговое резидентство компании зависит от критериев, которые использует соответствующая юрисдикция: в разных системах значение могут иметь регистрация, статутное местонахождение, управление, контроль или иные факторы.\n            КИК-экспозиция собственника также определяется внутренними правилами, применимыми к этому собственнику.\n            Поэтому эти вопросы нужно проверять в контексте всей группы, а не выводить из одного универсального фактора.', 'RU integration'],
      ['Резидентство становится уязвимым, если реальные decision-makers и процесс контроля находятся в другой стране.', 'Изменение места, где принимаются решения или осуществляется текущее управление, может задействовать тест резидентства или управления другой юрисдикции. Последствие зависит от применимого права и налогового соглашения, если оно действует.', 'RU red flag']
    ],
    faqs: [
      ['Что определяет налоговое резидентство компании?', 'Универсального международного теста корпоративного налогового резидентства нет. В зависимости от юрисдикции значение могут иметь регистрация, статутное местонахождение, место управления или другие критерии внутреннего права. LEXONYX картирует фактические обстоятельства, а применимый юрисдикционный тест затем применяется или подтверждается профильным налоговым специалистом.'],
      ['Что такое правила КИК и кого они касаются?', 'Правила КИК являются нормами внутреннего налогового права. Их применимость к собственнику зависит от законодательства соответствующей юрисдикции, включая тесты контроля, статуса иностранной компании, характера дохода и предусмотренные исключения. LEXONYX картирует ownership и control; юрисдикционные налоговые выводы предоставляет или подтверждает профильный специалист.'],
      ['Чем отличается формальное управление от фактического?', 'Корпоративные документы описывают формальные роли и полномочия. Фактическое управление показывает, что происходит на практике, но юридическое значение этих фактов зависит от теста резидентства или управления конкретной юрисдикции. Поэтому анализ начинается с реального процесса управления и только затем применяет соответствующие нормы внутреннего права и соглашения.'],
      ['Где чаще всего возникают налоговые риски по резидентству?', 'Риск может возникать, когда фактическое управление, полномочия, функции или контроль не соответствуют исходным предпосылкам структуры либо изменение места деятельности задействует тест резидентства другой юрисдикции. Конкретное последствие определяется по применимому внутреннему праву и налоговому соглашению, если оно действует.']
    ]
  },
  uk: {
    file: 'uk/ekspertyza/podatkove-rezydentstvo-ta-kik.html',
    replacements: [
      ['Резидентство визначається не реєстрацією, а фактичним управлінням і контролем. Від них залежить КІК-експозиція та особисте податкове навантаження.', 'Корпоративне податкове резидентство не визначається одним універсальним тестом. Залежно від юрисдикції значення можуть мати реєстрація, статутне місцезнаходження, місце управління або інші критерії внутрішнього права. LEXONYX картує фактичні обставини та координує юрисдикційний аналіз.', 'UK hero'],
      ['Засновник переїхав — і здається, що це особисте податкове питання. Насправді змістилося місце фактичного управління, а разом із ним — резидентство компаній, КІК і те, як структуру прочитає податкова обох країн.', 'Засновник переїхав — і здається, що це особисте податкове питання. На практиці переїзд може змінити факти, важливі для управління компанією, її податкового резидентства, КІК, постійного представництва та банківської картини. Чи виникнуть правові або податкові наслідки, залежить від правил відповідних юрисдикцій і застосовної податкової угоди, якщо вона є.', 'UK trigger'],
      ['Не номінальна посада, а фактичний центр ухвалення рішень визначає податкову вразливість структури.', 'Різні юрисдикції застосовують різні тести управління та резидентства. Тому факти про те, хто і де реально управляє компанією, потрібно зіставляти з конкретним застосовним правом.', 'UK management card'],
      ['Якщо доходи та ключові рішення контролюються ззовні, формальна країна компанії перестає пояснювати її статус.', 'Якщо дохід, повноваження або управлінські функції фактично зосереджені в іншій країні, структуру може знадобитися повторно перевірити щодо резидентства, КІК і системи управління. Значення реєстрації залежить від застосовного права.', 'UK control card'],
      ['Під час перевірки резидентство і КІК оцінюються через реальність управління, а не через набір реєстраційних документів.', 'Податковий орган застосовує норми своєї юрисдикції та, за наявності, відповідну податкову угоду до фактичних обставин. Корпоративні документи є доказами, але не замінюють реальну модель управління.', 'UK authority card'],
      ['Де ухвалюються стратегічні рішення, хто ними управляє і наскільки це підтверджується на рівні процесів та документів.', 'Де і як фактично управляється компанія, які функції та рішення здійснюються в кожній країні, хто реалізує повноваження і як ці факти підтверджуються процесами та документами.', 'UK analysis card'],
      ['Податкове резидентство компанії визначається розподілом функцій, контролю та управлінського центру.\n        КІК-експозиція власника залежить від ownership-логіки та реального контролю над іноземною компанією.\n        Тому навіть формально коректна структура може створювати ризик, якщо вона не узгоджена із загальною моделлю групи.', 'Податкове резидентство компанії залежить від критеріїв, які використовує відповідна юрисдикція: у різних системах значення можуть мати реєстрація, статутне місцезнаходження, управління, контроль або інші фактори.\n        КІК-експозиція власника також визначається внутрішніми правилами, застосовними до цього власника.\n        Тому ці питання потрібно перевіряти в контексті всієї групи, а не виводити з одного універсального фактора.', 'UK integration'],
      ['Резидентство стає вразливим, якщо реальні decision-makers і процес контролю перебувають в іншій країні.', 'Зміна місця, де ухвалюються рішення або здійснюється поточне управління, може задіяти тест резидентства чи управління іншої юрисдикції. Наслідок залежить від застосовного права та податкової угоди, якщо вона діє.', 'UK red flag']
    ],
    faqs: [
      ['Що визначає податкове резидентство компанії?', 'Універсального міжнародного тесту корпоративного податкового резидентства немає. Залежно від юрисдикції значення можуть мати реєстрація, статутне місцезнаходження, місце управління або інші критерії внутрішнього права. LEXONYX картує фактичні обставини, а застосовний юрисдикційний тест потім застосовується або підтверджується профільним податковим фахівцем.'],
      ['Що таке правила КІК і кого вони стосуються?', 'Правила КІК є нормами внутрішнього податкового права. Їх застосовність до власника залежить від законодавства відповідної юрисдикції, включно з тестами контролю, статусу іноземної компанії, характеру доходу та передбаченими винятками. LEXONYX картує ownership і control; юрисдикційні податкові висновки надає або підтверджує профільний фахівець.'],
      ['Чим відрізняється формальне управління від фактичного?', 'Корпоративні документи описують формальні ролі та повноваження. Фактичне управління показує, що відбувається на практиці, але юридичне значення цих фактів залежить від тесту резидентства або управління конкретної юрисдикції. Тому аналіз починається з реального процесу управління і лише потім застосовує відповідні норми внутрішнього права та податкової угоди.'],
      ['Де найчастіше виникають податкові ризики щодо резидентства?', 'Ризик може виникати, коли фактичне управління, повноваження, функції або контроль не відповідають вихідним припущенням структури або зміна місця діяльності задіює тест резидентства іншої юрисдикції. Конкретний наслідок визначається за застосовним внутрішнім правом і податковою угодою, якщо вона діє.']
    ]
  }
};

for (const [lang, c] of Object.entries(cfg)) {
  let html = read(c.file);
  for (const [from, to, label] of c.replacements) html = replaceExact(html, from, to, label);
  for (const [q, a] of c.faqs) html = replaceFaq(html, q, a);
  write(c.file, html);
}

console.log('[FM-01 site consistency] PASS — tax-residency family made jurisdiction-neutral; EN work-format names canonicalised');
