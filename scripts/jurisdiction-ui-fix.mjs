import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const roots = ['en/jurisdictions', 'ru/yurisdikcii', 'uk/yurysdyktsiyi'];
const style = `<style id="lexonyx-jurisdiction-light-card-fix">
.section-light .jur-relevance-card {
  background: #ffffff;
  border-color: rgba(26,26,26,.08);
  border-left-color: rgba(184,149,106,.55);
}
.section-light .jur-relevance-card h4 {
  color: #1a1a1a;
}
.section-light .jur-relevance-card p {
  color: rgba(26,26,26,.72);
}
.section-light .jur-relevance-card:hover h4 {
  color: #1a1a1a;
}
</style>`;

let changed = 0;
for (const root of roots) {
  const dir = path.join(ROOT, root);
  if (!fs.existsSync(dir)) continue;
  for (const name of fs.readdirSync(dir)) {
    if (!name.endsWith('.html') || name === 'index.html') continue;
    const file = path.join(dir, name);
    let html = fs.readFileSync(file, 'utf8');
    if (html.includes('lexonyx-jurisdiction-light-card-fix')) continue;
    if (!html.includes('jur-relevance-card')) continue;
    html = html.replace('</head>', `${style}\n</head>`);
    fs.writeFileSync(file, html);
    changed++;
  }
}
console.log(`[LEXONYX jurisdiction UI fix] updated=${changed}`);
