// Vergelijkt de berekende stijl van Weigeren en Configureren op de cookiebalk, per breedte. CSSFILE=pad voor een kandidaat.
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const css = process.env.CSSFILE ? fs.readFileSync(path.resolve(process.env.CSSFILE)) : null;
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-cbd-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*google-analytics*', '*analytics.google*', '*doubleclick*', '*googleadservices*', '*googlesyndication*', '*google.com/ccm*', '*google.com/pagead*', '*clarity.ms*', '*facebook*', '*apollo.io*', '*cal.com*'] }, sid);
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; if (!css) { await send('Fetch.continueRequest', { requestId: e.params.requestId }, sid); continue; } await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/css; charset=utf-8' }], body: css.toString('base64') }, sid); } }, 20);
const ev = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true }, sid)).result.value;
const EIG = ['color', 'backgroundColor', 'borderTopColor', 'borderTopWidth', 'borderTopStyle', 'borderRadius', 'boxShadow', 'fontSize', 'fontWeight', 'textDecorationLine', 'paddingTop', 'paddingLeft', 'height', 'width'];
for (const [W, H, mobile] of [[1440, 900, false], [1280, 800, false], [992, 800, false], [991, 800, false], [820, 1180, true], [390, 844, true]]) {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile }, sid);
  events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu/' }, sid);
  const stop = Date.now() + 20000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
  { const t0 = Date.now(); while (Date.now() - t0 < 25000 && !(await ev(`!!document.querySelector('.cookie-permission-container .js-cookie-configuration-button .btn')`))) await sleep(300); }
  await sleep(500);
  const r = JSON.parse(await ev(`JSON.stringify((()=>{const g=s=>{const b=document.querySelector('.cookie-permission-container '+s+' .btn');if(!b)return null;const c=getComputedStyle(b),q=b.getBoundingClientRect();const o={};for(const k of ${JSON.stringify(EIG)})o[k]=c[k];o.h=Math.round(q.height);o.w=Math.round(q.width);return o};return {weigeren:g('.js-cookie-permission-button'),configureren:g('.js-cookie-configuration-button')}})())`));
  const verschil = r.weigeren && r.configureren ? EIG.filter(k => r.weigeren[k] !== r.configureren[k]) : ['geen balk'];
  console.log(`${W}px verschil weigeren/configureren: ${verschil.join(', ') || 'geen'}`);
  if (W >= 992 || process.env.ALLES) console.log('  weigeren     ', JSON.stringify(r.weigeren)); if (W >= 992 || process.env.ALLES) console.log('  configureren ', JSON.stringify(r.configureren));
  if (W === 1280) { const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: H - 140, width: W, height: 140, scale: 1 } }, sid); fs.writeFileSync(path.join(path.dirname(fileURLToPath(import.meta.url)), 'cookiebalk', (process.env.NAAM || 'desktop') + '-1280.png'), Buffer.from(data, 'base64')); }
}
await send('Browser.close'); chrome.kill(); process.exit(0);
