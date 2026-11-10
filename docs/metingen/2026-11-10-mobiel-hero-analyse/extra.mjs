// Aanvullende metingen in de replica, 375 x 667: wat er tussen header en hero
// zit, hoe breed de feitenregel in één regel wordt per lettergrootte, en hoe
// hoog de woordmerken in de klantlogo's werkelijk zijn (pixelanalyse van de
// logo-PNG's op de getoonde hoogte). Uitvoer: extra.json.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url));
const S = '/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL = 'http://127.0.0.1:8777/replica-http.html';
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + S + '/werk/profiel-1110b', '--window-size=430,932', '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let buf = ''; chrome.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const waitEvent = (name, sid) => new Promise((res, rej) => { const t0 = Date.now(); const iv = setInterval(() => { const k = events.findIndex(m => m.method === name && m.sessionId === sid); if (k >= 0) { clearInterval(iv); res(events.splice(k, 1)[0]); } else if (Date.now() - t0 > 60000) { clearInterval(iv); rej(new Error('timeout')); } }, 50); });
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sid); await send('Runtime.enable', {}, sid); await send('Network.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*rootedgoods.eu*', '*jsdelivr*', '*googletagmanager*', '*amazonaws*', '*clarity.ms*', '*gstatic*', '*googleapis*'] }, sid);
const eval_ = async (expr) => { const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sid); if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails).slice(0, 800)); return result.value; };
await send('Emulation.setDeviceMetricsOverride', { width: 375, height: 667, deviceScaleFactor: 2, mobile: true }, sid);
await send('Page.navigate', { url: URL }, sid); await waitEvent('Page.loadEventFired', sid);
await eval_('document.fonts.ready.then(()=>true)');
const uit = await eval_(`(async () => {
  const q = s => document.querySelector(s);
  // 1. tussen header en hero
  const hero = q('.rg-page-hero--band'); const header = q('.header-main');
  const tussen = []; let el = hero; const stop = header;
  // loop omhoog en per niveau de vorige broers tot aan de header
  const pad = []; for (let e = hero; e && e !== document.body; e = e.parentElement) pad.push({ tag: e.tagName, cls: [...e.classList].join('.'), y: +e.getBoundingClientRect().top.toFixed(1), pt: getComputedStyle(e).paddingTop, mt: getComputedStyle(e).marginTop });
  // 2. breedte van de feitenregel in één regel, per lettergrootte
  await document.fonts.load('400 16px Montserrat'); await document.fonts.load('700 16px Montserrat');
  const c = document.createElement('canvas').getContext('2d');
  const meet = (delen, px) => delen.reduce((s, [t, w]) => { c.font = w + ' ' + px + 'px Montserrat'; return s + c.measureText(t).width; }, 0);
  const vormen = {
    'punt': [['Vanaf € 25', 700], [' per persoon', 400], [' · ', 400], ['vanaf 10', 700], [' stuks', 400]],
    'komma': [['Vanaf € 25', 700], [' per persoon, ', 400], ['vanaf 10', 700], [' stuks', 400]],
    'en': [['Vanaf € 25', 700], [' per persoon en ', 400], ['vanaf 10', 700], [' stuks', 400]],
    'feit1': [['Vanaf € 25', 700], [' per persoon', 400]],
    'feit2': [['vanaf 10', 700], [' stuks', 400]],
    'feit3': [['Stel je eigen pakket', 700], [' samen', 400]],
  };
  const breedtes = {};
  for (const px of [17.6, 16.8, 16, 15.2, 14.4]) { breedtes[px] = {}; for (const k in vormen) breedtes[px][k] = +meet(vormen[k], px).toFixed(1); }
  // tegelnamen op kandidaat-maten (sentence case, zonder tracking), breedte per naam
  const namen = [...document.querySelectorAll('.rg-band__item .product-name')].map(n => n.textContent.trim());
  const naamBreedte = {};
  for (const px of [12.8, 12, 11.2]) { naamBreedte[px] = namen.map(n => { c.font = '500 ' + px + 'px Montserrat'; return [n, +c.measureText(n).width.toFixed(0)]; }); }
  // 3. logo's: inkt-rijen op de getoonde hoogte
  const logos = [...document.querySelectorAll('.rg-page-hero__logos img')];
  const analyse = [];
  for (const img of logos) {
    if (getComputedStyle(img).display === 'none') continue;
    const h = img.getBoundingClientRect().height, w = img.getBoundingClientRect().width;
    if (!h) continue;
    const cv = document.createElement('canvas'); cv.width = Math.round(w * 2); cv.height = Math.round(h * 2); // 2x zoals het scherm
    const cx = cv.getContext('2d'); cx.fillStyle = '#f7f5f2'; cx.fillRect(0, 0, cv.width, cv.height); cx.globalAlpha = 0.65; cx.filter = 'grayscale(1)'; cx.drawImage(img, 0, 0, cv.width, cv.height);
    const d = cx.getImageData(0, 0, cv.width, cv.height).data;
    const rij = []; let minL = 1;
    for (let y = 0; y < cv.height; y++) { let ink = 0; for (let x = 0; x < cv.width; x++) { const i = (y * cv.width + x) * 4; const l = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; if (l < 0.75) ink++; if (l < minL) minL = l; } rij.push(ink); }
    // blokken van rijen met inkt
    const blokken = []; let start = null;
    for (let y = 0; y <= rij.length; y++) { const heeft = y < rij.length && rij[y] > 0; if (heeft && start === null) start = y; if (!heeft && start !== null) { blokken.push({ vanPx: +(start / 2).toFixed(1), totPx: +(y / 2).toFixed(1), hoogteCssPx: +((y - start) / 2).toFixed(1) }); start = null; } }
    // donkerste grijswaarde als "tekstkleur" tegen crème
    const L = l => l <= 0.03928 ? l / 12.92 : Math.pow((l + 0.055) / 1.055, 2.4);
    const lc = L(minL), lb = L(247 / 255 * 0.2126 + 245 / 255 * 0.7152 + 242 / 255 * 0.0722);
    analyse.push({ alt: img.alt, getoond: w.toFixed(1) + 'x' + h.toFixed(1), blokken, donkersteContrast: +((Math.max(lc, lb) + 0.05) / (Math.min(lc, lb) + 0.05)).toFixed(2) });
  }
  return { pad, breedtes, naamBreedte, logos: analyse, headerOnder: header.getBoundingClientRect().bottom, heroTop: hero.getBoundingClientRect().top };
})()`);
fs.writeFileSync(path.join(HIER, 'extra.json'), JSON.stringify(uit, null, 1));
console.log(JSON.stringify(uit, null, 1));
await send('Browser.close'); chrome.kill(); process.exit(0);
