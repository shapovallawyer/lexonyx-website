import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const ROOT = process.cwd();
const pages = [
  '/ru/index.html',
  '/ru/podhod/index.html',
  '/ru/ekspertiza/index.html',
  '/ru/ekspertiza/substance-i-governance.html',
  '/ru/ekspertiza/regulyatornaya-arhitektura-i-licenzirovanie.html',
  '/ru/formaty-raboty/ekspress-proverka-riskov.html',
  '/ru/yurisdikcii/germaniya.html',
  '/ru/insayty/index.html',
  '/ru/insayty/razbory/deep-dive-banking-readiness.html',
  '/ru/insayty/instrumenty/index.html',
  '/ru/dlya-ukrainskogo-biznesa.html',
  '/ru/zaprosit-razbor.html'
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1100 },
  { name: 'mobile', width: 390, height: 844 }
];

function chromeBinary() {
  const candidates = [
    process.env.CHROME_BIN,
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ].filter(Boolean);
  for (const bin of candidates) {
    if (fs.existsSync(bin)) return bin;
    const r = spawnSync('bash', ['-lc', `command -v ${JSON.stringify(bin)} 2>/dev/null`], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  throw new Error('Chrome/Chromium not found on runner');
}

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8'
  })[ext] || 'application/octet-stream';
}

const runner = `<!doctype html>
<meta charset="utf-8">
<title>LEXONYX RU layout QA</title>
<pre id="result">running</pre>
<script>
const pages = ${JSON.stringify(pages)};
const viewports = ${JSON.stringify(viewports)};
const results = [];
const sleep = ms => new Promise(r => setTimeout(r, ms));
const visible = el => {
  const s = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) !== 0 && r.width > 0 && r.height > 0;
};
function lines(el) {
  const s = getComputedStyle(el);
  const lh = parseFloat(s.lineHeight);
  const h = el.getBoundingClientRect().height;
  return Number.isFinite(lh) && lh > 0 ? Math.max(1, Math.round(h / lh)) : 1;
}
async function test(page, vp) {
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:absolute;left:-20000px;top:0;border:0;';
  iframe.width = vp.width;
  iframe.height = Math.max(vp.height, 1200);
  iframe.src = page + '?qa=' + Date.now();
  document.body.appendChild(iframe);
  await new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), 10000);
    iframe.onload = () => { clearTimeout(t); resolve(); };
    iframe.onerror = () => { clearTimeout(t); reject(new Error('load error')); };
  });
  await new Promise(r => iframe.contentWindow.requestAnimationFrame(() => iframe.contentWindow.requestAnimationFrame(r)));
  await sleep(80);
  const w = iframe.contentWindow;
  const d = iframe.contentDocument;
  const issues = [];
  const warnings = [];
  const vw = w.innerWidth;
  const rootExtra = d.documentElement.scrollWidth - d.documentElement.clientWidth;
  const bodyExtra = d.body.scrollWidth - d.body.clientWidth;
  if (rootExtra > 2 || bodyExtra > 2) issues.push('horizontal-overflow:' + Math.max(rootExtra, bodyExtra) + 'px');

  const selectors = [
    '.site-header', '.site-header .container', '.header-container', '.nav', '.header-actions', '.lang-switcher',
    'main', '.container', '.container-narrow', '.hero-content-home', '.page-hero-inner',
    '.service-card', '.package-card', '.insight-card', '.jurisdiction-card', '.risk-card', '.cta-card'
  ];
  for (const sel of selectors) {
    for (const el of d.querySelectorAll(sel)) {
      if (!visible.call(w, el)) continue;
      const r = el.getBoundingClientRect();
      if (r.left < -2 || r.right > vw + 2) issues.push('viewport-overflow:' + sel);
      if (el.scrollWidth - el.clientWidth > 3) issues.push('content-overflow:' + sel);
    }
  }

  for (const el of d.querySelectorAll('h1,h2,h3,.btn,button,.nav-link,.mobile-menu-cta')) {
    if (!visible.call(w, el)) continue;
    const tag = el.tagName.toLowerCase();
    const cls = el.className ? String(el.className).split(/\\s+/).slice(0,2).join('.') : '';
    const id = tag + (cls ? '.' + cls : '');
    if (el.scrollWidth - el.clientWidth > 3) issues.push('text-overflow:' + id);
    const n = lines.call(w, el);
    if ((tag === 'button' || el.classList.contains('btn')) && n > 2) issues.push('button-lines:' + n + ':' + (el.textContent || '').trim().slice(0,60));
    if (tag === 'h1' && n > (vp.name === 'mobile' ? 6 : 4)) warnings.push('h1-lines:' + n + ':' + (el.textContent || '').trim().slice(0,80));
    if (tag === 'h2' && n > (vp.name === 'mobile' ? 7 : 5)) warnings.push('h2-lines:' + n + ':' + (el.textContent || '').trim().slice(0,80));
  }

  const headerText = (d.querySelector('.site-header')?.innerText || '').replace(/\\s+/g, ' ').trim();
  if (/Великобритания/.test(headerText)) issues.push('language-switch-expanded-to-Великобритания');
  if (vp.name === 'desktop' && d.querySelector('.site-header') && !/\\bRU\\b/.test(headerText)) warnings.push('header-missing-RU-token');
  if (vp.name === 'desktop' && d.querySelector('.site-header') && !/\\bEN\\b/.test(headerText)) warnings.push('header-missing-EN-token');
  if (vp.name === 'desktop' && d.querySelector('.site-header') && !/\\bUK\\b/.test(headerText)) warnings.push('header-missing-UK-token');

  iframe.remove();
  return { page, viewport: vp.name, width: vw, issues: [...new Set(issues)], warnings: [...new Set(warnings)] };
}
(async () => {
  for (const vp of viewports) {
    for (const page of pages) {
      try { results.push(await test(page, vp)); }
      catch (e) { results.push({ page, viewport: vp.name, issues: ['load-failure:' + e.message], warnings: [] }); }
    }
  }
  document.getElementById('result').textContent = JSON.stringify(results);
  document.title = 'DONE';
})();
</script>`;

const server = http.createServer((req, res) => {
  const raw = decodeURIComponent((req.url || '/').split('?')[0]);
  if (raw === '/__ru-layout-qa.html') {
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    res.end(runner);
    return;
  }
  let rel = raw.replace(/^\/+/, '');
  if (!rel) rel = 'index.html';
  const file = path.resolve(ROOT, rel);
  if (!file.startsWith(path.resolve(ROOT) + path.sep) && file !== path.resolve(ROOT, 'index.html')) {
    res.writeHead(403); res.end('forbidden'); return;
  }
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, { 'content-type': mime(file), 'cache-control': 'no-store' });
  fs.createReadStream(file).pipe(res);
});

await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port;
const chrome = chromeBinary();
const url = `http://127.0.0.1:${port}/__ru-layout-qa.html`;
const args = [
  '--headless=new', '--no-sandbox', '--disable-gpu', '--hide-scrollbars',
  '--window-size=1500,1200', '--virtual-time-budget=45000', '--dump-dom', url
];

const child = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] });
let stdout = '';
let stderr = '';
child.stdout.on('data', d => stdout += d.toString());
child.stderr.on('data', d => stderr += d.toString());
const code = await new Promise(resolve => child.on('close', resolve));
server.close();
if (code !== 0) {
  console.error(stderr);
  throw new Error(`Chrome exited with ${code}`);
}

const match = stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/i);
if (!match) {
  console.error(stdout.slice(-4000));
  throw new Error('QA result not found in browser DOM');
}
const decoded = match[1]
  .replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const results = JSON.parse(decoded);
let failures = 0;
let warningCount = 0;
for (const r of results) {
  const status = r.issues.length ? 'FAIL' : (r.warnings.length ? 'WARN' : 'PASS');
  console.log(`${status.padEnd(4)} ${r.viewport.padEnd(7)} ${r.page}`);
  for (const x of r.issues) { failures++; console.log(`  ISSUE: ${x}`); }
  for (const x of r.warnings) { warningCount++; console.log(`  WARN: ${x}`); }
}
console.log(`\n[LEXONYX RU rendered layout audit] pages=${pages.length} viewports=${viewports.length} failures=${failures} warnings=${warningCount}`);
if (failures) process.exit(1);
