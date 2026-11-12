// Alleen lezen: welke velden heeft het formulier op een pagina (type, naam, verplicht), en is er een captcha?
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-form-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('x')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, sid);
await send('Network.setBlockedURLs', { urls: ['*google-analytics*', '*analytics.google*', '*googletagmanager*', '*doubleclick*', '*googleadservices*', '*googlesyndication*', '*google.com/ccm*', '*google.com/pagead*', '*google.com/rmkt*', '*google.nl/pagead*', '*clarity.ms*', '*facebook*', '*apollo*'] }, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false }, sid);
for (const pad of process.argv.slice(2)) {
  events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
  const stop = Date.now() + 20000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
  await sleep(3000);
  const r = await send('Runtime.evaluate', { returnByValue: true, expression: `JSON.stringify([...document.forms].filter(f=>!/search|newsletter|cookie|logout|language|currency|wishlist/i.test((f.action||'')+f.className+f.id)).map(f=>({id:f.id,cls:f.className.slice(0,50),action:(f.getAttribute('action')||'').slice(0,70),method:f.method,zichtbaar:!!(f.offsetWidth||f.offsetHeight),velden:[...f.elements].filter(e=>e.name&&e.type!=='hidden').map(e=>e.tagName.toLowerCase()+':'+e.type+':'+e.name+(e.required?'*':'')+(e.type==='checkbox'||e.type==='radio'?'(val='+e.value+')':'')+(e.tagName==='SELECT'?'['+[...e.options].slice(0,3).map(o=>o.value).join('|')+']':'')),knoppen:[...f.querySelectorAll('button,[type=submit]')].map(b=>b.textContent.trim().slice(0,25)),captcha:!!f.querySelector('[class*=captcha],iframe[src*=captcha],[id*=captcha],.g-recaptcha')})))` }, sid);
  console.log('== ' + pad); for (const f of JSON.parse(r.result.value)) console.log(JSON.stringify(f, null, 1));
}
await send('Browser.close'); chrome.kill(); process.exit(0);
