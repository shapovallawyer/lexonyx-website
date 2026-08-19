// LEXONYX UI consistency runtime — keeps language switchers aligned with hreflang alternates.
(function () {
  'use strict';

  function applyLanguageLinks() {
    var alternates = {};
    document.querySelectorAll('link[rel~="alternate"][hreflang]').forEach(function (link) {
      var lang = (link.getAttribute('hreflang') || '').toLowerCase();
      if (lang === 'ru' || lang === 'en' || lang === 'uk') {
        try {
          var u = new URL(link.getAttribute('href'), window.location.origin);
          alternates[lang] = u.pathname + u.search + u.hash;
        } catch (e) {}
      }
    });

    // Hard fallback for the main English landing page. This prevents /index.html
    // from being used as the RU target, because the root is intentionally a 301 to EN.
    var p = window.location.pathname.replace(/\/+$/, '');
    if (p === '/en' || p === '/en/index.html') {
      alternates.ru = '/ru/index.html';
      alternates.en = '/en/index.html';
      alternates.uk = '/uk/index.html';
    }

    ['ru', 'en', 'uk'].forEach(function (lang) {
      if (!alternates[lang]) return;
      document.querySelectorAll('a.lang-option[lang="' + lang + '"]').forEach(function (a) {
        a.setAttribute('href', alternates[lang]);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLanguageLinks, { once: true });
  } else {
    applyLanguageLinks();
  }
})();
