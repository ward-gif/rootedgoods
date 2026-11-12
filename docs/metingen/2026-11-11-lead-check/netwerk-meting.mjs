// Welke meet-aanroepen gaan er bij het laden van een pagina, ZONDER op de cookiebalk te klikken. Alleen lezen.
// Gebruik: node netwerk-meting.mjs <pad> [<pad> ...]
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const paden = process.argv.slice(2); const ACCEPTEER = !!process.env.ACCEPTEER;
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-net-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false }, sid);
for (const pad of paden) {
  events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
  const stop = Date.now() + 20000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
  await sleep(6000);
  console.log('\n== ' + pad);
  const gezien = new Set();
  for (const e of events) if (e.method === 'Network.requestWillBeSent') {
    const u = e.params.request.url;
    if (/googletagmanager|google-analytics|analytics\.google|doubleclick|googleadservices|facebook|clarity\.ms|apollo|cal\.com/.test(u)) {
      const p = new URL(u); const q = p.searchParams;
      const k = p.host + p.pathname + ' ' + ['en', 'gcs', 'gcd', 'dl', 'tid', 'id'].map(x => q.get(x) ? x + '=' + q.get(x).slice(0, 40) : '').filter(Boolean).join(' ');
      if (!gezien.has(k)) { gezien.add(k); console.log('  ' + k); }
    }
  }
  const banner = (await send('Runtime.evaluate', { expression: `JSON.stringify({ banner: !!document.querySelector('.cookie-permission-container'), zichtbaar: (()=>{const e=document.querySelector('.cookie-permission-container');return e&&getComputedStyle(e).display!=='none'})(), knoppen:[...document.querySelectorAll('.cookie-permission-container button')].map(b=>b.textContent.trim().slice(0,30)), cookies: document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(Boolean), dataLayer: (window.dataLayer||[]).map(x=>x.event||(x[0]+':'+(x[1]||''))).slice(0,14) })`, returnByValue: true }, sid)).result.value;
  console.log('  ' + banner);
  if (ACCEPTEER && pad === paden[0]) {
    events = [];
    const klik = (await send('Runtime.evaluate', { expression: `(()=>{const b=[...document.querySelectorAll('.cookie-permission-container button')].find(x=>/aanvaard alle/i.test(x.textContent));if(!b)return 'geen knop';b.click();return 'geklikt'})()`, returnByValue: true }, sid)).result.value;
    await sleep(5000);
    console.log('  -- NA KLIK OP "Aanvaard alle cookies": ' + klik);
    const na = new Set();
    for (const e of events) if (e.method === 'Network.requestWillBeSent') {
      const u = e.params.request.url;
      if (/google-analytics|analytics\.google|googlesyndication|doubleclick|googleadservices|facebook|collect/.test(u)) {
        const p = new URL(u); const q = p.searchParams;
        const k = p.host + p.pathname + ' ' + ['en', 'gcs', 'gcd', 'dl', 'tid'].map(x => q.get(x) ? x + '=' + q.get(x).slice(0, 50) : '').filter(Boolean).join(' ');
        if (!na.has(k)) { na.add(k); console.log('    ' + k); }
      }
    }
    const st = (await send('Runtime.evaluate', { expression: `JSON.stringify({ cookies: document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(Boolean), dataLayer: (window.dataLayer||[]).map(x=>x.event||(x[0]+':'+(x[1]||''))).slice(-14) })`, returnByValue: true }, sid)).result.value;
    console.log('    ' + st);
  }
}
await send('Browser.close'); chrome.kill(); process.exit(0);
