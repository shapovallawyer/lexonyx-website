// LEXONYX analytics runtime — consent-aware GA4 + conversion events
(function () {
  'use strict';

  const CONSENT_KEY = 'lexonyx_analytics_consent_v1';
  const LAST_FORM_KEY = 'lexonyx_last_form_v1';
  const meta = document.querySelector('meta[name="lexonyx-ga4-id"]');
  const measurementId = (meta && meta.getAttribute('content') || '').trim();
  const enabled = /^G-[A-Z0-9]+$/i.test(measurementId);
  const path = window.location.pathname || '/';
  const lang = path.startsWith('/ru/') ? 'ru' : path.startsWith('/uk/') ? 'uk' : 'en';

  const copy = {
    en: {
      title: 'Analytics cookies',
      body: 'With your consent, LEXONYX uses Google Analytics to understand which pages and entry points are useful. Analytics is disabled until you accept.',
      accept: 'Allow analytics',
      decline: 'Necessary only',
      settings: 'Cookie Policy'
    },
    ru: {
      title: 'Аналитические cookies',
      body: 'С вашего согласия LEXONYX использует Google Analytics, чтобы понимать, какие страницы и точки входа полезны. Аналитика отключена до вашего согласия.',
      accept: 'Разрешить аналитику',
      decline: 'Только необходимые',
      settings: 'Cookie Policy'
    },
    uk: {
      title: 'Аналітичні cookies',
      body: 'За вашою згодою LEXONYX використовує Google Analytics, щоб розуміти, які сторінки та точки входу корисні. Аналітика вимкнена до вашої згоди.',
      accept: 'Дозволити аналітику',
      decline: 'Лише необхідні',
      settings: 'Cookie Policy'
    }
  }[lang];

  const cookiePolicy = lang === 'ru' ? '/ru/cookie-policy.html' : lang === 'uk' ? '/uk/cookie-policy.html' : '/en/cookie-policy.html';
  let gaLoaded = false;
  let banner = null;

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY) || ''; } catch (_) { return ''; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (_) {}
  }

  function gtag() {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
  }

  function loadGA() {
    if (!enabled || gaLoaded || getConsent() !== 'granted') return;
    gaLoaded = true;
    window.dataLayer = window.dataLayer || [];
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
    document.head.appendChild(script);
    gtag('js', new Date());
    gtag('config', measurementId, {
      send_page_view: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  function safeText(value, limit) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit || 120);
  }

  function track(eventName, params) {
    if (!enabled || getConsent() !== 'granted') return;
    loadGA();
    const clean = Object.assign({
      page_path: path,
      page_language: lang
    }, params || {});
    // Never include user-entered form values, names, email addresses or message text.
    gtag('event', eventName, clean);
  }

  window.lexonyxTrack = track;

  function hideBanner() {
    if (banner) banner.hidden = true;
  }

  function showBanner(force) {
    if (!enabled) return;
    if (!force && getConsent()) return;
    if (!banner) createBanner();
    banner.hidden = false;
  }

  function createBanner() {
    const style = document.createElement('style');
    style.textContent = `
      .lx-consent{position:fixed;left:18px;right:18px;bottom:18px;z-index:99999;max-width:760px;margin:0 auto;background:#0f1822;color:#fff;border:1px solid rgba(255,255,255,.16);box-shadow:0 18px 50px rgba(0,0,0,.28);padding:20px 22px;border-radius:14px;font-family:Inter,Arial,sans-serif}
      .lx-consent[hidden]{display:none!important}.lx-consent__title{font-size:16px;font-weight:600;margin:0 0 7px}.lx-consent__body{font-size:13px;line-height:1.55;color:rgba(255,255,255,.82);margin:0 0 14px}.lx-consent__actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.lx-consent button{border-radius:999px;padding:10px 15px;font:600 13px/1 Inter,Arial,sans-serif;cursor:pointer}.lx-consent__accept{background:#fff;color:#0a1118;border:1px solid #fff}.lx-consent__decline{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.35)}.lx-consent a{color:#fff;text-decoration:underline;text-underline-offset:3px;font-size:13px}@media(max-width:600px){.lx-consent{left:10px;right:10px;bottom:10px;padding:17px}.lx-consent__actions{align-items:stretch}.lx-consent button{flex:1 1 100%}}
    `;
    document.head.appendChild(style);

    banner = document.createElement('div');
    banner.className = 'lx-consent';
    banner.id = 'lx-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', copy.title);
    banner.innerHTML = '<p class="lx-consent__title"></p><p class="lx-consent__body"></p><div class="lx-consent__actions"><button type="button" class="lx-consent__accept"></button><button type="button" class="lx-consent__decline"></button><a class="lx-consent__policy"></a></div>';
    banner.querySelector('.lx-consent__title').textContent = copy.title;
    banner.querySelector('.lx-consent__body').textContent = copy.body;
    banner.querySelector('.lx-consent__accept').textContent = copy.accept;
    banner.querySelector('.lx-consent__decline').textContent = copy.decline;
    const policy = banner.querySelector('.lx-consent__policy');
    policy.textContent = copy.settings;
    policy.href = cookiePolicy;

    banner.querySelector('.lx-consent__accept').addEventListener('click', function () {
      setConsent('granted');
      hideBanner();
      loadGA();
      track('analytics_consent_granted');
    });
    banner.querySelector('.lx-consent__decline').addEventListener('click', function () {
      setConsent('denied');
      hideBanner();
    });
    document.body.appendChild(banner);
  }

  function formName(form) {
    return safeText(form.getAttribute('name') || form.querySelector('input[name="form-name"]')?.value || 'form', 40);
  }

  function setupEvents() {
    document.addEventListener('click', function (event) {
      const link = event.target.closest && event.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (link.matches('[data-cookie-settings]')) {
        event.preventDefault();
        showBanner(true);
        return;
      }
      if (link.classList.contains('lang-option')) {
        track('language_switch', { target_language: safeText(link.getAttribute('lang'), 8) });
      }
      if (/request-review|zaprosit-razbor|zapytaty-rozbir/i.test(href) || link.classList.contains('header-cta')) {
        track('cta_request_review_click', {
          link_url: safeText(href, 180),
          link_text: safeText(link.textContent, 80)
        });
      }
    });

    document.querySelectorAll('form').forEach(function (form) {
      let started = false;
      form.addEventListener('focusin', function () {
        if (started) return;
        started = true;
        track('form_start', { form_name: formName(form) });
      });
      form.addEventListener('submit', function () {
        const name = formName(form);
        try { sessionStorage.setItem(LAST_FORM_KEY, name); } catch (_) {}
        track('form_submit_intent', { form_name: name });
      });
    });

    let lastForm = '';
    try { lastForm = sessionStorage.getItem(LAST_FORM_KEY) || ''; } catch (_) {}
    const isThankYou = /thank-you|thankyou|spasibo|dyakuyemo/i.test(path);
    if (isThankYou && lastForm) {
      if (lastForm === 'newsletter') track('sign_up', { method: 'newsletter' });
      else if (lastForm === 'intake' || lastForm === 'contact') track('generate_lead', { form_name: lastForm });
      try { sessionStorage.removeItem(LAST_FORM_KEY); } catch (_) {}
    }
  }

  function init() {
    setupEvents();
    if (!enabled) return;
    if (getConsent() === 'granted') loadGA();
    else if (!getConsent()) showBanner(false);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
