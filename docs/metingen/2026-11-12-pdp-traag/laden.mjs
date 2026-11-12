// Meet het laden van een pagina in headless Chromium: waterval, LCP, CLS, lange taken, en wanneer de configurator er staat.
// Gebruik: URL=... PROFIEL=desktop|mobiel [DREL=lan|4g] [NAAM=x] node laden.mjs        Schrijft <naam>-<profiel>.json
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url));
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL_ = process.env.URL; if (!URL_) { console.error('AFGEBROKEN: URL ontbreekt'); process.exit(1); }
const PROFIEL = process.env.PROFIEL || 'desktop'; const NAAM = process.env.NAAM || 'meting'; const DREL = process.env.DREL || 'lan';
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-ld-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network']) await send(d + '.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
if (PROFIEL === 'mobiel') {
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sid);
  await send('Emulation.setUserAgentOverride', { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' }, sid);
  if (DREL === '4g') { await send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 1.6 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8 }, sid); await send('Emulation.setCPUThrottlingRate', { rate: 4 }, sid); }
} else await send('Emulation.setDeviceMetricsOverride', { width: +(process.env.W || 1440), height: 900, deviceScaleFactor: 1, mobile: false }, sid);
await send('Network.setBlockedURLs', { urls: ['*clarity.ms*', '*apollo.io*', ...(process.env.BLOCK ? process.env.BLOCK.split(',') : [])] }, sid);
// observers vóór de pagina draait
await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__m={lcp:null,cls:0,lt:[],cfg:null,pad:null,sh:[]};
new PerformanceObserver(l=>{for(const e of l.getEntries())window.__m.lcp={t:Math.round(e.startTime),el:(e.element&&(e.element.tagName+'.'+(e.element.className||'').toString().slice(0,60)))||null,url:e.url||null}}).observe({type:'largest-contentful-paint',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput){window.__m.cls+=e.value;window.__m.sh.push({t:Math.round(e.startTime),v:Math.round(e.value*1000)/1000,src:(e.sources||[]).slice(0,4).map(x=>({el:x.node?(x.node.tagName+'.'+(x.node.className||'').toString().slice(0,50)):null,van:[x.previousRect.x,x.previousRect.y,x.previousRect.width,x.previousRect.height].map(Math.round),naar:[x.currentRect.x,x.currentRect.y,x.currentRect.width,x.currentRect.height].map(Math.round)}))})}}).observe({type:'layout-shift',buffered:true});
new PerformanceObserver(l=>{for(const e of l.getEntries())window.__m.lt.push([Math.round(e.startTime),Math.round(e.duration)])}).observe({type:'longtask',buffered:true});
const iv=setInterval(()=>{const s=document.querySelector('.product-detail-configurator, .configurator, [class*=configurator], .product-detail-buy');if(s&&!window.__m.cfg)window.__m.cfg=Math.round(performance.now())},50);` }, sid);
if (process.env.EXTRA) await send('Page.addScriptToEvaluateOnNewDocument', { source: fs.readFileSync(path.resolve(process.env.EXTRA), 'utf8') }, sid);
if (process.env.JSFILE || process.env.CSSFILE) {
  const js = process.env.JSFILE ? fs.readFileSync(path.resolve(process.env.JSFILE)) : null; const cssb = process.env.CSSFILE ? fs.readFileSync(path.resolve(process.env.CSSFILE)) : null;
  await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.js*' }, { urlPattern: '*rootedgoods.min.css*' }] }, sid);
  setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; const isCss = e.params.request.url.includes('.min.css'); const body = isCss ? cssb : js;
    if (!body) { await send('Fetch.continueRequest', { requestId: e.params.requestId }, sid); continue; }
    await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: isCss ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' }], body: body.toString('base64') }, sid); } }, 20); }
const t0 = Date.now(); await send('Page.navigate', { url: URL_ }, sid);
const stop = Date.now() + 90000; while (Date.now() < stop) { await sleep(300); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
if (!events.some(e => e.method === 'Page.loadEventFired')) { console.error('AFGEBROKEN: load-event kwam niet binnen 90 s'); chrome.kill(); process.exit(2); }
await sleep(4000);
const res = JSON.parse((await send('Runtime.evaluate', { expression: `JSON.stringify({m:window.__m,nav:performance.getEntriesByType('navigation')[0].toJSON(),paint:performance.getEntriesByType('paint').map(p=>[p.name,Math.round(p.startTime)]),res:performance.getEntriesByType('resource').map(r=>({n:r.name.slice(0,150),t:r.initiatorType,s:Math.round(r.startTime),d:Math.round(r.duration),ttfb:Math.round(r.responseStart-r.startTime),b:r.transferSize,dec:r.decodedBodySize})),dom:document.querySelectorAll('*').length,title:document.title,extra:window.__extra||null})`, returnByValue: true }, sid)).result.value);
const nav = res.nav;
const top = [...res.res].sort((a, b) => (b.s + b.d) - (a.s + a.d)).slice(0, 12);
const grootste = [...res.res].sort((a, b) => b.b - a.b).slice(0, 10);
const totaal = res.res.reduce((s, r) => s + (r.b || 0), 0);
const o = { url: URL_, profiel: PROFIEL, drel: DREL, tijdstip: new Date().toISOString(), titel: res.title,
  ttfb_ms: Math.round(nav.responseStart), html_klaar_ms: Math.round(nav.responseEnd), dcl_ms: Math.round(nav.domContentLoadedEventEnd), load_ms: Math.round(nav.loadEventEnd),
  fcp_ms: (res.paint.find(p => p[0] === 'first-contentful-paint') || [])[1], lcp: res.m.lcp, cls: Math.round(res.m.cls * 1000) / 1000,
  lange_taken: res.m.lt.length, tbt_ms: res.m.lt.reduce((s, [, d]) => s + Math.max(0, d - 50), 0), langste_taak_ms: Math.max(0, ...res.m.lt.map(x => x[1])),
  configurator_in_dom_ms: res.m.cfg, requests: res.res.length, overdracht_kb: Math.round(totaal / 1024), dom_nodes: res.dom,
  laatste_request_klaar_ms: Math.max(...res.res.map(r => r.s + r.d)), laatste_requests: top, grootste_requests: grootste, lange_taken_lijst: res.m.lt.slice(0, 30), verschuivingen: res.m.sh, extra: res.extra };
fs.writeFileSync(path.join(HIER, `${NAAM}-${PROFIEL}${process.env.W ? process.env.W : ''}${DREL === '4g' ? '-4g' : ''}.json`), JSON.stringify(o, null, 1));
const { data } = await send('Page.captureScreenshot', { format: 'png' }, sid); fs.writeFileSync(path.join(HIER, `${NAAM}-${PROFIEL}${process.env.W ? process.env.W : ''}${DREL === '4g' ? '-4g' : ''}.png`), Buffer.from(data, 'base64'));
console.log(JSON.stringify({ ...o, laatste_requests: undefined, grootste_requests: undefined, lange_taken_lijst: undefined, verschuivingen: undefined }));
await send('Browser.close'); chrome.kill(); process.exit(0);
