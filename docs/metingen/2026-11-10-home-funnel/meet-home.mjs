// Meting van de LIVE homepage (rootedgoods.eu) op vijf schermmaten, 10 november 2026.
// Headless Chromium uit de Playwright-cache via het DevTools-protocol, Node 24.
// Vers profiel per draai, dus de Shopware-cookiebalk staat open zoals bij een
// eerste bezoek. Tracking (GTM, GA4, Clarity, Apollo) is geblokkeerd zodat deze
// meting zelf niet in de cijfers terechtkomt. Eén paginalading per viewport.
//
// Gebruik:  node meet-home.mjs [label]        (standaard "live")
// Uitvoer in deze map: <label>-<b>x<h>.png (viewport, met cookiebalk),
//                      <label>-<b>-lang.png (0 tot 1800 px), <label>.json
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HIER = path.dirname(fileURLToPath(import.meta.url));
const S = '/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const label = process.argv[2] || 'live';
const STAMP = Date.now();
const UA_MOB = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';
const UA_DESK = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const VIEWPORTS = process.env.VP
  ? process.env.VP.split(',').map(v => v.split('x').map(Number))
  : [[375, 667], [390, 844], [430, 932], [1280, 800], [1440, 900]];

fs.mkdirSync(S + '/werk', { recursive: true });
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run',
  '--user-data-dir=' + S + '/werk/profiel-home-' + STAMP, '--window-size=1440,900', '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let buf = ''; chrome.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const waitEvent = (name, sid, ms = 60000) => new Promise((res, rej) => { const t0 = Date.now(); const iv = setInterval(() => { const k = events.findIndex(m => m.method === name && m.sessionId === sid); if (k >= 0) { clearInterval(iv); res(events.splice(k, 1)[0]); } else if (Date.now() - t0 > ms) { clearInterval(iv); rej(new Error('timeout ' + name)); } }, 50); });
const sleep = ms => new Promise(r => setTimeout(r, ms));

const METING = `(() => {
  const q = s => document.querySelector(s), qa = s => [...document.querySelectorAll(s)];
  const vw = innerWidth, vh = innerHeight;
  const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { x: +b.x.toFixed(1), y: +(b.y + scrollY).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1), onder: +(b.bottom + scrollY).toFixed(1) }; };
  const zicht = el => { if (!el) return false; const c = getComputedStyle(el); if (c.display === 'none' || c.visibility === 'hidden') return false; const b = el.getBoundingClientRect(); return b.width > 0 && b.height > 0; };
  const tekst = el => el ? el.textContent.replace(/\\s+/g, ' ').trim() : null;
  const kop = el => { const h = el.querySelector('h1,h2,h3'); return h ? tekst(h).slice(0, 80) : null; };
  const rgk = el => { const c = el.querySelector('[class*="rg-"]'); return c ? (c.className.match(/rg-[a-z0-9_\\-]+/) || [null])[0] : null; };

  const cookie = q('.cookie-permission-container');
  const cookieZicht = zicht(cookie);
  const cookieH = cookieZicht ? cookie.getBoundingClientRect().height : 0;
  const cookieRect = cookieZicht ? r(cookie) : null;
  const cookieKnoppen = cookieZicht ? qa('.cookie-permission-container .btn, .cookie-permission-container button').map(b => ({ tekst: tekst(b), rect: r(b) })) : [];

  const header = q('header, .header-main, .header-row') ;
  const headerOnder = (() => { const hs = qa('header .header-main, header, .nav-main, .header-row'); let m = 0; hs.forEach(h => { if (zicht(h)) m = Math.max(m, h.getBoundingClientRect().bottom + scrollY); }); return +m.toFixed(1); })();
  const main = q('main'); const mainPaddingTop = main ? getComputedStyle(main).paddingTop : null;
  const mainTop = main ? r(main).y : null;

  const secties = qa('.cms-sections > .cms-section').map((s, i) => ({ i, pos: (s.className.match(/pos-\\d+/) || [''])[0], klasse: rgk(s), kop: kop(s), rect: r(s), bg: getComputedStyle(s).backgroundColor }));

  const hero = q('.rg-hero-v2');
  const heroEl = {};
  if (hero) {
    heroEl.sectie = r(hero);
    heroEl.kicker = zicht(q('.rg-hero-v2__kicker')) ? { tekst: tekst(q('.rg-hero-v2__kicker')), rect: r(q('.rg-hero-v2__kicker')) } : null;
    const t = q('.rg-hero-v2__title'); heroEl.titel = { tekst: tekst(t), rect: r(t), fontSize: getComputedStyle(t).fontSize, regels: Math.round(t.getBoundingClientRect().height / parseFloat(getComputedStyle(t).lineHeight)) };
    heroEl.sub = zicht(q('.rg-hero-v2__sub')) ? r(q('.rg-hero-v2__sub')) : null;
    heroEl.knoppen = qa('.rg-hero-v2__cta a').map(a => ({ tekst: tekst(a), href: a.getAttribute('href'), rect: r(a) }));
    heroEl.tegels = qa('.rg-hero-v2__tile').map(a => ({ label: a.getAttribute('aria-label'), cap: tekst(a.querySelector('.rg-hero-v2__cap')), rect: r(a) }));
    heroEl.richard = zicht(q('.rg-hero-v2 .rg-cta__contact')) ? r(q('.rg-hero-v2 .rg-cta__contact')) : null;
    const car = q('.cms-element-custom-cms-slider'); heroEl.logoCarousel = car && zicht(car) ? { rect: r(car), imgs: car.querySelectorAll('img').length, zichtbareImgs: [...car.querySelectorAll('img')].filter(zicht).length } : null;
  }
  const thema = { head: r(q('.rg-cat-head')), kop: tekst(q('.rg-cat-heading')), eyebrow: zicht(q('.rg-cat-head__eyebrow')) ? tekst(q('.rg-cat-head__eyebrow')) : null, link: q('.rg-cat-head__link') ? { tekst: tekst(q('.rg-cat-head__link')), rect: r(q('.rg-cat-head__link')) } : null,
    tegels: qa('.rg-cat-tile').map(a => ({ titel: tekst(a.querySelector('.rg-cat-tile__title')), href: a.getAttribute('href'), rect: r(a) })) };
  const statement = q('.rg-statement') ? { rect: r(q('.rg-statement')), knoppen: qa('.rg-statement__cta a').map(a => ({ tekst: tekst(a), href: a.getAttribute('href'), rect: r(a) })), kaart: r(q('.rg-europe-map')) } : null;
  const sliderSec = q('.home-productslider, .cms-element-product-slider');
  const slider = sliderSec ? { rect: r(sliderSec), producten: qa('.home-productslider .product-box, .cms-element-product-slider .product-box').length, zichtbaar: qa('.home-productslider .product-box, .cms-element-product-slider .product-box').filter(zicht).length, kop: tekst(q('.rg-cat-head ~ * .rg-cat-heading')) } : null;
  const ontdekHead = qa('.rg-cat-heading').map(h => ({ tekst: tekst(h), rect: r(h) }));
  const features = qa('.rg-feature-row').map(f => ({ kop: tekst(f.querySelector('.rg-feature-row__title')), rect: r(f), knop: tekst(f.querySelector('.btn')) }));
  const services = q('.rg-spec-grid') ? { rect: r(q('.rg-spec-grid')), kaarten: qa('.rg-spec-card').map(a => ({ titel: tekst(a.querySelector('.rg-spec-card__title')), rect: r(a) })) } : null;
  const endcta = q('.rg-endcta') ? { rect: r(q('.rg-endcta')), knoppen: qa('.rg-endcta__cta a, .rg-endcta__cta .btn').map(a => ({ tekst: tekst(a), rect: r(a) })) } : null;
  const footer = r(q('footer, .footer-main'));

  // Alles wat klikbaar is en boven de vouw begint, en boven de cookiebalk.
  const klikbaar = qa('a[href], button, [role=button]').filter(zicht).map(a => ({ tekst: (a.getAttribute('aria-label') || tekst(a) || '').slice(0, 60), href: a.getAttribute('href'), rect: r(a) }));
  const bovenVouw = klikbaar.filter(k => k.rect.y < vh);
  const bovenCookie = klikbaar.filter(k => k.rect.onder <= vh - cookieH);
  const usp = q('.rg-usp, .topbar, .top-bar, .header-top');

  return { vw, vh, dpr: devicePixelRatio, url: location.href, titel: document.title,
    scrollHoogte: document.documentElement.scrollHeight, imgs: document.images.length, imgsLazy: qa('img[loading=lazy]').length,
    headerOnder, mainTop, mainPaddingTop,
    cookie: { zichtbaar: cookieZicht, hoogte: +cookieH.toFixed(1), rect: cookieRect, knoppen: cookieKnoppen, vrijBovenBalk: +(vh - cookieH).toFixed(1) },
    secties, hero: heroEl, thema, statement, slider, ontdekHead, features, services, endcta, footer,
    klikbaarBovenVouw: bovenVouw, klikbaarBovenCookie: bovenCookie, aantalKlikbaarTotaal: klikbaar.length };
})()`;

const alles = { label, gemeten: new Date().toISOString(), viewports: {} };
for (const [w, h] of VIEWPORTS) {
  const mobiel = w < 992;
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sid); await send('Runtime.enable', {}, sid); await send('Network.enable', {}, sid);
  await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
  await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*analytics.google*', '*clarity.ms*', '*apollo.io*', '*doubleclick*', '*facebook*', '*cal.com*', '*leadinfo*', '*googleadservices*'] }, sid);
  await send('Network.setUserAgentOverride', { userAgent: mobiel ? UA_MOB : UA_DESK, acceptLanguage: 'nl-NL,nl' }, sid);
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: mobiel ? 2 : 1, mobile: mobiel }, sid);
  if (mobiel) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sid);
  const url = `https://rootedgoods.eu/?rgkoud=${STAMP}${w}`;
  await send('Page.navigate', { url }, sid);
  await waitEvent('Page.loadEventFired', sid, 90000);
  await sleep(4000); // fonts, thema-JS, cookiebalk
  const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: METING, returnByValue: true, awaitPromise: true }, sid);
  if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails).slice(0, 1000));
  const m = result.value;
  // schermafdruk viewport (met cookiebalk) en lange afdruk 0..1800
  const shot = await send('Page.captureScreenshot', { format: 'png' }, sid);
  fs.writeFileSync(path.join(HIER, `${label}-${w}x${h}.png`), Buffer.from(shot.data, 'base64'));
  const lang = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: w, height: Math.min(1800, m.scrollHoogte), scale: mobiel ? 1 : 1 } }, sid);
  fs.writeFileSync(path.join(HIER, `${label}-${w}-lang.png`), Buffer.from(lang.data, 'base64'));
  alles.viewports[`${w}x${h}`] = m;
  const sec = m.secties.map(s => `${s.pos}:${(s.kop || s.klasse || '?').slice(0, 22)}@${Math.round(s.rect.y)}-${Math.round(s.rect.onder)}`).join(' | ');
  console.log(`\n== ${w}x${h} (${mobiel ? 'mobiel' : 'desktop'}) scrollHoogte ${m.scrollHoogte}, cookiebalk ${m.cookie.zichtbaar ? m.cookie.hoogte + 'px' : 'niet zichtbaar'}, vrij boven balk ${m.cookie.vrijBovenBalk}px, header tot ${m.headerOnder}`);
  console.log('secties:', sec);
  if (m.hero.titel) console.log(`hero: sectie ${Math.round(m.hero.sectie.y)}-${Math.round(m.hero.sectie.onder)}; kicker ${m.hero.kicker ? JSON.stringify(m.hero.kicker.tekst) : 'geen'}; titel ${m.hero.titel.regels} regels (${m.hero.titel.fontSize}) tot ${m.hero.titel.rect.onder}; sub ${m.hero.sub ? 'zichtbaar' : 'verborgen'}; knoppen ${m.hero.knoppen.map(k => k.tekst + '@' + Math.round(k.rect.y) + '-' + Math.round(k.rect.onder)).join(', ')}; tegels ${m.hero.tegels.map(t => Math.round(t.rect.y) + '-' + Math.round(t.rect.onder)).join(', ')}; richard ${m.hero.richard ? Math.round(m.hero.richard.y) + '-' + Math.round(m.hero.richard.onder) : 'geen'}; logocarousel ${m.hero.logoCarousel ? Math.round(m.hero.logoCarousel.rect.y) + '-' + Math.round(m.hero.logoCarousel.rect.onder) + ' (' + m.hero.logoCarousel.zichtbareImgs + '/' + m.hero.logoCarousel.imgs + ' imgs)' : 'geen'}`);
  console.log(`thema: kop@${m.thema.head ? Math.round(m.thema.head.y) : '?'} eyebrow ${JSON.stringify(m.thema.eyebrow)}; tegels ${m.thema.tegels.map(t => t.titel.slice(0, 12) + '@' + Math.round(t.rect.y) + '-' + Math.round(t.rect.onder) + 'x' + Math.round(t.rect.x)).join(', ')}`);
  console.log(`klikbaar boven de vouw: ${m.klikbaarBovenVouw.length}, boven de cookiebalk: ${m.klikbaarBovenCookie.length} -> ${m.klikbaarBovenCookie.map(k => k.tekst).join(' / ')}`);
  await send('Target.closeTarget', { targetId });
}
fs.writeFileSync(path.join(HIER, `${label}.json`), JSON.stringify(alles, null, 1));
console.log('\nbewaard:', path.join(HIER, `${label}.json`));
chrome.kill();
process.exit(0);
