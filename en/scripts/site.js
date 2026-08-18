// /en/scripts/site.js
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
    (window.LEXONYX_SEARCH_INDEX_EN && Array.isArray(window.LEXONYX_SEARCH_INDEX_EN))
      ? window.LEXONYX_SEARCH_INDEX_EN.slice()
      : [];

  const jurisdictionSearchData = [
    { title: 'Jurisdictions & Structural Use Cases', category: 'Jurisdictions', url: '/en/jurisdictions/index.html' },
    { title: 'Ukraine in International Business Structures', category: 'Jurisdictions', url: '/en/jurisdictions/ukraine.html' },
    { title: 'Germany in International Business Structures', category: 'Jurisdictions', url: '/en/jurisdictions/germany.html' },
    { title: 'Cyprus: HoldCo, Ownership and IP Structures', category: 'Jurisdictions', url: '/en/jurisdictions/cyprus.html' },
    { title: 'Poland: Workforce, DevelopmentCo and EU Operations', category: 'Jurisdictions', url: '/en/jurisdictions/poland.html' },
    { title: 'Netherlands: Investor HoldCo and Group Architecture', category: 'Jurisdictions', url: '/en/jurisdictions/netherlands.html' },
    { title: 'UAE: Founder Relocation, Operations and MENA', category: 'Jurisdictions', url: '/en/jurisdictions/uae.html' },
    { title: 'Estonia: Digital, SaaS and Remote Business', category: 'Jurisdictions', url: '/en/jurisdictions/estonia.html' },
    { title: 'Ireland: Technology, IP and R&D', category: 'Jurisdictions', url: '/en/jurisdictions/ireland.html' },
    { title: 'United Kingdom: International Business and Investment', category: 'Jurisdictions', url: '/en/jurisdictions/united-kingdom.html' },
    { title: 'Switzerland: Private Capital, HQ and Founder Structures', category: 'Jurisdictions', url: '/en/jurisdictions/switzerland.html' }
  ];

  searchData = searchData
    .filter(item => (item.category || '') !== 'Jurisdictions')
    .concat(jurisdictionSearchData);

  function normalizeJurisdictionNavigation() {
    const desktop = document.querySelector('.dropdown-menu.dropdown-jurisdictions .jurisdictions-two-col');
    if (desktop) {
      desktop.innerHTML = `
        <div class="dropdown-section">
          <h4>Core jurisdictions</h4>
          <a href="/en/jurisdictions/ukraine.html"><span class="jur-code">UA</span> Ukraine</a>
          <a href="/en/jurisdictions/germany.html"><span class="jur-code">DE</span> Germany</a>
          <a href="/en/jurisdictions/cyprus.html"><span class="jur-code">CY</span> Cyprus</a>
          <a href="/en/jurisdictions/poland.html"><span class="jur-code">PL</span> Poland</a>
          <a href="/en/jurisdictions/netherlands.html"><span class="jur-code">NL</span> Netherlands</a>
          <a href="/en/jurisdictions/uae.html"><span class="jur-code">AE</span> UAE</a>
        </div>
        <div class="dropdown-section">
          <h4>Additional jurisdictions</h4>
          <a href="/en/jurisdictions/estonia.html"><span class="jur-code">EE</span> Estonia</a>
          <a href="/en/jurisdictions/ireland.html"><span class="jur-code">IE</span> Ireland</a>
          <a href="/en/jurisdictions/united-kingdom.html"><span class="jur-code">UK</span> United Kingdom</a>
          <a href="/en/jurisdictions/switzerland.html"><span class="jur-code">CH</span> Switzerland</a>
        </div>
        <div class="dropdown-footer">
          <a href="/en/jurisdictions/index.html" class="btn-dropdown-all">All jurisdictions →</a>
        </div>`;
    }

    const mobileJurisdictions = document.getElementById('mobile-jurisdictions-content');
    if (mobileJurisdictions) {
      mobileJurisdictions.innerHTML = `
        <div class="mobile-sub-group">
          <div class="mobile-sub-group-title">Core jurisdictions</div>
          <a href="/en/jurisdictions/ukraine.html" class="mobile-sub-link">Ukraine</a>
          <a href="/en/jurisdictions/germany.html" class="mobile-sub-link">Germany</a>
          <a href="/en/jurisdictions/cyprus.html" class="mobile-sub-link">Cyprus</a>
          <a href="/en/jurisdictions/poland.html" class="mobile-sub-link">Poland</a>
          <a href="/en/jurisdictions/netherlands.html" class="mobile-sub-link">Netherlands</a>
          <a href="/en/jurisdictions/uae.html" class="mobile-sub-link">UAE</a>
        </div>
        <div class="mobile-sub-group">
          <div class="mobile-sub-group-title">Additional jurisdictions</div>
          <a href="/en/jurisdictions/estonia.html" class="mobile-sub-link">Estonia</a>
          <a href="/en/jurisdictions/ireland.html" class="mobile-sub-link">Ireland</a>
          <a href="/en/jurisdictions/united-kingdom.html" class="mobile-sub-link">United Kingdom</a>
          <a href="/en/jurisdictions/switzerland.html" class="mobile-sub-link">Switzerland</a>
        </div>
        <a href="/en/jurisdictions/index.html" class="mobile-sub-link">All jurisdictions →</a>`;
    }

    document.querySelectorAll('.footer-col').forEach(col => {
      const heading = col.querySelector('.footer-heading');
      const links = col.querySelector('ul.footer-links');
      if (!heading || !links || heading.textContent.trim() !== 'Jurisdictions') return;
      links.innerHTML = `
        <li><a href="/en/jurisdictions/index.html">All jurisdictions</a></li>
        <li><a href="/en/jurisdictions/ukraine.html">Ukraine</a></li>
        <li><a href="/en/jurisdictions/germany.html">Germany</a></li>
        <li><a href="/en/jurisdictions/cyprus.html">Cyprus</a></li>
        <li><a href="/en/jurisdictions/poland.html">Poland</a></li>
        <li><a href="/en/jurisdictions/netherlands.html">Netherlands</a></li>
        <li><a href="/en/jurisdictions/uae.html">UAE</a></li>
        <li><a href="/en/jurisdictions/estonia.html">Estonia</a></li>
        <li><a href="/en/jurisdictions/ireland.html">Ireland</a></li>
        <li><a href="/en/jurisdictions/united-kingdom.html">United Kingdom</a></li>
        <li><a href="/en/jurisdictions/switzerland.html">Switzerland</a></li>`;
    });
  }

  normalizeJurisdictionNavigation();

  function renderResults(items) {
    if (!searchResults) return;
    if (!items || !items.length) {
      searchResults.innerHTML = '<div class="search-empty">No results found. Try a different search.</div>';
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
    mobileMenu.setAttribute('aria-hidden', 'false');
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
      if (btn) { btn.disabled = true; btn.textContent = 'Submitting…'; }
    });
  }

  const hasIntakeFields = document.getElementById('timestamp_iso') || document.querySelector('form[name="intake"]');
  if (hasIntakeFields) { fillMetaFields(); wireFormSubmitLock(); }
})();