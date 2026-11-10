// Meting van de kersthero op mobiel, in de replica (zie bouw-replica.py).
// Headless Chromium (Playwright-cache) via het DevTools-protocol, Node 24
// (ingebouwde WebSocket). Eén paginalading per variant en per viewport,
// cache uit, alle externe domeinen geblokkeerd: er gaat niets naar
// rootedgoods.eu.
//
// Gebruik: node meet.mjs <variant> [proto.css] [proto.js]
//   variant   naam van de meting, bv. "voor" of "na-A"
//   proto.css CSS die ná onze bundel wordt ingevoegd (prototype)
//   proto.js  JS die na load wordt uitgevoerd (prototype)
// Uitvoer in deze map: <variant>-<b>x<h>.png, <variant>-<b>x<h>-cookie.png,
// <variant>-<b>-lang.png en <variant>.json.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const S = '/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL = 'http://127.0.0.1:8777/replica-http.html';
const [variant = 'voor', protoCssPad, protoJsPad] = process.argv.slice(2);
const protoCss = protoCssPad ? fs.readFileSync(protoCssPad, 'utf8') : '';
const protoJs = protoJsPad ? fs.readFileSync(protoJsPad, 'utf8') : '';
const VIEWPORTS = process.env.VP ? process.env.VP.split(',').map(v => v.split('x').map(Number)) : [[360, 740], [375, 667], [390, 844], [430, 932]];
// VP="1280x800,1931x1112" node meet.mjs voor-desktop  (desktop ter controle; dpr 1)
const COOKIE = 244; // gemeten hoogte van de Shopware-cookiebalk op mobiel, 5 november

const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run',
  '--user-data-dir=' + S + '/werk/profiel-1110', '--window-size=430,932', '--lang=nl-NL', 'about:blank']);
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
await send('Network.setBlockedURLs', { urls: ['*rootedgoods.eu*', '*jsdelivr*', '*googletagmanager*', '*google-analytics*', '*amazonaws*', '*clarity.ms*', '*facebook*', '*cal.com*', '*gstatic*', '*googleapis*'] }, sid);
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sid);

const eval_ = async (expr) => { const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }, sid); if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails).slice(0, 800)); return result.value; };

// Band bevriezen op t=0 (eerste tegel op de inzet), zodat elke meting en
// elke schermafdruk dezelfde stand toont.
const BEVRIES = `.rg-band-pagina .rg-band .product-slider-container{animation:none !important;transform:translateX(calc(-1 * var(--rg-band-set))) !important}`;

const METING = `(() => {
  const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
  const vw = innerWidth, vh = innerHeight;
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +(b.y + scrollY).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), onder: +(b.bottom + scrollY).toFixed(1) }; };
  const cs = (el, p) => { if (!el) return null; const c = getComputedStyle(el); const o = {}; p.forEach(k => o[k] = c.getPropertyValue(k)); return o; };
  const regels = el => { if (!el) return null; const out = []; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n, cur = null, last = null; while (n = w.nextNode()) { if (!n.parentElement || getComputedStyle(n.parentElement).display === 'none') continue; const s = n.textContent; const re = /[^\\s\\u00a0]+(?:\\u00a0[^\\s\\u00a0]+)*/g; let m; while (m = re.exec(s)) { const rg = document.createRange(); rg.setStart(n, m.index); rg.setEnd(n, m.index + m[0].length); const rr = rg.getClientRects()[0]; if (!rr) continue; const top = Math.round(rr.top); if (last === null || Math.abs(top - last) > 4) { cur = []; out.push(cur); last = top; } cur.push(m[0].replace(/\\u00a0/g, ' ')); } } return out.map(x => x.join(' ')); };
  const rgb = s => { const m = s && s.match(/rgba?\\(([^)]+)\\)/); if (!m) return null; const p = m[1].split(',').map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
  const contrast = (fg, bg) => { if (!fg || !bg) return null; const a = lum(fg), b = lum(bg); return +((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)).toFixed(2); };
  const CREME = { r: 247, g: 245, b: 242 }, WIT = { r: 255, g: 255, b: 255 };
  const tekst = (el, bg) => { if (!el) return null; const c = getComputedStyle(el); return { tekst: el.textContent.replace(/\\s+/g, ' ').trim().slice(0, 80), rect: r(el), regels: regels(el), fontSize: c.fontSize, lineHeight: c.lineHeight, fontWeight: c.fontWeight, fontFamily: c.fontFamily.split(',')[0], color: c.color, letterSpacing: c.letterSpacing, textTransform: c.textTransform, contrast: contrast(rgb(c.color), bg) }; };

  const header = q('.header-main') || q('header'), topbar = q('.top-bar') || q('.rg-topbar') || q('.header-top');
  const hero = q('.rg-page-hero--band'), title = q('.rg-page-hero__title'), btn = q('.rg-page-hero__cta .btn'), noot = q('.rg-page-hero__noot'), logos = q('.rg-page-hero__logos');
  const feiten = q('.rg-page-hero__feiten') || q('.rg-page-hero__cijfers');
  const band = q('.rg-band'), track = q('.rg-band .product-slider-container');
  const strook = q('.rg-page-hero__strook'), strook2 = q('.rg-page-hero__strook--onder'), meer = q('.rg-band__meer'), volgende = q('.rg-block-title__title');
  const cookie = q('.cookie-permission-container');
  const items = qa('.rg-band .product-slider-item');
  const origineel = qa('.rg-band .rg-band__item');
  const tegel = it => { const box = it.querySelector('.product-box'), img = it.querySelector('.product-image-wrapper'), naam = it.querySelector('.product-name'), prijs = it.querySelector('.product-price'); const nc = naam ? getComputedStyle(naam) : null; return { rect: r(box), beeld: r(img), naam: naam ? { ...tekst(naam, WIT), afgekapt: naam.scrollHeight > naam.clientHeight + 1, clientH: naam.clientHeight, scrollH: naam.scrollHeight } : null, prijs: tekst(prijs, WIT), prijsWrapper: it.querySelector('.product-price-wrapper') && it.querySelector('.product-price-wrapper').textContent.replace(/\\s+/g, ' ').trim() }; };
  const zichtbaar = items.map(it => { const b = it.getBoundingClientRect(); const l = Math.max(0, b.left), rr = Math.min(vw, b.right); return rr > l ? { links: +b.left.toFixed(1), breedte: +b.width.toFixed(1), zichtbaar: +(rr - l).toFixed(1), kloon: it.classList.contains('rg-band__kloon') } : null; }).filter(Boolean);
  const btnC = btn ? getComputedStyle(btn) : null;
  const logoImgs = qa('.rg-page-hero__logos img').map(i => { const c = getComputedStyle(i); return { alt: i.alt, w: +i.getBoundingClientRect().width.toFixed(1), h: +i.getBoundingClientRect().height.toFixed(1), natuurlijk: i.naturalWidth + 'x' + i.naturalHeight, display: c.display, opacity: c.opacity, filter: c.filter }; });
  const gap = (a, b) => (a && b) ? +(b.y - a.onder).toFixed(1) : null;
  const R = { hero: r(hero), title: r(title), btn: r(btn), noot: r(noot), logos: r(logos), band: r(band), strook: r(strook), strook2: r(strook2), meer: r(meer), volgende: r(volgende) };
  const eersteTegel = origineel[0] ? r(origineel[0].querySelector('.product-box')) : null;
  const prijsRect = origineel[0] ? r(origineel[0].querySelector('.product-price')) : null;
  return {
    vw, vh, scrollW: document.scrollingElement.scrollWidth,
    header: { rect: r(header), topbar: r(topbar) },
    hero: { rect: R.hero, pad: cs(hero, ['padding-top', 'padding-bottom', 'padding-left']) },
    title: tekst(title, CREME),
    feiten: feiten ? tekst(feiten, CREME) : null,
    btn: btn ? { rect: R.btn, tekst: btn.textContent.trim(), fontSize: btnC.fontSize, padding: btnC.padding, bg: btnC.backgroundColor, color: btnC.color, contrast: contrast(rgb(btnC.color), rgb(btnC.backgroundColor)) } : null,
    noot: tekst(noot, CREME),
    logos: { rect: R.logos, imgs: logoImgs, gap: cs(logos, ['gap', 'margin-bottom']) },
    band: { rect: R.band, pad: cs(band, ['padding-top', 'padding-bottom']), tile: band && getComputedStyle(band).getPropertyValue('--rg-band-tile'), gapVar: band && getComputedStyle(band).getPropertyValue('--rg-band-gap'), n: items.length, originelen: origineel.length, zichtbaar, eersteTegel, prijsRect, tegels: origineel.slice(0, 9).map(tegel), animatie: track && getComputedStyle(track).animationName },
    strook: strook ? { ...tekst(strook, CREME), hidden: strook.hidden, display: getComputedStyle(strook).display, feiten: qa('.rg-page-hero__strook-feit').map(f => ({ tekst: f.textContent.replace(/\\s+/g, ' ').trim(), rect: r(f), display: getComputedStyle(f).display })), punten: qa('.rg-page-hero__strook-punt').map(p => getComputedStyle(p).display), strong: strook.querySelector('strong') ? tekst(strook.querySelector('strong'), CREME) : null } : null,
    strook2: strook2 ? tekst(strook2, CREME) : null,
    meer: meer ? { ...tekst(meer, CREME), padding: getComputedStyle(meer).padding, tapHoogte: meer.getBoundingClientRect().height } : null,
    volgende: R.volgende,
    cookie: cookie ? { rect: r(cookie), display: getComputedStyle(cookie).display } : null,
    afstanden: { titleNaarBtn: gap(R.title, R.btn), btnNaarNoot: gap(R.btn, R.noot), nootNaarLogos: gap(R.noot, R.logos), logosNaarBand: gap(R.logos, R.band), logosNaarTegel: gap(R.logos, eersteTegel), heroNaarBand: gap(R.hero, R.band), tegelNaarStrook: gap(eersteTegel, R.strook), strookNaarMeer: gap(R.strook, R.meer), meerNaarVolgende: gap(R.meer, R.volgende) },
    vouw: { prijsOnder: prijsRect && prijsRect.onder, margePrijs: prijsRect && +(vh - prijsRect.onder).toFixed(1), tegelOnder: eersteTegel && eersteTegel.onder, bandTop: R.band && R.band.y, strookOnder: R.strook && R.strook.onder, meerOnder: R.meer && R.meer.onder,
      bovenCookie: { grens: vh - ${COOKIE}, tegelPxBovenBalk: eersteTegel ? +Math.max(0, Math.min(eersteTegel.onder, vh - ${COOKIE}) - eersteTegel.y).toFixed(1) : null, prijsZichtbaar: prijsRect ? prijsRect.onder <= vh - ${COOKIE} : null, laatsteElementBovenBalk: ['title', 'btn', 'noot', 'logos', 'band', 'strook', 'meer'].filter(k => R[k] && R[k].onder <= vh - ${COOKIE}).pop() } }
  };
})()`;

const uit = {};
for (const [w, h] of VIEWPORTS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: w >= 992 ? 1 : 2, mobile: w < 992 }, sid);
  events.length = 0;
  await send('Page.navigate', { url: URL }, sid);
  await waitEvent('Page.loadEventFired', sid);
  await eval_('document.fonts.ready.then(()=>true)');
  // prototype-CSS ná onze bundel; de bevriezing van de band altijd
  await eval_(`(()=>{const s=document.createElement('style');s.id='rg-proto';s.textContent=${JSON.stringify(protoCss + '\n' + BEVRIES)};document.body.appendChild(s);return true})()`);
  if (protoJs) await eval_(`(()=>{${protoJs}\nreturn true})()`);
  await sleep(600);
  await eval_('scrollTo(0,0)'); await sleep(150);
  const m = await eval_(METING);
  uit[w + 'x' + h] = m;
  const shot = await send('Page.captureScreenshot', { format: 'png' }, sid);
  fs.writeFileSync(path.join(HIER, `${variant}-${w}x${h}.png`), Buffer.from(shot.data, 'base64'));
  const lang = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: 1400, scale: 1 } }, sid);
  fs.writeFileSync(path.join(HIER, `${variant}-${w}-lang.png`), Buffer.from(lang.data, 'base64'));
  // met cookiebalk: de echte Shopware-container zichtbaar gemaakt
  await eval_(`(()=>{const s=document.createElement('style');s.id='rg-cookie';s.textContent='.cookie-permission-container{display:block !important}';document.body.appendChild(s);return true})()`);
  await sleep(200);
  const c = await eval_(`(()=>{const el=document.querySelector('.cookie-permission-container');const b=el.getBoundingClientRect();return {top:+b.top.toFixed(1),h:+b.height.toFixed(1)}})()`);
  uit[w + 'x' + h].cookieGemeten = c;
  const shotC = await send('Page.captureScreenshot', { format: 'png' }, sid);
  fs.writeFileSync(path.join(HIER, `${variant}-${w}x${h}-cookie.png`), Buffer.from(shotC.data, 'base64'));
  const v = m.vouw;
  console.log(`${variant} ${w}x${h}: hero ${m.hero.rect.y}-${m.hero.rect.onder} | kop ${m.title.fontSize} ${m.title.regels.length}r | knop ${m.btn.rect.w}x${m.btn.rect.h} | logos ${m.logos.imgs.filter(i => i.display !== 'none').map(i => i.w + 'x' + i.h).join(',')} | band ${v.bandTop} tegel tot ${v.tegelOnder} prijs tot ${v.prijsOnder} (marge ${v.margePrijs}) | strook ${m.strook && m.strook.regels.length}r tot ${v.strookOnder} | meer tot ${v.meerOnder} | cookie ${c.top}+${c.h} boven balk: ${v.bovenCookie.laatsteElementBovenBalk}, tegel ${v.bovenCookie.tegelPxBovenBalk}px`);
}
fs.writeFileSync(path.join(HIER, `${variant}.json`), JSON.stringify(uit, null, 1));
await send('Browser.close'); chrome.kill(); process.exit(0);
