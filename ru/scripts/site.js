// /ru/scripts/site.js
(function () {
  'use strict';

  // Elements
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

  // Search index: replace legacy jurisdiction records with the curated 6+4 library.
  let searchData =
    (window.LEXONYX_SEARCH_INDEX_RU && Array.isArray(window.LEXONYX_SEARCH_INDEX_RU))
      ? window.LEXONYX_SEARCH_INDEX_RU.slice()
      : [];

  const jurisdictionSearchData = [
    { title: 'Юрисдикции и структурные сценарии', category: 'Юрисдикции', url: '/ru/yurisdikcii/index.html' },
    { title: 'Украина и международный бизнес', category: 'Юрисдикции', url: '/ru/yurisdikcii/ukraina.html' },
    { title: 'Германия в международной структуре бизнеса', category: 'Юрисдикции', url: '/ru/yurisdikcii/germaniya.html' },
    { title: 'Кипр: HoldCo, ownership и IP в международной структуре', category: 'Юрисдикции', url: '/ru/yurisdikcii/kipr.html' },
    { title: 'Польша: workforce, DevelopmentCo и EU operations', category: 'Юрисдикции', url: '/ru/yurisdikcii/polsha.html' },
    { title: 'Нидерланды: Investor HoldCo и архитектура международной группы', category: 'Юрисдикции', url: '/ru/yurisdikcii/niderlandy.html' },
    { title: 'ОАЭ: relocation, operating company и MENA', category: 'Юрисдикции', url: '/ru/yurisdikcii/oae.html' },
    { title: 'Эстония: digital, SaaS и remote business', category: 'Юрисдикции', url: '/ru/yurisdikcii/estoniya.html' },
    { title: 'Ирландия: technology, IP и R&D', category: 'Юрисдикции', url: '/ru/yurisdikcii/irlandiya.html' },
    { title: 'Великобритания: international business и investment', category: 'Юрисдикции', url: '/ru/yurisdikcii/velikobritaniya.html' },
    { title: 'Швейцария: private capital, HQ и founder structures', category: 'Юрисдикции', url: '/ru/yurisdikcii/shveycariya.html' }
  ];

  searchData = searchData
    .filter(item => (item.category || '') !== 'Юрисдикции')
    .concat(jurisdictionSearchData);

  function normalizeJurisdictionNavigation() {
    const desktop = document.querySelector('.dropdown-menu.dropdown-jurisdictions .jurisdictions-two-col');
    if (desktop) {
      desktop.innerHTML = `
        <div class="dropdown-section">
          <h4>Ключевые</h4>
          <a href="/ru/yurisdikcii/ukraina.html"><span class="jur-code">UA</span> Украина</a>
          <a href="/ru/yurisdikcii/germaniya.html"><span class="jur-code">DE</span> Германия</a>
          <a href="/ru/yurisdikcii/kipr.html"><span class="jur-code">CY</span> Кипр</a>
          <a href="/ru/yurisdikcii/polsha.html"><span class="jur-code">PL</span> Польша</a>
          <a href="/ru/yurisdikcii/niderlandy.html"><span class="jur-code">NL</span> Нидерланды</a>
          <a href="/ru/yurisdikcii/oae.html"><span class="jur-code">AE</span> ОАЭ</a>
        </div>
        <div class="dropdown-section">
          <h4>Дополнительные</h4>
          <a href="/ru/yurisdikcii/estoniya.html"><span class="jur-code">EE</span> Эстония</a>
          <a href="/ru/yurisdikcii/irlandiya.html"><span class="jur-code">IE</span> Ирландия</a>
          <a href="/ru/yurisdikcii/velikobritaniya.html"><span class="jur-code">UK</span> Великобритания</a>
          <a href="/ru/yurisdikcii/shveycariya.html"><span class="jur-code">CH</span> Швейцария</a>
        </div>
        <div class="dropdown-footer">
          <a href="/ru/yurisdikcii/index.html" class="btn-dropdown-all">Все юрисдикции →</a>
        </div>`;
    }

    const mobileJurisdictions = document.getElementById('mobile-yurisdikcii-content');
    if (mobileJurisdictions) {
      mobileJurisdictions.innerHTML = `
        <div class="mobile-sub-group">
          <div class="mobile-sub-group-title">Ключевые</div>
          <a href="/ru/yurisdikcii/ukraina.html" class="mobile-sub-link">Украина</a>
          <a href="/ru/yurisdikcii/germaniya.html" class="mobile-sub-link">Германия</a>
          <a href="/ru/yurisdikcii/kipr.html" class="mobile-sub-link">Кипр</a>
          <a href="/ru/yurisdikcii/polsha.html" class="mobile-sub-link">Польша</a>
          <a href="/ru/yurisdikcii/niderlandy.html" class="mobile-sub-link">Нидерланды</a>
          <a href="/ru/yurisdikcii/oae.html" class="mobile-sub-link">ОАЭ</a>
        </div>
        <div class="mobile-sub-group">
          <div class="mobile-sub-group-title">Дополнительные</div>
          <a href="/ru/yurisdikcii/estoniya.html" class="mobile-sub-link">Эстония</a>
          <a href="/ru/yurisdikcii/irlandiya.html" class="mobile-sub-link">Ирландия</a>
          <a href="/ru/yurisdikcii/velikobritaniya.html" class="mobile-sub-link">Великобритания</a>
          <a href="/ru/yurisdikcii/shveycariya.html" class="mobile-sub-link">Швейцария</a>
        </div>
        <a href="/ru/yurisdikcii/index.html" class="mobile-sub-link">Все юрисдикции →</a>`;
    }

    document.querySelectorAll('.footer-col').forEach(col => {
      const heading = col.querySelector('.footer-heading');
      const links = col.querySelector('ul.footer-links');
      if (!heading || !links || heading.textContent.trim() !== 'Юрисдикции') return;
      links.innerHTML = `
        <li><a href="/ru/yurisdikcii/index.html">Все юрисдикции</a></li>
        <li><a href="/ru/yurisdikcii/ukraina.html">Украина</a></li>
        <li><a href="/ru/yurisdikcii/germaniya.html">Германия</a></li>
        <li><a href="/ru/yurisdikcii/kipr.html">Кипр</a></li>
        <li><a href="/ru/yurisdikcii/polsha.html">Польша</a></li>
        <li><a href="/ru/yurisdikcii/niderlandy.html">Нидерланды</a></li>
        <li><a href="/ru/yurisdikcii/oae.html">ОАЭ</a></li>
        <li><a href="/ru/yurisdikcii/estoniya.html">Эстония</a></li>
        <li><a href="/ru/yurisdikcii/irlandiya.html">Ирландия</a></li>
        <li><a href="/ru/yurisdikcii/velikobritaniya.html">Великобритания</a></li>
        <li><a href="/ru/yurisdikcii/shveycariya.html">Швейцария</a></li>`;
    });
  }

  normalizeJurisdictionNavigation();

  function renderResults(items) {
    if (!searchResults) return;

    if (!items || !items.length) {
      searchResults.innerHTML = '<div class="search-empty">Ничего не найдено. Попробуйте другой запрос.</div>';
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

  if (searchOverlay) {
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      const query = (e.target.value || '').trim().toLowerCase();
      if (!query) {
        renderResults(searchData.slice(0, 10));
        return;
      }

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
    if (e.key === 'Escape') {
      closeSearch();
      closeMobileMenu();
    }
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
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Отправляем…';
      }
    });
  }

  const hasIntakeFields = document.getElementById('timestamp_iso') || document.querySelector('form[name="intake"]');
  if (hasIntakeFields) {
    fillMetaFields();
    wireFormSubmitLock();
  }

  if (!document.querySelector('script[data-lexonyx-compliance]')) {
    const compliance = document.createElement('script');
    compliance.src = '/scripts/compliance-runtime.js?v=20260819';
    compliance.defer = true;
    compliance.setAttribute('data-lexonyx-compliance', '2026-08-19');
    document.head.appendChild(compliance);
  }
})();