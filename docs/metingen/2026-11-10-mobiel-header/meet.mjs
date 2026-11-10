// Mobiele header op de LIVE site (alleen lezen): logo gecentreerd?, wishlist-sprong,
// en het openen van de zoekbalk frame voor frame. Headless Chromium via CDP.
// Gebruik: node meet.mjs <variant> [css-bestand]   (css wordt ná de live CSS ingevoegd)
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url));
const S = '/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL = process.env.URL || 'https://rootedgoods.eu/';
const [variant = 'voor', cssPad] = process.argv.slice(2);
const extraCss = cssPad ? fs.readFileSync(cssPad, 'utf8') : '';
const VIEWPORTS = (process.env.VP || '360x740,390x844,430x932').split(',').map(v => v.split('x').map(Number));
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + S + '/werk/profiel-header', '--window-size=430,932', '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let buf = ''; chrome.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const waitEvent = (name, sid) => new Promise((res, rej) => { const t0 = Date.now(); const iv = setInterval(() => { const k = events.findIndex(m => m.method === name && m.sessionId === sid); if (k >= 0) { clearInterval(iv); res(events.splice(k, 1)[0]); } else if (Date.now() - t0 > 60000) { clearInterval(iv); rej(new Error('timeout ' + name)); } }, 50); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sid); await send('Runtime.enable', {}, sid); await send('Network.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*'] }, sid);
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sid);
const eval_ = async (expr) => { const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sid); if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails).slice(0, 800)); return result.value; };

const MEET = `(() => {
  const q = s => document.querySelector(s), vw = innerWidth;
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +b.y.toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), r: +b.right.toFixed(1), midden: +(b.x + b.width / 2).toFixed(1) }; };
  const zicht = els => [...els].find(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && getComputedStyle(e).visibility !== 'hidden'; }) || null;
  const logo = q('.header-logo-main-link img') || q('.header-logo img');
  const toggle = zicht(document.querySelectorAll('.search-toggle-btn'));
  const wl = q('.header-actions-col .header-wishlist'), cart = q('.header-cart-btn'), ham = q('.rg-header-hamburger-slot') || q('.menu-button');
  const act = q('.header-actions-col'), col = q('.header-logo-col'), row = q('.header-row'), coll = q('#searchCollapse'), main = q('.header-main');
  const wlC = wl && getComputedStyle(wl).display;
  const ic = el => el ? r(el.querySelector('svg')) : null;
  const flo = q('.rg-wishlist-float');
  return { vw, rij: r(row), hamburger: r(ham), logoKolom: r(col), logo: r(logo), acties: r(act), zoekknop: r(toggle), wishlist: wl && wlC !== 'none' ? r(wl) : null, wishlistDisplay: wlC, mandje: r(cart), collapse: r(coll), collapseClass: coll && coll.className, headerMain: r(main),
    ikoon: { hamburger: ic(ham), zoek: ic(toggle), mandje: ic(cart), wishlist: wl && wlC !== 'none' ? ic(wl) : null }, float: flo ? { display: getComputedStyle(flo).display, rect: r(flo) } : null,
    actKinderen: act ? [...act.querySelectorAll(':scope > .row, :scope > .row > *')].map(e => ({ c: e.className.slice(0, 40), ...r(e), pad: getComputedStyle(e).padding, mar: getComputedStyle(e).margin })) : null,
    logoKeten: logo ? (() => { const o = []; let e = logo; while (e && e !== row) { const c = getComputedStyle(e); o.push({ t: e.tagName + '.' + String(e.className).slice(0, 30), w: +e.getBoundingClientRect().width.toFixed(1), cssW: c.width, minW: c.minWidth, maxW: c.maxWidth, flex: c.flex, disp: c.display }); e = e.parentElement; } return o; })() : null,
    logoAfwijking: logo ? +((logo.getBoundingClientRect().x + logo.getBoundingClientRect().width / 2) - vw / 2).toFixed(1) : null,
    zoekknopVanRechts: toggle ? +(vw - toggle.getBoundingClientRect().right).toFixed(1) : null,
    marges: { links: ham ? +ham.getBoundingClientRect().x.toFixed(1) : null, rechts: cart ? +(vw - cart.getBoundingClientRect().right).toFixed(1) : null } };
})()`;

const FRAMES = `new Promise(res => {
  const t = [], t0 = performance.now(); const q = s => document.querySelector(s);
  const toggle = [...document.querySelectorAll('.search-toggle-btn')].find(e => e.getBoundingClientRect().width > 0);
  const snap = () => { const g = el => el ? el.getBoundingClientRect() : null; const a = g(q('.header-actions-col')), l = g(q('.header-logo-main-link img') || q('.header-logo img')), c = g(q('#searchCollapse')), m = g(q('.header-main')), tg = g([...document.querySelectorAll('.search-toggle-btn')].find(e => e.getBoundingClientRect().width > 0)), inp = g(q('.header-search-input')), row = g(q('.header-row'));
    t.push({ ms: Math.round(performance.now() - t0), main: m && +m.height.toFixed(1), rij: row && +row.height.toFixed(1), coll: c && +c.height.toFixed(1), actX: a && +a.x.toFixed(1), actY: a && +a.y.toFixed(1), logoX: l && +l.x.toFixed(1), logoY: l && +l.y.toFixed(1), toggleX: tg && +tg.x.toFixed(1), toggleY: tg && +tg.y.toFixed(1), inpY: inp && +inp.y.toFixed(1) }); };
  snap(); toggle.click();
  const lus = () => { snap(); if (performance.now() - t0 < 900) requestAnimationFrame(lus); else res(t); };
  requestAnimationFrame(lus);
})`;

const uit = {};
for (const [w, h] of VIEWPORTS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 2, mobile: true }, sid);
  events.length = 0;
  await send('Page.navigate', { url: URL }, sid);
  await waitEvent('Page.loadEventFired', sid);
  await eval_('document.fonts.ready.then(()=>true)');
  await sleep(2500);
  if (extraCss) await eval_(`(()=>{const s=document.createElement('style');s.id='rg-proto';s.textContent=${JSON.stringify(extraCss)};document.body.appendChild(s);return true})()`);
  await sleep(300);
  const k = w + 'x' + h; uit[k] = {};
  uit[k].leeg = await eval_(MEET);
  let shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: 150, scale: 1 } }, sid);
  fs.writeFileSync(path.join(HIER, `${variant}-${w}-leeg.png`), Buffer.from(shot.data, 'base64'));
  uit[k].framesLeeg = await eval_(FRAMES);
  await sleep(600);
  uit[k].dichtNaOpen = await eval_(`(()=>{const t=[...document.querySelectorAll('.search-toggle-btn')].find(e=>e.getBoundingClientRect().width>0);t.click();return new Promise(r=>setTimeout(()=>r(true),900))})()`);
  // wishlist gevuld simuleren: de badge krijgt tekst, het thema-icoon verschijnt via :has
  await eval_(`(()=>{const b=document.querySelector('.header-actions-col .header-wishlist-badge');if(b)b.textContent='3';return true})()`);
  await sleep(400);
  uit[k].gevuld = await eval_(MEET);
  shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: 150, scale: 1 } }, sid);
  fs.writeFileSync(path.join(HIER, `${variant}-${w}-gevuld.png`), Buffer.from(shot.data, 'base64'));
  uit[k].framesGevuld = await eval_(FRAMES);
  await sleep(900);
  shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: 260, scale: 1 } }, sid);
  fs.writeFileSync(path.join(HIER, `${variant}-${w}-open.png`), Buffer.from(shot.data, 'base64'));
  uit[k].framesSluit = await eval_(FRAMES);
  const L = uit[k].leeg, G = uit[k].gevuld;
  console.log(`${variant} ${k}: logo-afwijking leeg ${L.logoAfwijking}px, gevuld ${G.logoAfwijking}px | zoekknop van rechts leeg ${L.zoekknopVanRechts}, gevuld ${G.zoekknopVanRechts} | zoekknop x leeg ${L.zoekknop && L.zoekknop.x} gevuld ${G.zoekknop && G.zoekknop.x}`);
}
fs.writeFileSync(path.join(HIER, `${variant}.json`), JSON.stringify(uit, null, 1));
await send('Browser.close'); chrome.kill(); process.exit(0);
