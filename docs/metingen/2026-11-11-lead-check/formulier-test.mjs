// Verstuurt EEN testformulier per pagina in een wegwerpbrowser en kijkt welke meet-aanroepen de pagina probeert te sturen.
// Alle eindpunten die gegevens opnemen (GA4, Ads, DoubleClick) zijn GEBLOKKEERD: de aanroep verschijnt wel in het netwerkverkeer, maar komt nergens aan.
// GTM zelf mag wel laden, anders vuurt er niets. Gebruik: node formulier-test.mjs
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-ftest-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('x')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, sid);
const BLOK = ['*google-analytics.com*', '*analytics.google.com*', '*doubleclick.net*', '*googleadservices*', '*googlesyndication*', '*google.com/ccm*', '*google.com/pagead*', '*google.nl/pagead*', '*google.com/rmkt*', '*clarity.ms*', '*facebook*', '*apollo.io*'];
await send('Network.setBlockedURLs', { urls: BLOK }, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false }, sid);
const ev = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sid)).result.value;
const TEKST = 'TEST, graag negeren. Meting van de formulier-tags op 11 november 2026, wordt niet opgevolgd.';
const PAGINAS = [
  { pad: '/offerte', velden: { 'request-inquiry': TEKST, 'request-name': 'TEST Tracking', 'request-email': 'test@example.com', 'request-company': 'TEST Tracking' } },
  { pad: '/contact', velden: { message: TEKST, firstName: 'TEST', email: 'test@example.com' } },
];
const samenvat = u => { const p = new URL(u); const q = p.searchParams; return p.host + p.pathname + ' ' + ['en', 'gcs', 'dl', 'tid', 'ep.form_id'].map(x => q.get(x) ? x + '=' + q.get(x).slice(0, 60) : '').filter(Boolean).join(' '); };
let eerste = true;
for (const { pad, velden } of PAGINAS) {
  events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
  const stop = Date.now() + 20000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
  await sleep(4000);
  if (eerste) { eerste = false; console.log('cookies accepteren:', await ev(`(()=>{const b=[...document.querySelectorAll('.cookie-permission-container button')].find(x=>/aanvaard alle/i.test(x.textContent));if(!b)return 'geen knop';b.click();return 'geklikt'})()`)); await sleep(3000); }
  console.log('\n== ' + pad);
  const vul = await ev(`(()=>{const v=${JSON.stringify(velden)};const f=[...document.forms].find(f=>/custom-form\\/send/.test(f.action));if(!f)return 'geen formulier';const uit=[];for(const [n,w] of Object.entries(v)){const e=f.elements[n];if(!e){uit.push(n+': NIET GEVONDEN');continue}e.focus();e.value=w;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));uit.push(n+': ok')}f.querySelectorAll('input[type=checkbox][required]').forEach(c=>{c.checked=true;c.dispatchEvent(new Event('change',{bubbles:true}))});return uit.join(', ')})()`);
  console.log('invullen:', vul);
  events = []; const t0 = Date.now();
  console.log('verzenden:', await ev(`(()=>{const f=[...document.forms].find(f=>/custom-form\\/send/.test(f.action));const b=f.querySelector('button[type=submit],button:not([type]),[type=submit]');if(!b)return 'geen knop';b.click();return 'geklikt: '+b.textContent.trim()})()`));
  await sleep(8000);
  const post = events.find(e => e.method === 'Network.responseReceived' && /custom-form\/send/.test(e.params.response.url));
  console.log('POST custom-form/send:', post ? post.params.response.status : 'niet gezien');
  const gezien = new Set();
  for (const e of events) if (e.method === 'Network.requestWillBeSent') { const u = e.params.request.url; if (/google-analytics|analytics\.google|doubleclick|googleadservices|googlesyndication|google\.com\/(ccm|pagead|rmkt)|google\.nl\/pagead|clarity|facebook|apollo/.test(u)) { const k = samenvat(u); if (!gezien.has(k)) { gezien.add(k); console.log('  poging: ' + k); } } }
  console.log('dataLayer na verzenden:', await ev(`JSON.stringify((window.dataLayer||[]).map(x=>x.event?x.event+(x.form_id?'('+x.form_id+')':''):(x[0]+':'+(x[1]||''))).slice(-14))`));
  console.log('pagina daarna:', await ev(`JSON.stringify({url:location.pathname,tekst:document.body.innerText.match(/bedankt|verstuurd|ontvangen|succes|dank/i)?.[0]||null,fout:[...document.querySelectorAll('.alert-danger,.invalid-feedback')].map(e=>e.textContent.trim().slice(0,60)).filter(Boolean)})`));
}
await send('Browser.close'); chrome.kill(); process.exit(0);
