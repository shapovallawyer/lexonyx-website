import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const cfg = {
  en: {
    dir: 'en', hub: '/en/jurisdictions/index.html',
    countries: [['UA','Ukraine','/en/jurisdictions/ukraine.html'],['DE','Germany','/en/jurisdictions/germany.html'],['CY','Cyprus','/en/jurisdictions/cyprus.html'],['PL','Poland','/en/jurisdictions/poland.html'],['NL','Netherlands','/en/jurisdictions/netherlands.html'],['AE','UAE','/en/jurisdictions/uae.html'],['EE','Estonia','/en/jurisdictions/estonia.html'],['IE','Ireland','/en/jurisdictions/ireland.html'],['UK','United Kingdom','/en/jurisdictions/united-kingdom.html'],['CH','Switzerland','/en/jurisdictions/switzerland.html']],
    split: 6, core: 'Core jurisdictions', extra: 'Additional jurisdictions', all: 'All jurisdictions →'
  },
  ru: {
    dir: 'ru', hub: '/ru/yurisdikcii/index.html',
    countries: [['UA','Украина','/ru/yurisdikcii/ukraina.html'],['DE','Германия','/ru/yurisdikcii/germaniya.html'],['CY','Кипр','/ru/yurisdikcii/kipr.html'],['PL','Польша','/ru/yurisdikcii/polsha.html'],['NL','Нидерланды','/ru/yurisdikcii/niderlandy.html'],['AE','ОАЭ','/ru/yurisdikcii/oae.html'],['EE','Эстония','/ru/yurisdikcii/estoniya.html'],['IE','Ирландия','/ru/yurisdikcii/irlandiya.html'],['UK','Великобритания','/ru/yurisdikcii/velikobritaniya.html'],['CH','Швейцария','/ru/yurisdikcii/shveycariya.html']],
    split: 6, core: 'Ключевые', extra: 'Дополнительные', all: 'Все юрисдикции →'
  },
  uk: {
    dir: 'uk', hub: '/uk/yurysdyktsiyi/index.html',
    countries: [['UA','Україна','/uk/yurysdyktsiyi/ukrayina.html'],['DE','Німеччина','/uk/yurysdyktsiyi/nimechchyna.html'],['CY','Кіпр','/uk/yurysdyktsiyi/kipr.html'],['PL','Польща','/uk/yurysdyktsiyi/polshcha.html'],['NL','Нідерланди','/uk/yurysdyktsiyi/niderlandy.html'],['AE','ОАЕ','/uk/yurysdyktsiyi/oae.html'],['EE','Естонія','/uk/yurysdyktsiyi/estoniya.html'],['IE','Ірландія','/uk/yurysdyktsiyi/irlandiya.html'],['UK','Велика Британія','/uk/yurysdyktsiyi/velykobrytaniya.html'],['CH','Швейцарія','/uk/yurysdyktsiyi/shveytsariya.html']],
    split: 6, core: 'Ключові юрисдикції', extra: 'Додаткові юрисдикції', all: 'Усі юрисдикції →'
  }
};

function htmlFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) htmlFiles(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function replaceDivInnerByPredicate(html, predicate, replacement) {
  let from = 0;
  while (true) {
    const openRe = /<div\b[^>]*>/gi;
    openRe.lastIndex = from;
    let open;
    while ((open = openRe.exec(html))) if (predicate(open[0])) break;
    if (!open) break;
    const start = open.index + open[0].length;
    const tokenRe = /<div\b[^>]*>|<\/div>/gi;
    tokenRe.lastIndex = start;
    let depth = 1, token, close = -1;
    while ((token = tokenRe.exec(html))) {
      if (/^<div\b/i.test(token[0])) depth++; else depth--;
      if (depth === 0) { close = token.index; break; }
    }
    if (close < 0) break;
    html = html.slice(0, start) + replacement + html.slice(close);
    from = start + replacement.length;
  }
  return html;
}

function desktop(c) {
  const group = (items, title) => `<div class="dropdown-section"><h4>${title}</h4>${items.map(([code,name,url]) => `<a href="${url}"><span class="jur-code">${code}</span> ${name}</a>`).join('')}</div>`;
  return `<div class="dropdown-content dropdown-two-col jurisdictions-two-col">${group(c.countries.slice(0,c.split), c.core)}${group(c.countries.slice(c.split), c.extra)}<div class="dropdown-footer"><a href="${c.hub}" class="btn-dropdown-all">${c.all}</a></div></div>`;
}
function mobile(c) {
  return c.countries.map(([,name,url]) => `<a href="${url}" class="mobile-sub-link">${name}</a>`).join('') + `<a href="${c.hub}" class="mobile-sub-link mobile-sub-link-all">${c.all}</a>`;
}

const retiredHref = /href=(["'])(?:\/en\/jurisdictions\/(?:lithuania|malta|czechia)\.html|\/ru\/(?:yurisdikcii\/(?:litva|malta|chehiya)\.html|(?:lithuania|malta|czechia)\.html)|\/uk\/yurysdyktsiyi\/(?:lytva|malta|chehiya)\.html)\1/gi;

let changed = 0;
for (const [lang, c] of Object.entries(cfg)) {
  for (const file of htmlFiles(path.join(ROOT, c.dir))) {
    const original = fs.readFileSync(file, 'utf8');
    let html = original;
    html = replaceDivInnerByPredicate(html, tag => /class=["'][^"']*dropdown-menu[^"']*dropdown-jurisdictions[^"']*["']/i.test(tag), desktop(c));
    html = replaceDivInnerByPredicate(html, tag => /id=["']mobile-(?:yurisdikcii|jurisdictions)-content["']/i.test(tag), mobile(c));
    html = html.replace(retiredHref, `href="${c.hub}"`);

    if (/regulatory-licensing\.html$|regulyatornaya-arhitektura-i-licenzirovanie\.html$|regulyatorna-arhitektura-ta-litsenzuvannya\.html$/i.test(file)) {
      html = html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi, block => {
        return /"@type"\s*:\s*"FAQPage"/i.test(block) ? '' : block;
      });
      html = html.replace(/^regulyatornaya-arhitektura-i-licenzirovanie\.html\s*$/m, '');
    }
    if (html !== original) { fs.writeFileSync(file, html, 'utf8'); changed++; }
  }
}

const retiredFiles = [
  'en/jurisdictions/lithuania.html','en/jurisdictions/malta.html','en/jurisdictions/czechia.html','en/jurisdictions/eu/index.html',
  'ru/lithuania.html','ru/malta.html','ru/czechia.html','ru/yurisdikcii/litva.html','ru/yurisdikcii/malta.html','ru/yurisdikcii/chehiya.html','ru/yurisdikcii/es/index.html',
  'uk/yurysdyktsiyi/lytva.html','uk/yurysdyktsiyi/malta.html','uk/yurysdyktsiyi/chehiya.html','uk/yurysdyktsiyi/es/index.html'
];
let removed = 0;
for (const rel of retiredFiles) {
  const p = path.join(ROOT, rel);
  if (fs.existsSync(p)) { fs.rmSync(p, { force: true }); removed++; }
}

console.log(`[LEXONYX final content sanitizer] changed=${changed}, retired files removed from publish=${removed}`);
