// Meet !important in toestandsregels (:hover/:focus/:active) met toestand geforceerd via CDP.
// MODE=meet (standaard): per longhand nodig/gelijk.   MODE=ab: CSSB=kandidaat.css, vergelijkt berekende stijl A (huidig) vs B per element in zijn toestand.
// Gebruik: node toestand.mjs [pad ...]   env: VP=mobiel,desktop
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { markeer } from './markeer.mjs';
const HIER = path.dirname(fileURLToPath(import.meta.url)); const REPO = path.resolve(HIER, '../../..');
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const MODE = process.env.MODE || 'meet';
const PAGINAS = process.argv.length > 2 ? process.argv.slice(2) : ['/', '/alle-producten/', '/huis-keuken/', '/Borrelplank/A1352-Kerst1', '/eindejaarsgeschenken', '/thema-s/', '/offerte', '/over-ons', '/merken/', '/contact', '/services/', '/full-service-ontzorging', '/wishlist'];
const VPS = { mobiel: [390, 844, true], desktop: [1440, 900, false] }; const vps = (process.env.VP || 'desktop,mobiel').split(',');
const cssBron = fs.readFileSync(path.join(REPO, 'rootedgoods.css'), 'utf8'); const { tekst: cssGem } = markeer(cssBron);
const cssB = MODE === 'ab' ? markeer(fs.readFileSync(path.resolve(process.env.CSSB), 'utf8')).tekst : null;
const jsLok = fs.readFileSync(path.join(REPO, 'rootedgoods.js')); const bibliotheek = fs.readFileSync(path.join(HIER, 'toestand.js'), 'utf8');
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-toe-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network', 'DOM']) await send(d + '.enable', {}, sid);
await send('CSS.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*'] }, sid);
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }, { urlPattern: '*rootedgoods.min.js*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) { if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; const isCss = e.params.request.url.includes('.min.css'); await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: isCss ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' }], body: Buffer.from(isCss ? cssBron : jsLok).toString('base64') }, sid); } } }, 20);
const ev = async (expression, awaitPromise = false) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise, timeout: 120000 }, sid); if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails).slice(0, 300)); return r.result.value; };
const uit = [];
for (const vp of vps) {
  const [W, H, mobile] = VPS[vp]; await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile }, sid);
  for (const pad of PAGINAS) {
    events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
    const stop = Date.now() + 15000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
    await sleep(4000);
    for (let t = 0; t < 20 && !(await ev("!!document.querySelector('link[href*=\"rootedgoods.min.css\"]')")); t++) await sleep(500);
    await ev(bibliotheek); const tag = await ev(`window.__rg.tag(${JSON.stringify(cssGem)})`); await sleep(300);
    const marks = await ev('window.__rg.marks()');
    const doc = await send('DOM.getDocument', { depth: 0 }, sid); const { nodeIds } = await send('DOM.querySelectorAll', { nodeId: doc.root.nodeId, selector: '[data-rg-t]' }, sid);
    let n = 0;
    for (let k = 0; k < nodeIds.length; k++) {
      const states = [...new Set(marks[k].split(' ').flatMap(m => m.split(':')[2].split('+')))].map(s => s === 'focus-visible' ? 'focus-visible' : s);
      await send('CSS.forcePseudoState', { nodeId: nodeIds[k], forcedPseudoClasses: states }, sid);
      if (MODE === 'meet') { const r = await ev(`window.__rg.meet(${k}, ${JSON.stringify(marks[k])})`); for (const m of r) uit.push({ vp, pad, ...m }); }
      else { const r = await ev(`window.__rg.ab(${k}, ${JSON.stringify(cssGem)}, ${JSON.stringify(cssB)})`); n += r.length ? 1 : 0; if (r.length) uit.push({ vp, pad, mark: marks[k], d: r.slice(0, 8) }); }
      await send('CSS.forcePseudoState', { nodeId: nodeIds[k], forcedPseudoClasses: [] }, sid);
    }
    const tel = tag.reduce((a, x) => (a[x.st] = (a[x.st] || 0) + 1, a), {});
    console.log(`${vp.padEnd(8)} ${pad.padEnd(28)} elementen=${nodeIds.length} ${JSON.stringify(tel)}${MODE === 'ab' ? ' ELEMENTEN MET VERSCHIL: ' + n : ''}`);
  }
}
fs.writeFileSync(path.join(HIER, process.env.UIT || (MODE === 'ab' ? 'toestand-ab.json' : 'toestand-meting.json')), JSON.stringify(uit));
console.log('klaar', uit.length); await send('Browser.close'); chrome.kill(); process.exit(0);
