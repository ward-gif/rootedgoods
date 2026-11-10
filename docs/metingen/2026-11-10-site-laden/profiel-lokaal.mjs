// CPU-profiel van het laden van één pagina (live, CPU 4x trager): welke functies kosten de meeste tijd?
import { spawn } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const BIN = process.env.HOME + '/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const pad = process.argv[2] || '/over-ons';
const chrome = spawn(BIN, ['--headless', '--remote-debugging-port=0', '--hide-scrollbars', '--no-first-run', '--user-data-dir=' + fs.mkdtempSync(path.join(os.tmpdir(), 'rg-prof-')), '--window-size=390,844', 'about:blank']);
const wsUrl = await new Promise((res, rej) => { let b = ''; chrome.stderr.on('data', d => { b += d; const m = b.match(/DevTools listening on (ws:\/\/\S+)/); if (m) res(m[1]); }); setTimeout(() => rej(new Error('x')), 15000); });
const ws = new WebSocket(wsUrl); await new Promise(r => ws.onopen = r);
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(JSON.stringify(m.error))) : res(m.result); } else events.push(m); };
const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
const sleep = ms => new Promise(r => setTimeout(r, ms));
const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
const { sessionId: sid } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sid); await send('Network.enable', {}, sid); await send('Profiler.enable', {}, sid);
await send('Network.setCacheDisabled', { cacheDisabled: true }, sid);
await send('Network.setBlockedURLs', { urls: ['*googletagmanager*', '*google-analytics*', '*clarity.ms*', '*facebook*', '*doubleclick*', '*cal.com*'] }, sid);
await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sid);

const REPO = path.resolve(path.dirname(process.argv[1]), '../../..');
const jsLok = fs.readFileSync(path.join(REPO, 'rootedgoods.js'));
await send('Fetch.enable', { patterns: [{ urlPattern: '*rootedgoods.min.js*' }] }, sid);
setInterval(async () => { for (let i = events.length - 1; i >= 0; i--) { if (events[i].method === 'Fetch.requestPaused') { const e = events.splice(i, 1)[0]; await send('Fetch.fulfillRequest', { requestId: e.params.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/javascript; charset=utf-8' }], body: jsLok.toString('base64') }, sid); } } }, 20);
await send('Emulation.setCPUThrottlingRate', { rate: 4 }, sid);
await send('Profiler.setSamplingInterval', { interval: 1000 }, sid);
await send('Profiler.start', {}, sid);
await send('Page.navigate', { url: 'https://rootedgoods.eu' + pad }, sid);
await sleep(9000);
const { profile } = await send('Profiler.stop', {}, sid);
const nodes = new Map(profile.nodes.map(n => [n.id, n]));
const eigen = new Map(); const dt = profile.timeDeltas; 
profile.samples.forEach((s, i) => { eigen.set(s, (eigen.get(s) || 0) + (dt[i] || 0)); });
const perFn = new Map();
for (const [nid, t] of eigen) { const n = nodes.get(nid); const cf = n.callFrame; const k = `${cf.functionName || '(anon)'} ${cf.url.split('/').slice(-2).join('/').slice(0, 60)}:${cf.lineNumber}`; perFn.set(k, (perFn.get(k) || 0) + t); }
const totaal = [...perFn.values()].reduce((a, b) => a + b, 0);
console.log(`profiel ${pad}: ${Math.round(totaal / 1000)} ms CPU (4x), top-eigen tijd:`);
[...perFn.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12).forEach(([k, t]) => console.log(`  ${String(Math.round(t / 1000)).padStart(5)} ms  ${k}`));
await send('Browser.close'); chrome.kill(); process.exit(0);
