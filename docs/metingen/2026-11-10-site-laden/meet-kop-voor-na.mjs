// De mobiele header vóór en ná onze JS (BLOCK=js blokkeert rootedgoods.min.js), met optioneel extra CSS.
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL = process.env.URL || 'https://rootedgoods.eu/huis-keuken/';
const css = process.env.CSS ? fs.readFileSync(process.env.CSS, 'utf8') : '';
const VPS = (process.env.VP || '360x740,390x844,430x932,768x1024').split(',').map(v => v.split('x').map(Number));
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-kop-')), '--window-size=430,932', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sid); await send('Runtime.enable', {}, sid); await send('Network.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
const modes = [['met', []], ['zonder', ['*rootedgoods.min.js*']]];
const MET = `(() => { const q = s => document.querySelector(s); const r = el => { if (!el || !el.getBoundingClientRect) return null; const b = el.getBoundingClientRect(); return b.width || b.height ? [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)] : null; };
  const toggle = [...document.querySelectorAll('.search-toggle-btn')].find(e => e.getBoundingClientRect().width > 0);
  const ham = [...document.querySelectorAll('.menu-button .icon, .nav-main-toggle .icon')].find(e => e.getBoundingClientRect().width > 0);
  return { header: r(q('.header-main')), rij: r(q('.header-row')), logo: r(q('.header-logo-main-img')), ham: r(ham), zoek: r(toggle && toggle.querySelector('.icon')), mandje: r(q('.header-cart-btn .icon')), topbar: r(q('.top-bar')), content: r(q('.cms-page')) }; })()`;
const uit = {};
for (const [mode, blok] of modes) {
  await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*', ...blok] }, sid);
  for (const [w, h] of VPS) {
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: true }, sid);
    events = []; await send('Page.navigate', { url: URL }, sid);
    for (let i = 0; i < 80 && !events.some(e => e.method === 'Page.loadEventFired'); i++) await sleep(250);
    if (css) await send('Runtime.evaluate', { expression: `(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s)})()` }, sid);
    await sleep(2500);
    const v = await send('Runtime.evaluate', { expression: MET, returnByValue: true }, sid);
    uit[`${mode}-${w}`] = v.result.value;
  }
}
for (const [w] of VPS) {
  const a = uit[`zonder-${w}`], b = uit[`met-${w}`];
  console.log(`--- ${w}px (vóór de JS -> ná de JS), [x, y, b, h]`);
  for (const k of Object.keys(b)) console.log(`  ${k.padEnd(8)} ${JSON.stringify(a[k])} -> ${JSON.stringify(b[k])}${JSON.stringify(a[k]) === JSON.stringify(b[k]) ? '' : '   <-- verschilt'}`);
}
fs.writeFileSync(path.join(path.dirname(new URL(import.meta.url).pathname), `kop-${process.env.NAAM || 'x'}.json`), JSON.stringify(uit, null, 1));
await send('Browser.close'); chrome.kill(); process.exit(0);
