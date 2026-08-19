import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LANGUAGE_ROOTS = ['en', 'ru', 'uk'];

const cfg = {
  en: {
    jurisdictionHeading: 'Jurisdictions',
    desktop: `
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
                </div>
              `,
    mobile: `
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
          <a href="/en/jurisdictions/index.html" class="mobile-sub-link mobile-sub-link-all">All jurisdictions →</a>
        `,
    footerLinks: `
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
            <li><a href="/en/jurisdictions/switzerland.html">Switzerland</a></li>
          `,
    perimeterTitle: 'Professional perimeter.',
    perimeter: 'LEXONYX performs structural and factual cross-border analysis. Ukrainian-law advice is provided directly within the professional scope of Advokat (Ukraine). Jurisdiction-specific legal, tax and regulatory conclusions in other jurisdictions are provided or confirmed by appropriately qualified professionals.',
    legal: ['/en/impressum.html', 'Legal Notice'], privacy: ['/en/privacy-policy.html', 'Privacy Policy'], terms: ['/en/terms-of-use.html', 'Terms of Use'],
    cyprusTax: 'Cyprus corporate taxation is treated as one interface of the structure, not as its Business Purpose. The applicable tax treatment must be verified for the specific income, functions, residence, substance, treaty position and anti-abuse rules current at the time of the Matter.',
    estoniaTax: 'Estonia uses a distribution-based corporate taxation model. The applicable treatment must be verified for the specific distribution, management, residence, PE, shareholder taxation and operating facts current at the time of the Matter.'
  },
  ru: {
    jurisdictionHeading: 'Юрисдикции',
    desktop: `
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
                </div>
              `,
    mobile: `
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
          <a href="/ru/yurisdikcii/index.html" class="mobile-sub-link mobile-sub-link-all">Все юрисдикции →</a>
        `,
    footerLinks: `
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
            <li><a href="/ru/yurisdikcii/shveycariya.html">Швейцария</a></li>
          `,
    perimeterTitle: 'Профессиональный периметр.',
    perimeter: 'LEXONYX проводит структурный и фактический анализ трансграничных вопросов. Консультации по украинскому праву предоставляются непосредственно в пределах профессиональных полномочий адвоката Украины. Юрисдикционно-специфические юридические, налоговые и регуляторные выводы по другим юрисдикциям предоставляются или подтверждаются надлежащим образом квалифицированными специалистами.',
    legal: ['/ru/impressum.html', 'Правовая информация'], privacy: ['/ru/privacy-policy.html', 'Политика конфиденциальности'], terms: ['/ru/terms-of-use.html', 'Условия использования'],
    cyprusTax: 'Налогообложение на Кипре рассматривается как один из интерфейсов структуры, а не как её Business Purpose. Применимый налоговый режим необходимо проверять для конкретного дохода, функций, резидентства, substance, treaty-позиции и anti-abuse правил, действующих на момент проекта.',
    estoniaTax: 'В Эстонии действует модель корпоративного налогообложения, связанная с распределением прибыли. Применимый режим необходимо проверять с учётом конкретного распределения, управления, резидентства, PE, налогообложения собственника и фактической операционной модели на момент проекта.'
  },
  uk: {
    jurisdictionHeading: 'Юрисдикції',
    desktop: `
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
                </div>
              `,
    mobile: `
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
          <a href="/uk/yurysdyktsiyi/index.html" class="mobile-sub-link mobile-sub-link-all">Усі юрисдикції →</a>
        `,
    footerLinks: `
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
            <li><a href="/uk/yurysdyktsiyi/shveytsariya.html">Швейцарія</a></li>
          `,
    perimeterTitle: 'Професійний периметр.',
    perimeter: 'LEXONYX проводить структурний та фактичний аналіз транскордонних питань. Консультації з українського права надаються безпосередньо в межах професійних повноважень адвоката України. Юрисдикційно-специфічні юридичні, податкові та регуляторні висновки щодо інших юрисдикцій надаються або підтверджуються належно кваліфікованими фахівцями.',
    legal: ['/uk/impressum.html', 'Правова інформація'], privacy: ['/uk/privacy-policy.html', 'Політика конфіденційності'], terms: ['/uk/terms-of-use.html', 'Умови використання'],
    cyprusTax: 'Оподаткування на Кіпрі розглядається як один з інтерфейсів структури, а не як її Business Purpose. Застосовний податковий режим потрібно перевіряти для конкретного доходу, функцій, резидентства, substance, treaty-позиції та anti-abuse правил, чинних на момент проєкту.',
    estoniaTax: 'В Естонії діє модель корпоративного оподаткування, пов’язана з розподілом прибутку. Застосовний режим потрібно перевіряти з урахуванням конкретного розподілу, управління, резидентства, PE, оподаткування власника та фактичної операційної моделі на момент проєкту.'
  }
};

function htmlFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function replaceDivInnerByPredicate(html, predicate, newInner) {
  const divRe = /<\/?div\b[^>]*>/gi;
  const tokens = [];
  let m;
  while ((m = divRe.exec(html))) tokens.push({ text: m[0], start: m.index, end: divRe.lastIndex, closing: /^<\//.test(m[0]) });
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.closing || !predicate(t.text)) continue;
    let depth = 1;
    for (let j = i + 1; j < tokens.length; j++) {
      depth += tokens[j].closing ? -1 : 1;
      if (depth === 0) {
        return html.slice(0, t.end) + newInner + html.slice(tokens[j].start);
      }
    }
  }
  return html;
}

function replaceFooterJurisdictionList(html, c) {
  const blockRe = /<div\b[^>]*class="[^"]*footer-col[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
  return html.replace(blockRe, block => {
    const heading = block.match(/<h3\b[^>]*class="[^"]*footer-heading[^"]*"[^>]*>([\s\S]*?)<\/h3>/i);
    if (!heading || heading[1].replace(/<[^>]+>/g, '').trim() !== c.jurisdictionHeading) return block;
    return block.replace(/<ul\b[^>]*class="[^"]*footer-links[^"]*"[^>]*>[\s\S]*?<\/ul>/i, `<ul class="footer-links">${c.footerLinks}</ul>`);
  });
}

function normalizeJsonLd(html) {
  return html.replace(/<script\b([^>]*type="application\/ld\+json"[^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    try {
      const data = JSON.parse(body);
      let changed = false;
      if (Array.isArray(data.knowsLanguage)) {
        const next = ['ru', 'en', 'uk'];
        if (JSON.stringify(data.knowsLanguage) !== JSON.stringify(next)) {
          data.knowsLanguage = next;
          changed = true;
        }
      }
      if (data.potentialAction && data.potentialAction['@type'] === 'SearchAction') {
        const target = String(data.potentialAction.target || '');
        if (target.includes('/ru/search.html')) {
          delete data.potentialAction;
          changed = true;
        }
      }
      return changed ? `<script${attrs}>${JSON.stringify(data)}</script>` : full;
    } catch {
      return full;
    }
  });
}

function normalizeXDefault(html) {
  const en = html.match(/<link\b[^>]*rel="alternate"[^>]*hreflang="en"[^>]*href="([^"]+)"[^>]*>/i) ||
             html.match(/<link\b[^>]*href="([^"]+)"[^>]*hreflang="en"[^>]*rel="alternate"[^>]*>/i);
  if (!en) return html;
  const href = en[1];
  return html.replace(/<link\b([^>]*hreflang="x-default"[^>]*)>/i, tag => tag.replace(/href="[^"]*"/i, `href="${href}"`));
}

function addStaticPerimeter(html, relPath, lang, c) {
  const isCountry =
    /^en\/jurisdictions\/[^/]+\.html$/.test(relPath) ||
    /^ru\/yurisdikcii\/[^/]+\.html$/.test(relPath) ||
    /^uk\/yurysdyktsiyi\/[^/]+\.html$/.test(relPath);
  if (!isCountry || relPath.endsWith('/index.html') || html.includes('lx-compliance-perimeter')) return html;

  const block = `\n    <section class="section section-light lx-compliance-perimeter" aria-label="${c.perimeterTitle.replace(/\.$/, '')}">\n      <div class="container container-narrow">\n        <div class="callout callout-muted"><strong>${c.perimeterTitle} </strong>${c.perimeter}</div>\n        <p class="section-note"><a href="${c.legal[0]}">${c.legal[1]}</a> · <a href="${c.privacy[0]}">${c.privacy[1]}</a> · <a href="${c.terms[0]}">${c.terms[1]}</a></p>\n      </div>\n    </section>\n`;
  return html.replace(/\s*<\/main>/i, `${block}  </main>`);
}

function patchCountryDynamicRates(html, relPath, c) {
  const isCyprus = /\/(cyprus|kipr)\.html$/.test('/' + relPath);
  const isEstonia = /\/(estonia|estoniya)\.html$/.test('/' + relPath);
  if (!isCyprus && !isEstonia) return html;
  return html.replace(/<p(\b[^>]*)>([\s\S]*?)<\/p>/gi, (full, attrs, body) => {
    const plain = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (isCyprus && /\b15\s*%/.test(plain)) return `<p${attrs}>${c.cyprusTax}</p>`;
    if (isEstonia && /22\s*\/\s*78/.test(plain)) return `<p${attrs}>${c.estoniaTax}</p>`;
    return full;
  });
}

function cleanOne(file) {
  const relPath = path.relative(ROOT, file).split(path.sep).join('/');
  const lang = relPath.split('/')[0];
  const c = cfg[lang];
  if (!c) return { changed: false, relPath };

  const original = fs.readFileSync(file, 'utf8');
  let html = original;

  html = replaceDivInnerByPredicate(html, tag => /class="[^"]*jurisdictions-two-col[^"]*"/i.test(tag), c.desktop);
  html = replaceDivInnerByPredicate(html, tag => /id="mobile-yurisdikcii-content"/i.test(tag), c.mobile);
  html = replaceFooterJurisdictionList(html, c);
  html = normalizeXDefault(html);
  html = normalizeJsonLd(html);
  html = html.replace(/href="\/index\.html"([^>]*class="[^"]*lang-option[^"]*"[^>]*lang="ru")/gi, `href="/ru/index.html"$1`);
  html = addStaticPerimeter(html, relPath, lang, c);
  html = patchCountryDynamicRates(html, relPath, c);

  if (html !== original) fs.writeFileSync(file, html, 'utf8');
  return { changed: html !== original, relPath, html };
}

const stats = { scanned: 0, changed: 0, residualRetiredLinks: [] };
for (const root of LANGUAGE_ROOTS) {
  for (const file of htmlFiles(path.join(ROOT, root))) {
    stats.scanned++;
    const res = cleanOne(file);
    if (res.changed) stats.changed++;
    const content = res.html || fs.readFileSync(file, 'utf8');
    const residual = content.match(/href="\/(?:en\/jurisdictions\/(?:lithuania|malta|czechia)|ru\/(?:yurisdikcii\/(?:litva|malta|chehiya)|(?:lithuania|malta|czechia))|uk\/yurysdyktsiyi\/(?:lytva|malta|chehiya))\.html"/gi);
    if (residual) stats.residualRetiredLinks.push({ file: res.relPath, count: residual.length });
  }
}

console.log(`[LEXONYX static cleanup] scanned=${stats.scanned} changed=${stats.changed}`);
if (stats.residualRetiredLinks.length) {
  console.log('[LEXONYX static cleanup] residual retired-jurisdiction links outside normalised navigation:');
  for (const item of stats.residualRetiredLinks.slice(0, 50)) console.log(` - ${item.file}: ${item.count}`);
} else {
  console.log('[LEXONYX static cleanup] no retired-jurisdiction links remain in deployed HTML.');
}
