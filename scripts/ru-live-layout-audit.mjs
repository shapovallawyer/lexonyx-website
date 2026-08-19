import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'artifacts', 'ru-layout-qa');
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
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 }
];

function chromeBinary() {
  for (const bin of [process.env.CHROME_BIN, '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser'].filter(Boolean)) {
    if (fs.existsSync(bin)) return bin;
    const r = spawnSync('bash', ['-lc', `command -v ${JSON.stringify(bin)} 2>/dev/null`], { encoding: 'utf8' });
    if (r.status === 0 && r.stdout.trim()) return r.stdout.trim();
  }
  throw new Error('Chrome/Chromium not found on runner');
}
function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
    '.xml': 'application/xml; charset=utf-8', '.txt': 'text/plain; charset=utf-8'
  })[ext] || 'application/octet-stream';
}
function slug(page) {
  return page.replace(/^\/+|\.html$/g, '').replace(/\//g, '__') || 'index';
}

const server = http.createServer((req, res) => {
  let rel = decodeURIComponent((req.url || '/').split('?')[0]).replace(/^\/+/, '');
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

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: chromeBinary(), headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});

const results = [];
for (const vp of viewports) {
  fs.mkdirSync(path.join(OUT, vp.name), { recursive: true });
  for (const pathname of pages) {
    const p = await browser.newPage();
    await p.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
    const response = await p.goto(`http://127.0.0.1:${port}${pathname}?qa=1`, { waitUntil: 'domcontentloaded', timeout: 15000 });
    if (!response || response.status() >= 400) {
      results.push({ page: pathname, viewport: vp.name, issues: [`load-status:${response?.status() ?? 'none'}`], warnings: [] });
      await p.close();
      continue;
    }
    await p.evaluate(async () => {
      try { await Promise.race([document.fonts?.ready || Promise.resolve(), new Promise(r => setTimeout(r, 1500))]); } catch {}
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    });

    const check = await p.evaluate(({ viewportName }) => {
      const issues = [];
      const warnings = [];
      const visible = el => {
        const s = getComputedStyle(el); const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) !== 0 && r.width > 0 && r.height > 0;
      };
      const lineCount = el => {
        const s = getComputedStyle(el); const lh = parseFloat(s.lineHeight); const h = el.getBoundingClientRect().height;
        return Number.isFinite(lh) && lh > 0 ? Math.max(1, Math.round(h / lh)) : 1;
      };
      const vw = window.innerWidth;
      const rootExtra = document.documentElement.scrollWidth - document.documentElement.clientWidth;
      const bodyExtra = document.body.scrollWidth - document.body.clientWidth;
      if (rootExtra > 2 || bodyExtra > 2) issues.push(`horizontal-overflow:${Math.max(rootExtra, bodyExtra)}px`);

      const selectors = [
        '.site-header', '.site-header .container', '.header-container', '.nav', '.header-actions', '.lang-switcher',
        'main', '.container', '.container-narrow', '.hero-content-home', '.page-hero-inner',
        '.service-card', '.package-card', '.insight-card', '.jurisdiction-card', '.risk-card', '.cta-card'
      ];
      for (const sel of selectors) {
        for (const el of document.querySelectorAll(sel)) {
          if (!visible(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.left < -2 || r.right > vw + 2) issues.push(`viewport-overflow:${sel}`);
          if (el.scrollWidth - el.clientWidth > 3) issues.push(`content-overflow:${sel}`);
        }
      }
      for (const el of document.querySelectorAll('h1,h2,h3,.btn,button,.nav-link,.mobile-menu-cta')) {
        if (!visible(el)) continue;
        const tag = el.tagName.toLowerCase();
        const n = lineCount(el);
        const label = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90);
        if (el.scrollWidth - el.clientWidth > 3) issues.push(`text-overflow:${tag}:${label}`);
        if ((tag === 'button' || el.classList.contains('btn')) && n > 2) issues.push(`button-lines:${n}:${label}`);
        if (tag === 'h1' && n > (viewportName === 'mobile' ? 6 : 4)) warnings.push(`h1-lines:${n}:${label}`);
        if (tag === 'h2' && n > (viewportName === 'mobile' ? 7 : 5)) warnings.push(`h2-lines:${n}:${label}`);
      }
      const headerText = (document.querySelector('.site-header')?.innerText || '').replace(/\s+/g, ' ').trim();
      if (/Великобритания/.test(headerText)) issues.push('language-switch-expanded-to-Великобритания');
      if (viewportName === 'desktop' && document.querySelector('.site-header')) {
        for (const token of ['RU','EN','UK']) if (!new RegExp(`\\b${token}\\b`).test(headerText)) warnings.push(`header-missing-${token}-token`);
      }
      return { width: vw, issues: [...new Set(issues)], warnings: [...new Set(warnings)] };
    }, { viewportName: vp.name });

    const shot = path.join(OUT, vp.name, `${slug(pathname)}.jpg`);
    await p.screenshot({ path: shot, fullPage: true, type: 'jpeg', quality: 62 });
    results.push({ page: pathname, viewport: vp.name, ...check, screenshot: path.relative(ROOT, shot) });
    await p.close();
  }
}
await browser.close();
server.close();

fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));
let failures = 0, warningCount = 0;
for (const r of results) {
  const status = r.issues.length ? 'FAIL' : (r.warnings.length ? 'WARN' : 'PASS');
  console.log(`${status.padEnd(4)} ${r.viewport.padEnd(7)} ${r.page}`);
  for (const x of r.issues) { failures++; console.log(`  ISSUE: ${x}`); }
  for (const x of r.warnings) { warningCount++; console.log(`  WARN: ${x}`); }
}
console.log(`\n[LEXONYX RU rendered layout audit] pages=${pages.length} viewports=${viewports.length} failures=${failures} warnings=${warningCount}`);
if (failures) process.exit(1);
