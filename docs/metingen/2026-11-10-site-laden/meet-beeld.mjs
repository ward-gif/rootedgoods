// Welke afbeeldingen zijn zwaarder of groter dan nodig? Live, alleen lezen, mobiel 390 x 844, na laden en een scroll tot onderaan.
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const PAGINAS = process.argv.slice(2);
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-img-')), '--window-size=390,844', 'about:blank']);
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
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*'] }, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 3, mobile: true }, sid);
const out = {};
for (const pad of PAGINAS) {
  events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
  for (let i = 0; i < 60 && !events.some(e => e.method === 'Page.loadEventFired'); i++) await sleep(250);
  await sleep(1500);
  await send('Runtime.evaluate', { expression: `(async () => { for (let y = 0; y < document.scrollingElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); await new Promise(r => setTimeout(r, 1500)); })()`, awaitPromise: true }, sid);
  const v = await send('Runtime.evaluate', { expression: `JSON.stringify((() => { const rt = Object.fromEntries(performance.getEntriesByType('resource').map(e => [e.name, e])); return [...document.images].filter(i => i.currentSrc && i.complete && i.naturalWidth).map(i => { const b = i.getBoundingClientRect(); const e = rt[i.currentSrc]; return { src: decodeURIComponent(i.currentSrc).replace(/^https?:\\/\\/(www\\.)?/, '').slice(-80), nat: i.naturalWidth + 'x' + i.naturalHeight, getoond: Math.round(b.width) + 'x' + Math.round(b.height), kb: e ? Math.round((e.encodedBodySize || e.transferSize || 0) / 1024) : null, zichtbaar: b.width > 0 && b.height > 0, ratio: b.width ? +(i.naturalWidth / (b.width * 3)).toFixed(2) : null, lazy: i.loading, fp: i.getAttribute('fetchpriority'), format: (i.currentSrc.split('?')[0].split('.').pop() || '').slice(0, 5) }; }); })())`, returnByValue: true }, sid);
  out[pad] = JSON.parse(v.result.value);
  const l = out[pad].filter(x => x.kb != null);
  const tot = l.reduce((a, x) => a + x.kb, 0);
  console.log(`\n${pad}: ${l.length} afbeeldingen geladen na scrollen, ${tot} kB`);
  l.sort((a, b) => b.kb - a.kb).slice(0, 7).forEach(x => console.log(`  ${String(x.kb).padStart(4)} kB  ${x.nat.padEnd(10)} getoond ${x.getoond.padEnd(8)} (${x.zichtbaar ? 'zichtbaar' : 'verborgen'}) ${x.format} ${x.src}`));
}
fs.writeFileSync(path.join(path.dirname(process.argv[1]), 'beeld.json'), JSON.stringify(out, null, 1));
await send('Browser.close'); chrome.kill(); process.exit(0);
