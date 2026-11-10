import { spawn } from 'node:child_process';
import fs from 'node:fs';
const S='/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL='http://127.0.0.1:8777/replica-http.html';
const OUT=S+'/metingen-na10'; fs.mkdirSync(OUT,{recursive:true});
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
const vp=async(w,h,d,m)=>{await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:d,mobile:m},sid);await sleep(600);await send('Runtime.evaluate',{expression:'scrollTo(0,0)'},sid);await sleep(200);};
const shot=async(naam,clip)=>{const p={format:'png'};if(clip){p.captureBeyondViewport=true;p.clip=clip;}const r=await send('Page.captureScreenshot',p,sid);fs.writeFileSync(`${OUT}/${naam}.png`,Buffer.from(r.data,'base64'));};
const ev=async(expr)=>(await send('Runtime.evaluate',{expression:expr,returnByValue:true},sid)).result.value;
const setStyle=async(css)=>ev(`(()=>{let s=document.getElementById('rg-v');if(!s){s=document.createElement('style');s.id='rg-v';document.head.appendChild(s);}s.textContent=${JSON.stringify(css)};})()`);
const M=`(()=>{const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];const r=el=>{if(!el)return null;const b=el.getBoundingClientRect();return {y:+(b.y+scrollY).toFixed(1),h:+b.height.toFixed(1)};};
 const band=q('.rg-band'),hero=q('.rg-page-hero--band'),btn=q('.rg-page-hero__cta .btn'),noot=q('.rg-page-hero__noot'),strook=q('.rg-page-hero__strook'),meer=q('.rg-band__meer'),logos=q('.rg-page-hero__logos'),t=q('.rg-page-hero__title');
 const boxes=qa('.rg-band .product-box').slice(0,8);
 const cs=getComputedStyle(document.querySelector('.cms-section:has(.rg-page-hero--band)'),'::before');
 return {vh:innerHeight,hero:r(hero),band:r(band),knop:r(btn),noot:r(noot),logos:r(logos),strook:r(strook),meer:r(meer),
  prijsOnder:Math.max(...boxes.map(b=>{const p=b.querySelector('.product-price');return p?p.getBoundingClientRect().bottom+scrollY:0;})),
  tegelOnder:Math.max(...boxes.map(b=>b.getBoundingClientRect().bottom+scrollY)),
  kopRegels:Math.round(t.getBoundingClientRect().height/parseFloat(getComputedStyle(t).lineHeight)),kopH:+t.getBoundingClientRect().height.toFixed(1),
  contour:{content:cs.content,opacity:cs.opacity,width:cs.width,bg:cs.backgroundImage.slice(0,60)},
  cirkel:(()=>{const c=getComputedStyle(btn,'::after');return {w:c.width,radius:c.borderRadius,bg:c.backgroundColor};})()};})()`;
const regels=`(()=>{const el=document.querySelector('.rg-page-hero__title');const out=[];const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,cur=null,last=null;while(n=w.nextNode()){const s=n.textContent;const re=/[^\\s\\u00a0]+(?:\\u00a0[^\\s\\u00a0]+)*/g;let m;while(m=re.exec(s)){const rg=document.createRange();rg.setStart(n,m.index);rg.setEnd(n,m.index+m[0].length);const rr=rg.getClientRects()[0];if(!rr)continue;const top=Math.round(rr.top);if(last===null||Math.abs(top-last)>4){cur=[];out.push(cur);last=top;}cur.push(m[0].replace(/\\u00a0/g,' '));}}return out.map(x=>x.join(' '));})()`;





const out={};
const M10=`(()=>{const q=s=>document.querySelector(s);const r=el=>{const b=el.getBoundingClientRect();return [+(b.top+scrollY).toFixed(0),+(b.bottom+scrollY).toFixed(0)];};const cp=q('.cms-page');const cs=getComputedStyle(cp,'::before');
 const boxH=parseFloat(cs.height)||0;const boxW=parseFloat(cs.width)||innerWidth;const ar=851.6/538.4;let kaartB,h;if(boxW/boxH<ar){kaartB=boxW;h=boxW/ar;}else{h=boxH;kaartB=h*ar;}kaartB=+kaartB.toFixed(0);h=+h.toFixed(0);const top=r(cp)[0];
 const foto=q('.rg-feature-row__media');const introKop=q('.rg-block-title__title');
 return {vw:innerWidth,vh:innerHeight,maskBox:[top,top+boxH],kaart:{breedte:kaartB,past:kaartB<=innerWidth,onder:top+h},hero:r(q('.rg-page-hero--band')),band:r(q('.rg-band')),strook:r(q('.rg-page-hero__strook')),link:r(q('.rg-band__meer')),introKop:introKop?r(introKop):null,foto:foto?r(foto):null,pseudo:{content:cs.content,bg:cs.backgroundColor,op:cs.opacity,size:cs.maskSize||cs.webkitMaskSize,pos:cs.maskPosition||cs.webkitMaskPosition},
  prijsOnder:Math.max(...[...document.querySelectorAll('.rg-band .product-box')].slice(0,8).map(b=>{const p=b.querySelector('.product-price');return p?+(p.getBoundingClientRect().bottom+scrollY).toFixed(0):0;}))};})()`;
for (const [w,h,d,m,lang] of [[1931,1112,1,false,1500],[1280,800,1,false,1200],[390,844,2,true,0],[375,667,2,true,0]]){
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:d,mobile:m},sid);
  if (w===1931||w===390){ await send('Page.navigate',{url:URL},sid); await waitEvent('Page.loadEventFired',sid); await sleep(5000); }
  await vp(w,h,d,m); const v=await ev(M10); out[w+'x'+h]=v;
  console.log(`${w}x${h}: mask ${v.maskBox} kaart ${v.kaart.breedte} breed past=${v.kaart.past} eindigt ${v.kaart.onder} | hero ${v.hero} band ${v.band} strook ${v.strook} link ${v.link} introKop ${v.introKop} foto ${v.foto} | prijs tot ${v.prijsOnder} (${v.prijsOnder<=h?'boven vouw':'ONDER'}) | pseudo ${v.pseudo.content} ${v.pseudo.size} ${v.pseudo.pos}`);
  if (lang){ await shot(`contour-heel-${w}-lang`,{x:0,y:0,width:w,height:lang,scale:1}); }
}
fs.writeFileSync(`${OUT}/metingen-na10.json`,JSON.stringify(out,null,1));
await send('Browser.close'); chrome.kill(); process.exit(0);
