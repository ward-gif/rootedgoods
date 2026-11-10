import { spawn } from 'node:child_process';
import fs from 'node:fs';
const S='/private/tmp/claude-501/-Users-wardhaarsma-Documents-Rooted-goods-rootedgoods-website/302525f1-e8a1-40ff-8804-7ec203a6d5e7/scratchpad';
const BIN=process.env.HOME+'/Library/Caches/ms-playwright/chromium_headless_shell-1234/chrome-headless-shell-mac-arm64/chrome-headless-shell';
const URL='file://'+S.replace(/ /g,'%20')+'/pagina/replica-na.html';
const OUT=S+'/metingen-na3'; fs.mkdirSync(OUT,{recursive:true});
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
const logs=[]; events.length=0;
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true},sid);
await send('Page.navigate',{url:URL},sid); await waitEvent('Page.loadEventFired',sid); await sleep(4000);
const M=`(()=>{const q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
 const r=el=>{if(!el)return null;const b=el.getBoundingClientRect();return {x:+b.x.toFixed(1),y:+(b.y+scrollY).toFixed(1),w:+b.width.toFixed(1),h:+b.height.toFixed(1)};};
 const cs=(el,p)=>{if(!el)return null;const c=getComputedStyle(el);const o={};p.forEach(k=>o[k]=c.getPropertyValue(k));return o;};
 const regels=el=>{if(!el)return null;const out=[];const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);let n,cur=null,last=null;while(n=w.nextNode()){const s=n.textContent;const re=/[^\\s\\u00a0]+(?:\\u00a0[^\\s\\u00a0]+)*/g;let m;while(m=re.exec(s)){const rg=document.createRange();rg.setStart(n,m.index);rg.setEnd(n,m.index+m[0].length);const rr=rg.getClientRects()[0];if(!rr)continue;const top=Math.round(rr.top);if(last===null||Math.abs(top-last)>4){cur=[];out.push(cur);last=top;}cur.push(m[0].replace(/\\u00a0/g,' '));}}return out.map(x=>x.join(' '));};
 const hero=q('.rg-page-hero--band'),title=q('.rg-page-hero__title'),feiten=q('.rg-page-hero__feiten'),noot=q('.rg-page-hero__noot'),btn=q('.rg-page-hero__cta .btn'),logos=q('.rg-page-hero__logos'),band=q('.rg-band'),meer=q('.rg-band__meer');
 const cm=q('.container-main'); const cp=q('.cms-page'); let tussen=[]; let el=cp&&cp.previousElementSibling; while(el){tussen.push({tag:el.tagName,cls:[...el.classList].join('.'),h:el.getBoundingClientRect().height,display:getComputedStyle(el).display});el=el.previousElementSibling;}
 return {vw:innerWidth,vh:innerHeight,scrollW:document.scrollingElement.scrollWidth,
  containerMain:{rect:r(cm),pt:cs(cm,['padding-top'])},cmsPageY:cp&&r(cp).y,voorCmsPage:tussen,
  hero:r(hero),heroPad:cs(hero,['padding-top','padding-bottom']),
  title:{rect:r(title),regels:regels(title),...cs(title,['font-size','font-weight','letter-spacing','color']),strong:cs(title.querySelector('strong'),['font-weight','color'])},
  feiten:{rect:r(feiten),regels:regels(feiten),...cs(feiten,['font-size','line-height','display','color'])},
  btn:{rect:r(btn),text:btn.textContent.trim(),...cs(btn,['font-size','padding'])},
  noot:{rect:r(noot),regels:regels(noot),...cs(noot,['font-size','line-height','color'])},
  logos:{rect:r(logos),imgs:qa('.rg-page-hero__logos img').map(i=>({alt:i.alt,w:+i.getBoundingClientRect().width.toFixed(1),h:+i.getBoundingClientRect().height.toFixed(1),display:getComputedStyle(i).display}))},
  band:{rect:r(band),eersteTegels:qa('.rg-band .product-box').slice(0,4).map(b=>({y:+(b.getBoundingClientRect().top+scrollY).toFixed(1),h:+b.getBoundingClientRect().height.toFixed(1)})),prijzen:qa('.rg-band .rg-band__item .product-price').map(p=>p.textContent.trim()),wrapperTekst:q('.rg-band .product-price-wrapper')?.textContent.replace(/\\s+/g,' ').trim()},
  meer:{rect:r(meer),...cs(meer,['color','margin-left','display'])},
  strook:(()=>{const st=q('.rg-page-hero__strook');return st?{rect:r(st),hidden:st.hasAttribute('hidden'),regels:regels(st),ouder:st.parentElement.className,volgende:st.nextElementSibling&&st.nextElementSibling.className}:null;})(),
  prijsOnder:Math.max(...qa('.rg-band .product-box').slice(0,8).map(b=>{const p=b.querySelector('.product-price');return p?p.getBoundingClientRect().bottom+scrollY:0;})),
  tegelOnder:Math.max(...qa('.rg-band .product-box').slice(0,8).map(b=>b.getBoundingClientRect().bottom+scrollY)),
  tegelBreedte:(q('.rg-band .product-box')||{}).getBoundingClientRect?.().width,
  titles:qa('.rg-band [title]').length,
  volgende:r(q('.rg-block-title__title'))};})()`;
const out={};
for (const [w,h,d,m] of [[390,844,2,true],[375,667,2,true],[1280,800,1,false],[1440,900,1,false],[1931,1112,1,false]]){
  await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:d,mobile:m},sid); await sleep(700);
  await send('Runtime.evaluate',{expression:'scrollTo(0,0)'},sid); await sleep(200);
  const {result}=await send('Runtime.evaluate',{expression:M,returnByValue:true},sid); out[w+'x'+h]=result.value;
  const v=result.value; console.log(`${w}x${h}: prijsOnder ${v.prijsOnder.toFixed(0)} tegelOnder ${v.tegelOnder.toFixed(0)} tegelB ${v.tegelBreedte} titles ${v.titles} strook ${v.strook?v.strook.rect.y+' '+JSON.stringify(v.strook.regels)+' hidden='+v.strook.hidden+' na='+v.strook.volgende:'-'} | hero ${v.hero.y}-${(v.hero.y+v.hero.h).toFixed(0)} (${v.hero.h}) | band y ${v.band.rect.y} | kop ${v.title['font-size']} w${v.title['font-weight']} ${JSON.stringify(v.title.regels)} | feiten ${v.feiten['font-size']} ${JSON.stringify(v.feiten.regels)} | noot ${v.noot.regels.length} regels | knop ${v.btn.rect.w}x${v.btn.rect.h} | logos ${v.logos.imgs.filter(i=>i.display!=='none').map(i=>i.w+'x'+i.h).join(',')} | meer x ${v.meer.rect&&v.meer.rect.x} ${v.meer.color} | cmsPageY ${v.cmsPageY} voor: ${JSON.stringify(v.voorCmsPage)}`);
  const shot=await send('Page.captureScreenshot',{format:'png'},sid); fs.writeFileSync(`${OUT}/na-${w}x${h}.png`,Buffer.from(shot.data,'base64'));
  if (m){const tall=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{x:0,y:0,width:w,height:1500,scale:1}},sid); fs.writeFileSync(`${OUT}/na-${w}-lang.png`,Buffer.from(tall.data,'base64'));}
}
console.log('prijzen:',out['390x844'].band.prijzen.join(' | '),'| wrapper:',out['390x844'].band.wrapperTekst);
fs.writeFileSync(`${OUT}/metingen-na.json`,JSON.stringify(out,null,1));
await send('Browser.close'); chrome.kill(); process.exit(0);
