import fs from 'node:fs';
import path from 'node:path';
const ROOT=process.cwd();
const pages=[
 'en/insights/deep-dives/founder-moves-business-stays.html',
 'ru/insayty/razbory/founder-moves-business-stays.html',
 'uk/insaity/rozbory/founder-moves-business-stays.html'
];
const hrefs={
 ru:'https://lexonyx.com/ru/insayty/razbory/founder-moves-business-stays',
 en:'https://lexonyx.com/en/insights/deep-dives/founder-moves-business-stays',
 uk:'https://lexonyx.com/uk/insaity/rozbory/founder-moves-business-stays'
};
const block=`\n  <link rel="alternate" hreflang="ru" href="${hrefs.ru}">\n  <link rel="alternate" hreflang="en" href="${hrefs.en}">\n  <link rel="alternate" hreflang="uk" href="${hrefs.uk}">\n  <link rel="alternate" hreflang="x-default" href="${hrefs.en}">`;
for(const rel of pages){const file=path.join(ROOT,rel);if(!fs.existsSync(file))throw new Error(`FM-01 page missing: ${rel}`);let html=fs.readFileSync(file,'utf8');html=html.replace(/\s*<link rel="alternate" hreflang="(?:ru|en|uk|x-default)"[^>]*>/gi,'');html=html.replace('</head>',`${block}\n</head>`);fs.writeFileSync(file,html,'utf8');}
console.log('[FM-01 multilingual hreflang] PASS — reciprocal RU/EN/UK + x-default graph applied');
