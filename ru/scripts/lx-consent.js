/* LEXONYX — multilingual cookie-consent and analytics module.
   GA4 measurement ID: G-DM7WZKD0H3 (lexonyx.com). */
(function () {
  'use strict';
  var GA_ID = 'G-DM7WZKD0H3';
  var path = (window.location.pathname || '/').toLowerCase();
  var lang = path.indexOf('/ru/') === 0 ? 'ru' : (path.indexOf('/uk/') === 0 ? 'uk' : 'en');
  var copy = {
    en: {
      aria: 'Analytics cookie notice',
      text: 'We use analytics cookies to improve the website. Google Analytics is loaded only with your consent. More information: ',
      policy: 'Cookie Policy',
      policyUrl: '/en/cookie-policy.html',
      accept: 'Accept analytics',
      reject: 'Reject analytics'
    },
    ru: {
      aria: 'Уведомление об аналитических cookies',
      text: 'Мы используем аналитические cookies для улучшения сайта. Google Analytics загружается только с вашего согласия. Подробнее: ',
      policy: 'Политика cookies',
      policyUrl: '/ru/cookie-policy.html',
      accept: 'Принять аналитику',
      reject: 'Отклонить аналитику'
    },
    uk: {
      aria: 'Повідомлення про аналітичні cookies',
      text: 'Ми використовуємо аналітичні cookies для покращення сайту. Google Analytics завантажується лише за вашою згодою. Докладніше: ',
      policy: 'Політика cookies',
      policyUrl: '/uk/cookie-policy.html',
      accept: 'Прийняти аналітику',
      reject: 'Відхилити аналітику'
    }
  }[lang];

  function loadGA() {
    if (window.__lxGaLoaded) return;
    window.__lxGaLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function buildBanner() {
    var banner = document.getElementById('cookie-banner');
    if (banner) return banner;
    banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.style.display = 'none';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', copy.aria);
    banner.innerHTML = '<div class="cookie-banner-inner"><div class="cookie-text">' + copy.text + '<a href="' + copy.policyUrl + '">' + copy.policy + '</a>.</div><div class="cookie-actions"><button id="accept-cookies" class="btn btn-primary" type="button">' + copy.accept + '</button><button id="reject-cookies" class="btn btn-secondary" type="button">' + copy.reject + '</button></div></div>';
    document.body.appendChild(banner);
    return banner;
  }

  function showSettings(banner) {
    banner.style.display = 'block';
    var accept = document.getElementById('accept-cookies');
    if (accept) accept.focus({ preventScroll: true });
  }

  function init() {
    var banner = buildBanner();
    var consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') loadGA();
    else if (!consent) banner.style.display = 'block';

    var a = document.getElementById('accept-cookies');
    var r = document.getElementById('reject-cookies');
    if (a) a.addEventListener('click', function () {
      localStorage.setItem('cookie_consent', 'accepted');
      loadGA();
      banner.style.display = 'none';
    });
    if (r) r.addEventListener('click', function () {
      var wasAccepted = localStorage.getItem('cookie_consent') === 'accepted';
      localStorage.setItem('cookie_consent', 'rejected');
      banner.style.display = 'none';
      if (wasAccepted) window.location.reload();
    });

    document.querySelectorAll('[data-cookie-settings]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        showSettings(banner);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
