// /uk/scripts/site.js
(function () {
  'use strict';

  const header = document.getElementById('main-header');
  const searchToggle = document.getElementById('search-toggle');
  const searchOverlay = document.getElementById('search-overlay');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const accordionTriggers = document.querySelectorAll('.mobile-accordion-trigger');
  const cookieSettingsLinks = document.querySelectorAll('[data-cookie-settings]');

  let searchData =
    (window.LEXONYX_SEARCH_INDEX_UK && Array.isArray(window.LEXONYX_SEARCH_INDEX_UK))
      ? window.LEXONYX_SEARCH_INDEX_UK.slice()
      : [];

  const jurisdictionSearchData = [
    { title: 'Юрисдикції та структурні сценарії', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/index.html' },
    { title: 'Україна в міжнародній структурі бізнесу', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/ukrayina.html' },
    { title: 'Німеччина в міжнародній структурі бізнесу', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/nimechchyna.html' },
    { title: 'Кіпр: HoldCo, ownership та IP-структури', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/kipr.html' },
    { title: 'Польща: workforce, DevelopmentCo та EU operations', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/polshcha.html' },
    { title: 'Нідерланди: Investor HoldCo та архітектура групи', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/niderlandy.html' },
    { title: 'ОАЕ: relocation, operating company та MENA', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/oae.html' },
    { title: 'Естонія: digital, SaaS та remote business', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/estoniya.html' },
    { title: 'Ірландія: technology, IP та R&D', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/irlandiya.html' },
    { title: 'Велика Британія: international business та investment', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/velykobrytaniya.html' },
    { title: 'Швейцарія: private capital, HQ та founder structures', category: 'Юрисдикції', url: '/uk/yurysdyktsiyi/shveytsariya.html' }
  ];

  searchData = searchData
    .filter(item => (item.category || '') !== 'Юрисдикції')
    .concat(jurisdictionSearchData);

  function normalizeJurisdictionNavigation() {
    const desktop = document.querySelector('.dropdown-menu.dropdown-jurisdictions .jurisdictions-two-col');
    if (desktop) {
      desktop.innerHTML = `
        <div class="dropdown-section">
          <h4>Ключові юрисдикції</h4>
          <a href="/uk/yurysdyktsiyi/ukrayina.html"><span class="jur-code">UA</span> Україна</a>
          <a href="/uk/yurysdyktsiyi/nimechchyna.html"><span class="jur-code">DE</span> Німеччина</a>
          <a href="/uk/yurysdyktsiyi/kipr.html"><span class="jur-code">CY</span> Кіпр</a>
          <a href="/uk/yurysdyktsiyi/polshcha.html"><span class="jur-code">PL</span> Польща</a>
          <a href="/uk/yurysdyktsiyi/niderlandy.html"><span class="jur-code">NL</span> Нідерланди</a>
          <a href="/uk/yurysdyktsiyi/oae.html"><span class="jur-code">AE</span> ОАЕ</a>
        </div>
        <div class="dropdown-section">
          <h4>Додаткові юрисдикції</h4>
          <a href="/uk/yurysdyktsiyi/estoniya.html"><span class="jur-code">EE</span> Естонія</a>
          <a href="/uk/yurysdyktsiyi/irlandiya.html"><span class="jur-code">IE</span> Ірландія</a>
          <a href="/uk/yurysdyktsiyi/velykobrytaniya.html"><span class="jur-code">UK</span> Велика Британія</a>
          <a href="/uk/yurysdyktsiyi/shveytsariya.html"><span class="jur-code">CH</span> Швейцарія</a>
        </div>
        <div class="dropdown-footer">
          <a href="/uk/yurysdyktsiyi/index.html" class="btn-dropdown-all">Усі юрисдикції →</a>
        </div>`;
    }

    const mobileJurisdictions = document.getElementById('mobile-yurisdikcii-content');
    if (mobileJurisdictions) {
      mobileJurisdictions.innerHTML = `
        <div class="mobile-sub-group">
          <div class="mobile-sub-group-title">Ключові юрисдикції</div>
          <a href="/uk/yurysdyktsiyi/ukrayina.html" class="mobile-sub-link">Україна</a>
          <a href="/uk/yurysdyktsiyi/nimechchyna.html" class="mobile-sub-link">Німеччина</a>
          <a href="/uk/yurysdyktsiyi/kipr.html" class="mobile-sub-link">Кіпр</a>
          <a href="/uk/yurysdyktsiyi/polshcha.html" class="mobile-sub-link">Польща</a>
          <a href="/uk/yurysdyktsiyi/niderlandy.html" class="mobile-sub-link">Нідерланди</a>
          <a href="/uk/yurysdyktsiyi/oae.html" class="mobile-sub-link">ОАЕ</a>
        </div>
        <div class="mobile-sub-group">
          <div class="mobile-sub-group-title">Додаткові юрисдикції</div>
          <a href="/uk/yurysdyktsiyi/estoniya.html" class="mobile-sub-link">Естонія</a>
          <a href="/uk/yurysdyktsiyi/irlandiya.html" class="mobile-sub-link">Ірландія</a>
          <a href="/uk/yurysdyktsiyi/velykobrytaniya.html" class="mobile-sub-link">Велика Британія</a>
          <a href="/uk/yurysdyktsiyi/shveytsariya.html" class="mobile-sub-link">Швейцарія</a>
        </div>
        <a href="/uk/yurysdyktsiyi/index.html" class="mobile-sub-link">Усі юрисдикції →</a>`;
    }

    document.querySelectorAll('.footer-col').forEach(col => {
      const heading = col.querySelector('.footer-heading');
      const links = col.querySelector('ul.footer-links');
      if (!heading || !links || heading.textContent.trim() !== 'Юрисдикції') return;
      links.innerHTML = `
        <li><a href="/uk/yurysdyktsiyi/index.html">Усі юрисдикції</a></li>
        <li><a href="/uk/yurysdyktsiyi/ukrayina.html">Україна</a></li>
        <li><a href="/uk/yurysdyktsiyi/nimechchyna.html">Німеччина</a></li>
        <li><a href="/uk/yurysdyktsiyi/kipr.html">Кіпр</a></li>
        <li><a href="/uk/yurysdyktsiyi/polshcha.html">Польща</a></li>
        <li><a href="/uk/yurysdyktsiyi/niderlandy.html">Нідерланди</a></li>
        <li><a href="/uk/yurysdyktsiyi/oae.html">ОАЕ</a></li>
        <li><a href="/uk/yurysdyktsiyi/estoniya.html">Естонія</a></li>
        <li><a href="/uk/yurysdyktsiyi/irlandiya.html">Ірландія</a></li>
        <li><a href="/uk/yurysdyktsiyi/velykobrytaniya.html">Велика Британія</a></li>
        <li><a href="/uk/yurysdyktsiyi/shveytsariya.html">Швейцарія</a></li>`;
    });
  }

  normalizeJurisdictionNavigation();

  function renderResults(items) {
    if (!searchResults) return;
    if (!items || !items.length) {
      searchResults.innerHTML = '<div class="search-empty">Нічого не знайдено. Спробуйте інший запит.</div>';
      return;
    }
    searchResults.innerHTML = items.map(item => `
      <a class="search-result-item" href="${item.url}">
        <span class="search-result-category">${item.category || ''}</span>
        <strong class="search-result-title">${item.title}</strong>
      </a>
    `).join('');
  }

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add('active');
    searchOverlay.setAttribute('aria-hidden', 'false');
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('search-open');
    renderResults(searchData.slice(0, 10));
    window.setTimeout(() => searchInput && searchInput.focus(), 40);
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove('active');
    searchOverlay.setAttribute('aria-hidden', 'true');
    if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('search-open');
    if (searchInput) searchInput.value = '';
    if (searchResults) searchResults.innerHTML = '';
  }

  function openMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggle) mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  window.addEventListener('scroll', function () {
    if (!header) return;
    if (window.pageYOffset > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  if (searchToggle) searchToggle.addEventListener('click', openSearch);
  if (searchClose) searchClose.addEventListener('click', closeSearch);
  if (searchOverlay) searchOverlay.addEventListener('click', function (e) { if (e.target === searchOverlay) closeSearch(); });

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const query = (e.target.value || '').trim().toLowerCase();
      if (!query) { renderResults(searchData.slice(0, 10)); return; }
      const filtered = searchData.filter(item => {
        const t = (item.title || '').toLowerCase();
        const c = (item.category || '').toLowerCase();
        return t.includes(query) || c.includes(query);
      }).slice(0, 10);
      renderResults(filtered);
    });
  }

  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);

  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
      const content = this.nextElementSibling;
      const isOpen = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!isOpen));
      if (content) {
        content.classList.toggle('open', !isOpen);
        content.classList.toggle('active', !isOpen);
      }
    });
  });

  cookieSettingsLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('cookie_consent');
      window.location.reload();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeSearch(); closeMobileMenu(); }
  });

  function getParam(name) {
    try { return new URL(window.location.href).searchParams.get(name) || ''; }
    catch (e) { return ''; }
  }

  function safeSet(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
  }

  function fillMetaFields() {
    safeSet('timestamp_iso', new Date().toISOString());
    safeSet('source_url', window.location.href);
    safeSet('referrer', document.referrer || '');
    safeSet('utm_source', getParam('utm_source'));
    safeSet('utm_medium', getParam('utm_medium'));
    safeSet('utm_campaign', getParam('utm_campaign'));
    safeSet('utm_term', getParam('utm_term'));
    safeSet('utm_content', getParam('utm_content'));
  }

  function wireFormSubmitLock() {
    const form = document.querySelector('form[name="intake"]');
    const btn = document.getElementById('submitBtn');
    if (!form) return;
    form.addEventListener('submit', function () {
      if (btn) { btn.disabled = true; btn.textContent = 'Надсилаємо…'; }
    });
  }

  const hasIntakeFields = document.getElementById('timestamp_iso') || document.querySelector('form[name="intake"]');
  if (hasIntakeFields) { fillMetaFields(); wireFormSubmitLock(); }

  if (!document.querySelector('script[data-lexonyx-compliance]')) {
    const compliance = document.createElement('script');
    compliance.src = '/scripts/compliance-runtime.js?v=20260819';
    compliance.defer = true;
    compliance.setAttribute('data-lexonyx-compliance', '2026-08-19');
    document.head.appendChild(compliance);
  }
})();