import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ga4 = String(process.env.GA4_MEASUREMENT_ID || '').trim();
const validGa4 = /^G-[A-Z0-9]+$/i.test(ga4);

function walkHtml(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function setNoindex(html) {
  if (/<meta\b[^>]*name=["']robots["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\b[^>]*name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex,follow" />');
  }
  return html.replace(/<\/head>/i, '  <meta name="robots" content="noindex,follow" />\n</head>');
}

function injectAnalytics(html) {
  html = html.replace(/\s*<meta\s+name=["']lexonyx-ga4-id["'][^>]*>\s*/gi, '\n');
  html = html.replace(/\s*<script\b[^>]*src=["']\/scripts\/analytics-runtime\.js["'][^>]*><\/script>\s*/gi, '\n');
  if (validGa4) {
    html = html.replace(/<\/head>/i, `  <meta name="lexonyx-ga4-id" content="${ga4}" />\n</head>`);
  }
  return html.replace(/<\/body>/i, '  <script defer src="/scripts/analytics-runtime.js"></script>\n</body>');
}

function normalizeContact(rel, html) {
  if (rel === 'en/contact.html') {
    html = html.replace(/(<form\b[^>]*\bname=["']contact["'][^>]*\baction=)["'][^"']*["']/i, '$1"/en/intake/thank-you.html"');
    html = html.replace(/"inLanguage"\s*:\s*"ru"/g, '"inLanguage":"en"');
  }
  if (rel === 'uk/kontakty.html') {
    html = html.replace(/(<form\b[^>]*\bname=["']contact["'][^>]*\baction=)["'][^"']*["']/i, '$1"/uk/intake/dyakuyemo.html"');
    html = html.replace(/"inLanguage"\s*:\s*"ru"/g, '"inLanguage":"uk"');
  }
  if (rel === 'ru/kontakty.html') {
    html = html.replace(/(<form\b[^>]*\bname=["']contact["'][^>]*\baction=)["'][^"']*["']/i, '$1"/ru/spasibo.html"');
  }
  return html;
}

let changed = 0;
let utilityNoindex = 0;
for (const lang of ['ru', 'en', 'uk']) {
  for (const file of walkHtml(path.join(ROOT, lang))) {
    const rel = path.relative(ROOT, file).split(path.sep).join('/');
    const before = fs.readFileSync(file, 'utf8');
    let after = normalizeContact(rel, before);
    if (/(?:thank[-_]?you|thankyou|spasibo|dyakuyemo)/i.test(rel)) {
      const next = setNoindex(after);
      if (next !== after) utilityNoindex++;
      after = next;
    }
    after = injectAnalytics(after);
    if (after !== before) {
      fs.writeFileSync(file, after, 'utf8');
      changed++;
    }
  }
}

console.log(`[LEXONYX analytics] html instrumented=${changed}; utility noindex=${utilityNoindex}; GA4=${validGa4 ? ga4 : 'disabled (GA4_MEASUREMENT_ID not configured)'}`);
