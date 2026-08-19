import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const privacyFixes = {
  en: '<p>You also have the right to lodge a complaint with a data-protection supervisory authority. For this practice, the competent non-public-sector supervisory authority in Bavaria is the <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong>, Promenade 18, 91522 Ansbach, Germany.</p>',
  ru: '<p>Вы также вправе подать жалобу в надзорный орган по защите данных. Для данной практики компетентным органом по негосударственному сектору в Баварии является <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong>, Promenade 18, 91522 Ansbach, Germany.</p>',
  uk: '<p>Ви також маєте право подати скаргу до наглядового органу із захисту даних. Для цієї практики компетентним органом для недержавного сектору в Баварії є <strong>Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)</strong>, Promenade 18, 91522 Ansbach, Germany.</p>'
};

for (const lang of ['en', 'ru', 'uk']) {
  const p = path.join(ROOT, lang, 'privacy-policy.html');
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/<p>[^<]*(?:You also have the right|Вы также вправе|Ви також маєте право)[\s\S]*?(?:edpb\.europa\.eu|<\/p>)/i, privacyFixes[lang]);
  fs.writeFileSync(p, html, 'utf8');
}

const intake = {
  en: ['en/request-review.html', '1) Preliminary Issue Map', 'A high-level map of factual and structural issues that may require deeper analysis or specialist confirmation — without substantive tax, legal or regulatory conclusions at the qualification stage and without promises of a specific outcome.'],
  ru: ['ru/zaprosit-razbor.html', '1) Предварительная карта вопросов', 'High-level карта фактических и структурных вопросов, которые могут требовать углублённого анализа или specialist confirmation — без самостоятельных налоговых, юридических или регуляторных выводов на стадии первичной квалификации и без обещаний результата.'],
  uk: ['uk/zapytaty-rozbir.html', '1) Попередня карта питань', 'High-level карта фактичних і структурних питань, які можуть потребувати поглибленого аналізу або specialist confirmation — без самостійних податкових, юридичних чи регуляторних висновків на стадії первинної кваліфікації та без обіцянок результату.']
};

for (const lang of ['en', 'ru', 'uk']) {
  const [rel, title, body] = intake[lang];
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) continue;
  let html = fs.readFileSync(p, 'utf8');
  html = html.replace(/<h3>1\)[\s\S]*?<\/h3>\s*<p>[\s\S]*?<\/p>/i, `<h3>${title}</h3>\n<p>${body}</p>`);
  fs.writeFileSync(p, html, 'utf8');
}

console.log('[LEXONYX final fixes] privacy authority and intake qualification wording normalised');
