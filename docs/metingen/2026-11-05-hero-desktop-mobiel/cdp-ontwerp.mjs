import { spawn } from 'node:child_process';
import fs from 'node:fs';
const S='/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL='file://'+S.replace(/ /g,'%20')+'/pagina/replica-na.html';
const OUT=S+'/metingen-ontwerp'; fs.mkdirSync(OUT,{recursive:true});
const chrome=spawn(BIN,['--headless','--remote-debugging-port=0','--hide-scrollbars','--no-first-run','--user-data-dir='+S+'/werk/profiel','--window-size=1931,1112','--lang=nl-NL','about:blank']);
const wsUrl=await new Promise((res,rej)=>{let buf='';chrome.stderr.on('data',d=>{buf+=d;const m=buf.match(/DevTools listening on (ws:\/\/\S+)/);if(m)res(m[1]);});setTimeout(()=>rej(new Error('geen url')),15000);});
const ws=new WebSocket(wsUrl); await new Promise(r=>ws.onopen=r);
let id=0; const pending=new Map(); const events=[];
ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){const {res,rej}=pending.get(m.id);pending.delete(m.id); m.error?rej(new Error(JSON.stringify(m.error))):res(m.result);} else events.push(m);};
const send=(method,params={},sessionId)=>new Promise((res,rej)=>{const i=++id;pending.set(i,{res,rej});ws.send(JSON.stringify({id:i,method,params,sessionId}));});
const waitEvent=(name,sid)=>new Promise((res,rej)=>{const t0=Date.now();const iv=setInterval(()=>{const k=events.findIndex(m=>m.method===name&&m.sessionId===sid);if(k>=0){clearInterval(iv);res(events.splice(k,1)[0]);}else if(Date.now()-t0>60000){clearInterval(iv);rej(new Error('timeout'));}},50);});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const {targetId}=await send('Target.createTarget',{url:'about:blank'});
const {sessionId:sid}=await send('Target.attachToTarget',{targetId,flatten:true});
await send('Page.enable',{},sid); await send('Runtime.enable',{},sid);
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true},sid);
await send('Page.navigate',{url:URL},sid); await waitEvent('Page.loadEventFired',sid); await sleep(4000);
// bewaar de oorspronkelijke hero-HTML en noot
await send('Runtime.evaluate',{expression:`window.__hero0=document.querySelector('.rg-page-hero--band').innerHTML;`},sid);
const V=[
 ['A nu', '', null],
 ['B zonder feiten, noot 1 regel', '', `(()=>{const h=document.querySelector('.rg-page-hero--band');h.innerHTML=window.__hero0;h.querySelector('.rg-page-hero__feiten').remove();h.querySelector('.rg-page-hero__noot').textContent='Nog op tijd voor kerst? Vraag het vandaag.';})()`],
 ['C = B + feitenstrook onder band', '.rg-band-pagina .rg-feitenstrook{margin:0.25rem 0 0 20px;font-size:1.05rem;line-height:1.5;color:#5d6d55} .rg-band-pagina .rg-feitenstrook strong{color:#2c2a26;font-weight:700} @media(min-width:992px){.rg-band-pagina .rg-feitenstrook{text-align:center;margin-left:0}}', `(()=>{const h=document.querySelector('.rg-page-hero--band');h.innerHTML=window.__hero0;h.querySelector('.rg-page-hero__feiten').remove();h.querySelector('.rg-page-hero__noot').textContent='Nog op tijd voor kerst? Vraag het vandaag.';const meer=document.querySelector('.rg-band__meer');let s=document.querySelector('.rg-feitenstrook');if(!s){s=document.createElement('p');s.className='rg-feitenstrook';s.innerHTML='<strong>€&nbsp;25 tot €&nbsp;70</strong> per persoon &nbsp;·&nbsp; <strong>vanaf 10</strong> stuks';meer.insertAdjacentElement('beforebegin',s);}})()`],
 ['D = B + regel 2 in Montserrat 700', '.rg-page-hero--band .rg-page-hero__title .rg-sans{display:block;font-family:Montserrat,sans-serif;font-weight:700;letter-spacing:-0.02em;font-size:0.92em}', `(()=>{const h=document.querySelector('.rg-page-hero--band');h.innerHTML=window.__hero0;h.querySelector('.rg-page-hero__feiten').remove();h.querySelector('.rg-page-hero__noot').textContent='Nog op tijd voor kerst? Vraag het vandaag.';h.querySelector('.rg-page-hero__title').innerHTML='Kerstpakketten met jouw&nbsp;logo,<span class="rg-sans">van Europese makers</span>';const s=document.querySelector('.rg-feitenstrook');if(s)s.remove();})()`],
];
const M=`(()=>{const q=s=>document.querySelector(s);const r=el=>{if(!el)return null;const b=el.getBoundingClientRect();return {y:+(b.y+scrollY).toFixed(1),h:+b.height.toFixed(1),w:+b.width.toFixed(1),x:+b.x.toFixed(1)};};
 const regels=el=>{if(!el)return null;const out=[];const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,cur=null,last=null;while(n=w.nextNode()){const s=n.textContent;const re=/[^\\s\\u00a0]+(?:\\u00a0[^\\s\\u00a0]+)*/g;let m;while(m=re.exec(s)){const rg=document.createRange();rg.setStart(n,m.index);rg.setEnd(n,m.index+m[0].length);const rr=rg.getClientRects()[0];if(!rr)continue;const top=Math.round(rr.top);if(last===null||Math.abs(top-last)>4){cur=[];out.push(cur);last=top;}cur.push(m[0].replace(/\\u00a0/g,' '));}}return out.map(x=>x.join(' '));};
 const hero=q('.rg-page-hero--band'),band=q('.rg-band'),t=q('.rg-page-hero__title'),noot=q('.rg-page-hero__noot'),strook=q('.rg-feitenstrook'),meer=q('.rg-band__meer'),btn=q('.rg-page-hero__cta .btn');
 const tegels=[...document.querySelectorAll('.rg-band .product-box')].slice(0,4);
 return {vh:innerHeight,hero:r(hero),band:r(band),tegelOnder:Math.max(...tegels.map(b=>b.getBoundingClientRect().bottom+scrollY)),kop:{rect:r(t),regels:regels(t)},noot:{rect:r(noot),regels:regels(noot)},knop:r(btn),strook:strook?{rect:r(strook),regels:regels(strook)}:null,meer:r(meer)};})()`;
const out={};
for (const [naam,css,js] of V){
  await send('Runtime.evaluate',{expression:`(()=>{let s=document.getElementById('rg-v');if(!s){s=document.createElement('style');s.id='rg-v';document.head.appendChild(s);}s.textContent=${JSON.stringify(css)};})()`},sid);
  if (js) await send('Runtime.evaluate',{expression:js},sid); else await send('Runtime.evaluate',{expression:`document.querySelector('.rg-page-hero--band').innerHTML=window.__hero0;const s=document.querySelector('.rg-feitenstrook');if(s)s.remove();`},sid);
  out[naam]={};
  for (const [w,h,d,m] of [[390,844,2,true],[375,667,2,true],[1280,800,1,false],[1931,1112,1,false]]){
    await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:d,mobile:m},sid); await sleep(500);
    await send('Runtime.evaluate',{expression:'scrollTo(0,0)'},sid); await sleep(150);
    const {result}=await send('Runtime.evaluate',{expression:M,returnByValue:true},sid); const v=result.value; out[naam][w]=v;
    console.log(`${naam.padEnd(34)} ${w}: hero ${v.hero.y}-${(v.hero.y+v.hero.h).toFixed(0)} | band ${v.band.y} zichtbaar ${Math.max(0,Math.min(h,v.band.y+v.band.h)-v.band.y).toFixed(0)} | tegels onder ${v.tegelOnder.toFixed(0)} | kop ${v.kop.regels.length} regels ${JSON.stringify(v.kop.regels)} | noot ${v.noot.regels.length}r | knop y ${v.knop.y} | strook ${v.strook?v.strook.rect.y+' '+JSON.stringify(v.strook.regels):'-'} | link y ${v.meer.y}`);
    if ((w===390||w===1931)){const shot=await send('Page.captureScreenshot',{format:'png'},sid);fs.writeFileSync(`${OUT}/${naam.replace(/[^a-z0-9]+/gi,'_')}-${w}.png`,Buffer.from(shot.data,'base64'));}
  }
}
fs.writeFileSync(`${OUT}/ontwerpvarianten.json`,JSON.stringify(out,null,1));
await send('Browser.close'); chrome.kill(); process.exit(0);
