// Laden van de belangrijkste paginatypes op de LIVE site (alleen lezen), eerste bezoek, mobiel.
// Per pagina: LCP (element, tijd), FCP, layout-shifts (per bron), gewicht en aantal verzoeken per type,
// lange taken, DOM-grootte, afbeeldingen zonder width/height, render-blokkerende CSS in de head.
// Gebruik: [CSS=bestand] [NET=traag|snel] [CPU=4] [W=390 H=844] node meet-site.mjs <naam> [url ...]
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url));
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const [naam = 'x', ...urlArg] = process.argv.slice(2);
const BASIS = 'https://rootedgoods.eu';
const PAGINAS = urlArg.length ? urlArg : ['/', '/alle-producten/', '/huis-keuken/', '/Borrelplank/A1352-Kerst1', '/eindejaarsgeschenken', '/thema-s/', '/offerte', '/over-ons', '/merken/', '/search?search=kerstbal', '/contact'];
const W = Number(process.env.W || 390), H = Number(process.env.H || 844), CPU = Number(process.env.CPU || 4);
const NET = process.env.NET === 'snel' ? { latency: 40, down: 10 * 1024 * 1024 / 8, up: 5 * 1024 * 1024 / 8 } : { latency: 150, down: 1.6 * 1024 * 1024 / 8, up: 750 * 1024 / 8 };
const css = process.env.CSS ? fs.readFileSync(process.env.CSS, 'utf8') : '';
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-site-')), `--window-size=${W},${H}`, '--lang=nl-NL', 'about:blank']);
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
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*', ...(process.env.BLOCKJS ? ['*rootedgoods.min.js*'] : [])] }, sid);

// Lokale bestanden in de plaats van de live .min-bestanden (Fetch-interceptie): LOKAAL=1 gebruikt ../../../rootedgoods.css en .js
if (process.env.LOKAAL) {
  const REPO = path.resolve(HIER, '../../..');
  const cssLok = fs.readFileSync(path.join(REPO, 'rootedgoods.css'));
  const jsLok = fs.readFileSync(path.join(REPO, 'rootedgoods.js'));
  await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }, { urlPattern: '*rootedgoods.min.js*' }] }, sid);
  const afhandelen = async (e) => {
    if (e.method !== 'Fetch.requestPaused') return false;
    const isCss = e.params.request.url.includes('.min.css');
    await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: isCss ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' }, { name: 'Access-Control-Allow-Origin', value: '*' }], body: (isCss ? cssLok : jsLok).toString('base64') }, sid);
    return true;
  };
  setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) { if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; await afhandelen(e); } } }, 20);
}
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sid);
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: Number(process.env.DPR || 2), mobile: true }, sid);
await send('Network.emulateNetworkConditions', { offline: false, latency: NET.latency, downloadThroughput: NET.down, uploadThroughput: NET.up }, sid);
await send('Emulation.setCPUThrottlingRate', { rate: CPU }, sid);
const HEADHTML = process.env.HEADHTML || '';
const VROEG = `window.__m = { shifts: [], lcp: null, fcp: null, long: [] };
new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), b: (e.sources||[]).map(s => { const n = s.node; if (!n) return '?'; let k = n.tagName ? n.tagName.toLowerCase() : '#'; if (n.className && typeof n.className === 'string') k += '.' + n.className.trim().split(/\\s+/).slice(0, 2).join('.'); return k; }) }); }).observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.lcp = { t: Math.round(e.startTime), el: e.element ? e.element.tagName.toLowerCase() + (e.element.className && typeof e.element.className === 'string' ? '.' + e.element.className.trim().split(/\\s+/).slice(0, 2).join('.') : '') : '?', url: e.url ? e.url.slice(-70) : '', size: e.size }; }).observe({ type: 'largest-contentful-paint', buffered: true });
new PerformanceObserver(l => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__m.fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true });
new PerformanceObserver(l => { for (const e of l.getEntries()) window.__m.long.push(Math.round(e.duration)); }).observe({ type: 'longtask', buffered: true });
${HEADHTML ? `const hh = ${JSON.stringify(HEADHTML)}; const zetHH = () => { if (document.head && !document.getElementById('rg-hh')) { const t = document.createElement('template'); t.innerHTML = hh; const m = document.createElement('meta'); m.id = 'rg-hh'; document.head.insertBefore(m, document.head.firstChild); [...t.content.children].reverse().forEach(n => document.head.insertBefore(n, document.head.firstChild)); } }; new MutationObserver(zetHH).observe(document, { childList: true, subtree: true });` : ''}
${css ? `const css = ${JSON.stringify(css)}; const zet = () => { if (document.head && !document.getElementById('rg-proto')) { const s = document.createElement('style'); s.id = 'rg-proto'; s.textContent = css; document.head.appendChild(s); } }; new MutationObserver(zet).observe(document, { childList: true, subtree: true });` : ''}`;
await send('Page.addScriptToEvaluateOnNewDocument', { source: VROEG }, sid);
const uit = {};
for (const pad of PAGINAS) {
  events = []; const req = new Map(); const types = {}; let totaal = 0, n = 0;
  const t0 = Date.now();
  await send('Page.navigate', { url: BASIS + pad }, sid);
  let geladen = false; const stop = Date.now() + 14000;
  while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) { geladen = true; break; } }
  await sleep(Number(process.env.WACHT || 4500));
  for (const e of events) {
    if (e.method === 'Network.requestWillBeSent') req.set(e.params.requestId, { type: e.params.type, url: e.params.request.url, ini: (e.params.initiator && e.params.initiator.type) || '?', ts: e.params.timestamp, pri: e.params.request.initialPriority, stack: e.params.initiator && e.params.initiator.stack ? e.params.initiator.stack.callFrames.slice(0, 3).map(f => (f.functionName || '(anon)') + '@' + f.url.split('/').pop().slice(0, 30) + ':' + f.lineNumber).join(' < ') : '' });
    if (e.method === 'Network.loadingFinished') { const r = req.get(e.params.requestId); const t = r ? r.type : '?'; types[t] = types[t] || { n: 0, bytes: 0 }; types[t].n++; types[t].bytes += e.params.encodedDataLength; totaal += e.params.encodedDataLength; n++; if (r) r.bytes = e.params.encodedDataLength; }
  }
  const groot = [...req.values()].filter(r => r.bytes).sort((a, b) => b.bytes - a.bytes).slice(0, 6).map(r => `${Math.round(r.bytes / 1024)}k ${r.type} ${r.url.replace(/^https?:\/\/(www\.)?/, '').slice(0, 90)}`);
  const m = JSON.parse((await send('Runtime.evaluate', { expression: `JSON.stringify((() => { const d = document; const imgs = [...d.images]; return { ...window.__m, dom: d.getElementsByTagName('*').length, imgs: imgs.length, imgZonderWH: imgs.filter(i => !(i.getAttribute('width') && i.getAttribute('height'))).length, imgLazy: imgs.filter(i => i.loading === 'lazy').length, cssBlokkerend: [...d.querySelectorAll('head link[rel=stylesheet]')].filter(l => !l.media || l.media === 'all').length, scriptsHead: [...d.querySelectorAll('head script[src]')].filter(s => !s.defer && !s.async).length, titel: d.title.slice(0, 50), cookie: !!d.querySelector('.cookie-permission-container') && getComputedStyle(d.querySelector('.cookie-permission-container')).display !== 'none', hoogte: d.scrollingElement.scrollHeight }; })())`, returnByValue: true }, sid)).result.value);
  if (process.env.EXPR) console.log(JSON.stringify((await send('Runtime.evaluate', { expression: process.env.EXPR, returnByValue: true }, sid)).result.value, null, 1));
  const fouten = events.filter(e => e.method === 'Runtime.exceptionThrown').map(e => ((e.params.exceptionDetails.exception && e.params.exceptionDetails.exception.description) || e.params.exceptionDetails.text || '').split('\n')[0].slice(0, 120)).concat(events.filter(e => e.method === 'Runtime.consoleAPICalled' && /rg-band|rootedgoods/.test(JSON.stringify(e.params.args || [])) && ['error', 'warning'].includes(e.params.type)).map(e => 'console.' + e.params.type + ': ' + (e.params.args[0] && e.params.args[0].value || '').toString().slice(0, 100)));
  if (fouten.length) console.log('   FOUTEN op ' + pad + ': ' + JSON.stringify(fouten.slice(0, 5)));
  const shifts = m.shifts; const cls = shifts.reduce((a, s) => a + s.v, 0);
  const perBron = {}; for (const s of shifts) for (const b of s.b.slice(0, 1)) perBron[b] = (perBron[b] || 0) + s.v;
  const top = Object.entries(perBron).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${v.toFixed(3)}`);
  const lang = m.long.filter(x => x > 50).reduce((a, x) => a + (x - 50), 0);
  uit[pad] = { geladen, fcp: m.fcp, lcp: m.lcp, cls: +cls.toFixed(4), shifts: shifts.filter(s => s.v >= 0.005), topBronnen: top, verzoeken: n, kb: Math.round(totaal / 1024), perType: Object.fromEntries(Object.entries(types).map(([k, v]) => [k, { n: v.n, kb: Math.round(v.bytes / 1024) }])), grootste: groot, beelden: [...req.values()].filter(r => r.type === 'Image').map(r => Math.round((r.bytes||0)/1024) + 'k [' + r.ini + ' ' + r.pri + ' +' + (Math.round((r.ts - [...req.values()][0].ts) * 1000)) + 'ms ' + (r.stack || '') + '] ' + decodeURIComponent(r.url).replace(/^https?:\/\/(www\.)?/, '').replace(/rootedgoods\.eu\//, '').slice(0, 130)), fonts: [...req.values()].filter(r => r.type === 'Font').map(r => Math.round((r.bytes||0)/1024) + 'k ' + decodeURIComponent(r.url).replace(/^https?:\/\/(www\.)?/, '').slice(0, 110)), tbt: lang, langeTaken: m.long.length, dom: m.dom, imgs: m.imgs, imgZonderWH: m.imgZonderWH, imgLazy: m.imgLazy, cssBlokkerend: m.cssBlokkerend, scriptsHead: m.scriptsHead, cookie: m.cookie, hoogte: m.hoogte, titel: m.titel };
  console.log(`${pad.padEnd(28)} FCP ${String(m.fcp).padStart(5)} LCP ${String(m.lcp && m.lcp.t).padStart(5)} (${m.lcp && m.lcp.el}) CLS ${cls.toFixed(3)} | ${n} verz ${Math.round(totaal / 1024)} kB | img ${m.imgs} (zonder w/h ${m.imgZonderWH}, lazy ${m.imgLazy}) | TBT~${lang} ms | dom ${m.dom}`);
}
fs.writeFileSync(path.join(HIER, `site-${naam}.json`), JSON.stringify({ instelling: { W, H, CPU, net: process.env.NET || 'traag' }, uit }, null, 1));
await send('Browser.close'); chrome.kill(); process.exit(0);
