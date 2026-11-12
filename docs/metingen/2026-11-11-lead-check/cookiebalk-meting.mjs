// Meet de cookiebalk (hoogte, knoppen, tikdoelen) per viewport, met huidige live CSS of een kandidaat (CSSFILE), en maakt een schermafbeelding.
// Gebruik: [CSSFILE=pad] [NAAM=x] node cookiebalk-meting.mjs        Schrijft cookiebalk/<naam>-<vp>.png
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url)); const REPO = path.resolve(HIER, '../../..');
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const css = process.env.CSSFILE ? fs.readFileSync(path.resolve(process.env.CSSFILE)) : null; const jsLok = fs.readFileSync(path.join(REPO, 'rootedgoods.js'));
const NAAM = process.env.NAAM || 'live';
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-cb-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('x')), 15000); });
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
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }, { urlPattern: '*rootedgoods.min.js*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; const isCss = e.params.request.url.includes('.min.css'); if (isCss && !css) { await send('Fetch.continueRequest', { requestId: e.params.requestId }, sid); continue; } if (!isCss) { await send('Fetch.continueRequest', { requestId: e.params.requestId }, sid); continue; } await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'text/css; charset=utf-8' }], body: css.toString('base64') }, sid); } }, 20);
const ev = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true }, sid)).result.value;
const VPS = [['375x667', 375, 667, true], ['390x844', 390, 844, true], ['768x1024', 768, 1024, true], ['1280x800', 1280, 800, false]];
for (const pad of (process.argv[2] ? [process.argv[2]] : ['/'])) for (const [naam, W, H, mobile] of VPS) {
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile }, sid);
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile }, sid);
  events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
  const stop = Date.now() + 20000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
  await sleep(3500);
  if (process.env.LABEL) await ev(`document.querySelectorAll('.js-cookie-accept-all-button button').forEach(b=>b.textContent=${JSON.stringify(process.env.LABEL)})`);
  const m = JSON.parse(await ev(`JSON.stringify((()=>{const c=document.querySelector('.cookie-permission-container');if(!c)return {banner:false};const r=c.getBoundingClientRect(),cs=getComputedStyle(c);const knoppen=[...c.querySelectorAll('button')].map(b=>{const q=b.getBoundingClientRect();return {t:b.textContent.trim().slice(0,24),w:Math.round(q.width),h:Math.round(q.height),x:Math.round(q.x),y:Math.round(q.y),fs:getComputedStyle(b).fontSize}});const tekst=c.querySelector('.cookie-permission-content, .offcanvas-cookie-description, p');return {banner:true,pos:cs.position,x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height),bottom:Math.round(innerHeight-r.bottom),knoppen,tekstH:tekst?Math.round(tekst.getBoundingClientRect().height):null,tekstLen:tekst?tekst.textContent.trim().length:null,hscroll:document.documentElement.scrollWidth>innerWidth,vh:innerHeight}})())`));
  console.log(`${NAAM} ${pad} ${naam}: ` + JSON.stringify(m));
  const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: W, height: H, scale: 1 } }, sid);
  fs.writeFileSync(path.join(HIER, 'cookiebalk', `${NAAM}-${pad.replace(/[^a-z0-9]+/gi, '_').replace(/^_|_$/g, '') || 'home'}-${naam}.png`), Buffer.from(data, 'base64'));
}
await send('Browser.close'); chrome.kill(); process.exit(0);
