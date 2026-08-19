import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const map = JSON.parse(fs.readFileSync(path.join(ROOT, '_url-map-i18n.json'), 'utf8'));

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function inverse(obj) {
  const out = new Map();
  for (const [ru, target] of Object.entries(obj || {})) out.set(target, ru);
  return out;
}
const invEn = inverse(map.en);
const invUk = inverse(map.uk);

function ruKeyFor(rel) {
  if (rel.startsWith('ru/')) return rel;
  if (rel.startsWith('en/')) return invEn.get(rel) || (rel === 'en/expertise/external-legal-function.html' ? 'ru/formaty-raboty/vneshnyaya-yuridicheskaya-funkciya.html' : null);
  if (rel.startsWith('uk/')) return invUk.get(rel) || null;
  return null;
}

function langLinks(rel) {
  const ru = ruKeyFor(rel);
  if (!ru) return null;
  const en = map.en?.[ru];
  const uk = map.uk?.[ru];
  if (!en || !uk) return null;
  return { ru: '/' + ru, en: '/' + en, uk: '/' + uk };
}

function normalizeLangOptions(html, links) {
  if (!links) return html;
  return html.replace(/<a\b[^>]*class=["'][^"']*lang-option[^"']*["'][^>]*>/gi, tag => {
    const m = tag.match(/lang=["'](ru|en|uk)["']/i);
    if (!m) return tag;
    const href = links[m[1].toLowerCase()];
    if (!href) return tag;
    return /href=/i.test(tag)
      ? tag.replace(/href=["'][^"']*["']/i, `href="${href}"`)
      : tag.replace(/>$/, ` href="${href}">`);
  });
}

function extractHeader(html) {
  const start = html.search(/<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>/i);
  const main = html.search(/<main\b/i);
  if (start < 0 || main < 0 || main <= start) return null;
  return html.slice(start, main);
}

function replaceHeader(html, header) {
  const start = html.search(/<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>/i);
  const main = html.search(/<main\b/i);
  if (!header || start < 0 || main < 0 || main <= start) return html;
  return html.slice(0, start) + header + html.slice(main);
}

function addOnceAfter(html, needle, insertion) {
  if (html.includes(needle + insertion)) return html;
  return html.includes(needle) ? html.replace(needle, needle + insertion) : html;
}
function addOnceBefore(html, needle, insertion) {
  if (html.includes(insertion + needle)) return html;
  return html.includes(needle) ? html.replace(needle, insertion + needle) : html;
}

const enHomePath = path.join(ROOT, 'en/index.html');
let enHome = fs.readFileSync(enHomePath, 'utf8');

// EN Expertise parity: the page existed, but Private Capital / Family Office was not exposed in desktop/mobile navigation.
enHome = addOnceAfter(
  enHome,
  '<a href="/en/expertise/source-of-funds.html">Source of Funds / Source of Wealth</a>',
  '\n                  <a href="/en/expertise/private-capital-and-family-office.html">Private Capital &amp; Family Office</a>'
);
enHome = addOnceAfter(
  enHome,
  '<a href="/en/expertise/source-of-funds.html" class="mobile-sub-link">Source of Funds / Source of Wealth</a>',
  '\n          <a href="/en/expertise/private-capital-and-family-office.html" class="mobile-sub-link">Private Capital &amp; Family Office</a>'
);

// EN Work Formats parity: match RU/UK by exposing How to Start and External Legal Function.
enHome = addOnceBefore(
  enHome,
  '<a href="/en/work-formats/strategic-structural-audit.html">Strategic Structure Audit</a>',
  '<a href="/en/how-to-start.html">How to Start</a>\n                  '
);
enHome = addOnceAfter(
  enHome,
  '<a href="/en/work-formats/ongoing-advisory.html">Ongoing Advisory</a>',
  '\n                  <a href="/en/work-formats/external-legal-function.html">External International Legal Function</a>'
);
enHome = addOnceBefore(
  enHome,
  '<a href="/en/work-formats/strategic-structural-audit.html" class="mobile-sub-link">Strategic Structure',
  '<a href="/en/how-to-start.html" class="mobile-sub-link">How to Start</a>\n          '
);
enHome = addOnceAfter(
  enHome,
  '<a href="/en/work-formats/ongoing-advisory.html" class="mobile-sub-link">Ongoing Advisory</a>',
  '\n          <a href="/en/work-formats/external-legal-function.html" class="mobile-sub-link">External International Legal Function</a>'
);
fs.writeFileSync(enHomePath, enHome, 'utf8');

// UK desktop already exposed How to Start, but the mobile Work Formats accordion did not.
const ukHomePath = path.join(ROOT, 'uk/index.html');
let ukHome = fs.readFileSync(ukHomePath, 'utf8');
ukHome = addOnceBefore(
  ukHome,
  '<a href="/uk/formaty-roboty/strategichnyy-strukturnyy-audyt.html" class="mobile-sub-link">',
  '<a href="/uk/yak-pochaty.html" class="mobile-sub-link">Як почати</a>\n          '
);
fs.writeFileSync(ukHomePath, ukHome, 'utf8');

// Propagate each language's canonical header to every page that has a full site header,
// then restore page-specific language-switch targets from the canonical i18n map.
const homes = {
  ru: fs.readFileSync(path.join(ROOT, 'ru/index.html'), 'utf8'),
  en: enHome,
  uk: ukHome
};
const headers = Object.fromEntries(Object.entries(homes).map(([lang, html]) => [lang, extractHeader(html)]));

let changed = 0;
for (const lang of ['ru', 'en', 'uk']) {
  for (const file of walkHtml(path.join(ROOT, lang))) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const before = fs.readFileSync(file, 'utf8');
    if (!extractHeader(before)) continue;
    let after = replaceHeader(before, headers[lang]);
    after = normalizeLangOptions(after, langLinks(rel));
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changed++;
    }
  }
}

console.log(`[LEXONYX i18n page parity fix] headers normalized=${changed}`);
