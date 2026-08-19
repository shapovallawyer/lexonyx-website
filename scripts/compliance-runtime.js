// LEXONYX controlled compliance corrections — 2026-08-19
// Runtime safety layer for the active multilingual site. This file is intentionally
// conservative: it narrows claims, normalises professional-perimeter wording and
// removes time-sensitive marketing statements without changing the underlying design.
(function () {
  'use strict';

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  ready(function () {
    const path = (window.location.pathname || '/').toLowerCase();
    const lang = path.startsWith('/ru/') ? 'ru' : path.startsWith('/uk/') ? 'uk' : 'en';

    const copy = {
      en: {
        perimeter: 'LEXONYX performs structural and factual cross-border analysis. Ukrainian-law advice is provided directly within the professional scope of Advokat (Ukraine). Jurisdiction-specific legal, tax and regulatory conclusions in other jurisdictions are provided or confirmed by appropriately qualified professionals.',
        legalNotice: 'Legal Notice', privacy: 'Privacy Policy', terms: 'Terms of Use',
        homeHero: 'We design international structures for tax, banking, investment and regulatory review.',
        homeMeta: 'Tax, VAT & PE interfaces',
        cyprusTax: 'Cyprus corporate taxation is treated as one interface of the structure, not as its Business Purpose. The applicable tax treatment must be verified for the specific income, functions, residence, substance, treaty position and anti-abuse rules current at the time of the Matter.',
        estoniaTax: 'Estonia uses a distribution-based corporate taxation model. The applicable treatment must be verified for the specific distribution, management, residence, PE, shareholder taxation and operating facts current at the time of the Matter.',
        taxHero: 'Tax-residency and CFC analysis begins with incorporation, management, control and ownership facts. Jurisdiction-specific residence, CFC and personal-tax conclusions are confirmed by appropriately qualified tax professionals.',
        cfcTitle: 'CFC fact and control map',
        cfcBody: 'Ownership, control, entity and income facts are mapped to identify CFC issues requiring jurisdiction-specific tax confirmation.',
        treatyTitle: 'Treaty and anti-abuse interfaces',
        treatyBody: 'Flows, ownership, purpose and factual indicators relevant to DTT, WHT, beneficial-ownership and anti-abuse analysis are mapped for jurisdiction-specific specialist confirmation.',
        cfcResult: 'A map of CFC indicators, ownership and control facts, and questions requiring jurisdiction-specific tax confirmation.',
        taxNote: 'The purpose is not to “adjust the documents”, but to align the factual and governance model so that the relevant tax position can be confirmed under the applicable current rules.',
        vatPlace: 'Transaction facts relevant to place-of-supply analysis, prepared for jurisdiction-specific VAT confirmation.',
        vatOss: 'A transaction map and regime indicators prepared for specialist confirmation of OSS / IOSS applicability and exceptions.',
        vatResultOss: 'A transaction map and list of OSS / IOSS questions requiring specialist confirmation.',
        vatResultPresence: 'A map of VAT-presence indicators and the questions requiring jurisdiction-specific confirmation.',
        vatResultAligned: 'An aligned operating model in which sales and money movement are mapped against specialist-confirmed VAT requirements.',
        vatWarehouseFaq: 'Potentially. A warehouse, inventory or fulfilment centre in another country can create facts relevant to VAT registration or fixed-establishment analysis. The jurisdiction-specific result depends on the applicable VAT rules and should be confirmed before implementation.',
        peMgmtTitle: 'Management / residence interface',
        peMgmtBody: 'Strategic and management decisions taken in another jurisdiction may be relevant to corporate residence, PE or other tax analysis; the jurisdiction-specific conclusion depends on applicable domestic and treaty rules.',
        peOnePerson: 'Potentially. A single person can create facts relevant to PE analysis depending on functions, authority, negotiation and contracting activity, governance and the applicable domestic and treaty rules. The jurisdiction-specific conclusion requires specialist confirmation.',
        peTaxExposure: 'Potential corporate-tax exposure in the country of actual presence, subject to jurisdiction-specific confirmation.',
        pePenaltyExposure: 'Potential interest, penalties or reassessment if local filing or tax obligations are confirmed and were not met.',
        regHero: 'Licensing architecture depends on the business model, regulated activities, jurisdiction, capital, governance and rules current at the time of the project.',
        regContextIntro: 'MiCA, the EU payment-services reform and the AML package must be treated as current-law workstreams rather than static background assumptions.',
        mica: 'MiCA establishes an EU authorisation framework for crypto-asset service providers. The exact activity classification, prudential requirements, transitional position and supervisory expectations must be verified for the project and jurisdiction.',
        psd: 'The PSD3 / Payment Services Regulation reform has progressed through the EU legislative process. Final text, adoption status, transition and re-authorisation consequences must be verified against the authoritative materials current at the time of the project.',
        amlr: 'The EU AML package has been adopted, while major AMLR provisions apply from July 2027 subject to specific transitional timing. Current and future requirements must be separated explicitly in each project.',
        emi: 'Electronic-money and payment-service models may require authorisation and prudential safeguards. The applicable regime, capital and governance requirements depend on the exact activities and current local implementation.',
        pi: 'Payment-service models may fall within an authorisation, exemption or other regulated perimeter. The applicable capital, safeguarding and governance requirements are confirmed for the specific model and jurisdiction.',
        casp: 'Crypto-asset activities may fall within MiCA CASP authorisation. The relevant service class, prudential safeguards and supervisory requirements are confirmed for the specific activities.',
        regStep1: 'We decompose the business model into activities and map licensing, exemption and regulatory-perimeter questions for confirmation by appropriately qualified regulatory counsel.',
        regStep2: 'We compare structural and operational factors across candidate jurisdictions. Local legal feasibility, licensing status, timing and regulatory conclusions are confirmed by appropriately qualified local professionals.',
        regCompareIntro: 'EU, UK and UAE routes differ in passporting, supervisory practice, local substance, banking, timing and implementation. No jurisdiction is selected solely on perceived speed or market reputation.',
        regEu: 'EU jurisdictions are compared on the same factual model: activity perimeter, target markets, governance, substance, banking and implementation. Regulatory feasibility and timing are confirmed with local specialists.',
        extLawNeedle: 'Ukrainian and international law',
        extLawReplacement: 'Ukrainian law and public international law'
      },
      ru: {
        perimeter: 'LEXONYX проводит структурный и фактический анализ трансграничных вопросов. Консультации по украинскому праву предоставляются непосредственно в пределах профессиональных полномочий адвоката Украины. Юрисдикционно-специфические юридические, налоговые и регуляторные выводы по другим юрисдикциям предоставляются или подтверждаются надлежащим образом квалифицированными специалистами.',
        legalNotice: 'Правовая информация', privacy: 'Политика конфиденциальности', terms: 'Условия использования',
        cyprusTax: 'Налогообложение на Кипре рассматривается как один из интерфейсов структуры, а не как её Business Purpose. Применимый налоговый режим необходимо проверять для конкретного дохода, функций, резидентства, substance, treaty-позиции и anti-abuse правил, действующих на момент проекта.',
        estoniaTax: 'В Эстонии действует модель корпоративного налогообложения, связанная с распределением прибыли. Применимый режим необходимо проверять с учётом конкретного распределения, управления, резидентства, PE, налогообложения собственника и фактической операционной модели на момент проекта.',
        taxHero: 'Анализ налогового резидентства и КИК начинается с фактов об инкорпорации, управлении, контроле и ownership. Юрисдикционно-специфические выводы о резидентстве, КИК и личном налогообложении подтверждаются квалифицированными налоговыми специалистами.',
        cfcTitle: 'Карта фактов и контроля для КИК',
        cfcBody: 'Мы картируем ownership, контроль, компании и доходы, чтобы выделить вопросы КИК, требующие юрисдикционно-специфического налогового подтверждения.',
        treatyTitle: 'Treaty и anti-abuse интерфейсы',
        treatyBody: 'Потоки, ownership, цели и факты, релевантные для DTT, WHT, beneficial ownership и anti-abuse анализа, структурируются для подтверждения соответствующим налоговым специалистом.',
        cfcResult: 'Карта индикаторов КИК, фактов об ownership и контроле и перечень вопросов, требующих юрисдикционно-специфического налогового подтверждения.',
        taxNote: 'Цель — не «подогнать документы», а согласовать фактическую и governance-модель так, чтобы соответствующая налоговая позиция могла быть подтверждена по действующим применимым правилам.',
        vatPlace: 'Факты сделки, релевантные для анализа места поставки, подготовленные для юрисдикционно-специфического VAT-подтверждения.',
        vatOss: 'Карта транзакций и индикаторов режима, подготовленная для подтверждения применимости OSS / IOSS и исключений профильным специалистом.',
        vatResultOss: 'Карта транзакций и перечень вопросов по OSS / IOSS, требующих подтверждения профильным специалистом.',
        vatResultPresence: 'Карта индикаторов VAT presence и вопросов, требующих юрисдикционно-специфического подтверждения.',
        vatResultAligned: 'Согласованная операционная модель, в которой продажи и движение денег сопоставлены с подтверждёнными специалистом VAT-требованиями.',
        vatWarehouseFaq: 'Потенциально. Склад, товарные остатки или fulfilment-центр в другой стране могут создавать факты, релевантные для VAT-регистрации или анализа fixed establishment. Конкретный вывод зависит от применимых правил и требует подтверждения до внедрения.',
        peMgmtTitle: 'Интерфейс управления / резидентства',
        peMgmtBody: 'Стратегические и управленческие решения в другой юрисдикции могут быть релевантны для анализа корпоративного резидентства, PE или иных налоговых вопросов; конкретный вывод зависит от внутреннего права и применимого договора.',
        peOnePerson: 'Потенциально. Один человек может создавать факты, релевантные для PE-анализа, в зависимости от функций, полномочий, переговоров и заключения договоров, governance и применимых внутренних и treaty-правил. Юрисдикционно-специфический вывод требует подтверждения специалистом.',
        peTaxExposure: 'Потенциальная корпоративная налоговая экспозиция в стране фактического присутствия — при условии юрисдикционно-специфического подтверждения.',
        pePenaltyExposure: 'Потенциальные проценты, штрафы или перерасчёт, если локальные обязанности будут подтверждены и ранее не выполнялись.',
        regHero: 'Регуляторная и лицензионная архитектура зависит от бизнес-модели, регулируемых видов деятельности, юрисдикции, капитала, governance и правил, действующих на момент проекта.',
        regContextIntro: 'MiCA, реформа платёжных услуг ЕС и AML-пакет должны рассматриваться как отдельные current-law workstreams, а не как статичный фон.',
        mica: 'MiCA устанавливает общеевропейскую рамку авторизации провайдеров услуг с криптоактивами. Точная квалификация деятельности, prudential requirements, переходный режим и ожидания надзора проверяются для конкретного проекта и юрисдикции.',
        psd: 'Реформа PSD3 / Payment Services Regulation прошла существенные этапы законодательного процесса ЕС. Финальный текст, статус принятия, переходные положения и последствия для re-authorisation необходимо проверять по авторитетным материалам, актуальным на момент проекта.',
        amlr: 'AML-пакет ЕС принят, при этом основные положения AMLR применяются с июля 2027 года с учётом отдельных переходных сроков. В каждом проекте необходимо чётко разделять действующие и будущие требования.',
        emi: 'Модели электронных денег и платёжных услуг могут требовать авторизации и prudential safeguards. Применимый режим, капитал и governance зависят от точных видов деятельности и актуального локального регулирования.',
        pi: 'Платёжная модель может попадать в лицензируемый, исключённый или иной регулируемый периметр. Требования к капиталу, safeguarding и governance подтверждаются для конкретной модели и юрисдикции.',
        casp: 'Деятельность с криптоактивами может попадать под MiCA CASP authorisation. Класс услуг, prudential safeguards и supervisory requirements подтверждаются для конкретных видов деятельности.',
        regStep1: 'Мы раскладываем бизнес-модель на виды деятельности и картируем вопросы лицензирования, исключений и regulatory perimeter для подтверждения квалифицированным регуляторным специалистом.',
        regStep2: 'Мы сравниваем структурные и операционные факторы в кандидатных юрисдикциях. Локальная юридическая реализуемость, лицензионный статус, сроки и регуляторные выводы подтверждаются надлежащим образом квалифицированными местными специалистами.',
        regCompareIntro: 'Маршруты в ЕС, Великобритании и ОАЭ различаются по passporting, надзорной практике, local substance, банкингу, срокам и внедрению. Юрисдикция не выбирается только по предполагаемой скорости или рыночной репутации.',
        regEu: 'Юрисдикции ЕС сравниваются на одной фактической модели: regulatory perimeter, целевые рынки, governance, substance, banking и implementation. Регуляторная реализуемость и сроки подтверждаются местными специалистами.',
        extLawNeedle: 'консультирование по украинскому и международному праву',
        extLawReplacement: 'юридическое консультирование по украинскому праву и международному публичному праву'
      },
      uk: {
        perimeter: 'LEXONYX проводить структурний та фактичний аналіз транскордонних питань. Консультації з українського права надаються безпосередньо в межах професійних повноважень адвоката України. Юрисдикційно-специфічні юридичні, податкові та регуляторні висновки щодо інших юрисдикцій надаються або підтверджуються належно кваліфікованими фахівцями.',
        legalNotice: 'Правова інформація', privacy: 'Політика конфіденційності', terms: 'Умови використання',
        cyprusTax: 'Оподаткування на Кіпрі розглядається як один з інтерфейсів структури, а не як її Business Purpose. Застосовний податковий режим потрібно перевіряти для конкретного доходу, функцій, резидентства, substance, treaty-позиції та anti-abuse правил, чинних на момент проєкту.',
        estoniaTax: 'В Естонії діє модель корпоративного оподаткування, пов’язана з розподілом прибутку. Застосовний режим потрібно перевіряти з урахуванням конкретного розподілу, управління, резидентства, PE, оподаткування власника та фактичної операційної моделі на момент проєкту.',
        taxHero: 'Аналіз податкового резидентства та КІК починається з фактів про інкорпорацію, управління, контроль і ownership. Юрисдикційно-специфічні висновки щодо резидентства, КІК та особистого оподаткування підтверджуються кваліфікованими податковими фахівцями.',
        cfcTitle: 'Карта фактів і контролю для КІК',
        cfcBody: 'Ми картуємо ownership, контроль, компанії та доходи, щоб виділити питання КІК, які потребують юрисдикційно-специфічного податкового підтвердження.',
        treatyTitle: 'Treaty та anti-abuse інтерфейси',
        treatyBody: 'Потоки, ownership, цілі та факти, релевантні для DTT, WHT, beneficial ownership та anti-abuse аналізу, структуруються для підтвердження відповідним податковим фахівцем.',
        cfcResult: 'Карта індикаторів КІК, фактів про ownership і контроль та перелік питань, що потребують юрисдикційно-специфічного податкового підтвердження.',
        taxNote: 'Мета — не «підігнати документи», а узгодити фактичну та governance-модель так, щоб відповідна податкова позиція могла бути підтверджена за чинними застосовними правилами.',
        vatPlace: 'Факти операції, релевантні для аналізу місця постачання, підготовлені для юрисдикційно-специфічного VAT-підтвердження.',
        vatOss: 'Карта транзакцій та індикаторів режиму, підготовлена для підтвердження застосовності OSS / IOSS і винятків профільним фахівцем.',
        vatResultOss: 'Карта транзакцій і перелік питань щодо OSS / IOSS, які потребують підтвердження профільним фахівцем.',
        vatResultPresence: 'Карта індикаторів VAT presence і питань, що потребують юрисдикційно-специфічного підтвердження.',
        vatResultAligned: 'Узгоджена операційна модель, у якій продажі та рух коштів зіставлені з підтвердженими фахівцем VAT-вимогами.',
        vatWarehouseFaq: 'Потенційно. Склад, товарні залишки або fulfilment-центр в іншій країні можуть створювати факти, релевантні для VAT-реєстрації чи аналізу fixed establishment. Конкретний висновок залежить від застосовних правил і потребує підтвердження до впровадження.',
        peMgmtTitle: 'Інтерфейс управління / резидентства',
        peMgmtBody: 'Стратегічні та управлінські рішення в іншій юрисдикції можуть бути релевантні для аналізу корпоративного резидентства, PE чи інших податкових питань; конкретний висновок залежить від внутрішнього права та застосовного договору.',
        peOnePerson: 'Потенційно. Одна особа може створювати факти, релевантні для PE-аналізу, залежно від функцій, повноважень, переговорів і укладення договорів, governance та застосовних внутрішніх і treaty-правил. Юрисдикційно-специфічний висновок потребує підтвердження фахівцем.',
        peTaxExposure: 'Потенційна корпоративна податкова експозиція в країні фактичної присутності — за умови юрисдикційно-специфічного підтвердження.',
        pePenaltyExposure: 'Потенційні проценти, штрафи або перерахунок, якщо локальні обов’язки будуть підтверджені та раніше не виконувалися.',
        regHero: 'Регуляторна та ліцензійна архітектура залежить від бізнес-моделі, регульованих видів діяльності, юрисдикції, капіталу, governance і правил, чинних на момент проєкту.',
        regContextIntro: 'MiCA, реформа платіжних послуг ЄС та AML-пакет мають розглядатися як окремі current-law workstreams, а не як статичний фон.',
        mica: 'MiCA встановлює загальноєвропейську рамку авторизації провайдерів послуг з криптоактивами. Точна кваліфікація діяльності, prudential requirements, перехідний режим та очікування нагляду перевіряються для конкретного проєкту й юрисдикції.',
        psd: 'Реформа PSD3 / Payment Services Regulation пройшла суттєві етапи законодавчого процесу ЄС. Фінальний текст, статус прийняття, перехідні положення та наслідки для re-authorisation потрібно перевіряти за авторитетними матеріалами, актуальними на момент проєкту.',
        amlr: 'AML-пакет ЄС ухвалено, при цьому основні положення AMLR застосовуються з липня 2027 року з урахуванням окремих перехідних строків. У кожному проєкті потрібно чітко розділяти чинні та майбутні вимоги.',
        emi: 'Моделі електронних грошей і платіжних послуг можуть потребувати авторизації та prudential safeguards. Застосовний режим, капітал і governance залежать від точних видів діяльності та актуального локального регулювання.',
        pi: 'Платіжна модель може потрапляти до ліцензованого, виключеного чи іншого регульованого периметра. Вимоги до капіталу, safeguarding і governance підтверджуються для конкретної моделі та юрисдикції.',
        casp: 'Діяльність з криптоактивами може підпадати під MiCA CASP authorisation. Клас послуг, prudential safeguards і supervisory requirements підтверджуються для конкретних видів діяльності.',
        regStep1: 'Ми розкладаємо бізнес-модель на види діяльності та картуємо питання ліцензування, винятків і regulatory perimeter для підтвердження кваліфікованим регуляторним фахівцем.',
        regStep2: 'Ми порівнюємо структурні та операційні фактори в кандидатних юрисдикціях. Локальна юридична реалізованість, ліцензійний статус, строки та регуляторні висновки підтверджуються належно кваліфікованими місцевими фахівцями.',
        regCompareIntro: 'Маршрути в ЄС, Великій Британії та ОАЕ відрізняються за passporting, наглядовою практикою, local substance, банкінгом, строками та впровадженням. Юрисдикція не обирається лише за передбачуваною швидкістю чи ринковою репутацією.',
        regEu: 'Юрисдикції ЄС порівнюються на одній фактичній моделі: regulatory perimeter, цільові ринки, governance, substance, banking та implementation. Регуляторна реалізованість і строки підтверджуються місцевими фахівцями.',
        extLawNeedle: 'українського та міжнародного права',
        extLawReplacement: 'українського права та міжнародного публічного права'
      }
    }[lang];

    function setText(el, value) {
      if (el && value) el.textContent = value;
    }

    function textIncludes(selector, needle, replacement) {
      if (!needle || !replacement) return;
      document.querySelectorAll(selector).forEach(function (el) {
        const current = (el.textContent || '').replace(/\s+/g, ' ').trim();
        if (current.includes(needle)) el.textContent = current.replace(needle, replacement);
      });
    }

    function normalizeI18nMetadata() {
      const enAlt = document.querySelector('link[rel="alternate"][hreflang="en"]');
      const xDefault = document.querySelector('link[rel="alternate"][hreflang="x-default"]');
      if (enAlt && xDefault) xDefault.setAttribute('href', enAlt.getAttribute('href'));

      document.querySelectorAll('a.lang-option[lang="ru"][href="/index.html"]').forEach(function (a) {
        a.setAttribute('href', '/ru/index.html');
      });

      document.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
        try {
          const data = JSON.parse(script.textContent || '{}');
          let changed = false;
          if (Array.isArray(data.knowsLanguage)) {
            data.knowsLanguage = ['ru', 'en', 'uk'];
            changed = true;
          }
          if (data.potentialAction && data.potentialAction['@type'] === 'SearchAction') {
            const target = String(data.potentialAction.target || '');
            if (target.includes('/ru/search.html')) {
              delete data.potentialAction;
              changed = true;
            }
          }
          if (changed) script.textContent = JSON.stringify(data);
        } catch (e) {
          // Leave non-JSON or malformed legacy structured data untouched.
        }
      });
    }

    function addJurisdictionPerimeter() {
      const isJurisdiction =
        (/^\/en\/jurisdictions\/.+\.html$/.test(path) && !path.endsWith('/index.html')) ||
        (/^\/ru\/yurisdikcii\/.+\.html$/.test(path) && !path.endsWith('/index.html')) ||
        (/^\/uk\/yurysdyktsiyi\/.+\.html$/.test(path) && !path.endsWith('/index.html'));
      if (!isJurisdiction || document.querySelector('.lx-compliance-perimeter')) return;

      const main = document.querySelector('main');
      if (!main) return;
      const legalBase = lang === 'ru' ? '/ru/' : (lang === 'uk' ? '/uk/' : '/en/');
      const section = document.createElement('section');
      section.className = 'section section-light lx-compliance-perimeter';
      section.setAttribute('aria-label', lang === 'en' ? 'Professional perimeter' : (lang === 'ru' ? 'Профессиональный периметр' : 'Професійний периметр'));
      section.innerHTML = '<div class="container container-narrow"><div class="callout callout-muted"><strong>' +
        (lang === 'en' ? 'Professional perimeter. ' : (lang === 'ru' ? 'Профессиональный периметр. ' : 'Професійний периметр. ')) +
        '</strong>' + copy.perimeter + '</div><p class="section-note"><a href="' + legalBase + 'impressum.html">' + copy.legalNotice + '</a> · <a href="' + legalBase + 'privacy-policy.html">' + copy.privacy + '</a> · <a href="' + legalBase + 'terms-of-use.html">' + copy.terms + '</a></p></div>';
      main.appendChild(section);
    }

    function patchCountryTaxSnapshots() {
      const isCyprus = path.endsWith('/jurisdictions/cyprus.html') || path.endsWith('/yurisdikcii/kipr.html') || path.endsWith('/yurysdyktsiyi/kipr.html');
      const isEstonia = path.endsWith('/jurisdictions/estonia.html') || path.endsWith('/yurisdikcii/estoniya.html') || path.endsWith('/yurysdyktsiyi/estoniya.html');
      if (!isCyprus && !isEstonia) return;

      document.querySelectorAll('main p').forEach(function (p) {
        const t = (p.textContent || '').replace(/\s+/g, ' ').trim();
        if (isCyprus && (t.includes('15%') || t.includes('15 %'))) p.textContent = copy.cyprusTax;
        if (isEstonia && (t.includes('22/78') || t.includes('22 / 78'))) p.textContent = copy.estoniaTax;
      });
    }

    function patchHomepage() {
      if (lang !== 'en' || !(path === '/en' || path === '/en/' || path === '/en/index.html')) return;
      document.querySelectorAll('.hero-subtitle').forEach(function (p) {
        const t = (p.textContent || '').replace(/\s+/g, ' ').trim();
        if (t.includes('withstand tax, banking, investment and regulatory scrutiny')) p.textContent = copy.homeHero;
      });
      document.querySelectorAll('.hero-meta-line span').forEach(function (span) {
        if ((span.textContent || '').replace(/\s+/g, ' ').trim() === 'International tax & VAT') span.textContent = copy.homeMeta;
      });
    }

    function patchTaxCfc() {
      const isPage = path.endsWith('/expertise/tax-residency-cfc.html') || path.endsWith('/ekspertiza/nalogovoe-rezidentstvo-i-kik.html') || path.endsWith('/ekspertyza/podatkove-rezydentstvo-ta-kik.html');
      if (!isPage) return;

      setText(document.querySelector('.tax-hero .page-subtitle'), copy.taxHero);

      const cards = document.querySelectorAll('.tax-analysis-grid article');
      if (cards[1]) {
        setText(cards[1].querySelector('h3'), copy.cfcTitle);
        setText(cards[1].querySelector('p'), copy.cfcBody);
      }
      if (cards[2]) {
        setText(cards[2].querySelector('h3'), copy.treatyTitle);
        setText(cards[2].querySelector('p'), copy.treatyBody);
      }

      const results = document.querySelectorAll('.result-checklist .result-item');
      if (results[1]) setText(results[1], copy.cfcResult);

      document.querySelectorAll('.section-note').forEach(function (note) {
        const t = (note.textContent || '').toLowerCase();
        if (t.includes('tax position') || t.includes('налогов') || t.includes('податков')) setText(note, copy.taxNote);
      });
    }

    function patchVat() {
      const isPage = path.endsWith('/expertise/vat-cross-border.html') || path.endsWith('/ekspertiza/vat-i-transgranichnye-modeli.html') || path.endsWith('/ekspertyza/vat-ta-transkordonni-modeli.html');
      if (!isPage) return;

      const cards = document.querySelectorAll('.vat-analysis-grid article');
      if (cards[1]) setText(cards[1].querySelector('p'), copy.vatPlace);
      if (cards[2]) setText(cards[2].querySelector('p'), copy.vatOss);

      const results = document.querySelectorAll('.result-checklist .result-item');
      if (results[1]) setText(results[1], copy.vatResultOss);
      if (results[2]) setText(results[2], copy.vatResultPresence);
      if (results[3]) setText(results[3], copy.vatResultAligned);

      document.querySelectorAll('.lx-faq-answer p').forEach(function (p) {
        const t = (p.textContent || '').toLowerCase();
        if ((t.startsWith('yes') || t.startsWith('да') || t.startsWith('так')) && (t.includes('warehouse') || t.includes('склад'))) setText(p, copy.vatWarehouseFaq);
      });
    }

    function patchPe() {
      const isPage = path.endsWith('/expertise/pe-risk-international-teams.html') || path.endsWith('/ekspertiza/pe-risk-i-mezhdunarodnye-komandy.html') || path.endsWith('/ekspertyza/pe-ryzyk-ta-mizhnarodni-komandy.html');
      if (!isPage) return;

      const types = document.querySelectorAll('.types-grid .type-card');
      if (types[2]) {
        setText(types[2].querySelector('h3'), copy.peMgmtTitle);
        setText(types[2].querySelector('p'), copy.peMgmtBody);
      }

      const consequences = document.querySelectorAll('.pe-consequences .prep-item');
      if (consequences[0]) setText(consequences[0], copy.peTaxExposure);
      if (consequences[1]) setText(consequences[1], copy.pePenaltyExposure);

      const faq = document.querySelector('.pe-faq .lx-faq-answer p');
      if (faq) setText(faq, copy.peOnePerson);
    }

    function patchRegulatory() {
      const isPage = path.endsWith('/expertise/regulatory-licensing.html') || path.endsWith('/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html') || path.endsWith('/ekspertyza/regulyatorna-arhitektura-ta-litsenzuvannya.html');
      if (!isPage) return;

      setText(document.querySelector('.licensing-hero .page-subtitle'), copy.regHero);

      const contextSection = document.querySelector('.regulatory-context-grid');
      if (contextSection) {
        const section = contextSection.closest('section');
        if (section) {
          const intro = section.querySelector('.section-subtitle');
          if (intro) setText(intro, copy.regContextIntro);
        }
        const contextCards = contextSection.querySelectorAll('.regulatory-context-card');
        if (contextCards[0]) setText(contextCards[0].querySelector('p'), copy.mica);
        if (contextCards[1]) setText(contextCards[1].querySelector('p'), copy.psd);
        if (contextCards[2]) setText(contextCards[2].querySelector('p'), copy.amlr);
      }

      const licenseCards = document.querySelectorAll('.license-types-grid .license-type-card');
      if (licenseCards[0]) setText(licenseCards[0].querySelector('p'), copy.emi);
      if (licenseCards[1]) setText(licenseCards[1].querySelector('p'), copy.pi);
      if (licenseCards[2]) setText(licenseCards[2].querySelector('p'), copy.casp);

      const steps = document.querySelectorAll('.method-grid .method-step-card');
      if (steps[0]) setText(steps[0].querySelector('p'), copy.regStep1);
      if (steps[1]) setText(steps[1].querySelector('p'), copy.regStep2);

      document.querySelectorAll('.jurisdiction-comparison-grid').forEach(function (grid) {
        const section = grid.closest('section');
        if (section) {
          const intro = section.querySelector('.section-subtitle');
          if (intro) setText(intro, copy.regCompareIntro);
        }
        const cards = grid.querySelectorAll('.comparison-card');
        if (cards[0]) setText(cards[0].querySelector('p'), copy.regEu);
      });
    }

    function patchExternalLegalFunction() {
      const isPage = path.endsWith('/work-formats/external-legal-function.html') || path.endsWith('/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html') || path.endsWith('/formaty-roboty/zovnishnia-yurydychna-funktsiia.html');
      if (!isPage) return;
      textIncludes('main p, main li', copy.extLawNeedle, copy.extLawReplacement);
    }

    normalizeI18nMetadata();
    addJurisdictionPerimeter();
    patchCountryTaxSnapshots();
    patchHomepage();
    patchTaxCfc();
    patchVat();
    patchPe();
    patchRegulatory();
    patchExternalLegalFunction();
  });
})();
