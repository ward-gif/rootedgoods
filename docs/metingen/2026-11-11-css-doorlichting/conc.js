// In de pagina: zet CSS (gemarkeerd) neer, zoekt per (regel, eigenschap) het eerste element waarop het !important verschil maakt,
// en markeert het met data-rg-n="<regel>|<eigenschap>". Geeft terug welke gemarkeerd zijn.
(async (CSS_TEXT, ITEMS) => {
  const link = document.querySelector('link[href*="rootedgoods.min.css"]'); if (!link) return { fout: 'geen link' };
  const st = document.createElement('style'); st.id = 'rg-meet'; st.textContent = CSS_TEXT; link.parentNode.insertBefore(st, link); link.remove();
  const kill = document.createElement('style'); kill.textContent = '*,*::before,*::after{transition:none!important;animation-play-state:paused!important}'; document.head.appendChild(kill);
  await new Promise(r => setTimeout(r, 300));
  const PSEUDO = /(::?(?:before|after|marker|placeholder|first-line|first-letter|selection|-webkit-[a-z-]+|-moz-[a-z-]+))+$/i;
  const delen = s => { const uit = []; let d = 0, b = '', q = ''; for (const c of s) { if (q) { b += c; if (c === q) q = ''; continue; } if (c === '"' || c === "'") { q = c; b += c; continue; } if (c === '(' || c === '[') d++; if (c === ')' || c === ']') d--; if (c === ',' && d === 0) { uit.push(b.trim()); b = ''; } else b += c; } if (b.trim()) uit.push(b.trim()); return uit; };
  const regels = {}; const loop = rs => { for (const r of rs) { if (r.type === 1) { const l = r.style.getPropertyValue('--rg-l'); if (l) (regels[l] = regels[l] || []).push(r); } else if (r.cssRules && r.type !== 7) loop(r.cssRules); } }; loop(st.sheet.cssRules);
  const uit = [];
  for (const [l, p] of ITEMS) {
    const rule = (regels[l] || [])[0]; if (!rule) { uit.push({ l, p, st: 'regel-niet-gevonden' }); continue; }
    let gemerkt = false;
    for (const s of delen(rule.selectorText)) {
      if (PSEUDO.test(s)) continue; let els = []; try { els = [...document.querySelectorAll(s)].slice(0, 12); } catch (e) { continue; }
      for (const el of els) {
        const w = rule.style.getPropertyValue(p); const v = getComputedStyle(el).getPropertyValue(p);
        rule.style.setProperty(p, w, ''); const n = getComputedStyle(el).getPropertyValue(p); rule.style.setProperty(p, w, 'important');
        if (v !== n) { el.setAttribute('data-rg-n', (el.getAttribute('data-rg-n') ? el.getAttribute('data-rg-n') + ' ' : '') + l + '|' + p + '|' + delen(rule.selectorText).indexOf(s)); gemerkt = true; uit.push({ l, p, st: 'gemerkt', mijn: v, zonder: n, el: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '') }); break; }
      }
      if (gemerkt) break;
    }
    if (!gemerkt) uit.push({ l, p, st: 'geen-verschil-hier' });
  }
  return uit;
})
