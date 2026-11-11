// Draait in de pagina. Vervangt de .min-link door een <style> met de gemarkeerde CSS (elke regel draagt --rg-l:<regelnr>),
// haalt per !important-longhand het !important weg en kijkt of de berekende stijl van een passend element verandert.
(async (CSS_TEXT, OPTIES) => {
  const link = document.querySelector('link[href*="rootedgoods.min.css"]');
  if (!link) return { fout: 'rootedgoods.min.css-link niet gevonden' };
  const st = document.createElement('style'); st.id = 'rg-meet'; st.textContent = CSS_TEXT;
  link.parentNode.insertBefore(st, link); link.remove();
  const kill = document.createElement('style'); kill.textContent = '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}';
  document.head.appendChild(kill);
  await new Promise(r => setTimeout(r, 300));
  const PSEUDO = /(::?(?:before|after|marker|placeholder|first-line|first-letter|selection|-webkit-[a-z-]+|-moz-[a-z-]+))+$/i;
  const delen = s => { const uit = []; let d = 0, b = '', q = ''; for (const c of s) { if (q) { b += c; if (c === q) q = ''; continue; } if (c === '"' || c === "'") { q = c; b += c; continue; } if (c === '(' || c === '[') d++; if (c === ')' || c === ']') d--; if (c === ',' && d === 0) { uit.push(b.trim()); b = ''; } else b += c; } if (b.trim()) uit.push(b.trim()); return uit; };
  const uit = []; let regels = 0;
  const lijst = [];
  const loop = (rules, actief) => { for (const r of rules) {
    if (r.type === 1) lijst.push([r, actief]);
    else if (r.type === 4) loop(r.cssRules, actief && matchMedia(r.conditionText || r.media.mediaText).matches);
    else if (r.type === 12) loop(r.cssRules, actief && CSS.supports(r.conditionText));
    else if (r.cssRules && r.type !== 7) loop(r.cssRules, actief);
  } };
  loop(st.sheet.cssRules, true);
  for (const [rule, actief] of lijst) {
    const sty = rule.style; const l = Number(sty.getPropertyValue('--rg-l')); if (!l) continue; regels++;
    const props = []; for (let i = 0; i < sty.length; i++) { const n = sty[i]; if (n.startsWith('--')) continue; if (sty.getPropertyPriority(n) === 'important') props.push(n); }
    if (!props.length) continue;
    const delenSel = delen(rule.selectorText);
    let doelen = [];
    if (actief) for (const s of delenSel) {
      let pseudo = null, kaal = s; const m = s.match(PSEUDO); if (m) { pseudo = m[0]; kaal = s.slice(0, -pseudo.length) || '*'; }
      let els = []; try { els = [...document.querySelectorAll(kaal)].slice(0, 8); } catch (e) { continue; }
      for (const el of els) doelen.push([el, pseudo]);
      if (doelen.length >= 24) break;
    }
    for (const p of props) {
      const o = { l, p };
      if (/^(transition|animation)/.test(p)) { o.st = 'niet-meetbaar'; uit.push(o); continue; }
      if (!actief) { o.st = 'media-uit'; uit.push(o); continue; }
      if (!doelen.length) { o.st = 'geen-match'; uit.push(o); continue; }
      const waarde = sty.getPropertyValue(p);
      const voor = doelen.map(([el, ps]) => getComputedStyle(el, ps).getPropertyValue(p));
      sty.setProperty(p, waarde, '');
      const na = doelen.map(([el, ps]) => getComputedStyle(el, ps).getPropertyValue(p));
      sty.setProperty(p, waarde, 'important');
      o.n = doelen.length;
      const k = voor.findIndex((v, i) => v !== na[i]);
      if (k >= 0) { o.st = 'nodig'; o.d = voor[k].slice(0, 40) + ' -> ' + na[k].slice(0, 40); }
      else o.st = 'gelijk';
      uit.push(o);
    }
  }
  return { regels, metingen: uit };
})
