/* ============================================================
   LEXONYX — Scroll Reveal (canon v1)
   Progressive enhancement. Safe by design:
   - Adds .lx-reveal-ready to <html> ONLY when motion is allowed
     and IntersectionObserver exists. If anything is missing,
     content stays fully visible (CSS default).
   - Respects prefers-reduced-motion.
   - Reveals once, then unobserves (no flicker on scroll up).
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;

  // Bail out safely: no IO support, or user prefers reduced motion.
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // Leave content visible (CSS default). Do nothing.
    console.info('[lx-reveal] OFF — ' + (reduceMotion
      ? 'в системе включён reduced motion (Windows: Параметры → Спец. возможности → Визуальные эффекты → Эффекты анимации)'
      : 'IntersectionObserver не поддерживается'));
    return;
  }

  // Signal to CSS that it's safe to hide-then-reveal.
  root.classList.add('lx-reveal-ready');

  function init() {
    var targets = document.querySelectorAll('[data-reveal], [data-reveal-stagger]');
    console.info('[lx-reveal] ON — целей для анимации: ' + targets.length);
    if (!targets.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12
    });

    targets.forEach(function (el) { io.observe(el); });

    // Safety net: if something never intersects (e.g. very tall
    // viewport), reveal everything still hidden after 2.5s.
    setTimeout(function () {
      targets.forEach(function (el) {
        if (!el.classList.contains('is-revealed')) {
          el.classList.add('is-revealed');
        }
      });
    }, 2500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
