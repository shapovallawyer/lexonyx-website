import fs from 'node:fs';

const file = '_url-map-i18n.json';
const map = JSON.parse(fs.readFileSync(file, 'utf8'));
// The multilingual map is keyed by canonical RU page paths. A legacy root alias
// (`index.html`) duplicates `ru/index.html` and makes reverse lookup ambiguous.
if (map.en && map.en['index.html'] === 'en/index.html') delete map.en['index.html'];
if (map.uk && map.uk['index.html'] === 'uk/index.html') delete map.uk['index.html'];
fs.writeFileSync(file, JSON.stringify(map, null, 2) + '\n', 'utf8');
console.log('[LEXONYX i18n map] legacy root alias removed; canonical RU-keyed map retained');
