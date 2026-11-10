import { spawn } from 'node:child_process';
import fs from 'node:fs';
const S='/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL='file://'+S.replace(/ /g,'%20')+'/pagina/replica.html';
const OUT=S+'/metingen'; fs.mkdirSync(OUT,{recursive:true});
const VIEWPORTS=[[390,844,2,true],[360,780,2,true],[414,896,2,true],[520,953,1,false],[992,900,1,false],[1440,900,1,false],[1738,1001,1,false]];
const chrome=spawn(BIN,['--headless','--remote-debugging-port=0','--hide-scrollbars','--no-first-run','--user-data-dir='+S+'/werk/profiel','--window-size=1738,1001','--lang=nl-NL','about:blank']);
const wsUrl=await new Promise((res,rej)=>{let buf='';chrome.stderr.on('data',d=>{buf+=d;const m=buf.match(/DevTools listening on (ws:\/\/\S+)/);if(m)res(m[1]);});setTimeout(()=>rej(new Error('geen devtools-url: '+buf)),15000);});
const ws=new WebSocket(wsUrl); await new Promise(r=>ws.onopen=r);
let id=0; const pending=new Map(); const events=[];
ws.onmessage=e=>{const m=JSON.parse(e.data); if(m.id&&pending.has(m.id)){const {res,rej}=pending.get(m.id);pending.delete(m.id); m.error?rej(new Error(JSON.stringify(m.error))):res(m.result);} else events.push(m);};
const send=(method,params={},sessionId)=>new Promise((res,rej)=>{const i=++id;pending.set(i,{res,rej});ws.send(JSON.stringify({id:i,method,params,sessionId}));});
const waitEvent=(name,sid,timeout=30000)=>new Promise((res,rej)=>{const t0=Date.now();const iv=setInterval(()=>{const k=events.findIndex(m=>m.method===name&&(!sid||m.sessionId===sid));if(k>=0){clearInterval(iv);res(events.splice(k,1)[0]);}else if(Date.now()-t0>timeout){clearInterval(iv);rej(new Error('timeout '+name));}},50);});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const {targetId}=await send('Target.createTarget',{url:'about:blank'});
const {sessionId:sid}=await send('Target.attachToTarget',{targetId,flatten:true});
await send('Page.enable',{},sid); await send('Runtime.enable',{},sid);
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true},sid);
await send('Page.navigate',{url:URL},sid);
await waitEvent('Page.loadEventFired',sid,60000);
await sleep(4000);
const METING=`(()=>{
 const q=s=>document.querySelector(s); const qa=s=>[...document.querySelectorAll(s)];
 const r=el=>{if(!el)return null;const b=el.getBoundingClientRect();return {x:+b.x.toFixed(1),y:+(b.y+window.scrollY).toFixed(1),w:+b.width.toFixed(1),h:+b.height.toFixed(1)};};
 const cs=(el,props)=>{if(!el)return null;const c=getComputedStyle(el);const o={};props.forEach(p=>o[p]=c.getPropertyValue(p));return o;};
 const lines=el=>{if(!el)return null;const c=getComputedStyle(el);const lh=parseFloat(c.lineHeight);return +(el.getBoundingClientRect().height/lh).toFixed(2);};
 const hero=q('.rg-page-hero--band'); const title=q('.rg-page-hero__title'); const feiten=q('.rg-page-hero__feiten'); const vraag=q('.rg-page-hero__vraag'); const btn=q('.rg-page-hero__cta .btn'); const logos=q('.rg-page-hero__logos');
 const band=q('.rg-band'); const meer=q('.rg-band__meer'); const header=q('header.header-main')||q('.header-main'); const topbar=q('.top-bar')||q('.rg-topbar')||q('.header-top')||null;
 const fixed=qa('body *').filter(e=>{const p=getComputedStyle(e).position;return (p==='fixed'||p==='sticky')&&e.getBoundingClientRect().height>20&&e.getBoundingClientRect().top<200;}).slice(0,4).map(e=>({sel:e.tagName+'.'+[...e.classList].slice(0,3).join('.'),rect:r(e),pos:getComputedStyle(e).position}));
 const main=q('.content-main')||q('main');
 const boxes=qa('.rg-band .product-box').slice(0,12).map(b=>({rect:r(b),naam:(b.querySelector('.product-name')||{}).textContent?.trim(),y1:b.closest('.product-slider-item')?.className}));
 const naam=q('.rg-band .product-name'); const prijs=q('.rg-band .product-price');
 const next=q('.rg-block-title__title');
 return {
  vw:innerWidth,vh:innerHeight,dpr:devicePixelRatio,scrollW:document.scrollingElement.scrollWidth,clientW:document.documentElement.clientWidth,
  bandPagina:document.documentElement.classList.contains('rg-band-pagina'),
  fontsOk:{playfair700:document.fonts.check('700 16px "Playfair Display"'),montserrat:document.fonts.check('600 16px Montserrat')},
  fixed, main:r(main), mainPaddingTop:cs(main,['padding-top','margin-top']),
  hero:r(hero), heroPad:cs(hero,['padding-top','padding-bottom','padding-left','padding-right','text-align']),
  title:{rect:r(title),lines:lines(title),text:title?.textContent.trim(),...cs(title,['font-size','line-height','font-weight','letter-spacing','color','max-width','font-family'])},
  feiten:{rect:r(feiten),...cs(feiten,['font-size','line-height','color','gap','margin-bottom']),items:qa('.rg-page-hero__feiten li').map(li=>({rect:r(li),text:li.textContent.trim(),strong:cs(li.querySelector('strong'),['color','font-weight'])}))},
  vraag:{rect:r(vraag),lines:lines(vraag),...cs(vraag,['font-size','line-height','color','max-width','margin-bottom'])},
  btn:{rect:r(btn),text:btn?.textContent.trim(),...cs(btn,['font-size','padding','background-color','color','border-radius','box-shadow'])},
  ctaMargin:cs(q('.rg-page-hero__cta'),['margin-bottom']),
  logos:{rect:r(logos),imgs:qa('.rg-page-hero__logos img').map(i=>({alt:i.alt,rect:r(i),display:getComputedStyle(i).display,opacity:getComputedStyle(i).opacity,natural:[i.naturalWidth,i.naturalHeight]}))},
  band:{rect:r(band),tile:cs(band,['--rg-band-tile','--rg-band-gap','--rg-band-inzet','padding']),anim:cs(q('.rg-band .product-slider-container'),['animation','animation-play-state','transform']),n:qa('.rg-band .product-slider-item').length,boxes,
    naam:cs(naam,['font-size','color','letter-spacing','font-weight','min-height']),prijs:cs(prijs,['font-size','color','font-weight']),prijsTekst:prijs?.textContent.trim()},
  catHead:cs(q('.rg-cat-head'),['display']),
  meer:{rect:r(meer),text:meer?.textContent.trim(),...cs(meer,['font-size','color','margin-left'])},
  next:{rect:r(next),text:next?.textContent.trim()},
  nextAfterMeer: (()=>{if(!meer)return null; let el=meer.closest('.cms-section')?.nextElementSibling; return el?{sel:el.className,rect:r(el)}:null;})()
 };})()`;
const resultaten={};
for (const [w,h,dpr,mobile] of VIEWPORTS){
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dpr,mobile},sid);
  await sleep(900);
  await send('Runtime.evaluate',{expression:'window.scrollTo(0,0)'},sid);
  await sleep(300);
  const {result}=await send('Runtime.evaluate',{expression:METING,returnByValue:true},sid);
  resultaten[w+'x'+h]=result.value;
  const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false},sid);
  fs.writeFileSync(`${OUT}/replica-${w}x${h}.png`,Buffer.from(shot.data,'base64'));
  if (mobile){
    const tall=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:w,height:1700,scale:1}},sid);
    fs.writeFileSync(`${OUT}/replica-${w}-lang.png`,Buffer.from(tall.data,'base64'));
  }
  console.log('klaar',w,'x',h,'hero h',result.value?.hero?.h,'band y',result.value?.band?.rect?.y,'titelregels',result.value?.title?.lines);
}
fs.writeFileSync(`${OUT}/metingen.json`,JSON.stringify(resultaten,null,1));
await send('Browser.close'); chrome.kill(); process.exit(0);
