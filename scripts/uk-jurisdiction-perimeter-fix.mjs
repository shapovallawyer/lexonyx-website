import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const dir = path.join(ROOT, 'uk/yurysdyktsiyi');
const files = ['ukrayina.html','nimechchyna.html','kipr.html','polshcha.html','niderlandy.html','oae.html','estoniya.html','irlandiya.html','velykobrytaniya.html','shveytsariya.html'];
const block = `<section class="section section-light lx-compliance-perimeter"><div class="container container-narrow"><div class="section-label">ПРОФЕСІЙНИЙ ПЕРИМЕТР</div><p><strong>LEXONYX</strong> виконує структурний і фактичний транскордонний аналіз. Консультації з українського права надаються безпосередньо в межах професійної компетенції адвоката України. Висновки щодо права, податків і регуляторних вимог інших юрисдикцій надають або підтверджують належно кваліфіковані місцеві фахівці.</p></div></section>`;
let changed = 0;
for (const name of files) {
  const file = path.join(dir, name);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('lx-compliance-perimeter')) continue;
  html = html.replace(/<\/main>/i, `${block}\n</main>`);
  fs.writeFileSync(file, html, 'utf8');
  changed++;
}
console.log(`[LEXONYX UK jurisdiction perimeter] PASS — changed=${changed}`);
