// Per 'nodig' !important-regel in een regelbereik: welke regel van het thema (of van ons) verliest er zonder !important, en met welke specificiteit?
// Gebruik: node concurrentie.mjs <van> <tot>      (leest oordeel-per-longhand.json, schrijft concurrentie-<van>-<tot>.json/.txt)
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { markeer } from './markeer.mjs';
const HIER = path.dirname(fileURLToPath(import.meta.url)); const REPO = path.resolve(HIER, '../../..');
const [van, tot] = process.argv.slice(2).map(Number);
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const cssBron = fs.readFileSync(process.env.CSSFILE ? path.resolve(process.env.CSSFILE) : path.join(REPO, 'rootedgoods.css'), 'utf8');
const { tekst: cssGem } = markeer(cssBron); const jsLok = fs.readFileSync(path.join(REPO, 'rootedgoods.js'));
const oordeel = JSON.parse(fs.readFileSync(path.join(HIER, 'oordeel-per-longhand.json'), 'utf8'));
const VPS = { mobiel: [390, 844, true], tablet: [820, 1180, true], desktop: [1440, 900, false] };
// groepeer 'nodig' op (vp, pad)
const groepen = new Map();
for (const [k, v] of Object.entries(oordeel)) {
  if (v.oordeel !== 'nodig' || !v.verschil) continue; const [l, p] = k.split('|'); const L = Number(l); if (L < van || L > tot) continue;
  const m = v.verschil.match(/^(\S+) (\S+): /); if (!m) continue; const sleutel = m[1] + ' ' + m[2];
  if (!groepen.has(sleutel)) groepen.set(sleutel, []); groepen.get(sleutel).push([L, p]);
}
console.log(`${groepen.size} (viewport,pagina)-combinaties, ${[...groepen.values()].reduce((a, b) => a + b.length, 0)} (regel,eigenschap)`);
const analyse = fs.readFileSync(path.join(HIER, 'conc.js'), 'utf8');
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-conc-')), '--lang=nl-NL', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('geen devtools-url')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); let events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
for (const d of ['Page', 'Runtime', 'Network', 'DOM']) await send(d + '.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*'] }, sid);
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.css*' }, { urlPattern: '*rootedgoods.min.js*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) { if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; const isCss = e.params.request.url.includes('.min.css'); await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: isCss ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' }], body: Buffer.from(isCss ? cssBron : jsLok).toString('base64') }, sid); } } }, 20);
// CSS.enable na DOM.enable, en na het zetten van onze <style> (anders ontbreekt hij in de stylesheetlijst)
await send('CSS.enable', {}, sid);
// specificiteit (a,b,c) van een selector
function spec(sel) {
  let s = sel.replace(/\[[^\]]*\]/g, ' [a] '); let a = 0, b = 0, c = 0;
  s = s.replace(/:(?:is|not|has|where|matches)\(([^)]*)\)/g, (m, inner) => m.startsWith(':where') ? ' ' : ' ' + inner + ' ');
  a += (s.match(/#[\w-]+/g) || []).length; b += (s.match(/\.[\w-]+|\[a\]|:(?!:)(?!is\b|not\b|has\b|where\b)[\w-]+/g) || []).length;
  c += (s.match(/(^|[\s>+~])[a-zA-Z][\w-]*/g) || []).length + (s.match(/::[\w-]+/g) || []).length;
  return [a, b, c];
}
const sleutelProp = (name, p) => name === p || p.startsWith(name + '-') || (name === 'border-radius' && /^border-.*-radius$/.test(p)) || (name === 'font' && /^font-/.test(p)) || (name === 'background' && /^background-/.test(p)) || (name === 'margin' && /^margin-/.test(p)) || (name === 'padding' && /^padding-/.test(p)) || (name === 'inset' && /^(top|right|bottom|left)$/.test(p)) || (name === 'overflow' && /^overflow-/.test(p)) || (name === 'flex' && /^flex-/.test(p)) || (name === 'grid-template' && /^grid-template-/.test(p)) || (name === 'gap' && /-gap$/.test(p));
const uit = [];
for (const [sleutel, items] of groepen) {
  const [vp, pad] = sleutel.split(' '); const [W, H, mobile] = VPS[vp];
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile }, sid);
  events = []; await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
  const stop = Date.now() + 15000; while (Date.now() < stop) { await sleep(250); if (events.some(e => e.method === 'Page.loadEventFired')) break; }
  await sleep(3500);
  const r = await send('Runtime.evaluate', { expression: `(${analyse})(${JSON.stringify(cssGem)}, ${JSON.stringify(items)})`, awaitPromise: true, returnByValue: true, timeout: 60000 }, sid);
  const gem = r.result.value; if (!Array.isArray(gem)) { console.log('FOUT', sleutel, JSON.stringify(r).slice(0, 200)); continue; }
  const doc = await send('DOM.getDocument', { depth: 0 }, sid);
  const { nodeIds } = await send('DOM.querySelectorAll', { nodeId: doc.root.nodeId, selector: '[data-rg-n]' }, sid);
  for (const nodeId of nodeIds) {
    const attr = (await send('DOM.getAttributes', { nodeId }, sid)).attributes; const marks = attr[attr.indexOf('data-rg-n') + 1].split(' ');
    const ms = await send('CSS.getMatchedStylesForNode', { nodeId }, sid);
    const regels = ms.matchedCSSRules || [];
    for (const mk of marks) {
      const [l, p, si] = mk.split('|');
      // onze regel: heeft --rg-l:<l>
      const eigen = regels.findIndex(x => x.rule.style.cssProperties.some(c => c.name === '--rg-l' && c.value === l));
      const rij = { vp, pad, l: Number(l), p, eigenSelector: null, eigenSpec: null, concurrenten: [] };
      if (eigen >= 0) { const x = regels[eigen]; const i = x.matchingSelectors[0]; rij.eigenSelector = x.rule.selectorList.selectors[i].text; rij.eigenSpec = spec(rij.eigenSelector); rij.eigenWaarde = (x.rule.style.cssProperties.find(c => sleutelProp(c.name, p)) || {}).value; }
      regels.forEach((x, idx) => {
        if (idx === eigen) return; const prop = x.rule.style.cssProperties.find(c => !c.name.startsWith('--') && sleutelProp(c.name, p) && !c.disabled); if (!prop) return;
        const i = x.matchingSelectors[0]; const text = x.rule.selectorList.selectors[i].text;
        rij.concurrenten.push({ selector: text.slice(0, 120), spec: spec(text), waarde: String(prop.value).slice(0, 40), important: !!prop.important, volgorde: idx < eigen ? 'eerder' : 'later', bron: x.rule.origin === 'user-agent' ? 'browser' : (x.rule.styleSheetId && !x.rule.style.cssProperties.some(c => c.name === '--rg-l') ? 'thema/overig' : 'eigen') });
      });
      uit.push(rij);
    }
  }
  console.log(sleutel, 'gemerkt:', gem.filter(g => g.st === 'gemerkt').length, 'geen verschil:', gem.filter(g => g.st !== 'gemerkt').length);
}
fs.writeFileSync(path.join(HIER, `concurrentie-${van}-${tot}.json`), JSON.stringify(uit, null, 1));
const fmt = s => s ? `(${s.join(',')})` : '?';
let txt = '';
for (const r of uit.sort((a, b) => a.l - b.l || a.p.localeCompare(b.p))) {
  txt += `r${r.l} ${r.p}  [${r.vp} ${r.pad}]  eigen ${fmt(r.eigenSpec)} ${r.eigenSelector || '?'} = ${r.eigenWaarde}\n`;
  for (const c of r.concurrenten) txt += `     ${c.bron} ${c.volgorde} ${fmt(c.spec)} ${c.important ? '!important ' : ''}${c.selector} = ${c.waarde}\n`;
}
fs.writeFileSync(path.join(HIER, `concurrentie-${van}-${tot}.txt`), txt);
console.log('klaar'); await send('Browser.close'); chrome.kill(); process.exit(0);
