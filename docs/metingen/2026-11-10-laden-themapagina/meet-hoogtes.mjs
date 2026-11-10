// Hoogtes van de themapagina met en zonder onze JS (live, alleen lezen), per breedte.
// BLOCK=js blokkeert rootedgoods.min.js: dat is de stand van vóór de JS (wat de bezoeker eerst ziet).
// Gebruik: [BLOCK=js] [URL=...] node meet-hoogtes.mjs <naam> [css-bestand]
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
const HIER = path.dirname(fileURLToPath(import.meta.url));
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL = process.env.URL || 'https://rootedgoods.eu/eindejaarsgeschenken';
const [naam = 'x', cssPad] = process.argv.slice(2);
const css = cssPad ? fs.readFileSync(cssPad, 'utf8') : '';
const VPS = (process.env.VP || '360x740,390x844,430x932,768x1024,1024x768,1280x800,1931x1112').split(',').map(v => v.split('x').map(Number));
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'rg-h-'));
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + prof, '--window-size=430,932', '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const waitEvent = (name, sid) => new Promise((res, rej) => { const t0 = Date.now(); const iv = setInterval(() => { const k = events.findIndex(m => m.method === name && m.sessionId === sid); if (k >= 0) { clearInterval(iv); res(events.splice(k, 1)[0]); } else if (Date.now() - t0 > 60000) { clearInterval(iv); rej(new Error('timeout')); } }, 50); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sid); await send('Runtime.enable', {}, sid); await send('Network.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*', ...(process.env.BLOCK === 'js' ? ['*rootedgoods.min.js*'] : [])] }, sid);
await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 }, sid);
const eval_ = async (e) => { const { result, exceptionDetails } = await send('Runtime.evaluate', { expression: e, returnByValue: true, awaitPromise: true }, sid); if (exceptionDetails) throw new Error(JSON.stringify(exceptionDetails).slice(0, 500)); return result.value; };
const METING = process.env.FONTS ? `(() => ([...document.fonts].map(f => [f.family, f.weight, f.display, f.status, (f.unicodeRange||'').slice(0,12)].join(' | '))))()` : process.env.KOP ? `(() => { const q = s => document.querySelector(s); const r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { y: +(b.y + scrollY).toFixed(1), h: +b.height.toFixed(1) }; }; const cs = (s,p) => { const e=q(s); return e ? getComputedStyle(e).getPropertyValue(p) : null; };
  return { header: r(q('.header-main')), topbar: r(q('.top-bar')), usp: r(q('.rg-usp-slider')), nav: r(q('.nav-main')), main: r(q('main')), content: r(q('.container-main')), cmsPage: r(q('.cms-page')), sec1: r(q('.cms-section.pos-1')), hero: r(q('.rg-page-hero--band')), breadcrumb: r(q('.cms-breadcrumb')), bodyPad: cs('body','padding-top'), mainPad: cs('main','padding-top'), contentPad: cs('.container-main','padding-top'), htmlPad: cs('html','padding-top'), headerPos: cs('.header-main','position') }; })()` : `(() => { const q = s => document.querySelector(s), r = el => { if (!el) return null; const b = el.getBoundingClientRect(); return { y: +(b.y + scrollY).toFixed(1), h: +b.height.toFixed(1), w: +b.width.toFixed(1), x: +b.x.toFixed(1), onder: +(b.bottom + scrollY).toFixed(1) }; };
  const sl = q('.rg-band') || q('[data-product-slider]'); const item = sl && sl.querySelector('.product-slider-item');
  const cs = (el, p) => el ? getComputedStyle(el).getPropertyValue(p) : null;
  return { band: !!q('.rg-band'), klaar: document.documentElement.classList.contains('rg-band-pagina'), hero: r(q('.rg-page-hero--band')), titel: r(q('.rg-page-hero__title')), cijfers: r(q('.rg-page-hero__cijfers')), knop: r(q('.rg-page-hero__cta')), noot: r(q('.rg-page-hero__noot')), logos: r(q('.rg-page-hero__logos')), logosDisplay: cs(q('.rg-page-hero__logos'), 'display'),
    slider: r(sl), sliderSectie: r(sl && sl.closest('.cms-section')), tegel: r(item), strook: r(q('.rg-page-hero__strook')), strookHidden: q('.rg-page-hero__strook') && q('.rg-page-hero__strook').hidden, meer: r(q('.rg-band__meer')), scrollH: document.scrollingElement.scrollHeight, titelMarginOnder: cs(q('.rg-page-hero__title'), 'margin-bottom'), tileVar: sl && getComputedStyle(sl).getPropertyValue('--rg-band-tile'), vis: (()=>{const e=document.querySelector('[data-product-slider]'); return e ? getComputedStyle(e).display + '/' + getComputedStyle(e).visibility : null})(), lucht: getComputedStyle(document.documentElement).getPropertyValue('--rg-lucht'), vh: innerHeight }; })()`;
const uit = {};
for (const [w, h] of VPS) {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 992 }, sid);
  events.length = 0; await send('Page.navigate', { url: URL }, sid); await waitEvent('Page.loadEventFired', sid);
  await eval_('document.fonts.ready.then(()=>true)');
  if (css) await eval_(`(()=>{const s=document.createElement('style');s.id='rg-proto';s.textContent=${JSON.stringify(css)};document.head.appendChild(s);return true})()`);
  await sleep(Number(process.env.WAIT || 2500));
  uit[w + 'x' + h] = await eval_(METING);
  const m = uit[w + 'x' + h];
  if (process.env.FONTS) { console.log(m.join('\n')); continue; }
  console.log(`${naam} ${w}: klaar=${m.klaar} band=${m.band} | hero h ${m.hero && m.hero.h} | titel ${m.titel && m.titel.h} | cijfers ${m.cijfers ? m.cijfers.h : '-'} | slider h ${m.slider && m.slider.h} y ${m.slider && m.slider.y} | tegel ${m.tegel && m.tegel.h}x${m.tegel && m.tegel.w} | logos ${m.logos ? m.logos.h + '@' + m.logos.y : '-'} ${m.logosDisplay} | strook ${m.strook ? m.strook.h + (m.strookHidden ? ' hidden' : '') : '-'} | scrollH ${m.scrollH}`);
}
fs.writeFileSync(path.join(HIER, `hoogtes-${naam}.json`), JSON.stringify(uit, null, 1));
await send('Browser.close'); chrome.kill(); process.exit(0);
