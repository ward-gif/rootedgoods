// Meet welke !important in rootedgoods.css echt iets doen. Lokale CSS (gemarkeerd) op de live pagina's, headless Chromium via CDP.
// Gebruik: node meet.mjs [pad ...]     env: VP=mobiel|tablet|desktop (komma-lijst), MENU=1 (mobiel: eerst menu openen)
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { markeer } from './markeer.mjs';
const HIER = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(HIER, '../../..');
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const BASIS = 'https://rootedgoods.eu';
const PAGINAS = process.argv.length > 2 ? process.argv.slice(2) : ['/', '/alle-producten/', '/huis-keuken/', '/Borrelplank/A1352-Kerst1', '/eindejaarsgeschenken', '/thema-s/', '/offerte', '/over-ons', '/merken/', '/contact', '/search?search=kerstbal'];
const VPS = { mobiel: [390, 844, true], tablet: [820, 1180, true], desktop: [1440, 900, false] };
const gekozen = (process.env.VP || 'mobiel,tablet,desktop').split(',');
const cssBron = fs.readFileSync(process.env.CSSFILE ? path.resolve(process.env.CSSFILE) : path.join(REPO, 'rootedgoods.css'), 'utf8');
const { tekst: cssGemarkeerd, aantal } = markeer(cssBron);
console.log(`CSS: ${cssBron.length} bytes, ${aantal} blokken gemarkeerd`);
const jsLok = fs.readFileSync(path.join(REPO, 'rootedgoods.js'));
const VALIDEER = process.env.MODE === 'valideer';
const analyse = fs.readFileSync(path.join(HIER, VALIDEER ? 'validatie.js' : 'pagina.js'), 'utf8');
const REGELS = VALIDEER ? JSON.parse(fs.readFileSync(path.join(HIER, process.env.REGELS || 'gelijk-regels.json'), 'utf8')) : {};
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-imp-')), '--lang=nl-NL', 'about:blank']);
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
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }, { urlPattern: '*rootedgoods.min.js*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) { if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; const isCss = e.params.request.url.includes('.min.css'); await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: isCss ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' }], body: Buffer.from(isCss ? cssBron : jsLok).toString('base64') }, sid); } } }, 20);
const resultaat = [];
for (const vp of gekozen) {
  const [W, H, mobile] = VPS[vp];
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile }, sid);
  await send('Emulation.setTouchEmulationEnabled', { enabled: mobile, maxTouchPoints: 5 }, sid);
  for (const pad of PAGINAS) {
    events = [];
    await send('Page.navigate', { url: BASIS + pad }, sid);
    const stop = Date.now() + 15000; let geladen = false;
    while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) { geladen = true; break; } }
    await sleep(4000);
    let menu = null;
    if (process.env.MENU && vp !== 'desktop') {
      menu = (await send('Runtime.evaluate', { expression: `(() => { const b = document.querySelector('.nav-main-toggle-btn, .menu-button button'); if (!b) return 'geen-knop'; b.click(); return 'geklikt'; })()`, returnByValue: true }, sid)).result.value;
      await sleep(1500);
    }
    if (process.env.EXPR) { console.log(JSON.stringify((await send('Runtime.evaluate', { expression: process.env.EXPR, returnByValue: true }, sid)).result.value)); if (process.env.NUUR) continue; }
    const r = await send('Runtime.evaluate', { expression: `(${analyse})(${JSON.stringify(cssGemarkeerd)}, ${JSON.stringify(VALIDEER ? REGELS : {})})`, awaitPromise: true, returnByValue: true, timeout: 120000 }, sid);
    const v = r.result.value;
    if (!v || v.fout) { console.log(`${vp} ${pad}: FOUT ${JSON.stringify(v || r.exceptionDetails || r).slice(0, 200)}`); continue; }
    if (VALIDEER) { console.log(`${vp.padEnd(8)} ${pad.padEnd(28)} elementen=${v.elementen} regels=${v.regelsAangepast} longhands=${v.longhandsAangepast} VERSCHIL op ${v.nVerschil} elementen`); resultaat.push({ vp, pad, menu: process.env.MENU ? menu : null, ...v }); continue; }
    const tel = {}; for (const m of v.metingen) tel[m.st] = (tel[m.st] || 0) + 1;
    console.log(`${vp.padEnd(8)} ${pad.padEnd(28)} geladen=${geladen} menu=${menu} regels=${v.regels} metingen=${v.metingen.length} ${JSON.stringify(tel)}`);
    resultaat.push({ vp, pad, menu: process.env.MENU ? menu : null, regels: v.regels, metingen: v.metingen });
  }
}
if (process.env.NUUR) { await send('Browser.close'); chrome.kill(); process.exit(0); }
const naam = process.env.UIT || (VALIDEER ? 'validatie.json' : process.env.MENU ? 'meting-menu.json' : 'meting.json');
fs.writeFileSync(path.join(HIER, naam), JSON.stringify({ datum: new Date().toISOString(), cssBytes: cssBron.length, resultaat }));
console.log('weggeschreven:', naam);
await send('Browser.close'); chrome.kill(); process.exit(0);
