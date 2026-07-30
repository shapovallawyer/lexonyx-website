/* LEXONYX — единый модуль cookie-согласия и аналитики.
   Идентификатор потока GA4: G-DM7WZKD0H3 (lexonyx.com). */
(function () {
  var GA_ID = 'G-DM7WZKD0H3';
  function loadGA() {
    if (window.__lxGaLoaded) return;
    window.__lxGaLoaded = true;
    var s = document.createElement('script');
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
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
    banner.setAttribute('aria-label', 'Уведомление об использовании cookies');
    banner.innerHTML = '<div class="cookie-banner-inner"><div class="cookie-text">Мы используем аналитические cookies для улучшения сайта. Они активируются только при вашем согласии. Подробнее — <a href="/ru/cookie-policy.html">Политика cookies</a>.</div><div class="cookie-actions"><button id="accept-cookies" class="btn btn-primary" type="button">Принять</button><button id="reject-cookies" class="btn btn-secondary" type="button">Отклонить</button></div></div>';
    document.body.appendChild(banner);
    return banner;
  }
  function init() {
    var banner = buildBanner();
    var consent = localStorage.getItem('cookie_consent');
    if (consent === 'accepted') loadGA();
    else if (!consent) banner.style.display = 'block';
    var a = document.getElementById('accept-cookies'), r = document.getElementById('reject-cookies');
    if (a) a.addEventListener('click', function(){ localStorage.setItem('cookie_consent','accepted'); loadGA(); banner.style.display='none'; });
    if (r) r.addEventListener('click', function(){ localStorage.setItem('cookie_consent','rejected'); banner.style.display='none'; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
