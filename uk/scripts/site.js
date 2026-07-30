// /uk/scripts/site.js
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

  // Search index
  const searchData =
    (window.LEXONYX_SEARCH_INDEX_UK && Array.isArray(window.LEXONYX_SEARCH_INDEX_UK))
      ? window.LEXONYX_SEARCH_INDEX_UK
      : [];

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

  // Header scroll state
  window.addEventListener('scroll', function () {
    if (!header) return;
    if (window.pageYOffset > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }, { passive: true });

  // Search events
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

  // Mobile menu events
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

  // Cookie settings links (placeholder)
  cookieSettingsLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.removeItem('cookie_consent');
      window.location.reload();
    });
  });

  // ESC closes overlays
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeSearch();
      closeMobileMenu();
    }
  });

  // =========================
  // Intake helpers (optional)
  // =========================
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
        btn.textContent = 'Надсилаємо…';
      }
    });
  }

  // Run only if intake fields exist on the page
  const hasIntakeFields = document.getElementById('timestamp_iso') || document.querySelector('form[name="intake"]');
  if (hasIntakeFields) {
    fillMetaFields();
    wireFormSubmitLock();
  }
})();