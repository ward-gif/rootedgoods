import { spawn } from 'node:child_process';
import fs from 'node:fs';
const S='/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL='file://'+S.replace(/ /g,'%20')+'/pagina/replica.html';
const OUT=S+'/metingen'; 
const chrome=spawn(BIN,['--headless','--remote-debugging-port=0','--hide-scrollbars','--no-first-run','--user-data-dir='+S+'/werk/profiel','--window-size=1931,1112','--lang=nl-NL','about:blank']);
const wsUrl=await new Promise((res,rej)=>{let buf='';chrome.stderr.on('data',d=>{buf+=d;const m=buf.match(/DevTools listening on (ws:\/\/\S+)/);if(m)res(m[1]);});setTimeout(()=>rej(new Error('geen devtools-url')),15000);});
const ws=new WebSocket(wsUrl); await new Promise(r=>ws.onopen=r);
let id=0; const pending=new Map(); const events=[];
ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){const {res,rej}=pending.get(m.id);pending.delete(m.id); m.error?rej(new Error(JSON.stringify(m.error))):res(m.result);} else events.push(m);};
const send=(method,params={},sessionId)=>new Promise((res,rej)=>{const i=++id;pending.set(i,{res,rej});ws.send(JSON.stringify({id:i,method,params,sessionId}));});
const waitEvent=(name,sid,timeout=60000)=>new Promise((res,rej)=>{const t0=Date.now();const iv=setInterval(()=>{const k=events.findIndex(m=>m.method===name&&(!sid||m.sessionId===sid));if(k>=0){clearInterval(iv);res(events.splice(k,1)[0]);}else if(Date.now()-t0>timeout){clearInterval(iv);rej(new Error('timeout '+name));}},50);});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const {targetId}=await send('Target.createTarget',{url:'about:blank'});
const {sessionId:sid}=await send('Target.attachToTarget',{targetId,flatten:true});
await send('Page.enable',{},sid); await send('Runtime.enable',{},sid);
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true},sid);
await send('Page.navigate',{url:URL},sid); await waitEvent('Page.loadEventFired',sid); await sleep(3500);
// varianten: [naam, css, titelHTML]
const KOP_NU='Kerstpakketten met jouw logo, van Europese makers';
const KOP_NBSP='Kerstpakketten met jouw&nbsp;logo, van Europese&nbsp;makers';
const KOP_B='Kerstpakketten met jouw logo<br>Van makers die je kunt bellen';
const KOP_ACC='Kerstpakketten met <em>jouw logo</em>, van Europese makers';
const W400='.rg-page-hero--band .rg-page-hero__title{font-weight:400!important;letter-spacing:-0.01em!important} .rg-page-hero--band .rg-page-hero__title strong{font-weight:700;letter-spacing:-0.021em}';
const V=[
 ['w400 accent Europese makers', W400, 'Kerstpakketten met jouw&nbsp;logo, van <strong>Europese&nbsp;makers</strong>'],
 ['w400 accent jouw logo', W400, 'Kerstpakketten met <strong>jouw&nbsp;logo</strong>, van Europese&nbsp;makers'],
 ['w400 64px accent Europese makers', W400+' .rg-page-hero--band .rg-page-hero__title{font-size:clamp(2.25rem,1.1rem + 3.4vw,4rem)!important}', 'Kerstpakketten met jouw&nbsp;logo, van <strong>Europese&nbsp;makers</strong>'],
 ['w500 36/64px accent Europese makers', W400.replace('font-weight:400','font-weight:500')+' .rg-page-hero--band .rg-page-hero__title{font-size:clamp(2.25rem,1.1rem + 3.4vw,4rem)!important}', 'Kerstpakketten met jouw&nbsp;logo, van <strong>Europese&nbsp;makers</strong>'],
];
const METING=`(()=>{const t=document.querySelector('.rg-page-hero__title');const h=document.querySelector('.rg-page-hero--band');const b=document.querySelector('.rg-band');const c=getComputedStyle(t);
 const regels=el=>{const out=[];const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,cur=null,lastTop=null;while(n=walker.nextNode()){const s=n.textContent;const re=/[^\\s\\u00a0]+(?:\\u00a0[^\\s\\u00a0]+)*/g;let m;while(m=re.exec(s)){const rg=document.createRange();rg.setStart(n,m.index);rg.setEnd(n,m.index+m[0].length);const rr=rg.getClientRects()[0];if(!rr)continue;const top=Math.round(rr.top);if(lastTop===null||Math.abs(top-lastTop)>4){cur=[];out.push(cur);lastTop=top;}cur.push(m[0].replace(/\\u00a0/g,' '));}}return out.map(w=>w.join(' '));};
 const em=t.querySelector('strong');
 return {font:c.fontSize,weight:c.fontWeight,lh:c.lineHeight,titelH:+t.getBoundingClientRect().height.toFixed(1),titelW:+t.getBoundingClientRect().width.toFixed(1),regels:regels(t),heroH:+h.getBoundingClientRect().height.toFixed(1),bandY:+(b.getBoundingClientRect().top+scrollY).toFixed(1),em:em?{color:getComputedStyle(em).color,weight:getComputedStyle(em).fontWeight,transform:getComputedStyle(em).transform}:null};})()`;
const out={};
for (const [naam,css,kop] of V){
  await send('Runtime.evaluate',{expression:`(()=>{let s=document.getElementById('rg-variant');if(!s){s=document.createElement('style');s.id='rg-variant';document.head.appendChild(s);}s.textContent=${JSON.stringify(css)};document.querySelector('.rg-page-hero__title').innerHTML=${JSON.stringify(kop)};})()`},sid);
  out[naam]={};
  for (const [w,h,dpr,mob] of [[390,844,2,true],[1280,800,1,false],[1931,1112,1,false]]){
    await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dpr,mobile:mob},sid); await sleep(500);
    const {result}=await send('Runtime.evaluate',{expression:METING,returnByValue:true},sid);
    out[naam][w]=result.value;
    console.log(naam.padEnd(26),w,result.value.font,'regels',result.value.regels.length,JSON.stringify(result.value.regels),'titelH',result.value.titelH,'heroH',result.value.heroH,'bandY',result.value.bandY, result.value.em?('em '+result.value.em.color+' '+result.value.em.weight):'');
    if (true){const shot=await send('Page.captureScreenshot',{format:'png'},sid);fs.writeFileSync(`${OUT}/variant-${naam.replace(/[^a-z0-9]+/gi,'_')}-${w}.png`,Buffer.from(shot.data,'base64'));}
  }
}
fs.writeFileSync(`${OUT}/gewichtvarianten.json`,JSON.stringify(out,null,1));
await send('Browser.close'); chrome.kill(); process.exit(0);
