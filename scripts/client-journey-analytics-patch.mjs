import fs from 'node:fs';
import path from 'node:path';

const file = path.join(process.cwd(), 'scripts', 'analytics-runtime.js');
let js = fs.readFileSync(file, 'utf8');

const marker = "      if (link.classList.contains('lang-option')) {\n";
const block = "      if (link.hasAttribute('data-funnel-journey')) {\n        track('client_journey_click', {\n          journey: safeText(link.getAttribute('data-funnel-journey'), 64),\n          link_url: safeText(href, 180),\n          link_text: safeText(link.textContent, 80)\n        });\n      }\n";

if (!js.includes("track('client_journey_click'")) {
  if (!js.includes(marker)) throw new Error('analytics runtime click marker not found');
  js = js.replace(marker, block + marker);
  fs.writeFileSync(file, js, 'utf8');
}

console.log('[LEXONYX client journey analytics] event=client_journey_click ready');
