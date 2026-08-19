import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const map = JSON.parse(fs.readFileSync(path.join(ROOT, '_url-map-i18n.json'), 'utf8'));
const invEn = new Map(Object.entries(map.en || {}).map(([ru, en]) => [en, ru]));
const invUk = new Map(Object.entries(map.uk || {}).map(([ru, uk]) => [uk, ru]));

const cfg = {
  en: {
    home: 'en/index.html',
    jurDir: 'en/jurisdictions/',
    commonScripts: ['/en/scripts/search-index-en.js','/en/scripts/site.js','/ru/scripts/lx-reveal.js','/ru/scripts/lx-consent.js','/ru/scripts/lx-to-top.js','/scripts/ui-runtime.js']
  },
  ru: {
    home: 'ru/index.html',
    jurDir: 'ru/yurisdikcii/',
    commonScripts: ['/ru/scripts/search-index-ru.js','/ru/scripts/site.js','/ru/scripts/lx-reveal.js','/ru/scripts/lx-consent.js','/ru/scripts/lx-to-top.js','/scripts/ui-runtime.js']
  },
  uk: {
    home: 'uk/index.html',
    jurDir: 'uk/yurysdyktsiyi/',
    commonScripts: ['/uk/scripts/search-index-uk.js','/uk/scripts/site.js','/ru/scripts/lx-reveal.js','/ru/scripts/lx-consent.js','/ru/scripts/lx-to-top.js','/scripts/ui-runtime.js']
  }
};

const legalNames = new Set(['privacy-policy.html','cookie-policy.html','terms-of-use.html','impressum.html','accessibility.html']);

function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); }
function write(rel, content) { fs.writeFileSync(path.join(ROOT, rel), content, 'utf8'); }

function expectedLangLinks(rel) {
  let ruKey = null;
  if (rel.startsWith('ru/')) ruKey = rel;
  else if (rel.startsWith('en/')) ruKey = invEn.get(rel) || null;
  else if (rel.startsWith('uk/')) ruKey = invUk.get(rel) || null;
  if (!ruKey) return null;
  const en = map.en?.[ruKey];
  const uk = map.uk?.[ruKey];
  if (!en || !uk) return null;
  return { ru: '/' + ruKey, en: '/' + en, uk: '/' + uk };
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

function extractHeaderZone(html, rel) {
  const headerStart = html.search(/<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>/i);
  const mainStart = html.search(/<main\b/i);
  if (headerStart < 0 || mainStart < 0 || mainStart <= headerStart) throw new Error(`Cannot extract header zone from ${rel}`);
  return html.slice(headerStart, mainStart);
}

function extractFooter(html, rel) {
  const footerStart = html.search(/<footer\b[^>]*class=["'][^"']*site-footer[^"']*["'][^>]*>/i);
  if (footerStart < 0) throw new Error(`Cannot extract footer from ${rel}`);
  const close = html.indexOf('</footer>', footerStart);
  if (close < 0) throw new Error(`Cannot find footer close in ${rel}`);
  return html.slice(footerStart, close + '</footer>'.length);
}

function replaceHeaderZone(html, zone, rel) {
  const headerStart = html.search(/<header\b[^>]*class=["'][^"']*site-header[^"']*["'][^>]*>/i);
  const mainStart = html.search(/<main\b/i);
  if (headerStart < 0 || mainStart < 0 || mainStart <= headerStart) throw new Error(`Cannot replace header zone in ${rel}`);
  return html.slice(0, headerStart) + zone + html.slice(mainStart);
}

function replaceFooter(html, footer, rel) {
  const footerStart = html.search(/<footer\b[^>]*class=["'][^"']*site-footer[^"']*["'][^>]*>/i);
  if (footerStart < 0) throw new Error(`Cannot replace footer in ${rel}`);
  const close = html.indexOf('</footer>', footerStart);
  if (close < 0) throw new Error(`Cannot find footer close in ${rel}`);
  return html.slice(0, footerStart) + footer + html.slice(close + '</footer>'.length);
}

function ensureScript(html, src) {
  const escaped = src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp(`<script\\b[^>]*src=["']${escaped}["']`, 'i').test(html)) return html;
  const tag = `\n  <script defer src="${src}"></script>`;
  return html.includes('</body>') ? html.replace('</body>', tag + '\n</body>') : html + tag;
}

function isTarget(rel, lang) {
  const c = cfg[lang];
  if (rel.startsWith(c.jurDir) && rel.endsWith('.html')) return true;
  const base = rel.split('/').pop();
  if (rel.startsWith(lang + '/') && !rel.slice(lang.length + 1).includes('/') && legalNames.has(base)) return true;
  return false;
}

let changed = 0;
let targets = 0;
for (const [lang, c] of Object.entries(cfg)) {
  let home = read(c.home);
  // Directly harden the English homepage switch before it becomes the template.
  if (lang === 'en') {
    home = home.replace(/href=["']\/index\.html["'](?=[^>]*class=["'][^"']*lang-option[^"']*["'][^>]*lang=["']ru["'])/gi, 'href="/ru/index.html"');
    home = home.replace(/"knowsLanguage"\s*:\s*\[\s*"ru"\s*,\s*"en"\s*\]/g, '"knowsLanguage":["ru","en","uk"]');
    home = home.replace(/\s*,?\s*"potentialAction"\s*:\s*\{[\s\S]*?"query-input"\s*:\s*"required name=search_term_string"\s*\}/i, '');
    write(c.home, home);
  }

  const canonicalHeader = extractHeaderZone(home, c.home);
  const canonicalFooter = extractFooter(home, c.home);

  const baseDir = path.join(ROOT, lang);
  const stack = [baseDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) { stack.push(p); continue; }
      if (!ent.isFile() || !ent.name.endsWith('.html')) continue;
      const rel = path.relative(ROOT, p).split(path.sep).join('/');
      if (!isTarget(rel, lang)) continue;
      targets++;
      const original = fs.readFileSync(p, 'utf8');
      let html = replaceHeaderZone(original, canonicalHeader, rel);
      html = replaceFooter(html, canonicalFooter, rel);
      html = normalizeLangOptions(html, expectedLangLinks(rel));
      for (const src of c.commonScripts) html = ensureScript(html, src);
      if (html !== original) { fs.writeFileSync(p, html, 'utf8'); changed++; }
    }
  }
}

// Add the runtime language-link guard to every active language page, not only the normalised cluster.
for (const lang of Object.keys(cfg)) {
  const baseDir = path.join(ROOT, lang);
  const stack = [baseDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) { stack.push(p); continue; }
      if (!ent.isFile() || !ent.name.endsWith('.html')) continue;
      const original = fs.readFileSync(p, 'utf8');
      const html = ensureScript(original, '/scripts/ui-runtime.js');
      if (html !== original) { fs.writeFileSync(p, html, 'utf8'); changed++; }
    }
  }
}

console.log(`[LEXONYX layout normalizer] targets=${targets}, changed=${changed}`);
