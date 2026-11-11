// Schermafbeeldingen van pagina's met CSS A (huidig) en CSS B (kandidaat), zelfde DOM, per breedte. Zet PNG's in koppen/.
// Gebruik: CSSB=kandidaat-koppen.css node schermfoto-ab.mjs <naam> <pad> [<pad> ...]   env: VP=mobiel|desktop, HOOGTE=1800
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url)); const REPO = path.resolve(HIER, '../../..');
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const [naam, ...paden] = process.argv.slice(2);
const A = fs.readFileSync(path.join(REPO, 'rootedgoods.css'), 'utf8'); const B = fs.readFileSync(path.resolve(process.env.CSSB), 'utf8');
const jsLok = fs.readFileSync(path.join(REPO, 'rootedgoods.js'));
const VPS = { mobiel: [390, 844, true], desktop: [1440, 900, false] }; const vps = (process.env.VP || 'mobiel,desktop').split(',');
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-foto-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*'] }, sid);
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }, { urlPattern: '*rootedgoods.min.js*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) { if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; const isCss = e.params.request.url.includes('.min.css'); await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: isCss ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' }], body: Buffer.from(isCss ? A : jsLok).toString('base64') }, sid); } } }, 20);
const HOOGTE = Number(process.env.HOOGTE || 1800);
for (const vp of vps) {
  const [W, H, mobile] = VPS[vp]; await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile }, sid);
  for (const pad of paden) {
    events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
    const stop = Date.now() + 15000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
    await sleep(4500);
    // cookiebalk weg, lazy-load laten lopen
    await send('Runtime.evaluate', { expression: `document.querySelectorAll('.cookie-permission-container').forEach(e=>e.remove()); window.scrollTo(0, document.body.scrollHeight); 0`, returnByValue: true }, sid); await sleep(1200);
    await send('Runtime.evaluate', { expression: `window.scrollTo(0,0); 0`, returnByValue: true }, sid); await sleep(500);
    for (const [lab, css] of [['voor', A], ['na', B]]) {
      await send('Runtime.evaluate', { expression: `(() => { let s = document.getElementById('rg-ab'); const l = document.querySelector('link[href*="rootedgoods.min.css"]'); if (l) l.remove(); if (!s) { s = document.createElement('style'); s.id = 'rg-ab'; document.head.appendChild(s); } s.textContent = ${JSON.stringify(css)}; return 1; })()`, returnByValue: true }, sid);
      await sleep(600);
      const h = Math.min(HOOGTE, (await send('Runtime.evaluate', { expression: 'document.scrollingElement.scrollHeight', returnByValue: true }, sid)).result.value);
      const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: h, scale: 1 } }, sid);
      const f = path.join(HIER, 'koppen', `${naam}-${pad.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}-${vp}-${lab}.png`); fs.writeFileSync(f, Buffer.from(data, 'base64')); console.log(f.replace(HIER + '/', ''), h + 'px');
    }
  }
}
await send('Browser.close'); chrome.kill(); process.exit(0);
