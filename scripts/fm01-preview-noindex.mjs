import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const file = path.join(ROOT, 'en/insights/deep-dives/founder-moves-business-stays.html');

if (!fs.existsSync(file)) {
  console.log('[FM-01 preview noindex] SKIP — preview page not generated');
  process.exit(0);
}

let html = fs.readFileSync(file, 'utf8');
const robots = '<meta name="robots" content="noindex, nofollow">';

if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
  html = html.replace(/<meta\s+name=["']robots["'][^>]*>/i, robots);
} else if (/<meta\s+name=["']viewport["'][^>]*>/i.test(html)) {
  html = html.replace(/(<meta\s+name=["']viewport["'][^>]*>)/i, `$1\n  ${robots}`);
} else {
  html = html.replace(/<head>/i, `<head>\n  ${robots}`);
}

fs.writeFileSync(file, html, 'utf8');
console.log('[FM-01 preview noindex] PASS — EN-only deploy preview protected from indexing');
