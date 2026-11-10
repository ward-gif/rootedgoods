// Het laden van een themapagina, frame voor frame, op de LIVE site (alleen lezen).
// Headless Chromium via CDP, schone profielmap per run (dus eerste bezoek, cookiebalk erbij),
// netwerk en CPU afgeknepen om het flikkeren zichtbaar te maken. Legt vast:
//  - schermafdrukken om de 120 ms tot 6 s na de navigatie
//  - alle layout-shifts (waarde, tijdstip, welk element) en de tijd waarop .rg-band-pagina verschijnt
// Gebruik: node meet-laden.mjs <variant> [css-bestand]   (css wordt zo vroeg mogelijk ingevoegd, ná de live CSS)
//   env: URL (standaard /eindejaarsgeschenken), VP=390x844, NET=snel|traag, CPU=4
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url));
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL = process.env.URL || 'https://rootedgoods.eu/eindejaarsgeschenken';
const [variant = 'voor', cssPad] = process.argv.slice(2);
const extraCss = cssPad ? fs.readFileSync(cssPad, 'utf8') : '';
const [W, H] = (process.env.VP || '390x844').split('x').map(Number);
const NET = process.env.NET || 'traag', CPU = Number(process.env.CPU || 4);
const NETPROF = NET === 'snel' ? { latency: 40, down: 10 * 1024 * 1024 / 8, up: 5 * 1024 * 1024 / 8 } : { latency: 150, down: 1.6 * 1024 * 1024 / 8, up: 750 * 1024 / 8 }; // 'traag' ~ Slow 4G / Fast 3G
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'rg-laden-'));
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + prof, `--window-size=${W},${H}`, '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sid); await send('Runtime.enable', {}, sid); await send('Network.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*', ...(process.env.BLOCKFONT ? ['*.woff2', '*.woff', '*fonts.googleapis*', '*fonts.gstatic*'] : []), ...(process.env.BLOCKPAT ? process.env.BLOCKPAT.split(',') : [])] }, sid);
await send('Network.emulateNetworkConditions', { offline: false, latency: NETPROF.latency, downloadThroughput: NETPROF.down, uploadThroughput: NETPROF.up }, sid);
await send('Emulation.setCPUThrottlingRate', { rate: CPU }, sid);

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
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: true }, sid);

// Vóór elk document: meten, en onze extra CSS zodra <head> bestaat.
const PRELOAD = process.env.PRELOAD ? process.env.PRELOAD.split(',') : [];
const VROEG = `
window.__rg = { shifts: [], t: {}, marks: [] };
new PerformanceObserver(l => { for (const e of l.getEntries()) window.__rg.shifts.push({ t: Math.round(e.startTime), v: +e.value.toFixed(4), n: e.hadRecentInput, bronnen: (e.sources||[]).map(s => { const n = s.node; return n ? (n.tagName + (n.className && typeof n.className==='string' ? '.' + n.className.trim().split(/\\s+/).slice(0,2).join('.') : '')) : '?'; }) }); }).observe({ type: 'layout-shift', buffered: true });
new PerformanceObserver(l => { for (const e of l.getEntries()) window.__rg.lcp = { t: Math.round(e.startTime), el: e.element ? e.element.tagName + '.' + String(e.element.className).slice(0,40) : '?', url: e.url && e.url.slice(-60) }; }).observe({ type: 'largest-contentful-paint', buffered: true });
const t0 = performance.now();
const kijk = () => { const h = document.documentElement; const r = window.__rg;
  if (h.classList.contains('rg-band-pagina') && r.t.band == null) r.t.band = Math.round(performance.now());
  if (document.querySelector('.rg-band__kloon') && r.t.klonen == null) r.t.klonen = Math.round(performance.now());
  if (document.querySelector('.rg-page-hero__cijfers') && r.t.cijfers == null) r.t.cijfers = Math.round(performance.now());
  if (document.querySelector('.rg-page-hero--band') && r.t.hero == null) r.t.hero = Math.round(performance.now());
  if (document.querySelector('[data-product-slider]') && r.t.sliderRuw == null) r.t.sliderRuw = Math.round(performance.now());
  if (document.querySelector('.tns-slider, .tns-outer') && r.t.tiny == null) r.t.tiny = Math.round(performance.now()); };
new MutationObserver(kijk).observe(document, { childList: true, subtree: true, attributes: true });
document.addEventListener('DOMContentLoaded', () => { window.__rg.t.dcl = Math.round(performance.now()); kijk(); });
window.addEventListener('load', () => { window.__rg.t.load = Math.round(performance.now()); kijk(); });
${PRELOAD.length ? `const pre = ${JSON.stringify(PRELOAD)}; const zetPre = () => { if (document.head && !document.getElementById('rg-pre0')) { pre.forEach((u, i) => { const l = document.createElement('link'); l.id = 'rg-pre' + i; l.rel = 'preload'; l.as = 'font'; l.type = 'font/woff2'; l.crossOrigin = 'anonymous'; l.href = u; document.head.appendChild(l); }); } };\nnew MutationObserver(zetPre).observe(document, { childList: true, subtree: true });` : ''}
${extraCss ? `const css = ${JSON.stringify(extraCss)}; const zet = () => { if (document.head && !document.getElementById('rg-proto')) { const s = document.createElement('style'); s.id = 'rg-proto'; s.textContent = css; document.head.appendChild(s); } };
new MutationObserver(zet).observe(document, { childList: true, subtree: true }); document.addEventListener('DOMContentLoaded', zet);` : ''}
`;
await send('Page.addScriptToEvaluateOnNewDocument', { source: VROEG }, sid);

const shots = [];
const t0 = Date.now();
await send('Page.navigate', { url: URL }, sid);
const stop = t0 + Number(process.env.DUUR || 6000);
let k = 0;
while (Date.now() < stop) {
  const t = Date.now() - t0;
  if (process.env.GEENBEELD) { await sleep(500); k++; continue; }
  try {
    const s = await send('Page.captureScreenshot', { format: 'jpeg', quality: 55, clip: { x: 0, y: 0, width: W, height: Math.min(H, 760), scale: 0.5 } }, sid);
    const f = `${variant}-${W}-f${String(k).padStart(2, '0')}-${t}ms.jpg`;
    fs.writeFileSync(path.join(HIER, f), Buffer.from(s.data, 'base64')); shots.push({ t, f });
  } catch (e) { shots.push({ t, fout: String(e).slice(0, 80) }); }
  k++; await sleep(60);
}
const rg = await send('Runtime.evaluate', { expression: 'JSON.stringify(window.__rg)', returnByValue: true }, sid);
const uit = JSON.parse(rg.result.value);
uit.schermafdrukken = shots; uit.instelling = { URL, W, H, NET, CPU, variant };
fs.writeFileSync(path.join(HIER, `${variant}-${W}.json`), JSON.stringify(uit, null, 1));
const cls = uit.shifts.reduce((a, s) => a + s.v, 0); const clsGroot = uit.shifts.filter(s => s.v >= 0.01).map(s => s.v + '@' + s.t + 'ms').join(' ');
console.log(`${variant} ${W}x${H} net=${NET} cpu=${CPU}: CLS (alle shifts, ook die Chrome als 'na invoer' markeert) ${cls.toFixed(4)} over ${uit.shifts.length} shifts, groter dan 0,01: [${clsGroot}] | hero ${uit.t.hero} ms, sliderRuw ${uit.t.sliderRuw}, band ${uit.t.band}, klonen ${uit.t.klonen}, cijfers ${uit.t.cijfers}, dcl ${uit.t.dcl}, load ${uit.t.load} | LCP ${uit.lcp && uit.lcp.t} ms ${uit.lcp && uit.lcp.el}`);
for (const s of uit.shifts) console.log(`   shift ${s.t} ms waarde ${s.v} ${s.bronnen.join(', ')}`);
await send('Browser.close'); chrome.kill(); process.exit(0);
