// Klikt Weigeren, Configureren en Aanvaard alle cookies aan (elk op een schone sessie) en meldt wat er gebeurt. Gebruik: [CSSFILE=pad] node cookiebalk-functie.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const css = process.env.CSSFILE ? fs.readFileSync(path.resolve(process.env.CSSFILE)) : null;
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-cf-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('x')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, sid);
await send('Network.setBlockedURLs', { urls: ['*google-analytics*', '*analytics.google*', '*doubleclick*', '*googleadservices*', '*googlesyndication*', '*google.com/ccm*', '*google.com/pagead*', '*clarity.ms*', '*facebook*', '*apollo.io*', '*cal.com*'] }, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; if (!css) await send('Fetch.continueRequest', { requestId: e.params.requestId }, sid); else await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/css; charset=utf-8' }], body: css.toString('base64') }, sid); } }, 20);
const ev = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true }, sid)).result.value;
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true }, sid); await send('Emulation.setTouchEmulationEnabled', { enabled: true }, sid);
for (const [naam, sel] of [['Weigeren', '.js-cookie-permission-button button'], ['Configureren', '.js-cookie-configuration-button button'], ['Aanvaard alle cookies', '.js-cookie-accept-all-button button']]) {
  await send('Network.clearBrowserCookies', {}, sid); events = [];
  await send('Page.navigate', { url: 'https://rootedgoods.eu/' }, sid);
  const stop = Date.now() + 20000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
  await sleep(3500);
  // echte tik op het midden van de knop (touch), zoals een bezoeker
  const r = JSON.parse(await ev(`JSON.stringify((()=>{const b=document.querySelector(${JSON.stringify(sel)});const q=b.getBoundingClientRect();return {x:q.x+q.width/2,y:q.y+q.height/2,h:q.height}})())`));
  await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: r.x, y: r.y }] }, sid); await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }, sid);
  await sleep(2500);
  const na = JSON.parse(await ev(`JSON.stringify({ banner: (()=>{const c=document.querySelector('.cookie-permission-container');return c?getComputedStyle(c).display:'weg'})(), modal: !!document.querySelector('.modal.show, .offcanvas.show, .cookie-configuration:not(.d-none)'), modalTitel: (document.querySelector('.modal.show .modal-title, .offcanvas.show .offcanvas-title')||{}).textContent, cookies: document.cookie.split(';').map(c=>c.trim().split('=')[0]).filter(c=>/cookie-pref|_ga|_gcl/.test(c)), dl: (window.dataLayer||[]).map(x=>x.event||'').filter(Boolean).slice(-6) })`));
  console.log(naam.padEnd(22) + ' knop ' + Math.round(r.h) + 'px hoog | na tik: ' + JSON.stringify(na));
}
await send('Browser.close'); chrome.kill(); process.exit(0);
