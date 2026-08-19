import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LANGS = ['en', 'ru', 'uk'];
const LEGAL = ['impressum.html', 'privacy-policy.html', 'cookie-policy.html', 'terms-of-use.html'];

const cfg = {
  en: {
    review: '/en/request-review.html',
    privacy: {
      s1: `<h2>1. Who we are and how to contact us</h2>
<p>LEXONYX is an independent international advisory practice. It provides cross-border structural and factual analysis, Ukrainian-law advice within the professional authorisation of Advokat (Ukraine), and coordination of appropriately qualified local professionals where jurisdiction-specific legal, tax or regulatory conclusions are required.</p>
<p><strong>Controller:</strong><br>Liudmyla Miroshnychenko (LEXONYX)<br>Haunstetter Straße 105<br>86161 Augsburg<br>Germany</p>
<div class="legal-contact-box"><p><strong>Data protection contact:</strong></p><p>Email: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a></p><p>Contact page: <a href="/en/contact.html">lexonyx.com/en/contact.html</a></p></div>`,
      s5: `<h2>5. International data transfers</h2><p>Some service providers or professional advisers may process personal data outside the European Economic Area. Where Chapter V GDPR applies, transfers are based on an applicable adequacy decision, Standard Contractual Clauses or another lawful transfer mechanism, together with supplementary safeguards where required.</p><p>The transfer mechanism depends on the recipient, destination country and processing context and is reviewed when the relevant provider or professional is engaged.</p>`,
      s7: `<h2>7. How long we retain data</h2><ul><li><strong>Initial enquiries</strong> — for as long as reasonably necessary to assess, respond to and follow up the request, and thereafter only where retention is justified by applicable legal or legitimate-interest requirements.</li><li><strong>Client and matter data</strong> — for the engagement period and the retention period required by applicable professional, tax, accounting, AML/CTF, limitation and other legal obligations.</li><li><strong>Newsletter subscription</strong> — until consent is withdrawn or the address is removed for another lawful reason.</li><li><strong>Analytics data</strong> — according to the configured Google Analytics retention settings and only where analytics consent has been given.</li></ul>`,
      complaint: `<p>You also have the right to lodge a complaint with a data-protection supervisory authority. For this practice, the competent non-public-sector supervisory authority in Bavaria is the <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong>, Promenade 18, 91522 Ansbach, Germany.</p>`,
      date: 'August 2026'
    },
    cookie: {
      c2: `<h2>2. Necessary local storage</h2><p>The website stores your analytics-consent choice locally in your browser. This preference is necessary to remember whether analytics may be loaded and is not sent to LEXONYX as a separate tracking identifier.</p><table class="legal-table"><thead><tr><th>Storage key</th><th>Purpose</th><th>Duration</th></tr></thead><tbody><tr><td><code>cookie_consent</code></td><td>Stores the analytics-consent choice</td><td>Until you change the choice or clear site data (localStorage)</td></tr></tbody></table>`,
      c3: `<h2>3. Analytics cookies</h2><p>Google Analytics 4 is loaded only after your explicit consent. The current implementation uses the GA4 measurement ID configured for lexonyx.com and does not load the Google Analytics script before consent.</p><table class="legal-table"><thead><tr><th>Cookie</th><th>Provider</th><th>Purpose</th><th>Typical maximum duration</th></tr></thead><tbody><tr><td><code>_ga</code></td><td>Google Analytics</td><td>Distinguishes users for analytics</td><td>Up to 2 years</td></tr><tr><td><code>_ga_*</code></td><td>Google Analytics 4</td><td>Maintains session / analytics state for the relevant GA4 property</td><td>Up to 2 years</td></tr></tbody></table><p>Analytics is not used for advertising on this website. You may refuse or withdraw analytics consent at any time through Cookie Settings.</p>`,
      c5: `<h2>5. Third-party services</h2><p>The website uses the following providers where necessary for operation or where you have given the relevant consent:</p><ul><li><strong>Netlify</strong> — hosting and form processing.</li><li><strong>Google Analytics 4</strong> — analytics, only after analytics consent.</li></ul><p>LEXONYX does not use third-party advertising networks or advertising pixels on this website.</p>`,
      c6: `<h2>6. How to manage cookies and local storage</h2><p>You can change your analytics choice at any time through the <strong>Cookie Settings</strong> link in the website footer. You can also clear cookies and localStorage through your browser settings.</p><p>Refusing analytics does not prevent access to the website or the enquiry form.</p>`,
      c7: `<h2>7. Your rights</h2><p>Where processing is based on consent, you may withdraw that consent at any time. Withdrawal does not affect the lawfulness of processing before withdrawal.</p><p>For data-protection questions: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a>. Further information is available in the <a href="privacy-policy.html">Privacy Policy</a>.</p>`,
      date: 'August 2026'
    },
    terms: {
      t2: `<h2>2. About the practice</h2><p>LEXONYX is an independent international advisory practice led by Liudmyla Miroshnychenko, Advokat (Ukraine), registered in Germany pursuant to sections 206 and 207 BRAO.</p><p>LEXONYX provides cross-border structural and factual analysis and Ukrainian-law advice within the applicable professional authorisation. Where a matter requires jurisdiction-specific legal, tax or regulatory conclusions in another jurisdiction, those conclusions are provided or confirmed by appropriately qualified professionals; LEXONYX coordinates and integrates the relevant workstreams.</p>`,
      t4: `<h2>4. No adviser-client relationship through website use</h2><p>Using the website, reading materials, sending an enquiry or submitting a form does <strong>not</strong> by itself create an adviser-client or lawyer-client relationship.</p><p>A professional engagement arises only after LEXONYX has accepted the matter and the parties have concluded the relevant engagement agreement. Until then, LEXONYX does not assume responsibility for deadlines, filings or other legally significant steps.</p>`,
      t9: `<h2>9. Applicable law</h2><p>These Terms and the use of this website are governed by German law, without prejudice to mandatory consumer-protection and conflict-of-laws provisions that may apply.</p><p>Questions concerning these Terms may be sent to <a href="mailto:info@lexonyx.com">info@lexonyx.com</a>.</p>`,
      date: 'August 2026'
    },
    impressumScope: `<h2>4. Scope of services</h2><p>LEXONYX focuses on international business structuring, structural and factual tax / VAT / PE interfaces, banking readiness, Source of Funds / Source of Wealth, substance and corporate governance.</p><p>Ukrainian-law advice is provided directly within the professional authorisation of Advokat (Ukraine). Where a matter requires a conclusion on German law, German taxation or another reserved German professional matter, the relevant conclusion is provided or confirmed by an appropriately qualified Rechtsanwalt, Steuerberater or other German professional.</p><p>For other jurisdictions, jurisdiction-specific legal, tax and regulatory conclusions are provided or confirmed by appropriately qualified local professionals. LEXONYX coordinates the cross-border project and integrates confirmed conclusions into the overall structure.</p>`,
    desktop: `<div class="dropdown-content dropdown-two-col jurisdictions-two-col"><div class="dropdown-section"><h4>Core jurisdictions</h4><a href="/en/jurisdictions/ukraine.html"><span class="jur-code">UA</span> Ukraine</a><a href="/en/jurisdictions/germany.html"><span class="jur-code">DE</span> Germany</a><a href="/en/jurisdictions/cyprus.html"><span class="jur-code">CY</span> Cyprus</a><a href="/en/jurisdictions/poland.html"><span class="jur-code">PL</span> Poland</a><a href="/en/jurisdictions/netherlands.html"><span class="jur-code">NL</span> Netherlands</a><a href="/en/jurisdictions/uae.html"><span class="jur-code">AE</span> UAE</a></div><div class="dropdown-section"><h4>Additional jurisdictions</h4><a href="/en/jurisdictions/estonia.html"><span class="jur-code">EE</span> Estonia</a><a href="/en/jurisdictions/ireland.html"><span class="jur-code">IE</span> Ireland</a><a href="/en/jurisdictions/united-kingdom.html"><span class="jur-code">UK</span> United Kingdom</a><a href="/en/jurisdictions/switzerland.html"><span class="jur-code">CH</span> Switzerland</a></div><div class="dropdown-footer"><a href="/en/jurisdictions/index.html" class="btn-dropdown-all">All jurisdictions →</a></div></div>`,
    mobile: `<a class="mobile-sub-link" href="/en/jurisdictions/ukraine.html">Ukraine</a><a class="mobile-sub-link" href="/en/jurisdictions/germany.html">Germany</a><a class="mobile-sub-link" href="/en/jurisdictions/cyprus.html">Cyprus</a><a class="mobile-sub-link" href="/en/jurisdictions/poland.html">Poland</a><a class="mobile-sub-link" href="/en/jurisdictions/netherlands.html">Netherlands</a><a class="mobile-sub-link" href="/en/jurisdictions/uae.html">UAE</a><a class="mobile-sub-link" href="/en/jurisdictions/estonia.html">Estonia</a><a class="mobile-sub-link" href="/en/jurisdictions/ireland.html">Ireland</a><a class="mobile-sub-link" href="/en/jurisdictions/united-kingdom.html">United Kingdom</a><a class="mobile-sub-link" href="/en/jurisdictions/switzerland.html">Switzerland</a><a class="mobile-sub-link mobile-sub-link-all" href="/en/jurisdictions/index.html">All jurisdictions →</a>`
  },
  ru: {
    review: '/ru/zaprosit-razbor.html',
    privacy: {
      s1: `<h2>1. Кто мы и как с нами связаться</h2><p>LEXONYX — независимая международная advisory-практика. Она проводит структурный и фактический анализ трансграничных вопросов, предоставляет консультации по украинскому праву в пределах профессиональных полномочий адвоката Украины и координирует квалифицированных local professionals, когда требуются юрисдикционно-специфические юридические, налоговые или регуляторные выводы.</p><p><strong>Контролер персональных данных:</strong><br>Liudmyla Miroshnychenko (LEXONYX)<br>Haunstetter Straße 105<br>86161 Augsburg<br>Germany</p><div class="legal-contact-box"><p><strong>По вопросам защиты данных:</strong></p><p>Email: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a></p><p>Контактная страница: <a href="/ru/kontakty.html">lexonyx.com/ru/kontakty.html</a></p></div>`,
      s5: `<h2>5. Международная передача данных</h2><p>Некоторые поставщики сервисов или профессиональные консультанты могут обрабатывать персональные данные за пределами Европейской экономической зоны. Когда применяется Глава V GDPR, передача осуществляется на основании применимого решения об адекватности, Standard Contractual Clauses (SCC) или иного законного механизма передачи с дополнительными гарантиями, если они требуются.</p><p>Применимый механизм зависит от получателя, страны назначения и контекста обработки и проверяется при привлечении соответствующего провайдера или специалиста.</p>`,
      s7: `<h2>7. Сколько времени мы храним данные</h2><ul><li><strong>Первичные запросы</strong> — столько, сколько разумно необходимо для оценки, ответа и последующей коммуникации, а далее только при наличии правового основания для хранения.</li><li><strong>Данные клиентов и Matter</strong> — в течение срока сотрудничества и затем в течение периода, требуемого применимыми профессиональными, налоговыми, бухгалтерскими, AML/CTF, limitation и иными правовыми обязанностями.</li><li><strong>Newsletter-подписка</strong> — до отзыва согласия или удаления адреса по иному законному основанию.</li><li><strong>Аналитические данные</strong> — в соответствии с настроенным сроком хранения Google Analytics и только при наличии согласия на аналитику.</li></ul>`,
      complaint: `<p>Вы также вправе подать жалобу в надзорный орган по защите данных. Для данной практики компетентным органом по негосударственному сектору в Баварии является <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong>, Promenade 18, 91522 Ansbach, Germany.</p>`,
      date: 'август 2026'
    },
    cookie: {
      c2: `<h2>2. Необходимое локальное хранилище</h2><p>Сайт сохраняет выбор пользователя относительно аналитики локально в браузере. Эта настройка необходима, чтобы помнить, разрешена ли загрузка аналитики, и сама по себе не передаётся LEXONYX как отдельный tracking identifier.</p><table class="legal-table"><thead><tr><th>Ключ хранилища</th><th>Назначение</th><th>Срок</th></tr></thead><tbody><tr><td><code>cookie_consent</code></td><td>Сохраняет выбор относительно аналитики</td><td>До изменения выбора или очистки данных сайта (localStorage)</td></tr></tbody></table>`,
      c3: `<h2>3. Аналитические cookies</h2><p>Google Analytics 4 загружается только после явного согласия пользователя. Текущая реализация использует GA4 measurement ID для lexonyx.com и не загружает скрипт Google Analytics до получения согласия.</p><table class="legal-table"><thead><tr><th>Cookie</th><th>Провайдер</th><th>Назначение</th><th>Типичный максимальный срок</th></tr></thead><tbody><tr><td><code>_ga</code></td><td>Google Analytics</td><td>Различает пользователей для аналитики</td><td>До 2 лет</td></tr><tr><td><code>_ga_*</code></td><td>Google Analytics 4</td><td>Поддерживает состояние сессии / аналитики соответствующего GA4 property</td><td>До 2 лет</td></tr></tbody></table><p>Аналитика на этом сайте не используется для рекламы. Вы можете отказаться от аналитики или отозвать согласие в любой момент через Cookie Settings.</p>`,
      c5: `<h2>5. Сторонние сервисы</h2><p>Сайт использует следующих провайдеров в объёме, необходимом для работы сайта или при наличии соответствующего согласия:</p><ul><li><strong>Netlify</strong> — хостинг и обработка форм.</li><li><strong>Google Analytics 4</strong> — аналитика, только после согласия на аналитику.</li></ul><p>LEXONYX не использует на сайте сторонние рекламные сети или рекламные tracking pixels.</p>`,
      c6: `<h2>6. Как управлять cookies и localStorage</h2><p>Вы можете изменить решение относительно аналитики в любой момент через ссылку <strong>Cookie Settings</strong> в footer сайта. Cookies и localStorage также можно очистить в настройках браузера.</p><p>Отказ от аналитики не ограничивает доступ к сайту или форме запроса.</p>`,
      c7: `<h2>7. Ваши права</h2><p>Если обработка основана на согласии, вы можете отозвать его в любой момент. Отзыв не влияет на законность обработки до момента отзыва.</p><p>По вопросам защиты данных: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a>. Дополнительная информация содержится в <a href="privacy-policy.html">Политике конфиденциальности</a>.</p>`,
      date: 'август 2026'
    },
    terms: {
      t2: `<h2>2. О практике</h2><p>LEXONYX — независимая международная advisory-практика под руководством Liudmyla Miroshnychenko, Advokat (Ukraine), зарегистрированной в Германии согласно §§ 206 и 207 BRAO.</p><p>LEXONYX проводит структурный и фактический анализ трансграничных вопросов и предоставляет консультации по украинскому праву в пределах применимого профессионального допуска. Если Matter требует юрисдикционно-специфического юридического, налогового или регуляторного вывода в другой юрисдикции, такой вывод предоставляется или подтверждается надлежащим образом квалифицированным специалистом; LEXONYX координирует и интегрирует соответствующие workstreams.</p>`,
      t4: `<h2>4. Отсутствие отношений консультант — клиент через использование сайта</h2><p>Использование сайта, просмотр материалов, отправка запроса или заполнение формы сами по себе <strong>не создают</strong> отношений «консультант — клиент» или «юрист — клиент».</p><p>Профессиональные отношения возникают только после принятия Matter LEXONYX и заключения соответствующего договора. До этого момента LEXONYX не принимает на себя ответственность за сроки, подачи документов или иные юридически значимые действия.</p>`,
      t9: `<h2>9. Применимое право</h2><p>Настоящие Условия и использование сайта регулируются правом Германии без ущерба для императивных норм защиты потребителей и коллизионных норм, которые могут применяться.</p><p>По вопросам, связанным с настоящими Условиями: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a>.</p>`,
      date: 'август 2026'
    },
    impressumScope: `<h2>4. Объём услуг</h2><p>LEXONYX фокусируется на международном структурировании бизнеса, структурных и фактических tax / VAT / PE интерфейсах, банковской готовности, Source of Funds / Source of Wealth, substance и corporate governance.</p><p>Консультации по украинскому праву предоставляются непосредственно в пределах профессиональных полномочий адвоката Украины. Когда Matter требует вывода по немецкому праву, немецкому налогообложению или иному зарезервированному профессиональному вопросу в Германии, соответствующий вывод предоставляет или подтверждает квалифицированный Rechtsanwalt, Steuerberater или иной German professional.</p><p>По другим юрисдикциям юрисдикционно-специфические юридические, налоговые и регуляторные выводы предоставляются или подтверждаются квалифицированными local professionals. LEXONYX координирует трансграничный проект и интегрирует подтверждённые выводы в общую структуру.</p>`,
    desktop: `<div class="dropdown-content dropdown-two-col jurisdictions-two-col"><div class="dropdown-section"><h4>Ключевые</h4><a href="/ru/yurisdikcii/ukraina.html"><span class="jur-code">UA</span> Украина</a><a href="/ru/yurisdikcii/germaniya.html"><span class="jur-code">DE</span> Германия</a><a href="/ru/yurisdikcii/kipr.html"><span class="jur-code">CY</span> Кипр</a><a href="/ru/yurisdikcii/polsha.html"><span class="jur-code">PL</span> Польша</a><a href="/ru/yurisdikcii/niderlandy.html"><span class="jur-code">NL</span> Нидерланды</a><a href="/ru/yurisdikcii/oae.html"><span class="jur-code">AE</span> ОАЭ</a></div><div class="dropdown-section"><h4>Дополнительные</h4><a href="/ru/yurisdikcii/estoniya.html"><span class="jur-code">EE</span> Эстония</a><a href="/ru/yurisdikcii/irlandiya.html"><span class="jur-code">IE</span> Ирландия</a><a href="/ru/yurisdikcii/velikobritaniya.html"><span class="jur-code">UK</span> Великобритания</a><a href="/ru/yurisdikcii/shveycariya.html"><span class="jur-code">CH</span> Швейцария</a></div><div class="dropdown-footer"><a href="/ru/yurisdikcii/index.html" class="btn-dropdown-all">Все юрисдикции →</a></div></div>`,
    mobile: `<a class="mobile-sub-link" href="/ru/yurisdikcii/ukraina.html">Украина</a><a class="mobile-sub-link" href="/ru/yurisdikcii/germaniya.html">Германия</a><a class="mobile-sub-link" href="/ru/yurisdikcii/kipr.html">Кипр</a><a class="mobile-sub-link" href="/ru/yurisdikcii/polsha.html">Польша</a><a class="mobile-sub-link" href="/ru/yurisdikcii/niderlandy.html">Нидерланды</a><a class="mobile-sub-link" href="/ru/yurisdikcii/oae.html">ОАЭ</a><a class="mobile-sub-link" href="/ru/yurisdikcii/estoniya.html">Эстония</a><a class="mobile-sub-link" href="/ru/yurisdikcii/irlandiya.html">Ирландия</a><a class="mobile-sub-link" href="/ru/yurisdikcii/velikobritaniya.html">Великобритания</a><a class="mobile-sub-link" href="/ru/yurisdikcii/shveycariya.html">Швейцария</a><a class="mobile-sub-link mobile-sub-link-all" href="/ru/yurisdikcii/index.html">Все юрисдикции →</a>`
  },
  uk: {
    review: '/uk/zapytaty-rozbir.html',
    privacy: {
      s1: `<h2>1. Хто ми і як з нами зв’язатися</h2><p>LEXONYX — незалежна міжнародна advisory-практика. Вона проводить структурний і фактичний аналіз транскордонних питань, надає консультації з українського права в межах професійних повноважень адвоката України та координує кваліфікованих local professionals, коли потрібні юрисдикційно-специфічні юридичні, податкові або регуляторні висновки.</p><p><strong>Контролер персональних даних:</strong><br>Liudmyla Miroshnychenko (LEXONYX)<br>Haunstetter Straße 105<br>86161 Augsburg<br>Germany</p><div class="legal-contact-box"><p><strong>З питань захисту даних:</strong></p><p>Email: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a></p><p>Контактна сторінка: <a href="/uk/kontakty.html">lexonyx.com/uk/kontakty.html</a></p></div>`,
      s5: `<h2>5. Міжнародна передача даних</h2><p>Деякі постачальники сервісів або професійні консультанти можуть обробляти персональні дані за межами Європейської економічної зони. Коли застосовується Глава V GDPR, передача здійснюється на підставі застосовного рішення про адекватність, Standard Contractual Clauses (SCC) або іншого законного механізму передачі з додатковими гарантіями, якщо вони потрібні.</p><p>Застосовний механізм залежить від одержувача, країни призначення та контексту обробки й перевіряється при залученні відповідного провайдера або фахівця.</p>`,
      s7: `<h2>7. Скільки часу ми зберігаємо дані</h2><ul><li><strong>Первинні запити</strong> — стільки, скільки обґрунтовано потрібно для оцінки, відповіді та подальшої комунікації, а надалі лише за наявності правової підстави для зберігання.</li><li><strong>Дані клієнтів і Matter</strong> — протягом співпраці та надалі протягом періоду, якого вимагають застосовні професійні, податкові, бухгалтерські, AML/CTF, limitation та інші правові обов’язки.</li><li><strong>Newsletter-підписка</strong> — до відкликання згоди або видалення адреси з іншої законної підстави.</li><li><strong>Аналітичні дані</strong> — відповідно до налаштованого строку зберігання Google Analytics і лише за наявності згоди на аналітику.</li></ul>`,
      complaint: `<p>Ви також маєте право подати скаргу до наглядового органу із захисту даних. Для цієї практики компетентним органом для недержавного сектору в Баварії є <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong>, Promenade 18, 91522 Ansbach, Germany.</p>`,
      date: 'серпень 2026'
    },
    cookie: {
      c2: `<h2>2. Необхідне локальне сховище</h2><p>Сайт зберігає вибір користувача щодо аналітики локально в браузері. Ця настройка потрібна, щоб пам’ятати, чи дозволене завантаження аналітики, і сама по собі не передається LEXONYX як окремий tracking identifier.</p><table class="legal-table"><thead><tr><th>Ключ сховища</th><th>Призначення</th><th>Строк</th></tr></thead><tbody><tr><td><code>cookie_consent</code></td><td>Зберігає вибір щодо аналітики</td><td>До зміни вибору або очищення даних сайту (localStorage)</td></tr></tbody></table>`,
      c3: `<h2>3. Аналітичні cookies</h2><p>Google Analytics 4 завантажується лише після явної згоди користувача. Поточна реалізація використовує GA4 measurement ID для lexonyx.com і не завантажує скрипт Google Analytics до отримання згоди.</p><table class="legal-table"><thead><tr><th>Cookie</th><th>Провайдер</th><th>Призначення</th><th>Типовий максимальний строк</th></tr></thead><tbody><tr><td><code>_ga</code></td><td>Google Analytics</td><td>Розрізняє користувачів для аналітики</td><td>До 2 років</td></tr><tr><td><code>_ga_*</code></td><td>Google Analytics 4</td><td>Підтримує стан сесії / аналітики відповідного GA4 property</td><td>До 2 років</td></tr></tbody></table><p>Аналітика на цьому сайті не використовується для реклами. Ви можете відмовитися від аналітики або відкликати згоду будь-коли через Cookie Settings.</p>`,
      c5: `<h2>5. Сторонні сервіси</h2><p>Сайт використовує таких провайдерів у межах, потрібних для роботи сайту або за наявності відповідної згоди:</p><ul><li><strong>Netlify</strong> — хостинг і обробка форм.</li><li><strong>Google Analytics 4</strong> — аналітика, лише після згоди на аналітику.</li></ul><p>LEXONYX не використовує на сайті сторонні рекламні мережі або рекламні tracking pixels.</p>`,
      c6: `<h2>6. Як керувати cookies і localStorage</h2><p>Ви можете змінити рішення щодо аналітики будь-коли через посилання <strong>Cookie Settings</strong> у footer сайту. Cookies і localStorage також можна очистити в налаштуваннях браузера.</p><p>Відмова від аналітики не обмежує доступ до сайту або форми запиту.</p>`,
      c7: `<h2>7. Ваші права</h2><p>Якщо обробка ґрунтується на згоді, ви можете відкликати її будь-коли. Відкликання не впливає на законність обробки до моменту відкликання.</p><p>З питань захисту даних: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a>. Додаткова інформація міститься в <a href="privacy-policy.html">Політиці конфіденційності</a>.</p>`,
      date: 'серпень 2026'
    },
    terms: {
      t2: `<h2>2. Про практику</h2><p>LEXONYX — незалежна міжнародна advisory-практика під керівництвом Liudmyla Miroshnychenko, Advokat (Ukraine), зареєстрованої в Німеччині відповідно до §§ 206 та 207 BRAO.</p><p>LEXONYX проводить структурний і фактичний аналіз транскордонних питань і надає консультації з українського права в межах застосовного професійного допуску. Якщо Matter потребує юрисдикційно-специфічного юридичного, податкового або регуляторного висновку в іншій юрисдикції, такий висновок надається або підтверджується належно кваліфікованим фахівцем; LEXONYX координує та інтегрує відповідні workstreams.</p>`,
      t4: `<h2>4. Відсутність відносин консультант — клієнт через використання сайту</h2><p>Використання сайту, перегляд матеріалів, надсилання запиту або заповнення форми самі по собі <strong>не створюють</strong> відносин «консультант — клієнт» або «юрист — клієнт».</p><p>Професійні відносини виникають лише після прийняття Matter LEXONYX і укладення відповідного договору. До цього моменту LEXONYX не бере на себе відповідальність за строки, подання документів або інші юридично значимі дії.</p>`,
      t9: `<h2>9. Застосовне право</h2><p>Ці Умови та використання сайту регулюються правом Німеччини без шкоди для імперативних норм захисту споживачів і колізійних норм, які можуть застосовуватися.</p><p>З питань, пов’язаних із цими Умовами: <a href="mailto:info@lexonyx.com">info@lexonyx.com</a>.</p>`,
      date: 'серпень 2026'
    },
    impressumScope: `<h2>4. Обсяг послуг</h2><p>LEXONYX фокусується на міжнародному структуруванні бізнесу, структурних і фактичних tax / VAT / PE інтерфейсах, banking readiness, Source of Funds / Source of Wealth, substance та corporate governance.</p><p>Консультації з українського права надаються безпосередньо в межах професійних повноважень адвоката України. Коли Matter потребує висновку щодо німецького права, німецького оподаткування або іншого зарезервованого професійного питання в Німеччині, відповідний висновок надає або підтверджує кваліфікований Rechtsanwalt, Steuerberater чи інший German professional.</p><p>Щодо інших юрисдикцій юрисдикційно-специфічні юридичні, податкові та регуляторні висновки надаються або підтверджуються кваліфікованими local professionals. LEXONYX координує транскордонний проєкт та інтегрує підтверджені висновки в загальну структуру.</p>`,
    desktop: `<div class="dropdown-content dropdown-two-col jurisdictions-two-col"><div class="dropdown-section"><h4>Ключові юрисдикції</h4><a href="/uk/yurysdyktsiyi/ukrayina.html"><span class="jur-code">UA</span> Україна</a><a href="/uk/yurysdyktsiyi/nimechchyna.html"><span class="jur-code">DE</span> Німеччина</a><a href="/uk/yurysdyktsiyi/kipr.html"><span class="jur-code">CY</span> Кіпр</a><a href="/uk/yurysdyktsiyi/polshcha.html"><span class="jur-code">PL</span> Польща</a><a href="/uk/yurysdyktsiyi/niderlandy.html"><span class="jur-code">NL</span> Нідерланди</a><a href="/uk/yurysdyktsiyi/oae.html"><span class="jur-code">AE</span> ОАЕ</a></div><div class="dropdown-section"><h4>Додаткові юрисдикції</h4><a href="/uk/yurysdyktsiyi/estoniya.html"><span class="jur-code">EE</span> Естонія</a><a href="/uk/yurysdyktsiyi/irlandiya.html"><span class="jur-code">IE</span> Ірландія</a><a href="/uk/yurysdyktsiyi/velykobrytaniya.html"><span class="jur-code">UK</span> Велика Британія</a><a href="/uk/yurysdyktsiyi/shveytsariya.html"><span class="jur-code">CH</span> Швейцарія</a></div><div class="dropdown-footer"><a href="/uk/yurysdyktsiyi/index.html" class="btn-dropdown-all">Усі юрисдикції →</a></div></div>`,
    mobile: `<a class="mobile-sub-link" href="/uk/yurysdyktsiyi/ukrayina.html">Україна</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/nimechchyna.html">Німеччина</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/kipr.html">Кіпр</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/polshcha.html">Польща</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/niderlandy.html">Нідерланди</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/oae.html">ОАЕ</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/estoniya.html">Естонія</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/irlandiya.html">Ірландія</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/velykobrytaniya.html">Велика Британія</a><a class="mobile-sub-link" href="/uk/yurysdyktsiyi/shveytsariya.html">Швейцарія</a><a class="mobile-sub-link mobile-sub-link-all" href="/uk/yurysdyktsiyi/index.html">Усі юрисдикції →</a>`
  }
};

function replaceDivInnerByPredicate(html, predicate, replacement) {
  let from = 0;
  while (true) {
    const re = /<div\b[^>]*>/gi;
    re.lastIndex = from;
    let open;
    while ((open = re.exec(html))) {
      if (predicate(open[0])) break;
    }
    if (!open) break;
    const startInner = open.index + open[0].length;
    const tokenRe = /<div\b[^>]*>|<\/div>/gi;
    tokenRe.lastIndex = startInner;
    let depth = 1, token, closeStart = -1;
    while ((token = tokenRe.exec(html))) {
      if (/^<div\b/i.test(token[0])) depth++;
      else depth--;
      if (depth === 0) { closeStart = token.index; break; }
    }
    if (closeStart < 0) break;
    html = html.slice(0, startInner) + replacement + html.slice(closeStart);
    from = startInner + replacement.length;
  }
  return html;
}

function replaceSection(html, id, inner) {
  return replaceDivInnerByPredicate(html, tag => new RegExp(`\\bid=["']${id}["']`, 'i').test(tag) && /legal-section/i.test(tag), inner);
}

function replaceComplaintParagraph(html, replacement) {
  return html.replace(/<p>[^<]*(?:right|право|маєте право)[\s\S]{0,350}?(?:supervisory|надзор|наглядов)[\s\S]{0,500}?<\/p>/i, replacement);
}

function normalizeLegalLangLinks(html, basename) {
  const map = { ru: `/ru/${basename}`, en: `/en/${basename}`, uk: `/uk/${basename}` };
  return html.replace(/<a\b([^>]*class=["'][^"']*lang-option[^"']*["'][^>]*)>/gi, (tag, attrs) => {
    const m = attrs.match(/lang=["'](ru|en|uk)["']/i);
    if (!m) return tag;
    const href = map[m[1].toLowerCase()];
    return tag.includes('href=') ? tag.replace(/href=["'][^"']*["']/i, `href="${href}"`) : tag.replace(/>$/, ` href="${href}">`);
  });
}

function normalizeJurisdictionMenus(html, c) {
  html = replaceDivInnerByPredicate(html, tag => /class=["'][^"']*dropdown-menu[^"']*dropdown-jurisdictions[^"']*["']/i.test(tag), c.desktop);
  html = replaceDivInnerByPredicate(html, tag => /id=["']mobile-(?:yurisdikcii|jurisdictions)-content["']/i.test(tag), c.mobile);
  return html;
}

function dedupeCanonical(html) {
  let seen = false;
  return html.replace(/\s*<link\b[^>]*rel=["']canonical["'][^>]*\/?>/gi, tag => {
    if (seen) return '';
    seen = true;
    return tag;
  });
}

function patchPrivacy(html, c) {
  html = replaceSection(html, 's1', c.privacy.s1);
  html = replaceSection(html, 's5', c.privacy.s5);
  html = replaceSection(html, 's7', c.privacy.s7);
  html = replaceComplaintParagraph(html, c.privacy.complaint);
  html = html.replace(/(?:March|март|березень)\s+2026/gi, c.privacy.date);
  return html;
}

function patchCookie(html, c) {
  html = replaceSection(html, 'c2', c.cookie.c2);
  html = replaceSection(html, 'c3', c.cookie.c3);
  html = replaceSection(html, 'c5', c.cookie.c5);
  html = replaceSection(html, 'c6', c.cookie.c6);
  html = replaceSection(html, 'c7', c.cookie.c7);
  html = html.replace(/(?:March|март|березень)\s+2026/gi, c.cookie.date);
  return html;
}

function patchTerms(html, c) {
  html = replaceSection(html, 't2', c.terms.t2);
  html = replaceSection(html, 't4', c.terms.t4);
  html = replaceSection(html, 't9', c.terms.t9);
  html = html.replace(/(?:March|март|березень)\s+2026/gi, c.terms.date);
  html = html.replace(/\(f\s*fiduciary duties\)/gi, '(fiduciary duties)');
  return html;
}

function patchImpressum(html, lang, c) {
  html = html.replace(/\s*<!--\s*ПЕРЕД ПУБЛИКАЦИЕЙ[\s\S]*?-->/gi, '');
  html = html.replace(/\s*<li><a href=["']#i5["'][^>]*>[\s\S]*?<\/a><\/li>/gi, '');
  html = replaceSection(html, 'i4', c.impressumScope);
  html = html.replace(/<p><strong>(LEXONYX[^<]*Schlichtungsstelle[\s\S]*?jurisdiction\.)<\/p>/i, '<p>$1</p>');
  html = html.replace(/<p><strong>(LEXONYX[^<]*Schlichtungsstelle[\s\S]*?юрисдикц[^<]*\.)<\/p>/i, '<p>$1</p>');
  html = html.replace(/<p><strong>(LEXONYX[^<]*Schlichtungsstelle[\s\S]*?юрисдикц[^<]*\.)<\/p>/i, '<p>$1</p>');
  if (lang === 'en') {
    html = html.replace(/LEXONYX Terms of Use: nature of information, no lawyer-client relationship, intellectual property and limitation of liability\./g, 'LEXONYX Legal Notice: service provider, professional status, competent bar association, professional rules, liability insurance and website disclosures.');
    html = html.replace(/Terms of Use — LEXONYX/g, 'Legal Notice / Impressum — LEXONYX');
  }
  html = html.replace(/<\/link>/gi, '');
  html = dedupeCanonical(html);
  return html;
}

let changed = 0;
for (const lang of LANGS) {
  const c = cfg[lang];
  for (const basename of LEGAL) {
    const file = path.join(ROOT, lang, basename);
    if (!fs.existsSync(file)) continue;
    const original = fs.readFileSync(file, 'utf8');
    let html = original;
    html = normalizeJurisdictionMenus(html, c);
    html = normalizeLegalLangLinks(html, basename);
    html = html.replace(/href=["']\/(?:en|ru|uk)\/intake\/intake\.html["']/gi, `href="${c.review}"`);
    if (basename === 'privacy-policy.html') html = patchPrivacy(html, c);
    if (basename === 'cookie-policy.html') html = patchCookie(html, c);
    if (basename === 'terms-of-use.html') html = patchTerms(html, c);
    if (basename === 'impressum.html') html = patchImpressum(html, lang, c);
    if (html !== original) { fs.writeFileSync(file, html, 'utf8'); changed++; }
  }
}

const redirects = path.join(ROOT, '_redirects');
if (fs.existsSync(redirects)) {
  const r0 = fs.readFileSync(redirects, 'utf8');
  const r1 = r0.replace('# Root language entry — temporary default to EN; forced so the legacy root index.html is not served.', '# Root language entry — permanent international default to EN; forced so the legacy root index.html is not served.')
    .replace(/^\/\s+\/en\/index\.html\s+302!$/m, '/                               /en/index.html                                                301!');
  if (r1 !== r0) fs.writeFileSync(redirects, r1, 'utf8');
}

console.log(`[LEXONYX final legal cleanup] changed legal files=${changed}`);
