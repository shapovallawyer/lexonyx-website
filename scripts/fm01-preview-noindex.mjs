import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const files = [
  'en/insights/deep-dives/founder-moves-business-stays.html',
  'ru/insayty/razbory/founder-moves-business-stays.html',
  'uk/insaity/rozbory/founder-moves-business-stays.html'
];
const robots = '<meta name="robots" content="noindex, nofollow">';
let changed = 0;

for (const rel of files) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, 'utf8');
  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, robots);
  } else if (/<meta\s+name=["']viewport["'][^>]*>/i.test(html)) {
    html = html.replace(/(<meta\s+name=["']viewport["'][^>]*>)/i, `$1\n  ${robots}`);
  } else {
    html = html.replace(/<head>/i, `<head>\n  ${robots}`);
  }
  fs.writeFileSync(file, html, 'utf8');
  changed++;
}

if (!changed) {
  console.log('[FM-01 preview noindex] SKIP — preview family not generated');
} else {
  console.log(`[FM-01 preview noindex] PASS — protected pages=${changed}`);
}
